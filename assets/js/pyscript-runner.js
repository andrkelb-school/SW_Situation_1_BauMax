/**
 * BauMax Learning Platform - PyScript Runner Engine
 * 
 * Funktionen:
 * - Python Code Ausführung im Browser
 * - Output Capture & Display
 * - Error Handling & Debugging
 * - Test Case Management
 * - Progress Tracking
 * - Code Validation
 * 
 * @version 1.0.0
 * @requires PyScript 2024+
 */

class PyScriptRunner {
  constructor(options = {}) {
    this.options = {
      containerId: options.containerId || 'pyscript_container',
      editorId: options.editorId || 'code_editor',
      outputId: options.outputId || 'output_container',
      theme: options.theme || 'dracula',
      pythonVersion: options.pythonVersion || '3.11',
      timeout: options.timeout || 30000, // 30 Sekunden
      ...options
    };

    this.container = null;
    this.editor = null;
    this.output = null;
    this.isRunning = false;
    this.executionHistory = [];
    this.testResults = [];
    this.currentCode = '';
    this.pyodideReady = false;
    this.stdoutBuffer = [];
    this.stderrBuffer = [];

    this.init();
  }

  /**
   * Initialisierung
   */
  async init() {
    console.log('🐍 PyScript Runner v1.0.0 initializing...');
    
    try {
      this.setupUI();
      this.log('info', '⏳ Laden von Pyodide (bis zu 30 Sekunden beim ersten Mal)...');
      
      // Laden von Pyodide (Pyodide = CPython in WebAssembly)
      await this.loadPyodide();
      this.attachEventListeners();
      
      console.log('✅ PyScript Runner ready!');
      this.log('success', '✅ Python-Umgebung bereit! Code kann jetzt ausgeführt werden.');
    } catch (error) {
      console.error('❌ PyScript Initialization failed:', error);
      this.log('error', `Initialisierungsfehler: ${error.message}`);
    }
  }

  /**
   * Lade Pyodide (Python in WebAssembly)
   */
  async loadPyodide() {
    if (window.pyodide_ready && window.pyodide) {
      this.pyodideReady = true;
      console.log('✓ Pyodide bereits im Cache');
      return;
    }

    try {
      // Dynamisch Pyodide Script laden
      const scriptUrl = `https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js`;
      
      console.log('📥 Lade Pyodide CDN...');
      
      // Verwende Promise für Script-Laden mit Timeout
      await Promise.race([
        new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = scriptUrl;
          script.async = true;
          script.onload = resolve;
          script.onerror = () => reject(new Error('Pyodide Script konnte nicht geladen werden'));
          document.head.appendChild(script);
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Pyodide Timeout (>60s)')), 60000)
        )
      ]);

      console.log('✓ Pyodide Script geladen, initialisiere...');
      
      // Initialisiere Pyodide
      const pyodide = await globalThis.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/'
      });
      
      window.pyodide = pyodide;
      window.pyodide_ready = true;
      this.pyodideReady = true;
      
      console.log('✅ Pyodide v' + pyodide.version + ' ready');
    } catch (error) {
      console.error('❌ Fehler beim Laden von Pyodide:', error);
      this.log('error', `Pyodide Fehler: ${error.message}`);
      throw error;
    }
  }

  /**
   * Richte UI auf
   */
  setupUI() {
    this.container = document.getElementById(this.options.containerId);
    if (!this.container) {
      throw new Error(`Container ${this.options.containerId} nicht gefunden`);
    }

    // Erstelle Editor und Output Container falls nicht vorhanden
    if (!document.getElementById(this.options.editorId)) {
      const editor = document.createElement('div');
      editor.id = this.options.editorId;
      editor.className = 'pyscript-editor';
      this.container.appendChild(editor);
    }

    if (!document.getElementById(this.options.outputId)) {
      const output = document.createElement('div');
      output.id = this.options.outputId;
      output.className = 'pyscript-output';
      this.container.appendChild(output);
    }

    this.editor = document.getElementById(this.options.editorId);
    this.output = document.getElementById(this.options.outputId);
  }

  /**
   * Attach Event Listeners
   */
  attachEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter oder Cmd+Enter zum Ausführen
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      }
    });
  }

  /**
   * Führe Python-Code aus
   */
  async runCode(code = null) {
    if (!this.pyodideReady) {
      this.log('error', 'Pyodide ist noch nicht geladen. Bitte warten...');
      console.error('Pyodide not ready. window.pyodide:', window.pyodide);
      return;
    }

    if (this.isRunning) {
      this.log('warning', 'Code wird bereits ausgeführt. Bitte warten...');
      return;
    }

    code = code || this.getCurrentCode();
    if (!code.trim()) {
      this.log('warning', 'Kein Code zum Ausführen vorhanden');
      return;
    }

    this.isRunning = true;
    this.clearOutput();

    const startTime = performance.now();
    const executionId = Date.now();

    try {
      this.log('info', '⏳ Code wird ausgeführt...');

      const pyodide = window.pyodide;
      if (!pyodide) {
        throw new Error('Pyodide nicht verfügbar');
      }

      // Schreibe User-Code mit print-Umleitung
      // Wichtig: Führe User-Code direkt aus, nicht in try-block wrapper
      const wrappedCode = `
import sys
from io import StringIO

_output_buffer = StringIO()
_original_stdout = sys.stdout
sys.stdout = _output_buffer

try:
${this.indentCode(code, 4)}
except Exception as e:
    import traceback
    traceback.print_exc()

sys.stdout = _original_stdout
_captured_output = _output_buffer.getvalue()
_captured_output
`;

      console.log('🔧 Wrapped Code:', wrappedCode);

      // Führe aus
      let result;
      try {
        result = pyodide.runPython(wrappedCode);
      } catch (e) {
        // Falls synchrone Variante fehlschlägt, versuche async
        result = await pyodide.runPythonAsync(wrappedCode);
      }

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      // Output anzeigen (als ein Block, ohne zusätzliche Leerzeilen)
      const outputStr = String(result || '');
      if (outputStr.trim()) {
        this.log('output', outputStr);
      } else {
        this.log('info', '[keine Ausgabe]');
      }

      // History
      this.executionHistory.push({
        id: executionId,
        code,
        result: outputStr,
        duration,
        timestamp: new Date().toISOString(),
        status: 'success'
      });

      this.log('success', `✅ Erfolgreich (${duration}ms)`);

    } catch (error) {
      console.error('❌ Execution Error:', error);
      this.log('error', `❌ Fehler: ${error.message}`);
      
      this.executionHistory.push({
        id: executionId,
        code,
        error: error.message,
        timestamp: new Date().toISOString(),
        status: 'error'
      });
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Rücke Code ein (für Python)
   */
  indentCode(code, spaces = 4) {
    const indent = ' '.repeat(spaces);
    return code
      .split('\n')
      .map(line => indent + line)
      .join('\n');
  }

  /**
   * Hole aktuellen Code
   */
  getCurrentCode() {
    if (this.editor instanceof HTMLTextAreaElement || 
        this.editor instanceof HTMLInputElement) {
      return this.editor.value;
    }
    return this.editor.textContent || '';
  }

  /**
   * Setze Code
   */
  setCode(code) {
    if (this.editor instanceof HTMLTextAreaElement || 
        this.editor instanceof HTMLInputElement) {
      this.editor.value = code;
    } else {
      this.editor.textContent = code;
    }
    this.currentCode = code;
  }

  /**
   * Führe Tests durch
   */
  async runTests(testCases) {
    if (!Array.isArray(testCases) || testCases.length === 0) {
      this.log('warning', 'Keine Test-Cases vorhanden');
      return;
    }

    this.log('info', `🧪 Starte ${testCases.length} Tests...`);
    this.testResults = [];

    let passed = 0;
    let failed = 0;

    for (const test of testCases) {
      try {
        // Führe Test-Code aus
        const result = await window.pyodide.runPythonAsync(test.code);
        
        // Prüfe Ergebnis
        const testPassed = result === test.expected || 
                          String(result) === String(test.expected);

        if (testPassed) {
          passed++;
          this.log('success', `✅ ${test.name}`);
        } else {
          failed++;
          this.log('error', `❌ ${test.name}`);
          this.log('error', `   Erwartet: ${test.expected}, Erhalten: ${result}`);
        }

        this.testResults.push({
          name: test.name,
          passed: testPassed,
          expected: test.expected,
          result
        });

      } catch (error) {
        failed++;
        this.log('error', `❌ ${test.name} - ${error.message}`);
        this.testResults.push({
          name: test.name,
          passed: false,
          error: error.message
        });
      }
    }

    // Zusammenfassung
    const percentage = ((passed / testCases.length) * 100).toFixed(0);
    this.log('info', `\n📊 Test-Ergebnisse: ${passed}/${testCases.length} bestanden (${percentage}%)`);

    return {
      passed,
      failed,
      total: testCases.length,
      percentage
    };
  }

  /**
   * Validiere Code-Syntax
   */
  validateSyntax(code) {
    try {
      // Verwende AST-Parsing
      const pyodide = window.pyodide;
      const result = pyodide.runPython(`
import ast
try:
    ast.parse('''${code}''')
    'valid'
except SyntaxError as e:
    f'Error: {e.msg} at line {e.lineno}'
`);
      return {
        valid: result === 'valid',
        message: result
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message
      };
    }
  }

  /**
   * Lösche Output
   */
  clearOutput() {
    if (this.output) {
      this.output.innerHTML = '';
    }
  }

  /**
   * Schreibe Log
   */
  log(type, message) {
    // Only show pure program output in UI; other types go to console
    if (type !== 'output') {
      const prefix = type.toUpperCase();
      // Keep developer visibility via console
      if (type === 'error') console.error(message);
      else if (type === 'warning') console.warn(message);
      else console.log(`${prefix}: ${message}`);
      return;
    }

    if (!this.output) return;

    const logEntry = document.createElement('pre');
    logEntry.className = 'log-entry log-output';
    // Force white text for readability as requested
    logEntry.style.cssText = 'margin: 0; color: #ffffff; font-family: monospace; white-space: pre-wrap; word-break: break-word;';
    logEntry.textContent = message.replace(/\r\n/g, '\n');

    this.output.appendChild(logEntry);
    this.output.scrollTop = this.output.scrollHeight;
  }

  /**
   * Exportiere Execution History
   */
  getExecutionHistory() {
    return this.executionHistory;
  }

  /**
   * Exportiere Test Results
   */
  getTestResults() {
    return this.testResults;
  }

  /**
   * API für externe Nutzung
   */
  static getInstance(options) {
    return new PyScriptRunner(options);
  }
}

// CSS für Output
const style = document.createElement('style');
style.textContent = `
  .pyscript-editor {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    background: #f9f9f9;
    font-family: 'Courier New', monospace;
    font-size: 0.95em;
    line-height: 1.5;
    margin-bottom: 1rem;
    min-height: 200px;
    max-height: 400px;
    overflow-y: auto;
  }

  .pyscript-output {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    background: #f5f5f5;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    line-height: 1.5;
    min-height: 100px;
    max-height: 300px;
    overflow-y: auto;
  }

  .log-entry {
    padding: 0.25rem 0;
  }

  .log-success {
    color: #28a745;
  }

  .log-error {
    color: #dc3545;
  }

  .log-warning {
    color: #ffc107;
  }

  .log-info {
    color: #17a2b8;
  }

  .log-output {
    color: #333;
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
  }
`;
document.head.appendChild(style);

// Exportiere für globale Nutzung
window.PyScriptRunner = PyScriptRunner;
console.log('🐍 PyScriptRunner Module loaded');

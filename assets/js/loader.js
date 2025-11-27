/**
 * BauMax Learning Platform - Fetch & Inject Loader Engine
 * 
 * Funktionen:
 * - Lädt Kurse dynamisch aus config.json
 * - Rendert Kapitel mit Inhaltsverzeichnis
 * - LocalStorage Caching für Performance
 * - Error Handling mit Fallbacks
 * - Mobile-optimiert
 * 
 * @version 1.0.0
 * @author BauMax Team
 */

class CourseLoader {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || 'https://purge.jsdelivr.net/gh/andrkelb-school/SW_Situation_1_BauMax@latest';
    this.courseId = options.courseId || 'situation_1';
    this.localMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Fallback zu localhost für lokale Tests
    if (this.localMode) {
      this.baseUrl = '';
    }
    
    this.container = options.container || '#content_container';
    this.cacheEnabled = options.cacheEnabled !== false;
    this.cacheDuration = options.cacheDuration || 3600000; // 1 Stunde
    this.marker = '<!-- HIER_STARTET_DER_INHALT -->';
    
    this.config = null;
    this.currentChapter = null;
    this.cacheVersion = 'v1.0.0';
    
    this.init();
  }

  /**
   * Initialisierung
   */
  async init() {
    try {
      console.log('🚀 CourseLoader initialisiert', { baseUrl: this.baseUrl, courseId: this.courseId });
      await this.loadConfig();
      this.renderUI();
    } catch (error) {
      console.error('❌ Fehler bei Initialization:', error);
      this.showError('Fehler beim Laden der Kurskonfiguration');
    }
  }

  /**
   * Lade config.json
   */
  async loadConfig() {
    const cacheKey = `course_config_${this.courseId}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      console.log('✓ Config aus Cache geladen');
      this.config = cached;
      return;
    }

    try {
      const url = `${this.baseUrl}/courses/${this.courseId}/config.json?t=${Date.now()}`;
      console.log('📥 Lade config.json von:', url);
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      this.config = await response.json();
      console.log('✓ Config erfolgreich geladen:', this.config.courseName);
      
      this.saveToCache(cacheKey, this.config);
    } catch (error) {
      console.error('❌ Fehler beim Laden von config.json:', error);
      throw error;
    }
  }

  /**
   * Rendere komplette UI
   */
  renderUI() {
    const container = document.querySelector(this.container);
    if (!container) {
      console.error('❌ Container nicht gefunden:', this.container);
      return;
    }

    // Header
    const header = document.createElement('div');
    header.className = 'course-header';
    header.innerHTML = `
      <h2 style="color: #005691; margin: 0 0 0.5rem 0;">${this.config.courseName}</h2>
      <p style="margin: 0; color: #666; font-size: 0.9em;">${this.config.description}</p>
      <small style="color: #999;">v${this.config.version} • ${this.config.institution}</small>
    `;
    container.appendChild(header);

    // Main Content Grid
    const grid = document.createElement('div');
    grid.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;';
    
    // Linke Spalte: TOC
    const tocColumn = document.createElement('div');
    tocColumn.innerHTML = this.renderTableOfContents();
    
    // Rechte Spalte: Content
    const contentColumn = document.createElement('div');
    contentColumn.id = 'chapter_content';
    contentColumn.innerHTML = '<div style="padding: 2rem; text-align: center; color: #999;">Wähle ein Kapitel aus</div>';
    
    grid.appendChild(tocColumn);
    grid.appendChild(contentColumn);
    container.appendChild(grid);

    // Mobile: TOC unter Content
    if (window.innerWidth < 768) {
      grid.style.gridTemplateColumns = '1fr';
    }

    // Event Listener
    this.attachEventListeners();
  }

  /**
   * Rendere Inhaltsverzeichnis
   */
  renderTableOfContents() {
    let html = `
      <nav class="inhaltsverzeichnis" style="position: sticky; top: 0;">
        <h4 style="margin: 0 0 1rem 0; color: #005691; border-bottom: 2px solid #005691; padding-bottom: 0.5rem;">
          📚 Inhaltsverzeichnis
        </h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
    `;

    this.config.chapters.forEach(chapter => {
      const icon = chapter.type === 'intro' ? '🎬' : '📖';
      html += `
        <li style="margin-bottom: 0.5rem;">
          <a href="#" data-chapter-id="${chapter.id}" class="toc-link" style="
            display: block;
            padding: 0.5rem;
            border-radius: 4px;
            transition: all 0.3s ease;
            cursor: pointer;
          " onmouseover="this.style.backgroundColor='#e3f2fd'; this.style.paddingLeft='1rem';" 
             onmouseout="this.style.backgroundColor='transparent'; this.style.paddingLeft='0.5rem';">
            ${icon} ${chapter.id}: ${chapter.title}
            <small style="display: block; color: #999; font-size: 0.8em; margin-top: 0.25rem;">
              ⏱️ ${chapter.duration}
            </small>
          </a>
        </li>
      `;
    });

    html += `
        </ul>
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.85em; color: #666;">
          <p style="margin: 0;"><strong>Summe:</strong> ${this.getTotalDuration()}</p>
          <p style="margin: 0.5rem 0 0 0;">
            <button onclick="location.reload()" style="
              background: #005691;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
              font-size: 0.9em;
              width: 100%;
            ">🔄 Cache löschen</button>
          </p>
        </div>
      </nav>
    `;

    return html;
  }

  /**
   * Berechne Gesamtdauer
   */
  getTotalDuration() {
    let total = 0;
    this.config.chapters.forEach(ch => {
      const match = ch.duration.match(/(\d+)/);
      if (match) total += parseInt(match[1]);
    });
    return `${total} min`;
  }

  /**
   * Attach Event Listener für TOC Links
   */
  attachEventListeners() {
    document.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const chapterId = e.currentTarget.dataset.chapterId;
        this.loadChapter(chapterId);
      });
    });
  }

  /**
   * Lade ein Kapitel
   */
  async loadChapter(chapterId) {
    try {
      const chapter = this.config.chapters.find(ch => ch.id === chapterId);
      if (!chapter) {
        throw new Error(`Kapitel ${chapterId} nicht gefunden`);
      }

      console.log(`📖 Lade Kapitel ${chapterId}: ${chapter.title}`);
      this.currentChapter = chapter;

      // Markiere aktiven Link
      document.querySelectorAll('.toc-link').forEach(link => {
        link.style.backgroundColor = link.dataset.chapterId === chapterId ? '#e3f2fd' : 'transparent';
        link.style.fontWeight = link.dataset.chapterId === chapterId ? 'bold' : 'normal';
        link.style.borderLeft = link.dataset.chapterId === chapterId ? '3px solid #005691' : 'none';
      });

      // Lade Inhalt
      let content = await this.fetchChapterContent(chapter);
      
      // Lade auch Übung wenn vorhanden
      if (chapter.exercise) {
        const exercise = await this.fetchExerciseContent(chapter);
        content += exercise;
      }

      this.renderChapter(content, chapter);
    } catch (error) {
      console.error('❌ Fehler beim Laden des Kapitels:', error);
      this.showError(`Fehler beim Laden von Kapitel ${chapterId}: ${error.message}`);
    }
  }

  /**
   * Hole Kapitelinhalt
   */
  async fetchChapterContent(chapter) {
    const cacheKey = `chapter_${this.courseId}_${chapter.id}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      console.log(`✓ Kapitel ${chapter.id} aus Cache`);
      return cached;
    }

    try {
      // Mapping von Kapitel IDs zu echten Dateinamen
      const fileMapping = {
        '1.0': 'seite1.0_baumax_app.html',
        '1.1': 'seite1.1_fliesenrechner.html',
        '1.2': 'seite1.2_digitaler_helfer.html',
        '1.3': 'seite1.3_baumax_premium.html',
        '1.4': 'seite1.4_vollstaendiges_kundenprofil.html',
        '1.5': 'seite1.5_checkliste_warenversand.html',
        '1.6': 'seite1.6_mehrwertsteuer.html',
        '1.7': 'seite1.7_speicheroptimierung.html',
        '1.8': 'seite1.8_verpackungs_rechner.html',
        '1.9': 'seite1.9_zugangs_check.html'
      };

      const fileName = fileMapping[chapter.id];
      if (!fileName) {
        throw new Error(`Keine Datei für Kapitel ${chapter.id} definiert`);
      }

      const fullUrl = `${this.baseUrl}/github_content/${fileName}?t=${Date.now()}`;
      console.log(`📥 Lade: ${fullUrl}`);
      
      const response = await fetch(fullUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      let html = await response.text();
      // Extrahiere Inhalt zwischen Markern
      const content = this.extractContent(html);
      this.saveToCache(cacheKey, content);
      console.log(`✓ Kapitel ${chapter.id} geladen`);
      return content;
      
    } catch (error) {
      console.error(`❌ Fehler beim Laden von Kapitel ${chapter.id}:`, error);
      return `<div class="error"><strong>Fehler:</strong> Kapitel konnte nicht geladen werden (${error.message})</div>`;
    }
  }

  /**
   * Hole Übungsinhalt
   */
  async fetchExerciseContent(chapter) {
    if (!chapter.exercise) return '';
    
    const cacheKey = `exercise_${this.courseId}_${chapter.id}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      console.log(`✓ Übung ${chapter.id} aus Cache`);
      return cached;
    }

    try {
      const url = `${this.baseUrl}/github_content/${chapter.exercise}?t=${Date.now()}`;
      const response = await fetch(url);
      
      if (response.ok) {
        let html = await response.text();
        const content = this.extractContent(html);
        this.saveToCache(cacheKey, content);
        return content;
      }
      return '';
    } catch (error) {
      console.error(`⚠️ Übung ${chapter.id} konnte nicht geladen werden`);
      return '';
    }
  }

  /**
   * Extrahiere Inhalt zwischen Markern
   */
  extractContent(html) {
    const parts = html.split(this.marker);
    if (parts.length < 3) {
      return html; // Fallback: ganze Datei
    }
    return parts[1].trim();
  }

  /**
   * Rendere Kapitelinhalt
   */
  renderChapter(content, chapter) {
    const contentDiv = document.getElementById('chapter_content');
    if (!contentDiv) return;

    contentDiv.innerHTML = `
      <div style="animation: fadeIn 0.3s ease;">
        <div style="
          background: linear-gradient(135deg, #005691, #0078d4);
          color: white;
          padding: 2rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        ">
          <h2 style="margin: 0 0 0.5rem 0; font-size: 1.8em;">
            ${chapter.id}: ${chapter.title}
          </h2>
          <p style="margin: 0; opacity: 0.9;">
            ⏱️ ${chapter.duration} • 📝 ${chapter.type === 'intro' ? 'Einführung' : 'Lektion'}
          </p>
        </div>
        <div class="chapter-content">
          ${content}
        </div>
      </div>
    `;

    // Smooth scroll
    contentDiv.scrollIntoView({ behavior: 'smooth' });

    // Re-attach link handlers für navigationen innerhalb von Kapiteln
    this.attachChapterLinkHandlers();
  }

  /**
   * Attach Link Handlers innerhalb von Kapiteln
   */
  attachChapterLinkHandlers() {
    const contentDiv = document.getElementById('chapter_content');
    if (!contentDiv) return;

    contentDiv.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      
      // Erkenne Kapitellinks (z.B. seite1.1_fliesenrechner.html)
      const match = href.match(/seite(\d\.\d)/);
      if (match) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          this.loadChapter(match[1]);
        });
      }
    });
  }

  /**
   * Zeige Fehler an
   */
  showError(message) {
    const contentDiv = document.getElementById('chapter_content');
    if (contentDiv) {
      contentDiv.innerHTML = `
        <div class="error" style="
          border: 2px solid #f44336;
          background-color: #ffebee;
          padding: 1.5rem;
          color: #c62828;
          border-radius: 8px;
          margin: 2rem 0;
        ">
          <strong>⚠️ Fehler</strong>
          <p>${message}</p>
          <button onclick="location.reload()" style="
            background: #f44336;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
          ">Neu laden</button>
        </div>
      `;
    }
  }

  /**
   * Cache Funktionen
   */
  getFromCache(key) {
    if (!this.cacheEnabled) return null;
    
    try {
      const item = localStorage.getItem(`${this.cacheVersion}_${key}`);
      if (!item) return null;
      
      const { data, timestamp } = JSON.parse(item);
      if (Date.now() - timestamp > this.cacheDuration) {
        localStorage.removeItem(`${this.cacheVersion}_${key}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('⚠️ Cache-Lesefehler:', error);
      return null;
    }
  }

  saveToCache(key, data) {
    if (!this.cacheEnabled) return;
    
    try {
      localStorage.setItem(`${this.cacheVersion}_${key}`, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('⚠️ Cache-Schreibfehler:', error);
    }
  }

  /**
   * Statistik
   */
  getStats() {
    return {
      totalChapters: this.config?.chapters?.length || 0,
      currentChapter: this.currentChapter?.id || null,
      cacheSize: this.getCacheSize(),
      cacheEnabled: this.cacheEnabled
    };
  }

  getCacheSize() {
    let size = 0;
    try {
      for (let key in localStorage) {
        if (key.startsWith(this.cacheVersion)) {
          size += localStorage[key].length;
        }
      }
    } catch (error) {
      console.warn('⚠️ Cache-Größe konnte nicht berechnet werden');
    }
    return Math.round(size / 1024); // KB
  }

  /**
   * Exportiere API
   */
  static getInstance(options) {
    return new CourseLoader(options);
  }
}

// CSS für Animationen hinzufügen
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .chapter-content {
    animation: fadeIn 0.3s ease;
  }
  
  /* Responsive Grid für mobile Geräte */
  @media (max-width: 768px) {
    #content_container > div {
      grid-template-columns: 1fr !important;
    }
    
    .inhaltsverzeichnis {
      position: static !important;
      margin-bottom: 2rem;
    }
  }
`;
document.head.appendChild(style);

// Auto-Initialisierung wenn DOM bereit ist
document.addEventListener('DOMContentLoaded', () => {
  if (window.CourseLoaderConfig) {
    window.courseLoader = CourseLoader.getInstance(window.CourseLoaderConfig);
  }
});

// Exportiere für globale Nutzung
window.CourseLoader = CourseLoader;

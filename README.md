# 🎓 BauMax Learning Platform - Multi-Course Management System

Eine moderne, externe Kursverwaltungsplattform mit GitHub-Integration, die Moodle als reinen Rahmen nutzt. Kursinhalte werden live von GitHub geladen – flexibel, wartbar und skalierbar.

## 🎯 Ziel & Vision

**Ziel:** Verwaltung von Kursinhalten außerhalb von Moodle für bessere Wartbarkeit und Skalierbarkeit.

**Vision:**
- ✅ Ein Ort für alle Kursinhalte (GitHub)
- ✅ Moodle nur als Integrations-Rahmen
- ✅ Live-Updates ohne Moodle-Admin
- ✅ Zukünftig: PyScript für interaktive Übungen
- ✅ Mobile-optimiert für alle Geräte

---

## 📁 Repo-Struktur

```
SW_Situation_1_BauMax/
├── 📄 README.md                    # Diese Datei
├── 📄 index.html                   # Einstiegspunkt für lokale Tests
│
├── 📁 assets/                      # Zentrale Assets
│   ├── css/
│   │   └── style.css               # Globale Styles (Mobile-First)
│   ├── js/
│   │   ├── loader.js               # Fetch & Inject Engine
│   │   ├── pyscript-runner.js      # PyScript Integration
│   │   ├── code-editor.js          # Code Editor mit Syntax-Highlighting
│   │   └── exercise-system.js      # Interaktive Übungen
│   └── images/
│
├── 📁 courses/                     # Alle Kurse (Multi-Situation Support)
│   ├── situation_1/                # Situation 1 - BauMax App
│   │   ├── config.json             # Kurs-Metadaten & Kapitel
│   │   ├── moodle-snippet.html     # Moodle-Embed für Situation 1
│   │   ├── chapters/               # HTML-Kapitel
│   │   │   ├── seite1.0_baumax_app.html
│   │   │   ├── seite1.1_fliesenrechner.html
│   │   │   └── ...
│   │   └── exercises/              # Interaktive Übungen (geplant)
│   │
│   └── situation_2/                # Situation 2 - SmartHome Systems
│       ├── config.json             # Kurs-Metadaten & Kapitel
│       ├── moodle-snippet.html     # Moodle-Embed für Situation 2
│       └── chapters/               # HTML-Kapitel
│           ├── seite2.0_smarthome_systems.html
│           ├── seite2.1_logik_architekt.html
│           └── ...
│
├── 📁 coderunner/                  # CodeRunner Integration (Moodle)
│   ├── README.md                   # CodeRunner Dokumentation
│   ├── questions/                  # Python-Aufgaben
│   │   └── sum_two_numbers/        # Beispiel: A1 - Einfache Rechnung
│   │       ├── prompt.md           # Aufgabenstellung
│   │       ├── question.json       # Metadaten
│   │       ├── tests.yaml          # Testfälle
│   │       ├── model_answer.py     # Musterlösung
│   │       └── template.mustache   # Starter-Code
│   ├── scripts/
│   │   └── build_moodle_xml.py     # Generator für Moodle XML
│   └── dist/
│       ├── moodle-export.xml       # Auto-generiert (minimal)
│       └── single-question.xml     # Lauffähige Version
│
└── 📁 dev/                         # Entwicklungs-/Test-Dateien
    ├── demo-pyscript.html          # PyScript Demo
    ├── test-dashboard.html         # Test Dashboard
    ├── test-python-simple.html     # Python Tester
    └── test-runner.html            # Integration Tests
```

---

## ✨ Features

### 🎓 Multi-Course Support
- Situation 1: BauMax App (9 Kapitel)
- Situation 2: SmartHome Systems (2+ Kapitel)
- Einfaches Hinzufügen neuer Situations

### 🔧 Technische Features
- **Loader-System**: Dynamisches Laden von Kapiteln via jsDelivr CDN
- **PyScript Integration**: Python-Code direkt im Browser ausführen
- **CodeRunner**: Moodle-Integration für Python-Aufgaben mit Auto-Grading
- **Responsive Design**: Mobile-First, Dark Mode Support
- **Caching**: Intelligentes LocalStorage Caching mit Cache-Busting
- **Marker-System**: Flexible Content-Extraction für Moodle

### 📝 Entwicklungs-Tools
- Test-Dashboard für System-Debugging
- PyScript Demo-Umgebung
- Integration Test Runner
- Build-Scripts für CodeRunner XML-Export

> **Zukünftige Aufgaben** siehe [TODO.md](TODO.md)

---

## 📋 Kurs-Konfiguration

Die `config.json` definiert die Kursstruktur:

```json
{
  "courseId": "situation_1",
  "courseName": "Situation 1 - BauMax App",
  "chapters": [
    {
      "id": "1.0",
      "title": "Die BauMax-App",
      "type": "intro",
      "exercise": null
    },
    {
      "id": "1.1",
      "title": "Fliesenrechner",
      "type": "lesson",
      "exercise": "1.1_fliesenrechner.html"
    }
  ]
}
```

---

## 🎨 Design & UX

### Dark Mode
- Zentrale CSS-Variablen in `:root`
- Automatische Umschaltung via `body.dark-mode`
- Vollständig responsive

### Mobile-Optimierung
- Breakpoints: 768px, 480px
- Sticky Navigation (TOC)
- Flexible Layouts
- Touch-freundliche Buttons

### Accessibility
- Semantisches HTML
- Ausreichend Kontrast
- Keyboard-Navigation
- Screen-Reader unterstützung

---

## 🔧 Technologie-Stack

| Bereich | Tech | Version |
|---------|------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JS | Latest |
| **CMS** | GitHub | - |
| **Hosting** | GitHub Pages / jsdelivr CDN | - |
| **LMS** | Moodle | 4.x |
| **Future** | PyScript | 2024+ |

---

## 📖 Nutzung

### Lokal testen
```bash
# Python HTTP Server (Port 8000)
python -m http.server 8000

# Öffnen in Browser
http://localhost:8000/index.html
```

### Neuen Kurs hinzufügen
1. Ordner unter `courses/[course_id]/` erstellen
2. `config.json` mit Kapiteln definieren
3. Markdown-Dateien in `chapters/` schreiben
4. HTML-Übungen in `exercises/` platzieren

### In Moodle einbinden
```html
<!-- Kopieren Sie diesen Code in ein Moodle-Textfeld -->
<iframe src="https://cdn.jsdelivr.net/gh/andrkelb-school/SW_Situation_1_BauMax@latest/dist/moodle-embed.html" 
        width="100%" 
        height="800" 
        style="border: none;"></iframe>
```

---

## 🔐 Sicherheit & Best Practices

- ✅ GitHub Pages mit HTTPS
- ✅ Content Security Policy (CSP) Headers
- ✅ Keine sensiblen Daten im Repo
- ✅ PyScript in Sandbox ausgeführt
- ✅ Regelmäßige Dependency-Updates

---

## 📝 Entwickler-Notizen

### Git Workflow
```bash
# Neue Features
git checkout -b feature/feature-name

# Changes committen
git add .
git commit -m "Feature: Beschreibung"

# Zu main
git push origin feature/feature-name
# → Pull Request erstellen
```

### Debugging
- Browser DevTools → Network Tab für CDN-Requests
- Console für JavaScript Fehler
- LocalStorage Inspector für Caching

---

## 🤝 Beitragen

Neue Kurse oder Features? Gerne!

1. Fork das Repo
2. Feature-Branch erstellen
3. Änderungen committen
4. PR erstellen

---

## 📞 Support & Kontakt

- **Repository:** https://github.com/andrkelb-school/SW_Situation_1_BauMax
- **Issues:** GitHub Issues verwenden
- **Docs:** Siehe `README.md` (diese Datei)

---

## 📄 Lizenz

Diese Materialien sind für Bildungszwecke gedacht.

---

## 🔄 Changelog

### v1.0.0 (27.11.2025)
- ✅ Phase 1: Grundstruktur abgeschlossen
- ✅ 10 Kapitel mit config.json
- ✅ Responsive CSS mit Dark Mode
- ✅ Dokumentation

### v0.9.0 (vorher)
- Alte HTML-basierten Seiten



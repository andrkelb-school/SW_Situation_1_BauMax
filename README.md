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
├── 📄 moodle-snippet.html          # Aktuelles Moodle-Embed Script
│
├── 📁 assets/                      # Zentrale Assets
│   ├── css/
│   │   └── style.css               # Globale Styles (Mobile-First)
│   ├── js/
│   │   ├── loader.js               # [Phase 2] Fetch & Inject Engine
│   │   └── pyscript-runner.js      # [Phase 3] PyScript Integration
│   └── images/
│
├── 📁 courses/                     # Alle Kurse
│   └── situation_1/                # Situation 1 - BauMax App
│       ├── config.json             # Kurs-Metadaten & Kapitel
│       ├── chapters/               # Markdown-Inhalte
│       │   ├── 1.0_baumax_app.md
│       │   ├── 1.1_fliesenrechner.md
│       │   └── ...
│       └── exercises/              # HTML-Übungen
│           ├── 1.1_fliesenrechner.html
│           ├── 1.2_digitaler_helfer.html
│           └── ...
│
├── 📁 dist/                        # Verteilbare Dateien
│   └── moodle-embed.html           # [Phase 2] Optimiertes Embed-Script
│
└── 📁 github_content/              # [Legacy] Alte HTML-Seiten
    └── seite1.*.html               # Wird zu Phase 2 migriert
```

---

## 🚀 Implementierungs-Roadmap

### Phase 1 ✅ ABGESCHLOSSEN
**Grundstruktur & Infrastruktur**
- ✅ Ordnerstruktur (assets/, courses/, dist/)
- ✅ config.json für Kursmetadaten
- ✅ Zentrale CSS mit Dark Mode & Responsive Design
- ✅ index.html Landing Page
- ✅ Git-Repository mit .gitignore
**Status:** Erfolgreich bereitgestellt in Commit `b89f71a`

### Phase 2 🔄 IN ARBEIT
**Loader-System & Dynamisches Rendering**

#### 🎯 Neue Dateien in Phase 2:

**`assets/js/loader.js`** (650+ Zeilen)
- CourseLoader Klasse mit config.json Support
- Dynamisches Kapitel-Laden und Rendering
- LocalStorage Caching mit TTL
- Error Handling & Fallbacks
- Browser-kompatibel (IE10+)

**`dist/moodle-embed.html`** (optimiert für Moodle)
- Vollständig responsive Design
- Dark Mode Support
- Mobile-optimiert für alle Geräte
- Einfache Moodle-Integration via iframe

**`test-runner.html`** & **`test-dashboard.html`**
- Unit Tests & Integration Tests
- Performance Monitoring
- Test Coverage Reports
- Automatisierte Testausführung

#### 🎯 Features in Phase 2:
- ✅ Fetch & Inject Engine
- ✅ Config-getriebene Kapitelstruktur
- ✅ Intelligentes Caching mit Invalidierung
- ✅ Mobile-First Design
- ✅ Dark Mode
- ✅ Fehlerbehandlung & Fallbacks
- ✅ Vollständig getestet

#### 💻 Verwendung:
```html
<!-- In Moodle iframe oder standalone -->
<script src="assets/js/loader.js"></script>
<div id="content_container"></div>
<script>
  window.CourseLoaderConfig = {
    courseId: 'situation_1',
    container: '#content_container',
    cacheEnabled: true
  };
</script>
```

### Phase 3 🔮 GEPLANT
**PyScript Integration & Erweiterte Features**
- [ ] PyScript Setup für Python-Ausführung im Browser
- [ ] Python Code-Editor mit Syntax-Highlighting
- [ ] Exercise-Sandbox mit Output-Capture
- [ ] Code-Validierung & Feedback-System
- [ ] Progress Tracking & Statistiken

### Phase 4 📱 ZUKÜNFTIG
**Advanced Features & Optimierung**
- [ ] Service Workers für Offline-Unterstützung
- [ ] Progressive Web App (PWA) Struktur
- [ ] Moodle Gradebook Integration
- [ ] Echtzeit-Synchronisation mit Moodle
- [ ] Analytics & Learning Analytics
- [ ] Mobile App (React Native/Flutter)
- [x] README Dokumentation
- [ ] Alte HTML-Inhalte migrieren

### 🔄 Phase 2: Loader-System
- [ ] JavaScript Fetch & Inject Engine
- [ ] Markdown zu HTML Converter
- [ ] Optimiertes Moodle-Embed Script
- [ ] Caching & LocalStorage
- [ ] Mobile-First Tests

### 🔮 Phase 3: PyScript Integration
- [ ] PyScript Setup & Sandbox
- [ ] Python-Übungen im Browser
- [ ] Output-Capture & Visualisierung
- [ ] Error Handling für Python

### 📱 Phase 4: Erweiterte Features
- [ ] Offline-Support (Service Workers)
- [ ] Benutzerfortschritt-Tracking
- [ ] Code-Editor Integration
- [ ] Social Features (Sharing)

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

## 🎓 Kapitel-Übersicht (Situation 1)

| Kap. | Titel | Dauer | Typ |
|------|-------|-------|-----|
| 1.0 | Die BauMax-App | 10 min | Intro |
| 1.1 | Fliesenrechner | 30 min | Lektion |
| 1.2 | Digitaler Helfer | 30 min | Lektion |
| 1.3 | BauMax Premium | 35 min | Lektion |
| 1.4 | Vollständiges Kundenprofil | 40 min | Lektion |
| 1.5 | Checkliste für Warenversand | 30 min | Lektion |
| 1.6 | Mehrwertsteuer | 35 min | Lektion |
| 1.7 | Speicheroptimierung | 40 min | Lektion |
| 1.8 | Verpackungs-Rechner | 35 min | Lektion |
| 1.9 | Zugangs-Check | 30 min | Lektion |
| **Summe** | | **295 min** | |

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

---

**Stand:** 27. November 2025 | **Status:** Phase 1 ✅ | **Nächstes:** Phase 2 (Loader-System)

---
layout: page
title: MicrosoftHostsPicker
description: 一个现代化的异步 Python 工具，可自动查找并选择 Microsoft 服务的最快 IP 地址。
img: assets/img/project/MicrosoftHostsPicker/MicrosoftHostsPicker.png
importance: 1
category: fun
giscus_comments: true
---

Ein modernes, asynchrones Python-Tool, das automatisch die schnellsten IP-Adressen für Microsoft-Dienste findet und auswählt.

## 🚀 Funktionen

- **Asynchrones Ping-Testing** – Gleichzeitige Latenztests für schnellere Ergebnisse
- **Intelligente IP-Auswahl** – Früher Abbruch, wenn optimale IPs gefunden wurden
- **Modulare Konfiguration** – Einfach anpassbare Dienstdefinitionen
- **Schöne Konsolenausgabe** – Farbige Fortschrittsanzeigen und Ergebnisse
- **Modernes Python** – Mit asyncio, Typisierung und Dataclasses

## 🎯 Warum dieses Tool?

In bestimmten Regionen können Microsoft-Dienste schlechte Leistung zeigen, da DNS auf suboptimale IP-Adressen auflöst. Dieses Tool löst das Problem durch:

- Gleichzeitiges Testen von hunderten IP-Adressen
- Identifikation der niedrigsten Latenz-Endpunkte für jeden Dienst
- Generierung optimierter Hosts-Datei-Einträge
- Unterstützung von über 10 Microsoft-Diensten wie Xbox Live, Office CDN, Microsoft Store und mehr

## 📋 Unterstützte Dienste

- **Microsoft-Konto** – account.microsoft.com
- **Xbox Live CDN** – Bereitstellung von Spielinhalten und Multiplayer
- **Xbox Cloud Sync** – Synchronisierung von Spielständen
- **Office CDN** – Office-Downloads und Updates
- **Microsoft Store** – Store-Bilder und Seiten
- **Microsoft Spiele-Download** – Spielinstallation und Updates
- **Windows Update** – Systemupdates und Patches
- **Microsoft Login** – Authentifizierungsdienste (statische IP)

## 🛠️ Installation

### Voraussetzungen

- Python 3.12+
- Netzwerkverbindung für Ping-Tests

### Methode 1: Mit uv (empfohlen)

```sh
pip install uv
git clone https://github.com/Vncntvx/MicrosoftHostsPicker.git
cd MicrosoftHostsPicker
uv sync
```

### Methode 2: Mit pip

```sh
git clone https://github.com/Vncntvx/MicrosoftHostsPicker.git
cd MicrosoftHostsPicker
pip install ping3==4.0.4
```

## 🚀 Nutzung

### Grundlegende Nutzung

```sh
python MicrosoftHostsPicker.py
```

### Erweiterte Konfiguration

Die Einstellungen können in `config.py` angepasst werden:

```python
DEFAULT_CONFIG = {
    'ping_attempts': 2,           # Anzahl der Ping-Versuche pro IP
    'ping_timeout': 0.5,          # Ping-Timeout in Sekunden
    'ping_max_workers': 100,      # Maximale gleichzeitige Pings
    'good_enough_threshold': 50.0, # Testabbruch bei Latenz < 50ms
}
```

## 📁 Projektstruktur

```text
MicrosoftHostsPicker/
├── MicrosoftHostsPicker.py    # Hauptanwendung
├── config.py                  # Dienstkonfigurationen
├── pyproject.toml            # Metadaten und Abhängigkeiten
├── uv.lock                   # Lock-Datei für reproduzierbare Builds
├── data/                     # IP-Datenbanken
│   ├── Microsoft_Account.txt
│   ├── Xbox_Live_CDN_1.txt
│   └── ...
└── hosts                     # Generierte Hosts-Datei
```

## 🔧 Funktionsweise

1. **Konfigurationsladen** – Dienstdefinitionen aus `config.py` lesen
2. **Asynchrones Testing** – Gleichzeitiges Pingen der IP-Adressen
3. **Intelligente Optimierung** – Früher Abbruch bei großen IP-Mengen
4. **Ergebniserstellung** – Optimierte Hosts-Einträge generieren
5. **Benutzerführung** – Klare Anweisungen zur Implementierung

## 📖 Hinweise zur Ausgabe

- ✅ **Grüner Haken**: Optimale IP gefunden
- ❌ **Rotes X**: Keine verfügbare IP gefunden
- ⚠️ **Warnung**: Test fehlgeschlagen
- 📊 **Fortschrittsbalken**: Zeigt Fortschritt bei großen IP-Mengen

## 🛡️ Speicherorte der Hosts-Datei

- **Windows**: `C:\Windows\System32\drivers\etc\hosts`
- **macOS/Linux**: `/etc/hosts`

Zum Bearbeiten der Hosts-Datei sind Administratorrechte/sudo erforderlich.

## 🙏 Danksagung

Dieses Projekt basiert auf [ButaiKirin/MicrosoftHostsPicker](https://github.com/ButaiKirin/MicrosoftHostsPicker). Vielen Dank an den Originalautor.

## 🤝 Mitwirken

Beiträge sind willkommen! Gerne Issues, Feature-Requests oder Pull-Requests einreichen.

## 📄 Lizenz

Dieses Projekt ist unter den Bedingungen der LICENSE-Datei lizenziert.

<footer lang="de" style="
  background-color: #f8f9fa;
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.5;
  padding: 1rem 1.5rem;
  margin-top: 2rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
">
  <p style="margin: 0; word-break: break-word;">
    Diese Seite wurde automatisch von generativer KI übersetzt und kann Ungenauigkeiten oder unvollständige Informationen enthalten.
    <a href="mailto:wenjie.xu.cn@outlook.com" style="
      color: #007bff;
      text-decoration: none;
    ">Feedback willkommen</a> zur Verbesserung.
  </p>
</footer>

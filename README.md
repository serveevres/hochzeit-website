# Hochzeitswebsite – Florian & Sebastian

Eine einfache Hochzeitswebsite mit Wunschliste und RSVP-Formular.

---

## Lokal starten

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Admin-Passwort erstellen
node hash-password.js deinPasswort
# → Kopiere den ausgegebenen Hash in .env

# 3. .env Datei erstellen
cp .env.example .env
# → Trage JWT_SECRET und ADMIN_PASSWORD_HASH ein

# 4. Server starten
npm start
# → http://localhost:3000
```

---

## Seiten

| URL | Beschreibung |
|-----|-------------|
| `/` | Wunschliste (öffentlich) |
| `/rsvp` | RSVP-Formular (öffentlich) |
| `/admin` | Verwaltung (passwortgeschützt) |

---

## Deployment auf Render.com (kostenlos)

### Schritt 1: GitHub-Repository erstellen

1. Gehe zu [github.com](https://github.com) und erstelle ein kostenloses Konto (falls noch nicht vorhanden)
2. Klicke auf **„New repository"** → Name: `hochzeit-website` → **Private** auswählen → **Create**
3. Folge den GitHub-Anweisungen, um den Code hochzuladen:

```bash
# Im Projektordner (Hochzeit/)
git init
git add .
git commit -m "Hochzeitswebsite initial"
git remote add origin https://github.com/serveevres/hochzeit-website.git
git push -u origin main
```

### Schritt 2: Render.com einrichten

1. Gehe zu [render.com](https://render.com) → **„Get Started for Free"** → mit GitHub anmelden
2. **„New +"** → **„Web Service"**
3. GitHub-Repo **`hochzeit-website`** auswählen → **Connect**
4. Einstellungen:
   - **Name**: `hochzeit-florian-sebastian` (oder beliebig)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free
5. Unter **„Environment Variables"** hinzufügen:
   - `JWT_SECRET` → z.B. `meinGeheimesPasswort12345abc`
   - `ADMIN_PASSWORD_HASH` → den Hash aus `node hash-password.js`
6. **„Create Web Service"** klicken

→ Die Seite ist nach ~2 Minuten unter `https://hochzeit-florian-sebastian.onrender.com` erreichbar.

> **Hinweis:** Der kostenlose Render-Plan schläft nach 15 Minuten Inaktivität ein und braucht ~30 Sekunden zum Aufwachen. Für eine Hochzeitswebsite ist das völlig ausreichend.

---

## Eigene Domain (optional, ~€1/Monat)

### Empfehlung: IONOS.de

1. Gehe zu [ionos.de](https://www.ionos.de)
2. Suche nach verfügbaren Domains, z.B.:
   - `florian-und-sebastian.de`
   - `fs-hochzeit.de`
   - `unsere-hochzeit-fs.de`
3. Domain registrieren (~€1/Monat oder €12/Jahr für `.de`)
4. In Render.com: **Settings → Custom Domains → Add Custom Domain**
5. In IONOS DNS-Einstellungen: CNAME-Eintrag auf `hochzeit-florian-sebastian.onrender.com` setzen
6. SSL-Zertifikat wird von Render automatisch ausgestellt ✅

### Kostenlose Subdomains (ohne eigene Domain)

Die automatische Render-URL `*.onrender.com` ist kostenlos und sofort nutzbar.

---

## Wichtige Hinweise

- **Datenbank**: `gifts.db` (SQLite) wird lokal erstellt. Auf Render wird sie bei jedem Neustart zurückgesetzt, sofern kein persistenter Speicher eingerichtet ist. Für eine Hochzeitswebsite (kurze Laufzeit, wenig Daten) reicht der kostenlose Render-Plan aus – einfach Geschenke kurz vor dem Versand der Einladungen eintragen.
- **Admin-Passwort**: Niemals `.env` in Git hochladen (ist in `.gitignore` bereits ausgeschlossen).

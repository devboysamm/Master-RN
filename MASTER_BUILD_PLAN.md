# Master RN — Build Plan (VS Code + Claude Code)

> Your step-by-step guide. Do each step in order. Don't skip ahead.

**Your setup (confirmed working):**
- Mac with VS Code + Claude Code extension
- Node v25.8.0 · npm 11.11.0 · Git 2.53.0 · Xcode 26.5 · Homebrew 5.1.8
- EAS CLI 18.4.0 · Expo account: altsam051
- GitHub: devboysamm/Master-RN (https://github.com/devboysamm/Master-RN.git)
- Server: Digital Ocean · 168.144.82.96 · Ubuntu 24.04
- Apple Developer account: enrolled and paid

---

## WHAT YOU'RE BUILDING (30-second version)

```
┌─────────────────────────┐         ┌─────────────────────────┐
│  ADMIN PANEL (website)  │         │   MOBILE APP (iPhone)   │
│  You use this to create │         │   Users download from   │
│  modules and lessons    │         │   the App Store         │
└────────────┬────────────┘         └────────────┬────────────┘
             │                                   │
             └──────────────┬────────────────────┘
                            ▼
              ┌──────────────────────────┐
              │  BACKEND API (server)    │
              │  The brain — stores and  │
              │  serves all content      │
              └────────────┬─────────────┘
                           ▼
                 ┌──────────────────┐
                 │  DATABASE        │
                 │  The filing      │
                 │  cabinet         │
                 └──────────────────┘
```

All four pieces live on your Digital Ocean server. You build them on your Mac, then upload them.

---

## STEP 1: Create your project folder and add all files

Open **Terminal** in VS Code (press Ctrl+` which is the backtick key above Tab):

```bash
mkdir -p ~/Projects/Master-RN
cd ~/Projects/Master-RN
git init
```

**What this does:**
- Creates a folder called `Master-RN` inside `~/Projects/`
- `cd` moves you into that folder
- `git init` tells Git to start tracking changes here

Now open this folder in VS Code: **File → Open Folder → navigate to your home folder → Projects → Master-RN → click Open**.

You should see an empty folder in the VS Code sidebar.

### Move your spec files in

Open **Finder** and drag ALL of these files into the `Master-RN` folder:

| File | What it is |
|---|---|
| `BUILD_BRIEF.md` | Mobile app spec — every screen described |
| `STATUS.md` | Progress tracker |
| `promt.html` | Backend + admin spec — database, API routes |
| `MASTER_BUILD_PLAN.md` | This file you're reading |
| `Master React Native - Designs (3).html` | Design canvas |
| `Master React Native - Logo (1).html` | Logo reference |

Also drag in the `.jsx` files if you have them:

```
design-canvas.jsx
mobile-shared.jsx
mobile-screens-1.jsx
mobile-screens-2.jsx
mobile-screens-3.jsx
admin-screens.jsx
```

**Check if you have the .jsx files:**

In the VS Code terminal:

```bash
ls ~/Projects/Master-RN/*.jsx 2>/dev/null
```

If it shows nothing, that's OK — `BUILD_BRIEF.md` and `promt.html` are detailed enough for Claude Code to work from.

### Create .gitignore

In VS Code terminal:

```bash
cd ~/Projects/Master-RN
cat > .gitignore << 'EOF'
node_modules/
.env
.DS_Store
dist/
.expo/
ios/
android/
EOF
```

**What .gitignore does:** Tells Git to ignore certain files — like `node_modules/` (huge folder of downloaded libraries, ~200MB) and `.env` (contains passwords). These should never go to GitHub.

---

## STEP 2: Connect to GitHub and push your files

Your repo is at `https://github.com/devboysamm/Master-RN.git`. Let's push your files to it.

In VS Code terminal:

```bash
cd ~/Projects/Master-RN
git add .
git commit -m "project spec files"
git branch -M main
git remote add origin https://devboysamm@github.com/devboysamm/Master-RN.git
git push -u origin main
```

**What each command does:**
- `git add .` — Stages all files (tells Git "I want to track these")
- `git commit -m "..."` — Saves a snapshot with a message describing what changed
- `git branch -M main` — Names the main branch "main"
- `git remote add origin ...` — Connects your local folder to the GitHub repo
- `git push -u origin main` — Uploads everything to GitHub

When it asks for a password, paste your **Personal Access Token** (the `ghp_...` string from GitHub → Settings → Developer settings → Personal access tokens).

Refresh your GitHub repo page in the browser — you should see all your files.

---

## STEP 3: Set up SSH key to your server

Right now, connecting to your server requires typing a password every time. Let's fix that.

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

Press **Enter** three times (accept all defaults, no passphrase).

```bash
ssh-copy-id root@168.144.82.96
```

Type your server password one last time. From now on:

```bash
ssh root@168.144.82.96
```

Gets you in instantly. If it works, type `exit` to disconnect.

> **Note:** Your earlier SSH session had "channel open failed" errors and a broken pipe. This is usually caused by too many background SSH sessions. After setting up the key, if it happens again, run `ssh -o ServerAliveInterval=60 root@168.144.82.96` to keep the connection alive.

---

## STEP 4: Discover what's on your server

SSH in:

```bash
ssh root@168.144.82.96
```

Run this **entire block** as one paste (select all, copy, paste into the SSH terminal, press Enter):

```bash
echo "=== OS ===" && uname -a && uptime
echo "=== DIRECTORIES ===" && ls -la /var/www/ 2>/dev/null && ls -la /opt/ 2>/dev/null && ls -la /root/ 2>/dev/null
echo "=== TOOLS ===" && which node npm mysql nginx pm2 certbot 2>/dev/null && node --version 2>/dev/null && npm --version 2>/dev/null && mysql --version 2>/dev/null && nginx -v 2>&1
echo "=== RUNNING ===" && systemctl list-units --type=service --state=running --no-pager | head -40
echo "=== PORTS ===" && ss -tlnp
echo "=== PM2 ===" && pm2 list 2>/dev/null
echo "=== NGINX ===" && ls -la /etc/nginx/sites-enabled/ 2>/dev/null && cat /etc/nginx/sites-enabled/* 2>/dev/null
echo "=== DISK ===" && df -h / && free -h
echo "=== MYSQL ===" && mysql -e "SHOW DATABASES;" 2>/dev/null
echo "=== CRON ===" && crontab -l 2>/dev/null
```

**Copy ALL the output and paste it to me in this chat.**

I need to see this before writing Step 5 (the cleanup script), because I need to know what software is installed, what's running, and what to remove vs. keep.

Type `exit` to disconnect after copying the output.

---

## STEP 5: Clean up and set up the server

> ⏳ **I will write this step after you paste the Step 4 output to me.** It will be a single script you paste into the SSH terminal.

What it will do:
- Stop the old GPT Codex apps
- Remove their old files
- Set up MySQL database (`course_learning`)
- Configure Nginx for all three subdomains
- Get SSL certificates (HTTPS) via Let's Encrypt
- Set up PM2 (keeps your backend running 24/7)
- Set up a firewall (only allow web traffic + SSH)

---

## STEP 6: Build the backend API

> ⏱ Uses ~1–2 Claude Code sessions on your Pro plan.

The backend is the "brain" — a program on your server that stores modules and lessons in a database and sends them to whoever asks (the mobile app or admin panel).

### 6a. Open Claude Code and paste the prompt

In VS Code:
1. Click the **Claude Code icon** in the left sidebar (looks like the Claude logo)
2. If you don't see it, press **Cmd+Shift+P** → type "Claude" → click "Claude Code: Open Chat"
3. Make sure you're in the `~/Projects/Master-RN` folder (check the bottom of VS Code)
4. In the Claude Code chat box at the bottom, **paste this entire prompt and press Enter:**

```
You are building the backend for Master RN — a learning app.

FIRST — read these files completely before writing ANY code:
1. promt.html — READ THE ENTIRE FILE. This is your source of truth for
   the database schema, API endpoints, validation rules, and response format.

THEN — create the backend-api/ folder with this structure:

backend-api/
  index.js              ← requires src/server.js
  package.json          ← express, mysql2, dotenv, cors
  schema.sql            ← CREATE TABLE statements for modules, lessons, app_content
  .env.example          ← PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
  src/
    app.js              ← Express setup, JSON parsing, CORS, routes
    server.js           ← starts server on PORT
    config/
      db.js             ← MySQL connection pool
      initializeDatabase.js ← runs schema.sql on startup
    controllers/
      modulesController.js
      lessonsController.js
      appContentController.js
    models/
      Module.js
      Lesson.js
      AppContent.js
    routes/
      modules.js
      lessons.js
      appContent.js
    middlewares/
      errorHandler.js

Implement EVERY endpoint from promt.html:
  GET    /health
  GET    /api/modules
  GET    /api/modules/:id
  GET    /api/modules/:id/lessons
  POST   /api/modules
  PUT    /api/modules/:id
  DELETE /api/modules/:id
  GET    /api/lessons/:id
  GET    /api/lesson/:id (alias)
  POST   /api/lessons
  PUT    /api/lessons/:id
  DELETE /api/lessons/:id
  GET    /api/app-content
  PUT    /api/app-content

Validation (from promt.html):
  - Module title required
  - background_color must be 6-digit hex
  - image_url must be http/https when provided
  - Lesson module_id and title required
  - read_time and lesson_order must be numbers
  - App content requires all 4 fields

Response format:
  Success: { success: true, data: ... }
  Error:   { success: false, message: "..." }
  404:     { success: false, message: "Not found" }

CORS: allow localhost:5173, localhost:4173,
  https://admin.masterreactnative.dev, https://masterreactnative.dev

Use Node.js CommonJS (require/module.exports), NOT TypeScript.

.env.example:
  PORT=5000
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=course_learning
  DB_SSL=false
  DB_CONNECT_TIMEOUT=10000

DO NOT add authentication, DO NOT touch any other folder, DO NOT use TypeScript.

When done, show me the file tree and contents of package.json and src/app.js. Then STOP.
```

5. **Watch Claude Code work.** It will ask permission before creating files or running commands — click **Accept** or **Allow** each time. Read what it writes — this is how you learn what code looks like.

### 6b. Test the backend on your Mac

After Claude Code finishes, install MySQL on your Mac and test:

```bash
brew install mysql
brew services start mysql
```

Create the database:

```bash
mysql -u root
```

You're now in the MySQL prompt (you see `mysql>`). Type each line and press Enter:

```sql
CREATE DATABASE course_learning;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'devpassword';
GRANT ALL PRIVILEGES ON course_learning.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

Configure and start the backend:

```bash
cd ~/Projects/Master-RN/backend-api
cp .env.example .env
```

Open `.env` in VS Code (click it in the sidebar) and change:
```
DB_USER=app_user
DB_PASSWORD=devpassword
DB_NAME=course_learning
```
Save (Cmd+S).

```bash
npm install
npm start
```

You should see "Server running on port 5000" or similar.

**Test it** — open a second terminal tab (click + in terminal panel):

```bash
curl http://localhost:5000/health
```

Should print: `{"success":true,"message":"API is running"}`

```bash
curl http://localhost:5000/api/modules
```

Should print: `{"success":true,"data":[]}`

```bash
curl -X POST http://localhost:5000/api/modules \
  -H "Content-Type: application/json" \
  -d '{"title":"React Basics","background_color":"#F26A4A"}'
```

Should print the created module.

**If any test fails:** Copy the error and paste it into Claude Code — it will fix it.

Press **Ctrl+C** in the first terminal to stop the server when done testing.

### 6c. Deploy to server

> Do this AFTER Step 5 (server cleanup) is complete.

Push your code to GitHub first:

```bash
cd ~/Projects/Master-RN
git add .
git commit -m "backend api"
git push
```

SSH into the server and set up the backend:

```bash
ssh root@168.144.82.96

# Clone your repo
cd /opt
git clone https://github.com/devboysamm/Master-RN.git
cd Master-RN/backend-api

# Create production .env
nano .env
```

Type this in nano (I'll give you the real DB password after Step 5):

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=app_user
DB_PASSWORD=REAL_PASSWORD_HERE
DB_NAME=course_learning
DB_SSL=false
DB_CONNECT_TIMEOUT=10000
NODE_ENV=production
```

Save: **Ctrl+O → Enter → Ctrl+X**

```bash
# Install and start
npm install --production
pm2 start src/server.js --name api
pm2 save
pm2 startup
```

Test from your Mac (new terminal):

```bash
curl https://api.masterreactnative.dev/health
```

✅ **Backend is DONE when this returns `{"success":true,"message":"API is running"}`**

---

## STEP 7: Build the admin panel

> ⏱ Uses ~2–3 Claude Code sessions.

### 7a. Claude Code prompt

Type `/clear` in Claude Code to start fresh. Then paste:

```
You are building the admin panel for Master RN — a website I use to
create and manage modules and lessons.

READ FIRST:
1. promt.html — the "Admin Panel" section
2. If admin-screens.jsx exists, read it for the visual design
3. If mobile-shared.jsx exists, read it for the color palette (MRN object)

Colors to use (the Master RN palette):
  Coral: #F26A4A    Coral deep: #D9532F    Coral soft: #FBD7C8
  Cream bg: #F5EFE6    Card: #FBF6EE    Ink: #161311
  Ink soft: #6B6560    Mute: #A09890    Yellow: #F5C24B
  Mint: #9EC9A8    Font: Manrope    Code font: JetBrains Mono

Create admin-panel/ as a React + Vite app:

admin-panel/
  index.html
  package.json
  vite.config.js
  .env.example          ← VITE_API_BASE_URL=http://localhost:5000
  src/
    main.jsx
    App.jsx             ← React Router with sidebar navigation
    styles.css          ← Manrope + JetBrains Mono from Google Fonts
    theme/tokens.js     ← all colors as constants
    api/client.js       ← axios, base URL from env, 20s timeout, 2 retries
    pages/
      Dashboard.jsx     ← KPI cards (modules, lessons, read time, API health),
                           latest lessons table, quick action buttons
      Modules.jsx       ← list with search + sort, create/edit/delete
      ModuleEdit.jsx    ← form for all module fields + color picker
      Lessons.jsx       ← list grouped by module, create/edit/delete
      LessonEditor.jsx  ← left: form + HTML editor with template buttons
                           right: live preview with DOMPurify + highlight.js
      Settings.jsx      ← API health check, App Content editor
    components/
      Sidebar.jsx       ← ink bg sidebar, coral active item
      KPICard.jsx
      Modal.jsx

Design:
  - Left sidebar: ink #161311 background, coral active highlight
  - Main area: cream #F5EFE6 background
  - Cards: #FBF6EE background, 22px border radius
  - Buttons: coral pill-shaped, white text
  - Manrope font everywhere, JetBrains Mono for code

API calls hit: GET/POST/PUT/DELETE /api/modules, /api/lessons,
GET/PUT /api/app-content, GET /health

DO NOT add authentication. DO NOT touch backend-api/ or mobile-app/.
Use plain JavaScript (JSX), NOT TypeScript.

When done, show file tree and App.jsx. STOP.
```

### 7b. Test locally

Make sure the backend is running:

```bash
cd ~/Projects/Master-RN/backend-api && npm start
```

In another terminal:

```bash
cd ~/Projects/Master-RN/admin-panel
cp .env.example .env
npm install
npm run dev
```

Open Safari → **http://localhost:5173**

Test: create a module → create a lesson → see the live preview → delete them. If everything works, the admin panel is ready.

### 7c. Deploy to server

```bash
cd ~/Projects/Master-RN/admin-panel
echo "VITE_API_BASE_URL=https://api.masterreactnative.dev" > .env.production
npm run build
rsync -avz --delete dist/ root@168.144.82.96:/var/www/admin/
ssh root@168.144.82.96 "nginx -t && systemctl reload nginx"
```

Push to GitHub too:

```bash
cd ~/Projects/Master-RN && git add . && git commit -m "admin panel" && git push
```

Open Safari → **https://admin.masterreactnative.dev** — you should see your admin panel.

✅ **Admin panel is DONE when you can create a module at admin.masterreactnative.dev**

---

## STEP 8: Build the mobile app — Phase 1 (Foundations)

> ⏱ ~12–18 Claude Code sessions total for the mobile app, over 2–4 weeks.
> Do ONE phase per Claude Code session. Type `/clear` between phases.

### 8a. Create the Expo project

```bash
cd ~/Projects/Master-RN
npx create-expo-app mobile-app -t expo-template-blank-typescript
```

Set your bundle identifier — open `mobile-app/app.json` in VS Code and replace the `"expo"` section:

```json
{
  "expo": {
    "name": "Master RN",
    "slug": "master-rn",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "light",
    "ios": {
      "bundleIdentifier": "dev.masterreactnative.app",
      "buildNumber": "1",
      "supportsTablet": false
    },
    "android": {
      "package": "dev.masterreactnative.app"
    }
  }
}
```

**What bundleIdentifier means:** This is your app's permanent ID in Apple's system. Like a social security number — set once, never change. `dev.masterreactnative.app` mirrors your domain.

### 8b. Claude Code prompt — Foundations

Type `/clear` in Claude Code. Then paste:

```
You are building the Master RN mobile app — a React Native (Expo,
TypeScript) learning app.

READ FIRST (in this order):
1. BUILD_BRIEF.md — the ENTIRE file. This is your master reference.
2. mobile-shared.jsx — if it exists, read the MRN object (color tokens)
   and I object (icon paths)
3. STATUS.md — update this as you complete items

PHASE 1 — Foundations ONLY. Create inside mobile-app/:

1. Folder structure: src/{theme, components, screens, navigation, api,
   storage, hooks, context}

2. src/theme/tokens.ts — every color, radius, spacing value:
   coral '#F26A4A', coralDeep '#D9532F', coralSoft '#FBD7C8',
   cream '#F5EFE6', card '#FBF6EE', cardAlt '#F0E8DB',
   ink '#161311', inkSoft '#6B6560', mute '#A09890',
   rule '#E6DFD5', yellow '#F5C24B', mint '#9EC9A8'
   Font: 'Manrope', Mono: 'JetBrains Mono'
   Radii: 10, 14, 16, 18, 20, 22, 26, 32, 999

3. src/theme/icons.ts — SVG path strings for all icons (from the I object
   in mobile-shared.jsx if available, otherwise create standard icons for:
   home, explore/compass, progress/chart, chat, profile/user, bookmark,
   settings, back arrow, check, code, clock, lock, bell, search, share)

4. src/theme/typography.ts — type scale:
   Display 32/800, Section 22/800, Title 16/700, Body 13/600,
   Label 11/700 letterSpacing 0.4, Code 12/JetBrains Mono

5. src/theme/spacing.ts — scale: 4,6,8,10,12,14,16,18,20,22,24,28,32

6. App.tsx — load fonts: Manrope (400,500,600,700,800) via
   @expo-google-fonts/manrope and JetBrains Mono (400,600,700) via
   @expo-google-fonts/jetbrains-mono. Hold splash with
   SplashScreen.preventAutoHideAsync until fonts load.

7. Components in src/components/:
   Icon.tsx — SVG path renderer using react-native-svg
   Chip.tsx — pill-shaped chip
   PillButton.tsx — full-width pill button
   CodeBlock.tsx — dark code display box, JetBrains Mono

8. src/components/TopHeader.tsx — avatar with gradient ring + greeting

9. src/components/TabBar.tsx — floating bottom bar: ink bg, 64px tall,
   14px side margins, 18px bottom margin, 32px radius. 5 tabs (Home,
   Explore, Progress, Chat, Profile). Active: coral 44px circle + white
   icon. Inactive: white icon 45% opacity.

10. src/screens/dev/Tokens.tsx — renders all colors + text styles for
    visual verification

Install: react-native-svg, @expo-google-fonts/manrope,
@expo-google-fonts/jetbrains-mono, expo-splash-screen,
@react-navigation/native, @react-navigation/bottom-tabs,
@react-navigation/native-stack, react-native-screens,
react-native-safe-area-context, react-native-gesture-handler,
react-native-reanimated

RULES:
- Zero hardcoded hex in components — all from tokens.ts
- Zero inline SVG paths — all from icons.ts
- StyleSheet.create for all styles
- TypeScript strict mode

When done: list all files, show tokens.ts contents, update STATUS.md
Phase 1 checkboxes. Tell me to run: cd mobile-app && npx expo start --ios
STOP. Do NOT start Phase 2.
```

### 8c. See your app for the first time

```bash
cd ~/Projects/Master-RN/mobile-app
npx expo start --ios
```

The iOS Simulator opens showing your app. You should see the tokens/colors test screen.

If you get errors, copy the red text and paste it into Claude Code.

---

## STEP 9: Mobile Phase 2 — Auth screens

Type `/clear` in Claude Code. Paste:

```
Master RN mobile app. Phase 1 (Foundations) is complete.

READ: BUILD_BRIEF.md sections "01 Splash", "02 Welcome", "03 Auth"
READ: mobile-screens-1.jsx if it exists (ScreenSplash, ScreenWelcome, ScreenAuth)
READ: STATUS.md

BUILD PHASE 2 (Auth flow):

1. src/screens/auth/Splash.tsx
   Full-screen ink (#0B0907) background. Centered atom logo: 3 elliptical
   orbits at 0°/60°/120°, stroke 7px, nucleus circle r=14 in coral.
   "MASTER RN" wordmark: Manrope 800, 28px, white.
   Tagline: "// LEARN · SHIP · NATIVE" in JetBrains Mono 700, 11px.
   Animate with react-native-reanimated: fade in 700ms, stagger 200ms.
   Auto-navigate to Welcome after 2 seconds.

2. src/screens/auth/Welcome.tsx
   Cream background. Coral geometric illustration area (abstract SVG shapes).
   "Master React Native" heading. Two buttons:
   "Get started" (coral bg, white text → Auth screen)
   "Continue as guest" (ink border, transparent → main app)

3. src/screens/auth/Auth.tsx
   Segmented tabs: Sign up | Sign in. Form fields with cream bg, 10px radius.
   Sign up: name, email, password + strength meter. Sign in: email, password.
   Use react-hook-form. FOR V1: buttons are stubs — they store a mock user
   in AsyncStorage and navigate to main app. No real backend auth.

4. src/context/AuthContext.tsx
   Provides {user, isGuest, signIn, signUp, signOut, continueAsGuest}.
   All auth methods are STUBS for v1 — just AsyncStorage.

5. src/storage/auth.ts — AsyncStorage helpers for user + guest flag

6. src/navigation/RootNavigator.tsx
   No user + not guest → Auth stack (Splash → Welcome → Auth)
   User or guest → Main tab navigator

Install: react-hook-form, @react-native-async-storage/async-storage

When done: update STATUS.md. Flow: launch → Splash animates → Welcome →
"Get started" → Auth form → "Create account" → main app. STOP.
```

---

## STEP 10: Mobile Phase 3 — Core screens

Type `/clear`. Paste:

```
Master RN mobile app. Phases 1-2 complete.

READ: BUILD_BRIEF.md sections "04 Home" through "08 Lesson Code"
READ: mobile-screens-1.jsx and mobile-screens-2.jsx if they exist
READ: STATUS.md

BUILD PHASE 3:

1. src/api/mock.ts — 5 modules with 3-4 lessons each. Realistic React
   Native content with HTML (<h2>, <p>, <pre><code>). Real code examples.

2. src/screens/app/Home.tsx — TopHeader, continue learning card, category
   chips scroller, start-here module cards, featured card. ScrollView.

3. src/screens/app/Modules.tsx — all modules in cards with colored bar,
   icon, title, lesson count, total read time. Tap → ModuleDetail.

4. src/screens/app/ModuleDetail.tsx — ink hero with dotted grid + coral
   glow + ghost </> watermark. Title, description, prerequisite chips,
   lessons list with bookmark icon + completion checkmark.

5. src/screens/app/LessonReader.tsx — compact ink header, bookmark toggle,
   HTML content via react-native-render-html, CodeBlock for code blocks.

6. src/screens/app/LessonCode.tsx — same as Reader, code-focused layout.

7. src/components/SlideToComplete.tsx — drag knob to 80% → onComplete.
   PanGestureHandler + reanimated. Green flash on completion.

Install: react-native-render-html

When done: update STATUS.md. Flow: Home → tap module → ModuleDetail →
tap lesson → Reader → slide to complete. STOP.
```

---

## STEP 11: Mobile Phase 4 — Personal screens

Type `/clear`. Paste:

```
Master RN mobile app. Phases 1-3 complete.

READ: BUILD_BRIEF.md "09 Bookmarks", "11 Profile", "12 Settings"
READ: mobile-screens-3.jsx if it exists
READ: STATUS.md

BUILD PHASE 4:

1. src/screens/app/Bookmarks.tsx — stats card "X bookmarks · Y min",
   list of bookmarked lessons, empty state.

2. src/screens/app/Profile.tsx — ink hero + dotted grid, avatar with
   coral-yellow gradient ring, name/email, streak chip, 3-col stats
   (completed, bookmarks, minutes), menu rows (all show "Coming soon" toast).

3. src/screens/app/Settings.tsx — theme picker (Light/Dark/System cards,
   just STORE preference, don't implement dark mode for v1), toggle rows,
   "Reset local data" destructive button, about section.

4. src/storage/bookmarks.ts — get/add/remove/isBookmarked via AsyncStorage
5. src/storage/completed.ts — get/markCompleted/isCompleted via AsyncStorage
6. src/storage/theme.ts — get/set theme preference via AsyncStorage

When done: update STATUS.md. Test: bookmark → force-quit → reopen →
still bookmarked. STOP.
```

---

## STEP 12: Mobile Phase 5 — AI Chat (coming soon shell)

Type `/clear`. Paste:

```
Master RN mobile app. Phases 1-4 complete. AI Chat is "Coming in v1.1."

READ: BUILD_BRIEF.md "10 AI Chat"

BUILD:
src/screens/app/AIChat.tsx — header with atom avatar + "Master AI" +
"Online". ScrollView with hardcoded sample conversation: AI greeting,
user question about useState, AI response with code block, suggestion
chips. Composer at bottom but covered by semi-transparent ink overlay
(85% opacity) with "Coming in v1.1" in coral JetBrains Mono. TextInput
is editable={false}. Chips are no-op.

When done: update STATUS.md. STOP.
```

---

## STEP 13: Mobile Phase 6 — Connect to real backend

Type `/clear`. Paste:

```
Master RN mobile app. All 12 screens built with mock data.

READ: promt.html "API endpoints" and "Response shape"
READ: BUILD_BRIEF.md Phase 6

REPLACE mock data with real API calls:

1. src/api/client.ts — fetch wrapper, base URL from
   EXPO_PUBLIC_API_BASE_URL (fallback https://api.masterreactnative.dev),
   30s timeout, error handling. Fall back to mock.ts in __DEV__ if offline.

2. src/api/modules.ts — getModules, getModule(id), getModuleLessons(id)
3. src/api/lessons.ts — getLesson(id)

4. Create mobile-app/.env:
   EXPO_PUBLIC_API_BASE_URL=https://api.masterreactnative.dev

5. Wire into: Home, Modules, ModuleDetail, LessonReader, LessonCode

6. Add to EVERY screen that fetches: loading skeleton (coral pulse),
   error state ("Couldn't load" + retry button), empty state.

When done: update STATUS.md. Create module in admin → pull-to-refresh
in mobile app → appears. STOP.
```

---

## STEP 14: Mobile Phase 7 — Icons, splash, EAS config

Type `/clear`. Paste:

```
Master RN mobile app is wired to the real backend. Prep for App Store.

READ: BUILD_BRIEF.md Phase 7

1. Generate mobile-app/assets/icon.png 1024×1024 — coral #F26A4A
   squircle, atom mark centered. No transparency, no rounded corners.

2. Generate mobile-app/assets/adaptive-icon.png 1024×1024 — atom mark
   on transparent bg.

3. Generate mobile-app/assets/splash.png 1284×2778 — dark #0B0907 bg,
   atom mark + "MASTER RN" centered.

4. Update app.json: splash backgroundColor "#0B0907", resizeMode "contain"

5. Create mobile-app/eas.json with development, preview, production profiles.

6. Add accessibilityLabel to every Pressable/TouchableOpacity.

Show icon.png, splash.png, app.json, eas.json. Confirm bundleIdentifier
is "dev.masterreactnative.app", version "1.0.0". Update STATUS.md. STOP.
```

Push everything:

```bash
cd ~/Projects/Master-RN && git add . && git commit -m "mobile app complete" && git push
```

✅ **Mobile app is DONE when all STATUS.md boxes are checked.**

---

## STEP 15: Create privacy and support pages

Apple requires these URLs. SSH into your server:

```bash
ssh root@168.144.82.96
mkdir -p /var/www/main

cat > /var/www/main/privacy.html << 'EOF'
<!DOCTYPE html>
<html><head><title>Privacy Policy - Master RN</title>
<style>body{font-family:system-ui;max-width:600px;margin:40px auto;padding:20px;}</style>
</head><body>
<h1>Privacy Policy</h1>
<p>Last updated: May 2026</p>
<p>Master RN does not collect, store, or share any personal information.
All bookmarks, progress, and preferences are stored locally on your device.
No analytics, advertising, or tracking.</p>
<p>Contact: YOUR_EMAIL</p>
</body></html>
EOF

cat > /var/www/main/support.html << 'EOF'
<!DOCTYPE html>
<html><head><title>Support - Master RN</title>
<style>body{font-family:system-ui;max-width:600px;margin:40px auto;padding:20px;}</style>
</head><body>
<h1>Support</h1>
<p>Need help? Contact YOUR_EMAIL</p>
</body></html>
EOF
```

---

## STEP 16: Register app with Apple

### 16a. Create App ID

1. Go to **developer.apple.com** → sign in → **Account**
2. **Certificates, Identifiers & Profiles** → **Identifiers** → click **+**
3. **App IDs** → Continue → **App** → Continue
4. Description: `Master RN`
5. Bundle ID: Explicit → `dev.masterreactnative.app`
6. Continue → Register

### 16b. Create app listing

1. Go to **appstoreconnect.apple.com** → sign in
2. **My Apps** → **+** → **New App**
3. Platform: **iOS**
4. Name: **Master RN**
5. Primary Language: **English (U.S.)**
6. Bundle ID: select `dev.masterreactnative.app`
7. SKU: `master-rn-001`
8. User Access: **Full Access**
9. Click **Create**

---

## STEP 17: Build and submit to App Store

### 17a. Build

```bash
cd ~/Projects/Master-RN/mobile-app
eas build --platform ios --profile production
```

Takes 10–20 minutes. First time it asks for Apple credentials — enter them and let EAS manage certificates automatically.

### 17b. Submit

```bash
eas submit --platform ios --latest
```

### 17c. Take screenshots

```bash
npx expo start --ios
```

In Simulator: menu → **Device → iPhone 15 Pro Max** (for 6.7" screenshots). Navigate to each screen and press **Cmd+S** to save. Take at least 3: Home, Module Detail, Lesson Reader.

### 17d. Fill in App Store Connect

1. appstoreconnect.apple.com → Master RN → your version
2. Upload screenshots to the 6.7" section
3. Description: "Master React Native — a learning app with structured modules, interactive lessons, code examples, bookmarks, and progress tracking."
4. Keywords: react native, learn coding, mobile development, programming
5. Support URL: `https://masterreactnative.dev/support`
6. Privacy URL: `https://masterreactnative.dev/privacy`
7. Category: **Education**
8. Age Rating: answer all "None" → result is 4+
9. Pricing: **Free**
10. App Review Notes: "No login required. Tap 'Continue as guest' on the welcome screen."
11. Select your build
12. **Submit for Review**

### 17e. Wait

Apple reviews in 24–72 hours. If rejected: fix the issue, bump `buildNumber` in app.json from `"1"` to `"2"`, run `eas build` + `eas submit` again.

---

## 🎉 STEP 18: Your app is live

Once approved, search "Master RN" in the App Store on your iPhone.

---

## QUICK REFERENCE

**Claude Code in VS Code:**
- Open: click Claude icon in sidebar
- Clear session: type `/clear`
- Check usage: type `/status`
- Accept file changes: click Accept when prompted

**Terminal shortcuts:**
- Open terminal: Ctrl+` (backtick)
- New tab: click + in terminal panel
- Stop running server: Ctrl+C

**Git push workflow:**
```bash
cd ~/Projects/Master-RN
git add .
git commit -m "describe what changed"
git push
```

**Pro plan tip:** One phase per `/clear` session. Don't pile multiple phases into one conversation — it burns tokens faster and gives worse results.

---

## YOUR NEXT STEP RIGHT NOW

**Step 4.** SSH into the server and run the discovery commands. Paste the output to me. I'll write Step 5 (cleanup) and we keep going.

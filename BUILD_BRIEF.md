# 📦 Master RN — Pixel-Perfect Build Brief

> Hand this entire file to Claude Code (or any coding agent). It contains everything needed to ship the mobile app **identical** to the designs in this project.

---

## 🚀 Master Prompt (paste verbatim as your first message)

You are building the production React Native app for **"Master RN"** (`master-rn`) — a learning app teaching React Native through modules and lessons. **Match the designs in this repo pixel-for-pixel.** Same colors, same radii, same typography, same component anatomy. Treat the design files as the spec.

**Source of truth (in priority order):**
1. `mobile-shared.jsx` — design tokens (the `MRN` object). **Only** place colors are defined. Mirror it into `src/theme/tokens.ts` exactly.
2. `mobile-screens-1.jsx`, `mobile-screens-2.jsx`, `mobile-screens-3.jsx` — every mobile screen as React JSX. Re-implement each in React Native using the mapping rules in §4.
3. `Master React Native - Logo.html` — brand mark + construction sheet. The atom is **3 orbits** at **0°/60°/120°** rotation, each `rx=84 ry=32`, stroke width 7, in `#1A1410` on a `#F26A4A` squircle, nucleus radius 14.
4. `Master React Native - Designs.html` — the canvas that assembles all 12 screens. Visual reference only.
5. `promt.html` — backend API contract, schema, endpoints, env vars. Follow strictly.

**Rules of engagement:**
1. **Never hardcode a hex.** Every color comes from `tokens.ts`. If a screen uses a color not in the `MRN` object, stop and ask.
2. **Never invent a layout.** If a design detail is ambiguous, quote the exact JSX lines and ask before deciding.
3. **Build one screen at a time** in the order in §6. After each, give me a test checklist.
4. **No filler.** Don't add screens, sections, or copy that isn't in the designs.
5. **Match radii exactly.** Design system uses: 10, 14, 16, 18, 20, 22, 26, 32, 999 (pill), 50% (circle). Pull from `tokens.ts`.
6. **Match icon paths exactly.** Port the `I` object from `mobile-shared.jsx` into `src/theme/icons.ts` — same SVG paths, same names. Use `react-native-svg`.
7. **Auto-save indicator format:** `Auto-saved Xs ago` with a 6px coral dot. Same string everywhere.
8. **Tagline format is locked:** `// LEARN · SHIP · NATIVE` in JetBrains Mono 700, uppercase, 1.4 tracking. Coral `//` and `·`, white/mute text. Flanked by 18×1px coral hairlines at 50% opacity.

---

## 📋 §1 — Tech Stack (no deviation)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Expo SDK 51+** with TypeScript | Easiest first-time RN |
| Navigation | `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack` | 5-tab bottom nav + stacks |
| State | React Context + `useReducer` | Project is small, no Redux |
| Storage | `@react-native-async-storage/async-storage` | Bookmarks, completed, theme, auth token |
| Fonts | `@expo-google-fonts/manrope` + `@expo-google-fonts/jetbrains-mono` | Match design exactly |
| Icons | **Inline SVG via `react-native-svg`**, paths from `I` object | Pixel-identical to designs |
| HTML lessons | `react-native-render-html` + custom code-block renderer | Per `promt.html` spec |
| HTTP | Bare `fetch` wrapped in `src/api/client.ts` | No Axios needed |
| Gestures + anim | `react-native-reanimated` v3 + `react-native-gesture-handler` | For splash entrance + slide-to-complete |
| Forms | `react-hook-form` | Auth screens |
| Auth | Email/password + Google + Apple + GitHub OAuth + guest | Per design |

---

## 🎨 §2 — Design Tokens

Mirror this **exactly** into `src/theme/tokens.ts`. This is the single source of truth for color across the app.

```ts
export const colors = {
  coral:      '#F26A4A',   // primary brand
  coralDeep:  '#D9532F',
  coralSoft:  '#FBD7C8',
  cream:      '#F5EFE6',   // light bg
  card:       '#FBF6EE',
  cardAlt:    '#F1E9DC',
  ink:        '#161311',
  inkSoft:    '#3B342F',
  mute:       '#8C8378',
  rule:       'rgba(22,19,17,0.08)',
  yellow:     '#F5C24B',
  yellowSoft: '#FCEAB5',
  mint:       '#9EC9A8',
  blush:      '#F2C5B5',
  ok:         '#3F8A57',
  splashBg:   '#0B0907',   // splash + welcome bg
  atomInk:    '#1A1410',   // atom orbits/nucleus (lifted from ink)
};

export const radii = {
  sm: 6, md: 10, lg: 14, xl: 16, '2xl': 18,
  '3xl': 22, '4xl': 26, pill: 9999,
};

export const spacing = {
  0.5: 2, 1: 4, 1.5: 6, 2: 8, 2.5: 10,
  3: 12, 4: 16, 5: 20, 6: 24, 8: 32,
};

export const type = {
  family: { sans: 'Manrope', mono: 'JetBrainsMono' },
  size:   { xs: 9, sm: 11, base: 13, md: 14, lg: 16, xl: 18, '2xl': 22, '3xl': 28, '4xl': 32 },
  weight: { regular: '400', medium: '600', bold: '700', black: '800' },
};
```

> **Test gate:** build a `/dev/Tokens` screen that renders every color swatch + every type style. Ship nothing else until this screen looks identical to the design system card in `Master React Native - Designs.html`.

---

## 🧭 §3 — Navigation Structure

```
RootStack
├── Auth (no tabs)
│   ├── Splash         // first launch
│   ├── Welcome        // 02 in design
│   └── Auth           // 03 — segmented sign up/sign in
└── App (BottomTabs)   // shown after login OR "guest"
    ├── Home tab       // Stack
    │   └── Home
    ├── Explore tab    // Stack — this is where modules live
    │   ├── Modules
    │   ├── ModuleDetail
    │   ├── LessonReader
    │   └── LessonCode
    ├── Progress tab   // Stack — Bookmarks lives here
    │   └── Bookmarks
    ├── Chat tab       // Stack
    │   └── AIChat
    └── Profile tab    // Stack
        ├── Profile
        └── Settings
```

**Tab bar spec** (re-implement exactly from `mobile-shared.jsx` `TabBar`):
- 64px tall
- ink bg (`colors.ink`)
- 14px side margin, 18px bottom margin
- 32px border radius
- Active tab: coral 44×44 circle highlight, white icon at 22px
- Inactive: transparent, icon in `rgba(255,255,255,0.45)`

---

## 🔄 §4 — JSX → React Native Mapping

| JSX (web) | React Native |
|---|---|
| `<div style={{…}}>` | `<View style={…}>` |
| Inline text / `<span>` | `<Text style={…}>` (text **only** inside `<Text>`) |
| `display: flex` | `<View>` (default flex column) or `flexDirection: 'row'` |
| `display: grid` + `gridTemplateColumns` | Build manually with flex `flex: n` children |
| `background: …` | `backgroundColor: …` |
| `borderRadius` | same |
| `rgba(…)` colors | same — RN supports rgba |
| Inline `<svg>` | `<Svg>` from `react-native-svg`; paths/circles/ellipses 1:1 |
| `overflowX: 'auto'` (sliders) | `<ScrollView horizontal showsHorizontalScrollIndicator={false}>` |
| `<code>` inline | `<Text style={{ fontFamily: 'JetBrainsMono', backgroundColor: colors.cardAlt, paddingHorizontal: 6, borderRadius: 4 }}>` |
| `position: 'absolute'` | same (works in RN) |
| `boxShadow` | iOS: `shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius`; Android: `elevation` |
| `linear-gradient` bg | `expo-linear-gradient` → `<LinearGradient colors={[…]}>` |
| `backdrop-filter: blur` | `<BlurView>` from `expo-blur` |
| `flexWrap: 'wrap'` | same |
| `gap` | same (RN supports since 0.71) |

**The `<Phone>` wrapper from `mobile-shared.jsx` does not get re-implemented** — it's a design canvas frame only. Use Expo's `SafeAreaView` from `react-native-safe-area-context`.

**Critical SVG gotcha:** RN's `react-native-svg` doesn't parse the `transform="rotate(60 110 110)"` attribute string. Wrap rotated elements in `<G rotation={60} originX={110} originY={110}>` instead.

---

## 📱 §5 — Screen-by-Screen Specifications

Build each screen by reading the named function in the .jsx files. Below are the **non-obvious details** the agent must not miss.

### 01 · Splash (`ScreenSplash`)
- Background: `colors.splashBg` (`#0B0907`) — **not** pure black
- Coral radial glow centered at 42% from top, 240×240, blurred 6px
- Atom SVG: 92×92, coral squircle path, dark orbits, dark nucleus
- Wordmark: 28px, weight 800, letterSpacing -0.7, "Master " white + "RN" coral
- Tagline row: 18×1px coral hairlines (opacity 0.5) flanking, JetBrainsMono 9px 700, letterSpacing 1.4
- Version "v1.0.0" pinned 24px from bottom, white 30%
- **Entrance animation** (Reanimated): logo → wordmark → tagline, each 700ms `ease-out`, 200ms stagger

### 02 · Welcome (`ScreenWelcome`)
- Same bg + glow as splash, glow positioned 18% from top, 340×340
- Logo 84×84
- **No "Welcome. How would you start?" headline** — removed for App Store compliance
- 3 buttons: Create account (coral primary), Sign in (glass), social row (Google/Apple/GitHub equal flex)
- Guest link: `or continue as guest` — "continue as guest" coral underline
- Footer: terms & privacy in 10px white 35%

### 03 · Auth (`ScreenAuth`)
- Dark theme (`colors.splashBg`), coral glow top-right (280×280)
- Atom 32×32 in top-right corner (use stroke-width 12 for legibility at small size)
- Mono kicker `GET STARTED` in coral
- Segmented tabs: glass bg with 1px white-08 border, coral active, mute inactive
- Inputs: 13px padding, glass bg `rgba(255,255,255,0.06)`, 1px white-10 border, 14px radius
- Mono uppercase labels (e.g. `EMAIL`)
- Password show/hide eye icon on the right
- Password strength meter: 4 bars, 3 coral when "Strong"
- CTA: coral 18px radius pill, 16px padding, white text 800 14px

### 04 · Home (`ScreenHome`)
- **TopHeader:** avatar gradient coral→yellow, mute "Welcome back, John" + progress bar with coral pill showing %
- **Continue card:** ink bg, coral radial glow top-right, coral play button 44×44 left, mono `CONTINUE · M02 · L03` in white 50%, title 14/800, progress bar coral on white-12 track
- **Categories:** horizontal scroller. Active = ink/white, inactive = card/inkSoft, 1px rule border
- **Start here:** 3 lessons. First = 1.5px coral border + coral number badge + coral arrow. Others = rule border + cardAlt number + mute arrow. "NEW" coral pill next to section title
- **Featured:** yellow bg with stacked-card depth effect, dark "GO" pill, ink circle 68×68 with coral `</>` text

### 05 · Modules (`ScreenModules`)
- Header: back (38×38 circle) + "All Modules" 14/700 + filter (38×38)
- Page title 30/800/-0.6
- Module cards: row layout, 70×78 GeoArt **image slot** (leave empty per spec), mono `MODULE 0X` coralDeep, title 16/800, mute meta `8 lessons · 1h 04m`, 5px progress bar (coral, or `colors.ok` when 100%), % on right 11/800

### 06 · Module Detail (`ScreenModuleDetail`)

**Hero (this is the signature treatment — match it exactly):**
- Background: `colors.ink`
- Dotted grid pattern (22×22 spacing, 0.8r dots, `rgba(255,255,255,0.08)`) — use SVG `<Pattern>`
- Linear-gradient fade overlay (ink 0% → ink 95%) for depth
- Coral radial glow top-right (160×160, blurred to feathered)
- **Ghost `</>` watermark** in top-right: JetBrainsMono 800, 88px, `rgba(242,106,74,0.10)`, letterSpacing -4
- Coral 4×14 accent bar next to "MODULE 02" mono label
- Title 28/800/lineHeight 1.05
- 3 chips: 2 in `rgba(255,255,255,0.10)`, "Beginner" in coral

**Prerequisites slider (right below hero):**
- Header row: mono uppercase label + "swipe →" hint in coralDeep
- Pills: `colors.coralSoft` bg, 1px coral border, 12/800 coralDeep text
- Horizontal ScrollView with right-edge mask gradient

**Lessons list:**
- Cream card 22px radius, 6px padding wrapper
- Each row: 34×34 number circle (`colors.ok` for done, coral for current, cardAlt for upcoming), title 14/700, mute 11/600 subtitle, bookmark icon on right (coral if saved)

### 07 · Lesson Reader (`ScreenLessonReader`)
- **Compact ink header**, 12px padding only — no big illustration (user explicitly removed it)
- Back / "Lesson 3/8" / heart icons
- Coral pill chip with module name below header
- Title 26/800/-0.4 tracking
- Mute meta row: clock icon + "5 min read", layers icon + "4 examples"
- Body text 14/inkSoft/lineHeight 1.6
- Section header 16/800
- CodeBlock component: ink bg `#16110d`, mono 11/lineHeight 1.7, line numbers in `rgba(245,239,230,0.35)`

### 08 · Lesson Code (`ScreenLessonCode`)

**Slide-to-complete control** at the bottom (the redesigned one):
- Ink pill, 56px tall, 4px padding, 999px radius
- Coral knob 48×48 with shadow `0 6px 16px rgba(242,106,74,0.45)`, arrow-right icon inside
- Coral progress fill behind (linear-gradient coralDeep → coral), 18% opacity, currently 38% width
- Center label: "Slide to complete" 12/800 white, "LESSON 3 / 8" 9/700 mono white-45
- Faded check icon on right end (white 35%)

**To implement:** `PanGestureHandler` + Reanimated `useAnimatedStyle` driving knob X. Fire `markComplete()` when knob reaches 80% of track width.

### 09 · Bookmarks (`ScreenBookmarks`)
- Page title 30/800, mute subtitle
- **Stats card:** ink bg, coral atom decoration top-right (rotated coral circle + thin yellow curve), 2-column divided ("BOOKMARKS / 12" and "TOTAL READ / 1h 18m"), big 30/800 numbers
- List rows: 56×56 image slot (leave empty), mod name mono coralDeep uppercase, title 14/800, mute meta, bookmark icon coral

### 10 · AI Chat (`ScreenAIChat`)
- Header: back + atom-avatar in ink 32×32 circle with coral `</>` + "Native AI" / "● online" (ok green) + more icon
- AI bubble: card bg, top-left corner 6px (other corners 20px), inkSoft text 13.5/lineHeight 1.45, mute timestamp underneath
- User bubble: coral bg, white text 600, top-right corner 6px, right-aligned
- Code embedded in AI bubble using CodeBlock
- Suggestion chips: cardAlt bg, ink fg
- **Composer:** card bg 26px radius, mute placeholder 13/600, coral send button 40×40

### 11 · Profile (`ScreenProfile`)
- Header: back + "Profile" 14/800 + gear (all 38×38 circles)
- **Hero (same treatment as Module Detail):** ink bg, dotted grid, coral glow, ghost `</>`
- Avatar 64×64 with **coral→yellow gradient** background, white initial, 3px white-15 border
- "MEMBER · LV3" in mono coral with 3×12 coral accent bar
- Name 20/800/-0.3, mute @handle below
- Streak chip in coral, level chip in white-10
- **Stats row:** 3 equal columns in card bg, big number 18/800, mute label 10/700 letterSpacing 0.3
- **Menu rows:** 36×36 cardAlt icon container, 14/700 title, mute right-side text, mute chevron

### 12 · Settings (`ScreenSettings`)
- Header: back + "Settings" + spacer
- "Preferences" 30/800/-0.6, mute subtitle
- **Theme picker card:** 3 mini-cards. Light = cream, Dark = ink, System = split linear-gradient at 135°. Active border 2px coral. Each mini-card has 56px height swatch with mock text lines.
- **General list:** 36×36 icon containers, 44×26 toggle pills (coral on / cardAlt off, 20×20 white knob), or mute right text
- **Destructive "Reset local data" row:** blush bg icon container, coralDeep text 14/700
- Footer: `v1.0.0 · API connected ●` in 11/600 mute

---

## 🛠 §6 — Build Order

```
Phase 1 — Foundations
  □ Init Expo TS project: npx create-expo-app master-rn -t expo-template-blank-typescript
  □ src/ tree: theme/ components/ screens/ navigation/ api/ storage/ hooks/ context/
  □ tokens.ts mirroring MRN
  □ icons.ts mirroring I
  □ Component primitives: Chip, PillButton, CodeBlock, Icon (SvgPath wrapper), TopHeader, TabBar
  □ Font loading + splash-screen hold
  □ Dev /tokens screen passes design comparison

Phase 2 — Auth flow
  □ 01 Splash + entrance animations (Reanimated)
  □ 02 Welcome
  □ 03 Auth (react-hook-form)
  □ Auth context + AsyncStorage token persistence + guest mode flag

Phase 3 — Core learning loop
  □ 04 Home (with mocked data)
  □ 05 Modules list
  □ 06 Module Detail + prerequisites slider
  □ 07 Lesson Reader
  □ 08 Lesson Code + slide-to-complete gesture

Phase 4 — Personal
  □ 09 Bookmarks + AsyncStorage bookmarks store
  □ 11 Profile
  □ 12 Settings + theme persistence

Phase 5 — Optional
  □ 10 AI Chat (UI shell first, wire to backend later)

Phase 6 — Wire to backend
  □ API client per promt.html
  □ Replace mocks with real endpoints
  □ Loading + error + empty states for every screen

Phase 7 — Ship
  □ App icon (atom mark, all sizes via expo-icon-generator or manual)
  □ Native splash config in app.json (#0B0907 bg + atom mark)
  □ Accessibility labels on every tappable
  □ EAS build preview profile (eas build -p ios --profile preview, same for android)
```

> **Discipline rule:** never start a new Phase until every box in the previous one is checked AND `STATUS.md` is updated.

---

## ✅ §7 — Pixel-Perfect QA Checklist (run after each screen)

| Check | How |
|---|---|
| **Colors** | `grep -rE '#[0-9a-fA-F]{6}' src/` returns only files in `theme/`. No raw hex outside tokens. |
| **Font weights** | Every `Text` style explicitly sets `fontWeight` — RN doesn't inherit. |
| **Radii** | Side-by-side screenshot vs design canvas at 100% zoom. Within 1px. |
| **Spacing** | Padding/gap values are multiples of 4. |
| **Touch targets** | Every tappable thing ≥ 44×44 (iOS HIG). |
| **Status bar** | Light content on splash/welcome/auth (dark bg); dark elsewhere. |
| **Safe areas** | All screens use `SafeAreaView` or `useSafeAreaInsets`. |
| **Icons** | Every icon from `icons.ts`. No new SVG paths added without asking. |

---

## 🚨 §8 — Common Pitfalls

1. **Don't use emoji as icons in production.** Designs use placeholder emoji (📘, ⏱, ⚡) — replace with `<Icon d={I.layers} />` etc. before shipping.
2. **`react-native-svg` ellipse rotation:** doesn't parse `transform="rotate(60 110 110)"`. Use `<G rotation={60} originX={110} originY={110}>` wrapper.
3. **Manrope letterSpacing** is in pixels in the designs (`-0.7`). In RN that's the `letterSpacing` style value as-is.
4. **Glass effect on dark inputs** needs no actual blur on RN — `rgba(255,255,255,0.06)` + 1px white-10 border is sufficient.
5. **Auto-save indicator** must be a real `setInterval` that updates "Xs ago" — static "12s ago" looks broken when you sit on the screen.
6. **Text outside `<Text>` will crash on iOS.** Wrap every string in `<Text>`.
7. **`gap` on iOS < 14** is missing — use Expo SDK 51+ to avoid the polyfill dance.

---

## 📤 §9 — Deliverables Claude Code must produce

1. **Source code** matching structure in §3
2. **`.env.example`** with `EXPO_PUBLIC_API_BASE_URL=…`
3. **`README.md`** with: prereqs, `npm install`, `npx expo start`, Expo Go QR instructions, common errors
4. **`/dev/Tokens` route** for visual diff vs design canvas
5. **`STATUS.md`** updated after each screen
6. **App icon set** from atom mark (`assets/icon.png`, `adaptive-icon.png`, `splash.png`)

---

## 🎁 §10 — Sample first message to Claude Code

> Read `BUILD_BRIEF.md` end-to-end before doing anything. Then execute **Phase 1 only**. Show me:
> 1. The created file tree
> 2. The contents of `src/theme/tokens.ts` (must match the MRN object exactly)
> 3. A screenshot of `/dev/Tokens` running on iOS Simulator
> 4. A QA checklist confirming colors and radii match
>
> **Do not proceed to Phase 2 until I approve.**

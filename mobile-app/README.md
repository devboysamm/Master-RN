# Master RN — Mobile App

React Native / Expo (TypeScript) app for the Master RN learning platform. Renders modules and lessons from the backend API.

## Prerequisites

- Node 18+
- npm 9+
- Xcode (iOS simulator) and/or Android Studio
- Expo CLI: `npm install -g expo`

## Setup

```bash
cd mobile-app
npm install
cp .env.example .env   # point at your API (defaults to https://api.masterreactnative.dev)
```

## Generate icons / splash (one time)

The SVG sources live in `assets/`. Convert them to PNGs Expo needs:

```bash
npm install --no-save sharp
node scripts/gen-icons.js
```

This creates `assets/icon.png`, `assets/adaptive-icon.png`, `assets/splash.png`.

## Run

```bash
npm start                # Expo dev server (scan QR with Expo Go)
npm run ios              # iOS simulator
npm run android          # Android emulator
```

In `__DEV__` builds, if the API can't be reached, the app falls back to seeded mock data so you can still develop UI.

## Project layout

```
mobile-app/
  App.tsx                    Font loading + providers
  src/
    api/                     Client + endpoint wrappers + mock + unified hooks
    components/              Icon, Chip, PillButton, CodeBlock, TopHeader, TabBar,
                             AtomLogo, DottedHero, SlideToComplete, Skeleton, ErrorState
    context/AuthContext.tsx  Stub auth (signIn/signUp/guest) + AsyncStorage
    navigation/              Root stack, tab navigator, per-tab stacks
    screens/
      auth/                  Splash, Welcome, Auth
      app/                   Home, Modules, ModuleDetail, LessonReader,
                             LessonCode, Bookmarks, Profile, Settings, AIChat
      dev/Tokens.tsx         Visual token / radii sheet for QA
    storage/                 AsyncStorage helpers (auth, bookmarks, completed, theme)
    theme/tokens.ts          Single source of truth for color/type/spacing/radii
    theme/icons.ts           Single source of truth for SVG paths
```

## Build for App Store (EAS)

```bash
npm install -g eas-cli
eas login
eas build --platform ios --profile production
eas submit --platform ios --latest
```

Edit `eas.json` to fill in your Apple credentials before submitting.

## Notes

- AI Chat is a static "Coming in v1.1" shell. The composer is disabled by overlay.
- Slide-to-complete fires `markCompleted(lessonId)` when the knob crosses 80% of the track.
- All colors come from `src/theme/tokens.ts`. All SVG paths from `src/theme/icons.ts`. Don't hardcode hexes or paths elsewhere.

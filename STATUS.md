# 📊 Master RN — Build Status

> Claude Code: update this file after **every** completed screen. Don't move to the next phase until your current phase is all green.

**Last updated:** _not started_
**Current phase:** —

---

## Phase 1 — Foundations

| Item | File / Path | Status | Notes |
|---|---|:-:|---|
| Expo project init | `package.json`, `app.json` | ⬜ | |
| Folder structure | `src/{theme,components,screens,navigation,api,storage,hooks,context}` | ⬜ | |
| Design tokens | `src/theme/tokens.ts` | ⬜ | Must match `MRN` object exactly |
| Icon paths | `src/theme/icons.ts` | ⬜ | Mirror the `I` object |
| Type scales | `src/theme/typography.ts` | ⬜ | |
| Spacing scale | `src/theme/spacing.ts` | ⬜ | |
| Font loading | `App.tsx` | ⬜ | Manrope + JetBrainsMono via expo-google-fonts |
| Splash-screen hold | `App.tsx` | ⬜ | `SplashScreen.preventAutoHideAsync()` |
| Icon primitive | `src/components/Icon.tsx` | ⬜ | `<Icon d={I.bell} size={22} />` |
| Chip primitive | `src/components/Chip.tsx` | ⬜ | |
| PillButton primitive | `src/components/PillButton.tsx` | ⬜ | |
| CodeBlock primitive | `src/components/CodeBlock.tsx` | ⬜ | |
| TopHeader | `src/components/TopHeader.tsx` | ⬜ | Avatar gradient + progress bar |
| TabBar | `src/components/TabBar.tsx` | ⬜ | Floating ink pill, 5 tabs |
| Dev tokens screen | `src/screens/dev/Tokens.tsx` | ⬜ | Visual diff vs design canvas |

**Phase 1 gate:** `/dev/Tokens` screen is visually identical to the design system card. Run side-by-side comparison.

---

## Phase 2 — Auth flow

| Screen | File | Implements | Status |
|---|---|---|:-:|
| 01 Splash | `src/screens/auth/Splash.tsx` | `ScreenSplash` | ⬜ |
| 02 Welcome | `src/screens/auth/Welcome.tsx` | `ScreenWelcome` | ⬜ |
| 03 Auth | `src/screens/auth/Auth.tsx` | `ScreenAuth` | ⬜ |
| Auth context | `src/context/AuthContext.tsx` | — | ⬜ |
| Token persistence | `src/storage/auth.ts` | — | ⬜ |
| Guest mode flag | `src/storage/auth.ts` | — | ⬜ |

**Phase 2 gate:** can launch app → splash animates → welcome → tap "Create account" → see auth form. "Continue as guest" routes into main app with guest flag set.

---

## Phase 3 — Core learning loop

| Screen | File | Implements | Status |
|---|---|---|:-:|
| 04 Home | `src/screens/app/Home.tsx` | `ScreenHome` | ⬜ |
| 05 Modules | `src/screens/app/Modules.tsx` | `ScreenModules` | ⬜ |
| 06 Module Detail | `src/screens/app/ModuleDetail.tsx` | `ScreenModuleDetail` | ⬜ |
| 07 Lesson Reader | `src/screens/app/LessonReader.tsx` | `ScreenLessonReader` | ⬜ |
| 08 Lesson Code | `src/screens/app/LessonCode.tsx` | `ScreenLessonCode` | ⬜ |
| Slide-to-complete | `src/components/SlideToComplete.tsx` | Gesture component | ⬜ |
| Mock data | `src/api/mock.ts` | Modules + lessons fixtures | ⬜ |

**Phase 3 gate:** tap any module on home → opens module detail → tap any lesson → reader opens → scroll → slide-to-complete fires.

---

## Phase 4 — Personal

| Screen | File | Implements | Status |
|---|---|---|:-:|
| 09 Bookmarks | `src/screens/app/Bookmarks.tsx` | `ScreenBookmarks` | ⬜ |
| 11 Profile | `src/screens/app/Profile.tsx` | `ScreenProfile` | ⬜ |
| 12 Settings | `src/screens/app/Settings.tsx` | `ScreenSettings` | ⬜ |
| Bookmarks store | `src/storage/bookmarks.ts` | AsyncStorage | ⬜ |
| Completed store | `src/storage/completed.ts` | AsyncStorage | ⬜ |
| Theme store | `src/storage/theme.ts` | light/dark/system | ⬜ |

**Phase 4 gate:** bookmark a lesson → force-close → reopen → still bookmarked. Toggle theme → restart → setting persists.

---

## Phase 5 — Optional

| Screen | File | Implements | Status |
|---|---|---|:-:|
| 10 AI Chat | `src/screens/app/AIChat.tsx` | `ScreenAIChat` | ⬜ |
| Chat history store | `src/storage/chat.ts` | AsyncStorage | ⬜ |
| AI backend client | `src/api/chat.ts` | — | ⬜ |

---

## Phase 6 — Wire to backend

| Item | File | Status |
|---|---|:-:|
| API client | `src/api/client.ts` | ⬜ |
| `getModules()` | `src/api/modules.ts` | ⬜ |
| `getModule(id)` | `src/api/modules.ts` | ⬜ |
| `getLessons(moduleId)` | `src/api/lessons.ts` | ⬜ |
| `getLesson(id)` | `src/api/lessons.ts` | ⬜ |
| `signIn(email, password)` | `src/api/auth.ts` | ⬜ |
| `signUp(name, email, password)` | `src/api/auth.ts` | ⬜ |
| Loading states on every screen | — | ⬜ |
| Error states on every screen | — | ⬜ |
| Empty states on every screen | — | ⬜ |

---

## Phase 7 — Ship

| Item | File | Status |
|---|---|:-:|
| App icon | `assets/icon.png` (1024×1024) | ⬜ |
| Adaptive icon | `assets/adaptive-icon.png` (1024×1024) | ⬜ |
| Splash image | `assets/splash.png` | ⬜ |
| `app.json` splash config | `app.json` | ⬜ |
| Accessibility labels | every screen | ⬜ |
| EAS preview iOS | `eas build -p ios --profile preview` | ⬜ |
| EAS preview Android | `eas build -p android --profile preview` | ⬜ |

---

## QA log

> Append entries here. One row per screen review. Don't delete — keep history.

| Date | Screen | Reviewed by | Pass/Fail | Notes |
|---|---|---|:-:|---|
| _yyyy-mm-dd_ | _01 Splash_ | _name_ | ⬜ | |

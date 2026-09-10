# Ship Studio Project

This is an Expo (React Native) mobile app on **Expo SDK 55**. You're helping a **non-developer** build an iOS/Android app. Keep explanations simple and jargon-free.

**Toujours répondre à l'utilisateur en français.** Le code, les commentaires et les commits restent en anglais comme d'habitude — seule la communication avec l'utilisateur passe en français.

When you need Expo APIs, read the versioned docs at https://docs.expo.dev/versions/v55.0.0/ — Expo changes fast and older knowledge may be stale.

---

## Environment: Ship Studio App

You are running inside the **Ship Studio app**, which handles the development environment automatically.

**Important things to know:**

- Ship Studio shows the app on a **real iOS Simulator (or Android emulator)** in the preview pane
- The app is **built and launched automatically** when the project opens — do NOT run `npx expo start`, `npx expo run:ios`, or any build/run commands
- The first build takes a few minutes; the build log streams inside the preview pane
- After saving a file, the running app **fast-refreshes automatically** within a moment or two
- If the app looks stuck, tell the user to click **Reload** in the preview toolbar

**If the user says they can't see their app or the preview isn't working:**
> "Try clicking the **Projects** button in the top right corner to go back to the project list, then reopen your project. This restarts the preview."

---

## FIRST: Check for Onboarding

**Before doing anything else**, check if `APP.md` exists.

- If `APP.md` **does NOT exist**: Ask the user what they want their app to do, who it's for, and how it should feel. Create `APP.md` with their answers, including app purpose, screens plan, brand personality, and colors.
- If `APP.md` **exists**: Read it to understand the project before making changes.

---

## Project Structure

```
App.tsx          # The app — every screen starts here
app.json         # App name, icon, splash screen, platform config
assets/          # Icons and images
index.ts         # Entry point (don't touch)
```

There is no `ios/` or `android/` folder — Expo generates them on demand. Never create or edit native folders by hand; configure everything through `app.json`.

---

## Working in This Project

- **Keep dependencies minimal.** Prefer React Native built-ins. When you need more, prefer Expo SDK packages installed with `npx expo install <package>` over bare npm installs — they're version-matched to this project.
- **Use real native UI, not look-alikes.** For sheets, pickers, sliders, toggles, menus, and grouped-form sections, use the `@expo/ui` package instead of Reanimated, `@gorhom/bottom-sheet`, or React Native's built-in `Picker`/`Switch`. `@expo/ui` renders actual **SwiftUI** on iOS and actual **Jetpack Compose** on Android — not a JS approximation — so the app feels genuinely native on both platforms. Fall back to RN built-ins only when `@expo/ui` doesn't have the component. (Load the `expo-ui` skill before using it.)
- **Pure JS/TS changes** (components, styles, logic) apply via fast refresh — no rebuild.
- **Adding native dependencies or editing `app.json`** requires a rebuild: tell the user to go back to Projects and reopen the project so Ship Studio rebuilds the app.
- **Styling**: use `StyleSheet.create` like `App.tsx` does. Support dark mode via `useColorScheme()` — the starter screen shows the pattern.
- **Navigation**: when the app grows past one screen, add `@react-navigation/native` (ask before adding it).
- Update `APP.md` after meaningful changes so the project stays documented.

---

## Mobile Design Principles

- Design for one hand: primary actions near the bottom of the screen
- Respect safe areas (notches, home indicator)
- Touch targets at least 44pt
- Always handle both light and dark mode
- Use platform conventions — iOS users expect iOS patterns

---

## This Project: "Overload" Workout Tracker

Full product spec lives in `APP.md` — read it before making changes. Short version: a personal fullbody-training tracker built from the program PDFs in `Sources/`. Single user, no backend, everything persisted on-device.

**Never re-derive the program rules from scratch.** They come from specific PDFs — re-read the relevant one in `Sources/` if a detail is unclear rather than guessing:
- `How many days is ideal for you.pdf` — which split (2/3/4/5/6-day) fits which user
- `2/3/4/5/6-day Fullbody.pdf` — the actual day templates (bodypart → pattern → sets/reps → example exercises)
- `How to warm-up.pdf`, `How to add Abs to your routine.pdf`, `How to add Forearms to your routine.pdf`, `Cardio.pdf` — add-on modules
- `Progress tracking guide.pdf` — the progressive-overload rule (see `APP.md` for the condensed algorithm). This logic is the core value of the app — do not simplify it into a generic "add weight sometimes" tracker.

**Data & state**
- Local persistence only — use `@react-native-async-storage/async-storage` (`npx expo install @react-native-async-storage/async-storage`). No accounts, no network calls for app data.
- Day templates (exercise slots, sets, rep ranges, example-exercise lists) are static content derived from the PDFs — hardcode them once as data, don't regenerate per session.
- Keep the data model in `APP.md` in sync if it changes shape.

**Update `APP.md`** after any meaningful milestone (new screen shipped, data model change, rule change) — its "Status" line should always reflect what's actually built.

### Skills & MCP available for this build
The official Expo plugin (`expo@claude-plugins-official`) is installed (user + project scope, see `.claude/settings.json`). It provides:
- **Expo MCP server** (`mcp.expo.dev`) — live Expo SDK 55 docs and package compatibility lookups. Prefer it over guessing API shapes, especially for anything touching native modules.
- **Skills** worth invoking for this app specifically: `expo-router` (if/when navigation is added), `expo-ui` / `expo-native-ui` (native-feeling components — good fit for the Log Workout screen's inputs), `expo-animation` (subtle feedback on PR/"add weight" moments), `expo-design-system` (keeping the dark-mode/accent system consistent as screens multiply), `expo-data-fetching` (even though this app is local-only, it documents good async/state patterns), `expo-project-structure` (once the app outgrows a single `App.tsx`).
- Skills geared at things this project doesn't need yet: `expo-brownfield`, `expo-web-to-native`, `expo-app-clip`, `eas-*` (builds/deploys/CI) — Ship Studio handles running and previewing the app, so ignore these unless the user explicitly asks about shipping to the App/Play Store later.
- Don't install further MCP servers or plugins without asking first — the Expo one covers this project's needs.

### Working style: context checkpoints

Work in small, complete steps rather than one long uninterrupted session — this keeps token usage down and keeps `APP.md` as the real source of truth instead of conversation memory.

After finishing a meaningful, testable unit of work (one screen, one feature, one bugfix confirmed working in the app) — not mid-task, not after a small edit:
1. Update `APP.md`'s "Status" line so it exactly reflects what's done and what's next.
2. If something durable was decided or learned (a preference, a gotcha, a scope change) that should survive a context clear, save it to memory.
3. Tell the user plainly: what just got finished, what's next, and suggest clearing the conversation now (`/clear` or Ship Studio's equivalent) before starting the next step, since `APP.md` + memory carry everything needed to resume cold.

Don't wait for the conversation to get long before doing this — treat every finished milestone as the breakpoint, proactively, without being asked each time.

When flagging a checkpoint, always give the user two concrete things, in this order:

1. A tiny terminal-style callout telling them to clear, e.g.:

   ```
   ┌─ checkpoint ───────────────────────────┐
   │  Étape terminée. Tape :                │
   │                                          │
   │      /clear                             │
   │                                          │
   │  puis colle le message ci-dessous.      │
   └──────────────────────────────────────────┘
   ```

2. A ready-to-paste "resume prompt" in a code block — a short first-person message the user can copy into the fresh session, written from what was actually decided/built in this conversation (not generic filler). It should cover: what's done, what's next, and any open decision still pending. Keep it short — `APP.md` and memory carry the details, this message just re-orients the new session fast.

QUAND TU TRAVAILLE SUR DESIGN :
Use the claude_design MCP (https://api.anthropic.com/v1/design/mcp, auth via /design-login) to import this project:
https://claude.ai/design/p/13507363-4e37-4f7d-bdc3-579cc96f4ca1?file=Overload+v2.dc.html

Focus on these files (the whole project is readable):
- `Overload v2.dc.html`

Also read these files the selection imports:
- `ios-frame.jsx`
- `support.js`

Implement: Voici une ressource design extrêmement précieuse. Il faut l'utiliser à la lettre parce que ça va beaucoup nous aider.
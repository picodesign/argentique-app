# Expo Starter

Build iOS and Android apps with your AI agent. Powered by [Expo](https://expo.dev) and React Native.

## What is this?

A minimal Expo app for building mobile apps with Claude Code inside [Ship Studio](https://www.ship.studio). Open the project and Ship Studio boots a simulator, builds the app, and shows it live in the preview pane — tap, swipe, and type right in the workspace. Just describe what you want, and your agent handles the code.

## Getting Started

Open the project in Ship Studio. The first build takes a few minutes (the build log streams in the app) — after that, saved changes appear in the running app within seconds.

**Requirements for the iOS preview:** macOS with Xcode installed. Ship Studio's "Set up with AI" flow can walk you through this if anything's missing.

## Project Structure

```
App.tsx          # The app — every screen starts here
app.json         # App name, icon, splash screen, platform config
assets/          # Icons and images
CLAUDE.md        # Instructions for Claude Code
```

## Releasing

When you're ready to ship to the App Store or Play Store, [EAS Build](https://docs.expo.dev/build/introduction/) handles the builds and store submissions.

---

Built for use with [Claude Code](https://claude.com/claude-code)

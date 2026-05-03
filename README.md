# Nika Treasure Hunt

## Run this in GitHub (no coding needed)

Use this when you want to publish your own version with your own passphrase and secret message.

1. Open this repository in GitHub.
2. Click the **Actions** tab.
3. In the left sidebar, click **Deploy to GitHub Pages**.
4. Click **Run workflow**.
5. Fill in the two fields:
   - **vite_passphrase**: your unlock passphrase (maximum 13 characters)
   - **vite_secret_message**: the hidden message shown after unlocking
6. Click **Run workflow** again to start.
7. Wait until both jobs complete successfully:
   - **build**
   - **deploy**
8. Open the deployed site from the workflow result (the **github-pages** environment URL).

Notes:
- The workflow validates your passphrase length. If it is longer than 13 characters, the run fails with a clear message.
- Each run can use different values. You do not need to edit code for this.

## What this project is

A small Vite + TypeScript browser game where the user enters a passphrase to unlock a treasure chest and reveal a secret message.

It is intended as a simple tool for creating treasure hunts for children: kids can solve small tasks or riddles to discover each character of the passphrase, then use the full passphrase to unlock the final secret.

## Project structure (feature-first)

- `src/features/treasure/config`: env handling
- `src/features/treasure/content`: user-facing copy/text
- `src/features/treasure/ui`: DOM rendering and selectors
- `src/features/treasure/logic`: game logic and tests
- `src/features/treasure/effects`: visual effects
- `src/features/treasure/audio`: audio controller

## Local development

### Requirements

- Node.js 24+
- npm

### Install

```bash
npm ci
```

### Run locally

Set environment variables before running locally:

- `VITE_PASSPHRASE` (max 13 chars)
- `VITE_SECRET_MESSAGE`

Example:

```bash
export VITE_PASSPHRASE="GOLD"
export VITE_SECRET_MESSAGE="Nika found the treasure"
npm run dev
```

### Quality commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## GitHub workflows

- **CI** (`.github/workflows/ci.yml`)
  - Runs on pushes to `main`, pull requests, and manual trigger
  - Runs: install, typecheck, lint, test

- **Deploy to GitHub Pages** (`.github/workflows/deploy.yml`)
  - Manual trigger only
  - Accepts `vite_passphrase` and `vite_secret_message`
  - Runs: install, typecheck, lint, test, build, deploy to Pages

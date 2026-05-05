# Tajj Restaurant (Shahid)

A modern restaurant website for Tajj Restaurant (Shahid) built with React, Vite, TypeScript, and Tailwind CSS.

## Features

- Browse the full menu by category
- Order food by selecting your Hall and Table
- Reserve a table online
- WhatsApp-integrated ordering
- Staff table management with PIN access

## Halls Available

- Main Hall (9 tables)
- AC Friends Hall (2 tables)
- AC Family Hall (3 tables)
- Jungle Hall (5 tables)
- Majlis Hall (6 tables)
- Red Room (4 tables)

## Deploy to GitHub Pages

This project deploys automatically to GitHub Pages via GitHub Actions whenever you push to the `main` branch.

### Setup

1. Go to your repository **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Push to `main` — the site will build and deploy automatically

### Manual Deploy

```bash
pnpm install
cd artifacts/taj-restaurant
GITHUB_REPO_NAME=your-repo-name pnpm run build:github
```

## Local Development

```bash
pnpm install
pnpm --filter @workspace/taj-restaurant run dev
```

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- Framer Motion
- Lucide React

# Project Management (Monorepo)

This repo contains both the frontend and backend for the Project
Management system.

## Structure
- `projects-management-frontend` - Vite React app
- `projects-management-backend` - Node.js API

## Prerequisites
- Node.js + npm

## Frontend
```bash
cd projects-management-frontend
npm install
npm run dev
```

## Backend
```bash
cd projects-management-backend
npm install
npm run start
```

## Run both from repo root
```bash
npm install
npm run install:all
npm run dev
```

### Backend config
Create `config.env` and any required service account files (e.g.
`serviceAccountKey.json`) locally. These files are ignored by git.

## Notes
- Each app keeps its own `package.json`.
- Use two terminals to run frontend + backend together.

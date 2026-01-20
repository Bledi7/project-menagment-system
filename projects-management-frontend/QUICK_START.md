# Quick Start Guide

## Frontend Setup

1. **Install Dependencies**
```bash
cd projects-management-frontend
npm install --legacy-peer-deps
```

2. **Environment Variables**
Create a `.env` file in `projects-management-frontend/`:
```env
VITE_API_URL=http://localhost:2000/api
VITE_SOCKET_URL=ws://localhost:2000
```

**Note**: The backend runs on port 2000 by default (configurable via `PORT` env var). Socket.io runs on the same port as the HTTP server.

3. **Start Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Backend Setup

Make sure your backend is running on port 2000 (default). Socket.io runs on the same port as the HTTP server.

## First Steps

1. **Register a new user** - Go to `/register`
   - Admin accounts are auto-approved
   - Other roles require admin approval

2. **Login** - Go to `/login`
   - Only approved users can login

3. **Access Dashboard** - Based on your role:
   - Admin: `/admin`
   - Product Owner: `/productOwner`
   - Scrum Master: `/scrumMaster`
   - Developer: `/developer`

## Features

- ✅ TypeScript throughout
- ✅ Dark mode (toggle in topbar)
- ✅ Real-time notifications
- ✅ Role-based access control
- ✅ Responsive design
- ✅ Form validation

## Troubleshooting

**Port conflicts**: Change ports in `.env` and backend config

**CORS errors**: Ensure backend CORS is configured for `http://localhost:5173`

**Socket connection issues**: Verify `VITE_SOCKET_URL` matches backend port (default: `ws://localhost:2000`)

**Type errors**: Run `npm run type-check` to verify TypeScript compilation

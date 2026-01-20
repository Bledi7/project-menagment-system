# Project Management System - Frontend

Modern TypeScript React frontend for the Project Management System.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Zustand** for state management
- **TanStack Query** for data fetching
- **TailwindCSS** for styling
- **React Hook Form + Zod** for forms and validation
- **React Router** for routing
- **Socket.io Client** for real-time features
- **Recharts** for data visualization

## Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:2000/api
VITE_SOCKET_URL=ws://localhost:2000
```

**Note**: The backend runs on port 2000 by default. Socket.io runs on the same port as the HTTP server.

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

- `src/api/` - API services and query keys
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks
- `src/pages/` - Page components
- `src/routes/` - React Router configuration
- `src/store/` - Zustand stores
- `src/sockets/` - Socket.io hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

## Features

- ✅ Full TypeScript support
- ✅ Role-based authentication and routing
- ✅ Real-time updates via Socket.io
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Form validation
- ✅ Error handling and loading states
- ✅ Toast notifications

## User Roles

- **Admin** - Full system access
- **Product Owner** - Project management
- **Scrum Master** - Team and sprint management
- **Developer** - Task and report management

## Development

Run type checking:
```bash
npm run type-check
```

Run linter:
```bash
npm run lint
```

## Notes

- All API calls are typed and use TanStack Query
- State management uses Zustand with persistence for auth
- Dark mode preference is saved in localStorage
- Socket.io connection is established on user login

# MillionHits Sales CRM - Client Application

## Quick Start

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment:**
   - Copy `.env` file and update backend URL
   - Ensure backend is running

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Project Overview

This is a React-based CRM client for managing sales prospects, agreements, and team administration.

### Key Features:
- **Authentication:** Login with OTP verification
- **Role-Based Access:** Admin and Sales user roles
- **Prospect Management:** Add, update, and track clients
- **Agreement Generation:** Create and send PDF agreements
- **Dashboard Analytics:** Charts and performance metrics
- **Admin Panel:** Manage sales executives and view team stats

### Tech Stack:
- React 19 + Vite
- Redux Toolkit for state management
- Material UI for components
- Axios for API calls
- React Router for navigation

## Architecture

- **Pages:** Main application screens (`src/pages/`)
- **Components:** Reusable UI components (`src/components/`)
- **Layouts:** Page structure templates (`src/layout/`)
- **Dialogs:** Modals and popups (`src/dialog/`)
- **Slices:** Redux state management (`src/slices/`)
- **Utils:** Helper functions (`src/utils/`)

## API Integration

All API calls use the `VITE_BACKEND_URL` environment variable. Key endpoints include:
- `/user/login` - User authentication
- `/user/verify-otp` - OTP verification
- `/admin/get-dashboard-data` - Admin statistics
- `/sales/create-client` - Add new prospect
- `/admin/send-agreement/:id` - Send agreements

## Development

- Use `npm run lint` for code quality
- Follow existing component structure
- Add new routes in `App.jsx` with role protection
- Test features across different user roles

For detailed documentation, see `README.md`.

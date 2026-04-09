# MillionHits Sales CRM (Client)

A React-based CRM client application built with Vite, Material UI, Redux Toolkit, React Router v7, and data visualization libraries. This project handles user authentication, role-based dashboards, prospect management, agreement generation, and sales executive administration.

## Table of Contents

1. Project Overview
2. Tech Stack
3. Setup & Run
4. Environment Variables
5. Folder Structure
6. Key Application Flows
7. Routing and Access Control
8. Redux State
9. Important Components
10. Backend Integration
11. Notes for Developers

---

## 1. Project Overview

This project is the client-side application for a CRM system. It provides:

- Login and OTP-based authentication
- Role-based dashboards for `admin` and `sales` users
- Prospect management and client tracking
- Agreement generation, preview, download, and send flows
- Admin features for managing sales executives and agreements
- Charts and dashboard analytics for performance tracking

---

## 2. Tech Stack

- React 19
- Vite
- React Router DOM 7
- Redux Toolkit
- Material UI
- Axios
- React Hot Toast
- Recharts
- HTML2PDF / jsPDF for agreement PDF generation
- FullCalendar (available in dependencies)
- Drag and drop libraries (`@dnd-kit`, `react-beautiful-dnd`)

---

## 3. Setup & Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview a production build:
   ```bash
   npm run preview
   ```

---

## 4. Environment Variables

The app depends on a backend URL stored in environment variables. Create a `.env` file in the project root with:

```env
VITE_BACKEND_URL=https://your-backend-url.com
```

This is used by Axios calls in login, OTP verification, dashboard data, agreements, and admin APIs.

---

## 5. Folder Structure

### Root

- `package.json` - scripts and dependency definitions.
- `vite.config.js` - Vite configuration.
- `README.md` - project documentation.
- `index.html` - app entry markup.

### `src/`

- `App.jsx` - route definitions and role-based route rendering.
- `main.jsx` - application bootstrap and Redux/Theme providers.
- `theme.js` - custom Material UI theme and color mode helper.
- `index.css` - global styles.

### `src/store/`

- `store.js` - Redux store configuration.

### `src/slices/`

- `authSlice.js` - authentication state and login data.
- `modalSlice.js` - shared modal open/close state.
- `themeSlice.js` - light/dark mode state.

### `src/pages/`

- `Login.jsx` - login screen and OTP request.
- `OTPPage.jsx` - OTP verification screen.
- `Dashboard.jsx` - sales user dashboard.
- `AgreementPage.jsx` - agreement generation and sending page.
- `AgreementReview.jsx` - public agreement review for recipients.
- `AgreementSuccess.jsx` - confirmation after agreement actions.
- `ForgetPassword.jsx` - password reset flow.
- `NotFound.jsx` - 404 fallback page.
- `admin/`
  - `Dashboard.jsx` - admin dashboard analytics.
  - `AssignAdminPage.jsx` - page to assign or manage admins.
  - `CardDetails.jsx` - admin card details display.

### `src/layout/`

- `AdminLayout.jsx` - admin page layout with header/sidebar.
- `AppLayout.jsx` - sales/user page layout with sidebar and add-prospect modal.

### `src/components/`

`admin/`

- `Sidebar.jsx` - admin sidebar menu.
- `Header.jsx` - admin header controls.
- `ClientList .jsx` - list view for clients.
- `ManageSales.jsx` - manage sales executives.
- `Agreements.jsx` - admin agreements list.
- `AdminOTPModal.jsx` - admin OTP dialog.

`common/`

- `ProtectRoute.jsx` - protected route wrapper and access control.
- `ButtonComponet.jsx` - reusable button component.
- `CardComponent.jsx` - statistics or info cards.
- `ClientInputDetails.jsx` - form fields for client details.
- `Cloumn.jsx` - generic column layout helper.
- `LogoutBtn.jsx` - logout button.
- `Profile.jsx` - user profile display.
- `SearchBar.jsx` - search input field.
- `SidebarList.jsx` - navigation menu for standard layout.

`specific/`

- `ClientBoard.jsx` - drag-and-drop prospect board.
- `ClientDetails.jsx` - client details display panel.

`template/`

- `HeaderTemplate.jsx` - header wrapper for standard pages.
- `MainTemplate.jsx` - main content wrapper.
- `SidebarTemplate.jsx` - sidebar wrapper.

### `src/dialog/`

- `AddClientModal.jsx` - modal for adding new prospects.
- `AddExecutive.jsx` - modal to add a new executive.
- `AgreementSuccess.jsx` - success dialog after sending agreement.
- `AllClientsModal.jsx` - client selection modal.
- `ClientDetails.jsx` - detailed client modal.
- `CreateAgreement.jsx` - admin agreement creation modal.
- `ShowClientMoal.jsx` - client view modal.
- `UpdateAgreement.jsx` - agreement edit modal.
- `UpdateClientModal.jsx` - update client details modal.

### `src/constants/`

- `dummyData.js` - sample data arrays such as month names and static dashboards.

### `src/assets/`

- Font and image assets used in the UI.

---

## 6. Key Application Flows

### Authentication

- `Login.jsx` sends credentials to `POST /user/login`.
- On success, it stores login details in Redux and navigates to `/verify-otp`.
- `OTPPage.jsx` verifies the OTP through `POST /user/verify-otp`, stores the returned token and role, then navigates to `/dashboard`.
- Auth state is persisted in `localStorage.auth`.

### Role-Based Access

- `App.jsx` uses `PrivateRoute` to guard protected pages.
- Admin-only routes include: `/send-agreement/:id`, `/manage-executive`, `/agreements`, `/assign-admin`.
- Common logged-in routes include `/dashboard`, `/my-prospects`, and `/list-view`.

### Dashboard

- Sales users see `src/pages/Dashboard.jsx` with statistics, charts, and client details.
- Admin users see `src/pages/admin/Dashboard.jsx` with team-level metrics, executive filters, and performance graphs.

### Agreement Handling

- `AgreementPage.jsx` retrieves agreement data for a client and generates a downloadable PDF.
- It also sends the agreement using backend APIs and includes email/CC/message fields.
- `AgreementReview.jsx` allows external users to review the agreement via a public link.

---

## 7. Routing and Access Control

Routes are declared in `src/App.jsx`:

- `/login` → `Login.jsx`
- `/verify-otp` → `OTPPage.jsx`
- `/dashboard` → protected dashboard route
- `/send-agreement/:id` → admin only agreement send
- `/list-view` → admin/sales client list
- `/manage-executive` → admin only
- `/my-prospects` → admin/sales board view
- `/agreements` → admin agreements overview
- `/assign-admin` → admin only
- `/reset-link` → reset password request
- `/reset-password/:token` → set new password
- `*` → `NotFound.jsx`

The `PrivateRoute` component in `src/components/common/ProtectRoute.jsx` checks:

- if user is authenticated
- optional role access
- redirects unauthorized or unauthenticated users

---

## 8. Redux State

### Auth slice (`src/slices/authSlice.js`)

Holds:

- `loginData` - stored login info, user role, auth token, and user ID

### Modal slice (`src/slices/modalSlice.js`)

Controls visibility for:

- `createAgreementOpen`
- `addClientOpen`
- `updateClientOpen`

### Theme slice (`src/slices/themeSlice.js`)

Controls Material UI mode:

- `mode` = `light` or `dark`

---

## 9. Important Components

### Layouts

- `src/layout/AdminLayout.jsx` - renders the admin sidebar, header, and agreement modal.
- `src/layout/AppLayout.jsx` - renders standard sidebar, header, and add-prospect modal.

### Templates

- `HeaderTemplate.jsx`, `MainTemplate.jsx`, `SidebarTemplate.jsx` provide reusable page structure.

### Admin Components

- `Sidebar.jsx` and `Header.jsx` define admin navigation and top bar.
- `ClientList .jsx` renders the admin client list view.
- `ManageSales.jsx` manages executive user data.
- `Agreements.jsx` renders agreement lists.

### Shared Components

- `ButtonComponet.jsx` is a reusable button used across pages.
- `CardComponent.jsx` is used for dashboard statistic cards.
- `ProtectRoute.jsx` guards protected routes.
- `SidebarList.jsx` is used for standard app navigation.

---

## 10. Backend Integration

All backend calls use `axios` and `VITE_BACKEND_URL`.

Common endpoints used in the client:

- `POST /user/login`
- `POST /user/verify-otp`
- `GET /admin/get-dashboard-data`
- `GET /admin/get-executive-dashboard/:id`
- `GET /admin/get-agreement/:id`
- `POST /admin/send-agreement/:id`
- `GET /admin/get-agreements`
- `GET /admin/get-executivedata-by-month-year/:id`
- `GET /admin/get-dashboard-data-by-month-year`
- `GET /admin/getMonthlyRevenueData`

> Note: API endpoints may differ depending on your backend version and environment.

---

## 11. Notes for Developers

- `localStorage.auth` is used to store authenticated session state.
- Role values are expected to be strings like `admin` or `sales`.
- The app currently uses inline toast notifications for error and success handling.
- Modal open state is managed globally in Redux, which simplifies cross-component dialogs.
- If you add a new route, update `App.jsx` and include any required role restrictions.
- When adding new dashboard charts, reuse `recharts` components and keep data transformation logic in the page component.

---

## Suggested Improvements

- Add a dedicated `src/services/api.js` file for Axios configuration and interceptors.
- Add form validation on login, OTP, and client forms.
- Add unit tests for key components and reducers.
- Add a central `auth` helper to handle token refresh and logout.
- Normalize API response handling into reusable helpers.

---

## 12. Environment Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

### Installation Steps

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

   Or create `.env` with:

   ```env
   VITE_BACKEND_URL=https://your-backend-url.com/api/v1
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

### Environment Variables

| Variable                    | Description                | Required |
| --------------------------- | -------------------------- | -------- |
| `VITE_BACKEND_URL`          | Backend API base URL       | Yes      |
| `VITE_GOOGLE_CLIENT_ID`     | Google OAuth client ID     | Optional |
| `VITE_GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |

---

## 13. Development Guidelines

### Code Style

- Use ESLint for code linting (`npm run lint`)
- Follow React best practices and hooks guidelines
- Use meaningful component and variable names
- Keep components small and focused on single responsibility

### State Management

- Use Redux Toolkit for global state
- Keep local state in components when possible
- Dispatch actions for side effects and API calls

### API Integration

- All API calls should use the configured `VITE_BACKEND_URL`
- Handle errors gracefully with toast notifications
- Use async/await for API calls
- Store authentication tokens securely

### Component Structure

- Place reusable components in `src/components/common/`
- Admin-specific components in `src/components/admin/`
- Page-specific components in `src/pages/`
- Modals and dialogs in `src/dialog/`

### Adding New Features

1. Plan the feature and identify required components
2. Add necessary routes in `App.jsx` with proper role protection
3. Create or update Redux slices if needed
4. Implement components following the existing structure
5. Add API calls with proper error handling
6. Test the feature thoroughly

---

## 14. API Reference

### Authentication

#### POST /user/login

Login with email and password.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": "123",
    "role": "admin"
  }
}
```

#### POST /user/verify-otp

Verify OTP for login.

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "123",
    "role": "admin",
    "name": "John Doe"
  }
}
```

### Dashboard Data

#### GET /admin/get-dashboard-data

Get admin dashboard statistics.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalClients": 150,
    "totalRevenue": 50000,
    "monthlyData": [...]
  }
}
```

#### GET /sales/get-dashboard-data

Get sales user dashboard data.

### Client Management

#### POST /sales/create-client

Create a new client/prospect.

**Request Body:** (FormData)

```
fullName: "John Smith"
email: "john@example.com"
phone: "1234567890"
company: "ABC Corp"
status: "prospect"
```

#### GET /admin/get-clients

Get all clients (admin only).

### Agreement Management

#### GET /admin/get-agreement/:id

Get agreement details by ID.

#### POST /admin/send-agreement/:id

Send agreement to client.

**Request Body:**

```json
{
  "email": "client@example.com",
  "cc": ["cc@example.com"],
  "message": "Please review the agreement"
}
```

### User Management (Admin Only)

#### POST /admin/create-user

Create a new sales executive.

**Request Body:**

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```

#### GET /admin/get-executives

Get all sales executives.

---

## 15. Deployment

### Build for Production

1. Build the application:

   ```bash
   npm run build
   ```

2. The build artifacts will be stored in the `dist/` directory.

3. Serve the `dist/` folder using any static server or deploy to your hosting platform.

### Environment Configuration

- Ensure all environment variables are set in production
- Use HTTPS in production for security
- Configure CORS on the backend for the production domain

### Recommended Hosting

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

---

## 16. Troubleshooting

### Common Issues

#### Build Fails

- Ensure all dependencies are installed: `npm install`
- Check Node.js version compatibility
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

#### Authentication Issues

- Verify `VITE_BACKEND_URL` is correct
- Check if backend is running and accessible
- Ensure token is stored in localStorage

#### Routing Problems

- Check if routes are properly defined in `App.jsx`
- Verify role-based access in `PrivateRoute`
- Ensure user is authenticated

#### API Errors

- Check network tab in browser dev tools
- Verify API endpoints match backend documentation
- Check request headers and body format

### Development Tips

- Use browser dev tools for debugging
- Check Redux dev tools for state changes
- Use `console.log` for quick debugging
- Test API calls with tools like Postman

---

## 17. Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature`
6. Open a pull request

### Commit Guidelines

- Use clear, descriptive commit messages
- Reference issue numbers when applicable
- Keep commits focused on single changes

---

## Contact

For questions or handoff notes, include backend API docs and role definitions for `admin` and `sales`.

# Eventify - Event Management Web Application

Eventify is a comprehensive event management platform that allows users to create, manage, and participate in events.

## Project Structure

```
Eventify/
├── frontend/                # React with Vite & TypeScript
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── assets/          # Static assets
│   │   ├── context/         # React context providers
│   │   └── types/           # TypeScript type definitions
│   └── ...
│
└── backend/                 # NestJS with TypeScript
    ├── src/
    │   ├── auth/            # Authentication module
    │   ├── events/          # Events module
    │   ├── users/           # Users module
    │   ├── common/          # Shared resources
    │   └── config/          # Configuration files
    └── ...
```

## Tech Stack

- **Frontend**:
  - React with Vite
  - TypeScript
  - Material UI (MUI)
  - React Router
  - Axios

- **Backend**:
  - NestJS
  - TypeScript
  - MongoDB with Mongoose
  - JWT Authentication
  - bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and update the values.

4. Start the development server:
   ```
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Features

1. **Authentication**:
   - User registration and login
   - JWT-based authentication
   - Password hashing with bcrypt

2. **Events**:
   - Create events with title, description, date, location, and optional image
   - List events created by the user
   - View available public events
   - Edit/Delete events (owner only)

3. **Participation**:
   - Register for events
   - View participant list (event organizer only)

4. **Dashboard**:
   - User: View created events and events they're participating in
   - Organizer: View participant lists for their events

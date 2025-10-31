# 🎉 Eventify - Event Management Platform

> A modern, full-stack event management application built with React, NestJS, and MongoDB.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

Eventify is a comprehensive event management platform that allows users to create, manage, and participate in events with an intuitive interface and robust backend.

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

## ✨ Features

- 🔐 **Secure Authentication**: Email/password login with JWT and Google OAuth integration
- 📅 **Event Management**: Create, edit, and delete events with rich details
- 🖼️ **Image Upload**: Support for event cover images
- 👥 **Participation System**: Join events and manage attendees
- 📊 **Dashboard**: Personalized view of created and joined events
- 🎨 **Modern UI**: Clean, responsive design with Material-UI
- 🔒 **Role-based Access**: Different permissions for users and organizers

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite** - Fast, modern build tool
- **TypeScript** - Type-safe development
- **Material-UI (MUI)** - Beautiful, accessible components
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe server code
- **MongoDB** with **Mongoose** - NoSQL database
- **JWT** - Stateless authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing
- **Multer** - File upload handling

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/eventify.git
   cd eventify
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   
   # Start development server
   npm run start:dev
   ```
   The backend will run on `http://localhost:3000`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   
   # Copy environment variables
   cp .env.example .env
   # Edit .env if needed (default: http://localhost:3000/api)
   
   # Start development server
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Environment Variables

#### Backend (`backend/.env`)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
GOOGLE_CLIENT_ID=your_google_client_id (optional)
GOOGLE_CLIENT_SECRET=your_google_client_secret (optional)
PORT=3000
```

#### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback

### Events Endpoints
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (authenticated)
- `PUT /api/events/:id` - Update event (owner only)
- `DELETE /api/events/:id` - Delete event (owner only)

### Participations Endpoints
- `POST /api/participations` - Join an event
- `DELETE /api/participations/:id` - Leave an event
- `GET /api/participations/event/:eventId` - Get event participants
- `GET /api/participations/user/:userId` - Get user participations

## 📁 Project Architecture

### Backend Architecture
```
backend/src/
├── auth/                    # Authentication module
│   ├── strategies/          # Passport strategies (JWT, Google)
│   ├── guards/              # Auth guards
│   └── decorators/          # Custom decorators
├── events/                  # Events module
│   ├── controllers/         # HTTP controllers
│   ├── services/            # Business logic
│   ├── schemas/             # MongoDB schemas
│   └── dto/                 # Data transfer objects
├── participations/          # Participations module
├── upload/                  # File upload module
└── users/                   # Users module
```

### Frontend Architecture
```
frontend/src/
├── components/              # Reusable components
│   ├── auth/               # Auth-related components
│   ├── events/             # Event components
│   └── layout/             # Layout components
├── pages/                   # Page components
│   ├── auth/               # Login, Register
│   ├── events/             # Event pages
│   └── dashboard/          # Dashboard
├── services/                # API services
├── context/                 # React Context (Auth)
├── routes/                  # Route configuration
└── theme/                   # MUI theme customization
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **CORS Protection**: Configured for specific origins
- **Input Validation**: DTO validation with class-validator
- **Role-based Access Control**: Guards for protected routes
- **File Upload Validation**: Type and size restrictions

## 📝 Important Notes

### Data Persistence
- **Database**: All events and users are stored in MongoDB Atlas
- **Images**: Event images are stored locally in `backend/uploads/` (not committed to Git)
- **Production**: For production, use cloud storage (AWS S3, Cloudinary, etc.)

### Development vs Production
- Development uses local file storage for images
- In production, configure cloud storage for uploaded images
- Update CORS settings for production frontend URL

## 🚢 Deployment

### Recommended Platforms
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: Railway, Render, or Heroku
- **Database**: MongoDB Atlas (already cloud-based)
- **Images**: AWS S3, Cloudinary, or similar

### Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure cloud storage for images
- [ ] Update CORS settings with production URLs
- [ ] Enable MongoDB Atlas IP whitelist for production
- [ ] Set up CI/CD pipeline (optional)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- UI components from [Material-UI](https://mui.com/)
- Icons from [Material Icons](https://fonts.google.com/icons)

---

⭐ If you found this project helpful, please give it a star!

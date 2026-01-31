# VaidyaAI Authentication System - Setup Guide

## 🎯 Overview
Complete authentication system for VaidyaAI with secure JWT-based authentication, MongoDB storage, and seamless UI integration.

## 📋 Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git (optional)

## 🚀 Installation & Setup

### Step 1: Install Backend Dependencies

Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then navigate to backend folder and install:
```bash
cd c:\VaidyaAI\backend
npm install
```

### Step 2: Install Frontend Dependencies

```bash
cd c:\VaidyaAI\frontend
npm install react-router-dom axios
```

### Step 3: Configure MongoDB

1. Open `c:\VaidyaAI\backend\.env`
2. Replace `<username>` and `<password>` with your MongoDB Atlas credentials
3. The file should look like:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/vaidyaai
JWT_SECRET=vaidyaai-super-secret-jwt-key-2026-medical-reports-analysis-secure
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## ▶️ Running the Application

### Terminal 1: Start Backend Server
```bash
cd c:\VaidyaAI\backend
npm run dev
```

You should see:
```
✅ MongoDB Connected: cluster.mongodb.net
🚀 Server running on port 5000
🌍 Environment: development
🔗 Frontend URL: http://localhost:5173
```

### Terminal 2: Start Frontend Server
```bash
cd c:\VaidyaAI\frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## 🔄 Navigation Flow

```
Landing Page (/) 
    ↓ Click "Upload Medical Report"
Login Page (/login)
    ↓ Click "Create Account" OR
Register Page (/register)
    ↓ Successful Registration/Login
Dashboard (/main)
    ↓ Click Logout
Landing Page (/)
```

## 🧪 Testing the System

### Test 1: Registration
1. Open http://localhost:5173
2. Click "Upload Medical Report"
3. Click "Create Account"
4. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
5. Click "Create Account"
6. Should redirect to dashboard automatically

### Test 2: Login
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: test@example.com
   - Password: test123
3. Click "Login to Dashboard"
4. Should see dashboard with your name displayed

### Test 3: Protected Routes
1. Logout from dashboard
2. Try accessing http://localhost:5173/main directly
3. Should redirect to login page

### Test 4: Logout
1. Login to dashboard
2. Click logout button in sidebar
3. Should redirect to landing page
4. Token should be cleared from localStorage

## 📁 Project Structure

```
VaidyaAI/
├── backend/
│   ├── controllers/
│   │   └── authController.js      # Register, login, getMe
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification
│   ├── models/
│   │   └── User.js                # MongoDB User schema
│   ├── routes/
│   │   └── authRoutes.js          # API routes
│   ├── .env                       # Environment variables
│   ├── .env.example               # Template
│   ├── package.json
│   └── server.js                  # Express server
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── LandingPage.jsx    # Home page
    │   │   ├── Login.jsx          # Login page
    │   │   ├── Register.jsx       # Registration page
    │   │   ├── Main.jsx           # Dashboard (protected)
    │   │   └── ProtectedRoute.jsx # Route guard
    │   ├── context/
    │   │   └── AuthContext.jsx    # Auth state management
    │   └── App.jsx                # Router setup
    └── package.json
```

## 🔌 API Endpoints

### Public Endpoints
- **POST** `/api/auth/register` - Register new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Protected Endpoints
- **GET** `/api/auth/me` - Get current user
  - Requires: `Authorization: Bearer <token>` header

## 🔒 Security Features

✅ Password hashing with bcrypt (10 salt rounds)
✅ JWT tokens with 7-day expiration
✅ Protected routes with middleware
✅ Input validation on backend
✅ CORS configured for frontend origin
✅ Environment variables for secrets
✅ No password exposure in API responses

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB URI is correct
- Ensure MongoDB Atlas IP whitelist includes your IP (or use 0.0.0.0/0 for testing)
- Check if port 5000 is already in use

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS settings in server.js
- Verify FRONTEND_URL in .env matches your frontend URL

### Login/Register not working
- Open browser console (F12) to see errors
- Check Network tab for API responses
- Verify MongoDB connection is successful
- Check backend terminal for error messages

### PowerShell execution policy error
Run as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🎨 UI Theme
All authentication pages match the existing VaidyaAI medical theme:
- Emerald/Green gradient backgrounds
- Clean, modern design
- Animated blob backgrounds
- Responsive layout
- Professional healthcare aesthetic

## 🔮 Future Enhancements
- Email verification
- Password reset functionality
- OAuth integration (Google, Facebook)
- Role-based access control
- Two-factor authentication
- User profile management
- Medical report history per user

## 📞 Support
If you encounter any issues, check:
1. Backend terminal for server errors
2. Frontend browser console for client errors
3. MongoDB Atlas dashboard for connection issues
4. Network tab in browser DevTools for API calls

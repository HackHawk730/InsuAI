# Insurai - Insurance Management System

A modern React frontend application for Insurai - Insurance Management System.

## Features

- **User Authentication**: Sign up and sign in functionality
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Dashboard**: Comprehensive dashboard with multiple insurance management features
- **Backend Integration**: Seamlessly integrated with Spring Boot backend APIs

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 9090

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at `http://localhost:3000`

## Backend API Endpoints

The frontend integrates with the following backend endpoints:

- **POST** `/InsureAi/singup` - User registration
  - Body: `{ name, email, password, confirmPassword }`
  
- **POST** `/InsureAi/singin` - User login
  - Body: `{ email, password }`

Make sure your Spring Boot backend is running on `http://localhost:9090`

## Project Structure

```
src/
├── components/
│   ├── Signup.jsx       # Sign up component
│   ├── Signin.jsx       # Sign in component
│   ├── Dashboard.jsx    # Main dashboard component
│   ├── Auth.css         # Authentication styles
│   └── Dashboard.css    # Dashboard styles
├── services/
│   └── api.js           # API service for backend integration
├── App.jsx              # Main app component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles
```

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.



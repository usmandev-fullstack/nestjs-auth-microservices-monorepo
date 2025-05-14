# NestJS Auth Microservices

A microservices-based authentication system built with NestJS and MongoDB.

## Quick Start

1. Clone and install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and configure your environment variables:
```bash
cp .env.example .env
```

3. Start services:
```bash
# Start auth service
npm run start:auth

# Start gateway service
npm run start:gateway
```

## Key Features

- 🔐 User authentication & registration
- 👤 Profile management
- 🔄 Password change functionality
- 🎯 Microservices architecture
- 📦 MongoDB integration

## API Endpoints

- POST `/auth/register` - Create new user
- POST `/auth/login` - User login
- GET `/auth/profile` - Get user profile
- POST `/auth/change-password` - Update password
- Get `/auth/users` - Update password

## Environment Variables

Required environment variables in `.env`:
- `MONGODB_URI`: MongoDB connection string
## Tech Stack

- NestJS
- MongoDB with Mongoose
- JWT Authentication
- Microservices Communication TCP

# Mahaplants Backend API

Backend server for Mahaplants plant rental e-commerce application built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Plant Management**: CRUD operations for plant inventory
- **Order Management**: Rental order processing and tracking
- **Contact System**: Customer inquiry handling
- **User Management**: Profile management and admin controls
- **Security**: Helmet, CORS, rate limiting, input validation

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update MongoDB URI and JWT secret
   ```

3. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running locally or update MONGODB_URI
   ```

4. **Seed Database**
   ```bash
   node seeds/seedData.js
   ```

5. **Start Server**
   ```bash
   npm run dev  # Development with nodemon
   npm start    # Production
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Plants
- `GET /api/plants` - Get all plants (with filtering)
- `GET /api/plants/:id` - Get single plant
- `POST /api/plants` - Create plant (Admin)
- `PUT /api/plants/:id` - Update plant (Admin)
- `DELETE /api/plants/:id` - Delete plant (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `GET /api/orders/admin/all` - Get all orders (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (Admin)
- `PUT /api/contact/:id/reply` - Reply to message (Admin)

### Users
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/admin/all` - Get all users (Admin)

## Default Credentials

**Admin Account:**
- Email: admin@mahaplants.com
- Password: admin123

**Test User:**
- Email: john@example.com
- Password: user123

## Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mahaplants
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```
# Getting Started

This guide will help you set up the Eco Roots Bloom project for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Git
- npm or yarn
- Docker (optional, for containerized development)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/eco-roots-bloom.git
cd eco-roots-bloom
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Set up database
npx prisma migrate dev

# Start development server
npm run dev
```

The backend API will be available at `http://localhost:4000`

### 4. Database Setup

1. Create a PostgreSQL database:
```bash
createdb eco_roots_bloom
```

2. Update the database connection in `.env`:
```
DATABASE_URL="postgresql://username:password@localhost:5432/eco_roots_bloom"
```

3. Run migrations:
```bash
npx prisma migrate dev
```

4. Seed the database (optional):
```bash
npx prisma db seed
```

## Development Workflow

### Running Tests

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

### Code Quality Tools

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format
```

### Git Workflow

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Commit your changes:
```bash
git add .
git commit -m "feat: your feature description"
```

4. Push to remote:
```bash
git push origin feature/your-feature-name
```

5. Create a pull request

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)

```
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/eco_roots_bloom
JWT_SECRET=your-secret-key
```

## Project Structure

### Frontend

```
frontend/
├── components/     # React components
├── pages/         # Next.js pages
├── public/        # Static files
├── styles/        # CSS styles
├── utils/         # Utility functions
└── types/         # TypeScript types
```

### Backend

```
backend/
├── src/
│   ├── controllers/  # Route controllers
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript types
├── prisma/          # Database schema
└── tests/           # Test files
```

## Common Issues

### Database Connection

If you encounter database connection issues:
1. Verify PostgreSQL is running
2. Check database credentials
3. Ensure database exists
4. Check port availability

### Port Conflicts

If ports are already in use:
1. Check running processes
2. Kill conflicting processes
3. Use different ports in .env

### Dependencies

If you encounter dependency issues:
1. Delete node_modules
2. Clear npm cache
3. Reinstall dependencies

## Next Steps

1. Read the [Development Guidelines](./development-guidelines.md)
2. Review the [API Documentation](./api-documentation.md)
3. Check the [Project Roadmap](./roadmap.md)
4. Join the development team

## Support

If you need help:
1. Check the [documentation](./README.md)
2. Search existing issues
3. Create a new issue
4. Contact the development team 
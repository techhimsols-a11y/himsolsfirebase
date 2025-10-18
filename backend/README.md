# Eco Roots Bloom Backend

This is the backend API for the Eco Roots Bloom platform, built with Express.js, TypeScript, and Prisma.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-secret-key"

# Server
PORT=3000
NODE_ENV="development"

# Vercel
VERCEL_URL="your-vercel-url"
```

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

For production deployment:
```bash
vercel --prod
```

## Database Setup

1. Generate Prisma client:
```bash
npm run prisma:generate
```

2. Run migrations:
```bash
npm run prisma:migrate
```

3. Seed the database (optional):
```bash
npm run prisma:seed
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Start production server:
```bash
npm start
```

## API Documentation

The API documentation is available in the `/docs` directory of the project root.

## Testing

Run tests:
```bash
npm test
```

## Linting

Run linter:
```bash
npm run lint
```

## Type Checking

Run type checking:
```bash
npm run type-check
``` 
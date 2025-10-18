# Database Seeding Guide

## Development Seeding
For development environment with test data:

```bash
npm run prisma:seed:dev
```

This creates:
- Admin user (admin@ecoroots.com / admin123)
- Test users (user@example.com / user123, jane@example.com / jane123)
- Sample trees (Neem, Mango, Banyan, Tulsi, Peepal)
- Sample orders and service requests

## Production Seeding
For production environment with minimal essential data:

```bash
npm run prisma:seed:prod
```

This creates:
- Admin user only (configurable via environment variables)
- Essential trees only (Neem, Mango, Tulsi)

### Environment Variables for Production:
```bash
ADMIN_PASSWORD=your_secure_password
ADMIN_EMAIL=your_admin_email
ADMIN_MOBILE=your_admin_mobile
```

## Default Seeding
The default seed command runs development seeding:

```bash
npm run prisma:seed
```

## Security Notes
- Seed files are excluded from git for security
- Production seeding uses environment variables for sensitive data
- Development seeding includes test data for easier development 
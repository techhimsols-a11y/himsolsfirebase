# Contributing to Eco Roots Bloom

Thank you for your interest in contributing to Eco Roots Bloom! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](./code-of-conduct.md) before contributing.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Set up development environment
4. Create a new branch
5. Make your changes
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Git
- npm or yarn

### Setup Steps
1. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

2. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update values as needed

3. Set up database:
   ```bash
   cd backend
   npx prisma migrate dev
   ```

4. Start development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend
   cd backend
   npm run dev
   ```

## Making Changes

### Branch Naming
- Feature: `feature/feature-name`
- Bug fix: `bugfix/issue-description`
- Documentation: `docs/description`
- Refactor: `refactor/description`

### Commit Messages
Follow conventional commits format:
```
type(scope): subject

body

footer
```

### Pull Request Process
1. Update documentation
2. Add tests
3. Ensure CI passes
4. Request reviews
5. Address feedback
6. Merge when approved

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## Documentation

### Code Documentation
- Add JSDoc comments
- Document complex logic
- Update README if needed
- Document API changes

### Project Documentation
- Update relevant docs
- Add examples
- Include screenshots
- Document configuration

## Review Process

### Code Review
- Review for functionality
- Check code style
- Verify tests
- Ensure documentation
- Check performance

### Security Review
- Check for vulnerabilities
- Verify authentication
- Review data handling
- Check dependencies

## Release Process

1. Update version
2. Update changelog
3. Create release branch
4. Run full test suite
5. Deploy to staging
6. Perform UAT
7. Deploy to production

## Support

### Getting Help
- Check documentation
- Search issues
- Ask in discussions
- Contact maintainers

### Reporting Issues
- Use issue template
- Include steps to reproduce
- Add screenshots
- Provide environment details

## Recognition

### Contributors
- Added to README
- Listed in changelog
- Featured in releases
- Special mentions

### Maintainers
- Review contributions
- Guide development
- Maintain quality
- Support community

## Additional Resources

- [Project Roadmap](./roadmap.md)
- [Architecture Overview](./architecture.md)
- [API Documentation](./api-documentation.md)
- [Development Guidelines](./development-guidelines.md)
- [Feature Development](./feature-development.md) 
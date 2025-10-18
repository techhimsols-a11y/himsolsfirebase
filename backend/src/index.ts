import { config } from 'dotenv';
import { logger } from './utils/logger';
import app from './app';
import { prisma } from './lib/prisma';

// Load environment variables
config();

const port = process.env.PORT || 3000;

// Function to test database connection
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    logger.info('Successfully connected to the database');
    return true;
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    return false;
  }
}

// Start server only if database connection is successful
async function startServer() {
  try {
    const isConnected = await testDatabaseConnection();
    
    if (!isConnected) {
      logger.error('Server startup aborted due to database connection failure');
      process.exit(1);
    }

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();

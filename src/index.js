require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`KodNest backend listening on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

startServer();

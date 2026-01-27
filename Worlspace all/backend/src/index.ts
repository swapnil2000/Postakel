import app from './app';
import { config } from './config';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║   Postakel Backend Server Running      ║
  ║   Environment: ${config.node_env.padEnd(28)}║
  ║   Port: ${PORT.toString().padEnd(34)}║
  ║   API URL: http://localhost:${PORT.toString().padEnd(19)}║
  ║   Frontend: ${config.frontend_url.padEnd(31)}║
  ╚════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

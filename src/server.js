require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error.message);
  process.exit(1);
});

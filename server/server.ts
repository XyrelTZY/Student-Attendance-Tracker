import express from 'express';
import bodyParser from 'body-parser';
// import authRoutes from './api/auth';

const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// // API Routes
// app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

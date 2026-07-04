import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import apiRouter from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite client (standard port 5173, but can accept all during development)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Bind routes
app.use('/api', apiRouter);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.',
  });
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`TAS Outreach CRM Server running on port ${PORT}`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`==================================================`);
});

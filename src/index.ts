import express from 'express';
import dotenv from 'dotenv';
import askRoute from './routes/ask.js';
import { info } from 'console';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/ask', askRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});




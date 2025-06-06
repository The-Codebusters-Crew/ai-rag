import dotenv from 'dotenv';
import askRoute from './routes/ask.js';
import { info } from 'console';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { allRoutes } from './routes/routes.js';
dotenv.config();
const app = new Hono();
app.route("/", allRoutes);
serve((app), ({ port }) => {
    console.log(`Server is running on http://localhost:${port}`);
});

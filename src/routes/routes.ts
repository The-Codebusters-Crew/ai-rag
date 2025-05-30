import { Hono } from 'hono';
import memoryApi from './memories.js';
// import memoryApi from './routes/memory';

export const allRoutes = new Hono();

allRoutes.route('/memories', memoryApi);


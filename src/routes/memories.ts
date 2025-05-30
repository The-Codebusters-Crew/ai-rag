import { Hono } from 'hono';
import { prismaClient } from '../integrations/prisma/index.js';
import { sessionMiddleware } from './middleware/session-middleware.js';
// import { prisma } from '../prisma';

const memoryApi = new Hono();

// Create a new memory
memoryApi.post('/',sessionMiddleware, async (c) => {
  const { title, content, tags } = await c.req.json();

  if (!content || !tags || !Array.isArray(tags)) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  const memory = await prismaClient.memory.create({
    data: {
      title,
      content,
      tags,
    },
  });

  return c.json(memory, 201);
});

// Get all memories (optionally filter by tag)
memoryApi.get('/', async (c) => {
  const tag = c.req.query('tag');

  const memories = tag
    ? await prismaClient.memory.findMany({
        where: { tags: { has: tag } },
        orderBy: { createdAt: 'desc' },
      })
    : await prismaClient.memory.findMany({
        orderBy: { createdAt: 'desc' },
      });

  return c.json(memories);
});

// Get a single memory by id
memoryApi.get('/:id', async (c) => {
  const id = c.req.param('id');

  const memory = await prismaClient.memory.findUnique({ where: { id } });
  if (!memory) return c.json({ error: 'Memory not found' }, 404);

  return c.json(memory);
});

// Update memory by id
memoryApi.put('/:id', async (c) => {
  const id = c.req.param('id');
  const { title, content, tags } = await c.req.json();

  const memory = await prismaClient.memory.update({
    where: { id },
    data: { title, content, tags },
  }).catch(() => null);

  if (!memory) return c.json({ error: 'Memory not found or invalid data' }, 404);

  return c.json(memory);
});

// Delete memory by id
memoryApi.delete('/:id', async (c) => {
  const id = c.req.param('id');

  const memory = await prismaClient.memory.delete({ where: { id } }).catch(() => null);
  if (!memory) return c.json({ error: 'Memory not found' }, 404);

  return c.json({ message: 'Memory deleted' });
});

export default memoryApi;
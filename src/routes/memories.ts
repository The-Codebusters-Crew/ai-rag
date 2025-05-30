// import { Hono } from 'hono';
// import { prismaClient } from '../integrations/prisma/index.js';
// import { sessionMiddleware } from './middleware/session-middleware.js';
// // import { prisma } from '../prisma';

// const memoryApi = new Hono();

// // Create a new memory
// memoryApi.post('/',sessionMiddleware, async (c) => {
//   const { title, content, tags } = await c.req.json();

//   if (!content || !tags || !Array.isArray(tags)) {
//     return c.json({ error: 'Invalid request body' }, 400);
//   }

//   const memory = await prismaClient.memory.create({
//     data: {
//       title,
//       content,
//       tags,
//     },
//   });

//   return c.json(memory, 201);
// });

// // Get all memories (optionally filter by tag)
// memoryApi.get('/', async (c) => {
//   const tag = c.req.query('tag');

//   const memories = tag
//     ? await prismaClient.memory.findMany({
//         where: { tags: { has: tag } },
//         orderBy: { createdAt: 'desc' },
//       })
//     : await prismaClient.memory.findMany({
//         orderBy: { createdAt: 'desc' },
//       });

//   return c.json(memories);
// });

// // Get a single memory by id
// memoryApi.get('/:id', async (c) => {
//   const id = c.req.param('id');

//   const memory = await prismaClient.memory.findUnique({ where: { id } });
//   if (!memory) return c.json({ error: 'Memory not found' }, 404);

//   return c.json(memory);
// });

// // Update memory by id
// memoryApi.put('/:id', async (c) => {
//   const id = c.req.param('id');
//   const { title, content, tags } = await c.req.json();

//   const memory = await prismaClient.memory.update({
//     where: { id },
//     data: { title, content, tags },
//   }).catch(() => null);

//   if (!memory) return c.json({ error: 'Memory not found or invalid data' }, 404);

//   return c.json(memory);
// });

// // Delete memory by id
// memoryApi.delete('/:id', async (c) => {
//   const id = c.req.param('id');

//   const memory = await prismaClient.memory.delete({ where: { id } }).catch(() => null);
//   if (!memory) return c.json({ error: 'Memory not found' }, 404);

//   return c.json({ message: 'Memory deleted' });
// });

// export default memoryApi;

import { Hono } from 'hono';
import { prismaClient } from '../integrations/prisma/index.js';
import { sessionMiddleware } from './middleware/session-middleware.js';

const memoryApi = new Hono();

// POST /memories – Create a new memory
memoryApi.post('/memories', sessionMiddleware, async (c) => {
  const { title, content, tags } = await c.req.json();

  if (!content || !tags || !Array.isArray(tags)) {
    return c.json({ error: 'Invalid request body' }, 400);
  }

  const memory = await prismaClient.memory.create({
    data: { title, content, tags },
  });

  return c.json(memory, 201);
});

// GET /memories – List all memories (with optional pagination and tag filtering)
memoryApi.get('/memories', async (c) => {
  const tag = c.req.query('tag');
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '10');
  const skip = (page - 1) * limit;

  const memories = await prismaClient.memory.findMany({
    where: tag ? { tags: { has: tag } } : undefined,
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  });

  return c.json(memories);
});

// GET /memories/:id – Get a single memory by ID
memoryApi.get('/memories/:id', async (c) => {
  const id = c.req.param('id');

  const memory = await prismaClient.memory.findUnique({ where: { id } });
  if (!memory) return c.json({ error: 'Memory not found' }, 404);

  return c.json(memory);
});

// PUT /memories/:id – Update memory by ID
memoryApi.put('/memories/:id', async (c) => {
  const id = c.req.param('id');
  const { title, content, tags } = await c.req.json();

  const memory = await prismaClient.memory.update({
    where: { id },
    data: { title, content, tags },
  }).catch(() => null);

  if (!memory) return c.json({ error: 'Memory not found or invalid data' }, 404);

  return c.json(memory);
});

// DELETE /memories/:id – Delete memory by ID
memoryApi.delete('/memories/:id', async (c) => {
  const id = c.req.param('id');

  const memory = await prismaClient.memory.delete({ where: { id } }).catch(() => null);
  if (!memory) return c.json({ error: 'Memory not found' }, 404);

  return c.json({ message: 'Memory deleted' });
});

export default memoryApi;

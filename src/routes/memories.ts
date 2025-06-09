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

// import { Hono } from 'hono';
// import { prismaClient } from '../integrations/prisma/index.js';
// import { sessionMiddleware } from './middleware/session-middleware.js';

// const memoryApi = new Hono();

// // POST /memories – Create a new memory
// memoryApi.post('/', sessionMiddleware, async (c) => {
//   const { title, content, tags } = await c.req.json();
//   const userId =   c.get("user").id;
//   if (!content || !tags || !Array.isArray(tags)) {
//     return c.json({ error: 'Invalid request body' }, 400);
//   }

//   const memory = await prismaClient.memory.create({
//     data: { title, content, tags },
//   });

//   return c.json(memory, 201);
// });

// // GET /memories – List all memories (with optional pagination and tag filtering)
// memoryApi.get('/', async (c) => {
//   const tag = c.req.query('tag');
//   const page = parseInt(c.req.query('page') || '1');
//   const limit = parseInt(c.req.query('limit') || '10');
//   const skip = (page - 1) * limit;

//   const memories = await prismaClient.memory.findMany({
//     where: tag ? { tags: { has: tag } } : undefined,
//     orderBy: { createdAt: 'desc' },
//     skip,
//     take: limit,
//   });

//   return c.json(memories);
// });

// // GET /memories/:id – Get a single memory by ID
// memoryApi.get('/:id', async (c) => {
//   const id = c.req.param('id');

//   const memory = await prismaClient.memory.findUnique({ where: { id } });
//   if (!memory) return c.json({ error: 'Memory not found' }, 404);

//   return c.json(memory);
// });

// // PUT /memories/:id – Update memory by ID
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

// // DELETE /memories/:id – Delete memory by ID
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

function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidTags(tags: unknown): tags is string[] {
  return Array.isArray(tags) && tags.every((tag: unknown) => typeof tag === 'string' && tag.trim().length > 0);
}

// POST /memories – Create a new memory (Authenticated)
memoryApi.post('/', sessionMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { title, content, tags } = await c.req.json();

    if (!isValidString(content) || !isValidTags(tags)) {
      return c.json({ error: 'Invalid request body' }, 400);
    }

    const memory = await prismaClient.memory.create({
      data: {
        title: isValidString(title) ? title : null,
        content,
        tags,
        user: { connect: { id: user.id } },
      },
    });

    return c.json(memory, 201);
  } catch (error) {
    console.error('Error creating memory:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /memories – List all memories of the logged-in user
memoryApi.get('/', sessionMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const tag = c.req.query('tag');
    let page = parseInt(c.req.query('page') || '1');
    let limit = parseInt(c.req.query('limit') || '10');

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const memories = await prismaClient.memory.findMany({
      where: {
        userId: user.id,
        ...(tag && { tags: { has: tag } }),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return c.json(memories);
  } catch (error) {
    console.error('Error fetching memories:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /memories/:id – Get a single memory (only if it belongs to user)
memoryApi.get('/:id', sessionMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');

    const memory = await prismaClient.memory.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!memory) return c.json({ error: 'Memory not found' }, 404);

    return c.json(memory);
  } catch (error) {
    console.error('Error fetching memory:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// PUT /memories/:id – Update memory (only if it belongs to user)
memoryApi.put('/:id', sessionMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');
    const { title, content, tags } = await c.req.json();

    if (!isValidString(content) || !isValidTags(tags)) {
      return c.json({ error: 'Invalid request body' }, 400);
    }

    const existing = await prismaClient.memory.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) return c.json({ error: 'Memory not found or unauthorized' }, 404);

    const updated = await prismaClient.memory.update({
      where: { id },
      data: { title, content, tags },
    });

    return c.json(updated);
  } catch (error) {
    console.error('Error updating memory:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// DELETE /memories/:id – Delete memory (only if it belongs to user)
memoryApi.delete('/:id', sessionMiddleware, async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const id = c.req.param('id');

    const existing = await prismaClient.memory.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) return c.json({ error: 'Memory not found or unauthorized' }, 404);

    await prismaClient.memory.delete({ where: { id } });

    return c.json({ message: 'Memory deleted' });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default memoryApi;

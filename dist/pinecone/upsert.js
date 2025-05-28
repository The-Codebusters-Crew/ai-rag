import { pinecone } from './client.js';
import { generateEmbedding } from '../embeddings/generateEmbeddings.js';
export async function upsertDocument(id, text, metadata) {
    const embedding = await generateEmbedding(text);
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    await index.upsert([
        {
            id,
            values: embedding,
            metadata,
        },
    ]);
}

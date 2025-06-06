import { pinecone } from './client.js';
import { generateEmbedding } from '../embeddings/generateEmbeddings.js';
export async function queryPinecone(query, topK = 5) {
    const embedding = await generateEmbedding(query);
    const index = pinecone.Index(process.env.PINECONE_INDEX);
    const result = await index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
    });
    return result.matches;
}

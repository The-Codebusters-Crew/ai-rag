"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryPinecone = queryPinecone;
const client_js_1 = require("./client.js");
const generateEmbeddings_js_1 = require("../embeddings/generateEmbeddings.js");
async function queryPinecone(query, topK = 5) {
    const embedding = await (0, generateEmbeddings_js_1.generateEmbedding)(query);
    const index = client_js_1.pinecone.Index(process.env.PINECONE_INDEX);
    const result = await index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
    });
    return result.matches;
}
//# sourceMappingURL=query.js.map
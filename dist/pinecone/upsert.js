"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertDocument = upsertDocument;
const client_js_1 = require("./client.js");
const generateEmbeddings_js_1 = require("../embeddings/generateEmbeddings.js");
async function upsertDocument(id, text, metadata) {
    const embedding = await (0, generateEmbeddings_js_1.generateEmbedding)(text);
    const index = client_js_1.pinecone.Index(process.env.PINECONE_INDEX);
    await index.upsert([
        {
            id,
            values: embedding,
            metadata,
        },
    ]);
}
//# sourceMappingURL=upsert.js.map
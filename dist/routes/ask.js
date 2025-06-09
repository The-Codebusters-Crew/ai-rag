"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const query_js_1 = require("../pinecone/query.js");
const buildprompt_js_1 = require("../rag/buildprompt.js");
const queryLLM_js_1 = require("../llm/queryLLM.js");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { question } = req.body;
    const matches = await (0, query_js_1.queryPinecone)(question);
    const contexts = matches.map(match => String(match.metadata?.text ?? ''));
    const prompt = (0, buildprompt_js_1.buildPrompt)(question, contexts);
    const answer = await (0, queryLLM_js_1.queryLLM)(prompt);
    res.json({ answer, references: matches });
});
exports.default = router;
//# sourceMappingURL=ask.js.map
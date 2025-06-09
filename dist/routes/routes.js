"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const hono_1 = require("hono");
const memories_js_1 = __importDefault(require("./memories.js"));
// import memoryApi from './routes/memory';
exports.allRoutes = new hono_1.Hono();
exports.allRoutes.route('/memories', memories_js_1.default);
//# sourceMappingURL=routes.js.map
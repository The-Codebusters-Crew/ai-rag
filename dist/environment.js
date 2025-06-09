"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webClientUrl = exports.serverUrl = exports.betterAuthSecret = void 0;
exports.betterAuthSecret = process.env.BETTER_AUTH_SECRET || process.exit(1);
exports.serverUrl = process.env.SERVER_URL || process.exit(1);
exports.webClientUrl = process.env.WEB_CLIENT_URL || process.env.WEB_CLIENT_URL_2 || process.exit(1);
//# sourceMappingURL=environment.js.map
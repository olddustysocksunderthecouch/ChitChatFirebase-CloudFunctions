"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error = require('./handlers');
exports.default = (functions, admin) => (data, context) => {
    if (!context.auth) {
        return error('Authorization Error', 401);
    }
};
//# sourceMappingURL=startChat.js.map
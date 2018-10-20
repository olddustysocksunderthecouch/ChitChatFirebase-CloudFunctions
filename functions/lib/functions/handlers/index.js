"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlers = {
    error: (message, code) => {
        return {
            status: 'error',
            message,
            code
        };
    },
    success: (message, code) => {
        return {
            status: 'success',
            message,
            code
        };
    }
};
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handlers = {
    error: (message, error, code) => {
        const errorResponse = {
            status: 'error',
            message,
            error,
            code
        };
        console.error(errorResponse);
        return errorResponse;
    },
    success: (message, body, code) => {
        const successResponse = {
            status: 'success',
            message,
            body,
            code
        };
        // console.log(successResponse)
        return successResponse;
    },
    triggerAuthorizationError: () => {
        return exports.Handlers.error('Authorization Error', {
            reason: 'You are not authorized to perform this action'
        }, 401);
    }
};
//# sourceMappingURL=index.js.map
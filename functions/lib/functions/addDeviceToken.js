"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
exports.default = (functions, admin) => (data, context) => {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    return null;
};
//# sourceMappingURL=addDeviceToken.js.map
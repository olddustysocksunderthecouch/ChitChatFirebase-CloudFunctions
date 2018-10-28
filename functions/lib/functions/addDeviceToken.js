"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
exports.default = (functions, admin) => (data, context) => {
    const databaseReference = (path) => admin.database().ref(path);
    const { uid } = context.auth;
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    return databaseReference(`device_tokens/${uid}`).update({
        [data.token]: true
    }).then(() => {
        return handlers_1.Handlers.success('Device token successfully added', {}, 204);
    }).catch(error => {
        return handlers_1.Handlers.error('Could not create user', error, 500);
    });
};
//# sourceMappingURL=addDeviceToken.js.map
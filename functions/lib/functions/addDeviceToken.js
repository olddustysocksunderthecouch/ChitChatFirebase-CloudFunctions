"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
const validators_1 = require("./validators");
exports.default = (functions, admin) => (data, context) => {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { exists, minLength } = validators_1.Validators;
    if (!exists(data.token) || !minLength(data.token, 10)) {
        return handlers_1.Handlers.error('Bad request', null, 400);
    }
    const databaseReference = (path) => admin.database().ref(path);
    const { uid } = context.auth;
    return databaseReference(`device_tokens/${uid}`).update({
        [data.token]: true
    }).then(() => {
        return handlers_1.Handlers.success('Device token successfully added', {}, 204);
    }).catch(error => {
        return handlers_1.Handlers.error('Could not create user', error, 500);
    });
};
//# sourceMappingURL=addDeviceToken.js.map
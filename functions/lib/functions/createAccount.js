"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
const validators_1 = require("./validators");
exports.default = (functions, admin) => (data, context) => {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { exists } = validators_1.Validators;
    if (!exists(data)) {
        return handlers_1.Handlers.error('Bad request', null, 400);
    }
    const timestamp_now = (new Date()).getTime();
    const userRef = admin.database().ref(`users/${context.auth.uid}`);
    return userRef.once('value').then(result => {
        if (result.val()) {
            return handlers_1.Handlers.error('User account creation failed', {
                reason: 'User account already exists'
            }, 500);
        }
        return userRef.update(Object.assign({}, data, { date_joined: timestamp_now })).then(() => {
            return handlers_1.Handlers.success('User Account Created', {}, 204);
        });
    });
};
//# sourceMappingURL=createAccount.js.map
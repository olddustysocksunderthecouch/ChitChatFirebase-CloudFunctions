"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const handlers_1 = require("./handlers");
const validators_1 = require("./validators");
const admin = require('firebase-admin');
exports.addUnreadMessage = (snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { chatID, messageID } = context.params;
    const { exists, minLength } = validators_1.Validators;
    if (!exists(chatID) || !minLength(chatID, 10) || !exists(messageID) || !minLength(messageID, 10)) {
        return handlers_1.Handlers.error('Bad request', null, 400);
    }
    const databaseReference = (path) => admin.database().ref(path);
    try {
        yield databaseReference(`messages_unread/${chatID}`).update({
            [messageID]: true
        });
        return handlers_1.Handlers.success('Unread message counter updated', null, 204);
    }
    catch (error) {
        return handlers_1.Handlers.error('Could not update unread message count', error, 500);
    }
});
//# sourceMappingURL=addUnreadMessage.js.map
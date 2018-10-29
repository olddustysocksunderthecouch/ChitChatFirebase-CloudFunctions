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
const admin = require('firebase-admin');
exports.addUnreadMessage = (snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { chatID, messageID } = context.params;
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
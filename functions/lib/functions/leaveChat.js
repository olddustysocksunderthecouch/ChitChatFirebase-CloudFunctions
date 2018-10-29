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
exports.default = (functions, admin) => (data, context) => __awaiter(this, void 0, void 0, function* () {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { exists, minLength } = validators_1.Validators;
    if (!exists(data.chat_id) || !minLength(data.chat_id, 10)) {
        return handlers_1.Handlers.error('Bad request', null, 400);
    }
    const databaseReference = (path) => admin.database().ref(path);
    const { uid } = context.auth;
    const chatID = data.chat_id;
    const chatMembers = () => {
        return databaseReference(`chat_members/${chatID}`).once('value');
    };
    const numberOfMembersInChat = () => __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const members = yield chatMembers();
                const membersSnapshot = members.val();
                if (!membersSnapshot) {
                    reject('The members list does not exist');
                }
                resolve(Object.keys(membersSnapshot).length);
            }
            catch (error) {
                reject(error);
            }
        }));
    });
    const removeChatPreview = () => {
        return databaseReference(`chat_preview/${uid}/${chatID}`).remove();
    };
    const removeUserFromChatMembers = () => {
        return databaseReference(`chat_preview/${uid}/${chatID}`).remove();
    };
    const removeExistingChatIndicator = () => {
        return databaseReference(`existing_chats/${uid}/${chatID}`).remove();
    };
    try {
        const chatMemberCount = yield numberOfMembersInChat();
        yield removeChatPreview();
        yield removeUserFromChatMembers();
        if (chatMemberCount === 1) {
            yield removeExistingChatIndicator();
        }
        return handlers_1.Handlers.success('Conversation left successfully', {}, 204);
    }
    catch (error) {
        return handlers_1.Handlers.error('Could not leave conversation', error, 204);
    }
});
//# sourceMappingURL=leaveChat.js.map
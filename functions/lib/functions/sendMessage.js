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
const sendNotification_1 = require("./sendNotification");
const validators_1 = require("./validators");
const admin = require('firebase-admin');
exports.sendMessage = (snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { chatID } = context.params;
    const { message } = snapshot.val();
    const { exists, minLength, isType } = validators_1.Validators;
    if (!exists(message) || !isType(message, 'string') || !minLength(message, 1)) {
        return handlers_1.Handlers.error('invalid-argument', {
            reason: 'The function must be called with one arguments "text" containing the message text to add.'
        }, 400);
    }
    const { uid } = context.auth;
    const displayName = context.auth.token.name;
    const timestamp = (new Date()).getTime();
    const databaseReference = (path) => admin.database().ref(path);
    const previewObject = {
        last_message: message,
        unread_message_count: 0,
        sender_name: displayName || 'Unknown',
        sender_uid: uid,
        status: 'sent',
        timestamp
    };
    const updateExistingChatPreview = (userId) => {
        return databaseReference(`chat_preview/${userId}/${chatID}`).update(previewObject);
    };
    const getChatMembers = () => {
        return new Promise((resolve, reject) => {
            return databaseReference(`chat_members/${chatID}`).once('value').then(members => {
                const membersSnapshot = members.val();
                if (membersSnapshot) {
                    const snapshotChatIDs = Object.keys(membersSnapshot);
                    resolve(snapshotChatIDs);
                }
                reject('No chat members found');
            }).catch(error => {
                reject(error);
            });
        });
    };
    try {
        const chatMembers = yield getChatMembers();
        chatMembers.forEach((userId) => __awaiter(this, void 0, void 0, function* () {
            yield updateExistingChatPreview(userId);
        }));
        sendNotification_1.NotificationsService.sendNotifications(admin, uid, message, chatID, displayName, chatMembers);
        return handlers_1.Handlers.success('Chat preview updated', {
            chat_id: chatID
        }, 200);
    }
    catch (error) {
        return handlers_1.Handlers.error('Could not create chat', error, 500);
    }
});
//# sourceMappingURL=sendMessage.js.map
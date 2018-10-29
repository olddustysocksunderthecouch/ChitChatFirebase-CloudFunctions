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
exports.default = (functions, admin) => (data, context) => __awaiter(this, void 0, void 0, function* () {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const { message } = data;
    if (!(typeof message === 'string') || message.length === 0) {
        return handlers_1.Handlers.error('invalid-argument', {
            reason: 'The function must be called with one arguments "text" containing the message text to add.'
        }, 500);
    }
    const { uid, displayName } = context.auth;
    const timestamp = (new Date()).getTime();
    const databaseReference = (path) => admin.database().ref(path);
    const recipientUID = data.recipient_uid;
    let chatID;
    let chatMembers;
    const previewObject = {
        last_message: data.message,
        unread_message_count: 0,
        sender_name: displayName || 'Unknown',
        sender_uid: uid,
        status: 'sent',
        timestamp
    };
    const contactHasExistingChat = () => {
        return new Promise((resolve, reject) => {
            return databaseReference(`existing_chats/${uid}`).once('value').then(chats => {
                const chatsSnapshot = chats.val();
                const snapshotContainsUserID = () => {
                    console.log(chatsSnapshot);
                    if (chatsSnapshot) {
                        const snapshotChatIDs = Object.keys(chatsSnapshot);
                        console.log(snapshotChatIDs);
                        return snapshotChatIDs.length && snapshotChatIDs.indexOf(data.recipient_uid) !== -1;
                    }
                    return false;
                };
                const chatExists = snapshotContainsUserID();
                if (chatExists) {
                    chatID = chatsSnapshot[data.recipient_uid];
                }
                resolve(chatsSnapshot && chatExists);
            }).catch(error => {
                reject(error);
            });
        });
    };
    const addNewContactToExistingChats = () => __awaiter(this, void 0, void 0, function* () {
        try {
            yield databaseReference(`existing_chats/${uid}`).update({
                [recipientUID]: chatID
            });
            return databaseReference(`existing_chats/${recipientUID}`).update({
                [uid]: chatID
            });
        }
        catch (error) {
            handlers_1.Handlers.error('Could not add contact to chat', {
                reason: 'Unknown'
            }, 500);
        }
    });
    const createNewChatPreview = () => {
        return databaseReference(`chat_preview/${uid}`).push(previewObject).then(snapshot => {
            chatID = snapshot.key;
            return databaseReference(`chat_preview/${recipientUID}/${chatID}`).update(Object.assign({}, previewObject, { is_group: false }));
        });
    };
    const updateExistingChatPreview = (userId) => {
        return databaseReference(`chat_preview/${userId}/${chatID}`).update(previewObject);
    };
    const addChatMembers = () => {
        return databaseReference(`chat_members/${chatID}`).update({
            [uid]: true,
            [recipientUID]: true
        });
    };
    const chatIDExists = () => {
        return new Promise((resolve, reject) => {
            return databaseReference(`chat_members/${data.chat_id}`).once('value').then(members => {
                const membersSnapshot = members.val();
                const snapshotContainsUserID = () => {
                    if (membersSnapshot) {
                        const snapshotChatIDs = Object.keys(membersSnapshot);
                        chatMembers = snapshotChatIDs;
                        return snapshotChatIDs.length && snapshotChatIDs.indexOf(uid) !== -1;
                    }
                    return false;
                };
                const chatExists = snapshotContainsUserID();
                if (chatExists) {
                    chatID = data.chat_id;
                }
                resolve(membersSnapshot && chatExists);
            }).catch(error => {
                reject(error);
            });
        });
    };
    try {
        let chatExists;
        if (data.chat_id) {
            chatExists = yield chatIDExists();
        }
        else {
            chatExists = yield contactHasExistingChat();
        }
        if (chatExists) {
            try {
                chatMembers.forEach((userId) => __awaiter(this, void 0, void 0, function* () {
                    yield updateExistingChatPreview(userId);
                }));
                sendNotification_1.NotificationsService.sendNotifications(admin, uid, data.message, chatID, displayName);
                return handlers_1.Handlers.success('Chat preview updated', {
                    chat_id: chatID
                }, 200);
            }
            catch (error) {
                return handlers_1.Handlers.error('Could not create chat', error, 500);
            }
        }
        else {
            try {
                yield createNewChatPreview();
                yield addChatMembers();
                yield addNewContactToExistingChats();
                return handlers_1.Handlers.success('New chat was successfully created', {
                    chat_id: chatID
                }, 200);
            }
            catch (error) {
                return handlers_1.Handlers.error('Could not create chat', error, 500);
            }
        }
    }
    catch (error) {
        return handlers_1.Handlers.error('Could not create chat', error, 500);
    }
});
//# sourceMappingURL=sendMessage.js.map
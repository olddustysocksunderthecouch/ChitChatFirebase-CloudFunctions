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
exports.default = (functions, admin) => (data, context) => __awaiter(this, void 0, void 0, function* () {
    if (!context.auth) {
        return handlers_1.Handlers.triggerAuthorizationError();
    }
    const databaseReference = (path) => admin.database().ref(path);
    const { uid, displayName } = context.auth;
    const { uids } = data;
    const timestamp = (new Date()).getTime();
    const previewObject = {
        last_message: `${displayName} just created a group`,
        unread_message_count: 0,
        sender_name: data.group_name,
        sender_uid: uid,
        status: 'sent',
        timestamp,
        is_group: true
    };
    const createGroupNode = (chatId) => {
        return databaseReference(`groups/${chatId}`).update({
            title: data.group_name,
            date_created: timestamp,
            creator: `displayName`,
            profile_picture: data.profile_picture
        });
    };
    const addChatMembers = (userIDs, chatId) => {
        return databaseReference(`chat_members/${chatId}`).update(userIDs);
    };
    const createNewChatPreviewForGroupCreator = () => {
        return databaseReference(`chat_preview/${uid}`).push(previewObject);
    };
    const createNewChatPreview = (userID, chatId) => {
        return databaseReference(`chat_preview/${userID}/${chatId}`).update(previewObject);
    };
    try {
        const createChatPreview = yield createNewChatPreviewForGroupCreator();
        const chatID = createChatPreview.key;
        const uidsObject = {};
        uids.forEach((userID) => __awaiter(this, void 0, void 0, function* () {
            yield createNewChatPreview(userID, chatID);
            uidsObject[userID] = true;
        }));
        yield createGroupNode(chatID);
        yield addChatMembers(uidsObject, chatID);
        return handlers_1.Handlers.success('Group successfully created', null, 204);
    }
    catch (error) {
        return handlers_1.Handlers.error('Could not add members', error, 500);
    }
});
//# sourceMappingURL=createGroup.js.map
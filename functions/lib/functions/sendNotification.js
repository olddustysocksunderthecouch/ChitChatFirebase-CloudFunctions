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
exports.NotificationsService = {
    sendNotifications: (admin, uid, message, chatID, title = 'New message', uids) => {
        const databaseReference = (path) => admin.database().ref(path);
        const maxTextLength = 55;
        try {
            const trimText = (text) => {
                if (text.length > maxTextLength) {
                    return `${text.substr(0, maxTextLength)}...`;
                }
                return text;
            };
            const payload = {
                notification: {
                    title,
                    body: trimText(message),
                    android_channel_id: chatID,
                    tag: chatID
                }
            };
            const sendNotificationToIndividual = (recipientUID) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const tokens = yield databaseReference(`/device_tokens/${recipientUID}`).once('value');
                    const tokenSnapshot = tokens.val();
                    if (!tokenSnapshot) {
                        return handlers_1.Handlers.success('No device tokens', {}, 204);
                    }
                    const tokensArray = Object.keys(tokenSnapshot);
                    console.log(tokensArray);
                    const response = yield admin.messaging().sendToDevice(tokensArray, payload); // only to one
                    response.results.forEach((result, index) => {
                        const error = result.error;
                        console.warn(error);
                        const tokenErrorPossibilities = ['messaging/invalid-registration-token', 'messaging/registration-token-not-registered'];
                        if (error && tokenErrorPossibilities.indexOf(error.code) !== -1) {
                            databaseReference(`/device_tokens/${recipientUID}/${tokenSnapshot[index]}`).remove();
                        }
                    });
                    return handlers_1.Handlers.success('Notification sent', null, 204);
                }
                catch (error) {
                    return handlers_1.Handlers.error('Could not send notification', error, 500);
                }
            });
            const sendNotifications = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (uids.length > 2) {
                        console.log('Sending group notification');
                        const group = yield databaseReference(`groups/${chatID}`);
                        payload.notification.title = group.val().title;
                    }
                    const uidsToNotify = uids.filter(userID => userID !== uid);
                    uidsToNotify.forEach((userID) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield sendNotificationToIndividual(userID);
                        }
                        catch (error) {
                            console.error(error);
                        }
                    }));
                    return handlers_1.Handlers.success('Notification sent', null, 204);
                }
                catch (error) {
                    return handlers_1.Handlers.error('Could not send notification', error, 500);
                }
            });
            return sendNotifications();
        }
        catch (error) {
            return handlers_1.Handlers.error('Could not fetch device tokens', error, 500);
        }
    }
};
//# sourceMappingURL=sendNotification.js.map
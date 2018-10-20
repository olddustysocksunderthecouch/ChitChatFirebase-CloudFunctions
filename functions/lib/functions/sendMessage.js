"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (functions, admin) => (data, context) => {
    const message = data.message;
    const sender_name = data.sender_name;
    const timestamp = data.timestamp;
    const chatId = data.chat_id;
    const uid = context.auth.uid;
    // Validations and security
    if (!(typeof message === 'string') || message.length === 0) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with ' +
            'one arguments "text" containing the message text to add.');
    }
    if (!context.auth) {
        // Throwing an HttpsError so that the client gets the error details.
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
            'while authenticated.');
    }
    admin.database().ref('/chat_members/' + chatId + '/' + context.auth.uid).once('value', (snapshot) => {
        if (!snapshot.exists()) {
            throw new functions.https.HttpsError('failed-precondition', 'The user must be a member of the chat.');
        }
    });
    admin.database().ref('/chat_members/' + chatId).once('value', (snapshot) => {
        console.log('snapshot.numChildren' + snapshot.numChildren);
        snapshot.forEach((childSnapshot) => {
            console.log(childSnapshot.key);
            return true;
        });
    });
    return admin.database().ref('/messages').push({
        message: message,
        sender_uid: uid,
        sender_name: sender_name,
        timestamp: timestamp,
    }).then(() => {
        console.log('New Message written');
        // Returning the sanitized message to the client.
        return { message: message };
    });
    // [END returnMessageAsync]
    //   .catch((error) => {
    //     // Re-throwing the error as an HttpsError so that the client gets the error details.
    //     throw new functions.https.HttpsError('unknown', error.message, error);
    //   });
    // [END_EXCLUDE]
};
// [END messageFunctionTrigger]
//# sourceMappingURL=sendMessage.js.map
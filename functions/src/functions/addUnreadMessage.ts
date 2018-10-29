import { Handlers } from './handlers'
const admin = require('firebase-admin')

export const addUnreadMessage = async (snapshot, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const { chatID, messageID } = context.params;
  const databaseReference = (path: string) => admin.database().ref(path)

  try {
    await databaseReference(`messages_unread/${chatID}`).update({
      [messageID]: true
    })

    return Handlers.success('Unread message counter updated', null, 204)
  } catch (error) {
    return Handlers.error('Could not update unread message count', error, 500)
  }
}

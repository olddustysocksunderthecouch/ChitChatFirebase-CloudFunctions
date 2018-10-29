import { Handlers } from './handlers'
import { Validators } from './validators'
const admin = require('firebase-admin')

export const addUnreadMessage = async (snapshot, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const { chatID, messageID } = context.params
  const { exists, minLength } = Validators

  if(!exists(chatID) || !minLength(chatID, 10) || !exists(messageID) || !minLength(messageID, 10)) {
    return Handlers.error('Bad request', null, 400)
  }

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

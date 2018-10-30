import { Handlers } from './handlers'

const admin = require('firebase-admin')

export const deleteUnreadMessages = async (snapshot, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const { userID , chatID } = context.params

  const databaseReference = (path: string) => admin.database().ref(path)

  try {
    await databaseReference(`chat_preview/${userID}/${chatID}`).update({
      unread_message_count: 0
    })

    return Handlers.success('Unread message counter updated', null, 204)
  } catch (error) {
    return Handlers.error('Could not update unread message count', error, 500)
  }
}

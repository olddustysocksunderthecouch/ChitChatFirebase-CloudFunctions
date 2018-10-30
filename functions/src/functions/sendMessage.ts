import { Handlers } from './handlers'
import { NotificationsService } from './sendNotification'
import { Validators } from './validators'
const admin = require('firebase-admin')

export const sendMessage = async (snapshot, context) => {

  if (!context.auth) {
    return Handlers.triggerAuthorizationError()
  }

  const { chatID, messageID } = context.params
  const { message } = context.data.val()

  const { exists, minLength, isType } = Validators

  if (!exists(message) || !isType(message, 'string') || !minLength(message, 1)) {
    return Handlers.error('invalid-argument', {
      reason: 'The function must be called with one arguments "text" containing the message text to add.'
    }, 400)
  }

  const { uid } = context.auth
  const displayName = context.auth.token.name
  const timestamp: number = (new Date()).getTime()
  const databaseReference = (path: string) => admin.database().ref(path)

  const previewObject = {
    last_message: message,
    unread_message_count: 0,
    sender_name: displayName || 'Unknown',
    sender_uid: uid,
    status: 'sent',
    timestamp
  }

  const updateExistingChatPreview = (userId): Promise<any> => {
    return databaseReference(`chat_preview/${userId}/${chatID}`).update(previewObject)
  }

  const getChatMembers = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      return databaseReference(`chat_members/${chatID}`).once('value').then(members => {
        const membersSnapshot = members.val()

        if (membersSnapshot) {
          const snapshotChatIDs = Object.keys(membersSnapshot)
          return resolve(snapshotChatIDs)
        }

        return reject('No chat members found') 
      }).catch(error => {
        reject(error)
      })
    })
  }

  try {
    const chatMembers = await getChatMembers() 

    chatMembers.forEach(async (userId) => {
      await updateExistingChatPreview(userId)
    })

    NotificationsService.sendNotifications(admin, uid, message, chatID, displayName, chatMembers)

    return Handlers.success('Chat preview updated', {
      chat_id: chatID
    }, 200)
  } catch (error) {
    return Handlers.error('Could not create chat', error, 500)
  }
}

import { Handlers } from './handlers'
import { NotificationsService } from './sendNotification'
import { Validators } from './validators'

export default (functions, admin) => async (data, context) => {

  if (!context.auth) {
    return Handlers.triggerAuthorizationError()
  }

  const { exists, minLength, isType } = Validators

  if (!exists(data.message) || !isType(data.message, 'string') || !minLength(data.message, 1)) {
    return Handlers.error('invalid-argument', {
      reason: 'The function must be called with one arguments "text" containing the message text to add.'
    }, 400)
  }

  const { uid } = context.auth
  const displayName = context.auth.token.name
  const timestamp: number = (new Date()).getTime()
  const databaseReference = (path: string) => admin.database().ref(path)
  const recipientUID: string = data.recipient_uid
  let chatID: string
  let chatMembers: Array<string>

  const previewObject = {
    last_message: data.message,
    unread_message_count: 0,
    sender_name: displayName || 'Unknown',
    sender_uid: uid,
    status: 'sent',
    timestamp
  }
  
  const addNewContactToExistingChats = async (): Promise<any> => {
    try {
      await databaseReference(`existing_chats/${uid}`).update({
        [recipientUID]: chatID
      })
  
      return databaseReference(`existing_chats/${recipientUID}`).update({
        [uid]: chatID
      })
    } catch(error) {
      Handlers.error('Could not add contact to chat', {
        reason: 'Unknown'
      }, 500)
    }
  }

  const createNewChatPreview = (): Promise<any> => {
    return databaseReference(`chat_preview/${uid}`).push({ ...previewObject, recipient_uid: recipientUID }).then(snapshot => {
      chatID = snapshot.key
      return databaseReference(`chat_preview/${recipientUID}/${chatID}`).update({
        ...previewObject,
        is_group: false,
        recipient_uid: uid
      })
    })
  }

  const addChatMembers = (): Promise<any> => {
    return databaseReference(`chat_members/${chatID}`).update({
      [uid]: true,
      [recipientUID]: true
    })
  }

  try {
    await createNewChatPreview()
    await addChatMembers()
    await addNewContactToExistingChats()
    NotificationsService.sendNotifications(admin, uid, data.message, chatID, displayName, [data.recipient_uid])

    return Handlers.success('New chat was successfully created', {
        chat_id: chatID
    }, 200)
  } catch(error) {
    return Handlers.error('Could not create chat', error, 500)
  }
}

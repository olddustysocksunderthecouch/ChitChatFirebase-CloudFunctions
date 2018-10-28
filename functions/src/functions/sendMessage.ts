import { Handlers } from './handlers'

export default (functions, admin) => async (data, context) => {
  const message = data.message;
  // Validations and security
  if (!(typeof message === 'string') || message.length === 0) {
      return Handlers.error('invalid-argument', {
        reason: 'The function must be called with one arguments "text" containing the message text to add.'
      }, 500);
  }

  if (!context.auth) {
    return Handlers.triggerAuthorizationError()
  }

  const { uid } = context.auth
  const timestamp = (new Date()).getTime()
  const databaseReference = (path: string) => admin.database().ref(path)
  const recipientUID = data.recipient_uid
  let chatID

  const previewObject = {
    last_message: data.message,
    unread_message_count: 0,
    sender_name: data.sender_name,
    sender_uid: data.sender_uid,
    timestamp
  }

  const contactHasExistingChat = () => {
    databaseReference(`existing_chats/${uid}`).once('value').then(chats => {
      const chatsSnapshot = chats.val()

      const snapshotContainsUserID = () => {
        const snapshotChatIDs = Object.keys(chatsSnapshot)
        return snapshotChatIDs.length && snapshotChatIDs.indexOf(data.contact_uid) !== -1 
      }

      if (snapshotContainsUserID) {
        chatID = chatsSnapshot[data.contact_uid]
      }

      return chatsSnapshot && snapshotContainsUserID
    })
  }
  
  const addNewContactToExistingChats = () => {
    const updateSenderChatList = databaseReference(`existing_chats/${uid}`).update({
      [recipientUID]: chatID
    })

    const updateRecipientChatList = admin.database().ref(`existing_chats/${recipientUID}`).update({
      [uid]: chatID
    })

    return Promise.all([updateSenderChatList, updateRecipientChatList])
  }

  const createNewChatPreview = () => {
    return databaseReference(`chat_preview/${uid}`).push(previewObject).then(key => {
      chatID = key
      databaseReference(`chat_preview/${uid}/${key}`).update(previewObject)
    })
  }

  const updateExistingChatPreview = () => {
    return databaseReference(`chat_preview/${uid}/${chatID}`).update({
      last_message: data.message,
      unread_message_count: 0,
      sender_name: data.sender_name,
      sender_uid: data.sender_uid,
      timestamp
    })
  }

  const addChatMembers = () => {
    return databaseReference(`chat_members/${chatID}`).update({
      uid: true,
      recipientUID: true
    })
  }

  if (contactHasExistingChat) {
    try {
      await updateExistingChatPreview()

      return Handlers.success('Chat preview updated', {
        chat_id: chatID
      }, 200)
    } catch(error) {
      return Handlers.error('Could not create chat', error, 500)
    }
  } else {
    try {
      await addChatMembers()
      await addNewContactToExistingChats()
      await createNewChatPreview()

      return Handlers.success('New chat was successfully created', {
        chat_id: chatID
      }, 200)
    } catch(error) {
      return Handlers.error('Could not create chat', error, 500)
    }
  }
}
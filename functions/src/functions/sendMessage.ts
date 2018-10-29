import { Handlers } from './handlers'
import { NotificationsService } from './sendNotification'
import { Validators } from './validators'

export default (functions, admin) => async (data, context) => {

  if (!context.auth) {
    return Handlers.triggerAuthorizationError()
  }

  const { exists, minLength, isType } = Validators
  
  if(!exists(data.chat_id) || !minLength(data.chat_id, 10)) {
    return Handlers.error('Bad request', null, 400)
  }

  if (!exists(data.message) || isType(data.message, 'string') || minLength(data.message, 1)) {
    return Handlers.error('invalid-argument', {
      reason: 'The function must be called with one arguments "text" containing the message text to add.'
    }, 500)
  }

  const { message } = data

  const { uid, displayName } = context.auth
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

  const contactHasExistingChat = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      return databaseReference(`existing_chats/${uid}`).once('value').then(chats => {
        const chatsSnapshot = chats.val()

        const snapshotContainsUserID = () => {
          console.log(chatsSnapshot)
          if (chatsSnapshot) {
            const snapshotChatIDs = Object.keys(chatsSnapshot)
            console.log(snapshotChatIDs)
            return snapshotChatIDs.length && snapshotChatIDs.indexOf(data.recipient_uid) !== -1 
          }

          return false   
        }

        const chatExists = snapshotContainsUserID()
  
        if (chatExists) {
          chatID = chatsSnapshot[data.recipient_uid]
        }

        resolve(chatsSnapshot && chatExists)
      }).catch(error => {
        reject(error)
      })
    })
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
    return databaseReference(`chat_preview/${uid}`).push(previewObject).then(snapshot => {
      chatID = snapshot.key
      return databaseReference(`chat_preview/${recipientUID}/${chatID}`).update({
        ...previewObject,
        is_group: false
      })
    })
  }

  const updateExistingChatPreview = (userId): Promise<any> => {
    return databaseReference(`chat_preview/${userId}/${chatID}`).update(previewObject)
  }

  const addChatMembers = (): Promise<any> => {
    return databaseReference(`chat_members/${chatID}`).update({
      [uid]: true,
      [recipientUID]: true
    })
  }

  const chatIDExists = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      return databaseReference(`chat_members/${data.chat_id}`).once('value').then(members => {
        const membersSnapshot = members.val()

        const snapshotContainsUserID = () => {
          if (membersSnapshot) {
            const snapshotChatIDs = Object.keys(membersSnapshot)
            chatMembers = snapshotChatIDs
            return snapshotChatIDs.length && snapshotChatIDs.indexOf(uid) !== -1 
          }

          return false   
        }

        const chatExists = snapshotContainsUserID()
        
        if (chatExists) {
          chatID = data.chat_id
        }

        resolve(membersSnapshot && chatExists)
      }).catch(error => {
        reject(error)
      })
    })
  }

  try {
    let chatExists

    if (data.chat_id) {
      chatExists = await chatIDExists()
    } else {
      chatExists = await contactHasExistingChat()
    }

    if (chatExists) {
      try {
        chatMembers.forEach(async (userId) => {
          await updateExistingChatPreview(userId)
        })
        
        NotificationsService.sendNotifications(admin, uid, data.message, chatID, displayName)
  
        return Handlers.success('Chat preview updated', {
          chat_id: chatID
        }, 200)
      } catch(error) {
        return Handlers.error('Could not create chat', error, 500)
      }
    } else {
      try {
        await createNewChatPreview()
        await addChatMembers()
        await addNewContactToExistingChats()
  
        return Handlers.success('New chat was successfully created', {
          chat_id: chatID
        }, 200)
      } catch(error) {
        return Handlers.error('Could not create chat', error, 500)
      }
    }
  } catch (error) {
    return Handlers.error('Could not create chat', error, 500)
  }
}

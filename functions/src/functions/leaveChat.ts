import { Handlers } from './handlers'

export default (functions, admin) => async (data, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const databaseReference = (path: string) => admin.database().ref(path)
  const { uid } = context.auth
  const chatID: string = data.chat_id

  const chatMembers = () => {
    return databaseReference(`chat_members/${chatID}`).once('value')
  }

  const numberOfMembersInChat = async (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const members = await chatMembers()
        const membersSnapshot = members.val()
        
        if (!membersSnapshot) {
          reject('The members list does not exist')
        }

        resolve(Object.keys(membersSnapshot).length)
      } catch (error) {
        reject(error)
      }
    })
  }

  const removeChatPreview = (): Promise<any> => {
    return databaseReference(`chat_preview/${uid}/${chatID}`).remove()
  }

  const removeUserFromChatMembers = (): Promise<any> => {
    return databaseReference(`chat_preview/${uid}/${chatID}`).remove()
  }

  const removeExistingChatIndicator = (): Promise<any> => {
    return databaseReference(`existing_chats/${uid}/${chatID}`).remove()
  } 

  try {
    const chatMemberCount = await numberOfMembersInChat()
    await removeChatPreview()
    await removeUserFromChatMembers()

    if (chatMemberCount === 1) {
      await removeExistingChatIndicator()
    }

    return Handlers.success('Conversation left successfully', {}, 204)
  } catch (error) {
    return Handlers.error('Could not leave conversation', error, 204)
  }
}

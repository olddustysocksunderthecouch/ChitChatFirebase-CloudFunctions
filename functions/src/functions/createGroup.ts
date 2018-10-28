import { Handlers } from './handlers'

export default (functions, admin) => async (data, context) => {
  const databaseReference = (path: string) => admin.database().ref(path)
  const { uid, displayName } = context.auth
  const { uids } = data
  const timestamp: number = (new Date()).getTime()

	if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const previewObject = {
    last_message: data.message,
    unread_message_count: 0,
    sender_name: data.group_name,
    sender_uid: uid,
    status: 'sent',
    timestamp
  }

  const createGroupNode = (chatId: string) => {
    return databaseReference(`groups/${chatId}`).update({
      title: data.group_name,
      date_created: timestamp,
      creator: displayName,
      profile_picture: data.profile_picture
    })
  }

  const addChatMembers = (userIDs: Array<string>, chatId: string): Promise<any> => {
    return databaseReference(`chat_members/${chatId}`).update(userIDs)
  }

  const createNewChatPreviewCreator = (): Promise<any> => {
    return databaseReference(`chat_preview/${uid}`).push(previewObject)
  }

  const createNewChatPreview = (userID: string, chatId: string): Promise<any> => {
    return databaseReference(`chat_preview/${userID}/${chatId}`).update(previewObject)
  }

  const creatorChatPreview = await createNewChatPreviewCreator()
  const chatID = creatorChatPreview.key

  const mappedIDs: Array<any> = uids.map(async (userID) => {
    try {
      await createNewChatPreview(userID, chatID)
    } catch(error) {
      console.error(error)
    }

    return {
      userID: true
    }
  })

  try {
    await createGroupNode(chatID)
    await addChatMembers(mappedIDs, chatID)
    return Handlers.success('Group successfully created', null, 204)
  } catch (error) {
    return Handlers.error('Could not add members', error, 500)
  }
}

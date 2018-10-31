import { Handlers } from './handlers'
import { Validators } from './validators'

export default (functions, admin) => async (data, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const { status } = data
  const chatID = data.chat_id
  const messageID = data.message_id

  const { exists } = Validators

  if(!exists(data) || !exists(data.chat_id) || !exists(data.message_id)) {
    return Handlers.error('Bad request', null, 400)
  }

  const databaseReference = (path: string) => admin.database().ref(path)
  const { uid } = context.auth

  const updateStatus = (): Promise<any> => {
    return databaseReference(`messages/${chatID}/${messageID}/status`).update({
      [uid]: status
    })
  }

  try {
    await updateStatus()
    return Handlers.success('Status successfully updated', {}, 204)
  } catch (error) {
    return Handlers.error('Could not update status', error, 500)
  }
}

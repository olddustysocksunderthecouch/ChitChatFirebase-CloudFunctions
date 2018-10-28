import { Handlers } from './handlers'

export const NotificationsService = {
  sendNotifications: (admin: any, uid: string, message: string, chatID: string, title: string) => {
    const databaseReference = (path: string) => admin.database().ref(path)
    const maxTextLength = 55

    try {
      const trimText = (text: string): string => {
        if (text.length > maxTextLength) {
          return `${text.substr(0, maxTextLength)}...`
        }
  
        return text
      }
  
      const payload = {
        notification: {
          title,
          body: trimText(message),
          android_channel_id: chatID,
          tag: chatID
        }
      }
  
      const sendNotificationToIndividual = async (recipientUID: string) => {
        try {
          const tokens = await databaseReference(`/device_tokens/${recipientUID}`).once('value')
          const tokenSnapshot = tokens.val()
  
          if (!tokenSnapshot) {
            return Handlers.success('No device tokens', {}, 204)
          }
  
          const tokensArray = Object.keys(tokenSnapshot)
          const response = await admin.messaging().sendToDevice(tokensArray, payload)
  
          response.results.forEach((result, index) => {
            const error = result.error
            const tokenErrorPossibilities = ['messaging/invalid-registration-token', 'messaging/registration-token-not-registered']
  
            if (error && tokenErrorPossibilities.indexOf(error.code) !== -1) {
              databaseReference(`/device_tokens/${recipientUID}/${tokenSnapshot[index]}`).remove();
            }
          })
  
          return Handlers.success('Notification sent', null, 204)
        } catch (error) {
          return Handlers.error('Could not send notification', error, 500)
        }
      }
  
      const sendNotifications = async () => {
        try {
          const chatMembers = await databaseReference(`chat_members/${chatID}`)
          const uids: Array<string> = Object.keys(chatMembers.val())

          if (uids.length > 2) {
            const group: any = await databaseReference(`groups/${chatID}`)
            payload.notification.title = group.val().title
          }

          const uidsToNotify = uids.filter(userID => userID !== uid)
    
          uidsToNotify.forEach(async (userID) => {
            try {
              await sendNotificationToIndividual(userID)
            } catch(error) {
              console.error(error)
            }
          })
    
          return Handlers.success('Notification sent', null, 204)
        } catch (error) {
          return Handlers.error('Could not send notification', error, 500)
        }
      }
    
      return sendNotifications()
    } catch (error) {
      return Handlers.error('Could not fetch device tokens', error, 500)
    }
  }
}

import { Handlers } from './handlers'

export default (functions, admin) => (data, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const timestamp_now: number = (new Date()).getTime()
  const userRef = admin.database().ref(`users/${context.auth.uid}`)

  return userRef.once('value').then(result => {
    if (result.val()) {
      return Handlers.error('User account creation failed', {
        reason: 'User account already exists'
      }, 500)
    }

    return userRef.update({
      ...data,
      date_joined: timestamp_now
    }).then(() => {
      return Handlers.success('User Account Created', {}, 204)
    })
  })
  
  
}

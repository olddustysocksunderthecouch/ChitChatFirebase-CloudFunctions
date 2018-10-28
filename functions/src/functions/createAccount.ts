import { Handlers } from './handlers'

export default (functions, admin) => (data, context) => {
  const timestamp_now = (new Date()).getTime()
  const userRef = admin.database().ref(`users/${context.auth.uid}`)

	if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  return userRef.once('value').then(result => {
    if (result.val()) {
      return Handlers.error('User account creation failed', {
        reason: 'User account already exists'
      }, 500)
    }

    return userRef.update({
      ...data,
      date_joined: timestamp_now
    }).then(res => {
      return Handlers.success('User Account Created', {}, 204)
    })
  })
  
  
}
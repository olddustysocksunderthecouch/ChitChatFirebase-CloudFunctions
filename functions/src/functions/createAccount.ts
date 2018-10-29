import { Handlers } from './handlers'
import { Validators } from './validators'

export default (functions, admin) => (data, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const { exists, minLength } = Validators

  if(!exists(data)) {
    return Handlers.error('Bad request', null, 400)
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

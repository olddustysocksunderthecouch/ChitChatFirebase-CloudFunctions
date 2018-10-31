import { Handlers } from './handlers'
import { Validators } from './validators'

export default (functions, admin) => (data, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const { exists, minLength } = Validators

  if(!exists(data.token) || !minLength(data.token, 10)) {
    return Handlers.error('Bad request', null, 400)
  }

  const databaseReference = (path: string) => admin.database().ref(path)
  const { uid } = context.auth

  return databaseReference(`device_tokens/${uid}`).update({
    [data.token]: true
  }).then(() => {
    return Handlers.success('Device token successfully added', {}, 204)
  }).catch(error => {
    return Handlers.error('Could not add device token', error, 500)
  })
}

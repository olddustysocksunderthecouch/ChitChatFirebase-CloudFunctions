import { Handlers } from './handlers'

export default (functions, admin) => (data, context) => {

  if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }

  const databaseReference = (path: string) => admin.database().ref(path)
  const { uid } = context.auth

  return databaseReference(`device_tokens/${uid}`).update({
    [data.token]: true
  }).then(() => {
    return Handlers.success('Device token successfully added', {}, 204)
  }).catch(error => {
    return Handlers.error('Could not create user', error, 500)
  })
}

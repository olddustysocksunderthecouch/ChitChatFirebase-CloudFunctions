import { Handlers } from './handlers'

export default (functions, admin) => (data, context) => {

	if (!context.auth) {
		return Handlers.triggerAuthorizationError()
  }
  
  return null
}
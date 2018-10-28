export const Handlers = {
  error: (message, error, code) => {
    return {
      status: 'error',
      message,
      error,
      code
    }
  },
  success: (message, body, code) => {
    return {
      status: 'success',
      message,
      body,
      code
    }
  },
  triggerAuthorizationError: () => {
    return Handlers.error('Authorization Error', {
      reason: 'You are not authorized to perform this action'
    }, 401)
  }
}
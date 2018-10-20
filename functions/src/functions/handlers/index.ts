export const Handlers = {
  error: (message, code) => {
    return {
      status: 'error',
      message,
      code
    }
  },
  success: (message, code) => {
    return {
      status: 'success',
      message,
      code
    }
  }
}
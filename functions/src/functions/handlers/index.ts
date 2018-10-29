import { ErrorResponse, SuccessResponse } from '../../interfaces/responses.model'

export const Handlers = {
  error: (message: string, error: any, code: number): ErrorResponse => {
    return {
      status: 'error',
      message,
      error,
      code
    }
  },
  success: (message: string, body: any, code: number): SuccessResponse => {
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

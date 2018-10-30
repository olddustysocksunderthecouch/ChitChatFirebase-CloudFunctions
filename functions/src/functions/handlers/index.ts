import { ErrorResponse, SuccessResponse } from '../../interfaces/responses.model'

export const Handlers = {
  error: (message: string, error: any, code: number): ErrorResponse => {
    const errorResponse: ErrorResponse = {
      status: 'error',
      message,
      error,
      code
    }

    console.error(errorResponse)
    return errorResponse
  },
  success: (message: string, body: any, code: number): SuccessResponse => {
    const successResponse: SuccessResponse = {
      status: 'success',
      message,
      body,
      code
    }

    // console.log(successResponse)
    return successResponse
  },
  triggerAuthorizationError: () => {
    return Handlers.error('Authorization Error', {
      reason: 'You are not authorized to perform this action'
    }, 401)
  }
}

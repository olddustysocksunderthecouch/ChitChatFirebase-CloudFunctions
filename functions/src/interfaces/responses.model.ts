export interface ErrorResponse {
  status: string;
  message: string;
  error: any;
  code: number
}

export interface SuccessResponse {
  status: string;
  message: string;
  body: any;
  code: number
}

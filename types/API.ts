export interface SuccessResponse<T> {
  message?: string;
  success?: boolean;
  data?: T;
}

export interface ErrorResponse {
  success?: boolean;
  error?: string;
  details?: string;
}

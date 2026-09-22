export interface SuccessResponse<T> {
  message?: string;
  success?: boolean;
  data?: T;
  source?: "redis" | "database";
}

export interface ErrorResponse {
  success?: boolean;
  error?: string;
  details?: string;
}

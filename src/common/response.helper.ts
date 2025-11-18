export function successResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200,
) {
  return {
    statusCode,
    message,
    data,
  };
}

export function failureResponse(
  message = 'Failed',
  statusCode = 400,
  error: any = null,
) {
  return {
    statusCode,
    message,
    error,
  };
}

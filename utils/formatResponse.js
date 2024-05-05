function successResponse(data, statusCode = 200) {
  return { success: true, data, statusCode };
}

function errorResponse(
  errorMessage = 'Internal Server Error',
  statusCode = 500,
) {
  return { success: false, message: errorMessage, statusCode };
}

module.exports = {
  successResponse,
  errorResponse,
};

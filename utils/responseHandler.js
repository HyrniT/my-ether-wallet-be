function successResponse(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

function errorResponse(res, errorCode, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
    },
  });
}

module.exports = {
  successResponse,
  errorResponse,
};

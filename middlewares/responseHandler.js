const responseHandler = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');

  res.sendResponse = responseData => {
    const { success, data, message, statusCode } = responseData;
    if (success) {
      res.status(statusCode).json({ success, data });
    } else {
      res.status(statusCode).json({ success, message });
    }
  };
  next();
};

module.exports = responseHandler;

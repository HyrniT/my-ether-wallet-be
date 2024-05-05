const formatResponse = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');

  const originalJson = res.json;
  res.json = function (data) {
    if (typeof data === 'object' && !(data instanceof Error)) {
      const formattedData = {
        success: true,
        data: data,
      };
      originalJson.call(this, formattedData);
    } else {
      originalJson.call(this, data);
    }
  };

  next();
};

module.exports = formatResponse;

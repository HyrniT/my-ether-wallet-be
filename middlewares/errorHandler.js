// const errorHandler = (err, req, res, next) => {
//   console.error(err.stack);

//   let statusCode = err.statusCode || 500;
//   let errorMessage = err.message || 'Internal Server Error';

//   switch (statusCode) {
//     case 400:
//       errorMessage = 'Bad Request';
//       break;
//     case 401:
//       errorMessage = 'Unauthorized';
//       break;
//     case 403:
//       errorMessage = 'Forbidden';
//       break;
//     case 404:
//       errorMessage = 'Not Found';
//       break;
//     default:
//       if (statusCode >= 500) {
//         console.error(err.stack);
//       }
//       break;
//   }

//   res.status(statusCode).json({ success: false, error: errorMessage });
// };

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';

  res.status(statusCode).json({ success: false, message: errorMessage });
};

module.exports = errorHandler;

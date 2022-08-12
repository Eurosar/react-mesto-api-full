const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
  // Если ошибка относится к ApiError
  if (err instanceof ApiError) {
    // Вернем статус ошибки и ее сообщение согласно настройкам
    res.status(err.status).json({ message: err.message });
  } else {
    res.status(500).json({ message: 'Непредвиденная ошибка!' });
  }
  // Иначе вернем 500 ошибку
  next();
};

module.exports = errorHandler;

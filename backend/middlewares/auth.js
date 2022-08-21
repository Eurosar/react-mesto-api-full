const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');

/**
 * Функция проверки авторизации пользователя
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
module.exports = (req, res, next) => {
  // Если токен сохраняется в куки, то нужно будет подключить в файле app.js cookieParser
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    res.clearCookie('jwt');
    return next(ApiError.Unauthorized('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};

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
  // Если токен сохраняется не в куки, то нужна будет следующая проверка
  // const { authorization } = req.headers;
  // // Если нет в заголовке авторизации или нет авторизации Bearer
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  //   // Выведем ошибку 401
  //   return next(ApiError.Unauthorized('Необходима авторизация'));
  // }
  //
  // const token = authorization.replace('Bearer ', '');


  // Если токен сохраняется в куки, то нужно будет подключить в файле app.js cookieParser
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;
  let payload;


  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(ApiError.Unauthorized('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};

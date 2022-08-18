const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiError = require('../errors/ApiError');

/**
 * Найдем пользователя по id
 * @param id
 * @param res
 * @param next
 */
function findUserById(id, res, next) {
  User.findById(id)
    .then((user) => {
      // Если пользователь не найден
      if (!user) {
        // Вернем 404 ошибку
        return next(ApiError.NotFoundError('Пользователь по указанному _id не найден'));
      }
      // Иначе вернем объект пользователя (status 200 по умолчанию)
      return res.send({ data: user });
    })
    // Иначе вернем ошибки
    .catch((err) => {
      // Если ошибка относится к CastError
      if (err.name === 'CastError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Некорректный id пользователя'));
      }
      // Иначе вернем 500 ошибку
      return next(err);
    });
}

/**
 * Создаем пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.createUser = (req, res, next) => {
  // Деструктурируем данные, полученные от клиента
  const {
    name, about, avatar, email, password,
  } = req.body;
  // Хешируем пароль и создаем пользователя в БД
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    // Если все в порядке, вернем готовый объект со статусом 201
    // но без пароля
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    // Иначе
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // Возвращаем 400 ошибку
        return next(ApiError.BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      // Если ошибка относится к MongoError
      if (err.name === 'MongoError' && err.code === 11000) {
        // Возвращаем 409 ошибку
        return next(ApiError.Conflict('Уже существует пользователь с данным email'));
      }
      // Иначе возвращаем 500 ошибку
      return next(err);
    });
};

/**
 * Получаем всех пользователей
 * @param req
 * @param res
 * @param next
 */
module.exports.getUsers = (req, res, next) => {
  // Ищем всех пользователей в БД
  User.find({})
  // Если все в порядке
    .then((users) => {
      // Возвращаем массив пользователей (status 200 по умолчанию)
      res.send({ data: users });
    })
  // Иначе возвращаем 500 ошибку
  // Все ошибки, которые не являются инстансами класса ApiError,
  // обработчик ошибок воспринимает как 500 ошибка,
  // то можно в данном случае написать просто .catch(next)
    .catch(next);
};

/**
 * Получаем пользователя по id
 * @param req
 * @param res
 * @param next
 */
module.exports.getUser = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { id } = req.params;
  // Найдем пользователя по id
  findUserById(id, res, next);
};

/**
 * Получаем текущего(авторизованного) пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.getUserInfo = (req, res, next) => {
  const id = req.user._id;
  // Найдем пользователя по id
  findUserById(id, res, next);
};

/**
 * Обновляем данные пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.updateUserProfile = (req, res, next) => {
  // Деструктурируем введенные данные клиентом
  const { name, about } = req.body;
  const id = req.user._id;
  // обновим имя найденного по id пользователя
  User.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      // Если пользователь не найден
      if (!user) {
        // Вернем 404 ошибку
        return next(ApiError.NotFoundError('Пользователь с указанным _id не найден.'));
      }
      // Иначе вернем обновленный объект пользователя (status 200 по умолчанию)
      return res.send({ data: user });
    })
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Переданы некорректные данные при создании пользователя.'));
      }
      // Иначе вернем 500 ошибку
      return next(err);
    });
};

/**
 * Обновляем аватар пользователя
 * @param req
 * @param res
 * @param next
 */
module.exports.updateUserAvatar = (req, res, next) => {
  // Деструктурируем введенные данные клиентом
  const { avatar } = req.body;
  // Временно присваиваем хардкорно id пользователя
  const id = req.user._id;
  // обновим имя найденного по id пользователя
  User.findByIdAndUpdate(
    id,
    {
      avatar,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      // Если пользователь не найден
      if (!user) {
        // Вернем 404 ошибку
        return next(ApiError.NotFoundError('Пользователь с указанным _id не найден.'));
      }
      // Иначе вернем обновленный объект пользователя (status 200 по умолчанию)
      return res.send({ data: user });
    })
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Переданы некорректные данные URL.'));
      }
      // Иначе вернем 500 ошибку
      return next(err);
    });
};

/**
 * Авторизуем пользователя
 * @param req
 * @param res
 * @param next
 * @returns {Promise<ResultType> | Promise<R> | Promise<any>}
 */
module.exports.login = (req, res, next) => {
  // Деструктурируем входящие от клиента данные
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Создадим токен
      const token = jwt.sign(
        { _id: user._id },
        '5439a800e974a13f893bfbac5d9d9e5a81b8de4968ce72fe52b0737123281f0e',
        { expiresIn: '7d' },
      );

      // Отправим токен клиенту и браузер сохранит его в куках
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        })
        .send({ token });
    })
    .catch(() => next(ApiError.Unauthorized('Неверный логин или пароль')));
};

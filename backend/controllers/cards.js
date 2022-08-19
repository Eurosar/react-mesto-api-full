const Card = require('../models/card');
const ApiError = require('../errors/ApiError');

/**
 * Создаем карточку
 * @param req
 * @param res
 * @param next
 */
module.exports.createCard = (req, res, next) => {
  // Деструктурируем отправленные значения пользователем
  const { name, link } = req.body;
  // Временно присваиваем хардкорно id пользователя
  const owner = req.user._id;
  // Создаем карточку с именем, ссылкой и id пользователя
  Card.create({ name, link, owner })
    // Если ошибок нет, то возвращаем полученную карточку со статусом 201
    .then((card) => res.status(201).send({ data: card }))
    // Иначе показываем ошибки
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // то возвращаем ошибку 400
        return next(ApiError.BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      // Иначе возвращаем ошибку 500
      return next(err);
    });
};

/**
 * Получаем все карточки из БД
 * @param req
 * @param res
 * @param next
 */
module.exports.getCards = (req, res, next) => {
  // Находим все карточки в БД
  Card.find({})
    // Если ошибок нет, то возвращаем массив карточек со статусом 200
    .then((cards) => res.send())
    // Иначе возвращаем ошибку 500
    .catch(next);
};

/**
 * Удаляем карточку
 * @param req
 * @param res
 * @param next
 */
module.exports.deleteCard = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { id } = req.params;
  // Найдем и удалим нужную карточку по id findByIdAndRemove
  Card.findById(id)
    .then((card) => {
      // Если карточка не найдена, то возвращаем ошибку 404
      if (!card) {
        return next(ApiError.NotFoundError('Карточка с указанным _id не найдена.'));
      }
      // Если id пользователя не совпадает с id создателя карточки
      if (card.owner.toString() !== req.user._id.toString()) {
        // Вернем ошибку
        return next(ApiError.Forbidden('Недостаточно прав'));
      }
      // Если все в порядке, то удалим карточку
      return Card.findByIdAndRemove(id)
        .then((data) => res.send({ data }))
        .catch(next);
    })
    .catch((err) => {
      // Если ошибка относится к CastError
      if (err.name === 'CastError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Некорректный id пользователя'));
      }
      // Иначе возвращаем ошибку 500
      return next(err);
    });
};

/**
 * Ставим like карточке
 * @param req
 * @param res
 * @param next
 */
module.exports.likeCard = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { id } = req.params;
  // Найдем и обновим нужную карточку по id
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      // Если карточка не найдена
      if (!card) {
        // вернем ошибку 404
        return next(ApiError.NotFoundError('Передан несуществующий _id карточки.'));
      }
      // Иначе вернем обновленную карточку с присвоенным like (status 200 по умолчанию)
      return res.send({ data: card });
    })
    // Иначе вернем ошибки
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // то возвращаем ошибку 400
        return next(ApiError.BadRequestError('Переданы некорректные данные для постановки лайка.'));
      }
      // Если ошибка относится к CastError
      if (err.name === 'CastError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Некорректный id пользователя'));
      }
      // Иначе возвращаем ошибку 500
      return next(err);
    });
};

/**
 * Убираем like у карточки
 * @param req
 * @param res
 * @param next
 */
module.exports.dislikeCard = (req, res, next) => {
  // Деструктурируем введенные параметры в командную строку
  const { id } = req.params;
  // Найдем и обновим нужную карточку по id
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      // Если карточка не найдена
      if (!card) {
        // вернем ошибку 404
        return next(ApiError.NotFoundError('Передан несуществующий _id карточки.'));
      }
      // Иначе вернем обновленную карточку с удаленным like (status 200 по умолчанию)
      return res.send({ data: card });
    })
    .catch((err) => {
      // Если ошибка относится к ValidationError
      if (err.name === 'ValidationError') {
        // то возвращаем ошибку 400
        return next(ApiError.BadRequestError('Переданы некорректные данные для снятия лайка.'));
      }
      // Если ошибка относится к CastError
      if (err.name === 'CastError') {
        // Вернем 400 ошибку
        return next(ApiError.BadRequestError('Некорректный id пользователя'));
      }
      // Иначе возвращаем ошибку 500
      return next(err);
    });
};

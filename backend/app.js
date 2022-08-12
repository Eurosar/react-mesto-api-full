const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const errorHandler = require('./middlewares/ErrorHandlingMiddleware');
const { createUserValidator, loginValidator } = require('./validators/celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

// Соединяемся с БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Запускаем приложение в express
const app = express();

// Запускаем парсер
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Логер запросов подключаем до всех роутов
app.use(requestLogger);

// Выводим роуты
app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);
app.use('/', auth, router);

// Логер ошибок подключается после роутов и до ошибок
app.use(errorLogger);

// Обработка ошибок
// Обработка ошибок от валидатора входящих данных celebrate
app.use(errors());
// Централизованный обработчик, должен быть последним Middleware
app.use(errorHandler);

// Запускаем слушатель порта
app.listen(PORT, () => {
  console.log(`app connected server with PORT:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/ErrorHandlingMiddleware');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// Слушаем 3000 порт
const { PORT = process.env.development ? 3001 : 3000 } = process.env;

// Соединяемся с БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Запускаем приложение в express
const app = express();

// Запускаем проверку CORS
app.use(cors({
  origin: [
    'https://eurosar.mesto.nomoredomains.sbs',
    'http://eurosar.mesto.nomoredomains.sbs',
    'http://localhost:3000',
  ],
  credentials: true,
}));

// Запускаем парсер
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Логер запросов подключаем до всех роутов
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Выводим роуты
app.use(routes);

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

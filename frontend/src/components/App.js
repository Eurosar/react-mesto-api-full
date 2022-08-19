import React, {useState, useEffect} from 'react';
import {Link, Route, Switch, useHistory} from 'react-router-dom';
import {api} from '../utils/api';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import PopupWithForm from './PopupWithForm';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/authApi';

function App() {

  /**
   * Блок переменных состояний
   */

    // Создаем переменную состояния пользователя, чтобы понимать какой пользователь зашел
  const [currentUser, setCurrentUser] = useState({});

  // Создаем переменную состояния данных авторизованного пользователя
  const [userData, setUserData] = useState({});

  // Переменная состояния открытия формы редактирования профиля
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);

  // Переменная состояния открытия формы добавления новых карточек
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);

  // Переменная состояния открытия формы редактирования автара
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);

  // Переменная состояния открытия модального окна успеха/неуспеха регистрации
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

  // Переменная состояния выбранной карточки
  const [selectedCard, setSelectedCard] = useState({name: '', link: ''});

  // Переменная состояния массива карточек
  const [cards, setCards] = useState([]);

  // Переменная состояния загрузки контента
  const [isLoading, setIsLoading] = useState(false);

  //Переменная состояния авторизованного пользователя
  const [loggedIn, setLoggedIn] = useState(false);

  // Переменная состояния успеха/неуспеха регистрации
  const [isSuccess, setIsSuccess] = useState(true);

  /**
   * Блок побочных эффектов
   */

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getProfileInfo(), api.getInitialCards()])
        // Деструктурируем ответ от сервера, чтобы было понятнее, что пришло
        .then(([userData, cards]) => {
          console.log(cards);
          // Установим данные пользователя
          setCurrentUser(userData);

          // Отрисуем карточки
          setCards([...cards]);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  /**
   * Блок слушателей
   */

  // Создаем слушателя на кнопку открытия модального окна смены аватара
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  // Создаем слушателя на кнопку открытия модального окна редактирования профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  // Создаем слушателя на кнопку открытия модального окна добавления мест
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // Создаем слушателя на клик по карточке открытия модального окна с карточкой
  function handleCardClick(card) {
    setSelectedCard(card);
  }

  // Создаем слушателя загрузки данных
  function renderLoading(value) {
    setIsLoading(value);
  }

  /**
   * Создаем слушателя на кнопку лайка
   * @param card
   */
  function handleCardLike(card) {
    // Проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    // В зависимости от того, есть ли лайк пользователя на карточке,
    // выбираем метод запроса
    api.likeCard(!isLiked ? 'PUT' : 'DELETE', card._id)
      .then((newCard) => {
        // Записываем в массив карточек данные
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(err));
  }

  /**
   * Создаем слушателя на кнопку удаления карточки
   * @param card
   */
  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch(err => console.log(err));
  }

  /**
   * Создаем слушателя на кнопку отправки данных пользователя в модальном окне на сервер
   * @param data
   */
  function handleUpdateUser(data) {
    api.changeUserInfo(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => {
        renderLoading(false);
      });
  }

  /**
   * Создаем слушателя на кнопку отправки данных новой карточки в модальном окне на сервер
   * @param newCard
   */
  function handleAddPlaceSubmit(newCard) {
    api.postNewCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => {
        renderLoading(false);
      });
  }

  /**
   * Создаем слушателя на кнопку отправки данных аватара в модальном окне на сервер
   * @param data
   */
  function handleUpdateAvatar(data) {
    api.updateAvatar(data)
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(err => console.log(err))
      .finally(() => {
        renderLoading(false);
      });
  }

  /**
   * Создаем слушателя на кнопку отправки данных авторизации пользователя на сервер
   * @param email {string}
   * @param password {string}
   */
  function handleLogin({email, password}) {
    setUserData({email, password});
    auth.authorize({email, password})
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          localStorage.setItem('jwt', data.token);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
      })
      .finally(() => {
        renderLoading(false);
      });
  }

  /**
   * Создаем слушателя на кнопку отправки данных регистрации пользователя на сервер
   * @param email {string}
   * @param password {string}
   */
  function handleRegister({email, password}) {
    auth.register({email, password})
      .then((res) => {
        if (res.statusCode === 400 || !email || !password) {
          setIsSuccess(false);
          setIsInfoTooltipOpen(true);
        } else {
          history.push('/sign-in');
          setIsSuccess(true);
          setIsInfoTooltipOpen(true);
        }
      })
      .catch((err) => {
        setIsSuccess(false);
        setIsInfoTooltipOpen(true);
        console.log(err);
      })
      .finally(() => {
        renderLoading(false);
      });
  }

  /**
   * Создаем слушателя проверки токена пользователя
   */
  function checkToken() {
    const token = localStorage.getItem('jwt');
    if (token) {
      auth.checkToken(token)
        .then((response) => {
          if (response) {
            const data = {...response.data};
            setUserData(data);
            setLoggedIn(true);
          }
        })
        .catch(err => console.log(err));
    }
  }

  /**
   * Хук
   * @type {History<LocationState>}
   */
  const history = useHistory();

  // Создаем функцию закрытия всех модальных окон
  /**
   * Функция закрытия модальных окон
   */
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipOpen(false);
    setSelectedCard({name: '', link: ''});
  }

  /**
   * Функция выхода из аккаунта
   */
  function signOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          {loggedIn &&
            <Header>
              <div className="header__auth">
                <div className="header__email">{`${userData.email}`}</div>
                <Link onClick={signOut} className="header__exit" to="/">Выйти</Link>
              </div>
            </Header>}
          <Switch>
            <Route path="/sign-up">
              <Register
                onRegister={handleRegister}
                isLoading={isLoading}
                loggedIn={loggedIn}
                onRenderLoading={renderLoading}
              />
            </Route>
            <Route path="/sign-in">
              <Login
                onLogin={handleLogin}
                isLoading={isLoading}
                loggedIn={loggedIn}
                onRenderLoading={renderLoading}
              />
            </Route>
            <ProtectedRoute
              exact path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={handleEditProfileClick}
              onAddPlace={handleAddPlaceClick}
              onEditAvatar={handleEditAvatarClick}
              onCardClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}/>
          </Switch>
          {loggedIn && <Footer/>}
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            isLoading={isLoading}
            onRenderLoading={renderLoading}/>
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            isLoading={isLoading}
            onRenderLoading={renderLoading}/>
          <PopupWithForm
            name="confirmation"
            title="Вы уверены?"
            buttonText="Да"
            onClose={closeAllPopups}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onUpdateAvatar={handleUpdateAvatar}
            onClose={closeAllPopups}
            isLoading={isLoading}
            onRenderLoading={renderLoading}/>
          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            isSuccess={isSuccess}
            onClose={closeAllPopups}
            toolTipText={isSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
          />
          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}/>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

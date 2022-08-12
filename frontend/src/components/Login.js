import React, {useState} from 'react';
import Header from './Header';
import AuthForm from './AuthForm';
import {Link} from 'react-router-dom';

/**
 * Компонент с формой авторизации пользователя
 * @param onLogin
 * @param isLoading
 * @param loggedIn
 * @param onRenderLoading
 * @returns {JSX.Element}
 * @constructor
 */
function Login(
  {
    onLogin,
    isLoading,
    loggedIn,
    onRenderLoading,
  }) {

  // Переменная состояния данных пользователя
  const [userData, setUserData] = useState({email: '', password: ''});

  /**
   * Запишем данные пользователя из инпутов в стейт
   * @param e
   */
  function handleChange(e) {
    const {name, value} = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  }

  /**
   * Отправим данные пользователя на сервер
   * @param e
   */
  function handleSubmit(e) {
    // Покажем загрузку данных пользователю
    onRenderLoading(true);
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    const {email, password} = userData;
    // Выполним вход на сайт
    onLogin({email, password});
  }

  return (
    <>
      {!loggedIn &&
        <Header>
          <Link className="header__exit" to="/sign-up">Зарегистрироваться</Link>
        </Header>}
      <AuthForm
        name="login"
        title="Вход"
        email={userData.email}
        password={userData.password}
        buttonText={isLoading ? 'Войти...' : 'Войти'}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default Login;
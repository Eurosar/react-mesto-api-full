import React from 'react';

/**
 * Функция формы для авторизации/регистрации
 * @param name {string}
 * @param title {string}
 * @param email {string}
 * @param password {string}
 * @param buttonText {string}
 * @param onChange
 * @param onSubmit
 * @param children {JSX.Element}
 * @returns {JSX.Element}
 * @constructor
 */
function AuthForm(
  {
    name,
    title,
    email,
    password,
    buttonText,
    onChange,
    onSubmit,
    children
  }) {

  return (
    <div className="auth">
      <form name={name} className={`auth__form form-${name}`} onSubmit={onSubmit} noValidate>
        <h2 className="auth__title">{title}</h2>
        <div className="auth__inputs">
          <label className="auth__label">
            <input
              id="email"
              className="auth__input auth__input_email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Email"
              minLength="2"
              maxLength="40"
              required/>
            <span className="auth__input-error email-input-error"></span>
          </label>
          <label className="auth__label">
            <input
              id="password"
              className="auth__input auth__input_password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Пароль"
              minLength="2"
              maxLength="200"
              required/>
            <span className="auth__input-error password-input-error"></span>
          </label>
        </div>
        <button type="submit" className="auth__button">{buttonText}</button>
        {children}
      </form>
    </div>
  );
}

export default AuthForm;
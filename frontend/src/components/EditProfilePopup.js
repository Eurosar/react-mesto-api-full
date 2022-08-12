import React, {useContext, useEffect, useState} from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

/**
 * Модальное окно редактирования профиля
 * @param isOpen
 * @param onClose
 * @param onUpdateUser
 * @param isLoading
 * @param onRenderLoading
 * @returns {JSX.Element}
 * @constructor
 */
function EditProfilePopup(
  {
    isOpen,
    onClose,
    onUpdateUser,
    isLoading,
    onRenderLoading
  }) {

  /**
   * Блок переменных состояния
   */
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  /**
   * Подписка на контекст
   */
  const currentUser = useContext(CurrentUserContext);

  /**
   * Блок побочных эффектов
   */
  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  /**
   * Запишем имя из инпута в стейт
   * @param e
   */
  function handleNameChange(e) {
    setName(e.target.value);
  }

  /**
   * Запишем описание из инпута в стейт
   * @param e
   */
  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  /**
   * Отправим данные на сервер при нажатии кнопки в модальном окне
   * @param e
   */
  function handleSubmit(e) {
    onRenderLoading(true);
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name="profile-editor"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={onClose}>
      <h2 className="popup__title">Редактировать профиль</h2>
      <div className="popup__inputs">
        <label className="popup__label">
          <input
            id="name-input"
            className="popup__input popup__input_text_name"
            type="text"
            name="name"
            value={name || ''}
            onChange={handleNameChange}
            placeholder="Имя"
            minLength="2"
            maxLength="40"
            required/>
          <span className="popup__input-error name-input-error"></span>
        </label>
        <label className="popup__label">
          <input
            id="job-input"
            className="popup__input popup__input_text_job"
            type="text"
            name="job"
            value={description || ''}
            onChange={handleDescriptionChange}
            placeholder="Род деятельности"
            minLength="2"
            maxLength="200"
            required/>
          <span className="popup__input-error job-input-error"></span>
        </label>
        <button type="submit" className="popup__btn">{isLoading ? 'Сохранить...' : 'Сохранить'}</button>
      </div>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
import React, {useState} from 'react';
import PopupWithForm from './PopupWithForm';

/**
 * Функция открытия модального окна для добавления картинки
 * @param isOpen
 * @param onClose
 * @param onAddPlace
 * @param isLoading
 * @param onRenderLoading
 * @returns {JSX.Element}
 * @constructor
 */
function AddPlacePopup(
  {
    isOpen,
    onClose,
    onAddPlace,
    isLoading,
    onRenderLoading
  }) {

  /**
   * Блок переменных состояния
   */
  const [formValues, setFormValues] = useState({name: '', link: ''});

  /**
   * Запишем значения инпутов в стейт setFormValues
   * @param evt
   */
  const handleChange = (evt) => {
    const {name, value} = evt.target;
    setFormValues(prevState => ({...prevState, [name]: value}));
  };

  /**
   * Функция отправки данных на сервер
   * @param e {event}
   */
  function handleSubmit(e) {
    // Покажем загрузку данных пользователю
    onRenderLoading(true);
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onAddPlace(formValues);
    // Обнулим стейт
    setFormValues({});
  }

  return (
    <PopupWithForm
      name="add-places"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={onClose}
    >
      <h2 className="popup__title">Новое место</h2>
      <div className="popup__inputs">
        <label className="popup__label">
          <input
            id="name-place"
            className="popup__input popup__input_text_name-place"
            type="text"
            name="name"
            value={formValues.name || ''}
            onChange={handleChange}
            placeholder="Название"
            minLength="2"
            maxLength="200"
            required/>
          <span className="popup__input-error name-place-error"></span>
        </label>
        <label className="popup__label">
          <input
            id="image-link"
            className="popup__input popup__input_text_image-link"
            type="url"
            name="link"
            value={formValues.link || ''}
            onChange={handleChange}
            placeholder="Ссылка на картинку"
            required/>
          <span className="popup__input-error image-link-error"></span>
        </label>
        <button type="submit" className="popup__btn">{isLoading ? 'Сохранить...' : 'Сохранить'}</button>
      </div>
    </PopupWithForm>

  );
}

export default AddPlacePopup;
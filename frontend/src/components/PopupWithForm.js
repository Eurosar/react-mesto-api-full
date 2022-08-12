import React from 'react';

/**
 * Модальное окно с формой
 * На вход PopupWithForm принимает (props)
 * Сделаем деструктуризацию { name, children, ...props },
 * чтобы не нужно было прописывать по такому примеру props.name
 * @param name {string}
 * @param children
 * @param isOpen
 * @param onClose
 * @param onSubmit
 * @returns {JSX.Element}
 * @constructor
 */
function PopupWithForm(
  {
    name,
    children,
    isOpen,
    onClose,
    onSubmit
  }) {

  return (
    <div className={`popup popup-${name} ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <div className="popup__overlay"></div>
        <form name={name} className={`popup__form form-${name}`} onSubmit={onSubmit} noValidate>
          <button type="button" className="popup__close" onClick={onClose}></button>
          {children}
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
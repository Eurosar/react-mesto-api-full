import React from 'react';

/**
 * Модальное окно картинки
 * @param card
 * @param onClose
 * @returns {JSX.Element}
 * @constructor
 */
function ImagePopup({card, onClose}) {

  return (
    <div className={`popup popup__place-image ${card.link ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <div className="popup__overlay"></div>
        <div className="container-image">
          <button type="button" className="popup__close close-place-image" onClick={onClose}></button>
          <img src={card.link} alt={card.name} className="container-image__image"/>
          <h2 className="container-image__image-title">{card.name}</h2>
        </div>
      </div>
    </div>
  );
}

export default ImagePopup;
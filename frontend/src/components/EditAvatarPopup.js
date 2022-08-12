import React, {useRef} from 'react';
import PopupWithForm from './PopupWithForm';

/**
 * Модальное окно редактирования аватара
 * @param isOpen
 * @param onClose
 * @param onUpdateAvatar
 * @param isLoading
 * @param onRenderLoading
 * @returns {JSX.Element}
 * @constructor
 */
function EditAvatarPopup(
  {
    isOpen,
    onClose,
    onUpdateAvatar,
    isLoading,
    onRenderLoading
  }) {

  // Используем Реф для хранения данных
  const avatarRef = useRef();

  /**
   * Функция отправки формы
   * @param e
   */
  function handleSubmit(e) {
    onRenderLoading(true);
    e.preventDefault();
    onUpdateAvatar(
      {
        avatar: avatarRef.current.value
      });
    e.target.reset();
  }

  return (
    <PopupWithForm
      name="update-avatar"
      isOpen={isOpen}
      onSubmit={handleSubmit}
      onClose={onClose}>
      <h2 className="popup__title">Обновить аватар</h2>
      <div className="popup__inputs">
        <label className="popup__label">
          <input
            id="avatar-link"
            className="popup__input popup__input_text_avatar-link"
            type="url"
            name="avatar"
            ref={avatarRef}
            placeholder="Ссылка на аватар"
            required
          />
          <span className="popup__input-error avatar-link-error"></span>
        </label>
        <button type="submit" className="popup__btn">{isLoading ? 'Сохранить...' : 'Сохранить'}</button>
      </div>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
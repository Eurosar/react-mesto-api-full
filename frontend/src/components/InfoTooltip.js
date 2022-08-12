import PopupWithForm from './PopupWithForm';

/**
 * Модальное окно об успешности входа/регистрации
 * @param isOpen
 * @param onClose
 * @param className
 * @param toolTipText
 * @param isSuccess
 * @returns {JSX.Element}
 * @constructor
 */
function InfoTooltip(
  {
    isOpen,
    onClose,
    className,
    toolTipText,
    isSuccess
  }) {
  return (
    <PopupWithForm
      name="success"
      isOpen={isOpen}
      onClose={onClose}>
      <div className={className}></div>
      <h2 className="popup__title popup__title_center">{toolTipText}</h2>
    </PopupWithForm>
  );
}

export default InfoTooltip;
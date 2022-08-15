import PopupWithForm from './PopupWithForm';
import success from '../icons/success.svg';
import failed from '../icons/failed.svg';


/**
 * Модальное окно об успешности входа/регистрации
 * @param isOpen
 * @param onClose
 * @param toolTipText
 * @param isSuccess
 * @returns {JSX.Element}
 * @constructor
 */
function InfoTooltip(
  {
    isOpen,
    onClose,
    toolTipText,
    isSuccess
  }) {
  return (
    <PopupWithForm
      name="success"
      isOpen={isOpen}
      onClose={onClose}>
      <img
        className="popup__info-tooltip"
        src={isSuccess ? success : failed}
        alt={isSuccess ? "Success" : "Failed"}
      />
      <h2 className="popup__title popup__title_center">{toolTipText}</h2>
    </PopupWithForm>
  );
}

export default InfoTooltip;
class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  /**
   * Проверяем ответ с сервера на ошибки
   * Можно изменить код на такие:
   * //return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`); - приводит к ошибке в IDE
   * Пока не понял, почему
   * //return res.ok && res.json() || Promise.reject(`Ошибка: ${res.status}`); - работает без ошибок
   * @param res
   * @returns {Promise<never>|*}
   * @private
   */
  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);

  }

  /**
   * // Получаем данные карточек с сервера
   * @returns {Promise<Response>}
   */
  getInitialCards() {
    return fetch(`${this._baseUrl}cards`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  /**
   * // Получаем данные пользователя с сервера
   * @returns {Promise<Response>}
   */
  getProfileInfo() {
    return fetch(`${this._baseUrl}users/me`, {
      headers: this._headers
    })
      .then(this._checkResponse);
  }

  /**
   * // Меняем данные пользователя на сервере
   * @param data - массив из полей модального окна
   * @returns {Promise<Response>}
   */
  changeUserInfo(data) {
    return fetch(`${this._baseUrl}users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
      .then(this._checkResponse);
  }

  /**
   * // Отправляем новую карточку на сервер
   * @param data - массив из полей модального окна
   * @returns {Promise<Response>}
   */
  postNewCard(data) {
    return fetch(`${this._baseUrl}cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      })
    })
      .then(this._checkResponse);
  }

  /**
   * // Удаляем карточку с сервера
   * @param cardId - id карточки
   * @returns {Promise<Response>}
   */
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
    })
      .then(this._checkResponse);
  }

  /**
   * // Удаляем или ставим лайк на карточку
   * @param method {string} - DELETE or PUT
   * @param cardId - id карточки
   * @returns {Promise<Response>}
   */
  likeCard(method, cardId) {
    return fetch(`${this._baseUrl}cards/${cardId}/likes`, {
      method: method,
      headers: this._headers,
    })
      .then(this._checkResponse);
  }

  /**
   * // Обновляем картинку аватара на сервере
   * @param data - массив из полей модального окна
   * @returns {Promise<Response>}
   */
  updateAvatar(data) {
    return fetch(`${this._baseUrl}users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar
      })
    })
      .then(this._checkResponse);
  }
}

export const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-40/',
  headers: {
    authorization: 'ee4cf8c7-0556-4739-9a99-1aba3be1b2b6',
    'Content-Type': 'application/json'
  }
});
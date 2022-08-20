export const BASE_URL = 'https://api.eurosar.mesto.nomoredomains.sbs';

/**
 * Проверяем ответ с сервера на ошибки
 * @param res
 * @returns {Promise<never>|*}
 * @private
 */
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
}

/**
 * Отправляем данные регистрации пользователя
 * @param email
 * @param password
 * @returns {Promise<Response>}
 */
export const register = ({ email, password }) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
    .then(checkResponse);
}

/**
 * Отправляем данные авторизации пользователя
 * @param email
 * @param password
 * @returns {Promise<Response>}
 */
export const authorize = ({ email, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
    .then(checkResponse);
}

export const logout = () => {
  return fetch(`${BASE_URL}/signout`, {
    method: 'POST',
    credentials: 'include',
  })
    .then(checkResponse);
}

// /**
//  * Получаем jwt токен пользователя
//  * @param token
//  * @returns {Promise<Response>}
//  */
// export const checkToken = (token) => {
//   return fetch(`${BASE_URL}/users/me`, {
//     method: 'GET',
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization" : `Bearer ${token}`
//     },
//     credentials: 'include',
//   })
//     .then(checkResponse);
// }
import Cookies from "js-cookie";

const TokenKey = "token";

export function getToken() {
  return localStorage.getItem(TokenKey) || Cookies.get(TokenKey);
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token);
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  localStorage.removeItem(TokenKey);
  return Cookies.remove(TokenKey);
}

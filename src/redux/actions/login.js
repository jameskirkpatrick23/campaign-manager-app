import constants from '../constants';
export const loginUser = user => {
  return { type: constants.LOGIN_USER, user };
};
export const logoutUser = user => {
  return { type: constants.LOGOUT_USER };
};

import constants from '../constants';
const initialState = {
  user: {},
  isLoggedIn: false
};
export default function LoginReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOGIN_USER:
      return Object.assign({}, state, {
        user: action.user,
        isLoggedIn: true
      });
    case constants.LOGOUT_USER:
      return Object.assign({}, state, {
        user: {},
        isLoggedIn: false
      });
    default:
      return state;
  }
}

import * as constants from '../constants';
const initialState = {
  user: {},
  isLoggedIn: false
};
export default function LoginReducer(state = initialState, action) {
  switch (action.type) {
    case constants.Login.LOGIN_USER:
      return Object.assign({}, state, {
        user: action.user,
        isLoggedIn: true
      });
    case constants.Login.LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
}

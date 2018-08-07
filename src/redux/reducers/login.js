import constants from '../constants';
const initialState = {
  user: {}
};
export default function LoginReducer(state = initialState, action) {
  switch (action.type) {
    case constants.LOGIN_USER:
      return Object.assign({}, state, {
        user: action.user,
        loggedIn: true
      });
    case constants.LOGOUT_USER:
      return Object.assign({}, state, {
        user: {},
        loggedIn: false
      });
    default:
      return state;
  }
}

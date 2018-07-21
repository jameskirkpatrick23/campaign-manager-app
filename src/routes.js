import LoginSignup from './pages/login-signup/login-signup';
import Splash from './pages/splash/';
import Signup from './pages/login-signup/signup';

export default [
  { key: 'Splash', name: 'Splash', path: '/', exact: true, component: Splash },
  {
    key: 'Login',
    name: 'Login',
    path: '/login',
    exact: false,
    component: LoginSignup
  },
  {
    key: 'Sign Up',
    name: 'Sign Up',
    path: '/signup',
    exact: false,
    component: Signup
  }
];

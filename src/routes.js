import LoginSignup from './pages/login-signup/login-signup';
import Splash from './pages/splash/';

export default [
  { name: 'Splash', path: '/', exact: true, component: Splash },
  { name: 'Login', path: '/login', exact: false, component: LoginSignup }
];

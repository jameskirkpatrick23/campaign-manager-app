import LoginSignup from './pages/login-signup';
import Splash from './pages/splash';
import Signup from './pages/register';
import Home from './pages/home';
import CampaignPage from './pages/campaigns';
import CampaignForm from './forms/campaign-form';

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
    key: 'Register',
    name: 'Register',
    path: '/register',
    exact: false,
    component: Signup
  },
  {
    key: 'Home',
    name: 'Home',
    path: '/home',
    exact: false,
    component: Home
  },
  {
    key: 'Campaigns',
    name: 'Campaigns',
    path: '/campaigns',
    exact: false,
    component: CampaignPage
  },
  {
    key: 'Campaign Form',
    name: 'Campaign Form',
    path: '/campaign-form',
    exact: false,
    component: CampaignForm
  }
];

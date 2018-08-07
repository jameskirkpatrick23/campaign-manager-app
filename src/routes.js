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
    key: 'Campaigns',
    name: 'Campaigns',
    path: '/campaigns',
    exact: true,
    component: CampaignPage
  },
  {
    key: 'Home',
    name: 'Home',
    path: '/campaigns/:campaign_id/home',
    exact: false,
    component: Home
  },
  {
    key: 'NPCs',
    name: 'NPCs',
    path: '/campaigns/:campaign_id/npcs',
    exact: true,
    component: Home
  },
  {
    key: 'Campaign Form',
    name: 'Campaign Form',
    path: '/campaigns/:action',
    exact: true,
    component: CampaignForm
  }
];

import LoginSignup from './pages/login-signup';
import Splash from './pages/splash';
import Home from './pages/home';
import CampaignPage from './pages/campaigns';
import CampaignForm from './forms/campaign-form';
import NPCPage from './pages/npcs';
import NPCForm from './forms/npc-form';

export default {
  '/': {
    key: 'Splash',
    name: 'Splash',
    path: '/',
    exact: true,
    component: Splash
  },
  '/login': {
    key: 'Login',
    name: 'Login',
    path: '/login',
    exact: false,
    component: LoginSignup
  },
  '/campaigns': {
    key: 'Campaigns',
    name: 'Campaigns',
    path: '/campaigns',
    exact: true,
    component: CampaignPage
  },
  '/campaigns/new': {
    key: 'Campaign Form',
    name: 'Campaign Form',
    path: '/campaigns/new',
    exact: true,
    component: CampaignForm
  },
  '/campaigns/:campaign_id/home': {
    key: 'Home',
    name: 'Home',
    path: '/campaigns/:campaign_id/home',
    exact: false,
    component: Home
  },
  '/campaigns/:campaign_id/places': {
    key: 'Places',
    name: 'Places',
    path: '/campaigns/:campaign_id/places',
    exact: true,
    component: Home
  },
  '/campaigns/:campaign_id/places/new': {
    key: 'Place Form',
    name: 'Place Form',
    path: '/campaigns/:campaign_id/places/new',
    exact: true,
    component: Home
  },
  '/campaigns/:campaign_id/npcs': {
    key: 'NPCs',
    name: 'NPCs',
    path: '/campaigns/:campaign_id/npcs',
    exact: true,
    component: NPCPage
  },
  '/campaigns/:campaign_id/npcs/new': {
    key: 'NPC Form',
    name: 'NPC Form',
    path: '/campaigns/:campaign_id/npcs/new',
    exact: true,
    component: NPCForm
  }
};

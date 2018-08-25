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
    customName: 'Home',
    hasCustomName: true,
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
    name: 'New Campaign',
    path: '/campaigns/new',
    exact: true,
    component: CampaignForm
  },
  '/campaigns/:campaign_id/home': {
    key: 'Home',
    name: 'Home',
    hasCustomName: true,
    customName: { collection: 'campaigns', pathIdentifier: 'campaign_id' },
    path: '/campaigns/:campaign_id/home',
    exact: true,
    component: Home
  },
  '/campaigns/:campaign_id/home/places': {
    key: 'Places',
    name: 'Places',
    path: '/campaigns/:campaign_id/home/places',
    exact: true,
    component: Home
  },
  '/campaigns/:campaign_id/home/places/new': {
    key: 'Place Form',
    name: 'Place Form',
    path: '/campaigns/:campaign_id/home/places/new',
    exact: true,
    component: Home
  },
  '/campaigns/:campaign_id/home/npcs': {
    key: 'NPCs',
    name: 'NPCs',
    path: '/campaigns/:campaign_id/home/npcs',
    exact: true,
    component: NPCPage
  },
  '/campaigns/:campaign_id/home/npcs/new': {
    key: 'NPC Form',
    name: 'New NPC',
    path: '/campaigns/:campaign_id/home/npcs/new',
    exact: true,
    component: NPCForm
  }
};

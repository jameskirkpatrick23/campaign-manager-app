import LoginSignup from './pages/login-signup';
import Splash from './pages/splash';
import Home from './pages/home';
import CampaignPage from './pages/campaigns';
import CampaignForm from './forms/campaign-form';
import NPCPage from './pages/npcs';
import NPCForm from './forms/npc-form';

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
    key: 'Campaigns',
    name: 'Campaigns',
    path: '/campaigns',
    exact: true,
    component: CampaignPage
  },
  {
    key: 'Campaign Form',
    name: 'Campaign Form',
    path: '/campaigns/new',
    exact: true,
    component: CampaignForm
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
    component: NPCPage
  },
  {
    key: 'NPC Form',
    name: 'NPC Form',
    path: '/campaigns/:campaign_id/npcs/new',
    exact: true,
    component: NPCForm
  }
];

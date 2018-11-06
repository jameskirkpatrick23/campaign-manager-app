import LoginSignup from './pages/login-signup';
import Splash from './pages/splash';
import Home from './pages/home';
import CampaignPage from './pages/campaigns';
import CampaignForm from './forms/campaign-form';
import PlacesPage from './pages/places';
import PlaceDetails from './pages/place';
import PlacesForm from './forms/places-form';
import NPCPage from './pages/npcs';
import NPCForm from './forms/npc-form';
import NPCDetails from './pages/npc';

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
    component: PlacesPage
  },
  '/campaigns/:campaign_id/home/places/new': {
    key: 'Place Form',
    name: 'New Place',
    path: '/campaigns/:campaign_id/home/places/new',
    exact: true,
    component: PlacesForm
  },
  '/campaigns/:campaign_id/home/places/:place_id': {
    key: 'Place Show',
    name: 'Place Show',
    hasCustomName: true,
    customName: { collection: 'places', pathIdentifier: 'place_id' },
    path: '/campaigns/:campaign_id/home/places/:place_id',
    exact: true,
    component: PlaceDetails
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
  },
  '/campaigns/:campaign_id/home/npcs/:npc_id': {
    key: 'NPC Show',
    name: 'NPC Show',
    hasCustomName: true,
    customName: { collection: 'npcs', pathIdentifier: 'npc_id' },
    path: '/campaigns/:campaign_id/home/npcs/:npc_id',
    exact: true,
    component: NPCDetails
  }
};

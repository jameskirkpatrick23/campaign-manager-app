import LoginSignup from './pages/login-signup';
import Splash from './pages/splash';
import About from './pages/about';
import Contact from './pages/contact';
import Home from './pages/home';
import CampaignPage from './pages/campaigns';
import CampaignForm from './forms/campaign-form';
import PlacesPage from './pages/places';
import PlaceDetails from './pages/place';
import PlacesForm from './forms/places-form';
import NPCsPage from './pages/npcs';
import NPCForm from './forms/npc-form';
import NPCDetails from './pages/npc';
import QuestsPage from './pages/quests';
import QuestForm from './forms/quest-form';
import QuestDetails from './pages/quest';

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
  '/about': {
    key: 'About',
    name: 'About',
    path: '/about',
    exact: true,
    component: About
  },
  '/contact': {
    key: 'Contact',
    name: 'Contact',
    path: '/contact',
    exact: true,
    component: Contact
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
    component: NPCsPage
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
  },
  '/campaigns/:campaign_id/home/quests': {
    key: 'Quests',
    name: 'Quests',
    path: '/campaigns/:campaign_id/home/quests',
    exact: true,
    component: QuestsPage
  },
  '/campaigns/:campaign_id/home/quests/new': {
    key: 'Quest Form',
    name: 'New Quest',
    path: '/campaigns/:campaign_id/home/quests/new',
    exact: true,
    component: QuestForm
  },
  '/campaigns/:campaign_id/home/quests/:quest_id': {
    key: 'Quest Show',
    name: 'Quest Show',
    hasCustomName: true,
    customName: { collection: 'quests', pathIdentifier: 'quest_id' },
    path: '/campaigns/:campaign_id/home/quests/:quest_id',
    exact: true,
    component: QuestDetails
  }
};

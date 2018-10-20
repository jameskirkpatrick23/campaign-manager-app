import { combineReducers } from 'redux';
import LoginReducer from './login';
import CampaignReducer from './campaigns';
import QuestReducer from './quests';
import NPCReducer from './npcs';
import PlaceReducer from './places';
import TagReducer from './tag';
import EventReducer from './events';
import FloorReducer from './floors';
import NoteReducer from './notes';
import TileReducer from './tiles';

export default combineReducers({
  login: LoginReducer,
  campaigns: CampaignReducer,
  quests: QuestReducer,
  npcs: NPCReducer,
  places: PlaceReducer,
  tags: TagReducer,
  events: EventReducer,
  floors: FloorReducer,
  notes: NoteReducer,
  tiles: TileReducer
});

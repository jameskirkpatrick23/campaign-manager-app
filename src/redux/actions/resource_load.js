import * as constants from '../constants';
import database, { app } from '../../firebaseDB';
import * as PlacesActions from './places';
import * as TagActions from './tags';
import * as NPCActions from './npcs';
import * as QuestActions from './quests';
import * as FloorActions from './floors';
import * as TileActions from './tiles';
import * as NoteActions from './notes';
import * as RaceActions from './races';
import * as OccupationActions from './occupations';
import * as ValueActions from './values';
import * as QuirkActions from './quirks';
import * as AdministrativeActions from './administrative';

const getOnce = (ref, callback) => dispatch => {
  ref.get().then(snapshot => {
    const allSnaps = {};
    snapshot.forEach(doc => {
      allSnaps[doc.id] = { ...doc.data(), id: doc.id };
    });
    dispatch(callback(allSnaps));
  });
};

const getGenericObjects = uid => dispatch => {
  const types = [
    {
      type: 'placeTypes',
      constant: constants.Place.SET_PLACE_TYPES,
      action: PlacesActions.loadAllPlaceTypes
    },
    {
      type: 'quirks',
      constant: constants.Quirk.SET_QUIRKS,
      action: QuirkActions.loadAllQuirks
    },
    {
      type: 'values',
      constant: constants.Value.SET_VALUES,
      action: ValueActions.loadAllValues
    },
    {
      type: 'races',
      constant: constants.Race.SET_RACES,
      action: RaceActions.loadAllRaces
    },
    {
      type: 'occupations',
      constant: constants.Occupation.SET_OCCUPATIONS,
      action: OccupationActions.loadAllOccupations
    }
  ];
  types.forEach(genericType => {
    const ref = database.collection(genericType.type);
    const whereDefault = ref
      .where('default', '==', true)
      .orderBy('name', 'asc');
    const whereCreator = ref
      .where('default', '==', false)
      .where('creatorId', '==', uid);
    const whereCollaborator = ref
      .where('default', '==', false)
      .where('collaboratorIds', 'array-contains', uid);
    dispatch({ type: genericType.constant });
    dispatch(getOnce(whereDefault, genericType.action));
    dispatch(getOnce(whereCreator, genericType.action));
    dispatch(getOnce(whereCollaborator, genericType.action));
  });
};

const getStaticObjects = () => dispatch => {
  const types = [
    {
      type: 'alignments',
      constant: constants.Alignment.SET_ALIGNMENTS,
      action: AdministrativeActions.setAlignmentsList
    },
    {
      type: 'genders',
      constant: constants.Gender.SET_GENDERS,
      action: AdministrativeActions.setGendersList
    }
  ];
  types.forEach(genericType => {
    const ref = database.collection(genericType.type);
    const whereDefault = ref
      .where('default', '==', true)
      .orderBy('name', 'asc');
    dispatch({ type: genericType.constant });
    dispatch(getOnce(whereDefault, genericType.action));
  });
};

export const getAppData = userUid => dispatch => {
  const options = [
    {
      constant: constants.Npc.SET_NPCS,
      name: 'npcs',
      action: NPCActions.loadAllNPCs
    },
    {
      constant: constants.Place.SET_PLACES,
      name: 'places',
      action: PlacesActions.loadAllPlaces
    },
    {
      constant: constants.Tag.SET_TAGS,
      name: 'tags',
      action: TagActions.loadAllTags
    },
    {
      constant: constants.Floor.SET_FLOORS,
      name: 'floors',
      action: FloorActions.loadAllFloors
    },
    {
      constant: constants.Quest.SET_QUESTS,
      name: 'quests',
      action: QuestActions.loadAllQuests
    },
    {
      constant: constants.Note.SET_NOTES,
      name: 'notes',
      action: NoteActions.loadAllNotes
    },
    {
      constant: constants.Tile.SET_TILES,
      name: 'tiles',
      action: TileActions.loadAllTiles
    }
  ];

  options.forEach(option => {
    const usedRef = database
      .collection(option.name)
      .where('creatorId', '==', userUid);
    dispatch({ type: option.constant });
    dispatch(getOnce(usedRef, option.action));
  });

  dispatch(getGenericObjects(userUid));
  dispatch(getStaticObjects(userUid));
};

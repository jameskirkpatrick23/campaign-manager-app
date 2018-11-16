import { Race } from '../constants';
import { createAncillaryObject } from './reusable';

export const updateRacesList = race => (dispatch, getState) => {
  const updatedState = { ...getState().races.all };
  updatedState[race.id] = race;
  dispatch({ type: Race.UPDATE_RACE_LIST, races: updatedState });
};

export const createRace = raceName => dispatch => {
  dispatch(createAncillaryObject(raceName, 'race'));
};

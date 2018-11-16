import { Quirk } from '../constants';
import { createAncillaryObject } from './reusable';

export const updateQuirksList = quirk => (dispatch, getState) => {
  const updatedState = { ...getState().quirks.all };
  updatedState[quirk.id] = quirk;
  dispatch({ type: Quirk.UPDATE_QUIRK_LIST, quirks: updatedState });
};

export const createQuirk = quirkName => dispatch => {
  dispatch(createAncillaryObject(quirkName, 'quirk'));
};

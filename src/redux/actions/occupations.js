import { Occupation } from '../constants';
import { createAncillaryObject } from './reusable';

export const updateOccupationsList = occupation => (dispatch, getState) => {
  const updatedState = { ...getState().occupations.all };
  updatedState[occupation.id] = occupation;
  dispatch({
    type: Occupation.UPDATE_OCCUPATION_LIST,
    occupations: updatedState
  });
};

export const createOccupation = occupationName => dispatch => {
  dispatch(createAncillaryObject(occupationName, 'occupation'));
};

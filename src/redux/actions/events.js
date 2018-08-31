import * as constants from '../constants';

export const updateEventsList = event => (dispatch, getState) => {
  const updatedState = { ...getState().events.all };
  updatedState[event.id] = event;
  dispatch({ type: constants.Event.UPDATE_EVENT_LIST, events: updatedState });
};

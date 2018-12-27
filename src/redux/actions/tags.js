import * as constants from '../constants';
import { createAncillaryObject } from './reusable';

//<editor-fold Tags>

export const loadAllTags = tags => (dispatch, getState) => {
  const updatedState = { ...getState().tags.all };
  Object.keys(tags).forEach(tagKey => {
    updatedState[tagKey] = tags[tagKey];
  });
  dispatch({ type: constants.Tag.UPDATE_TAG_LIST, tags: updatedState });
};

export const updateTagList = tag => (dispatch, getState) => {
  const updatedState = { ...getState().tags.all };
  updatedState[tag.id] = tag;
  dispatch({ type: constants.Tag.UPDATE_TAG_LIST, tags: updatedState });
};

export const createTag = tagName => dispatch => {
  return dispatch(createAncillaryObject(tagName, 'tag', updateTagList));
};

//</editor-fold>

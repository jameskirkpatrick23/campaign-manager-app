import { Value } from '../constants';
import { createAncillaryObject } from './reusable';

export const updateValuesList = value => (dispatch, getState) => {
  const updatedState = { ...getState().values.all };
  updatedState[value.id] = value;
  dispatch({ type: Value.UPDATE_VALUE_LIST, values: updatedState });
};

export const loadAllValues = values => (dispatch, getState) => {
  const updatedState = { ...getState().values.all };
  Object.keys(values).forEach(valueKey => {
    updatedState[valueKey] = values[valueKey];
  });
  dispatch({ type: Value.UPDATE_VALUE_LIST, values: updatedState });
};

export const createValue = valueName => dispatch => {
  return dispatch(createAncillaryObject(valueName, 'value', updateValuesList));
};

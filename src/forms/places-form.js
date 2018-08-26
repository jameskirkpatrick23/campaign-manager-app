import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlaceActions from '../redux/actions/places';
import { Multiselect } from 'react-widgets';

class PlacesForm extends Component {
  constructor(props) {
    super(props);
  }

  onSubmit = e => {
    e.preventDefault();
  };

  createPlaceTag = typeName => {
    this.props.createPlaceType(typeName);
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="#npc-quirks">
            Type
            <Multiselect
              data={Object.keys(this.props.placeTypes).map(
                key => this.props.placeTypes[key].name
              )}
              allowCreate={'onFilter'}
              onCreate={this.createPlaceTag}
              caseSensitive={false}
              minLength={3}
              filter="contains"
            />
          </label>
        </form>
      </div>
    );
  };
}

PlacesForm.defaultProps = {
  placeTypes: {}
};
PlacesForm.propTypes = {
  placeTypes: PropTypes.shape({})
};

const mapStateToProps = state => ({
  placeTypes: state.places.types
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createPlaceType: PlaceActions.createPlaceType
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacesForm);

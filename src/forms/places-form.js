import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlaceActions from '../redux/actions/places';

class PlacesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.placeTypes = [];
  }

  componentDidMount() {
    this.placeTypes = [...this.props.placeTypes];
  }

  onSubmit(e) {
    e.preventDefault();
  }

  createPlaceTag(typeName) {
    this.placeTypes.push(typeName);
    this.props.createPlaceType(typeName);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="#npc-quirks">
            Type
            <Multiselect
              data={this.placeTypes}
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
  }
}

PlacesForm.defaultProps = {
  placeTypes: []
};
PlacesForm.propTypes = {
  placeTypes: PropTypes.arrayOf(PropTypes.string)
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

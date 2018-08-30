import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as PlaceActions from '../redux/actions/places';
import * as TagActions from '../redux/actions/tags';
import { Multiselect } from 'react-widgets';

class PlacesForm extends Component {
  constructor(props) {
    super(props);
    this.createPlaceType = this.createPlaceType.bind(this);
    this.createTag = this.createTag.bind(this);
  }

  state = {};

  onSubmit = e => {
    e.preventDefault();
  };

  createPlaceType = typeName => {
    this.props.createPlaceType(typeName);
  };

  createTag = tagName => {
    this.props.createTag(tagName);
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="#place-type">
            Type
            <Multiselect
              id="place-type"
              data={Object.keys(this.props.placeTypes).map(
                key => ({name: this.props.placeTypes[key].name, value: key})
              )}
              textField="name"
              valueField="value"
              allowCreate={'onFilter'}
              onCreate={this.createPlaceType}
              onChange={(dataItems) => this.setState({selectedTypes: dataItems})}
              caseSensitive={false}
              minLength={3}
              filter="contains"
            />
          </label>
          <label htmlFor="#tags">
            Tags
            <Multiselect
              id="tags"
              data={Object.keys(this.props.tags).map(
                key => ({name: this.props.placeTypes[key].name, value: key})
              )}
              allowCreate={'onFilter'}
              onCreate={this.createTag}
              caseSensitive={false}
              onChange={(dataItems) => this.setState({selectedTags: dataItems})}
              minLength={3}
              filter="contains"
            />
          </label>
          <label htmlFor="#place-name">
            Name
            <input
              id="place-name"
              type="text"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </label>
          <label htmlFor="#place-outside-description">
            Name
            <textarea
              id="place-outside-description"
              value={this.state.outsideDescription}
              onChange={e => this.setState({ outsideDescription: e.target.value })}
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
  placeTypes: state.places.types,
  tags: state.tags.all,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createPlaceType: PlaceActions.createPlaceType,
      createTag: TagActions.createTag,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacesForm);

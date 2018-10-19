import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Glyphicon } from 'react-bootstrap';
import * as PlaceActions from '../redux/actions/places';
import * as TagActions from '../redux/actions/tags';
import { Multiselect, DropdownList } from 'react-widgets';
import Spinner from '../components/spinner';

class PlacesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: {},
      attachedFiles: {},
      newImages: {},
      newAttachedFiles: {},
      deletenewImagesKeys: [],
      deletenewAttachedFilesKeys: [],
      deleteimagesKeys: [],
      deleteattachedFilesKeys: [],
      npcIds: [],
      placeIds: [],
      eventIds: [],
      placeId: '',
      questIds: [],
      tagIds: [],
      history: '',
      location: '',
      name: '',
      type: '',
      insideDescription: '',
      outsideDescription: '',
      isSubmitting: false
    };
    this.createPlaceType = this.createPlaceType.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handleExtraFileUpload = this.handleExtraFileUpload.bind(this);
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
    this.handleExistingDelete = this.handleExistingDelete.bind(this);
    this.generateFileList = this.generateFileList.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.createTag = this.createTag.bind(this);
  }

  componentWillMount() {
    const { place } = this.props;
    const images = {};
    const attachedFiles = {};
    if (place.images.length) {
      place.images.forEach((image, index) => {
        images[index] = image;
      });
    }
    if (place.attachedFiles.length) {
      place.attachedFiles.forEach((attachedFile, index) => {
        attachedFiles[index] = attachedFile;
      });
    }
    this.setState({
      images: images,
      placeId: place.id || '',
      attachedFiles: attachedFiles,
      npcIds: [...place.npcIds] || [],
      placeIds: [...place.placeIds] || [],
      floorIds: [...place.floorIds] || [],
      noteIds: [...place.noteIds] || [],
      eventIds: [...place.eventIds] || [],
      questIds: [...place.questIds] || [],
      tagIds: [...place.tagIds] || [],
      history: place.history || '',
      location: place.location || '',
      name: place.name || '',
      type: place.type || '',
      insideDescription: place.insideDescription || '',
      outsideDescription: place.outsideDescription || '',
      isSubmitting: place.isSubmitting || false
    });
  }

  onSubmit = e => {
    const {
      formAction,
      createPlace,
      history,
      editPlace,
      onSubmit
    } = this.props;
    e.preventDefault();
    const formattedData = { ...this.state };
    this.setState({ isSubmitting: true }, () => {
      if (formAction !== 'edit') {
        createPlace(formattedData)
          .then(res => {
            history.goBack();
          })
          .catch(err => alert(`Something went wrong: ${err}`));
      } else {
        editPlace(formattedData)
          .then(res => {
            onSubmit(res);
            this.setState({ isSubmitting: false });
          })
          .catch(err => alert(`Something went wrong: ${err}`));
      }
    });
  };

  handleCloseRequest = e => {
    const { history, onCancel, formAction } = this.props;
    e.preventDefault();
    if (formAction !== 'edit') {
      history.goBack();
    } else {
      onCancel();
    }
  };

  createPlaceType = typeName => {
    this.props.createPlaceType(typeName);
  };

  createTag = tagName => {
    this.props.createTag(tagName);
  };

  handleImageUpload = e => {
    e.preventDefault();
    this.setState({ newImages: e.target.files });
  };

  handleExtraFileUpload = e => {
    e.preventDefault();
    this.setState({ newAttachedFiles: e.target.files });
  };

  handleExistingDelete = (fileKey, type) => {
    const currentFiles = { ...this.state[type] };
    delete currentFiles[fileKey];
    const deleteKeys = [...this.state[`delete${type}Keys`]];
    deleteKeys.push(fileKey);
    this.setState({ [type]: currentFiles, [`delete${type}Keys`]: deleteKeys });
  };

  generateFileList = stateName => {
    return Object.keys(this.state[stateName]).map(key => {
      const currentFile = this.state[stateName][key];
      return (
        <div key={`place-${stateName}-${key}`}>
          <span>
            {currentFile.name || currentFile.fileName}
            <Button
              className="margin-left-1 vert-text-top"
              bsSize="small"
              bsStyle="danger"
              onClick={() => this.handleExistingDelete(key, stateName)}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </span>
        </div>
      );
    });
  };

  render = () => {
    return (
      <div>
        <Spinner show={this.state.isSubmitting} />
        <form onSubmit={this.onSubmit}>
          {/*<editor-fold Name and Types>*/}
          <div className="row large-unstack">
            <div className="columns">
              <label htmlFor="#place-name">
                Name
                <input
                  id="place-name"
                  type="text"
                  placeholder="Give the place a meaningful name"
                  value={this.state.name}
                  required
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </label>
            </div>
            <div className="columns">
              <label htmlFor="#place-type">
                Type
                <DropdownList
                  id="place-type"
                  data={Object.keys(this.props.placeTypes).map(
                    key => this.props.placeTypes[key].name
                  )}
                  value={this.state.type}
                  placeholder="Town, City, Underground Cavern, Castle Dungeon, etc."
                  allowCreate={'onFilter'}
                  onCreate={this.createPlaceType}
                  onChange={dataItem => this.setState({ type: dataItem })}
                  caseSensitive={false}
                  minLength={3}
                  filter="contains"
                />
              </label>
            </div>
          </div>
          {/*</editor-fold>*/}
          {/*<editor-fold Location, Inside, and Outside Descriptions>*/}
          <div className="row large-unstack">
            <div className="columns">
              <label htmlFor="#place-location">
                Location
                <textarea
                  id="place-location"
                  placeholder="Where is this place located?"
                  value={this.state.location}
                  onChange={e => this.setState({ location: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div className="row large-unstack">
            <div className="columns">
              <label htmlFor="#place-inside-description">
                Inside Description
                <textarea
                  id="place-inside-description"
                  placeholder="What do the characters see, hear, smell, and even taste when they look inside this place..."
                  value={this.state.insideDescription}
                  onChange={e =>
                    this.setState({ insideDescription: e.target.value })
                  }
                />
              </label>
            </div>
          </div>
          <div className="row large-unstack">
            <div className="columns">
              <label htmlFor="#place-outside-description">
                Outside Description
                <textarea
                  id="place-outside-description"
                  placeholder="What do the characters see, hear, smell, and even taste when they look at this place from the outside..."
                  value={this.state.outsideDescription}
                  onChange={e =>
                    this.setState({ outsideDescription: e.target.value })
                  }
                />
              </label>
            </div>
          </div>
          {/*</editor-fold>*/}
          {/*<editor-fold History>*/}
          <div className="row large-unstack">
            <div className="columns">
              <label htmlFor="#place-history">
                History
                <textarea
                  id="place-history"
                  placeholder="How did this place come to be, what happened here in the past"
                  value={this.state.history}
                  onChange={e => this.setState({ history: e.target.value })}
                />
              </label>
            </div>
          </div>
          {/*</editor-fold>*/}
          {/*<editor-fold People and Places>*/}
          <div className="row large-unstack padding-bottom-1">
            <div className="columns">
              <label htmlFor="#place-places">
                Places
                <Multiselect
                  id="place-places"
                  data={Object.keys(this.props.places).map(key => ({
                    name: this.props.places[key].name,
                    value: key
                  }))}
                  value={this.state.placeIds}
                  placeholder="Is this place related to others you created?"
                  textField="name"
                  valueField="value"
                  allowCreate={false}
                  onChange={dataItems => this.setState({ placeIds: dataItems })}
                  caseSensitive={false}
                  minLength={3}
                  filter="contains"
                />
              </label>
            </div>
            <div className="columns">
              <label htmlFor="#place-npcs">
                NPCs
                <Multiselect
                  id="place-npcs"
                  data={Object.keys(this.props.npcs).map(key => ({
                    name: this.props.npcs[key].name,
                    value: key
                  }))}
                  textField="name"
                  valueField="value"
                  value={this.state.npcIds}
                  allowCreate={false}
                  placeholder="Do any NPCs you created live, work, or interact here?"
                  onChange={dataItems => this.setState({ npcIds: dataItems })}
                  caseSensitive={false}
                  minLength={3}
                  filter="contains"
                />
              </label>
            </div>
          </div>
          {/*</editor-fold>*/}
          {/*<editor-fold Quests and Tags>*/}
          <div className="row large-unstack padding-bottom-1">
            <div className="columns">
              <label htmlFor="#place-quests">
                Quests
                <Multiselect
                  id="place-quests"
                  data={Object.keys(this.props.quests).map(key => ({
                    name: this.props.quests[key].name,
                    value: key
                  }))}
                  textField="name"
                  value={this.state.questIds}
                  valueField="value"
                  allowCreate={false}
                  placeholder="Are there any quests that take place here?"
                  onChange={dataItems => this.setState({ questIds: dataItems })}
                  caseSensitive={false}
                  minLength={3}
                  filter="contains"
                />
              </label>
            </div>
            <div className="columns">
              <label htmlFor="#tags">
                Tags
                <Multiselect
                  id="tags"
                  data={Object.keys(this.props.tags).map(key => ({
                    name: this.props.tags[key].name,
                    value: key
                  }))}
                  value={this.state.tagIds}
                  allowCreate={'onFilter'}
                  textField="name"
                  valueField="value"
                  onCreate={this.createTag}
                  placeholder="Add tags to help you search for related things later"
                  caseSensitive={false}
                  onChange={dataItems => this.setState({ tagIds: dataItems })}
                  minLength={3}
                  filter="contains"
                />
              </label>
            </div>
          </div>
          {/*</editor-fold>*/}
          {/*<editor-fold Events>*/}
          <div className="row large-unstack padding-bottom-1">
            <div className="columns">
              <label htmlFor="#events">
                Events
                <Multiselect
                  id="events"
                  data={Object.keys(this.props.events).map(key => ({
                    name: this.props.events[key].name,
                    value: key
                  }))}
                  value={this.state.eventIds}
                  textField="name"
                  valueField="value"
                  allowCreate={false}
                  placeholder="What historical or future events happen here?"
                  caseSensitive={false}
                  onChange={dataItems => this.setState({ eventIds: dataItems })}
                  minLength={3}
                  filter="contains"
                />
              </label>
            </div>
          </div>
          {/*</editor-fold>*/}
          {/*<editor-fold Other Files and Images>*/}
          <div className="row large-unstack">
            <div className="columns">
              <label htmlFor="#place-other-files">Other Files</label>
              <input
                id="place-other-files"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/svg, image/gif, application/xhtml+xml, application/xml, application/pdf"
                onChange={this.handleExtraFileUpload}
              />
              <div className="max-height-200 overflow-y-scroll overflow-x-hidden margin-bottom-1">
                {this.generateFileList('newAttachedFiles')}
                {this.generateFileList('attachedFiles')}
              </div>
            </div>
            <div className="columns">
              <label htmlFor="#place-images">Images</label>
              <input
                id="place-images"
                type="file"
                multiple
                accept="image/png, image/jpeg, image/svg, image/gif"
                onChange={this.handleImageUpload}
              />
              <div className="max-height-200 overflow-y-scroll overflow-x-hidden margin-bottom-1">
                {this.generateFileList('newImages')}
                {this.generateFileList('images')}
              </div>
            </div>
          </div>
          {/*</editor-fold>*/}
          {/*<editor-fold Submit>*/}
          <div className="row large-unstack padding-bottom-1">
            <div className="columns">
              <div className="row large-unstack">
                <div className="columns">
                  <button type="submit" className="button expanded">
                    Submit
                  </button>
                </div>
                <div className="columns">
                  <button
                    className="button alert expanded"
                    onClick={this.handleCloseRequest}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*</editor-fold>*/}
        </form>
      </div>
    );
  };
}

PlacesForm.defaultProps = {
  place: {
    images: [],
    attachedFiles: []
  },
  formAction: 'create',
  onSubmit: () => {},
  onCancel: () => {}
};
PlacesForm.propTypes = {
  formAction: PropTypes.string,
  place: PropTypes.shape({}),
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = state => ({
  events: state.events.all,
  quests: state.quests.all,
  npcs: state.npcs.all,
  places: state.places.all,
  placeTypes: state.places.types,
  currentCampaignId: state.campaigns.currentCampaign.id,
  tags: state.tags.all
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createPlaceType: PlaceActions.createPlaceType,
      createTag: TagActions.createTag,
      createPlace: PlaceActions.createPlace,
      editPlace: PlaceActions.editPlace
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacesForm);

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  Glyphicon,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel
} from 'react-bootstrap';
import * as PlaceActions from '../redux/actions/places';
import Fieldset from '../reusable-components/fieldset';
import * as TagActions from '../redux/actions/tags';
import { Multiselect, DropdownList } from 'react-widgets';
import Spinner from '../reusable-components/spinner';

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
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
    this.handleExistingDelete = this.handleExistingDelete.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
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
      outsideDescription: place.outsideDescription || ''
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
    ['tagIds', 'placeIds', 'npcIds', 'questIds', 'eventIds'].forEach(
      stateKey => {
        formattedData[stateKey] = formattedData[stateKey].map(
          item => item.value || item
        );
      }
    );
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

  getValidationState = formKey => {
    let length = 0;
    switch (this.state[formKey].constructor) {
      case Object:
        length = Object.keys(this.state[formKey]).length;
        break;
      case String:
      case Array:
        length = this.state[formKey].length;
        break;
      default:
        length = 0;
    }
    if (length > 0) return 'success';
    return null;
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
    const {
      isSubmitting,
      name,
      type,
      location,
      insideDescription,
      outsideDescription,
      history,
      placeIds,
      npcIds,
      questIds,
      tagIds,
      eventIds
    } = this.state;
    const { placeTypes, places, npcs, quests, tags, events } = this.props;
    return (
      <div>
        <Spinner show={isSubmitting} />
        <form onSubmit={this.onSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="General Information">
                <FormGroup validationState={this.getValidationState('name')}>
                  <ControlLabel htmlFor="#place-name">Name</ControlLabel>
                  <FormControl
                    id="place-name"
                    type="text"
                    value={name}
                    required
                    placeholder="Give this place a name"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('type')}>
                  <ControlLabel htmlFor="#place-type">Type</ControlLabel>
                  <DropdownList
                    id="place-type"
                    data={Object.keys(placeTypes).map(
                      key => placeTypes[key].name
                    )}
                    value={type}
                    containerClassName="form-control padding-left-0 font-static"
                    placeholder="Town, City, Underground Cavern, Castle Dungeon, etc."
                    allowCreate={'onFilter'}
                    onCreate={this.createPlaceType}
                    onChange={dataItem => this.setState({ type: dataItem })}
                    caseSensitive={false}
                    minLength={3}
                    filter="contains"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('location')}
                >
                  <ControlLabel htmlFor="#place-location">
                    Location
                  </ControlLabel>
                  <FormControl
                    id="place-location"
                    type="text"
                    componentClass="textarea"
                    value={location}
                    placeholder="Where is this place located?"
                    onChange={e => this.setState({ location: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Fieldset>
            </Col>
            <Col xs={12} md={6}>
              <Fieldset label="Descriptive Information">
                <FormGroup
                  validationState={this.getValidationState('insideDescription')}
                >
                  <ControlLabel htmlFor="#place-inside-description">
                    Inside Description
                  </ControlLabel>
                  <FormControl
                    id="place-inside-description"
                    type="text"
                    componentClass="textarea"
                    value={insideDescription}
                    placeholder="What do the characters see, hear, smell, and even taste when they look inside this place..."
                    onChange={e =>
                      this.setState({ insideDescription: e.target.value })
                    }
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState(
                    'outsideDescription'
                  )}
                >
                  <ControlLabel htmlFor="#place-outside-description">
                    Outside Description
                  </ControlLabel>
                  <FormControl
                    id="place-outside-description"
                    type="text"
                    componentClass="textarea"
                    value={outsideDescription}
                    placeholder="What do the characters see, hear, smell, and even taste when they look at this place from the outside..."
                    onChange={e =>
                      this.setState({ outsideDescription: e.target.value })
                    }
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('history')}>
                  <ControlLabel htmlFor="#place-history">History</ControlLabel>
                  <FormControl
                    id="place-history"
                    type="text"
                    componentClass="textarea"
                    value={history}
                    placeholder="How did this place come to be, what happened here in the past"
                    onChange={e => this.setState({ history: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Fieldset>
            </Col>
          </Row>
          <Row className="padding-bottom-1">
            <Col xs={12} md={6}>
              <Fieldset label="Related Info">
                <FormGroup>
                  <ControlLabel htmlFor="#place-tags">Tags</ControlLabel>
                  <Multiselect
                    id="place-tags"
                    data={Object.keys(tags).map(key => ({
                      name: tags[key].name,
                      value: key
                    }))}
                    value={tagIds}
                    allowCreate={'onFilter'}
                    textField="name"
                    valueField="value"
                    onCreate={this.createTag}
                    placeholder="Add tags to help you find related things later"
                    caseSensitive={false}
                    onChange={dataItems => this.setState({ tagIds: dataItems })}
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#place-places">Places</ControlLabel>
                  <Multiselect
                    id="place-places"
                    data={Object.keys(places).map(key => ({
                      name: places[key].name,
                      value: key
                    }))}
                    value={placeIds}
                    textField="name"
                    valueField="value"
                    placeholder="What places are related to this place?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ placeIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#place-npcs">NPCs</ControlLabel>
                  <Multiselect
                    id="place-npcs"
                    data={Object.keys(npcs).map(key => ({
                      name: npcs[key].name,
                      value: key
                    }))}
                    value={npcIds}
                    textField="name"
                    valueField="value"
                    placeholder="What npcs interact or live here?"
                    caseSensitive={false}
                    onChange={dataItems => this.setState({ npcIds: dataItems })}
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#place-quests">Quests</ControlLabel>
                  <Multiselect
                    id="place-quests"
                    data={Object.keys(quests).map(key => ({
                      name: quests[key].name,
                      value: key
                    }))}
                    value={questIds}
                    textField="name"
                    valueField="value"
                    placeholder="What quests does this can be completed here?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ questIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#place-events">Events</ControlLabel>
                  <Multiselect
                    id="place-events"
                    data={Object.keys(events).map(key => ({
                      name: events[key].name,
                      value: key
                    }))}
                    value={eventIds}
                    textField="name"
                    valueField="value"
                    placeholder="What events have or will happen here?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ eventIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
              </Fieldset>
            </Col>
            <Col xs={12} md={6}>
              <Fieldset label="Images and Files">
                <FormGroup>
                  <ControlLabel htmlFor="#npc-image">Image</ControlLabel>
                  <input
                    id="npc-image"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/gif"
                    onChange={e => {
                      e.preventDefault();
                      this.setState({ newImages: e.target.files });
                    }}
                  />
                  {this.generateFileList('newImages')}
                  {this.generateFileList('images')}
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#npc-attachedFiles">
                    Other Files
                  </ControlLabel>
                  <input
                    id="npc-attachedFiles"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/svg, image/gif, application/xhtml+xml, application/xml, application/pdf"
                    onChange={e => {
                      e.preventDefault();
                      this.setState({ newAttachedFiles: e.target.files });
                    }}
                  />
                  {this.generateFileList('newAttachedFiles')}
                  {this.generateFileList('attachedFiles')}
                </FormGroup>
              </Fieldset>
            </Col>
          </Row>
          <Row className="padding-bottom-1">
            <Col xsOffset={6} xs={6}>
              <Row>
                <Col xs={6}>
                  <button type="submit" className="button expanded">
                    Submit
                  </button>
                </Col>
                <Col xs={6}>
                  <button
                    className="button alert expanded"
                    onClick={this.handleCloseRequest}
                  >
                    Cancel
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </form>
      </div>
    );
  };
}

PlacesForm.defaultProps = {
  place: {
    images: [],
    npcIds: [],
    placeIds: [],
    floorIds: [],
    noteIds: [],
    eventIds: [],
    questIds: [],
    tagIds: [],
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-widgets/dist/css/react-widgets.css';
import { Multiselect, DropdownList } from 'react-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toast } from 'react-toastify';
import {
  ControlLabel,
  FormControl,
  FormGroup,
  Button,
  Row,
  Col,
  Glyphicon
} from 'react-bootstrap';
import Fieldset from '../reusable-components/fieldset';
import { createEvent, editEvent } from '../redux/actions/events';
import { createTag } from '../redux/actions/tags';
import Spinner from '../reusable-components/spinner';

class EventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      ramifications: '',
      tagIds: [],
      tags: {},
      placeIds: [],
      npcIds: [],
      questIds: [],
      eventIds: [],
      images: {},
      attachedFiles: {},
      newImages: {},
      newAttachedFiles: {},
      deletenewImagesKeys: [],
      deletenewAttachedFilesKeys: [],
      deleteimagesKeys: [],
      deleteattachedFilesKeys: [],
      isSubmitting: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.updateObjective = this.updateObjective.bind(this);
    this.addObjective = this.addObjective.bind(this);
    this.handleCloseRequest = this.handleCloseRequest.bind(this);
  }

  componentWillMount() {
    const { event, tags } = this.props;
    const images = {};
    const attachedFiles = {};
    if (event.images.length) {
      event.images.forEach((image, index) => {
        images[index] = image;
      });
    }
    if (event.attachedFiles.length) {
      event.attachedFiles.forEach((attachedFile, index) => {
        attachedFiles[index] = attachedFile;
      });
    }
    this.setState({
      images: images,
      id: event.id || '',
      attachedFiles: attachedFiles,
      objectives: event.objectives ? [...event.objectives] : [],
      npcIds: [...event.npcIds] || [],
      placeIds: [...event.placeIds] || [],
      noteIds: [...event.noteIds] || [],
      questIds: [...event.questIds] || [],
      eventIds: [...event.eventIds] || [],
      tagIds: [...event.tagIds] || [],
      name: event.name || '',
      tags,
      description: event.description || '',
      ramifications: event.ramifications || ''
    });
  }

  onSubmit = e => {
    e.preventDefault();
    const {
      createEvent,
      formAction,
      history,
      onSubmit,
      editEvent
    } = this.props;
    const formattedData = { ...this.state };
    ['tagIds', 'placeIds', 'questIds', 'npcIds', 'eventIds'].forEach(
      stateKey => {
        formattedData[stateKey] = formattedData[stateKey].map(
          item => item.value || item
        );
      }
    );
    delete formattedData.tags;
    this.setState({ isSubmitting: true }, () => {
      if (formAction !== 'edit') {
        createEvent(formattedData)
          .then(res => {
            toast.success(
              `Created the event: ${formattedData.name} successfully!`
            );
            history.goBack();
          })
          .catch(err => toast.error(`Something went wrong: ${err}`));
      } else {
        editEvent(formattedData)
          .then(res => {
            toast.success(
              `Edited the event: ${formattedData.name} successfully!`
            );
            onSubmit(res);
            this.setState({ isSubmitting: false });
          })
          .catch(err => toast.error(`Something went wrong: ${err}`));
      }
    });
  };

  handleCloseRequest = () => {
    const { formAction, history, onCancel } = this.props;
    formAction === 'create' ? history.goBack() : onCancel();
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

  createTag = tagName => {
    if (tagName.length) {
      this.props.createTag(tagName).then(res => {
        toast.success(`Created the tag: ${tagName} successfully!`);
        const currentTags = [...this.state.tagIds];
        currentTags.push({ value: res.id, name: tagName });
        this.setState({ tagIds: currentTags });
      });
    } else {
      toast.error('Your tag needs to be at least one character long');
    }
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
        <div key={`event-${stateName}-${key}`}>
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

  updateObjective = (index, state, value) => {
    let objs = [...this.state.objectives];
    objs[index][state] = value;
    this.setState({ objectives: objs });
  };

  addObjective = () => {
    let objs = [...this.state.objectives];
    objs.push({ complete: false, name: '' });
    this.setState({ objectives: objs });
  };

  render() {
    const {
      name,
      description,
      ramifications,
      tagIds,
      placeIds,
      npcIds,
      questIds,
      eventIds,
      time,
      tags,
      isSubmitting
    } = this.state;
    const { places, quests, npcs, events } = this.props;
    return (
      <div>
        <Spinner show={isSubmitting} />
        <form onSubmit={this.onSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="General Information">
                <FormGroup validationState={this.getValidationState('name')}>
                  <ControlLabel htmlFor="#event-name">Name</ControlLabel>
                  <FormControl
                    id="event-name"
                    type="text"
                    value={name}
                    required
                    placeholder="Give this Event a name"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('time')}>
                  <ControlLabel htmlFor="#event-time">Time</ControlLabel>
                  <FormControl
                    id="event-time"
                    type="text"
                    value={time}
                    required
                    placeholder="When did this event happen?"
                    onChange={e => this.setState({ time: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('description')}
                >
                  <ControlLabel htmlFor="event-description">
                    Description
                  </ControlLabel>
                  <FormControl
                    id="event-description"
                    type="text"
                    componentClass="textarea"
                    value={description}
                    placeholder="Describe the circumstances of this event"
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('ramifications')}
                >
                  <ControlLabel htmlFor="event-ramifications">
                    Ramifications
                  </ControlLabel>
                  <FormControl
                    id="event-ramifications"
                    type="text"
                    value={ramifications}
                    componentClass="textarea"
                    placeholder="What has happened because of this event?"
                    onChange={e =>
                      this.setState({ ramifications: e.target.value })
                    }
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Fieldset>
            </Col>
            <Col xs={12} md={6}>
              <Fieldset label="Related Info">
                <FormGroup>
                  <ControlLabel htmlFor="#event-tags">Tags</ControlLabel>
                  <Multiselect
                    id="event-tags"
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
                  <ControlLabel htmlFor="#event-places">Places</ControlLabel>
                  <Multiselect
                    id="event-places"
                    data={Object.keys(places).map(key => ({
                      name: places[key].name,
                      value: key
                    }))}
                    value={placeIds}
                    textField="name"
                    valueField="value"
                    placeholder="What places does this event interact in?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ placeIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#event-npcs">NPCs</ControlLabel>
                  <Multiselect
                    id="event-npcs"
                    data={Object.keys(npcs).map(key => ({
                      name: npcs[key].name,
                      value: key
                    }))}
                    value={npcIds}
                    textField="name"
                    valueField="value"
                    placeholder="Which NPCs interact with this event?"
                    caseSensitive={false}
                    onChange={dataItems => this.setState({ npcIds: dataItems })}
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#event-quests">Quests</ControlLabel>
                  <Multiselect
                    id="event-quests"
                    data={Object.keys(quests).map(key => ({
                      name: quests[key].name,
                      value: key
                    }))}
                    value={questIds}
                    textField="name"
                    valueField="value"
                    placeholder="What other quests does this event have a role in?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ questIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#event-events">Events</ControlLabel>
                  <Multiselect
                    id="event-events"
                    data={Object.keys(events).map(key => ({
                      name: events[key].name,
                      value: key
                    }))}
                    value={eventIds}
                    textField="name"
                    valueField="value"
                    placeholder="What events does this event have a role in?"
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
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="Images and Files">
                <FormGroup>
                  <ControlLabel htmlFor="#event-image">Image</ControlLabel>
                  <FormControl
                    id="event-image"
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
                  <ControlLabel htmlFor="#event-attachedFiles">
                    Other Files
                  </ControlLabel>
                  <FormControl
                    id="event-attachedFiles"
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
  }
}

EventForm.defaultProps = {
  event: {
    objectives: [],
    images: [],
    npcIds: [],
    placeIds: [],
    noteIds: [],
    questIds: [],
    eventIds: [],
    tagIds: [],
    attachedFiles: []
  },
  onCancel: () => {},
  formAction: 'create'
};
EventForm.propTypes = {
  event: PropTypes.shape({}),
  onCancel: PropTypes.func,
  createEvent: PropTypes.func.isRequired,
  formAction: PropTypes.oneOf(['edit', 'create'])
};

const mapStateToProps = state => ({
  tags: state.tags.all,
  npcs: state.npcs.all,
  places: state.places.all,
  quests: state.quests.all,
  events: state.events.all
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createEvent: createEvent,
      editEvent: editEvent,
      createTag: createTag
    },
    dispatch
  );

const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EventForm);

export default FormContainer;

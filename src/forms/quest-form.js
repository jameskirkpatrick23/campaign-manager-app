import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-widgets/dist/css/react-widgets.css';
import { Multiselect, DropdownList } from 'react-widgets';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ControlLabel,
  FormControl,
  FormGroup,
  Button,
  Row,
  Col,
  Checkbox,
  InputGroup,
  Glyphicon
} from 'react-bootstrap';
import Fieldset from '../reusable-components/fieldset';
import { createQuest, editQuest } from '../redux/actions/quests';
import { createTag } from '../redux/actions/tags';
import Spinner from '../reusable-components/spinner';

class QuestForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      rewards: '',
      status: '',
      tagIds: [],
      placeIds: [],
      npcIds: [],
      questIds: [],
      eventIds: [],
      objectives: [],
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
  }

  componentWillMount() {
    const { quest } = this.props;
    const images = {};
    const attachedFiles = {};
    if (quest.images.length) {
      quest.images.forEach((image, index) => {
        images[index] = image;
      });
    }
    if (quest.attachedFiles.length) {
      quest.attachedFiles.forEach((attachedFile, index) => {
        attachedFiles[index] = attachedFile;
      });
    }
    this.setState({
      images: images,
      questId: quest.id || '',
      attachedFiles: attachedFiles,
      objectives: quest.objectives ? [...quest.objectives] : [],
      npcIds: [...quest.npcIds] || [],
      placeIds: [...quest.placeIds] || [],
      noteIds: [...quest.noteIds] || [],
      eventIds: [...quest.eventIds] || [],
      questIds: [...quest.questIds] || [],
      tagIds: [...quest.tagIds] || [],
      name: quest.name || '',
      description: quest.description || '',
      rewards: quest.rewards || '',
      status: quest.status || ''
    });
  }

  onSubmit = e => {
    e.preventDefault();
    const {
      createQuest,
      formAction,
      history,
      onSubmit,
      editQuest
    } = this.props;
    const formattedData = { ...this.state };
    ['tagIds', 'placeIds', 'questIds', 'npcIds', 'eventIds'].forEach(
      stateKey => {
        formattedData[stateKey] = formattedData[stateKey].map(
          item => item.value || item
        );
      }
    );
    this.setState({ isSubmitting: true }, () => {
      if (formAction !== 'edit') {
        createQuest(formattedData)
          .then(res => {
            history.goBack();
          })
          .catch(err => alert(`Something went wrong: ${err}`));
      } else {
        editQuest(formattedData)
          .then(res => {
            onSubmit(res);
            this.setState({ isSubmitting: false });
          })
          .catch(err => alert(`Something went wrong: ${err}`));
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
    this.props.createTag(tagName);
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
        <div key={`quest-${stateName}-${key}`}>
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
      rewards,
      status,
      tagIds,
      placeIds,
      npcIds,
      eventIds,
      questIds,
      objectives,
      isSubmitting
    } = this.state;
    const { tags, places, quests, npcs, events } = this.props;
    return (
      <div>
        <Spinner show={isSubmitting} />
        <form onSubmit={this.onSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="General Information">
                <FormGroup validationState={this.getValidationState('name')}>
                  <ControlLabel htmlFor="#quest-name">Name</ControlLabel>
                  <FormControl
                    id="quest-name"
                    type="text"
                    value={name}
                    required
                    placeholder="Give this Quest a name"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('description')}
                >
                  <ControlLabel htmlFor="quest-description">
                    Description
                  </ControlLabel>
                  <FormControl
                    id="quest-description"
                    type="text"
                    componentClass="textarea"
                    value={description}
                    placeholder="Describe the circumstances of this quest"
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('rewards')}>
                  <ControlLabel htmlFor="quest-rewards">Rewards</ControlLabel>
                  <FormControl
                    id="quest-rewards"
                    type="text"
                    value={rewards}
                    componentClass="textarea"
                    placeholder="What rewards does completing this quest grant?"
                    onChange={e => this.setState({ rewards: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('status')}>
                  <ControlLabel htmlFor="npc-status">Status</ControlLabel>
                  <DropdownList
                    id="npc-status"
                    containerClassName="form-control padding-left-0 font-static"
                    data={[
                      'Completed',
                      'In Progress',
                      'Abandoned',
                      'Not Started'
                    ]}
                    value={status}
                    placeholder="Completed, In progress, Abandoned, etc."
                    onChange={dataItem => this.setState({ status: dataItem })}
                    caseSensitive={false}
                    minLength={1}
                    filter="contains"
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Fieldset>
            </Col>
            <Col xs={12} md={6}>
              <Fieldset label="Related Info">
                <FormGroup>
                  <ControlLabel htmlFor="#quest-tags">Tags</ControlLabel>
                  <Multiselect
                    id="quest-tags"
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
                  <ControlLabel htmlFor="#quest-places">Places</ControlLabel>
                  <Multiselect
                    id="quest-places"
                    data={Object.keys(places).map(key => ({
                      name: places[key].name,
                      value: key
                    }))}
                    value={placeIds}
                    textField="name"
                    valueField="value"
                    placeholder="What places does this quest interact in?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ placeIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#quest-npcs">NPCs</ControlLabel>
                  <Multiselect
                    id="quest-npcs"
                    data={Object.keys(npcs).map(key => ({
                      name: npcs[key].name,
                      value: key
                    }))}
                    value={npcIds}
                    textField="name"
                    valueField="value"
                    placeholder="Which NPCs interact with this quest?"
                    caseSensitive={false}
                    onChange={dataItems => this.setState({ npcIds: dataItems })}
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#quest-quests">Quests</ControlLabel>
                  <Multiselect
                    id="quest-quests"
                    data={Object.keys(quests).map(key => ({
                      name: quests[key].name,
                      value: key
                    }))}
                    value={questIds}
                    textField="name"
                    valueField="value"
                    placeholder="What other quests does this quest have a role in?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ questIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#quest-events">Events</ControlLabel>
                  <Multiselect
                    id="quest-events"
                    data={Object.keys(events).map(key => ({
                      name: events[key].name,
                      value: key
                    }))}
                    value={eventIds}
                    textField="name"
                    valueField="value"
                    placeholder="What events does this quest have a role in?"
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
              <Fieldset label="Objectives">
                <Button bsStyle="info" onClick={this.addObjective}>
                  Add Objective
                </Button>
                <FormGroup>
                  <ControlLabel htmlFor="#quest-objectives">
                    Objectives
                  </ControlLabel>
                  {objectives.map((obj, idx) => {
                    return (
                      <InputGroup key={`quest-objective-${idx}`}>
                        <Checkbox
                          checked={obj.complete}
                          onChange={e =>
                            this.updateObjective(
                              idx,
                              'complete',
                              e.target.checked
                            )
                          }
                        />
                        <FormControl
                          type="text"
                          value={obj.name}
                          onChange={e =>
                            this.updateObjective(idx, 'name', e.target.value)
                          }
                          placeholder="Add an objective for the players to complete"
                        />
                      </InputGroup>
                    );
                  })}
                </FormGroup>
              </Fieldset>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="Images and Files">
                <FormGroup>
                  <ControlLabel htmlFor="#quest-image">Image</ControlLabel>
                  <FormControl
                    id="quest-image"
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
                  <ControlLabel htmlFor="#quest-attachedFiles">
                    Other Files
                  </ControlLabel>
                  <FormControl
                    id="quest-attachedFiles"
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

QuestForm.defaultProps = {
  quest: {
    objectives: [],
    images: [],
    npcIds: [],
    placeIds: [],
    noteIds: [],
    eventIds: [],
    questIds: [],
    tagIds: [],
    attachedFiles: []
  },
  onCancel: () => {},
  formAction: 'create'
};
QuestForm.propTypes = {
  quest: PropTypes.shape({}),
  onCancel: PropTypes.func,
  createQuest: PropTypes.func.isRequired,
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
      createQuest: createQuest,
      editQuest: editQuest,
      createTag: createTag
    },
    dispatch
  );

const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestForm);

export default FormContainer;

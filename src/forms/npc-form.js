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
  Glyphicon
} from 'react-bootstrap';
import Fieldset from '../reusable-components/fieldset';
import { createNPC, editNPC } from '../redux/actions/npcs';
import { createTag } from '../redux/actions/tags';
import { createRace } from '../redux/actions/races';
import { createOccupation } from '../redux/actions/occupations';
import { createValue } from '../redux/actions/values';
import { createQuirk } from '../redux/actions/quirks';
import Spinner from '../reusable-components/spinner';

class NPCForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      physDescription: '',
      backstory: '',
      height: '',
      weight: '',
      alignment: '',
      race: '',
      gender: '',
      occupation: '',
      relationshipToGroup: '',
      quirks: [],
      values: [],
      tagIds: [],
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
  }

  componentWillMount() {
    const { npc } = this.props;
    const images = {};
    const attachedFiles = {};
    if (npc.images.length) {
      npc.images.forEach((image, index) => {
        images[index] = image;
      });
    }
    if (npc.attachedFiles.length) {
      npc.attachedFiles.forEach((attachedFile, index) => {
        attachedFiles[index] = attachedFile;
      });
    }
    this.setState({
      images: images,
      npcId: npc.id || '',
      attachedFiles: attachedFiles,
      npcIds: [...npc.npcIds] || [],
      placeIds: [...npc.placeIds] || [],
      noteIds: [...npc.noteIds] || [],
      eventIds: [...npc.eventIds] || [],
      questIds: [...npc.questIds] || [],
      tagIds: [...npc.tagIds] || [],
      name: npc.name || '',
      relationshipToGroup: npc.relationshipToGroup || '',
      physDescription: npc.physDescription || '',
      backstory: npc.backstory || '',
      height: npc.height || '',
      weight: npc.weight || '',
      quirks: [...npc.quirks] || [],
      values: [...npc.values] || [],
      alignment: npc.alignment || '',
      race: npc.race || '',
      gender: npc.gender || '',
      occupation: npc.occupation || ''
    });
  }

  onSubmit = e => {
    e.preventDefault();
    const { createNPC, formAction, history, onSubmit, editNPC } = this.props;
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
        createNPC(formattedData)
          .then(res => {
            history.goBack();
          })
          .catch(err => alert(`Something went wrong: ${err}`));
      } else {
        editNPC(formattedData)
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

  createRace = tagName => {
    this.props.createRace(tagName);
  };

  createOccupation = tagName => {
    this.props.createOccupation(tagName);
  };

  createValue = tagName => {
    this.props.createValue(tagName);
  };

  createQuirk = tagName => {
    this.props.createQuirk(tagName);
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
        <div key={`npc-${stateName}-${key}`}>
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

  render() {
    const {
      name,
      backstory,
      height,
      weight,
      gender,
      occupation,
      alignment,
      values,
      race,
      relationshipToGroup,
      quirks,
      tagIds,
      placeIds,
      questIds,
      eventIds,
      npcIds,
      physDescription,
      isSubmitting
    } = this.state;
    const {
      occupations,
      races,
      propQuirks,
      propValues,
      alignments,
      genders,
      tags,
      places,
      quests,
      npcs,
      events
    } = this.props;
    return (
      <div>
        <Spinner show={isSubmitting} />
        <form onSubmit={this.onSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="General Information">
                <FormGroup validationState={this.getValidationState('name')}>
                  <ControlLabel htmlFor="#npc-name">Name</ControlLabel>
                  <FormControl
                    id="npc-name"
                    type="text"
                    value={name}
                    required
                    placeholder="Give this NPC a name"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('occupation')}
                >
                  <ControlLabel htmlFor="npc-occupation">
                    Occupation
                  </ControlLabel>
                  <DropdownList
                    id="npc-occupation"
                    containerClassName="form-control padding-left-0 font-static"
                    data={Object.keys(occupations).map(
                      o => occupations[o].name
                    )}
                    value={occupation}
                    placeholder="Noble, Urchin, Smithy, Artisan, etc."
                    onChange={dataItem =>
                      this.setState({ occupation: dataItem })
                    }
                    allowCreate={'onFilter'}
                    onCreate={this.createOccupation}
                    caseSensitive={false}
                    minLength={1}
                    filter="contains"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('race')}>
                  <ControlLabel htmlFor="npc-race">Race</ControlLabel>
                  <DropdownList
                    id="npc-race"
                    data={Object.keys(races).map(r => races[r].name)}
                    containerClassName="form-control padding-left-0 font-static"
                    value={race}
                    minLength={1}
                    allowCreate={'onFilter'}
                    onCreate={this.createRace}
                    filter="contains"
                    placeholder="Human, Elf, Tiefling, Orc, etc."
                    caseSensitive={false}
                    onChange={dataItem => this.setState({ race: dataItem })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('gender')}>
                  <ControlLabel htmlFor="npc-gender">Gender</ControlLabel>
                  <DropdownList
                    id="npc-gender"
                    containerClassName="form-control padding-left-0 font-static"
                    data={Object.keys(genders).map(g => genders[g].name)}
                    value={gender}
                    minLength={1}
                    filter="contains"
                    placeholder="What gender is this NPC"
                    caseSensitive={false}
                    onChange={dataItem => this.setState({ gender: dataItem })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Fieldset>
            </Col>
            <Col xs={12} md={6}>
              <Fieldset label="Physical Characteristics">
                <FormGroup validationState={this.getValidationState('height')}>
                  <ControlLabel htmlFor="#npc-height">Height</ControlLabel>
                  <FormControl
                    id="npc-height"
                    type="text"
                    value={height}
                    placeholder="How tall is this NPC"
                    onChange={e => this.setState({ height: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('weight')}>
                  <ControlLabel htmlFor="#npc-weight">Weight</ControlLabel>
                  <FormControl
                    id="npc-weight"
                    type="text"
                    value={weight}
                    placeholder="How heavy is this NPC"
                    onChange={e => this.setState({ weight: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('physDescription')}
                >
                  <ControlLabel htmlFor="#npc-physDescription">
                    Physical Appearance
                  </ControlLabel>
                  <FormControl
                    id="npc-physDescription"
                    type="text"
                    componentClass="textarea"
                    value={physDescription}
                    placeholder="Describe how this NPC looks"
                    onChange={e =>
                      this.setState({ physDescription: e.target.value })
                    }
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Fieldset>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="Personality Makeup">
                <FormGroup
                  validationState={this.getValidationState('alignment')}
                >
                  <ControlLabel htmlFor="npc-alignment">Alignment</ControlLabel>
                  <DropdownList
                    id="npc-alignment"
                    data={Object.keys(alignments).map(a => alignments[a].name)}
                    value={alignment}
                    placeholder="Lawful, Chaotic, Good, Evil, Neutral"
                    onChange={dataItem =>
                      this.setState({ alignment: dataItem })
                    }
                  />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState(
                    'relationshipToGroup'
                  )}
                >
                  <ControlLabel htmlFor="npc-alignment">
                    Relationship to Group
                  </ControlLabel>
                  <DropdownList
                    id="npc-relationshipToGroup"
                    data={['Ally', 'Enemy', 'Neutral']}
                    value={relationshipToGroup}
                    placeholder="Ally, Enemy, Neutral"
                    onChange={dataItem =>
                      this.setState({ relationshipToGroup: dataItem })
                    }
                  />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('quirks')}>
                  <ControlLabel htmlFor="#npc-quirks">Quirks</ControlLabel>
                  <Multiselect
                    id="npc-quirks"
                    data={Object.keys(propQuirks).map(
                      pq => propQuirks[pq].name
                    )}
                    containerClassName="form-control padding-left-0 font-static"
                    value={quirks}
                    allowCreate={'onFilter'}
                    onCreate={this.createQuirk}
                    caseSensitive={false}
                    minLength={1}
                    filter="contains"
                    onChange={dataItems => this.setState({ quirks: dataItems })}
                    placeholder="What quirks does this NPC have?"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup validationState={this.getValidationState('values')}>
                  <ControlLabel htmlFor="npc-values">Values</ControlLabel>
                  <Multiselect
                    id="npc-values"
                    data={Object.keys(propValues).map(
                      pv => propValues[pv].name
                    )}
                    containerClassName="form-control padding-left-0 font-static"
                    value={values}
                    allowCreate={'onFilter'}
                    onCreate={this.createValue}
                    placeholder="What values does this NPC hold?"
                    onChange={dataItem => this.setState({ values: dataItem })}
                    caseSensitive={false}
                    minLength={1}
                    filter="contains"
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('backstory')}
                >
                  <ControlLabel htmlFor="#npc-backstory">
                    Backstory
                  </ControlLabel>
                  <FormControl
                    id="npc-backstory"
                    type="text"
                    componentClass="textarea"
                    value={backstory}
                    placeholder="Describe the NPC's backstory"
                    onChange={e => this.setState({ backstory: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
              </Fieldset>
            </Col>
            <Col xs={12} md={6}>
              <Fieldset label="Related Info">
                <FormGroup>
                  <ControlLabel htmlFor="#npc-tags">Tags</ControlLabel>
                  <Multiselect
                    id="npc-tags"
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
                  <ControlLabel htmlFor="#npc-places">Places</ControlLabel>
                  <Multiselect
                    id="npc-places"
                    data={Object.keys(places).map(key => ({
                      name: places[key].name,
                      value: key
                    }))}
                    value={placeIds}
                    textField="name"
                    valueField="value"
                    placeholder="What places does this NPC interact in?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ placeIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#npc-npcs">NPCs</ControlLabel>
                  <Multiselect
                    id="npc-npcs"
                    data={Object.keys(npcs).map(key => ({
                      name: npcs[key].name,
                      value: key
                    }))}
                    value={npcIds}
                    textField="name"
                    valueField="value"
                    placeholder="What npcs does this NPC interact with?"
                    caseSensitive={false}
                    onChange={dataItems => this.setState({ npcIds: dataItems })}
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#npc-quests">Quests</ControlLabel>
                  <Multiselect
                    id="npc-quests"
                    data={Object.keys(quests).map(key => ({
                      name: quests[key].name,
                      value: key
                    }))}
                    value={questIds}
                    textField="name"
                    valueField="value"
                    placeholder="What quests does this NPC have a role in?"
                    caseSensitive={false}
                    onChange={dataItems =>
                      this.setState({ questIds: dataItems })
                    }
                    minLength={1}
                    filter="contains"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#npc-events">Events</ControlLabel>
                  <Multiselect
                    id="npc-events"
                    data={Object.keys(events).map(key => ({
                      name: events[key].name,
                      value: key
                    }))}
                    value={eventIds}
                    textField="name"
                    valueField="value"
                    placeholder="What events does this NPC have a role in?"
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
  }
}

NPCForm.defaultProps = {
  npc: {
    images: [],
    npcIds: [],
    placeIds: [],
    noteIds: [],
    eventIds: [],
    questIds: [],
    tagIds: [],
    quirks: [],
    values: [],
    attachedFiles: []
  },
  onCancel: () => {},
  formAction: 'create'
};
NPCForm.propTypes = {
  npc: PropTypes.shape({}),
  onCancel: PropTypes.func,
  createNPC: PropTypes.func.isRequired,
  formAction: PropTypes.oneOf(['edit', 'create'])
};

const mapStateToProps = state => ({
  propValues: state.values.all,
  occupations: state.occupations.all,
  propQuirks: state.quirks.all,
  genders: state.genders.all,
  races: state.races.all,
  tags: state.tags.all,
  npcs: state.npcs.all,
  places: state.places.all,
  quests: state.quests.all,
  events: state.events.all,
  alignments: state.alignments.all
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createNPC: createNPC,
      editNPC: editNPC,
      createTag: createTag,
      createQuirk: createQuirk,
      createRace: createRace,
      createValue: createValue,
      createOccupation: createOccupation
    },
    dispatch
  );

const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NPCForm);

export default FormContainer;

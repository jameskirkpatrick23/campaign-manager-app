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
  Col
} from 'react-bootstrap';
import Fieldset from '../reusable-components/fieldset';
import { createNpc } from '../redux/actions/npcs';
import { createTag } from '../redux/actions/tags';

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
      quirks: [],
      values: [],
      tagIds: [],
      placeIds: [],
      npcIds: [],
      questIds: [],
      eventIds: [],
      newImages: {},
      newAttachedFiles: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit = e => {
    e.preventDefault();
    const { createNpc, formAction } = this.props;
    const formattedData = { ...this.state };
    ['tagIds', 'placeIds', 'npcIds', 'questIds', 'eventIds'].forEach(
      stateKey => {
        formattedData[stateKey] = formattedData[stateKey].map(
          item => item.value || item
        );
      }
    );

    if (formAction === 'create') {
      createNpc(formattedData);
    }
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

  render() {
    const {
      name,
      backstory,
      height,
      weight,
      newImages,
      gender,
      newAttachedFiles,
      occupation,
      alignment,
      values,
      race,
      quirks,
      tagIds,
      placeIds,
      questIds,
      eventIds,
      npcIds,
      physDescription
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
                    caseSensitive={false}
                    minLength={3}
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
                    minLength={2}
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
                    minLength={2}
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
                    required
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
                    required
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
                    required
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
                <FormGroup validationState={this.getValidationState('quirks')}>
                  <ControlLabel htmlFor="#npc-quirks">Quirks</ControlLabel>
                  <Multiselect
                    id="npc-quirks"
                    data={Object.keys(propQuirks).map(
                      pq => propQuirks[pq].name
                    )}
                    containerClassName="form-control padding-left-0 font-static"
                    value={quirks}
                    caseSensitive={false}
                    minLength={3}
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
                    placeholder="What values does this NPC hold?"
                    onChange={dataItem => this.setState({ values: dataItem })}
                    caseSensitive={false}
                    minLength={2}
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
                    required
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
                    minLength={3}
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
                    minLength={3}
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
                    minLength={3}
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
                    minLength={3}
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
                    minLength={3}
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
                      this.setState({ newImages: e.target.files[0] });
                    }}
                  />
                  {Object.keys(newImages).map(imageKey => (
                    <img
                      key={`fileKey-${imageKey}`}
                      src={newImages[imageKey]}
                      alt={newImages[imageKey].name}
                    />
                  ))}
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
                  {Object.keys(newAttachedFiles).map(fileKey => (
                    <p key={`fileKey-${fileKey}`}>
                      {newAttachedFiles[fileKey].name ||
                        newAttachedFiles[fileKey].fileName}
                    </p>
                  ))}
                </FormGroup>
              </Fieldset>
            </Col>
          </Row>
          <Row className="padding-bottom-1 float-right">
            <Col xs={12}>
              <Button
                className="margin-right-1"
                type="submit"
                bsStyle="primary"
              >
                Submit
              </Button>
              <Button bsStyle="danger" onClick={this.handleCloseRequest}>
                Cancel
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

NPCForm.defaultProps = {
  onCancel: () => {},
  formAction: 'create'
};
NPCForm.propTypes = {
  onCancel: PropTypes.func,
  createNpc: PropTypes.func.isRequired,
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
      createNpc: createNpc,
      createTag: createTag
    },
    dispatch
  );

const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NPCForm);

export default FormContainer;

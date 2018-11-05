import React, { Component } from 'react';
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
import { createCollection } from '../redux/actions/administrative';

class NPCForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      backstory: '',
      height: '',
      weight: '',
      alignment: '',
      clothing: '',
      image: '',
      race: '',
      gender: '',
      occupation: '',
      quirks: [],
      values: [],
      attachedFiles: []
    };
  }

  onSubmit() {}

  getValidationState = formKey => {
    const length = this.state[formKey] && this.state[formKey].length;
    if (length > 0) return 'success';
    return null;
  };

  render() {
    const {
      name,
      backstory,
      height,
      weight,
      image,
      gender,
      attachedFiles,
      occupation,
      alignment,
      values,
      race,
      quirks,
      physDescription
    } = this.state;
    const {
      occupations,
      races,
      propQuirks,
      propValues,
      alignments,
      genders
    } = this.props;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
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
            <FormGroup validationState={this.getValidationState('occupation')}>
              <ControlLabel htmlFor="npc-occupation">Occupation</ControlLabel>
              <DropdownList
                id="npc-occupation"
                containerClassName="form-control padding-left-0 font-static"
                data={Object.keys(occupations).map(o => occupations[o].name)}
                value={occupation}
                placeholder="Noble, Urchin, Smithy, Artisan, etc."
                onChange={dataItem => this.setState({ occupation: dataItem })}
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
          <Fieldset label="Personality Makeup">
            <FormGroup validationState={this.getValidationState('alignment')}>
              <ControlLabel htmlFor="npc-alignment">Alignment</ControlLabel>
              <DropdownList
                id="npc-alignment"
                data={Object.keys(alignments).map(a => alignments[a].name)}
                value={alignment}
                placeholder="Lawful, Chaotic, Good, Evil, Neutral"
                onChange={dataItem => this.setState({ alignment: dataItem })}
              />
            </FormGroup>
            <FormGroup validationState={this.getValidationState('quirks')}>
              <ControlLabel htmlFor="#npc-quirks">Quirks</ControlLabel>
              <Multiselect
                id="npc-quirks"
                data={Object.keys(propQuirks).map(pq => propQuirks[pq].name)}
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
                data={Object.keys(propValues).map(pv => propValues[pv].name)}
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
            <FormGroup validationState={this.getValidationState('backstory')}>
              <ControlLabel htmlFor="#npc-backstory">Backstory</ControlLabel>
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
          <Fieldset label="Images and Files">
            <FormGroup>
              <ControlLabel htmlFor="#npc-image">Image</ControlLabel>
              <input
                id="npc-image"
                type="file"
                accept="image/png, image/jpeg, image/gif"
                onChange={e => {
                  e.preventDefault();
                  this.setState({ image: e.target.files[0] });
                }}
              />
              <img src={image} alt={image.name} />
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
                  this.setState({ attachedFiles: e.target.files });
                }}
              />
              {attachedFiles.map(file => file.name).join(' ')}
            </FormGroup>
          </Fieldset>
          <Row className="padding-bottom-1 float-right">
            <Col>
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

NPCForm.defaultProps = {};
NPCForm.propTypes = {};

const mapStateToProps = state => ({
  propValues: state.values.all,
  occupations: state.occupations.all,
  propQuirks: state.quirks.all,
  genders: state.genders.all,
  races: state.races.all,
  alignments: state.alignments.all
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCollection: createCollection
    },
    dispatch
  );

const FormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NPCForm);

export default FormContainer;

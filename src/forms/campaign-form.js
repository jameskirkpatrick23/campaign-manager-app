import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
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
import Spinner from '../reusable-components/spinner';
import { createCampaign } from '../redux/actions/campaigns';

class CampaignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      image: '',
      isSubmitting: false
    };
  }

  onSubmit = e => {
    e.preventDefault();
    const { name, description, image } = this.state;
    this.setState({ isSubmitting: true }, () => {
      this.props
        .createCampaign({
          name,
          description,
          image
        })
        .then(res => {
          this.setState({ isSubmitting: false });
          this.props.history.push('/campaigns');
        })
        .catch(function(error) {
          this.setState({ isSubmitting: false });
          console.error('Error writing document: ', error);
        });
    });
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

  render() {
    const { name, description, image, isSubmitting } = this.state;
    return (
      <div>
        <Spinner show={isSubmitting} />
        <form onSubmit={this.onSubmit}>
          <Row>
            <Col xs={12} md={6}>
              <Fieldset label="General Information">
                <FormGroup validationState={this.getValidationState('name')}>
                  <ControlLabel htmlFor="#campaign-name">Name</ControlLabel>
                  <FormControl
                    id="campaign-name"
                    type="text"
                    value={name}
                    required
                    placeholder="What is the name of the campaign?"
                    onChange={e => this.setState({ name: e.target.value })}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup
                  validationState={this.getValidationState('description')}
                >
                  <ControlLabel htmlFor="#campaign-description">
                    Description
                  </ControlLabel>
                  <FormControl
                    id="campaign-description"
                    type="text"
                    componentClass="textarea"
                    value={description}
                    placeholder="Write a little bit about your campaign"
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup>
                  <ControlLabel htmlFor="#npc-image">Image</ControlLabel>
                  <input
                    id="npc-image"
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/gif"
                    onChange={e => {
                      e.preventDefault();
                      this.setState({ image: e.target.files[0] });
                    }}
                  />
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
                    onClick={e => {
                      e.preventDefault();
                      this.props.history.goBack();
                    }}
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

CampaignForm.defaultProps = {};
CampaignForm.propTypes = {};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCampaign
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(CampaignForm);

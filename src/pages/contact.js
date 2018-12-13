import React from 'react';
import {
  Grid,
  Row,
  Col,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap';
import Fieldset from '../reusable-components/fieldset';

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      subject: '',
      message: ''
    };
  }

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

  sendEmail = e => {
    const { email, subject, message } = this.state;
    e.preventDefault();
    let newMessage = 'From: ' + email + '\r\n' + 'Message: ' + message;
    newMessage = encodeURIComponent(newMessage);
    window.open(
      `mailto:thetabletopchronicler@gmail.com?subject=${subject}&body=${newMessage}`
    );
  };

  render() {
    const { email, subject, message } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={12} className="margin-bottom-1">
            <h3>Contact Us</h3>
          </Col>
          <Col xs={12}>
            <Row>
              <p>
                Do you have some feedback? Need to report a bug? Just generally
                love the site and want to see some new features implemented?
              </p>
              <p>
                Fill in the form below to send a message to us! We try to get
                back to everyone as soon as we can!
              </p>
            </Row>
          </Col>
          <Col xs={12}>
            <Fieldset label="Send us your thoughts">
              <FormGroup validationState={this.getValidationState('email')}>
                <ControlLabel htmlFor="#email">Email</ControlLabel>
                <FormControl
                  id="email"
                  type="email"
                  value={email}
                  placeholder="your_email_here@somewhere.com"
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup validationState={this.getValidationState('subject')}>
                <ControlLabel htmlFor="#subject">Subject</ControlLabel>
                <FormControl
                  required
                  id="subject"
                  type="subject"
                  placeholder="What is the gist of the message?"
                  value={subject}
                  onChange={e => this.setState({ subject: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup validationState={this.getValidationState('message')}>
                <ControlLabel htmlFor="#message">Message</ControlLabel>
                <FormControl
                  id="message"
                  type="text"
                  componentClass="textarea"
                  value={message}
                  placeholder="What would you like to say?"
                  onChange={e => this.setState({ message: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
              <Row className="padding-bottom-1">
                <Col xsOffset={6} xs={6}>
                  <Row>
                    <Col xs={6}>
                      <button
                        onClick={this.sendEmail}
                        className="button expanded"
                      >
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
            </Fieldset>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default Contact;

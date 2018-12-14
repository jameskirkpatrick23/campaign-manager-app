import React from 'react';
import { app } from '../firebaseDB';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LoginActions from '../redux/actions/login';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  HelpBlock
} from 'react-bootstrap';
import Fieldset from '../reusable-components/fieldset';

class Signup extends React.Component {
  state = { email: '', password: '' };

  getValidationState = formKey => {
    const emailRegex = new RegExp(
      '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );
    const pwRegex = new RegExp('^(?=[^\\d_].*?\\d)\\w(\\w|[!@#$%]){7,20}');
    const length = this.state[formKey].length;
    const regex = formKey === 'email' ? emailRegex : pwRegex;
    if (length > 0 && regex.test(this.state[formKey].toLowerCase()))
      return 'success';
    return null;
  };

  submitForm = e => {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      app
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          let user = res.user;
          this.props.loginUser({ ...user, signinType: 'EmailPassword' });
          this.props.history.push('/home');
        })
        .catch(err => {
          alert(err);
        });
    }
  };

  render() {
    const { email, password } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={12} sm={6}>
            <Fieldset label="Create an Account">
              <div>
                <h4>Join the community!</h4>
              </div>
              <FormGroup validationState={this.getValidationState('email')}>
                <ControlLabel htmlFor="#email">Email</ControlLabel>
                <FormControl
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Enter your email"
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup validationState={this.getValidationState('password')}>
                <ControlLabel htmlFor="#password">Password</ControlLabel>
                <FormControl
                  id="password"
                  type="password"
                  value={password}
                  placeholder="Enter your password"
                  onChange={e => this.setState({ password: e.target.value })}
                />
                <FormControl.Feedback />
                <HelpBlock>
                  8 to 20 alphanumeric characters and select special characters
                  (!, @, #, $, %). The password can not start with a digit,
                  underscore or special character and must contain at least one
                  digit.
                </HelpBlock>
              </FormGroup>
              <div className="margin-bottom-1 text-right">
                <Button
                  onClick={() => this.props.history.push('/login')}
                  bsStyle="danger"
                  className="margin-right-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={this.submitForm}
                  disabled={
                    !this.getValidationState('email') ||
                    !this.getValidationState('password')
                  }
                  bsStyle="primary"
                >
                  Register
                </Button>
              </div>
            </Fieldset>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loginUser: LoginActions.loginUser
    },
    dispatch
  );

export default withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Signup)
);

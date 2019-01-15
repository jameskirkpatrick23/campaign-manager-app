import React from 'react';
import firebase from 'firebase';
import { app } from '../firebaseDB';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import {
  Grid,
  Row,
  Col,
  FormGroup,
  FormControl,
  ControlLabel,
  Button
} from 'react-bootstrap';
import * as LoginActions from '../redux/actions/login';
import Fieldset from '../reusable-components/fieldset';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.loginWithEmailPw = this.loginWithEmailPw.bind(this);
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.history.push('/campaigns');
    }
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

  signInWithFacebook = () => {
    ReactGA.event({
      category: 'Login',
      action: 'Login with Facebook'
    });
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_friends');
    provider.addScope('user_photos');
    provider.addScope('user_birthday');
    provider.addScope('email');
    app
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        let user = res.user;
        this.props.loginUser({ ...user, signinType: 'Facebook' });
        this.props.history.push('/campaigns');
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The app.auth.AuthCredential type that was used.
        // var credential = error.credential;
      });
  };

  signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    ReactGA.event({
      category: 'Login',
      action: 'Login with Google'
    });
    app
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        let user = res.user;
        this.props.loginUser({ ...user, signinType: 'Google' });
        this.props.history.push('/campaigns');
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
      });
  };

  loginWithEmailPw = () => {
    const { email, password } = this.state;
    ReactGA.event({
      category: 'Login',
      action: 'Login with Email PW'
    });
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  };

  render() {
    const { email, password } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={12} sm={6}>
            <Fieldset label="Email and Password">
              <div>
                <p>Already have an account? Log in here</p>
              </div>
              <FormGroup validationState={this.getValidationState('email')}>
                <ControlLabel htmlFor="#npc-email">Email</ControlLabel>
                <FormControl
                  id="npc-email"
                  type="email"
                  value={email}
                  placeholder="email@example.com"
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup validationState={this.getValidationState('password')}>
                <ControlLabel htmlFor="#npc-password">Password</ControlLabel>
                <FormControl
                  id="npc-password"
                  type="password"
                  value={password}
                  placeholder="************"
                  onChange={e => this.setState({ password: e.target.value })}
                />
                <FormControl.Feedback />
              </FormGroup>
              <div className="margin-bottom-1 text-right">
                <Button
                  onClick={this.loginWithEmailPw}
                  disabled={!password || !email}
                  bsStyle="primary"
                >
                  Log In
                </Button>
              </div>
              <div className="text-right">
                <span>
                  Don't have an account?{' '}
                  <Link to="/register">Sign up here</Link>
                </span>
              </div>
            </Fieldset>
          </Col>
          <Col xs={12} sm={6}>
            <Fieldset label="Social Media">
              <button
                className="login-box-social-button-facebook"
                onClick={this.signInWithFacebook}
              >
                Log in with Facebook
              </button>
              <button
                className="login-box-social-button-google"
                onClick={this.signInWithGoogle}
              >
                Log in with Google
              </button>
            </Fieldset>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.login.isLoggedIn
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loginUser: LoginActions.loginUser
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Login)
);

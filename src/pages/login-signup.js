import React from 'react';
import firebase from 'firebase';
import { app } from '../firebase';
import { withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LoginActions from '../redux/actions/login';

class Login extends React.Component {
  signInWithFacebook = () => {
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
        this.props.loginUser({ ...user });
        this.props.history.push('/campaigns');
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        console.warn(error);
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
    app
      .auth()
      .signInWithPopup(provider)
      .then(res => {
        let user = res.user;
        this.props.loginUser({ ...user });
        this.props.history.push('/campaigns');
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        console.warn(error);
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // The email of the user's account used.
        // var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
      });
  };
  render() {
    return (
      <React.Fragment>
        <div className="small-12 medium-6 column small-order-3 medium-order-3 login-box-social-section callout">
          <div className="login-box-social-section-inner">
            <span className="login-box-social-headline">
              Sign in with your social network
            </span>
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
          </div>
        </div>
      </React.Fragment>
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
  )(Login)
);

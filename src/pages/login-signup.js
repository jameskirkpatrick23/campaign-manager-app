import React from 'react';
import firebase from '../firebase';
import { withRouter, Link } from 'react-router-dom';

class Login extends React.Component {
  state = { email: '', password: '' };
  submitForm = e => {
    e.preventDefault();

    if (this.state.email && this.state.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          this.props.history.push('/main');
        })
        .catch(err => {
          alert(err);
        });
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="row collapse expanded">
          <div className="small-12 medium-6 column small-order-1 medium-order-1 callout">
            <div className="login-box-form-section">
              <h1 className="login-box-title">
                Login with your email and password
              </h1>
              <form onSubmit={this.submitForm}>
                <input
                  className="login-box-input"
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  onChange={e => this.setState({ email: e.target.value })}
                />
                <input
                  className="login-box-input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={e => this.setState({ password: e.target.value })}
                />
                <button
                  className="login-box-submit-button"
                  type="submit"
                  name="login_submit"
                >
                  Login
                </button>
              </form>
              <span>
                Don't have an account? <Link to={'/register'}>Sign Up</Link>
              </span>
            </div>
          </div>
          <div className="small-12 medium-6 column small-order-3 medium-order-3 login-box-social-section callout">
            <div className="login-box-social-section-inner">
              <span className="login-box-social-headline">
                Sign in with your social network
              </span>
              <button className="login-box-social-button-facebook">
                Log in with facebook
              </button>
              <button className="login-box-social-button-twitter">
                Log in with Twitter
              </button>
              <button className="login-box-social-button-google">
                Log in with Google+
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Login);

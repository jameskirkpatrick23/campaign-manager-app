import React from 'react';
import { app } from '../firebase';
import { withRouter } from 'react-router-dom';

class Signup extends React.Component {
  state = { email: '', password: '' };
  submitForm = e => {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      app
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          this.props.history.push('/home');
        })
        .catch(err => {
          alert(err);
        });
    }
  };

  render() {
    return (
      <div className="row collapse expanded">
        <div className="small-12 medium-6 column small-order-1 medium-order-1 callout">
          <div className="login-box-form-section">
            <h1 className="login-box-title">Create a new account</h1>
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
              <input
                className="login-box-submit-button"
                type="submit"
                name="signup_submit"
                value="Sign me up"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);

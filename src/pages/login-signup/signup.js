import React from 'react';
import firebase from '../../firebase';
import { withRouter } from 'react-router-dom';

class Signup extends React.Component {
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
      <div className="row">
        <form onSubmit={this.submitForm}>
          <label htmlFor="email">
            {' '}
            Email
            <input
              id="email"
              type="email"
              name="email"
              onChange={e => this.setState({ email: e.target.value })}
            />
          </label>
          <label htmlFor="password">
            Password
            <input
              id="password"
              type="password"
              name="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </label>
          <button type="submit" className="success button">
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default withRouter(Signup);

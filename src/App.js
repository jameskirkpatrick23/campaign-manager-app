import React, { Component } from 'react';
import './App.css';
import { Route, Link, withRouter } from 'react-router-dom';
import routes from './routes';
import firebase from './firebase';
import Logo from './assets/Logo-Inverse.svg';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true, currentUser: user });
      } else {
        this.setState({ isLoggedIn: false });
      }
    });
  }

  signOut = e => {
    firebase
      .auth()
      .signOut()
      .then(res => {
        this.props.history.push('/login');
      })
      .catch(function(error) {
        // An error happened.
        alert(error);
      });
  };
  render() {
    return (
      <div className="App">
        <div className="app-dashboard shrink-medium">
          <div className="row expanded app-dashboard-top-nav-bar">
            <div className="columns medium-2">
              <button
                data-toggle="app-dashboard-sidebar"
                className="menu-icon hide-for-medium"
              />
              <Link to={'/'} className="app-dashboard-logo">
                <img src={Logo} alt="" />
              </Link>
            </div>
            <div className="columns show-for-medium">
              <div className="app-dashboard-search-bar-container">
                <i className="app-dashboard-search-icon fa fa-search" />
                <input
                  className="app-dashboard-search"
                  type="search"
                  placeholder="Search"
                />
              </div>
            </div>
            {this.state.isLoggedIn && (
              <div className="columns shrink app-dashboard-top-bar-actions">
                <button className="button hollow" onClick={this.signOut}>
                  Logout
                </button>
                <a href="#" height="30" width="30" alt="">
                  <i className="fa fa-info-circle" />
                </a>
              </div>
            )}
          </div>

          <div className="app-dashboard-body off-canvas-wrapper">
            <div
              className="app-dashboard-body-content off-canvas-content"
              data-off-canvas-content
            >
              {routes.map(route => <Route {...route} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(App);

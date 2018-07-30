import React, { Component } from 'react';
import './App.css';
import { Route, Link, withRouter } from 'react-router-dom';
import routes from './routes';
import { app } from './firebase';
import Logo from './assets/Logo-Inverse.svg';
import $ from 'jquery';

class Sidebar extends React.Component {
  collapseSidebar = e => {
    e.preventDefault();
    $('#app-dashboard')
      .toggleClass('shrink-medium')
      .toggleClass('shrink-large');
  };

  render() {
    return (
      <div
        id="app-dashboard-sidebar"
        className="app-dashboard-sidebar position-left off-canvas off-canvas-absolute reveal-for-medium"
        data-off-canvas
      >
        <div className="app-dashboard-sidebar-title-area">
          <div className="app-dashboard-close-sidebar">
            <button
              id="close-sidebar"
              data-app-dashboard-toggle-shrink
              className="app-dashboard-sidebar-close-button show-for-medium"
              aria-label="Close menu"
              type="button"
              onClick={this.collapseSidebar}
            >
              <span aria-hidden="true">
                <i className="large fa fa-angle-double-left" />
              </span>
            </button>
          </div>
          <div className="app-dashboard-open-sidebar">
            <button
              id="open-sidebar"
              data-app-dashboard-toggle-shrink
              className="app-dashboard-open-sidebar-button show-for-medium"
              aria-label="open menu"
              type="button"
              onClick={this.collapseSidebar}
            >
              <span aria-hidden="true">
                <i className="large fa fa-angle-double-right" />
              </span>
            </button>
          </div>
        </div>
        <div className="app-dashboard-sidebar-inner">
          <ul className="menu vertical">
            <li>
              <Link to={'/home'} className="is-active">
                <i className="large fa fa-home" />
                <span className="app-dashboard-sidebar-text">Home</span>
              </Link>
            </li>
            <li>
              <Link to={'/campaigns'} className="is-active">
                <i className="large fa fa-book" />
                <span className="app-dashboard-sidebar-text">Campaigns</span>
              </Link>
            </li>
            <li>
              <Link to={'/npcs'}>
                <i className="large fa fa-user-friends" />
                <span className="app-dashboard-sidebar-text">NPC's</span>
              </Link>
            </li>
            <li>
              <Link to={'/places'}>
                <i className="large fa fa-map-marked-alt" />
                <span className="app-dashboard-sidebar-text">Places</span>
              </Link>
            </li>
            <li>
              <Link to={'/quests'} className="is-active">
                <i className="large fa fa-hands-helping" />
                <span className="app-dashboard-sidebar-text">Quests</span>
              </Link>
            </li>
            <li>
              <Link to={'/account'} className="is-active">
                <i className="large fa fa-cogs" />
                <span className="app-dashboard-sidebar-text">Account</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };
  }

  componentDidMount = () => {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ isLoggedIn: true });
      } else {
        this.setState({ isLoggedIn: false });
      }
    });
  };

  signOut = e => {
    app
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
        <div id="app-dashboard" className="app-dashboard shrink-medium">
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
              </div>
            )}
          </div>

          <div className="app-dashboard-body off-canvas-wrapper">
            {this.state.isLoggedIn && <Sidebar />}
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

import React, { Component } from 'react';
import './App.css';
import { Route, Link, withRouter } from 'react-router-dom';
import routes from './routes';
import { app } from './firebase';
import Logo from './assets/Logo-Inverse.svg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LoginActions from './redux/actions/login';

class App extends Component {
  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoggedIn && this.props.isLoggedIn) {
      this.signOut();
    }
  }

  signOut = e => {
    if (e) e.preventDefault();
    app
      .auth()
      .signOut()
      .then(res => {
        this.props.logOut();
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
            {this.props.isLoggedIn &&
              !this.props.location.pathname.match('/login') && (
                <div className="columns shrink app-dashboard-top-bar-actions">
                  <button className="button hollow" onClick={this.signOut}>
                    Logout
                  </button>
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
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logOut: LoginActions.logoutUser
    },
    dispatch
  );

const mapStateToProps = state => ({
  isLoggedIn: state.login.isLoggedIn
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

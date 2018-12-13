import React, { Component } from 'react';
import './App.css';
import { Route, Link, withRouter } from 'react-router-dom';
import routes from './routes';
import { app } from './firebaseDB';
import Logo from './assets/Navbar-Logo.svg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as LoginActions from './redux/actions/login';
import * as CampaignActions from './redux/actions/campaigns';
import Breadcrumbs from './reusable-components/navigation-breadcrumbs';
import { Navbar, Nav, NavItem, Image } from 'react-bootstrap';
import ReactGA from 'react-ga';

class App extends Component {
  componentWillMount() {
    ReactGA.initialize('UA-129283951-1');
    ReactGA.pageview('/');
    this.props.history.listen(location => ReactGA.pageview(location.pathname));
    if (this.props.isLoggedIn) {
      this.props.fetchCampaigns(this.props.currentUser).then(() => {
        this.props.setCampaignListener(this.props.currentUser);
      });
    }
    if (this.props.currentCampaign && this.props.currentCampaign.id) {
      this.props.setCampaignListeners(this.props.currentCampaign.id);
    }
  }

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
        <Navbar inverse style={{ borderRadius: 0, width: '100%' }}>
          <Navbar.Header>
            <Navbar.Brand>
              <Link
                to={'/'}
                className="app-dashboard-logo"
                style={{ paddingTop: '10px' }}
              >
                <Image src={Logo} alt="" />
              </Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              {this.props.isLoggedIn &&
                !this.props.location.pathname.match('/login') && (
                  <NavItem onClick={this.signOut}>Logout</NavItem>
                )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <div className="app-container">
          <Breadcrumbs routes={routes} />
          {Object.keys(routes).map(route => (
            <Route {...routes[route]} key={route} />
          ))}
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      logOut: LoginActions.logoutUser,
      setCampaignListener: CampaignActions.setCampaignListener,
      setCampaignListeners: CampaignActions.setListeners,
      fetchCampaigns: CampaignActions.fetchCampaigns
    },
    dispatch
  );

const mapStateToProps = state => ({
  isLoggedIn: state.login.isLoggedIn,
  currentUser: state.login.user,
  currentCampaign: state.campaigns.currentCampaign
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Logo from '../assets/Logo-Inverse.svg';
import { Jumbotron, Button, Image } from 'react-bootstrap';
import Campaigns from './campaigns';

class Splash extends Component {
  render() {
    return (
      <div>
        {!this.props.isLoggedIn && (
          <Jumbotron className="padding-left-2">
            <Image responsive src={Logo} alt="Roll For Initiative Logo" />
            <p>
              Manage your campaign like you never have before. Quickly create,
              find, and modify the people, places, and objects in your world!
            </p>
            <div>
              <Button
                bsStyle="primary"
                onClick={() => this.props.history.push('/login')}
              >
                Enter
              </Button>
            </div>
          </Jumbotron>
        )}
        {this.props.isLoggedIn && <Campaigns history={this.props.history} />}
      </div>
    );
  }
}

Splash.propTypes = {
  history: PropTypes.shape({}).isRequired
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.isLoggedIn
});

const SplashContainer = connect(
  mapStateToProps,
  null
)(Splash);

export default withRouter(SplashContainer);

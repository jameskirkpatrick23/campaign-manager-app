import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Logo from '../assets/Roll4InitiativeLogo.svg';
import { Jumbotron, Button } from 'react-bootstrap';

class Splash extends Component {
  render() {
    return (
      <Jumbotron>
        <img src={Logo} alt="Roll For Initiative Logo" />
        <p>
          Manage your campaign like you never have before. Quickly create, find,
          modify, and share your creations with the community
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
    );
  }
}

Splash.propTypes = {
  history: PropTypes.shape({}).isRequired
};

export default withRouter(Splash);

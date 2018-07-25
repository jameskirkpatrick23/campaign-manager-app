import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Logo from '../assets/Logo-Inverse.svg';

class Splash extends Component {
  render() {
    return (
      <div className="promo-hero promo-hero-bg-image">
        <div className="promo-hero-content">
          <h1 className="promo-hero-title">
            <img src={Logo} alt="Roll For Initiative Logo" />
          </h1>
          <p className="promo-hero-description hide-for-small-only">
            Manage your campaign like you never have before. Quickly create,
            find, modify, and share your creations with the community
          </p>
          <div className="promo-hero-ctas">
            <button
              className="promo-section-cta button large"
              onClick={() => this.props.history.push('/login')}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Splash.propTypes = {
  history: PropTypes.shape({}).isRequired
};

export default withRouter(Splash);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HeroImage from '../components/hero-image';
import CampaignImage from '../assets/campaign-hero.jpeg';
import { Link } from 'react-router-dom';

class CampaignPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <HeroImage backgroundImage={CampaignImage} header="Campaigns">
          <h5>The place where everything happens</h5>
          <button className="button">
            <Link to={'/campaign-form'} style={{ color: '#fefefe' }}>
              Create a new campaign
            </Link>
          </button>
        </HeroImage>
      </div>
    );
  }
}

CampaignPage.defaultProps = {};
CampaignPage.propTypes = {};

export default CampaignPage;

import React, { Component } from 'react';
import HeroImage from '../components/hero-image';
import CampaignImage from '../assets/campaign-hero.jpeg';
import { Link } from 'react-router-dom';
import database, { app } from '../firebase';
import { connect } from 'react-redux';

class CampaignPage extends Component {
  constructor(props) {
    super(props);
  }

  renderCampaigns() {
    const { campaigns } = this.props;
    return Object.keys(campaigns).map((key, index) => {
      let currentCampaign = campaigns[key];
      let isOdd = index % 2 !== 0;
      if (isOdd) {
        return (
          <div key={key}>
            <div className="marketing-site-content-section-img">
              <img src={currentCampaign.imageRef} alt="" />
            </div>
            <div className="marketing-site-content-section-block">
              <h3 className="marketing-site-content-section-block-header">
                {currentCampaign.name}
              </h3>
              <p className="marketing-site-content-section-block-subheader subheader">
                {currentCampaign.description}
              </p>
              <Link
                to={`/campaigns/${key}/home`}
                className="round button small"
              >
                Manage Campaign
              </Link>
            </div>
          </div>
        );
      } else {
        return (
          <div key={key}>
            <div className="marketing-site-content-section-block small-order-2 medium-order-1">
              <h3 className="marketing-site-content-section-block-header">
                {currentCampaign.name}
              </h3>
              <p className="marketing-site-content-section-block-subheader subheader">
                {currentCampaign.description}
              </p>
              <Link
                to={`/campaigns/${key}/home`}
                className="round button small"
              >
                Manage Campaign
              </Link>
            </div>
            <div className="marketing-site-content-section-img small-order-1 medium-order-2">
              <img src={currentCampaign.imageRef} alt="" />
            </div>
          </div>
        );
      }
    });
  }

  render() {
    return (
      <div>
        <HeroImage backgroundImage={CampaignImage} header="Campaigns">
          <h5>The place where everything happens</h5>
          <button className="button">
            <Link to={'/campaigns/new'} style={{ color: '#fefefe' }}>
              Create a new campaign
            </Link>
          </button>
          <div className="marketing-site-content-section" />
        </HeroImage>
        <div className="marketing-site-content-section">
          {this.renderCampaigns()}
        </div>
      </div>
    );
  }
}

CampaignPage.defaultProps = {};
CampaignPage.propTypes = {};

const mapStateToProps = state => ({
  campaigns: state.campaigns.all
});

export default connect(
  mapStateToProps,
  null
)(CampaignPage);

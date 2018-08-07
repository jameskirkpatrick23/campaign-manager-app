import React, { Component } from 'react';
import HeroImage from '../components/hero-image';
import CampaignImage from '../assets/campaign-hero.jpeg';
import { Link } from 'react-router-dom';
import database, { app } from '../firebase';

class CampaignPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: {}
    };
  }

  componentDidMount() {
    let campaignsRef = database.collection('campaigns');
    if (app.auth().currentUser) {
      campaignsRef
        .where('creatorId', '==', app.auth().currentUser.uid)
        .onSnapshot(snapshot => {
          let updatedState = {};
          snapshot.forEach(doc => {
            updatedState[doc.id] = doc.data();
          });
          this.setState(
            { campaigns: { ...this.state.campaigns, ...updatedState } },
            () => {
              console.warn('doc', this.state.campaigns);
            }
          );
        });
    }
  }

  renderCampaigns() {
    const { campaigns } = this.state;
    return Object.keys(campaigns).map((key, index) => {
      let currentCampaign = campaigns[key];
      let isOdd = index % 2 === 1;
      if (isOdd) {
        return (
          <React.Fragment key={key}>
            <hr />
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
              <Link to={'/campaigns/1/home'} className="round button small">
                learn more
              </Link>
            </div>
            <hr />
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={key}>
            <hr />
            <div className="marketing-site-content-section-block small-order-2 medium-order-1">
              <h3 className="marketing-site-content-section-block-header">
                {currentCampaign.name}
              </h3>
              <p className="marketing-site-content-section-block-subheader subheader">
                {currentCampaign.description}
              </p>
              <Link to={'/campaigns/1/home'} className="round button small">
                learn more
              </Link>
            </div>
            <div className="marketing-site-content-section-img small-order-1 medium-order-2">
              <img src={currentCampaign.imageRef} alt="" />
            </div>
            <hr />
          </React.Fragment>
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
            <Link to={'/campaign-form'} style={{ color: '#fefefe' }}>
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

export default CampaignPage;

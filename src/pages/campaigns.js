import React, { Component } from 'react';
import HeroImage from '../components/hero-image';
import CampaignImage from '../assets/campaign-hero.jpeg';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CampaignActions from '../redux/actions/campaigns';

class CampaignPage extends Component {
  routeToCampaign(campaign, key) {
    this.props.setCurrentCampaign({ ...campaign, id: key });
    this.props.history.push(`/campaigns/${key}/home`);
  }

  renderCampaigns() {
    const { campaigns } = this.props;
    return Object.keys(campaigns).map((key, index) => {
      let currentCampaign = campaigns[key];
      let isOdd = index % 2 !== 0;
      if (isOdd) {
        return (
          <React.Fragment key={key}>
            <div className="row align-middle align-justify">
              <div className="columns small-6 padding-0">
                <img
                  src={currentCampaign.imageRef}
                  alt=""
                  style={{ width: '100%' }}
                />
              </div>
              <div className="columns small-6">
                <h3>{currentCampaign.name}</h3>
                <p>{currentCampaign.description}</p>
                <button
                  onClick={() => this.routeToCampaign(campaigns[key], key)}
                  className="round button small"
                >
                  Manage Campaign
                </button>
              </div>
            </div>
            <hr />
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={key}>
            <div className="row align-middle align-justify">
              <div className="columns small-6">
                <h3>{currentCampaign.name}</h3>
                <p>{currentCampaign.description}</p>
                <button
                  onClick={() => this.routeToCampaign(campaigns[key], key)}
                  className="round button small"
                >
                  Manage Campaign
                </button>
              </div>
              <div className="columns small-6 padding-0">
                <img src={currentCampaign.imageRef} alt="" />
              </div>
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
            <Link to={'/campaigns/new'} style={{ color: '#fefefe' }}>
              Create a new campaign
            </Link>
          </button>
          <div className="marketing-site-content-section" />
        </HeroImage>
        <hr />
        {this.renderCampaigns()}
      </div>
    );
  }
}

CampaignPage.defaultProps = {};
CampaignPage.propTypes = {};

const mapStateToProps = state => ({
  campaigns: state.campaigns.all
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setCurrentCampaign: CampaignActions.setCurrentCampaign
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CampaignPage);

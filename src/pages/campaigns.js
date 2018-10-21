import React, { Component } from 'react';
import CampaignImage from '../assets/campaign-hero.jpeg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Grid, Button } from 'react-bootstrap';
import * as CampaignActions from '../redux/actions/campaigns';

class CampaignPage extends Component {
  routeToCampaign = (campaign, key) => {
    this.props.setCurrentCampaign({ ...campaign, id: key });
    this.props.history.push(`/campaigns/${key}/home`);
  };

  getCampaignImage = currentCampaign => {
    if (currentCampaign.image) {
      return currentCampaign.image.downloadUrl;
    }
    return require('../assets/placeholder-location.png');
  };

  renderCampaigns() {
    const { campaigns } = this.props;
    return Object.keys(campaigns).map((key, index) => {
      let currentCampaign = campaigns[key];
      let isOdd = index % 2 !== 0;
      if (isOdd) {
        return (
          <React.Fragment key={key}>
            <Row>
              <Col xs={4}>
                <img
                  src={this.getCampaignImage(currentCampaign)}
                  // style={{width: 200, height: 200}}
                  alt=""
                />
              </Col>
              <Col xs={8}>
                <h2>{currentCampaign.name}</h2>
                <p>{currentCampaign.description}</p>
                <Button
                  onClick={() => this.routeToCampaign(campaigns[key], key)}
                  bsStyle={'primary'}
                >
                  Manage Campaign
                </Button>
              </Col>
            </Row>
            <hr />
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment key={key}>
            <Row>
              <Col xs={8}>
                <h2>{currentCampaign.name}</h2>
                <p>{currentCampaign.description}</p>
                <Button
                  onClick={() => this.routeToCampaign(campaigns[key], key)}
                  bsStyle={'primary'}
                >
                  Manage Campaign
                </Button>
              </Col>
              <Col xs={4}>
                <img src={this.getCampaignImage(currentCampaign)} alt="" />
              </Col>
            </Row>
            <hr />
          </React.Fragment>
        );
      }
    });
  }

  render() {
    return (
      <Grid>
        <Row
          style={{
            backgroundImage: 'url(' + CampaignImage + ')',
            backgroundPosition: 'center',
            padding: 10
          }}
        >
          <Col xs={8}>
            <h1 style={{ color: 'white' }}>Campaigns</h1>
          </Col>
          <Col xs={3} style={{ marginTop: 20 }}>
            <Button
              bsStyle="primary"
              block
              onClick={() => this.props.history.push('/campaigns/new')}
            >
              Create a new campaign
            </Button>
          </Col>
        </Row>
        <hr />
        {this.renderCampaigns()}
      </Grid>
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

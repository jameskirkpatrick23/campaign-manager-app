import React, { Component } from 'react';
import CampaignImage from '../assets/campaign-hero.jpeg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Grid, Button, Jumbotron } from 'react-bootstrap';
import * as CampaignActions from '../redux/actions/campaigns';

class CampaignPage extends Component {
  routeToCampaign = (campaign, key) => {
    this.props.setCurrentCampaign({ ...campaign, id: key });
    this.props.history.push(`/campaigns/${key}/home`);
  };

  getCampaignImage = currentCampaign => {
    return (
      (currentCampaign.image && currentCampaign.image.downloadUrl) ||
      require('../assets/placeholder.png')
    );
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
        <Row>
          <Col xsOffset={8} xs={4} sm={2} smOffset={10}>
            <Button
              onClick={() => this.props.history.push('/campaigns/new')}
              className="float-right"
            >
              Create
            </Button>
          </Col>
        </Row>
        {!this.props.campaigns && (
          <Jumbotron>
            <h1>Campaigns</h1>
            <p>
              Here you can create a campaign to house the NPCs, places, and
              quests you want to make. The campaign is important because it
              helps you to identify which pieces go where.
            </p>
          </Jumbotron>
        )}
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Panel, Image } from 'react-bootstrap';

class NPCPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderNpcs() {
    const { npcs, currentCampaign } = this.props;
    return Object.keys(npcs).map(key => {
      const npc = npcs[key];
      let url = npc.images[0]
        ? npc.images[0].downloadUrl
        : require('../assets/placeholder-npc.png');
      const npcRoute = `/campaigns/${currentCampaign.id}/home/npcs/${npc.id}`;
      return (
        <Col key={key} xs={4} md={3}>
          <Panel
            bsStyle="info"
            className="npc-card clickable"
            onClick={() => this.props.history.push(npcRoute)}
          >
            <Panel.Heading>
              <Panel.Title componentClass="h3">{npc.name}</Panel.Title>
            </Panel.Heading>
            <Panel.Body className="padding-0">
              <Image src={url} className="place-image" />
            </Panel.Body>
          </Panel>
        </Col>
      );
    });
  }

  render() {
    const { currentCampaign } = this.props;
    return (
      <div>
        <Link
          className="button round"
          to={`/campaigns/${currentCampaign.id}/home/npcs/new`}
        >
          Create a new NPC
        </Link>
        <Row>{this.renderNpcs()}</Row>
      </div>
    );
  }
}

NPCPage.defaultProps = {};
NPCPage.propTypes = {};
const mapStateToProps = state => ({
  npcs: state.npcs.all,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(NPCPage);

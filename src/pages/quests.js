import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Panel, Image } from 'react-bootstrap';

class QuestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderQuests() {
    const { quests, currentCampaign } = this.props;
    return Object.keys(quests).map(key => {
      const quest = quests[key];
      let url = quest.images[0]
        ? quest.images[0].downloadUrl
        : require('../assets/placeholder-quest.png');
      const questRoute = `/campaigns/${currentCampaign.id}/home/quests/${
        quest.id
      }`;
      return (
        <Col key={key} xs={4} md={3}>
          <Panel
            bsStyle="info"
            className="quest-card clickable"
            onClick={() => this.props.history.push(questRoute)}
          >
            <Panel.Heading>
              <Panel.Title componentClass="h3">{quest.name}</Panel.Title>
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
          to={`/campaigns/${currentCampaign.id}/home/quests/new`}
        >
          Create a new Quest
        </Link>
        <Row>{this.renderQuests()}</Row>
      </div>
    );
  }
}

QuestPage.defaultProps = {};
QuestPage.propTypes = {};
const mapStateToProps = state => ({
  quests: state.quests.all,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(QuestPage);

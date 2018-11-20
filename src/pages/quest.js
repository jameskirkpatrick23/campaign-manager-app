import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Grid,
  Row,
  Col,
  PanelGroup,
  Panel,
  Carousel,
  Image,
  Tab,
  NavItem,
  Nav,
  Glyphicon,
  Modal,
  Button
} from 'react-bootstrap';
import QuestForm from '../forms/quest-form';
import Notes from './notes';
import * as QuestActions from '../redux/actions/quests';

class Quest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quest: {},
      questFormOpen: false
    };
    this.findRelatedObjects = this.findRelatedObjects.bind(this);
    this.renderDetails = this.renderDetails.bind(this);
    this.handleQuestDelete = this.handleQuestDelete.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderPlaces = this.renderPlaces.bind(this);
    this.getImage = this.getImage.bind(this);
    this.renderQuestForm = this.renderQuestForm.bind(this);
    this.renderQuests = this.renderQuests.bind(this);
    this.renderNPCs = this.renderNPCs.bind(this);
  }

  findRelatedObjects = () => {
    return false;
  };

  componentWillMount = () => {
    const questId = this.props.match.params.quest_id;
    this.setState({ quest: this.props.quests[questId] }, () => {
      this.findRelatedObjects(this.props);
    });
  };

  componentWillReceiveProps = nextProps => {
    const questId = nextProps.match.params.quest_id;
    const oldQuestId = this.props.match.params.quest_id;
    const foundQuest = nextProps.quests[questId];
    if (this.props.quests !== nextProps.quests || questId !== oldQuestId) {
      this.setState({ quest: foundQuest }, () => {
        this.findRelatedObjects(nextProps);
      });
    }
    this.findRelatedObjects(nextProps);
  };

  handleQuestDelete = quest => {
    const { deleteQuest, history } = this.props;
    deleteQuest(quest);
    history.goBack();
  };

  renderNPCs = () => {
    const { quest } = this.state;
    const { npcs, currentCampaign, history } = this.props;
    return (
      <Tab.Pane eventKey="npcs">
        <Row>
          <h3>Related NPCs</h3>
        </Row>
        <Row>
          {!quest.npcIds.length && (
            <div>
              You have no related NPCs. Please add some to see them here.
            </div>
          )}
          {quest.npcIds.map(npcKey => {
            const foundNPC = npcs[npcKey];
            const questRoute = `/campaigns/${
              currentCampaign.id
            }/home/npcs/${npcKey}`;
            if (!foundNPC) return null;
            if (foundNPC)
              return (
                <Col xs={6} md={4} key={`quest-${npcKey}`}>
                  <Panel
                    bsStyle="warning"
                    className="quest-card clickable"
                    onClick={() => history.push(questRoute)}
                  >
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">
                        {foundNPC.name}
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body className="padding-0">
                      <Image
                        src={this.getImage(foundNPC, 'npc')}
                        className="quest-image"
                      />
                    </Panel.Body>
                  </Panel>
                </Col>
              );
          })}
        </Row>
      </Tab.Pane>
    );
  };

  renderQuests = () => {
    const { quest } = this.state;
    const { quests, currentCampaign, history } = this.props;
    return (
      <Tab.Pane eventKey="quests">
        <Row>
          <h3>Related Quests</h3>
        </Row>
        <Row>
          {!quest.questIds.length && (
            <div>
              You have no related Quests. Please add some to see them here.
            </div>
          )}
          {quest.questIds.map(questKey => {
            const foundQuest = quests[questKey];
            const questRoute = `/campaigns/${
              currentCampaign.id
            }/home/quests/${questKey}`;
            if (!foundQuest) return null;
            if (foundQuest)
              return (
                <Col xs={6} md={4} key={`quest-${questKey}`}>
                  <Panel
                    bsStyle="warning"
                    className="quest-card clickable"
                    onClick={() => history.push(questRoute)}
                  >
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">
                        {foundQuest.name}
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body className="padding-0">
                      <Image
                        src={this.getImage(foundQuest, 'quest')}
                        className="quest-image"
                      />
                    </Panel.Body>
                  </Panel>
                </Col>
              );
          })}
        </Row>
      </Tab.Pane>
    );
  };

  renderDetails = () => {
    const { quest } = this.state;

    return (
      <Tab.Pane eventKey="info">
        <p>Rewards: {quest.rewards}</p>
        <p>Status: {quest.status}</p>
        <p>Description: {quest.description}</p>
        <p>Objectives: </p>
      </Tab.Pane>
    );
  };

  renderImages = () => {
    const { quest } = this.state;
    return (
      <Tab.Pane eventKey="images">
        {quest.images.length === 1 && (
          <Image src={quest.images[0].downloadUrl} responsive />
        )}
        {quest.images.length > 1 && (
          <Carousel interval={null}>
            {quest.images &&
              quest.images.map(image => {
                return (
                  <Carousel.Item key={`quest-image-${image.fileName}`}>
                    <Image src={image.downloadUrl} responsive />
                  </Carousel.Item>
                );
              })}
          </Carousel>
        )}
        {!quest.images.length && (
          <Image src={require('../assets/placeholder-quest.png')} responsive />
        )}
      </Tab.Pane>
    );
  };

  renderAttachedFiles = () => {
    const { quest } = this.state;
    return (
      <Tab.Pane eventKey="attachedFiles">
        {quest.attachedFiles &&
          quest.attachedFiles.map(file => {
            return (
              <div key={`${file.fileName}-${file.downloadUrl}`}>
                <a href="#" onClick={() => window.open(file.downloadUrl)}>
                  {file.fileName}
                </a>
              </div>
            );
          })}
      </Tab.Pane>
    );
  };

  getImage = (item, type) => {
    if (item.images.length) {
      return item.images[0].downloadUrl;
    }
    return require(`../assets/placeholder-${type}.png`);
  };

  renderPlaces = () => {
    const { quest } = this.state;
    const { places, currentCampaign, history } = this.props;
    return (
      <Tab.Pane eventKey="places">
        <Row>
          <h3>Related Places</h3>
        </Row>
        <Row>
          {!quest.placeIds.length && (
            <div>
              You have no related places. Please add some to see them here.
            </div>
          )}
          {quest.placeIds.map(placeKey => {
            const foundPlace = places[placeKey];
            const placeRoute = `/campaigns/${
              currentCampaign.id
            }/home/places/${placeKey}`;
            if (!foundPlace) return null;
            if (foundPlace)
              return (
                <Col xs={6} md={4} key={`place-${placeKey}`}>
                  <Panel
                    bsStyle="warning"
                    className="place-card clickable"
                    onClick={() => history.push(placeRoute)}
                  >
                    <Panel.Heading>
                      <Panel.Title componentClass="h4">
                        {foundPlace.name}
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body className="padding-0">
                      <Image
                        src={this.getImage(foundPlace, 'place')}
                        className="place-image"
                      />
                    </Panel.Body>
                  </Panel>
                </Col>
              );
          })}
        </Row>
      </Tab.Pane>
    );
  };

  renderNotes = () => {
    const { quest } = this.state;
    return (
      <Tab.Pane eventKey="notes">
        <Notes noteIds={quest.noteIds} typeId={quest.id} type="quests" />
      </Tab.Pane>
    );
  };

  renderQuestForm = () => {
    const { quest, questFormOpen } = this.state;
    return (
      <Modal
        show={questFormOpen}
        onHide={this.hideQuestForm}
        bsSize="lg"
        aria-labelledby="quest-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="quest-modal-title-lg">Edit {quest.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <QuestForm
            quest={quest}
            onCancel={this.hideQuestForm}
            onSubmit={this.hideQuestForm}
            formAction={'edit'}
          />
        </Modal.Body>
      </Modal>
    );
  };

  showQuestForm = e => {
    e.preventDefault();
    this.setState({ questFormOpen: true });
  };

  hideQuestForm = () => {
    this.setState({ questFormOpen: false });
  };

  renderPills = () => {
    return (
      <Nav bsStyle="pills" className="margin-left-0">
        <NavItem eventKey="images">
          <Glyphicon glyph="picture" />
        </NavItem>
        <NavItem eventKey="info">
          <Glyphicon glyph="book" />
        </NavItem>
        <NavItem eventKey="notes">
          <Glyphicon glyph="comment" />
        </NavItem>
        <NavItem eventKey="places">
          <Glyphicon glyph="globe" />
        </NavItem>
        <NavItem eventKey="npcs">
          <Glyphicon glyph="user" />
        </NavItem>
        <NavItem eventKey="quests">
          <Glyphicon glyph="tower" />
        </NavItem>
        <NavItem eventKey="attachedFiles">
          <Glyphicon glyph="duplicate" />
        </NavItem>
      </Nav>
    );
  };

  render() {
    const { quest } = this.state;
    if (!quest) return null;
    return (
      <Grid>
        {this.renderQuestForm()}
        <Row>
          <Col xs={12}>
            <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h4">
                  {quest.name}
                  <Button
                    className="margin-left-1 vert-text-top"
                    bsSize="small"
                    bsStyle="warning"
                    onClick={this.showQuestForm}
                  >
                    <Glyphicon glyph="pencil" />
                  </Button>
                  <Button
                    className="margin-left-1 vert-text-top"
                    bsSize="small"
                    bsStyle="danger"
                    onClick={() => this.handleQuestDelete(quest)}
                  >
                    <Glyphicon glyph="trash" />
                  </Button>
                </Panel.Title>
              </Panel.Heading>
              <Tab.Container id="quest-tabs" defaultActiveKey="images">
                <Panel.Body>
                  <Row>
                    <Col xs={1} className="margin-right-2">
                      {this.renderPills()}
                    </Col>
                    <Col
                      xs={10}
                      style={{ maxHeight: '500px', overflowY: 'scroll' }}
                    >
                      <Tab.Content animation>
                        {this.renderImages()}
                        {this.renderDetails()}
                        {this.renderNotes()}
                        {this.renderAttachedFiles()}
                        {this.renderPlaces()}
                        {this.renderNPCs()}
                        {this.renderQuests()}
                      </Tab.Content>
                    </Col>
                  </Row>
                </Panel.Body>
              </Tab.Container>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Quest.defaultProps = {};
Quest.propTypes = {};
const mapStateToProps = state => ({
  quests: state.quests.all,
  npcs: state.npcs.all,
  places: state.places.all,
  currentCampaign: state.campaigns.currentCampaign
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteQuest: QuestActions.deleteQuest
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Quest);

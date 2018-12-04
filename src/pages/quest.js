import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Grid,
  Row,
  Col,
  Checkbox,
  Panel,
  Carousel,
  Image,
  Tab,
  NavItem,
  Nav,
  Glyphicon,
  InputGroup,
  Modal,
  FormControl,
  Button
} from 'react-bootstrap';
import QuestForm from '../forms/quest-form';
import Notes from './notes';
import ListSlidein from '../reusable-components/list-slidein';
import Fieldset from '../reusable-components/fieldset';
import * as QuestActions from '../redux/actions/quests';

class Quest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quest: {},
      questFormOpen: false
    };
    this.renderDetails = this.renderDetails.bind(this);
    this.handleQuestDelete = this.handleQuestDelete.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderObject = this.renderObject.bind(this);
    this.getImage = this.getImage.bind(this);
    this.renderQuestForm = this.renderQuestForm.bind(this);
  }

  componentWillMount = () => {
    const questId = this.props.match.params.quest_id;
    this.setState({ quest: this.props.quests[questId] });
  };

  componentWillReceiveProps = nextProps => {
    const questId = nextProps.match.params.quest_id;
    const oldQuestId = this.props.match.params.quest_id;
    const foundQuest = nextProps.quests[questId];
    if (this.props.quests !== nextProps.quests || questId !== oldQuestId) {
      this.setState({ quest: foundQuest });
    }
  };

  handleQuestDelete = quest => {
    const { deleteQuest, history } = this.props;
    deleteQuest(quest);
    history.goBack();
  };

  renderDetails = () => {
    const { quest } = this.state;
    return (
      <Tab.Pane eventKey="info">
        <Fieldset label="Details">
          <Row>
            <Col xs={4}>
              <div>
                <strong>Status: </strong>
                <p>{quest.status}</p>
              </div>
            </Col>
            <Col xs={8}>
              <div>
                <strong>Rewards: </strong>
                <p>{quest.rewards}</p>
              </div>
            </Col>
            <Col xs={12}>
              <div>
                <strong>Description: </strong>
                <p>{quest.description}</p>
              </div>
            </Col>
          </Row>
        </Fieldset>
        <Fieldset label="Objectives">
          {quest.objectives.map((obj, idx) => (
            <Row key={`quest-objective-${idx}`}>
              <Col xs={1}>
                {obj.complete ? (
                  <Glyphicon glyph="check" />
                ) : (
                  <Glyphicon glyph="unchecked" />
                )}
              </Col>
              <Col xs={11}>{obj.name}</Col>
            </Row>
          ))}
        </Fieldset>
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

  renderObject = (type, stateIds, name, secondaryField) => {
    const { quest } = this.state;
    const { currentCampaign, history } = this.props;
    const items = quest[stateIds].map(collectionKey => {
      const foundObject = this.props[type][collectionKey];
      const foundRoute = `/campaigns/${
        currentCampaign.id
      }/home/${type}/${collectionKey}`;
      return {
        route: foundRoute,
        descriptor: foundObject[secondaryField],
        name: foundObject.name,
        imageURL: this.getImage(foundObject, name)
      };
    });
    return (
      <Tab.Pane eventKey={type}>
        <Row>
          {!quest[stateIds].length && (
            <div>
              You have no related {type}. Please add some to see them here.
            </div>
          )}
          {!!quest[stateIds].length && (
            <Col xs={12}>
              <ListSlidein items={items} history={history} />
            </Col>
          )}
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
      <Nav bsStyle="pills" className="margin-left-0 width-100">
        <NavItem eventKey="images">
          <span>
            <Glyphicon
              bsSize="large"
              className="margin-right-1"
              glyph="picture"
            />
            <span>Images</span>
          </span>
        </NavItem>
        <NavItem eventKey="info">
          <span>
            <Glyphicon bsSize="large" className="margin-right-1" glyph="book" />
            <span>Info</span>
          </span>
        </NavItem>
        <NavItem eventKey="notes">
          <span>
            <Glyphicon
              bsSize="large"
              className="margin-right-1"
              glyph="comment"
            />
            <span>Notes</span>
          </span>
        </NavItem>
        <NavItem eventKey="places">
          <span>
            <Glyphicon
              bsSize="large"
              className="margin-right-1"
              glyph="globe"
            />
            <span>Places</span>
          </span>
        </NavItem>
        <NavItem eventKey="npcs">
          <span>
            <Glyphicon bsSize="large" className="margin-right-1" glyph="user" />
            <span>NPCs</span>
          </span>
        </NavItem>
        <NavItem eventKey="quests">
          <span>
            <Glyphicon
              bsSize="large"
              className="margin-right-1"
              glyph="tower"
            />
            <span>Quests</span>
          </span>
        </NavItem>
        <NavItem eventKey="attachedFiles">
          <span>
            <Glyphicon
              bsSize="large"
              className="margin-right-1"
              glyph="duplicate"
            />
            <span>Files</span>
          </span>
        </NavItem>
      </Nav>
    );
  };

  render() {
    const { quest } = this.state;
    if (!quest) return null;
    return (
      <Grid className="app-container">
        {this.renderQuestForm()}
        <Row className="margin-bottom-1">
          <Col xs={10}>
            <h3>{quest.name}</h3>
          </Col>
          <Col xs={2}>
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
          </Col>
        </Row>
        <Tab.Container id="quest-tabs" defaultActiveKey="images">
          <Row>
            <Col xs={2}>{this.renderPills()}</Col>
            <Col xs={10}>
              <Tab.Content animation>
                {this.renderImages()}
                {this.renderDetails()}
                {this.renderNotes()}
                {this.renderAttachedFiles()}
                {this.renderObject('places', 'placeIds', 'place', 'type')}
                {this.renderObject('npcs', 'npcIds', 'npc', 'race')}
                {this.renderObject('quests', 'questIds', 'quest', 'status')}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
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

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
import NPCForm from '../forms/npc-form';
import Notes from './notes';
import * as NPCActions from '../redux/actions/npcs';
import Fieldset from '../reusable-components/fieldset';
import ListSlidein from '../reusable-components/list-slidein';

class NPC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      npc: {},
      npcFormOpen: false
    };
    this.renderDetails = this.renderDetails.bind(this);
    this.handleNPCDelete = this.handleNPCDelete.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderObject = this.renderObject.bind(this);
    this.getImage = this.getImage.bind(this);
    this.renderNPCForm = this.renderNPCForm.bind(this);
  }

  componentWillMount = () => {
    const npcId = this.props.match.params.npc_id;
    this.setState({ npc: this.props.npcs[npcId] });
  };

  componentWillReceiveProps = nextProps => {
    const npcId = nextProps.match.params.npc_id;
    const oldNpcId = this.props.match.params.npc_id;
    const foundNpc = nextProps.npcs[npcId];
    if (this.props.npcs !== nextProps.npcs || npcId !== oldNpcId) {
      this.setState({ npc: foundNpc });
    }
  };

  handleNPCDelete = npc => {
    const { deleteNPC, history } = this.props;
    deleteNPC(npc);
    history.goBack();
  };

  renderDetails = () => {
    const { npc } = this.state;

    return (
      <Tab.Pane eventKey="info">
        <Col xs={12}>
          <Fieldset label="Physical Description">
            <Row>
              <Col xs={4}>
                <div>
                  <strong>Gender: </strong>
                  <p>{npc.gender}</p>
                </div>
              </Col>
              <Col xs={4}>
                <div>
                  <strong>Height: </strong>
                  <p>{npc.height}</p>
                </div>
              </Col>
              <Col xs={4}>
                <div>
                  <strong>Weight: </strong>
                  <p>{npc.weight}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <div>
                  <strong>Race: </strong>
                  <p>{npc.race}</p>
                </div>
              </Col>
              <Col xs={4}>
                <div>
                  <strong>Occupation: </strong>
                  <p>{npc.occupation}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div>
                  <strong>Description: </strong>
                  <p>{npc.physDescription}</p>
                </div>
              </Col>
            </Row>
          </Fieldset>
        </Col>
        <Col xs={12}>
          <Fieldset label="Personality">
            <Row>
              <Col xs={4}>
                <div>
                  <strong>Alignment: </strong>
                  <p>{npc.alignment}</p>
                </div>
              </Col>
              <Col xs={8}>
                <div>
                  <strong>Values: </strong>
                  <br />
                  {npc.values.map(v => (
                    <span key={v} className="margin-right-1">
                      {v}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div>
                  <strong>Quirks: </strong>
                  {npc.quirks.map(q => (
                    <p key={q}>{q}</p>
                  ))}
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div>
                  <strong>Backstory: </strong>
                  <p>{npc.backstory}</p>
                </div>
              </Col>
            </Row>
          </Fieldset>
        </Col>
      </Tab.Pane>
    );
  };

  renderImages = () => {
    const { npc } = this.state;
    return (
      <Tab.Pane eventKey="images">
        {npc.images.length === 1 && (
          <Image src={npc.images[0].downloadUrl} responsive />
        )}
        {npc.images.length > 1 && (
          <Carousel interval={null}>
            {npc.images &&
              npc.images.map(image => {
                return (
                  <Carousel.Item key={`npc-image-${image.fileName}`}>
                    <Image src={image.downloadUrl} responsive />
                  </Carousel.Item>
                );
              })}
          </Carousel>
        )}
        {!npc.images.length && (
          <Image src={require('../assets/placeholder.png')} responsive />
        )}
      </Tab.Pane>
    );
  };

  renderAttachedFiles = () => {
    const { npc } = this.state;
    return (
      <Tab.Pane eventKey="attachedFiles">
        {npc.attachedFiles &&
          npc.attachedFiles.map(file => {
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
    return require(`../assets/placeholder.png`);
  };

  renderObject = (type, stateIds, name, secondaryField) => {
    const { npc } = this.state;
    const { currentCampaign, history } = this.props;
    const items = npc[stateIds].map(collectionKey => {
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
          {!npc[stateIds].length && (
            <div>
              You have no related {type}. Please add some to see them here.
            </div>
          )}
          {!!npc[stateIds].length && (
            <Col xs={12}>
              <ListSlidein items={items} history={history} />
            </Col>
          )}
        </Row>
      </Tab.Pane>
    );
  };

  renderNotes = () => {
    const { npc } = this.state;
    return (
      <Tab.Pane eventKey="notes">
        <Notes noteIds={npc.noteIds} typeId={npc.id} type="npcs" />
      </Tab.Pane>
    );
  };

  renderNPCForm = () => {
    const { npc, npcFormOpen } = this.state;
    return (
      <Modal
        show={npcFormOpen}
        onHide={this.hideNPCForm}
        bsSize="lg"
        aria-labelledby="npc-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="npc-modal-title-lg">Edit {npc.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NPCForm
            npc={npc}
            onCancel={this.hideNPCForm}
            onSubmit={this.hideNPCForm}
            formAction={'edit'}
          />
        </Modal.Body>
      </Modal>
    );
  };

  showNPCForm = e => {
    e.preventDefault();
    this.setState({ npcFormOpen: true });
  };

  hideNPCForm = () => {
    this.setState({ npcFormOpen: false });
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
    const { npc } = this.state;
    if (!npc) return null;
    return (
      <Grid className="app-container">
        {this.renderNPCForm()}
        <Row className="margin-bottom-1">
          <Col xs={10}>
            <h3>{npc.name}</h3>
          </Col>
          <Col xs={2}>
            <Button
              className="margin-left-1 vert-text-top"
              bsSize="small"
              bsStyle="warning"
              onClick={this.showNPCForm}
            >
              <Glyphicon glyph="pencil" />
            </Button>
            <Button
              className="margin-left-1 vert-text-top"
              bsSize="small"
              bsStyle="danger"
              onClick={() => this.handleNPCDelete(npc)}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </Col>
        </Row>
        <Tab.Container id="npc-tabs" defaultActiveKey="images">
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

NPC.defaultProps = {};
NPC.propTypes = {};
const mapStateToProps = state => ({
  npcs: state.npcs.all,
  quests: state.quests.all,
  places: state.places.all,
  currentCampaign: state.campaigns.currentCampaign
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteNPC: NPCActions.deleteNPC
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NPC);

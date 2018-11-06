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

class NPC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      npc: {},

      npcFormOpen: false
    };
    this.findRelatedObjects = this.findRelatedObjects.bind(this);
    this.renderDetails = this.renderDetails.bind(this);
    this.handleNPCDelete = this.handleNPCDelete.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderPlaces = this.renderPlaces.bind(this);
    this.getImage = this.getImage.bind(this);
    this.renderNPCForm = this.renderNPCForm.bind(this);
  }

  findRelatedObjects = () => {
    return false;
  };

  componentWillMount = () => {
    const npcId = this.props.match.params.npc_id;
    this.setState({ npc: this.props.npcs[npcId] }, () => {
      this.findRelatedObjects(this.props);
    });
  };

  componentWillReceiveProps = nextProps => {
    const npcId = nextProps.match.params.npc_id;
    const oldNpcId = this.props.match.params.npc_id;
    const foundNpc = nextProps.npcs[npcId];
    if (this.props.npcs !== nextProps.npcs || npcId !== oldNpcId) {
      this.setState({ npc: foundNpc }, () => {
        this.findRelatedObjects(nextProps);
      });
    }
    this.findRelatedObjects(nextProps);
  };

  handleNPCDelete = npc => {
    const { deleteNpc, history } = this.props;
    deleteNpc(npc);
    history.goBack();
  };

  renderDetails = () => {
    const { npc } = this.state;

    return (
      <Tab.Pane eventKey="info">
        <PanelGroup
          accordion
          id={'phys-description'}
          defaultActiveKey="physDesc"
        >
          <Panel
            id={'npc-panel-phys-description'}
            bsStyle="warning"
            eventKey="physDesc"
          >
            <Panel.Heading>
              <Panel.Toggle style={{ textDecoration: 'none' }}>
                <Panel.Title componentClass="h3">
                  Physical Description
                </Panel.Title>
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <div>
                  <strong>Gender: </strong>
                  <p>{npc.gender}</p>
                </div>
                <div>
                  <strong>Height: </strong>
                  <p>{npc.height}</p>
                </div>
                <div>
                  <strong>Weight: </strong>
                  <p>{npc.weight}</p>
                </div>
                <div>
                  <strong>Race: </strong>
                  <p>{npc.race}</p>
                </div>
                <div>
                  <strong>Occupation: </strong>
                  <p>{npc.occupation}</p>
                </div>
                <div>
                  <strong>Description: </strong>
                  <p>{npc.physDescription}</p>
                </div>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
          <Panel
            id={'npc-panel-personality'}
            bsStyle="warning"
            eventKey="personalityPanel"
          >
            <Panel.Heading>
              <Panel.Toggle style={{ textDecoration: 'none' }}>
                <Panel.Title componentClass="h3">Personality</Panel.Title>
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <div>
                  <strong>Alignment: </strong>
                  <p>{npc.alignment}</p>
                </div>
                <div>
                  <strong>Quirks: </strong>
                  {npc.quirks.map(q => (
                    <p key={q}>{q}</p>
                  ))}
                </div>
                <div>
                  <strong>Values: </strong>
                  {npc.values.map(v => (
                    <p key={v}>{v}</p>
                  ))}
                </div>
                <div>
                  <strong>Backstory: </strong>
                  <p>{npc.backstory}</p>
                </div>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        </PanelGroup>
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
          <Image src={require('../assets/placeholder-npc.png')} responsive />
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

  getImage = npc => {
    if (npc.images.length) {
      return npc.images[0].downloadUrl;
    }
    return require('../assets/placeholder-npc.png');
  };

  renderPlaces = () => {
    const { npc } = this.state;
    const { places, currentCampaign, history } = this.props;
    return (
      <Tab.Pane eventKey="places">
        <Row>
          <h3>Related Places</h3>
        </Row>
        <Row>
          {!npc.placeIds.length && (
            <div>
              You have no related places. Please add some to see them here.
            </div>
          )}
          {npc.placeIds.map(placeKey => {
            const foundPlace = places[placeKey];
            const placeRoute = `/campaigns/${
              currentCampaign.id
            }/home/places/${placeKey}`;
            if (foundPlace)
              return (
                <Col xs={4} key={`place-${placeKey}`}>
                  <Panel
                    bsStyle="warning"
                    className="place-card clickable"
                    onClick={() => history.push(placeRoute)}
                  >
                    <Panel.Heading>
                      <Panel.Title componentClass="h3">
                        {foundPlace.name}
                      </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body className="padding-0">
                      <Image
                        src={this.getImage(foundPlace)}
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
    const { npc } = this.state;
    return (
      <Tab.Pane eventKey="notes">
        <Notes noteIds={npc.noteIds} typeId={npc.id} type="npc" />
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
        <NavItem eventKey="attachedFiles">
          <Glyphicon glyph="duplicate" />
        </NavItem>
      </Nav>
    );
  };

  render() {
    const { npc } = this.state;
    if (!npc) return null;
    return (
      <Grid>
        {this.renderNPCForm()}
        <Row>
          <Col xs={12}>
            <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">
                  {npc.name}
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
                </Panel.Title>
              </Panel.Heading>
              <Tab.Container id="npc-tabs" defaultActiveKey="images">
                <Panel.Body>
                  <Row>
                    <Col xs={1}>{this.renderPills()}</Col>
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

NPC.defaultProps = {};
NPC.propTypes = {};
const mapStateToProps = state => ({
  npcs: state.npcs.all,
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

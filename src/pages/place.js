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
import Floors from './floors';
import PlaceForm from '../forms/places-form';
import Notes from './notes';
import * as PlaceActions from '../redux/actions/places';

class Place extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {},
      numRows: 1,
      numCols: 1,
      numFloors: 1,
      placeFormOpen: false
    };
    this.findRelatedObjects = this.findRelatedObjects.bind(this);
    this.renderLocationHistory = this.renderLocationHistory.bind(this);
    this.handlePlaceDelete = this.handlePlaceDelete.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderFloors = this.renderFloors.bind(this);
  }

  findRelatedObjects = () => {
    return false;
  };

  componentWillMount = () => {
    const placeId = this.props.match.params.place_id;
    this.setState({ place: this.props.places[placeId] }, () => {
      this.findRelatedObjects(this.props);
    });
  };

  componentWillReceiveProps = nextProps => {
    const placeId = nextProps.match.params.place_id;
    const foundPlace = nextProps.places[placeId];
    if (
      this.props.places !== nextProps.places ||
      foundPlace !== this.props.places[placeId]
    ) {
      this.setState({ place: foundPlace }, () => {
        this.findRelatedObjects(nextProps);
      });
    }
    this.findRelatedObjects(nextProps);
  };

  handlePlaceDelete = place => {
    const { deletePlace, history } = this.props;
    deletePlace(place);
    history.goBack();
  };

  renderLocationHistory = () => {
    const { place } = this.state;

    return (
      <Tab.Pane eventKey="location-history">
        <PanelGroup
          accordion
          id={'history-whatever'}
          defaultActiveKey="locationPanel"
        >
          <Panel
            id={'place-panel-location'}
            bsStyle="warning"
            eventKey="locationPanel"
          >
            <Panel.Heading>
              <Panel.Toggle style={{ textDecoration: 'none' }}>
                <Panel.Title componentClass="h3">Location</Panel.Title>
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <p>{place.location}</p>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
          <Panel
            id={'place-panel-history'}
            bsStyle="warning"
            eventKey="historyPanel"
          >
            <Panel.Heading>
              <Panel.Toggle style={{ textDecoration: 'none' }}>
                <Panel.Title componentClass="h3">History</Panel.Title>
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <p>{place.history}</p>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
          <Panel
            id={'place-panel-outside'}
            bsStyle="warning"
            eventKey="outsidePanel"
          >
            <Panel.Heading>
              <Panel.Toggle style={{ textDecoration: 'none' }}>
                <Panel.Title componentClass="h3">Outside</Panel.Title>
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <p>{place.outsideDescription}</p>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
          <Panel
            id={'place-panel-inside'}
            bsStyle="warning"
            eventKey="insidePanel"
          >
            <Panel.Heading>
              <Panel.Toggle style={{ textDecoration: 'none' }}>
                <Panel.Title componentClass="h3">Inside</Panel.Title>
              </Panel.Toggle>
            </Panel.Heading>
            <Panel.Collapse>
              <Panel.Body>
                <p>{place.insideDescription}</p>
              </Panel.Body>
            </Panel.Collapse>
          </Panel>
        </PanelGroup>
      </Tab.Pane>
    );
  };

  renderImages = () => {
    const { place } = this.state;

    return (
      <Tab.Pane eventKey="images">
        <Carousel interval={null}>
          {place.images &&
            place.images.map(image => {
              return (
                <Carousel.Item key={`place-image-${image.fileName}`}>
                  <Image src={image.downloadUrl} responsive />
                </Carousel.Item>
              );
            })}
        </Carousel>
      </Tab.Pane>
    );
  };

  renderAttachedFiles = () => {
    const { place } = this.state;
    return (
      <Tab.Pane eventKey="attachedFiles">
        {place.attachedFiles &&
          place.attachedFiles.map(file => {
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

  renderPills = () => {
    return (
      <Nav bsStyle="pills">
        <NavItem eventKey="images">
          <Glyphicon glyph="picture" />
        </NavItem>
        <NavItem eventKey="location-history">
          <Glyphicon glyph="book" />
        </NavItem>
        <NavItem eventKey="floors">
          <Glyphicon glyph="th-large" />
        </NavItem>
        <NavItem eventKey="notes">
          <Glyphicon glyph="comment" />
        </NavItem>
        <NavItem eventKey="attachedFiles">
          <Glyphicon glyph="file" />
        </NavItem>
      </Nav>
    );
  };

  renderFloors = () => {
    const { place } = this.state;
    return (
      <Tab.Pane eventKey="floors">
        <Floors place={place} />
      </Tab.Pane>
    );
  };

  renderNotes = () => {
    const { place } = this.state;
    return (
      <Tab.Pane eventKey="notes">
        <Notes noteIds={place.noteIds} typeId={place.id} type="place" />
      </Tab.Pane>
    );
  };

  renderPlaceForm = () => {
    const { place } = this.state;
    return (
      <Modal
        show={this.state.placeFormOpen}
        onHide={this.hidePlaceForm}
        bsSize="lg"
        aria-labelledby="place-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="place-modal-title-lg">Modify Place</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PlaceForm
            place={place}
            onCancel={this.hidePlaceForm}
            onSubmit={this.hidePlaceForm}
            formAction={'edit'}
          />
        </Modal.Body>
      </Modal>
    );
  };

  showPlaceForm = e => {
    e.preventDefault();
    this.setState({ placeFormOpen: true });
  };

  hidePlaceForm = () => {
    this.setState({ placeFormOpen: false });
  };

  render() {
    const { place } = this.state;
    const { deletePlace } = this.props;
    if (!place) return null;
    return (
      <Grid>
        {this.renderPlaceForm()}
        <Row>
          <Col xs={12}>
            <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">
                  {place.name}
                  <Button
                    className="margin-left-1 vert-text-top"
                    bsSize="small"
                    bsStyle="warning"
                    onClick={this.showPlaceForm}
                  >
                    <Glyphicon glyph="pencil" />
                  </Button>
                  <Button
                    className="margin-left-1 vert-text-top"
                    bsSize="small"
                    bsStyle="danger"
                    onClick={() => this.handlePlaceDelete(place)}
                  >
                    <Glyphicon glyph="trash" />
                  </Button>
                </Panel.Title>
              </Panel.Heading>
              <Tab.Container id="place-tabs" defaultActiveKey="images">
                <Panel.Body>
                  <Row className="margin-bottom-1">
                    <Col
                      xs={12}
                      style={{ maxHeight: '500px', overflowY: 'scroll' }}
                    >
                      <Tab.Content animation>
                        {this.renderImages()}
                        {this.renderLocationHistory()}
                        {this.renderFloors()}
                        {this.renderNotes()}
                        {this.renderAttachedFiles()}
                      </Tab.Content>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>{this.renderPills()}</Col>
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

Place.defaultProps = {};
Place.propTypes = {};
const mapStateToProps = state => ({
  places: state.places.all,
  currentCampaign: state.campaigns.currentCampaign
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deletePlace: PlaceActions.deletePlace
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Place);

import React, { Component } from 'react';
import { connect } from 'react-redux';
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

class PlaceDetails extends Component {
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

PlaceDetails.defaultProps = {};
PlaceDetails.propTypes = {};
const mapStateToProps = state => ({
  places: state.places.all,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(PlaceDetails);

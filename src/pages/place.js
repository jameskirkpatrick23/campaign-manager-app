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
import ListSlidein from '../reusable-components/list-slidein';
import Floors from './floors';
import PlaceForm from '../forms/places-form';
import Notes from './notes';
import * as PlaceActions from '../redux/actions/places';
import Fieldset from '../reusable-components/fieldset';

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
    this.renderLocationHistory = this.renderLocationHistory.bind(this);
    this.handlePlaceDelete = this.handlePlaceDelete.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderFloors = this.renderFloors.bind(this);
    this.renderObject = this.renderObject.bind(this);
    this.getPlaceImage = this.getPlaceImage.bind(this);
  }

  componentWillMount = () => {
    const placeId = this.props.match.params.place_id;
    this.setState({ place: this.props.places[placeId] });
  };

  componentWillReceiveProps = nextProps => {
    const placeId = nextProps.match.params.place_id;
    const oldPlaceId = this.props.match.params.place_id;
    const foundPlace = nextProps.places[placeId];
    if (this.props.places !== nextProps.places || placeId !== oldPlaceId) {
      this.setState({ place: foundPlace });
    }
  };

  handlePlaceDelete = place => {
    const { deletePlace, history } = this.props;
    deletePlace(place);
    history.goBack();
  };

  renderLocationHistory = () => {
    const { place } = this.state;

    return (
      <Tab.Pane eventKey="info">
        <Col xs={12}>
          <Fieldset label="Location and History">
            <Row>
              <Col xs={12}>
                <div>
                  <strong>Location: </strong>
                  <p>{place.location}</p>
                </div>
              </Col>
              <Col xs={12}>
                <div>
                  <strong>History: </strong>
                  <p>{place.history}</p>
                </div>
              </Col>
            </Row>
          </Fieldset>
          <Fieldset label="Physical Description">
            <Row>
              <Col xs={12}>
                <div>
                  <strong>Outside Description: </strong>
                  <p>{place.outsideDescription}</p>
                </div>
              </Col>
              <Col xs={12}>
                <div>
                  <strong>Outside Description: </strong>
                  <p>{place.insideDescription}</p>
                </div>
              </Col>
            </Row>
          </Fieldset>
        </Col>
      </Tab.Pane>
    );
  };

  renderImages = () => {
    const { place } = this.state;
    return (
      <Tab.Pane eventKey="images">
        {place.images.length === 1 && (
          <Image src={place.images[0].downloadUrl} responsive />
        )}
        {place.images.length > 1 && (
          <Carousel interval={null}>
            {place.images &&
              place.images.map(image => {
                return (
                  <Carousel.Item key={`place-image-${image.fileName}`}>
                    <Image src={image.downloadUrl} responsive />
                  </Carousel.Item>
                );
              })}
            {!place.images.length && (
              <Image src={require('../assets/placeholder.png')} responsive />
            )}
          </Carousel>
        )}
      </Tab.Pane>
    );
  };

  renderObject = (type, stateIds, name, secondaryField) => {
    const { place } = this.state;
    const { currentCampaign, history } = this.props;
    const items = [];
    place[stateIds].forEach(collectionKey => {
      const foundObject = this.props[type][collectionKey];
      const foundRoute = `/campaigns/${
        currentCampaign.id
      }/home/${type}/${collectionKey}`;
      if (foundObject && foundRoute) {
        items.push({
          route: foundRoute,
          descriptor: foundObject[secondaryField],
          name: foundObject.name,
          imageURL: this.getImage(foundObject, name)
        });
      }
    });
    return (
      <Tab.Pane eventKey={type}>
        <Row>
          {!place[stateIds].length && (
            <div>
              You have no related {type}. Please add some to see them here.
            </div>
          )}
          {!!place[stateIds].length && (
            <Col xs={12}>
              <ListSlidein items={items} history={history} />
            </Col>
          )}
        </Row>
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

  getPlaceImage = place => {
    if (place.images.length) {
      return place.images[0].downloadUrl;
    }
    return require('../assets/placeholder.png');
  };

  renderFloors = () => {
    const { place } = this.state;
    return (
      <Tab.Pane eventKey="floors">
        <Floors place={place} />
      </Tab.Pane>
    );
  };

  getImage = (item, type) => {
    if (item.images.length) {
      return item.images[0].downloadUrl;
    }
    return require(`../assets/placeholder.png`);
  };

  renderNotes = () => {
    const { place } = this.state;
    return (
      <Tab.Pane eventKey="notes">
        <Notes noteIds={place.noteIds} typeId={place.id} type="places" />
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
          <Modal.Title id="place-modal-title-lg">Edit {place.name}</Modal.Title>
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
        <NavItem eventKey="floors">
          <span>
            <Glyphicon
              bsSize="large"
              className="margin-right-1"
              glyph="th-large"
            />
            <span>Floors</span>
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
    const { place } = this.state;
    if (!place) return null;
    return (
      <Grid>
        {this.renderPlaceForm()}
        <Row className="margin-bottom-1">
          <Col xs={10}>
            <h3>{place.name}</h3>
          </Col>
          <Col xs={2}>
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
          </Col>
        </Row>
        <Tab.Container id="npc-tabs" defaultActiveKey="images">
          <Row>
            <Col xs={2}>{this.renderPills()}</Col>
            <Col xs={10}>
              <Tab.Content animation>
                {this.renderImages()}
                {this.renderLocationHistory()}
                {this.renderFloors()}
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

Place.defaultProps = {};
Place.propTypes = {};
const mapStateToProps = state => ({
  places: state.places.all,
  npcs: state.npcs.all,
  quests: state.quests.all,
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

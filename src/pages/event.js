import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import {
  Grid,
  Row,
  Col,
  Carousel,
  Image,
  Tab,
  NavItem,
  Nav,
  Glyphicon,
  Modal,
  Button
} from 'react-bootstrap';
import EventForm from '../forms/event-form';
import Notes from './notes';
import ListSlidein from '../reusable-components/list-slidein';
import Fieldset from '../reusable-components/fieldset';
import * as EventActions from '../redux/actions/events';

class Event extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      eventFormOpen: false
    };
    this.renderDetails = this.renderDetails.bind(this);
    this.handleEventDelete = this.handleEventDelete.bind(this);
    this.renderImages = this.renderImages.bind(this);
    this.renderObject = this.renderObject.bind(this);
    this.getImage = this.getImage.bind(this);
    this.renderEventForm = this.renderEventForm.bind(this);
  }

  componentWillMount = () => {
    const eventId = this.props.match.params.event_id;
    this.setState({ event: this.props.events[eventId] });
  };

  componentWillReceiveProps = nextProps => {
    const eventId = nextProps.match.params.event_id;
    const oldEventId = this.props.match.params.event_id;
    if (
      !_.isEqual(this.props.events, nextProps.events) ||
      eventId !== oldEventId
    ) {
      this.setState({ event: nextProps.events[eventId] });
    }
  };

  handleEventDelete = event => {
    const { deleteEvent, history } = this.props;
    deleteEvent(event);
    history.goBack();
  };

  renderDetails = () => {
    const { event } = this.state;
    return (
      <Tab.Pane eventKey="info">
        <Fieldset label="Details">
          <Row>
            <Col xs={12} sm={4}>
              <div>
                <strong>Time: </strong>
                <p>{event.time}</p>
              </div>
            </Col>
            <Col xs={12} sm={8}>
              <div>
                <strong>Description: </strong>
                <p>{event.description}</p>
              </div>
            </Col>
            <Col xs={12}>
              <div>
                <strong>Ramifications: </strong>
                <p>{event.ramifications}</p>
              </div>
            </Col>
          </Row>
        </Fieldset>
      </Tab.Pane>
    );
  };

  renderImages = () => {
    const { event } = this.state;
    return (
      <Tab.Pane eventKey="images">
        {event.images.length === 1 && (
          <Image src={event.images[0].downloadUrl} responsive />
        )}
        {event.images.length > 1 && (
          <Carousel interval={null}>
            {event.images &&
              event.images.map(image => {
                return (
                  <Carousel.Item key={`event-image-${image.fileName}`}>
                    <Image src={image.downloadUrl} responsive />
                  </Carousel.Item>
                );
              })}
          </Carousel>
        )}
        {!event.images.length && (
          <Image src={require('../assets/placeholder.png')} responsive />
        )}
      </Tab.Pane>
    );
  };

  renderAttachedFiles = () => {
    const { event } = this.state;
    return (
      <Tab.Pane eventKey="attachedFiles">
        {event.attachedFiles &&
          event.attachedFiles.map(file => {
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
    const { event } = this.state;
    const { currentCampaign, history } = this.props;
    const items = [];
    event[stateIds].forEach(collectionKey => {
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
          {!event[stateIds].length && (
            <div>
              You have no related {type}. Please add some to see them here.
            </div>
          )}
          {!!event[stateIds].length && (
            <Col xs={12}>
              <ListSlidein items={items} history={history} />
            </Col>
          )}
        </Row>
      </Tab.Pane>
    );
  };

  renderNotes = () => {
    const { event } = this.state;
    return (
      <Tab.Pane eventKey="notes">
        <Notes noteIds={event.noteIds} typeId={event.id} type="events" />
      </Tab.Pane>
    );
  };

  renderEventForm = () => {
    const { event, eventFormOpen } = this.state;
    return (
      <Modal
        show={eventFormOpen}
        onHide={this.hideEventForm}
        bsSize="lg"
        aria-labelledby="event-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="event-modal-title-lg">Edit {event.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EventForm
            event={event}
            onCancel={this.hideEventForm}
            onSubmit={this.hideEventForm}
            formAction={'edit'}
          />
        </Modal.Body>
      </Modal>
    );
  };

  showEventForm = e => {
    e.preventDefault();
    this.setState({ eventFormOpen: true });
  };

  hideEventForm = () => {
    this.setState({ eventFormOpen: false });
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
        <NavItem eventKey="events">
          <span>
            <Glyphicon
              bsSize="large"
              className="margin-right-1"
              glyph="calendar"
            />
            <span>Events</span>
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
    const { event } = this.state;
    if (!event) return null;
    return (
      <Grid className="app-container">
        {this.renderEventForm()}
        <Row className="margin-bottom-1">
          <Col xs={9}>
            <h3>{event.name}</h3>
          </Col>
          <Col xs={2}>
            <Button
              className="margin-left-1 vert-text-top"
              bsSize="small"
              bsStyle="warning"
              onClick={this.showEventForm}
            >
              <Glyphicon glyph="pencil" />
            </Button>
            <Button
              className="margin-left-1 vert-text-top"
              bsSize="small"
              bsStyle="danger"
              onClick={() => this.handleEventDelete(event)}
            >
              <Glyphicon glyph="trash" />
            </Button>
          </Col>
        </Row>
        <Tab.Container id="event-tabs" defaultActiveKey="images">
          <Row>
            <Col xs={2}>{this.renderPills()}</Col>
            <Col xs={9} className="object-content">
              <Tab.Content animation>
                {this.renderImages()}
                {this.renderDetails()}
                {this.renderNotes()}
                {this.renderAttachedFiles()}
                {this.renderObject('places', 'placeIds', 'place', 'type')}
                {this.renderObject('npcs', 'npcIds', 'npc', 'race')}
                {this.renderObject('quests', 'questIds', 'quest', 'status')}
                {this.renderObject('events', 'eventIds', 'event', 'name')}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Grid>
    );
  }
}

Event.defaultProps = {};
Event.propTypes = {};
const mapStateToProps = state => ({
  events: state.events.all,
  quests: state.quests.all,
  npcs: state.npcs.all,
  places: state.places.all,
  currentCampaign: state.campaigns.currentCampaign
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteEvent: EventActions.deleteEvent
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Event);

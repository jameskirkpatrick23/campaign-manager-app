import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  FormGroup,
  InputGroup,
  Glyphicon,
  FormControl,
  Grid,
  Button
} from 'react-bootstrap';

class EventPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      formattedEvents: {}
    };
  }

  filteredEventKeys = () => {
    const { searchTerm } = this.state;
    const { events, tags, notes } = this.props;
    const searchTerms = searchTerm.split(' ').map(st => st.toLowerCase());
    const doesInclude = (object, stateKey, term) => {
      return object && object[stateKey].toLowerCase().includes(term);
    };
    const includesRelated = (object, term) => {
      return (
        object.tagIds.find(tagId =>
          tags[tagId].name.toLowerCase().includes(term)
        ) ||
        object.noteIds.find(
          noteId =>
            notes[noteId].title.toLowerCase().includes(term) ||
            notes[noteId].description.toLowerCase().includes(term)
        )
      );
    };
    return Object.keys(events).filter(eventId =>
      searchTerms.every(
        st =>
          doesInclude(events[eventId], 'name', st) ||
          doesInclude(events[eventId], 'description', st) ||
          doesInclude(events[eventId], 'time', st) ||
          doesInclude(events[eventId], 'ramifications', st) ||
          includesRelated(events[eventId], st)
      )
    );
  };

  formatEvents = props => {
    const { events, currentCampaign } = props;
    const eventKeys = this.filteredEventKeys();
    const foundEvents = {};
    eventKeys.forEach(eventKey => {
      if (events[eventKey].campaignIds.includes(currentCampaign.id)) {
        foundEvents[eventKey] = events[eventKey];
      }
    });
    return foundEvents;
  };

  componentDidMount() {
    this.setState({ formattedEvents: this.formatEvents(this.props) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.events !== this.props.events) {
      this.setState({ formattedEvents: this.formatEvents(nextProps) });
    }
  }

  renderEvents() {
    const { currentCampaign } = this.props;
    const { formattedEvents } = this.state;
    return Object.keys(formattedEvents).map(key => {
      const event = formattedEvents[key];
      let url = event.images[0]
        ? event.images[0].downloadUrl
        : require('../assets/placeholder.png');
      const eventRoute = `/campaigns/${currentCampaign.id}/home/events/${
        event.id
      }`;
      return (
        <Col key={key} xs={6} sm={4} md={3} className="margin-bottom-1">
          <Image src={url} circle className="collection-image" />
          <Button
            className="collection-item-name"
            bsStyle="primary"
            onClick={() => this.props.history.push(eventRoute)}
          >
            {event.name}
          </Button>
        </Col>
      );
    });
  }

  onSearch = e => {
    this.setState({ searchTerm: e.target.value }, () => {
      this.setState({ formattedEvents: this.formatEvents(this.props) });
    });
  };

  render() {
    const { currentCampaign } = this.props;
    const { searchTerm } = this.state;
    const createEventRoute = `/campaigns/${currentCampaign.id}/home/events/new`;

    return (
      <Grid>
        <Row className="margin-bottom-1">
          <Col xsOffset={4} xs={6}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon
                  style={{ paddingRight: '25px', paddingTop: '10px' }}
                >
                  <Glyphicon glyph="search" />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  onChange={this.onSearch}
                  value={searchTerm}
                  placeholder="Search for tags, keywords, etc."
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={2}>
            <Button onClick={() => this.props.history.push(createEventRoute)}>
              Create
            </Button>
          </Col>
        </Row>
        <Row>{this.renderEvents()}</Row>
      </Grid>
    );
  }
}

EventPage.defaultProps = {};
EventPage.propTypes = {};
const mapStateToProps = state => ({
  events: state.events.all,
  tags: state.tags.all,
  notes: state.notes.all,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(EventPage);

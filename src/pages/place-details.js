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
  Glyphicon
} from 'react-bootstrap';

class PlaceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {}
    };
    this.findRelatedObjects = this.findRelatedObjects.bind(this);
    this.renderLocationHistory = this.renderLocationHistory.bind(this);
  }

  findRelatedObjects = () => {
    return false;
  };

  componentDidMount = () => {
    const placeId = this.props.match.params.place_id;
    this.setState({ place: this.props.places[placeId] }, () => {
      this.findRelatedObjects(this.props);
    });
  };

  componentWillReceiveProps = nextProps => {
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

  render() {
    const { place } = this.state;
    return (
      <Grid>
        <Row>
          <Col md={8}>
            <Panel bsStyle="info">
              <Panel.Heading>
                <Panel.Title componentClass="h3">{place.name}</Panel.Title>
              </Panel.Heading>
              <Tab.Container id="place-tabs" defaultActiveKey="images">
                <Panel.Body>
                  <Row className="margin-bottom-1">
                    <Col
                      xs={12}
                      style={{ maxHeight: '500px', overflowY: 'scroll' }}
                    >
                      <Tab.Content animation>
                        <Tab.Pane eventKey="images">
                          <Carousel interval={null}>
                            {place.images &&
                              place.images.map(image => {
                                return (
                                  <Carousel.Item
                                    key={`place-image-${image.fileName}`}
                                  >
                                    <Image src={image.downloadUrl} responsive />
                                  </Carousel.Item>
                                );
                              })}
                          </Carousel>
                        </Tab.Pane>
                        {this.renderLocationHistory()}
                      </Tab.Content>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Nav bsStyle="pills">
                        <NavItem eventKey="images">
                          <Glyphicon glyph="picture" />
                        </NavItem>
                        <NavItem eventKey="location-history">
                          <Glyphicon glyph="globe" />
                        </NavItem>
                        <NavItem eventKey="tiles">
                          <Glyphicon glyph="th-large" />
                        </NavItem>
                        <NavItem eventKey="notes">
                          <Glyphicon glyph="comment" />
                        </NavItem>
                      </Nav>
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

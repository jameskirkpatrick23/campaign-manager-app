import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Panel,
  PanelGroup,
  Image,
  Row,
  Col,
  Grid,
  Button
} from 'react-bootstrap';

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formattedPlaces: {
        places: {}
      }
    };
    this.formatPlacesByType = this.formatPlacesByType.bind(this);
  }

  formatPlacesByType(props) {
    const placeTypes = { ...props.placeTypes };
    Object.keys(placeTypes).forEach(placeTypeKey => {
      const foundPlaceType = placeTypes[placeTypeKey];
      foundPlaceType.places = {};
      Object.keys(props.places).forEach(placeKey => {
        if (props.places[placeKey].type === foundPlaceType.name) {
          foundPlaceType.places[placeKey] = props.places[placeKey];
        }
      });
    });
    return placeTypes;
  }

  componentDidMount() {
    this.setState({ formattedPlaces: this.formatPlacesByType(this.props) });
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.places !== this.props.places ||
      nextProps.placeTypes !== this.props.placeTypes
    ) {
      this.setState({ formattedPlaces: this.formatPlacesByType(nextProps) });
    }
  }

  renderPlaceTypes() {
    const { formattedPlaces } = this.state;
    return Object.keys(formattedPlaces).map((placeKey, index) => {
      return (
        <Row key={placeKey} className="margin-bottom-1">
          <Col xs={12}>
            <Panel
              defaultExpanded
              id={`Place-Panel-${formattedPlaces[placeKey].name}`}
              eventKey={`place-panel-${index}`}
              bsStyle="primary"
            >
              <Panel.Heading>
                <Panel.Toggle
                  style={{ textDecoration: 'none', color: 'white' }}
                >
                  <Panel.Title>{formattedPlaces[placeKey].name}</Panel.Title>
                </Panel.Toggle>
              </Panel.Heading>
              <Panel.Collapse>
                <Panel.Body>
                  {this.renderPlaces(formattedPlaces[placeKey].places)}
                </Panel.Body>
              </Panel.Collapse>
            </Panel>
          </Col>
        </Row>
      );
    });
  }

  renderPlaces(places) {
    const { currentCampaign } = this.props;
    if (!places)
      return (
        <Col>
          <p>No Places for this type</p>
        </Col>
      );

    return Object.keys(places).map(key => {
      const place = places[key];
      const placeRoute = `/campaigns/${currentCampaign.id}/home/places/${key}`;
      return (
        <Col xs={4} md={3} key={`place-${key}`}>
          <Panel
            bsStyle="info"
            className="place-card clickable"
            onClick={() => this.props.history.push(placeRoute)}
          >
            <Panel.Heading>
              <Panel.Title componentClass="h3">{place.name}</Panel.Title>
            </Panel.Heading>
            <Panel.Body className="padding-0">
              <Image
                src={
                  place.images[0].downloadUrl ||
                  require('../assets/placeholder-location.png')
                }
              />
            </Panel.Body>
          </Panel>
        </Col>
      );
    });
  }

  render() {
    const { currentCampaign } = this.props;
    const createPlaceRoute = `/campaigns/${currentCampaign.id}/home/places/new`;
    return (
      <Grid>
        <Row className="margin-bottom-1">
          <Col xs={4} xsOffset={8}>
            <Button onClick={() => this.props.history.push(createPlaceRoute)}>
              Create
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <PanelGroup id="place-panel-group">
              {this.renderPlaceTypes()}
            </PanelGroup>
          </Col>
        </Row>
      </Grid>
    );
  }
}

Places.defaultProps = {};
Places.propTypes = {};

const mapStateToProps = state => ({
  places: state.places.all,
  placeTypes: state.places.types,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(Places);

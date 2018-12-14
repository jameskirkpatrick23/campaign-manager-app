import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Panel,
  PanelGroup,
  Image,
  Row,
  Col,
  Grid,
  Button,
  FormGroup,
  InputGroup,
  FormControl,
  Glyphicon
} from 'react-bootstrap';

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      formattedPlaces: {
        places: {}
      }
    };
    this.formatPlacesByType = this.formatPlacesByType.bind(this);
    this.getPlaceImage = this.getPlaceImage.bind(this);
  }

  formatPlacesByType(props) {
    const { places, placeTypes, currentCampaign } = props;
    const usedPlaceTypes = {};
    const usedPlaceTypeKeys = Object.keys(places).map(place =>
      Object.keys(placeTypes).find(
        pt => placeTypes[pt].name === places[place].type
      )
    );
    usedPlaceTypeKeys.forEach(
      placeKey => (usedPlaceTypes[placeKey] = placeTypes[placeKey])
    );
    usedPlaceTypeKeys.forEach(placeTypeKey => {
      const foundPlaceType = usedPlaceTypes[placeTypeKey];
      foundPlaceType.places = {};
      const placeKeys = this.getFilteredPlaceKeys();
      placeKeys.forEach(placeKey => {
        if (places[placeKey].campaignIds.includes(currentCampaign.id)) {
          if (places[placeKey].type === foundPlaceType.name) {
            foundPlaceType.places[placeKey] = places[placeKey];
          }
        }
      });
    });
    return usedPlaceTypes;
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

  renderPlaceTypes = () => {
    const { formattedPlaces } = this.state;
    return Object.keys(formattedPlaces).map((placeKey, index) => {
      return (
        <Row key={placeKey} className="margin-bottom-1">
          <Col xs={12}>
            <Panel
              defaultExpanded
              id={`Place-Panel-${formattedPlaces[placeKey].name}`}
              eventKey={`place-panel-${index}`}
              bsStyle="default"
            >
              <Panel.Heading>
                <Panel.Toggle
                  style={{ textDecoration: 'none', color: 'black' }}
                >
                  <Panel.Title>{formattedPlaces[placeKey].name}</Panel.Title>
                </Panel.Toggle>
              </Panel.Heading>
              <Panel.Collapse>
                <Panel.Body className="padding-bottom-0">
                  {this.renderPlaces(formattedPlaces[placeKey].places)}
                </Panel.Body>
              </Panel.Collapse>
            </Panel>
          </Col>
        </Row>
      );
    });
  };

  getPlaceImage = place => {
    if (place.images.length) {
      return place.images[0].downloadUrl;
    }
    return require('../assets/placeholder.png');
  };

  renderPlaces = places => {
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
        <Col
          xs={6}
          sm={4}
          md={3}
          key={`place-${key}`}
          className="margin-bottom-2"
        >
          <Image
            src={this.getPlaceImage(place)}
            circle
            className="collection-image"
          />
          <Button
            className="collection-item-name"
            bsStyle="primary"
            onClick={() => this.props.history.push(placeRoute)}
          >
            {place.name}
          </Button>
        </Col>
      );
    });
  };

  onSearch = e => {
    this.setState({ searchTerm: e.target.value }, () => {
      this.setState({ formattedQuests: this.formatPlacesByType(this.props) });
    });
  };

  getFilteredPlaceKeys = () => {
    const { searchTerm } = this.state;
    const { places, placeTypes, tags, notes } = this.props;
    const searchTerms = searchTerm.split(' ').map(st => st.toLowerCase());
    const doesInclude = (object, stateKey, term) => {
      return object && object[stateKey].toLowerCase().includes(term);
    };
    const includesRelated = (object, term) => {
      return (
        Object.keys(placeTypes).find(
          placeType =>
            placeTypes[placeType].name.toLowerCase() === term &&
            object.type === placeTypes[placeType]
        ) ||
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
    return Object.keys(places).filter(placeId =>
      searchTerms.every(
        st =>
          doesInclude(places[placeId], 'history', st) ||
          doesInclude(places[placeId], 'location', st) ||
          doesInclude(places[placeId], 'name', st) ||
          doesInclude(places[placeId], 'type', st) ||
          doesInclude(places[placeId], 'insideDescription', st) ||
          doesInclude(places[placeId], 'outsideDescription', st) ||
          includesRelated(places[placeId], st)
      )
    );
  };

  render() {
    const { currentCampaign } = this.props;
    const { searchTerm } = this.state;
    const createPlaceRoute = `/campaigns/${currentCampaign.id}/home/places/new`;
    return (
      <Grid className="app-container">
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
            <Button onClick={() => this.props.history.push(createPlaceRoute)}>
              Create
            </Button>
          </Col>
        </Row>
        <Row className="object-content">
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
  notes: state.notes.all,
  tags: state.tags.all,
  placeTypes: state.places.types,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(Places);

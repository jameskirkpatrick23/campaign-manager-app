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
  FormGroup,
  ControlLabel,
  Glyphicon
} from 'react-bootstrap';
import { DropdownList } from 'react-widgets';
import Floors from './floors';

class PlaceDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      place: {},
      numRows: 1,
      numCols: 1,
      numFloors: 1
    };
    this.findRelatedObjects = this.findRelatedObjects.bind(this);
    this.renderLocationHistory = this.renderLocationHistory.bind(this);
    this.renderImages = this.renderImages.bind(this);
    // this.renderTileModifier = this.renderTileModifier.bind(this);
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
        <NavItem eventKey="tiles">
          <Glyphicon glyph="th-large" />
        </NavItem>
        <NavItem eventKey="notes">
          <Glyphicon glyph="comment" />
        </NavItem>
      </Nav>
    );
  };

  // getTileSize = (columns) => {
  //   let numColumns = 12;
  //   switch(columns) {
  //     case 1:
  //       numColumns = 12;
  //       break;
  //     case 2:
  //       numColumns = 6;
  //       break;
  //     case 3:
  //       numColumns = 4;
  //       break;
  //     case 4:
  //       numColumns = 3;
  //       break;
  //     case 5:
  //     case 6:
  //       numColumns = 2;
  //       break;
  //     default:
  //       numColumns = 1;
  //       break;
  //   }
  //   return numColumns;
  // };
  //
  // renderTileRowCols = (floorNumber) => {
  //   const { place, numCols, numRows } = this.state;
  //   const cols = Array.from(Array(numCols).keys());
  //   const rows = Array.from(Array(numRows).keys());
  //   return rows.map(rowNumber => {
  //     return <Row key={`floor-${floorNumber}-row-${rowNumber}`}>
  //       {cols.map(colNumber => {
  //         return <Col key={`floor-${floorNumber}-row-${rowNumber}-col-${colNumber}`} xs={this.getTileSize(cols.length)}>
  //           <div style={{height: 75, width: 75, margin: 10, backgroundColor: 'grey'}} />
  //         </Col>
  //       })}
  //     </Row>
  //   })
  // };
  //
  // renderTiles = () => {
  //   const { numFloors } = this.state;
  //   const floors = Array.from(Array(numFloors).keys());
  //
  //   return floors.map(floorNumber => {
  //     return <PanelGroup
  //       accordion
  //       id="floorPanel"
  //       defaultActiveKey="floor-1"
  //       key={`floor-${floorNumber}`}
  //     >
  //       <Panel
  //         id={'place-panel-location'}
  //         bsStyle="warning"
  //         eventKey={`floor-${floorNumber + 1}`}
  //       >
  //         <Panel.Heading>
  //           <Panel.Toggle style={{ textDecoration: 'none' }}>
  //             <Panel.Title componentClass="h3">Floor {floorNumber + 1}</Panel.Title>
  //           </Panel.Toggle>
  //         </Panel.Heading>
  //         <Panel.Collapse>
  //           <Panel.Body>
  //             {this.renderTileRowCols()}
  //           </Panel.Body>
  //         </Panel.Collapse>
  //       </Panel>
  //     </PanelGroup>
  //   });
  // };
  //
  // renderTileModifier = () => {
  //   const options = [1,2,3,4,5,6];
  //   return <Tab.Pane eventKey="tiles">
  //     <Row>
  //       <Col xs={4}>
  //         <FormGroup>
  //           <ControlLabel>Number of Floors</ControlLabel>
  //           <DropdownList
  //             id="num-floors"
  //             data={options}
  //             value={this.state.numFloors}
  //             placeholder="Number of Floors"
  //             onChange={dataItem => this.setState({ numFloors: dataItem })}
  //           />
  //         </FormGroup>
  //       </Col>
  //       <Col xs={4}>
  //         <FormGroup>
  //           <ControlLabel>Number of Rows</ControlLabel>
  //           <DropdownList
  //             id="num-rows"
  //             data={options}
  //             value={this.state.numRows}
  //             placeholder="Number of Rows"
  //             onChange={dataItem => this.setState({ numRows: dataItem })}
  //           />
  //         </FormGroup>
  //       </Col>
  //       <Col xs={4}>
  //         <FormGroup>
  //           <ControlLabel>Number of Columns</ControlLabel>
  //           <DropdownList
  //             id="num-cols"
  //             data={options}
  //             value={this.state.numCols}
  //             placeholder="Number of Columns"
  //             onChange={dataItem => this.setState({ numCols: dataItem })}
  //           />
  //         </FormGroup>
  //       </Col>
  //     </Row>
  //     <Row>
  //       <Col xs={12}>
  //         {this.renderTiles()}
  //       </Col>
  //     </Row>
  //   </Tab.Pane>
  // };

  renderFloors = () => {
    const { place } = this.state;
    return <Floors place={place} />;
  };

  render() {
    const { place } = this.state;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
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
                        {this.renderImages()}
                        {this.renderLocationHistory()}
                        {/*{this.renderFloors()}*/}
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Modal, Panel, Glyphicon } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as FloorActions from '../redux/actions/floors';
import FloorForm from '../forms/floor-form';
import Spinner from '../reusable-components/spinner';
import Tiles from '../page-components/tiles';

class Floors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFloors: {},
      floor: {},
      floorFormOpen: false,
      isReorderingTiles: false,
      swappingFromTile: {},
      handlingTileSwap: false,
      tileFormOpen: false,
      selectedFloor: { tiles: {} },
      selectedRow: 1,
      selectedCol: 1
    };
    this.renderFloor = this.renderFloor.bind(this);
    this.showFloorForm = this.showFloorForm.bind(this);
    this.hideFloorForm = this.hideFloorForm.bind(this);
    this.setSelectedFloors = this.setSelectedFloors.bind(this);
    this.handleTileSwap = this.handleTileSwap.bind(this);
  }

  setSelectedFloors = props => {
    const { place, floors } = props;
    const selectedFloors = {};
    place.floorIds &&
      place.floorIds.map(floorId => {
        selectedFloors[floorId] = floors[floorId];
      });
    this.setState({ selectedFloors });
  };

  componentDidMount = () => {
    this.setSelectedFloors(this.props);
  };

  componentWillReceiveProps = nextProps => {
    if (
      this.props.place.floorIds !== nextProps.place.floorIds ||
      this.props.floors !== nextProps.floors
    ) {
      this.setSelectedFloors(nextProps);
    }
  };

  showFloorForm = (e, floor) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ floorFormOpen: true, floor });
  };

  hideFloorForm = () => {
    this.setState({ floorFormOpen: false, floor: {} });
  };

  handleTileSwap = tileInfo => {
    if (
      !Object.keys(this.state.swappingFromTile).length &&
      this.state[`isReordering${tileInfo.floor.id}Tiles`]
    ) {
      this.setState({ swappingFromTile: { ...tileInfo } });
    } else {
      const { row, col, floor } = this.state.swappingFromTile;
      const self = this;
      if (floor.id === tileInfo.floor.id) {
        const currentTileArrangement = { ...tileInfo.floor.tiles };
        //set the new tile to the old tile you are swapping from
        currentTileArrangement[`${tileInfo.row}${tileInfo.col}`] =
          floor.tiles[`${row}${col}`];
        //now set the old index to the swapping to tile
        currentTileArrangement[`${row}${col}`] =
          floor.tiles[`${tileInfo.row}${tileInfo.col}`] || {};
        this.setState({ handlingTileSwap: true }, () => {
          self.props
            .updateTiles(floor, currentTileArrangement)
            .then(res => {
              self.setState({
                swappingFromTile: {},
                handlingTileSwap: false
              });
            })
            .catch(err => {
              console.error('Error when writing doc', err);
            });
        });
      }
    }
  };

  toggleTileRearrange = (e, floor) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      [`isReordering${floor.id}Tiles`]: !this.state[
        `isReordering${floor.id}Tiles`
      ],
      swappingFromTile: {}
    });
  };

  renderReorderInstructions = floor => {
    if (this.state[`isReordering${floor.id}Tiles`]) {
      return (
        <Row className="bg-info padding-vertical-1">
          <Row className="padding-horizontal-1">
            <Col xs={12}>
              <p>
                To reorder your tiles, please click the tile you wish to move
                first, then the tile you wish to switch it's position with
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <Button
                className="margin-left-1 vert-text-top"
                bsStyle="info"
                onClick={() =>
                  this.setState({ [`isReordering${floor.id}Tiles`]: false })
                }
              >
                Finished
              </Button>
            </Col>
          </Row>
        </Row>
      );
    }
  };

  renderFloor = floor => {
    const { deleteFloor } = this.props;
    return (
      <div key={floor.id}>
        <Panel bsStyle="warning" defaultExpanded={false}>
          <Panel.Heading>
            <Panel.Toggle style={{ textDecoration: 'none' }}>
              <Panel.Title componentClass="h3">
                {floor.name}
                <Button
                  className="margin-left-1 vert-text-top"
                  bsSize="small"
                  bsStyle="info"
                  onClick={e => this.toggleTileRearrange(e, floor)}
                >
                  <Glyphicon glyph="th-large" />
                </Button>
                <Button
                  className="margin-left-1 vert-text-top"
                  bsSize="small"
                  bsStyle="warning"
                  onClick={e => this.showFloorForm(e, floor)}
                >
                  <Glyphicon glyph="pencil" />
                </Button>
                <Button
                  className="margin-left-1 vert-text-top"
                  bsSize="small"
                  bsStyle="danger"
                  onClick={() => deleteFloor(floor.id)}
                >
                  <Glyphicon glyph="trash" />
                </Button>
              </Panel.Title>
            </Panel.Toggle>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              {this.renderReorderInstructions(floor)}
              <Row className="margin-bottom-1">
                <Col xs={12}>
                  <p>{floor.description}</p>
                </Col>
              </Row>
              <Row className="margin-bottom-1">
                <Col xs={12}>
                  <Tiles
                    {...this.state}
                    floor={floor}
                    handleTileSwap={this.handleTileSwap}
                  />
                </Col>
              </Row>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  };

  renderFloorForm = () => {
    const { place } = this.props;
    const { floor, floorFormOpen } = this.state;
    const action = Object.keys(floor).length ? 'edit' : 'create';
    return (
      <Modal
        show={floorFormOpen}
        onHide={this.hideFloorForm}
        bsSize="lg"
        aria-labelledby="floor-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="floor-modal-title-lg">
            Create a new Floor
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloorForm
            placeId={place.id}
            onCancel={this.hideFloorForm}
            formAction={action}
            floor={floor}
          />
        </Modal.Body>
      </Modal>
    );
  };

  render() {
    const { place } = this.props;
    const { selectedFloors, handlingTileSwap } = this.state;
    const hasFloors = Object.keys(selectedFloors).length;
    return (
      <Row>
        <Col xs={12}>
          <Button
            onClick={e => this.showFloorForm(e, {})}
            className="margin-bottom-1"
          >
            Create Floor
          </Button>
          <Spinner show={handlingTileSwap} />
          {this.renderFloorForm()}
          {!hasFloors && (
            <p>{place.name} does not have a layout, please create one</p>
          )}
          {!!hasFloors &&
            Object.keys(selectedFloors).map(floor => {
              return this.renderFloor(selectedFloors[floor]);
            })}
        </Col>
      </Row>
    );
  }
}

Floors.defaultProps = {
  floorIds: []
};

Floors.propTypes = {
  floorIds: PropTypes.arrayOf(PropTypes.string)
};

const mapStateToProps = state => ({
  currentCampaign: state.campaigns.currentCampaign,
  floors: state.floors.all
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateTiles: FloorActions.updateTiles,
      deleteFloor: FloorActions.deleteFloor
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Floors);

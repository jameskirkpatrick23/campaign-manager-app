import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Modal, Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import FloorForm from '../forms/floor-form';
import TileForm from '../forms/tile-form';

class Floors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFloors: {},
      floorFormOpen: false,
      tileFormOpen: false,
      selectedFloor: { tiles: {} },
      selectedRow: 1,
      selectedCol: 1
    };
    this.renderFloor = this.renderFloor.bind(this);
    this.showFloorForm = this.showFloorForm.bind(this);
    this.hideFloorForm = this.hideFloorForm.bind(this);
    this.renderTileRowCols = this.renderTileRowCols.bind(this);
    this.setSelectedFloors = this.setSelectedFloors.bind(this);
    this.renderTileModal = this.renderTileModal.bind(this);
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
    if (this.props.place.floorIds !== nextProps.place.floorIds) {
      this.setSelectedFloors(nextProps);
    }
  };

  showFloorForm = () => {
    this.setState({ floorFormOpen: true });
  };

  hideFloorForm = () => {
    this.setState({ floorFormOpen: false });
  };

  openTileForm = (floor, rowNumber, colNumber) => {
    this.setState({
      tileFormOpen: true,
      selectedFloor: floor,
      selectedRow: rowNumber,
      selectedCol: colNumber
    });
  };

  renderTileModal = () => {
    const {
      selectedFloor,
      selectedRow,
      tileFormOpen,
      selectedCol
    } = this.state;
    return (
      <Modal
        show={tileFormOpen}
        onHide={() => this.setState({ tileFormOpen: false })}
        bsSize="lg"
        aria-labelledby="floor-modal-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="floor-modal-title-lg">Modify the tile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TileForm
            tile={selectedFloor.tiles[`${selectedRow}${selectedCol}`]}
            floor={selectedFloor}
            row={selectedRow}
            col={selectedCol}
            onClose={() => this.setState({ tileFormOpen: false })}
          />
        </Modal.Body>
      </Modal>
    );
  };

  renderTileRowCols = floor => {
    const cols = Array.from(Array(floor.rows).keys());
    const rows = Array.from(Array(floor.cols).keys());
    return rows.map(rowNumber => {
      return (
        <Row key={`floor-${floor.name}-row-${rowNumber}`}>
          {cols.map(colNumber => {
            return (
              <Col
                className="margin-vertical-1"
                key={`floor-${floor.name}-row-${rowNumber}-col-${colNumber}`}
                xs={2}
                onClick={() => this.setState({ tileFormOpen: true })}
              >
                <div
                  onClick={() => this.openTileForm(floor, rowNumber, colNumber)}
                  style={{
                    height: 100,
                    width: '100%',
                    backgroundColor: 'grey'
                  }}
                  src=""
                />
              </Col>
            );
          })}
        </Row>
      );
    });
  };

  renderFloor = floor => {
    return (
      <div key={floor.id}>
        <Panel bsStyle="warning" defaultExpanded={false}>
          <Panel.Heading>
            <Panel.Toggle style={{ textDecoration: 'none' }}>
              <Panel.Title componentClass="h3">{floor.name}</Panel.Title>
            </Panel.Toggle>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <Row className="margin-bottom-1">
                <Col xs={12}>{floor.description}</Col>
              </Row>
              <Row className="margin-bottom-1">
                <Col xs={12}>{this.renderTileRowCols(floor)}</Col>
              </Row>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      </div>
    );
  };

  renderFloorForm = () => {
    const { place } = this.props;
    return (
      <Modal
        show={this.state.floorFormOpen}
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
          <FloorForm placeId={place.id} onCancel={this.hideFloorForm} />
        </Modal.Body>
      </Modal>
    );
  };

  render() {
    const { place } = this.props;
    const { selectedFloors } = this.state;
    const hasFloors = Object.keys(selectedFloors).length;
    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={4} xsOffset={8}>
              <Button onClick={this.showFloorForm}>Create</Button>
            </Col>
            {this.renderTileModal()}
            {this.renderFloorForm()}
          </Row>
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
Floors.propTypes = {};

const mapStateToProps = state => ({
  currentCampaign: state.campaigns.currentCampaign,
  floors: state.floors.all
});

export default connect(
  mapStateToProps,
  null
)(Floors);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Modal, Row } from 'react-bootstrap';
import TileForm from '../forms/tile-form';
import Tile from './tile';
import { connect } from 'react-redux';

class Tiles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tileFormOpen: false,
      selectedFloor: props.floor,
      selectedRow: 0,
      selectedCol: 0
    };
    this.handleTileClick = this.handleTileClick.bind(this);
    this.renderTileModal = this.renderTileModal.bind(this);
    this.openTileForm = this.openTileForm.bind(this);
    this.renderTiles = this.renderTiles.bind(this);
  }

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

    const { tiles } = this.props;

    const foundFloorTile = selectedFloor.tiles[`${selectedRow}${selectedCol}`];
    const foundTile = tiles[foundFloorTile.id];

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
            tile={foundTile}
            floor={selectedFloor}
            row={selectedRow}
            col={selectedCol}
            formAction={Object.keys(foundFloorTile).length ? 'edit' : 'create'}
            onClose={() => this.setState({ tileFormOpen: false })}
          />
        </Modal.Body>
      </Modal>
    );
  };

  handleTileClick = (floor, row, col) => {
    if (!this.props[`isReordering${floor.id}Tiles`]) {
      this.openTileForm(floor, row, col);
    } else {
      this.props.handleTileSwap({ floor, row, col });
    }
  };

  renderTiles = () => {
    const { floor, tiles } = this.props;
    const rows = Array.from(Array(floor.rows).keys());
    const cols = Array.from(Array(floor.cols).keys());
    return rows.map(rowNumber => {
      return (
        <Row key={`floor-${floor.name}-row-${rowNumber}`}>
          {cols.map(colNumber => {
            return (
              <Col
                className="margin-vertical-1"
                key={`floor-${floor.name}-row-${rowNumber}-col-${colNumber}`}
                xs={2}
              >
                <Tile
                  tile={tiles[floor.tiles[`${rowNumber}${colNumber}`].id]}
                  onClick={e =>
                    this.handleTileClick(floor, rowNumber, colNumber)
                  }
                />
              </Col>
            );
          })}
        </Row>
      );
    });
  };

  render() {
    return (
      <div className="tiles">
        {this.renderTileModal()}
        {this.renderTiles()}
      </div>
    );
  }
}

Tiles.defaultProps = {};

Tiles.propTypes = {
  floor: PropTypes.shape({}).isRequired,
  handleTileSwap: PropTypes.func
};

const mapStateToProps = state => ({
  tiles: state.tiles.all
});

const TilesContainer = connect(
  mapStateToProps,
  null
)(Tiles);

export default TilesContainer;

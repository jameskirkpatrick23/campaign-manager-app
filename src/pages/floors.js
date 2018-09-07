import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import FloorForm from '../forms/floor-form';

class Floors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFloors: props.place.floors,
      floorFormOpen: false
    };
    this.renderFloor = this.renderFloor.bind(this);
    this.showFloorForm = this.showFloorForm.bind(this);
    this.hideFloorForm = this.hideFloorForm.bind(this);
  }

  showFloorForm = () => {
    this.setState({ floorFormOpen: true });
  };

  hideFloorForm = () => {
    this.setState({ floorFormOpen: false });
  };

  renderFloor = floor => {
    return <div>{floor.description}</div>;
  };

  renderFloorForm = () => {
    const { place } = this.props;
    return (
      <Modal show={this.state.floorFormOpen} onHide={this.hideFloorForm}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new Floor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FloorForm placeId={place.id} />
        </Modal.Body>
      </Modal>
    );
  };

  createFloor = () => {
    console.log('yay');
  };

  render() {
    const { place } = this.props;
    const { floors } = place;
    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={4} xsOffset={8}>
              <Button onClick={() => this.showFloorForm}>Create</Button>
            </Col>
            {this.renderFloorForm()}
          </Row>
          {!floors.length && (
            <p>{place.name} does not have a layout, click here to create one</p>
          )}

          {floors.length &&
            floors.map(floor => {
              return this.renderFloor(floor);
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
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(Floors);

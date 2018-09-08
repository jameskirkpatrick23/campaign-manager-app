import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import FloorForm from '../forms/floor-form';

class Floors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFloors: {},
      floorFormOpen: false
    };
    this.renderFloor = this.renderFloor.bind(this);
    this.showFloorForm = this.showFloorForm.bind(this);
    this.hideFloorForm = this.hideFloorForm.bind(this);
    this.setSelectedFloors = this.setSelectedFloors.bind(this);
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
    const { selectedFloors } = this.state;
    const hasFloors = Object.keys(selectedFloors).length;
    return (
      <Row>
        <Col xs={12}>
          <Row>
            <Col xs={4} xsOffset={8}>
              <Button onClick={() => this.showFloorForm}>Create</Button>
            </Col>
            {this.renderFloorForm()}
          </Row>
          {!hasFloors && (
            <p>{place.name} does not have a layout, please create one</p>
          )}
          {hasFloors &&
            Object.keys(selectedFloors).map(floor => {
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
  currentCampaign: state.campaigns.currentCampaign,
  floors: state.floors.all
});

export default connect(
  mapStateToProps,
  null
)(Floors);

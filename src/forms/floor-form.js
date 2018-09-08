import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from '../components/spinner';
import * as FloorActions from '../redux/actions/floors';
import { Row, Col, Button } from 'react-bootstrap';
import { DropdownList } from 'react-widgets';

class FloorForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.options = [1, 2, 3, 4, 5, 6];
  }

  onSubmit = placeId => {
    this.setState({ isSubmitting: true }, () => {
      this.props.createFloor({ ...this.state, placeId }).then(() => {
        this.setState({ isSubmitting: false });
      });
    });
  };

  render() {
    return (
      <div>
        <Spinner show={this.state.isSubmitting} />
        <form onSubmit={() => this.onSubmit(this.props.placeId)}>
          {/*<editor-fold Name and Desc>*/}
          <Row>
            <Col xs={6}>
              <label htmlFor="#floor-name">
                Name
                <input
                  id="floor-name"
                  type="text"
                  placeholder="What is the name of this floor?"
                  value={this.state.name}
                  required
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </label>
            </Col>
            <Col xs={6}>
              <label htmlFor="#floor-description">
                Description
                <textarea
                  id="floor-description"
                  placeholder="What do characters see, smell, and feel when arriving on this floor?"
                  value={this.state.description}
                  required
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </label>
            </Col>
          </Row>
          {/*</ editor-fold>*/}
          {/*<editor-fold Row and Col>*/}
          <Row>
            <Col xs={6}>
              <label htmlFor="#floor-numRows">
                Rows
                <DropdownList
                  id="floor-numRows"
                  data={this.options}
                  value={this.state.numRows}
                  placeholder="How many rows of tiles are needed for this floor?"
                  onChange={dataItem => this.setState({ numRows: dataItem })}
                />
              </label>
            </Col>
            <Col xs={6}>
              <label htmlFor="#floor-numCols">
                Columns
                <DropdownList
                  id="floor-numCols"
                  data={this.options}
                  value={this.state.numCols}
                  placeholder="How many rows of tiles are needed for this floor?"
                  onChange={dataItem => this.setState({ numCols: dataItem })}
                />
              </label>
            </Col>
          </Row>
          {/*</ editor-fold>*/}
          <Row>
            <Col xs={6}>
              <Button bsStyle="primary" type="submit">
                Submit
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

FloorForm.defaultProps = {};
FloorForm.propTypes = {};

const mapStateToProps = state => ({
  places: state.places.all,
  currentCampaignId: state.campaigns.currentCampaign.id
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createFloor: FloorActions.createFloor
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FloorForm);

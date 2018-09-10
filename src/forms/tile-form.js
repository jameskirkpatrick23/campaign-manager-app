import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

class TileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} sm={6}>
            <Row>
              <Col>
                <img src={this.state.selectedFile} alt="" />
              </Col>
            </Row>
            <Row>
              <Col>
                <input
                  type="file"
                  onChange={e => {
                    this.setState({ selectedFile: e.target.files[0] });
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} sm={6}>
            <Row>
              <Col />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

TileForm.defaultProps = {};
TileForm.propTypes = {};

export default TileForm;

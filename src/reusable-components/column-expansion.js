import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class ColumnExpander extends Component {
  render() {
    const { columns } = this.props;
    return (
      <div className="row expand-column-wrapper">
        {Object.keys(this.props.columns).map(colKey => {
          return (
            <div
              className="column"
              style={{
                backgroundImage: 'url(' + columns[colKey].backgroundImage + ')',
                height: '75vh'
              }}
              key={colKey}
            >
              <div className="expand-column-content">
                <h1 className="columns">{colKey}</h1>
                <div className="columns">
                  <p>{columns[colKey].description}</p>
                </div>
                <div className="columns">
                  <Button
                    bsStyle="primary"
                    onClick={() => {
                      this.props.history.push(columns[colKey].route);
                    }}
                  >
                    Explore
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

ColumnExpander.propTypes = {
  columns: PropTypes.shape({}).isRequired
};

export default withRouter(ColumnExpander);

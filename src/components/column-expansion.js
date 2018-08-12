import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

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
                backgroundImage: 'url(' + columns[colKey].backgroundImage + ')'
              }}
              key={colKey}
            >
              <div className="expand-column-content">
                <h1 className="columns">{colKey}</h1>
                <div className="columns">
                  <p>{columns[colKey].description}</p>
                </div>
                <div className="columns">
                  <button
                    className="button"
                    onClick={() => {
                      this.props.history.push(columns[colKey].route);
                    }}
                  >
                    Explore
                  </button>
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

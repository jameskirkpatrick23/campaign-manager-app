import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import $ from 'jquery';

class ColumnExpander extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: Object.keys(props.columns)[0]
    };
    this.setColumnExpanded = this.setColumnExpanded.bind(this);
  }

  componentDidMount() {
    $('.hoverable-column').hover(
      e => this.setColumnExpanded(e.target.id),
      () => {}
    );
  }

  setColumnExpanded = colKey => {
    this.setState({ expanded: colKey });
  };

  render() {
    const { columns } = this.props;
    const { expanded } = this.state;
    return (
      <div className="row expand-column-wrapper">
        {Object.keys(this.props.columns).map(colKey => {
          return (
            <div
              id={colKey}
              className={`hoverable-column column ${
                expanded === colKey ? 'clicked' : ''
              }`}
              onClick={() => this.setColumnExpanded(colKey)}
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

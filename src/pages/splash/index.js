import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';

class Splash extends Component {
  render() {
    return (
      <div>
        <div>Yo Dawg</div>
        <Button type={'primary'} href="/login" icon="lock">
          Enter
        </Button>
      </div>
    );
  }
}

Splash.defaultProps = {};
Splash.propTypes = {};

export default withRouter(Splash);

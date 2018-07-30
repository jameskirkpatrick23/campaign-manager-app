import React, { Component } from 'react';
import PropTypes from 'prop-types';

class HeroImage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { header, children, backgroundImage } = this.props;
    return (
      <div
        className="marketing-site-hero"
        style={{ backgroundImage: 'url(' + backgroundImage + ')' }}
      >
        <div className="marketing-site-hero-content">
          <h1>{header}</h1>
          {children}
        </div>
      </div>
    );
  }
}

HeroImage.propTypes = {
  header: PropTypes.string.isRequired,
  backgroundImage: PropTypes.node.isRequired
};

export default HeroImage;

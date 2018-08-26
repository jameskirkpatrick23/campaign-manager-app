import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Carousel from '../components/carousel';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Places extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderPlaces() {
    const { places, currentCampaign } = this.props;
    return Object.keys(places).map(key => {
      const place = places[key];
      return (
        <div className="card" key={key}>
          <Carousel images={place.images} />
          <div className="card-section">
            <h4>{place.name}</h4>
            <div>{place.description}</div>
          </div>
          <Link to={`/campaigns/${currentCampaign.id}/home/places/${place.id}`}>
            See More
          </Link>
        </div>
      );
    });
  }

  render() {
    const { currentCampaign } = this.props;
    return (
      <div>
        <Link
          className="button round"
          to={`/campaigns/${currentCampaign.id}/home/places/new`}
        >
          Create a New Place
        </Link>
        <div>I am the text!</div>
        {this.renderPlaces()}
      </div>
    );
  }
}

Places.defaultProps = {};
Places.propTypes = {};

const mapStateToProps = state => ({
  places: state.places.all,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(Places);

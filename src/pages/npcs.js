import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class NPCPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderNpcs() {
    const { npcs, currentCampaign } = this.props;
    return Object.keys(npcs).map(key => {
      const npc = npcs[key];
      return (
        <div className="card" key={key}>
          <img src={npc.avatar} alt={`${npc.name} Avatar`} />
          <div className="card-section">
            <h4>{npc.name}</h4>
            <div>{npc.description}</div>
          </div>
          <Link to={`/campaigns/${currentCampaign.id}/home/npcs/${npc.id}`}>
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
          to={`/campaigns/${currentCampaign.id}/home/npcs/new`}
        >
          Create a new NPC
        </Link>
        <div>I am the text!</div>
        {this.renderNpcs()}
      </div>
    );
  }
}

NPCPage.defaultProps = {};
NPCPage.propTypes = {};
const mapStateToProps = state => ({
  npcs: state.npcs.all,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(NPCPage);

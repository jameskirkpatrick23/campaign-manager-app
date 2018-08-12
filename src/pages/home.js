import React, { Component } from 'react';
import { connect } from 'react-redux';
import ColumnExpander from '../components/column-expansion';
import NPCImage from '../assets/npcImages.png';
import QuestsImage from '../assets/dnd-adventure-1.jpeg';
import TownsImage from '../assets/Neverwinter_cityscape.jpg';

class Home extends Component {
  constructor(props) {
    super(props);
    this.mainColumns = {
      "NPC's": {
        route: `/campaigns/${props.currentCampaign.id}/npcs`,
        backgroundImage: NPCImage,
        description: 'Manage the characters within your universe.'
      },
      Places: {
        route: `/campaigns/${props.currentCampaign.id}/places`,
        backgroundImage: TownsImage,
        description: 'Manage the towns within your universe.'
      },
      Quests: {
        route: `/campaigns/${props.currentCampaign.id}/quests`,
        backgroundImage: QuestsImage,
        description:
          'Manage the quests your heroes undertake within your universe.'
      }
    };
  }

  render() {
    return (
      <div>
        <ColumnExpander columns={this.mainColumns} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(Home);

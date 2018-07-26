import React, { Component } from 'react';
import ColumnExpander from '../components/column-expansion';
import NPCImage from '../assets/npcImages.png';
import CampaignImage from '../assets/campaign-image.jpg';
import QuestsImage from '../assets/dnd-adventure-1.jpeg';
import TownsImage from '../assets/Neverwinter_cityscape.jpg';

class Home extends Component {
  constructor(props) {
    super(props);
    this.mainColumns = {
      Campaigns: {
        route: '/campaigns',
        backgroundImage: CampaignImage,
        description: 'Manage your campaigns, and the players in them.'
      },
      "NPC's": {
        route: '/npcs',
        backgroundImage: NPCImage,
        description: 'Manage the characters within your universe.'
      },
      Places: {
        route: '/places',
        backgroundImage: TownsImage,
        description: 'Manage the towns within your universe.'
      },
      Quests: {
        route: '/quests',
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

export default Home;

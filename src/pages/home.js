import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColumnExpander from '../components/column-expansion';
import NPCImage from '../assets/npcImages.png';
import QuestsImage from '../assets/dnd-adventure-1.jpeg';
import TownsImage from '../assets/Neverwinter_cityscape.jpg';

class Home extends Component {
  constructor(props) {
    super(props);
    this.mainColumns = {
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

Home.defaultProps = {};
Home.propTypes = {};

export default Home;

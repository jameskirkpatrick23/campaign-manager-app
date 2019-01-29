import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ColumnExpander from '../reusable-components/column-expansion';
import NPCImage from '../assets/npcImages.png';
import QuestsImage from '../assets/dnd-adventure-1.jpeg';
import EventsImage from '../assets/dnd-adventure-2.jpeg';
import TownsImage from '../assets/Neverwinter_cityscape.jpg';
import { deleteCampaign } from '../redux/actions/campaigns';

class Home extends Component {
  constructor(props) {
    super(props);
    this.mainColumns = {
      "NPC's": {
        route: `/campaigns/${props.currentCampaign.id}/home/npcs`,
        backgroundImage: NPCImage,
        description: 'Manage the characters within your universe.'
      },
      Places: {
        route: `/campaigns/${props.currentCampaign.id}/home/places`,
        backgroundImage: TownsImage,
        description: 'Manage the towns within your universe.'
      },
      Quests: {
        route: `/campaigns/${props.currentCampaign.id}/home/quests`,
        backgroundImage: QuestsImage,
        description:
          'Manage the quests your heroes undertake within your universe.'
      },
      Events: {
        route: `/campaigns/${props.currentCampaign.id}/home/events`,
        backgroundImage: EventsImage,
        description: 'Manage the events that happen in your universe.'
      }
    };
    this.deleteCurrentCampaign = this.deleteCurrentCampaign.bind(this);
  }

  deleteCurrentCampaign() {
    const { deleteCampaign, currentCampaign, history } = this.props;
    deleteCampaign(currentCampaign)
      .then(res => {
        history.push('/campaigns');
      })
      .catch(err => {
        alert('Oh no!' + err);
      });
  }

  render() {
    return (
      <div>
        <button className="button" onClick={this.deleteCurrentCampaign}>
          Delete Campaign
        </button>
        <ColumnExpander columns={this.mainColumns} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentCampaign: state.campaigns.currentCampaign
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deleteCampaign
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

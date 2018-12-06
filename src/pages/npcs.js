import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Row,
  Col,
  Panel,
  Image,
  FormGroup,
  InputGroup,
  Glyphicon,
  FormControl,
  Grid,
  Button
} from 'react-bootstrap';

class NPCPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      formattedNPCs: {}
    };
  }

  filteredNPCKeys = () => {
    const { searchTerm } = this.state;
    const { npcs, tags, notes } = this.props;
    const doesInclude = (object, stateKey) => {
      return (
        object &&
        object[stateKey].toLowerCase().includes(searchTerm.toLowerCase())
      );
    };
    const includesRelated = object => {
      return (
        object.tagIds.find(tagId =>
          tags[tagId].name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        object.noteIds.find(
          noteId =>
            notes[noteId].title
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            notes[noteId].description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      );
    };
    return Object.keys(npcs).filter(
      npcId =>
        doesInclude(npcs[npcId], 'name') ||
        doesInclude(npcs[npcId], 'race') ||
        doesInclude(npcs[npcId], 'occupation') ||
        doesInclude(npcs[npcId], 'gender') ||
        doesInclude(npcs[npcId], 'alignment') ||
        doesInclude(npcs[npcId], 'physDescription') ||
        doesInclude(npcs[npcId], 'backstory') ||
        npcs[npcId].values
          .map(x => x.toLowerCase())
          .includes(searchTerm.toLowerCase()) ||
        npcs[npcId].quirks
          .map(x => x.toLowerCase())
          .includes(searchTerm.toLowerCase()) ||
        includesRelated(npcs[npcId])
    );
  };

  formatNPCs = props => {
    const { npcs, currentCampaign } = props;
    const npcKeys = this.filteredNPCKeys();
    const foundNPCs = {};
    npcKeys.forEach(npcKey => {
      if (npcs[npcKey].campaignIds.includes(currentCampaign.id)) {
        foundNPCs[npcKey] = npcs[npcKey];
      }
    });
    return foundNPCs;
  };

  componentDidMount() {
    this.setState({ formattedNPCs: this.formatNPCs(this.props) });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.npcs !== this.props.npcs) {
      this.setState({ formattedNPCs: this.formatNPCs(nextProps) });
    }
  }

  renderNpcs() {
    const { currentCampaign } = this.props;
    const { formattedNPCs } = this.state;
    return Object.keys(formattedNPCs).map(key => {
      const npc = formattedNPCs[key];
      let url = npc.images[0]
        ? npc.images[0].downloadUrl
        : require('../assets/placeholder.png');
      const npcRoute = `/campaigns/${currentCampaign.id}/home/npcs/${npc.id}`;
      return (
        <Col key={key} xs={4} md={3}>
          <Image src={url} circle className="collection-image" />
          <Button
            className="collection-item-name"
            bsStyle="primary"
            onClick={() => this.props.history.push(npcRoute)}
          >
            {npc.name}
          </Button>
        </Col>
      );
    });
  }

  onSearch = e => {
    this.setState({ searchTerm: e.target.value }, () => {
      this.setState({ formattedNPCs: this.formatNPCs(this.props) });
    });
  };

  render() {
    const { currentCampaign } = this.props;
    const { searchTerm } = this.state;
    const createNPCRoute = `/campaigns/${currentCampaign.id}/home/npcs/new`;

    return (
      <Grid>
        <Row className="margin-bottom-1">
          <Col xsOffset={4} xs={6}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon
                  style={{ paddingRight: '25px', paddingTop: '10px' }}
                >
                  <Glyphicon glyph="search" />
                </InputGroup.Addon>
                <FormControl
                  type="text"
                  onChange={this.onSearch}
                  value={searchTerm}
                  placeholder="Search for tags, keywords, etc."
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={2}>
            <Button onClick={() => this.props.history.push(createNPCRoute)}>
              Create
            </Button>
          </Col>
        </Row>
        <Row>{this.renderNpcs()}</Row>
      </Grid>
    );
  }
}

NPCPage.defaultProps = {};
NPCPage.propTypes = {};
const mapStateToProps = state => ({
  npcs: state.npcs.all,
  notes: state.notes.all,
  tags: state.tags.all,
  currentCampaign: state.campaigns.currentCampaign
});

export default connect(
  mapStateToProps,
  null
)(NPCPage);

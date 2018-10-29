import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Image } from 'react-bootstrap';
import { Multiselect } from 'react-widgets';
import * as TileActions from '../redux/actions/tiles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from '../reusable-components/spinner';

class TileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      downloadUrl: null,
      isSubmitting: false
    };
    this.readURL = this.readURL.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getFormattedQuestObjectives = this.getFormattedQuestObjectives.bind(
      this
    );
  }

  componentWillMount() {
    const { tile } = this.props;
    this.setState({
      selectedFile: null,
      downloadUrl: (tile.image && tile.image.downloadUrl) || null,
      legend: tile.legend || '',
      description: tile.description || '',
      loot: tile.loot || '',
      skillChecks: tile.skillChecks || '',
      other: tile.other || '',
      objectiveIds: tile.objectiveIds || []
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const {
      createTile,
      updateTile,
      onClose,
      formAction,
      row,
      col,
      floor,
      tile
    } = this.props;
    const data = { row, col, floorId: floor.id };
    this.setState({ isSubmitting: true }, () => {
      if (formAction !== 'edit') {
        createTile({ ...this.state, ...data })
          .then(res => {
            onClose(res);
          })
          .catch(err => {
            console.error(
              'Something went wrong while creating your tile',
              err.message
            );
          });
      } else {
        updateTile({ ...this.state, ...data, id: tile.id })
          .then(res => {
            onClose(res);
          })
          .catch(err => {
            console.error(
              'Something went wrong while updating your tile',
              err.message
            );
          });
      }
    });
  }

  readURL = file => {
    const reader = new FileReader();
    reader.onload = e => {
      this.setState({ downloadUrl: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  onFileSelect = e => {
    this.setState({ selectedFile: e.target.files[0] }, () => {
      this.readURL(this.state.selectedFile);
    });
  };

  getFormattedQuestObjectives = () => {
    const { floor, quests } = this.props;
    const potentialObjectives = [];
    floor.questIds.forEach(key => {
      const foundQuest = quests[key];
      Object.keys(foundQuest.objectives).forEach(objectiveKey => {
        potentialObjectives.push({
          name: foundQuest.objectives[objectiveKey].name,
          value: {
            questId: key,
            objectiveId: objectiveKey
          }
        });
      });
    });
    return potentialObjectives;
  };

  render() {
    const { floor, tile } = this.props;
    return (
      <div>
        <Spinner show={this.state.isSubmitting} />
        <form onSubmit={this.onSubmit}>
          <Row>
            <Col xs={12} sm={6}>
              <Row>
                <Col>
                  <label htmlFor="#tile-image">Tile Image</label>
                  <input
                    id="tile-image"
                    type="file"
                    required={!Object.keys(tile)}
                    onChange={this.onFileSelect}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Image src={this.state.downloadUrl} alt="" />
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={6}>
              <Row>
                <Col xs={12}>
                  <label htmlFor="#tile-legend">Legend</label>
                  <textarea
                    rows={2}
                    id="tile-legend"
                    placeholder="Provide an optional legend here for your tile"
                    value={this.state.legend}
                    onChange={e => this.setState({ legend: e.target.value })}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <label htmlFor="#tile-description">Description</label>
                  <textarea
                    rows={2}
                    id="tile-description"
                    placeholder="What do the characters sense when they enter the room?"
                    value={this.state.description}
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <label htmlFor="#tile-loot">Loot or Treasure</label>
                  <textarea
                    rows={2}
                    id="tile-loot"
                    placeholder="What kinds of treasure can be found in this room, and how do they find it?"
                    value={this.state.loot}
                    onChange={e => this.setState({ loot: e.target.value })}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <label htmlFor="#tile-skillChecks">Skill Checks</label>
                  <textarea
                    rows={2}
                    id="tile-skillChecks"
                    placeholder="What skill checks will the characters need to pass, and what do they accomplish?"
                    value={this.state.skillChecks}
                    onChange={e =>
                      this.setState({ skillChecks: e.target.value })
                    }
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <label htmlFor="#tile-other">Other Information</label>
                  <textarea
                    rows={2}
                    id="tile-other"
                    placeholder="What other information is important for this room?"
                    value={this.state.other}
                    onChange={e => this.setState({ other: e.target.value })}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <label htmlFor="#tile-objectives">Quest Objectives</label>
                  {!floor.questIds.length && (
                    <p>
                      The floor does not have any quests associated with it. Add
                      one in order to select objectives.
                    </p>
                  )}
                  {!!floor.questIds.length && (
                    <Multiselect
                      id="tile-objectives"
                      data={this.getFormattedQuestObjectives()}
                      value={this.state.objectiveIds}
                      textField="name"
                      valueField="value"
                      allowCreate={false}
                      placeholder="What objectives can be completed here?"
                      caseSensitive={false}
                      onChange={dataItems =>
                        this.setState({ objectiveIds: dataItems })
                      }
                      minLength={3}
                      filter="contains"
                    />
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xsOffset={8} xs={4}>
              <Button
                className="margin-right-1"
                type="submit"
                bsStyle="primary"
              >
                Submit
              </Button>
              <Button bsStyle="danger" onClick={this.props.onClose}>
                Cancel
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    );
  }
}

TileForm.defaultProps = {
  tile: {
    image: {}
  },
  formAction: 'create',
  createTile: () => {},
  updateTile: () => {}
};

TileForm.propTypes = {
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  formAction: PropTypes.string,
  onClose: PropTypes.func,
  createTile: PropTypes.func,
  updateTile: PropTypes.func,
  floor: PropTypes.shape({}).isRequired,
  tile: PropTypes.shape({}),
  quests: PropTypes.shape({
    objectives: PropTypes.shape({})
  }).isRequired
};

const mapStateToProps = state => ({
  quests: state.quests.all
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createTile: TileActions.createTile,
      updateTile: TileActions.updateTile
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TileForm);

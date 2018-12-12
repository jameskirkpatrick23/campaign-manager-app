import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createCampaign } from '../redux/actions/campaigns';

class CampaignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      image: ''
    };
  }

  onSubmit = e => {
    e.preventDefault();
    const { name, description, image } = this.state;
    this.props
      .createCampaign({
        name,
        description,
        image
      })
      .then(res => {
        this.props.history.push('/campaigns');
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });
  };

  render() {
    const { name, description, image } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="columns">
              <label htmlFor="#campaign-name">
                Name
                <input
                  id="campaign-name"
                  type="text"
                  value={name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="columns">
              <label htmlFor="#campaign-description">
                Description
                <textarea
                  id="campaign-description"
                  value={description}
                  onChange={e => this.setState({ description: e.target.value })}
                />
              </label>
            </div>
          </div>
          <div className="row large-unstack">
            <div className="columns">
              <label htmlFor="#campaign-file">
                Main Image
                <input
                  id="campaign-image"
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ image: e.target.files[0] });
                  }}
                />
                <img src={image} alt={image.name} />
              </label>
            </div>
            <div className="columns">
              <div className="row large-unstack">
                <div className="columns">
                  <button type="submit" className="button expanded">
                    Submit
                  </button>
                </div>
                <div className="columns">
                  <button
                    className="button expanded alert"
                    onClick={e => {
                      e.preventDefault();
                      this.props.history.goBack();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

CampaignForm.defaultProps = {};
CampaignForm.propTypes = {};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createCampaign
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(CampaignForm);

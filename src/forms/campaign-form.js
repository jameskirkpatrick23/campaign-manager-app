import React, { Component } from 'react';
import PropTypes from 'prop-types';
import database, { app } from '../firebase';

class CampaignForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: ''
    };
  }

  onSubmit = e => {
    e.preventDefault();
    const { name, description } = this.state;
    database
      .collection('campaigns')
      .add({
        name,
        creatorId: app.auth().currentUser.uid,
        description
      })
      .then(function() {
        console.log('Document successfully written!');
      })
      .catch(function(error) {
        console.error('Error writing document: ', error);
      });
  };

  render() {
    const { name, description } = this.state;
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="#campaign-name">
            Name
            <input
              id="campaign-name"
              type="text"
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
            />
          </label>
          <label htmlFor="#campaign-description">
            Description
            <textarea
              id="campaign-description"
              value={description}
              onChange={e => this.setState({ description: e.target.value })}
            />
          </label>
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

CampaignForm.defaultProps = {};
CampaignForm.propTypes = {};

export default CampaignForm;

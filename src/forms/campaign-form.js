import React, { Component } from 'react';
import database, { app } from '../firebase';

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
    const storageRef = app.storage().ref();
    const imagesRef = storageRef.child(`campaigns/${image.name}`);

    imagesRef.put(image).then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        database
          .collection('campaigns')
          .add({
            name,
            creatorId: app.auth().currentUser.uid,
            description,
            imageRef: url
          })
          .then(res => {
            this.props.history.push('/campaigns');
            console.log('Document successfully written!');
          })
          .catch(function(error) {
            console.error('Error writing document: ', error);
          });
      });
    });
  };

  render() {
    const { name, description, image } = this.state;
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

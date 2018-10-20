import React, { Component } from 'react';

class Tile extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { tile, onClick } = this.props;
    if (!tile) {
      return <div onClick={onClick} className="blank-tile" />;
    }
    return (
      <img
        src={tile.image.downloadUrl}
        alt={tile.image.fileName}
        onClick={onClick}
        className="image-tile"
      />
    );
  }
}

export default Tile;

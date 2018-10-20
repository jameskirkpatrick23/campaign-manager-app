import React from 'react';

//todo: this needs to be completed when we go to a show page

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <div
        className="orbit"
        role="region"
        aria-label="Favorite Space Pictures"
        data-orbit
        data-options="animInFromLeft:fade-in; animInFromRight:fade-in; animOutToLeft:fade-out; animOutToRight:fade-out;"
      >
        <div className="orbit-wrapper">
          <div className="orbit-controls">
            <button className="orbit-previous">
              <span className="show-for-sr">Previous Slide</span>
              &#9664;&#xFE0E;
            </button>
            <button className="orbit-next">
              <span className="show-for-sr">Next Slide</span>
              &#9654;&#xFE0E;
            </button>
          </div>
          <ul className="orbit-container">
            {this.props.images.map(image => {
              return (
                <li className="orbit-slide">
                  <figure className="orbit-figure">
                    <img
                      className="orbit-image"
                      src={image.url}
                      alt={image.name}
                    />
                    <figcaption className="orbit-caption">
                      {image.description}
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </div>
        <nav className="orbit-bullets">
          <button className="is-active" data-slide="0">
            <span className="show-for-sr">First slide details.</span>
            <span className="show-for-sr">Current Slide</span>
          </button>
          <button data-slide="1">
            <span className="show-for-sr">Second slide details.</span>
          </button>
          <button data-slide="2">
            <span className="show-for-sr">Third slide details.</span>
          </button>
          <button data-slide="3">
            <span className="show-for-sr">Fourth slide details.</span>
          </button>
        </nav>
      </div>
    );
  };
}

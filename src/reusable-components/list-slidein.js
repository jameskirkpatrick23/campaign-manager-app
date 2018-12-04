import React from 'react';
import { Image } from 'react-bootstrap';

const ListSlidein = props => {
  const { items, history } = props;
  return (
    <ul className="mh-menu">
      {Object.keys(items).map(key => {
        return (
          <li
            onClick={() => history.push(items[key].route)}
            key={`${items[key].name}-slidein`}
          >
            <span className="slidein-name">
              <span>{items[key].descriptor}</span>
              <h5>{items[key].name}</h5>
            </span>
            <Image src={items[key].imageURL} alt={`${items[key].name}`} />
          </li>
        );
      })}
    </ul>
  );
};
export default ListSlidein;

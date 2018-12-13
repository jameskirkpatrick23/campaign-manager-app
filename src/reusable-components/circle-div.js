import React from 'react';
const CircleDiv = ({ children, bgColor }) => {
  return <div className={`circle-div bg-${bgColor}`}>{children}</div>;
};
export default CircleDiv;

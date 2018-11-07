import React from 'react';

const FieldSet = props => {
  const { children, label } = props;
  return (
    <div className="fieldset">
      <label className="fieldset-label">{label}</label>
      {children}
    </div>
  );
};
export default FieldSet;

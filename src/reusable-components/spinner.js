import React from 'react';

const Spinner = ({ show }) => {
  if (!show) return null;
  return (
    <div className="full-overlay">
      <div className="multi-spinner-container">
        <div className="multi-spinner">
          <div className="multi-spinner">
            <div className="multi-spinner">
              <div className="multi-spinner">
                <div className="multi-spinner">
                  <div className="multi-spinner" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;

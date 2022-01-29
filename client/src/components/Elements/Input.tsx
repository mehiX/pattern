import React from 'react';

const Input = (props: { value: string | number }) => {
  return (
    <div className="floating-label-group">
      <input
        type="number"
        placeholder="Add number"
        onChange={event => console.log('value changed!')}
      />
      <label className="floating-label"> Add your saving </label>
      {/* <p>// place for errors</p> */}
    </div>
  );
};

export default Input;

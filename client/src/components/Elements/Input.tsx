import React from 'react';

const Input = (props: {
  value?: string | number | null;
  id: string;
  labelName: string;
  inputType: string;
  step?: string;
}) => {
  return (
    <div className="floating-label-group">
      <input
        type={props.inputType}
        id={props.id}
        className="form-control"
        autoFocus
        required
        step={props.step}
      />
      <label className="floating-label">{props.labelName}</label>
    </div>
    // <div className="floating-label-group">
    //   <input
    //     type="number"
    //     placeholder="Add number"
    //     onChange={event => console.log('value changed!')}
    //   />
    //   <label className="floating-label"> Add your saving </label>
    /* <p>// place for errors</p> */
    // </div>
  );
};

export default Input;

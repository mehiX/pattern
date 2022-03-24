import React from 'react';

const Input = (props: {
  value?: string | number | null;
  id: string;
  labelName: string;
  inputType: string;
  step?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
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
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      <label className="floating-label">{props.labelName}</label>
    </div>
  );
};

export default Input;

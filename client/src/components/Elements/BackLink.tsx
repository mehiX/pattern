import React from 'react';
import { Link } from 'react-router-dom';
import chevron from '../../img/icons/chevron-left.svg';

const BackLink = (props: any) => {
  return (
    <div className="backLink">
      <Link to="/">
        <img src={chevron} />
        <span> Back to Home</span>
      </Link>
    </div>
  );
};

export default BackLink;

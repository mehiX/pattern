import React, { useState, useEffect } from 'react';

const TestStepWizard = (props: any) => {
  return (
    <div>
      <h1>{props.step}</h1>
      <button onClick={() => props.goToStep(+props.step -  1)}>Prevuois</button>
      <button onClick={() => props.goToStep(+props.step + 1)}>Next</button>
    </div>
  );
};

export default TestStepWizard;

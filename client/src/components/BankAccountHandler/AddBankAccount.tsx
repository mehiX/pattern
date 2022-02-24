import React, { useState, useEffect } from 'react';
import { FirstStep, SecondStep, ThirdStep } from '..';
import { TestStepWizard } from '..';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import StepWizard from 'react-step-wizard';

const AddBankAccount = (props:any) => {
  const initialStep = props.match ? (props.match.params.step ? props.match.params.step : 1) : 1;
  return (
    <div className="stepWizard">
      <StepWizard initialStep={initialStep}>
        <FirstStep step="1" />
        <SecondStep step="2" />
        <ThirdStep step="3" />
        <TestStepWizard step="4" />
      </StepWizard>
    </div>
  );
};

export default AddBankAccount;

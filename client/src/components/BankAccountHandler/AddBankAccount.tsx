import React, { useState, useEffect } from 'react';
import { FirstStep, SecondStep } from '..';
import { TestStepWizard } from '..';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';

import StepWizard from 'react-step-wizard';

const AddBankAccount = () => {
  return (
    <div className="stepWizard">
      <StepWizard>
        <FirstStep step="1" />
        <SecondStep step="2" />
        <TestStepWizard step="2" />
        <TestStepWizard step="3" />
        <TestStepWizard step="4" />
      </StepWizard>
    </div>
  );
};

export default AddBankAccount;

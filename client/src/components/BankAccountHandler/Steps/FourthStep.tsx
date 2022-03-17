import React, { useEffect, useState } from 'react';
import {
  useItems,
  useAccounts,
  useTransactions,
  useUsers,
  useAssets,
  useLink,
  useCurrentUser,
} from '../../../services';
import Button from 'plaid-threads/Button';
import StepsHandler from '../Steps/StepsHandler';

const FourthStep = (props: any) => {
  return (
    <div className="StepWizardStep">
      <h1>Verify the account balance for -bank-</h1>
      <div className="flex flex-centered data-wrapper">
        <span className='list-title'>Checking account I</span>
        <span className='list-amount'>€XXX,00</span>
      </div>
      <div className="flex flex-centered data-wrapper">
        <span className='list-title'>Checking account II</span>
        <span className='list-amount'>€XX,00</span>
      </div>
      <div className="flex flex-centered data-wrapper">
        <span className='list-title'>Saving account</span>
        <span className='list-amount'>€XXX,00</span>
      </div>
      <div className="flex flex-centered">
        <button
          className="button button-secondary"
          onClick={() => props.goToStep(1)}
        >
          SELECT AGAIN
        </button>
      </div>
      <p>Have you connected all checking accounts for -bank-? </p>
      <StepsHandler amount={3} currentStep={3} goToStep={props.goToStep} />
      <div className="flex flex-centered">
        <button
          className="button button-primary"
          onClick={() => props.goToStep(+props.step + 1)}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default FourthStep;

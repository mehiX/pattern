import { useLink, useTransactions } from '../../../services';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import Input from '../../Elements/Input';
import StepsHandler from './StepsHandler';
import { TransactionsTable } from '../..';

const dummydata = [
  {
    id: 1,
    title: 'Example number 1',
    amount: {
      type: 'positive',
      amount: '450,56',
    },
    datetime: '12-10-1994',
  },
  {
    id: 2,
    title: 'Example number 2',
    amount: {
      type: 'negative',
      amount: '420,56',
    },
    datetime: '13-10-1994',
  },
];

const ThirdStep = (props: any) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsShown, setTransactionsShown] = useState(false);
  const {
    transactionsByAccount,
    getTransactionsByAccount,
    setOwnTransactionById,
    deleteOwnTransactionById,
  } = useTransactions();

  // const { id } =  '3'; //props.account;

  // @@@@@TODO@@@@@: I am using the ID number 1. replace it. JUST FOR TESTING!
  useEffect(() => {
    getTransactionsByAccount(3);
  }, [getTransactionsByAccount, transactionsByAccount, 3]);

  useEffect(() => {
    setTransactions(transactionsByAccount[3] || []);
  }, [transactionsByAccount, 3]);

  ///////////////////////////////////////////////////////

  const handleChangeChk = (id: number, target: any) => {
    const checked = target.checked;
    if (checked) {
      // User just checked the input: add own transaction
      setOwnTransactionById(id);
    } else {
      // User just unckecked the input: remove own transaction
      deleteOwnTransactionById(id);
    }
    console.log(target.checked);
    console.log(id);
  };

  console.log(transactions);

  return (
    <div className="StepWizardStep add-bank-account third-step">
      <h1>Select transactions related to savings for -bank-</h1>
      <p>
        Selecting transactions related to your saving acount is needed to show
        you correct insights
      </p>

      {transactions.map(
        element =>
          element.name.toLowerCase().includes('dinther') && (
            <div className="inputWrapper checkboxWrapper">
              <div className="nameWrapper">
                <input
                  type="checkbox"
                  id={'chekbox_' + element.id}
                  defaultChecked={false}
                  onChange={(event: any) => {
                    handleChangeChk(element.id, event.target as any);
                  }}
                />
                <label htmlFor={'chekbox_' + element.id} title={element.name}>
                  {element.name.length > 60
                    ? element.name.slice(0, 60) + '...'
                    : element.name}
                </label>
              </div>
              <div className="amountWrapper">
                <span>
                  {element.amount.toLocaleString().includes('-') ? '' : '+'}
                  {element.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div>
                <Moment format="YYYY MMM DD">{element.date}</Moment>
              </div>
            </div>
          )
      )}

      <div className="flex flex-centered inputWrapper" />
      <StepsHandler amount={3} currentStep={2} goToStep={props.goToStep} />
      <div className="flex flex-centered">
        <button
          className="button button-primary"
          onClick={() => props.goToStep(+props.step - 1)}
        >
          Previous
        </button>
        <button
          className="button button-primary"
          onClick={() => props.goToStep(+props.step + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ThirdStep;

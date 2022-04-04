import React, { useState, useEffect } from 'react';
import { useTransactions } from '../services';
import Moment from 'react-moment';
import BackLink from './Elements/BackLink';

const SetOwnTransactions = (props: any) => {
  const accountId = props.match
    ? props.match.params.id
      ? props.match.params.id
      : 0
    : 0;

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsShown, setTransactionsShown] = useState(false);
  const {
    transactionsByAccount,
    getTransactionsByAccount,
    setOwnTransactionById,
    deleteOwnTransactionById,
  } = useTransactions();

  useEffect(() => {
    getTransactionsByAccount(accountId);
  }, [getTransactionsByAccount, transactionsByAccount, accountId]);

  useEffect(() => {
    setTransactions(transactionsByAccount[accountId] || []);
  }, [transactionsByAccount, accountId]);

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
    <>
      <BackLink />
      <div className="container set-own-transactions">
        <div className="jublee-container jublee-container-margin-top mb-5">
          <h2>Select your own transaction</h2>
          <p>We require these informations because -- placeholder --</p>
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
                    <label
                      htmlFor={'chekbox_' + element.id}
                      title={element.name}
                    >
                      {element.name.length > 70
                        ? element.name.slice(0, 70) + '...'
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
        </div>
      </div>
    </>
  );
};

export default SetOwnTransactions;

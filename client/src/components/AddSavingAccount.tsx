import React, { useState, useEffect } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import Input from './Elements/Input';
import { useSavingAccounts } from '../services';
import { useAccounts } from '../services';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import savingsAccounts from '../data/dummyData';

import { AccountType, SavingAccountType } from './types';

// Import components and elements
import BackLink from './Elements/BackLink';

const AddSavingAccount = (props: any) => {
  const [accountName, setAccountName] = useState('');
  const [iban, setIban] = useState('');
  const [balance, setBalance] = useState(0);

  const history = useHistory();

  // // Handle savings account state
  // const [savingAccounts, setSavingsAccount] = useState<SavingAccountType[]>([]);
  // const { getSavingAccountsByUser, savingAccountsByUser } = useSavingAccounts();

  // console.log(savingAccounts);
  // console.log(setSavingsAccount);
  // console.log(useSavingAccounts());

  // //   // update data store with the user's savings accounts
  // useEffect(() => {
  //   getSavingAccountsByUser(userId);
  // setSavingAccountsNumber()
  // }, [getSavingAccountsByUser, userId]);

  // useEffect(() => {
  //   // setSavingsAccount(savingAccountsByUser ? savingAccountsByUser[userId] : []);
  //   setSavingsAccount(savingAccountsByUser[userId] || []);
  // }, [savingAccountsByUser, userId]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!accountName || !iban || !balance) {
      toast.error('FIll all the fields before proceeding.');
      return;
    }

    savingsAccounts.push({
      id: 'kbasjbal',
      item_id: '3',
      user_id: '3',
      name: accountName,
      iban: iban,
      bank_name: 'ABN AMRO',
      balance: balance,
      created_at: '',
    });

    toast.success(
      `You successfully add your bank account named ${accountName}.`
    );
    setTimeout(() => {
      history.push(`/`);
    }, 3000);
  };

  return (
    <>
      <BackLink />
      <div className="container">
        <div className="jublee-container jublee-container-margin-top">
          <h2>Add a saving account</h2>
          <p>We require these informations because -- placeholder --</p>
          <form className="row mt-4" onSubmit={handleSubmit}>
            <div className="col-12">
              <Input
                id="account_name"
                inputType="text"
                value={accountName}
                placeholder="Insert here the a name for your saving account. This will help you to identify it!"
                labelName="Account name"
                onChange={e => setAccountName(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-7">
              <Input
                id="iban"
                inputType="text"
                value={iban}
                placeholder="Your Iban"
                labelName="IBAN"
                onChange={e => setIban(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-5">
              <Input
                id="Balance"
                inputType="number"
                step='0.01'
                value={balance}
                placeholder="Your account balance"
                labelName="Balance"
                onChange={e => setBalance(+e.target.value)}
              />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <Button className="button button-primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddSavingAccount;

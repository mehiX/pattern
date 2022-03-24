import React, { useState, useEffect } from 'react';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import Input from './Elements/Input';

const AddSavingAccount = (props: any) => {
  const [accountName, setAccountName] = useState('');
  const [iban, setIban] = useState('');
  const [balance, setBalance] = useState(0);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(accountName);
    console.log(iban);
    console.log(balance);
  };

  return (
    <div className="container">
      <div className="jublee-container jublee-container-margin-top">
        <h2>Add a saving account</h2>
        <p>We require these informations because [insert text]</p>
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
              value={balance}
              placeholder="Your account balance"
              labelName="Balance"
              onChange={e => setBalance(+e.target.value)}
            />
          </div>
          <Button className='button button-primary' type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddSavingAccount;

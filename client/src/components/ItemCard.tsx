import React, { useEffect, useState } from 'react';
import Note from 'plaid-threads/Note';
import Touchable from 'plaid-threads/Touchable';
import { InlineLink } from 'plaid-threads/InlineLink';
import { Callout } from 'plaid-threads/Callout';
import { Institution } from 'plaid/dist/api';

import { ItemType, AccountType } from './types';
import { AccountCard, MoreDetails } from '.';
import {
  useAccounts,
  useInstitutions,
  useItems,
  useTransactions,
} from '../services';
import { setItemToBadState } from '../services/api';
import { diffBetweenCurrentTime } from '../util';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Import helpers
import { capitalize } from 'lodash';

const PLAID_ENV = process.env.REACT_APP_PLAID_ENV || 'sandbox';

interface Props {
  item: ItemType;
  userId: number;
}

const ItemCard = (props: Props) => {
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [institution, setInstitution] = useState<Institution>({
    logo: '',
    name: '',
    institution_id: '',
    oauth: false,
    products: [],
    country_codes: [],
    routing_numbers: [],
  });
  const [showAccounts, setShowAccounts] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsShown, setTransactionsShown] = useState(false);

  const { transactionsByAccount, getTransactionsByAccount } = useTransactions();

  const { accountsByItem } = useAccounts();
  const { deleteAccountsByItemId } = useAccounts();
  const { deleteItemById } = useItems();
  const { deleteTransactionsByItemId } = useTransactions();
  const {
    institutionsById,
    getInstitutionById,
    formatLogoSrc,
  } = useInstitutions();
  const { id, plaid_institution_id, status } = props.item;
  const isSandbox = PLAID_ENV === 'sandbox';
  const isGoodState = status === 'good';

  useEffect(() => {
    const itemAccounts: AccountType[] = accountsByItem[id];
    setAccounts(itemAccounts || []);
  }, [accountsByItem, id]);

  useEffect(() => {
    setInstitution(institutionsById[plaid_institution_id] || {});
  }, [institutionsById, plaid_institution_id]);

  useEffect(() => {
    getInstitutionById(plaid_institution_id);
  }, [getInstitutionById, plaid_institution_id]);

  const handleSetBadState = () => {
    setItemToBadState(id);
  };
  const handleDeleteItem = () => {
    deleteItemById(id, props.userId);
    deleteAccountsByItemId(id);
    deleteTransactionsByItemId(id);
  };

  const cardClassNames = showAccounts
    ? 'card item-card expanded'
    : 'card item-card';

  // Transactions
  const toggleShowTransactions = () => {
    setTransactionsShown(shown => !shown);
  };

  useEffect(() => {
    getTransactionsByAccount(id);
  }, [getTransactionsByAccount, transactionsByAccount, id]);

  useEffect(() => {
    setTransactions(transactionsByAccount[id] || []);
  }, [transactionsByAccount, id]);
  return (
    <div className="box">
      <div className={cardClassNames}>
        <Touchable
          className="item-card__clickable"
          onClick={() => setShowAccounts(current => !current)}
        >
          <div className="item-card__column-1">
            <img
              className="item-card__img"
              src={formatLogoSrc(institution.logo)}
              alt={institution && institution.name}
            />
            <p>{institution && institution.name}</p>
          </div>
          <div className="item-card__column-2">
            {isGoodState ? (
              <Note info solid>
                Updated
              </Note>
            ) : (
              <Note error solid>
                Login Required
              </Note>
            )}
          </div>
          <div className="item-card__column-3">
            <h3 className="heading">LAST UPDATED</h3>
            <p className="value">
              {diffBetweenCurrentTime(props.item.updated_at)}
            </p>
          </div>
        </Touchable>
        <MoreDetails // The MoreDetails component allows developer to test the ITEM_LOGIN_REQUIRED webhook and Link update mode
          setBadStateShown={isSandbox && isGoodState}
          handleDelete={handleDeleteItem}
          handleSetBadState={handleSetBadState}
          userId={props.userId}
          itemId={id}
        />
      </div>

      {showAccounts && accounts.length > 0 && (
        <div>
          <Table striped bordered hover className="mb-0">
            <thead>
              <tr>
                <th>Account</th>
                <th>Type</th>
                <th>Subtype</th>
                <th>Balance</th>
                <th className='actions-column'>Transactions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(account => (
                <tr>
                  <td>
                    <span className="smaller-text symbol">#</span>
                    {account.mask}
                  </td>
                  <td>{capitalize(account.type)}</td>
                  <td>{capitalize(account.subtype)}</td>
                  <td>
                    <span className="smaller-text symbol">€</span>
                    {account.current_balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className='actions-column'>
                    <Link to={`/set-own-transactions/${account.id}`}>
                      <Button
                        onClick={toggleShowTransactions}
                        className="button small button-primary"
                      >
                        {transactionsShown
                          ? 'Hide Transactions'
                          : 'Open Transactions'}
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {/* {accounts.map(account => (
              // <div id="itemCards" key={item.id}>
              //   <ItemCard item={item} userId={userId} />
              // </div>
              <tr>
                <td>{account.mask}</td>
                <td>{account.type}</td>
                <td>{account.subtype}</td>
                <td>{account.current_balance}</td>
                <td>-</td>
              </tr>
            ))} */}
            </tbody>
          </Table>
        </div>
      )}

      {/* {showAccounts && accounts.length > 0 && (
        <div>
          {accounts.map(account => (
            <div key={account.id}>
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      )} */}

      {showAccounts && accounts.length === 0 && (
        <Callout>
          No transactions or accounts have been retrieved for this item. See the{' '}
          <InlineLink href="https://github.com/plaid/pattern/blob/master/docs/troubleshooting.md">
            {' '}
            troubleshooting guide{' '}
          </InlineLink>{' '}
          to learn about receiving transactions webhooks with this sample app.
        </Callout>
      )}
    </div>
  );
};

export default ItemCard;

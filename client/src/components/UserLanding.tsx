import React, { useEffect, useState } from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import NavigationLink from 'plaid-threads/NavigationLink';
import LoadingSpinner from 'plaid-threads/LoadingSpinner';
import Callout from 'plaid-threads/Callout';
import Button from 'plaid-threads/Button';
import { FirstStep, Logout } from '.';
import { AddBankAccount } from '.';
import savingsAccountsImport from '../data/dummyData';

import {
  RouteInfo,
  ItemType,
  AccountType,
  AssetType,
  SavingAccountType,
} from './types';
import {
  useItems,
  useAccounts,
  useTransactions,
  useUsers,
  useAssets,
  useLink,
  useCurrentUser,
  useSavingAccounts,
} from '../services';

import { pluralize } from '../util';

import {
  Banner,
  LaunchLink,
  SpendingInsights,
  NetWorth,
  ItemCard,
  UserCard,
  LoadingCallout,
  ErrorMessage,
} from '.';
import { Table } from 'react-bootstrap';

// provides view of user's net worth, spending by category and allows them to explore
// account and transactions details for linked items

const UserPage = () => {
  const history = useHistory();
  const [items, setItems] = useState<ItemType[]>([]);
  const [token, setToken] = useState('');
  const [numOfItems, setNumOfItems] = useState(0);
  const [savingAccountsNumber, setSavingAccountsNumber] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  // const [savingAccounts, setSavingsAccount] = useState<SavingAccountType[]>([]);
  const [savingAccounts, setSavingsAccount] = useState<Array<any>>(
    savingsAccountsImport
  );
  const [assets, setAssets] = useState<AssetType[]>([]);

  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const { getAccountsByUser, accountsByUser } = useAccounts();
  const { getSavingAccountsByUser, savingAccountsByUser } = useSavingAccounts();
  const { assetsByUser, getAssetsByUser } = useAssets();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const { userState } = useCurrentUser();
  // Get user
  const rawUser = localStorage.getItem('jubleeUser');
  const jubleeUser = rawUser && rawUser !== '{}' ? JSON.parse(rawUser) : null;
  const currentUser =
    Object.keys(userState.currentUser).length !== 0
      ? userState.currentUser
      : jubleeUser;
  const userId = currentUser ? currentUser.id : null;
  const [user, setUser] = useState({
    id: userId,
    username: currentUser.userName,
    email: currentUser.email,
    created_at: '',
    updated_at: '',
  });
  const { generateLinkToken, linkTokens } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(userId, null);
  };

  // update data store with user
  useEffect(() => {
    getUserById(userId, false);
  }, [getUserById, userId]);

  // set state user from data store
  useEffect(() => {
    setUser(usersById[userId] || {});
  }, [usersById, userId]);

  useEffect(() => {
    // This gets transactions from the database only.
    // Note that calls to Plaid's transactions/get endpoint are only made in response
    // to receipt of a transactions webhook.
    getTransactionsByUser(userId);
  }, [getTransactionsByUser, userId]);

  useEffect(() => {
    setTransactions(transactionsByUser[userId] || []);
  }, [transactionsByUser, userId]);

  // update data store with the user's assets
  useEffect(() => {
    getAssetsByUser(userId);
  }, [getAssetsByUser, userId]);

  useEffect(() => {
    setAssets(assetsByUser.assets || []);
  }, [assetsByUser, userId]);

  // update data store with the user's items
  useEffect(() => {
    if (userId != null) {
      getItemsByUser(userId, true);
    }
  }, [getItemsByUser, userId]);

  // update state items from data store
  useEffect(() => {
    const newItems: Array<ItemType> = itemsByUser[userId] || [];
    const orderedItems = sortBy(
      newItems,
      item => new Date(item.updated_at)
    ).reverse();
    setItems(orderedItems);
  }, [itemsByUser, userId]);

  // update no of items from data store
  useEffect(() => {
    if (itemsByUser[userId] != null) {
      setNumOfItems(itemsByUser[userId].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, userId]);

  // update data store with the user's accounts
  useEffect(() => {
    getAccountsByUser(userId);
  }, [getAccountsByUser, userId]);

  useEffect(() => {
    setAccounts(accountsByUser[userId] || []);
  }, [accountsByUser, userId]);

  // update data store with the user's savings accounts
  useEffect(() => {
    // getSavingAccountsByUser(userId);
    setSavingsAccount(savingsAccountsImport);
    setSavingAccountsNumber(savingsAccountsImport.length);
  }, [getSavingAccountsByUser, userId, savingsAccountsImport]);

  // useEffect(() => {
  //   getSavingAccountsByUser(userId);
  // setSavingAccountsNumber()
  // }, [getSavingAccountsByUser, userId]);

  // useEffect(() => {
  //   // setSavingsAccount(savingAccountsByUser ? savingAccountsByUser[userId] : []);
  //   setSavingsAccount(savingAccountsByUser[userId] || []);
  // }, [savingAccountsByUser, userId]);

  useEffect(() => {
    setToken(linkTokens.byUser[userId]);
  }, [linkTokens, userId, numOfItems]);

  // document.getElementsByTagName('body')[0].style.overflow = 'auto'; // to override overflow:hidden from link pane
  return (
    <div className="container">
      <div className="logout-wrapper">
        <span>
          Hi, {user.username}, welcome to <b>Jublee!</b>
        </span>
        <Logout />
      </div>

      {token != null && token.length > 0 && (
        // Link (render for adding a bank) will not render unless there is a link token
        <LaunchLink token={token} userId={userId} itemId={null} />
      )}
      {/* {numOfItems === 0 && <AddBankAccount />} */}

      <div>
        <div>
          {/* <NavigationLink component={Link} to="/">
              BACK TO LOGIN
            </NavigationLink> */}

          {linkTokens.error.error_code != null && (
            <Callout warning>
              <div>
                Unable to fetch link_token: please make sure your backend server
                is running and that your .env file has been configured
                correctly.
              </div>
              <div>
                Error Code: <code>{linkTokens.error.error_code}</code>
              </div>
              <div>
                Error Type: <code>{linkTokens.error.error_type}</code>{' '}
              </div>
              <div>Error Message: {linkTokens.error.error_message}</div>
            </Callout>
          )}
          {/* <UserCard
            user={user}
            userId={userId}
            removeButton={false}
            linkButton
          /> */}
          {numOfItems === 0 && (
            <div className="jublee-container jublee-container-margin-top jublee-container-flex">
              <h4>
                You didn't connect yet any <b>checking account</b>!
              </h4>
              <p className="text-centered">
                To start using Jublee, please add a checking account.
              </p>
              <button className="button button-primary" onClick={initiateLink}>
                Start
              </button>
            </div>
          )}
          {savingAccountsNumber === 0 && (
            <div className="jublee-container jublee-container-margin-top jublee-container-flex">
              <h4>
                You didn't connect yet any <b>savings account</b>!
              </h4>
              <p className="text-centered">
                To start using Jublee, please add a saving account.
              </p>
              <Link to="/add-saving-account" className="button button-primary">
                Start
              </Link>
            </div>
          )}
          {numOfItems > 0 && transactions.length > 0 && (
            <SpendingInsights
              numOfItems={numOfItems}
              transactions={transactions}
            />
          )}
          {/* {numOfItems === 0 && <ErrorMessage />} */}
          {numOfItems > 0 && transactions.length === 0 && (
            <div className="loading">
              <LoadingSpinner />
              <LoadingCallout />
            </div>
          )}
          {/* {numOfItems > 0 && transactions.length > 0 && (
            <>
              <NetWorth
                accounts={accounts}
                numOfItems={numOfItems}
                personalAssets={assets}
                userId={userId}
                assetsOnly={false}
              />
              <SpendingInsights
                numOfItems={numOfItems}
                transactions={transactions}
              />
            </>
          )} */}
          {numOfItems === 0 && transactions.length === 0 && assets.length > 0 && (
            <>
              <NetWorth
                accounts={accounts}
                numOfItems={numOfItems}
                personalAssets={assets}
                userId={userId}
                assetsOnly
              />
            </>
          )}
          {numOfItems > 0 && (
            <>
              <div className="item__header">
                <div>
                  <h2 className="item__header-heading">
                    {`${items.length} ${pluralize(
                      'Bank',
                      items.length
                    )} Linked`}
                  </h2>
                  {!!items.length && (
                    <p className="item__header-subheading">
                      Belown is a list of all your connected banks. Click on a
                      bank to view its associated accounts.
                    </p>
                  )}
                </div>

                <Button
                  large
                  inline
                  className="button button-primary"
                  onClick={initiateLink}
                >
                  Add another checking account
                </Button>

                {/* {token != null && token.length > 0 && (
                    // Link will not render unless there is a link token
                    <LaunchLink token={token} userId={userId} itemId={null} />
                  )} */}
              </div>
              <ErrorMessage />

              {items.map(item => (
                <div id="itemCards" key={item.id}>
                  <ItemCard item={item} userId={userId} />
                </div>
              ))}
            </>
          )}

          {savingAccounts && savingAccountsNumber > 0 && (
            <>
              <div className="item__header">
                <div>
                  <h2 className="item__header-heading">
                    {savingAccountsNumber} Savings account linked
                  </h2>
                  <p className="item__header-subheading">
                    Belown is a list of all your savings accounts.
                  </p>
                </div>
                <Link to="/add-saving-account">
                  <Button large inline className="button button-primary">
                    Add another saving account
                  </Button>
                </Link>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th />
                    <th>Name</th>
                    <th>Bank</th>
                    <th>Iban</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {savingAccounts.map((account, index) => {
                    return (
                      <tr>
                        <td />
                        <td>{account.name}</td>
                        <td>{account.bank_name}</td>
                        <td>{account.iban}</td>
                        <td>
                          <span className="smaller-text symbol">€</span>
                          {account.balance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;

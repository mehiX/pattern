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
import { Callout } from 'plaid-threads';

const FirstStep = (props: any) => {
  const { userState } = useCurrentUser();
  // Get user
  const rawUser = localStorage.getItem('jubleeUser');
  const jubleeUser = rawUser && rawUser !== '{}' ? JSON.parse(rawUser) : null;
  const currentUser =
    Object.keys(userState.currentUser).length !== 0
      ? userState.currentUser
      : jubleeUser;
  const userId = currentUser ? currentUser.id : null;
  console.log(currentUser);
  const [user, setUser] = useState({
    id: userId,
    username: currentUser.userName,
    email: currentUser.email,
    created_at: '',
    updated_at: '',
  });
  // const [user, setUser] = useState({
  //   id: userId,
  //   username: userState.currentUser.username,
  //   email: userState.currentUser.email,
  //   created_at: userState.currentUser.created_at,
  //   updated_at: userState.currentUser.updated_at,
  // });
  const [token, setToken] = useState('');
  const [numOfItems, setNumOfItems] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const { getAccountsByUser, accountsByUser } = useAccounts();
  const { assetsByUser, getAssetsByUser } = useAssets();
  const { usersById, getUserById } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
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
    setToken(linkTokens.byUser[userId]);
  }, [linkTokens, userId, numOfItems]);

  return (
    <div className="StepWizardStep">
      <h1>Connect</h1>
      <h2>Hi, {user.username}</h2>
      <p>Tap the button to connect with your bank </p>
      <div className="flex flex-centered">
        <button className="button button-primary w-100" onClick={initiateLink}>
          Start
        </button>
        <button
        className="button button-primary"
        onClick={() => props.goToStep(+props.step + 1)}
      >
        Next
      </button>
      </div>
      {linkTokens.error.error_code != null && (
        <Callout warning>
          <div>
            Unable to fetch link_token: please make sure your backend server is
            running and that your .env file has been configured correctly.
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
    </div>
  );
};

export default FirstStep;

import React, { useEffect } from 'react';
import Button from 'plaid-threads/Button';
import { useHistory } from 'react-router-dom';

import { useCurrentUser } from '../services';
import { Login, Banner, AddUserForm, UserLanding } from '.';

import { useBoolean } from '../hooks';

export default function Landing() {
  const { userState, setCurrentUser } = useCurrentUser();
  const [isAdding, hideForm, toggleForm] = useBoolean(false);
  const history = useHistory();

  useEffect(() => {
    if (userState.newUser != null) {
      setCurrentUser(userState.newUser);
    }
  }, [setCurrentUser, userState.newUser]);

  const returnToCurrentUser = () => {
    history.push(`/user/${userState.currentUser.id}`);
  };

  // get user form local storage
  const rawUser = localStorage.getItem('jubleeUser');
  const jubleeUser = rawUser ? JSON.parse(rawUser) : null;

  return (
    <div>
      {!jubleeUser && (
        <div>
          <div>
            <Login />
            {/* <Button className="createAccountBtn" onClick={toggleForm}>
              Create Account!!
            </Button> */}
          </div>
          {isAdding && <AddUserForm hideForm={hideForm} />}
        </div>
      )}
      {jubleeUser && <UserLanding />}
    </div>
  );
}

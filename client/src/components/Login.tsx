import React, { useState, useEffect } from 'react';
import { TestStepWizard } from '.';
import Modal from 'plaid-threads/Modal';
import ModalBody from 'plaid-threads/ModalBody';
import Button from 'plaid-threads/Button';
import TextInput from 'plaid-threads/TextInput';
import firebase, { auth, provider } from '../services/firebase.js';
import StepWizard from 'react-step-wizard';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

import { useCurrentUser, useUsers } from '../services';
import { isEmpty } from 'lodash';

const Login = () => {
  const { login } = useCurrentUser();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');

  const [username, setUsername] = useState('');

  const { allUsers, addNewUser, getUsers } = useUsers();
  const { setNewUser } = useCurrentUser();
  const [globalUsers, setGlobalUsers] = useState({});

  async function getGlobalUsers(): Promise<any> {
    return new Promise(resolve => {
      resolve(allUsers);
    });
  }

  // Fetch all users
  useEffect(() => {
    getGlobalUsers().then(data => setGlobalUsers(data));
  }, []);

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   await addNewUser(username);
  //   setNewUser(username);
  //   props.hideForm();
  // };

  useEffect(() => {}, [addNewUser, getUsers]);

  const createUser = async (username: string) => {
    await addNewUser(username);
    setNewUser(username);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let username: string = '';
    const users = await allUsers;

    console.log('globalUsers: ', globalUsers);

    // Log in user with Google
    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. Can be used to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential ? credential.accessToken : null;
        // The signed-in user info.
        const user = result.user;
        const userID = user.uid;
        const displayName = user.displayName;
        username = user.displayName ? user.displayName : '';
        const email = user.email;

        // Check if user exists
        var userExists: boolean = false;
        var userFounded = users.reduce(function(
          founded: boolean = false,
          user: any
        ) {
          console.log('user.username : ', user.username);
          console.log('username: ', username);
          if (user.username.trim() === username.trim()) {
            userExists = true;
            console.log('founded: ', userExists);
          }
          return founded;
        },
        []);
        if (!userFounded && isEmpty(userFounded) && userFounded.length) {
          userExists = true;
        }
        // If user exists, log in. Otherwise Create user in the DB
        console.log('userExists', userExists);
        if (userExists === true) {
          console.log('login');
          login(username);
        } else {
          console.log('createUser');
          createUser(username);
        }
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <div>
      <div className="fullpage-wrapper flex flex-centered">
        <div className="login-wrapper">
          <h1 className="text-centered">LOGIN</h1>
          <p>Log in with your Google account.</p>
          <button className="button button-primary" onClick={handleSubmit}>
            Log In
          </button>
        </div>
        {/* <Button centered inline onClick={() => setShow(!show)}>
        Login
      </Button> */}
        {/* <Modal isOpen={show} onRequestClose={() => setShow(false)}>
        <>
          <ModalBody
            onClickCancel={() => setShow(false)}
            header="User Login"
            isLoading={false}
            onClickConfirm={handleSubmit}
            confirmText="Submit"
          >
            <TextInput
              label=""
              id="id-6"
              placeholder="Enter User Name"
              value={value}
              onChange={e => setValue(e.currentTarget.value)}
            />
          </ModalBody>
        </>
      </Modal> */}
      </div>
      <StepWizard>
        <TestStepWizard step="1" />
        <TestStepWizard step="2" />
        <TestStepWizard step="3" />
        <TestStepWizard step="4" />
      </StepWizard>
    </div>
  );
};

export default Login;

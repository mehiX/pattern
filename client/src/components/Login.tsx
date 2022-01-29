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
import { userInfo } from 'os';

const Login = () => {
  // TODO maybe set new user to the current data object.
  const { login, setNewUser, userState } = useCurrentUser();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState('');
  const [username, setUsername] = useState('');
  const [user, setUser] = useState({});

  const { allUsers, addNewUser, getUsers } = useUsers();
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

  // useEffect(() => {}, [addNewUser, getUsers]);

  // const createUser = async (username: string) => {
  //   await addNewUser(username);
  //   setNewUser(username);
  // };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let username: string = '';

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
        const email = user.email ? user.email : '';
        // Save user in the DB
        addNewUser(userID, username, email);

        try {
          login(userID, username, email);
          const jubleeUser = {
            userName: username,
            email: email,
          };
          // localStorage.setItem('jubleeUser', JSON.stringify(jubleeUser));
        } catch (error) {
          // TODO:  Handle error
          console.error('Login Failed', error);
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

  useEffect(() => {
    const jubleeUser = {
      id: userState.currentUser.id,
      userName: userState.currentUser.username,
      email: userState.currentUser.email,
    };
    setUser(jubleeUser);
    localStorage.setItem('jubleeUser', JSON.stringify(jubleeUser));
    console.log('userState', userState);
  }, [userState])

  return (
    <div>
      <div className="fullpage-wrapper flex flex-centered">
        <div className="login-wrapper">
          <h1 className="text-centered">LOGIN</h1>
          <p>Log in with your Google account.</p>
          <button
            className="button button-primary w-100"
            onClick={handleSubmit}
          >
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
    </div>
  );
};

export default Login;

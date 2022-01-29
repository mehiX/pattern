// Imports
import React, { Component } from 'react';
import { useCurrentUser } from '../services';
import firebase, { auth, provider } from '../services/firebase.js';
import { useHistory } from 'react-router-dom';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';

// Requires
require('firebase/auth');

const Logout = () => {
  const history = useHistory();
  const { userState } = useCurrentUser();
  const logout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem('jubleeUser');
        history.push('/');
      })
      .catch(error => {
        // TODO handle error
      });
  };

  return (
    <button className="button button-primary logout-btn" onClick={logout}>
      Log out
    </button>
  );
};

export default Logout;

// class Logout extends Component<props, data> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       user: null,
//       userID: null,
//       displayName: null,
//       email: null,
//     };
//     this.logout = this.logout.bind(this);
//   }
//   logout() {
//     signOut(auth)
//       .then(() => {
//         // Sign-out successful.
//         // Now unset all the variables
//         const user = null;
//         const userID = null;
//         const displayName = null;
//         const email = null;
//         // Set state
//         this.setState({
//           user,
//           userID,
//           displayName,
//           email,
//         });
//         this.props.onHandleUser({ user, userID, displayName, email });
//         this.props.onHandleError('');
//         localStorage.removeItem('jubleeUser');
//         const history = useHistory();
//         history.push('/');
//       })
//       .catch(error => {
//         // TODO handle error
//       });
//   }

//   render() {
//     return (
//       <button
//         className="button button-primary logout-btn"
//         onClick={this.logout}
//       >
//         Log out
//       </button>
//     );
//   }
// }

// export default Logout;

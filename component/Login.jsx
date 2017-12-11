import React from "react";
import firebase, { db, auth } from "../fire";

const google = new firebase.auth.GoogleAuthProvider();
//const facebook = new firebase.auth.FacebookAuthProvider();


function Login(authArg, provider) {
  let result = authArg.signInWithPopup(provider)
    // result.then(res => {
    //   const userName = res.user.displayName
    //   const userEmail = res.user.email
    //   const uid = res.user.uid
    //   db.
    //     collection('users')
    //     .doc(uid)
    //     .set({
    //       userName: userName,
    //       userEmail: userEmail,
    //       uid: uid
    //     })


    // })


}

auth.onAuthStateChanged(console.log);

export default ({ auth }) => (
  <div className="login">
    <li className="google login" onClick={() => Login(auth, google)}>
      Login with Google
    </li>
  </div>
);

// const email = new firebase.auth.EmailAuthProvider()

// If you want to request additional permissions, you'd do it
// like so:
//
// google.addScope('https://www.googleapis.com/auth/plus.login')
//
// What kind of permissions can you ask for? There's a lot:
//   https://developers.google.com/identity/protocols/googlescopes
//
// For instance, this line will request the ability to read, send,
// and generally manage a user's email:
//
// google.addScope('https://mail.google.com/')

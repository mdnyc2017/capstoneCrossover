import React from 'react'
import firebase, {auth} from '~/fire';

const google = new firebase.auth.GoogleAuthProvider();
// const facebook = new firebase.auth.FacebookAuthProvider();



function Login(provider) {
    auth.signInWithPopup(provider);
}

auth.onAuthStateChanged(console.log);

export default ({ auth }) =>
// signInWithPopup will try to open a login popup, and if it's blocked, it'll redirect.

(<div className="login">
    <li className='google login'
    onClick={() => Login(google)}>Login with Google</li>
</div>)


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
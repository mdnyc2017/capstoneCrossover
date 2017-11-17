import React from 'react';
import Test from './Test';
import firebase, {auth} from '~/fire';

var provider = new firebase.auth.GoogleAuthProvider();

function LoginWithGoogle() {
    auth.signInWithPopup(provider);
}

auth.onAuthStateChanged(console.log);

export default function App() {
    return <div><Test /><button value="login" onClick={LoginWithGoogle}>Login</button></div>
}
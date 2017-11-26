import * as firebase from "firebase"; //firebase node module to access all functions
import "firebase/firestore";
import config from "./config";

firebase.initializeApp(config);

export default firebase;
export const db = firebase.firestore();
export const auth = firebase.auth();

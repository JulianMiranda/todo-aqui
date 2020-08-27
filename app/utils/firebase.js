import firebase from 'firebase/app';
import {firebaseConfig} from './firebaseConfig';

export const firebaseApp = firebase.initializeApp(firebaseConfig);

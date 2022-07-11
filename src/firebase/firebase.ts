import firebase from 'firebase-admin';
import serviceAccount from './firebase-service-account'

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});
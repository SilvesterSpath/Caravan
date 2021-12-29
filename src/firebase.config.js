// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/fires';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyCxz-QnyYW3r13oh2xWu8pAJvpFw8BZXRA',

  authDomain: 'caravan-marketplace-app.firebaseapp.com',

  projectId: 'caravan-marketplace-app',

  storageBucket: 'caravan-marketplace-app.appspot.com',

  messagingSenderId: '228121258785',

  appId: '1:228121258785:web:60785c9485c0cd95f86c60',
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const db = getFirestore();

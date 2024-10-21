import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDxSETCqQNFbMFWxKuMmp0qshB_zS0tly4',
  authDomain: 'grmotors-3e477.firebaseapp.com',
  projectId: 'grmotors-3e477',
  storageBucket: 'grmotors-3e477.appspot.com',
  messagingSenderId: '1010761651256',
  appId: '1:1010761651256:web:d46365caaf363dae9c42cd',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

// Public Firebase web configuration. Passwords are handled by Firebase Authentication.
import {initializeApp,getApps,getApp} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {getAuth,onAuthStateChanged,onIdTokenChanged,getIdToken,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,sendEmailVerification,updateProfile,reload,setPersistence,browserLocalPersistence,browserSessionPersistence,inMemoryPersistence} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
const config={apiKey:'AIzaSyDb_6sy7DEnvgvLHCjBAMrX87A_oBu9870',authDomain:'science-vault-wa.firebaseapp.com',projectId:'science-vault-wa',storageBucket:'science-vault-wa.firebasestorage.app',messagingSenderId:'313882079537',appId:'1:313882079537:web:cae46cef0bcb2462fe4010'};
export const app=getApps().length?getApp():initializeApp(config);
export const auth=getAuth(app);
auth.languageCode='en';
export {onAuthStateChanged,onIdTokenChanged,getIdToken,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,sendEmailVerification,updateProfile,reload};
export async function persistence(remember){try{await setPersistence(auth,remember?browserLocalPersistence:browserSessionPersistence)}catch(error){if(error.code==='auth/web-storage-unsupported'||error.code==='auth/operation-not-supported-in-this-environment')await setPersistence(auth,inMemoryPersistence);else throw error}}

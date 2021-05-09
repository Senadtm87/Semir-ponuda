import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDAqd8xapKpRIr0TT-504EWNLAS-fAj3QE",
    authDomain: "semir-ponuda.firebaseapp.com",
    projectId: "semir-ponuda",
    storageBucket: "semir-ponuda.appspot.com",
    messagingSenderId: "843338698224",
    appId: "1:843338698224:web:77687f76a9de2495a02135"
};


firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();


export const firestore = firebase.firestore();



const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });


export const signInWithGoogle = () => auth.signInWithPopup(provider);


export const isUserAdministartor = async (uid: string): Promise<boolean> => {

    const adminRef = await firestore.doc(`administrators/${uid}`).get();
    console.log("administrators", adminRef);
    return adminRef.exists;

}


export default firebase;
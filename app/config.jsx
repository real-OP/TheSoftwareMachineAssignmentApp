import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyC-cIR3f1v-zlegLv_UMJHSO3OtCXrt-W4",
    authDomain: "fir-auth-practice-616b1.firebaseapp.com",
    projectId: "fir-auth-practice-616b1",
    storageBucket: "fir-auth-practice-616b1.firebasestorage.app",
    messagingSenderId: "269694348468",
    appId: "1:269694348468:web:05aa296be3c59323747be1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db , auth};

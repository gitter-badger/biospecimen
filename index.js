import { firebaseConfig } from "./src/config.js";
import { manageUsers } from "./src/pages/users.js";
import { userDashboard } from "./src/pages/dashboard.js";
import { signIn, signOut } from "./src/pages/signIn.js";

let auth = '';

window.onload = () => {
    if('serviceWorker' in navigator){
        try {
            navigator.serviceWorker.register('./serviceWorker.js');
        }
        catch (error) {
            console.log(error);
        }
    };
    !firebase.apps.length ? firebase.initializeApp(firebaseConfig()) : firebase.app();
    auth = firebase.auth();
    manageRoutes();
}

window.onhashchange = () => {
    manageRoutes();
}

const manageRoutes = async () => {
    const route =  window.location.hash || '#';
    if(await userLoggedIn()){
        if (route === '#dashboard') userDashboard(auth, route);
        else if (route === '#manage_users') manageUsers(auth, route);
        else if (route === '#sign_out') signOut();
        else window.location.hash = '#dashboard';
    }else{
        if(route === '#') signIn();
        else window.location.hash = '#';
    }
}

const userLoggedIn = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            unsubscribe();
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}
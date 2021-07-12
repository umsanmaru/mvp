import firebase from "firebase/app";
import "firebase/storage";

const storageInit = () => {
    var firebaseConfig = {
        apiKey: "AIzaSyC3qyHC3nf9BwIJfB8BqWDLPuJZ7bcKWnw",
        authDomain: "mvp-db-ecbe5.firebaseapp.com",
        databaseURL: "https://mvp-db-ecbe5-default-rtdb.firebaseio.com",
        projectId: "mvp-db-ecbe5",
        storageBucket: "mvp-db-ecbe5.appspot.com",
        messagingSenderId: "57354889627",
        appId: "1:57354889627:web:1fb6de97d88dcfeca9d93e",
        measurementId: "G-FVJJG0261W"
    };
    if(!firebase.apps.length){
        firebase.initializeApp(firebaseConfig);
    }else{
        firebase.app()
    }
    return firebase.storage();
}

export default storageInit;
const firebaseConfig = {
    apiKey: "AIzaSyCPA5xNO3YPwtJSVrYHCxFCmIkMYkhdhWc",
    authDomain: "js-project-92c8d.firebaseapp.com",
    projectId: "js-project-92c8d",
    storageBucket: "js-project-92c8d.firebasestorage.app",
    messagingSenderId: "629295037407",
    appId: "1:629295037407:web:d929a43135e6131cd4226a"
    // osama configration
    // apiKey: "AIzaSyAEpHidRTkCegpQmOzHy6hV7iApvAJIFoM",
    // authDomain: "test-de06d.firebaseapp.com",
    // projectId: "test-de06d",
    // storageBucket: "test-de06d.firebasestorage.app",
    // messagingSenderId: "308036633924",
    // appId: "1:308036633924:web:1894faeee93a0815b14311",
    // measurementId: "G-XKSNCZ34EL",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
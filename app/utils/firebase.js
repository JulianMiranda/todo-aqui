import firebase from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyBZq2zgsLTLuEWmuiJo7y7xJY7IDbK8Yxk',
	authDomain: 'todoaqui-be.firebaseapp.com',
	databaseURL: 'https://todoaqui-be.firebaseio.com',
	projectId: 'todoaqui-be',
	storageBucket: 'todoaqui-be.appspot.com',
	messagingSenderId: '1044525741253',
	appId: '1:1044525741253:web:687a8458df415ae96cacac'
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);

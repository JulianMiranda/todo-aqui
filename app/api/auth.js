import * as SecureStore from 'expo-secure-store';
import * as firebase from 'firebase/app';

const baseURL = 'https://todo-aqui.herokuapp.com/api';

export const getLogin = (logginData) => {
	firebase
		.auth()
		.signInWithPhoneNumber(logginData.phoneNumber, null)
		.then((res) => {
			console.log('RESPONSE FIREBASE', res);
			const {email, displayName, phoneNumber, photoURL} = res.user;
			SecureStore.setItemAsync('authToken', res.stsTokenManager.accessToken);
			return {email, displayName, phoneNumber, photoURL};
		})
		.catch((err) => {
			return {error: `${err.code}:${err.message}`};
		});
};

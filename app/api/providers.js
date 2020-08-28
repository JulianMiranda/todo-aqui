import {fetchLogin} from '../fetch';
import {auth} from 'firebase';

export default {
	login: async () => {
		try {
			const userAuth = await fetchLogin();
			sessionStorage.setItem('userAuth', JSON.stringify(userAuth));
			return Promise.resolve();
		} catch (error) {
			return auth().signOut();
		}
	},
	logout: () => {
		return auth().signOut();
	},
	checkError: () => {
		return auth().signOut();
	},
	checkAuth: () => {
		return new Promise((resolve, reject) => {
			auth().onAuthStateChanged(async (user) => {
				if (user) {
					console.log('User is logged in');
					resolve();
				} else {
					console.log('User is not logged in');
					reject();
				}
			});
		});
	},
	getPermissions: async () => {
		return new Promise((resolve, reject) => {
			auth().onAuthStateChanged(async (user) => {
				if (user) {
					const {claims} = await user.getIdTokenResult();

					if (claims && claims.role) resolve(claims.role);
					else reject();
				} else {
					reject();
				}
			});
		});
	}
};

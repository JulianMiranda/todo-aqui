import {auth} from 'firebase';

export const getToken = async () => {
	return new Promise((resolve, reject) => {
		auth().onAuthStateChanged((user) => {
			if (user) {
				user
					.getIdToken()
					.then(function (idToken) {
						resolve(idToken);
					})
					.catch(() => reject());
			} else {
				reject();
			}
		});
	});
};
export const getHeaders = async () => {
	const token = await getToken();

	const headers = new Headers({'Content-Type': 'application/json'});
	headers.set('Access-Control-Allow-Origin', '*');

	headers.set('x-token', token);
	/* console.log(headers); */
	return headers;
};

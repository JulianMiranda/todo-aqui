import {getToken, getHeaders} from '../api/getHeaders';
import {apiUrl} from '../config/config';

export async function Login() {
	try {
		const headers = await getHeaders();
		const config = {
			method: 'get',
			url: `${apiUrl}/login`,
			headers: headers.map
		};
		const data = await axios(config);

		return data;
	} catch (error) {
		console.error(error);
	}
}

export async function fetchRoles() {
	const token = await getToken();
	const headers = new Headers({Accept: 'application/json'});
	headers.set('x-token', token);

	return httpClient(`${apiUrl}/getRoles`, {headers}).then(({json}) => {
		return {
			data: json
		};
	});
}

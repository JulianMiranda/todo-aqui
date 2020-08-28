import axios from 'axios';
import {getHeaders} from './getHeaders';
const apiUrl = 'https://todo-aqui.herokuapp.com/api';

const getList = async (resource, data) => {
	const query = data;
	const headers = await getHeaders();

	const config = {
		method: 'post',
		url: `${apiUrl}/${resource}/getList`,
		headers: headers.map,
		data: JSON.stringify(query)
	};

	axios(config)
		.then((json) => {
			/* console.log(json); */
			return {data: json};
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};
const getOne = async (resource, data) => {
	const headers = await getHeaders();
	const config = {
		method: 'get',
		url: `${apiUrl}/${resource}/getOne/${data.id}`,
		headers: headers.map
	};
	axios(config)
		.then(function (response) {
			/* console.log(JSON.stringify(response.data)); */

			return JSON.stringify(response.data);
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};
const Create = async (resource, data) => {
	const query = data;
	const headers = await getHeaders();
	const config = {
		method: 'post',
		url: `${apiUrl}/${resource}/create`,
		headers: headers.map,
		data: JSON.stringify(query)
	};
	axios(config)
		.then(function (response) {
			return JSON.stringify(response.data);
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};
const Update = async (resource, data) => {
	const query = data.query;
	const dataS = {
		name: query
	};

	const headers = await getHeaders();
	const config = {
		method: 'put',
		url: `${apiUrl}/${resource}/update/${data.id}`,
		headers: headers.map,
		data: JSON.stringify(dataS)
	};

	axios(config)
		.then(function (response) {
			return JSON.stringify(response.data);
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};
const login = async (token) => {
	const headers = await getHeaders();
	const config = {
		method: 'get',
		url: `${apiUrl}/login`,
		headers: headers.map
	};
	return axios(config)
		.then((res) => {
			console.log('positivo');
			return res.data;
		})
		.catch((err) => {
			console.log('negativo');
			console.log(err);
			return err;
		});
};

/* async function getUsers() {
	try {
		const response = await axios.get(
			`${apiUrl}/users/getOne/5f4860248e431e00172dd493`
		);
		console.log(response);
	} catch (error) {
		console.error(error);
	}
}
 */
export {getList, getOne, Create, Update, login};

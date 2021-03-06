import axios from 'axios';
import {getHeaders} from './getHeaders';
import {apiUrl} from '../config/config';

async function getList(resource, params) {
	try {
		const body = params;
		const headers = await getHeaders();
		const config = {
			method: 'post',
			url: `${apiUrl}/${resource}/getList`,
			headers: headers.map,
			data: JSON.stringify(body)
		};
		const {data} = await axios(config);
		return data;
	} catch (error) {
		console.error(error);
	}
}
async function getOne(resource, params) {
	try {
		const headers = await getHeaders();
		const config = {
			method: 'get',
			url: `${apiUrl}/${resource}/getOne/${params}`,
			headers: headers.map
		};
		const {data} = await axios(config);
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function Create(resource, params) {
	try {
		const body = params;
		const headers = await getHeaders();
		const config = {
			method: 'post',
			url: `${apiUrl}/${resource}/create`,
			headers: headers.map,
			data: JSON.stringify(body)
		};
		const data = await axios(config);
		return data;
	} catch (error) {
		console.error(error);
	}
}
async function Update(resource, params, id) {
	try {
		const body = params;
		const headers = await getHeaders();
		const config = {
			method: 'put',
			url: `${apiUrl}/${resource}/update/${id}`,
			headers: headers.map,
			data: JSON.stringify(body)
		};
		const data = await axios(config);
		return data;
	} catch (error) {
		console.error(error);
	}
}
/* async function Login(resource, params) {
	try {
		const body = params;
		const headers = await getHeaders();
		const config = {
			method: 'post',
			url: `${apiUrl}/${resource}/create`,
			headers: headers.map,
			data: JSON.stringify(body)
		};
		const data = await axios(config);
		return data;
	} catch (error) {
		console.error(error);
	}
} */
async function Login() {
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
export {getList, Create, getOne, Update, Login};

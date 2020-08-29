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
		/* console.log(config); */
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
export {getList, Create};

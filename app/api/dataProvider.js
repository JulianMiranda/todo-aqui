import axios from 'axios';
import {getHeaders} from './getHeaders';
import {apiUrl} from '../config/config';
/* const apiUrl = 'https://todo-aqui.herokuapp.com/api'; */

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
export {getList};

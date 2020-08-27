import axios from 'axios';
import * as SecureteStore from 'expo-secure-store';
import store from '../store';

const url = 'https://todo-aqui.herokuapp.com/api';
const accessToken = SecureteStore.getItemAsync('authToken');
const getSerenade = () => {
	var data = JSON.stringify({
		filter: {},
		search: {},
		fields: {},
		docsPerPage: 20,
		page: 0,
		population: [
			{path: 'offer', fields: {title: true}},
			{path: 'user', fields: {name: true}}
		]
	});

	var config = {
		method: 'post',
		url: url + '/serenades/getList',
		headers: {
			'x-token': '',
			'Content-Type': 'application/json'
		},
		data: data
	};

	axios(config)
		.then(function (response) {
			return JSON.stringify(response.data);
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};

const getPromotions = () => {
	var data = JSON.stringify({
		filter: {},
		search: {},
		fields: {},
		docsPerPage: 20,
		page: 0,
		population: [
			{path: 'offer', fields: {title: true}},
			{path: 'user', fields: {name: true}},
			{path: 'image', fields: {url: true}}
		]
	});

	var config = {
		method: 'post',
		url: url + '/promotions/getList',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		data: data
	};

	return axios(config)
		.then(function (response) {
			return JSON.parse(JSON.stringify(response.data));
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};

const getOffers = () => {
	var data = JSON.stringify({
		filter: {},
		search: {},
		fields: {},
		docsPerPage: 20,
		page: 0,
		population: [
			{path: 'offer', fields: {title: true}},
			{path: 'user', fields: {name: true}},
			{path: 'image', fields: {url: true}}
		]
	});

	var config = {
		method: 'post',
		url: url + '/offers/getList',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		data: data
	};

	return axios(config)
		.then(function (response) {
			return JSON.parse(JSON.stringify(response.data));
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};

const isUserRegistered = (token) => {
	var config = {
		method: 'get',
		url: `${url}/login`,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'x-token': token
		}
	};
	return axios(config)
		.then((res) => res.data)
		.catch((err) => err);
};

const getInfoUserRegistered = (id, token) => {
	var config = {
		method: 'get',
		url: `${url}/users/getOne/${id}`,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'x-token': token
		}
	};
	return axios(config)
		.then((res) => res.data)
		.catch((err) => err);
};

const saveUsers = (data, token) => {
	const state = store.getState();
	const userId = state.userReducer.userId;
	const userData = data;
	var config = {
		method: 'put',
		url: `${url}/users/update/${userId}`,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'x-token': token
		},
		data: userData
	};

	return axios(config)
		.then(function (response) {
			return JSON.parse(JSON.stringify(response.data));
		})
		.catch(function (error) {
			return error;
		});
};

const getMyShows = (id, token) => {
	var data = JSON.stringify({
		filter: {
			user: ['=', id]
		},
		search: {},
		fields: {},
		population: [
			{
				path: 'offer',
				fields: {
					title: true
				}
			},
			{
				path: 'mariachi',
				fields: {
					name: true
				}
			},
			{
				path: 'offer',
				fields: {
					title: true
				}
			},
			{
				path: 'user',
				fields: {
					name: true,
					last_name: true
				}
			}
		]
	});

	var config = {
		method: 'post',
		url: url + '/serenades/getList',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'x-token': token
		},
		data: data
	};

	return axios(config)
		.then(function (response) {
			return JSON.parse(JSON.stringify(response.data));
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};

const getDistanceMariachi = (radio, latitude, longitude, token) => {
	var data = JSON.stringify({
		filter: {},
		search: {},
		fields: {}
	});

	var config = {
		method: 'get',
		url: `${url}/distance/getList/now/${radio}/${latitude},${longitude}`,
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'x-token': token
		},
		data: data
	};

	return axios(config)
		.then(function (response) {
			return JSON.parse(JSON.stringify(response.data));
		})
		.catch(function (error) {
			return {ERROR: error};
		});
};

export {
	getSerenade,
	getPromotions,
	getOffers,
	saveUsers,
	isUserRegistered,
	getInfoUserRegistered,
	getMyShows,
	getDistanceMariachi
};

import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {apiUrl} from '../../config/congig';

import axios from 'axios';
import {getHeaders} from '../../api/getHeaders';

export default function Anounces(props) {
	const {navigation} = props;
	const [user, setUser] = useState(null);
	const [anounces, setAnounces] = useState([]);
	const [totalAnounces, setTotalAnounces] = useState(0);
	const data = {
		filter: {},
		search: {},
		fields: {},
		docsPerPage: 2,
		page: 0
	};

	useEffect(() => {
		firebase.auth().onAuthStateChanged((userInfo) => {
			setUser(userInfo);
		});
	}, []);

	useEffect(() => {
		getUsers();
	}, []);

	async function getUsers() {
		try {
			const body = {
				filter: {},
				search: {},
				fields: {},
				docsPerPage: 2,
				page: 0
			};
			const headers = await getHeaders();
			const config = {
				method: 'post',
				url: `${apiUrl}/users/getList`,
				headers: headers.map,
				data: JSON.stringify(body)
			};
			const {data} = await axios(config);

			setTotalAnounces(data.count);
			setAnounces(data.data);
		} catch (error) {
			console.error(error);
		}
	}

	console.log(totalAnounces);

	return (
		<View style={styles.viewBody}>
			<Text>Anounces </Text>
			{user && (
				<Icon
					reverse
					type="material-community"
					name="plus"
					color="#00a680"
					containerStyle={styles.btnContainer}
					onPress={() => navigation.navigate('add-anounce')}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff'
	},
	btnContainer: {
		position: 'absolute',
		bottom: 10,
		right: 10,
		shadowColor: 'black',
		shadowOffset: {width: 2, height: 2},
		shadowOpacity: 0.5
	}
});

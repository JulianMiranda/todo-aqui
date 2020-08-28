import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {getList} from '../../api/dataProvider';

export default function Anounces(props) {
	const {navigation} = props;
	const [user, setUser] = useState(null);
	const [anounces, setAnounces] = useState([]);
	const [totalAnounces, setTotalAnounces] = useState(0);
	const [startAnounce, setStartAnounce] = useState(null);
	const limit = 2;
	const data = {
		filter: {},
		search: {},
		fields: {},
		docsPerPage: limit,
		page: 0,
		population: [
			{
				path: 'images',
				fields: {
					url: true
				}
			}
		]
	};

	useEffect(() => {
		firebase.auth().onAuthStateChanged((userInfo) => {
			setUser(userInfo);
		});
	}, []);

	useEffect(() => {
		getList('anounces', data).then((result) => {
			setTotalAnounces(result.count);
			setAnounces(result.data);
			setStartAnounce(result.data[result.data.length - 1]);
		});
	}, []);
	console.log(anounces);
	console.log(startAnounce);
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

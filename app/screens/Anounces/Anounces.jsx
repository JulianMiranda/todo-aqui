import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {getList, getOne} from '../../api/dataProvider';

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

	/* useEffect(() => {
		(async () => {
			const data = {
				filter: {},
				search: {},
				fields: {},
				docsPerPage: 2,
				page: 0
			};
			const a = await getList('anounces', data);
			console.log(a); */
	/* getList('anounces', data)
				.then((res) => {
					console.log('Respuest de 2', res.data);
					return res;
				})
				.catch((err) => {
					return err;
				}); */
	/* setUserInfo(user); */
	/* })(); */
	/* setRealoadUserInfo(false); */
	/* }, []);
	 */
	/* useEffect(() => {
		(async () => { */
	/* const data = {
			filter: {},
			search: {},
			fields: {}
		}; */
	/* const data = {
				id: '5f0345b0b8484f103c980910'
			};

			await getOne('anounces', data)
				.then((res) => {
					console.log('ENTER THEN', res);
					return res;
				})
				.catch((err) => {
					return err;
				});
		})(); */
	/* console.log(a); */
	/* }, []); */

	useEffect(() => {
		firebase.auth().onAuthStateChanged((userInfo) => {
			setUser(userInfo);
		});
	}, []);
	/* useEffect(() => {
		getList('anounces', data).then((users) => console.log(users));
	}, []); */
	useEffect(() => {
		(async () => {
			await getList('anounces', data).then((users) => console.log(users));
			/* setAnounces(Object.keys(a.data) || []); */
		})();
	}, []);
	/* useEffect(() => {
		(async () => {
			const data = {
				filter: {},
				search: {},
				fields: {},
				docsPerPage: 2,
				page: 0
			};
			const a = await getList('anounces', data);
			console.log(a);
		})();
		setAnounces(a);
	}, []); */

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

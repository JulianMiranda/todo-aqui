import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {getList} from '../../api/dataProvider';
import ListAnounces from '../../components/Anounces/ListAnounces';

export default function Anounces(props) {
	const {navigation} = props;
	const [user, setUser] = useState(null);
	const [anounces, setAnounces] = useState([]);
	const [totalAnounces, setTotalAnounces] = useState(0);
	const [startAnounce, setStartAnounce] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const limit = 9;

	const data = {
		filter: {},
		search: {},
		fields: {},
		docsPerPage: limit,
		page: startAnounce,
		population: [
			{
				path: 'images',
				fields: {
					url: true
				}
			},
			{
				path: 'category',
				fields: {
					name: true
				}
			},
			{
				path: 'provider',
				fields: {
					name: true
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
			setStartAnounce(2);
		});
	}, []);
	const handleLoadMore = () => {
		anounces.length < totalAnounces && setIsLoading(true);
		getList('anounces', data).then((result) => {
			if (result.data.length > 0) {
				setStartAnounce(startAnounce + 1);
			} else {
				setIsLoading(false);
			}
			setAnounces([...anounces, ...result.data]);
		});
	};

	return (
		<View style={styles.viewBody}>
			<ListAnounces
				anounces={anounces}
				handleLoadMore={handleLoadMore}
				isLoading={isLoading}
			/>
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

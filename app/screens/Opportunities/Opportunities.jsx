import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {getList, Login} from '../../api/dataProvider';
import ListOpportunities from '../../components/Opportunities/ListOpportunities';
import * as SecureStore from 'expo-secure-store';

export default function Opportunities(props) {
	const {navigation} = props;
	const [userId, setUserId] = useState(null);
	const [opportunities, setOpportunities] = useState([]);
	const [totalOpportunities, setTotalOpportunities] = useState(0);
	const [startOpportunity, setStartOpportunity] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const limit = 9;
	SecureStore.getItemAsync('userId').then((result) => setUserId(result));
	const data = {
		filter: {user: ['=', userId]},
		search: {},
		fields: {},
		docsPerPage: limit,
		page: startOpportunity,
		population: [
			{
				path: 'images',
				fields: {
					url: true
				}
			},
			{
				path: 'anounce',
				fields: {
					title: true,
					images: true
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
	useFocusEffect(
		useCallback(() => {
			{
				userId &&
					getList('opportunities', data).then((result) => {
						setTotalOpportunities(result.count);
						setOpportunities(result.data);
						setStartOpportunity(2);
					});
			}
		}, [userId])
	);

	const handleLoadMore = () => {
		opportunities.length < totalOpportunities && setIsLoading(true);
		getList('opportunities', data).then((result) => {
			if (result.data.length > 0) {
				setStartOpportunity(startOpportunity + 1);
			} else {
				setIsLoading(false);
			}
			setOpportunities([...opportunities, ...result.data]);
		});
	};

	return (
		<View style={styles.viewBody}>
			<ListOpportunities
				opportunities={opportunities}
				handleLoadMore={handleLoadMore}
				isLoading={isLoading}
			/>
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

import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {getList, Login} from '../../api/dataProvider';
import ListOpportunities from '../../components/Opportunities/ListOpportunities';

export default function Opportunities(props) {
	const {navigation} = props;
	const [userMongo, setUserMongo] = useState(null);
	const [opportunities, setOpportunities] = useState([]);
	const [totalOpportunities, setTotalOpportunities] = useState(0);
	const [startOpportunity, setStartOpportunity] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const limit = 9;

	const data = {
		filter: {user: ['=', userMongo]},
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
					title: true
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
		(async () => {
			firebase.auth().onAuthStateChanged(async (user) => {
				if (user) {
					const {claims} = await user.getIdTokenResult();
					setUserMongo(claims.mongoId);
				} else {
					console.log('Error al conectarse a Firebase');
				}
			});
		})();
	}, []);

	useFocusEffect(
		useCallback(() => {
			{
				userMongo &&
					getList('opportunities', data).then((result) => {
						setTotalOpportunities(result.count);
						setOpportunities(result.data);
						setStartOpportunity(2);
					});
			}
		}, [userMongo])
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

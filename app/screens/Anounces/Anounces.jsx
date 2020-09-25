import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, Button, ScrollView, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {getList, getListNoAuth} from '../../api/dataProvider';
import ListAnounces from '../../components/Anounces/ListAnounces';

export default function Anounces(props) {
	const {navigation} = props;
	const [user, setUser] = useState(null);
	const [anounces, setAnounces] = useState([]);
	const [totalAnounces, setTotalAnounces] = useState(0);
	const [startAnounce, setStartAnounce] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [category, setCategory] = useState(null);
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

	useFocusEffect(
		useCallback(() => {
			getListNoAuth('anounces', data).then((result) => {
				setTotalAnounces(result.count);
				setAnounces(result.data);
				setStartAnounce(2);
			});
		}, [])
	);

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
			<Image
				source={require('../../../assets/img/desktop.png')}
				resizeMode="contain"
				style={styles.image}
			/>

			<View style={styles.viewUserInfo}>
				<View
					style={{
						alignItems: 'center',
						marginRight: 10,
						justifyContent: 'center'
					}}
				>
					<Icon
						raised
						size={30}
						type="material-community"
						name="format-paint"
						onPress={() =>
							navigation.navigate('anounces-filtered', {
								category: '5f4ae64734bd222b049cda69'
							})
						}
					/>

					<Text style={{}}>Pintura</Text>
				</View>
				<View
					style={{
						alignItems: 'center',
						marginRight: 10,
						justifyContent: 'center'
					}}
				>
					<Icon
						raised
						size={30}
						type="material-community"
						name="hard-hat"
						/* iconStyle={styles.btnContainer} */
						onPress={() =>
							navigation.navigate('anounces-filtered', {
								category: '5f6662de22b42f00173760be'
							})
						}
					/>
					<Text>Plomería</Text>
				</View>
				<View style={{alignItems: 'center', justifyContent: 'center'}}>
					<Icon
						raised
						size={30}
						type="material-community"
						name="cellphone-link"
						/* iconStyle={styles.btnContainer} */
						onPress={() =>
							navigation.navigate('anounces-filtered', {
								category: '5f69214ea207370017519da7'
							})
						}
					/>
					<Text>Electrónica</Text>
				</View>
			</View>
			<Text style={{textAlign: 'center', paddingTop: 15, fontWeight: 'bold'}}>
				{' '}
				Puede ser de tu interés
			</Text>
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
function UserNoLogged(props) {
	const {navigation} = props;

	return (
		<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
			<Icon type="material-community" name="alert-outline" size={50} />
			<Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>
				Necesitas estar logeado para ver esta sección
			</Text>
			<Button
				title="Ir al login"
				containerStyle={{marginTop: 20, width: '80%'}}
				buttonStyle={{backgroundColor: '#00a680'}}
				onPress={() => navigation.navigate('account', {screen: 'login'})}
			/>
		</View>
	);
}
const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff'
	},
	scrollView: {
		/* position: 'absolute', */
		height: '100%'
	},
	viewUserInfo: {
		alignItems: 'flex-start',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: '#f2f2f2',
		/* paddingTop: 10, */
		paddingBottom: 10
	},
	btnContainer: {
		position: 'absolute',
		bottom: 10,
		right: 10,
		shadowColor: 'black',
		shadowOffset: {width: 2, height: 2},
		shadowOpacity: 0.5
	},
	image: {
		height: 250,
		width: '100%'
	},
	iconRigth: {
		backgroundColor: 'white',
		borderRadius: 15,
		marginLeft: 40,
		width: 50,
		fontSize: 45
	}
});

import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text, ScrollView, Image} from 'react-native';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import {getList, getListNoAuth} from '../../api/dataProvider';
import ListAnounces from '../../components/Anounces/ListAnounces';
import Iconos from '../../components/Anounces/Iconos';

export default function AnouncesFiltered(props) {
	const {navigation, route} = props;
	const {category} = route.params;
	const [user, setUser] = useState(null);
	const [anounces, setAnounces] = useState([]);
	const [totalAnounces, setTotalAnounces] = useState(0);
	const [categories, setCategories] = useState([]);
	const [totalCategories, setTotalCategories] = useState(0);
	const [startAnounce, setStartAnounce] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState();
	const limit = 9;

	const dataCat = {
		population: [
			{
				path: 'image',
				fields: {
					url: true
				}
			}
		]
	};
	const data = {
		filter: {category: ['=', `${category}`]},
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
		getList('categories', dataCat).then((result) => {
			const a = result.data.filter((item) => category === item.id);
			setImageUrl(a[0].image.url);
			setTotalCategories(result.count);
			setCategories(a);
		});
	}, []);

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
			{/* <Text style={styles.text}> Que estas Buscando</Text> */}
			<View style={styles.Img}>
				<Iconos categories={categories} />
				<Image
					source={
						imageUrl
							? {uri: imageUrl}
							: require('../../../assets/img/no-image.png')
					}
					/* source={{uri: 'https://source.unsplash.com/200x100/'}} */
					resizeMode="contain"
					style={styles.image}
				/>
			</View>
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
	Img: {
		alignItems: 'center',
		justifyContent: 'center'
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
		paddingTop: 10,
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
		height: 230,
		opacity: 0.25,
		width: '100%',
		marginBottom: 25
	},
	iconRigth: {
		backgroundColor: 'white',
		borderRadius: 15,
		marginLeft: 40,
		width: 50,
		fontSize: 45
	}
});

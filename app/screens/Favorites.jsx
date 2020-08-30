import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
	Alert
} from 'react-native';
import {Image, Icon, Button} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import Loading from '../components/Loading';
import {Update, getOne} from '../api/dataProvider';

import {firebaseApp} from '../utils/firebase';
import firebase from 'firebase';

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {
	const {navigation} = props;
	const [restaurants, setRestaurants] = useState(null);
	const [anounces, setAnounces] = useState(null);
	const [userLogged, setUserLogged] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [reloadData, setReloadData] = useState(false);
	const [userMongo, setUserMongo] = useState(null);
	const toastRef = useRef();

	firebase.auth().onAuthStateChanged((user) => {
		user ? setUserLogged(true) : setUserLogged(false);
	});

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
			if (userLogged && userMongo) {
				getOne('users', userMongo).then((user) => {
					setAnounces(user.preferences);
				});
			}
			setReloadData(false);
		}, [userLogged, userMongo, reloadData])
	);

	if (!userLogged) {
		return <UserNoLogged navigation={navigation} />;
	}

	if (anounces?.length === 0) {
		return <NotFoundAnounces />;
	}

	return (
		<View style={styles.viewBody}>
			{anounces ? (
				<FlatList
					data={anounces}
					renderItem={(anounce) => (
						<Anounce
							userMongo={userMongo}
							anounce={anounce}
							setIsLoading={setIsLoading}
							toastRef={toastRef}
							setReloadData={setReloadData}
							navigation={navigation}
						/>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			) : (
				<View style={styles.loaderRestaurants}>
					<ActivityIndicator size="large" />
					<Text style={{textAlign: 'center'}}>Cargando anuncios</Text>
				</View>
			)}
			<Toast ref={toastRef} position="center" opacity={0.9} />
			<Loading text="Eliminando anuncio" isVisible={isLoading} />
		</View>
	);
}

function NotFoundAnounces() {
	return (
		<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
			<Icon type="material-community" name="alert-outline" size={50} />
			<Text style={{fontSize: 20, fontWeight: 'bold'}}>
				No tienes anuncios favoritos en tu lista
			</Text>
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

function Anounce(props) {
	const {
		anounce,
		userMongo,
		setIsLoading,
		toastRef,
		setReloadData,
		navigation
	} = props;
	const {category, provider, ratingAvg, title, id, name, images} = anounce.item;

	const confirmRemoveFavorite = () => {
		Alert.alert(
			'Eliminar Anuncio de Favoritos',
			'¿Estas seguro de que quieres eliminar el anuncio de favoritos?',
			[
				{
					text: 'Cancelar',
					style: 'cancel'
				},
				{
					text: 'Eliminar',
					onPress: removeFavorite
				}
			],
			{cancelable: false}
		);
	};

	const removeFavorite = () => {
		setIsLoading(true);
		const paylod = {
			delete_preferences: id
		};
		Update('users', paylod, userMongo)
			.then((res) => {
				setIsLoading(false);
				setReloadData(true);
				toastRef.current.show('Anuncio eliminado correctamente');
				return res;
			})
			.catch((err) => {
				setIsLoading(false);
				toastRef.current.show('Error al eliminar el anuncio');
			});
	};

	return (
		<View style={styles.anounce}>
			<TouchableOpacity
				onPress={() =>
					navigation.navigate('anounces', {
						screen: 'anounce',
						params: {id}
					})
				}
			>
				<Image
					resizeMode="cover"
					style={styles.image}
					PlaceholderContent={<ActivityIndicator color="#fff" />}
					source={
						images[0].url
							? {uri: images[0].url}
							: require('../../assets/img/no-image.png')
					}
				/>
				<View style={styles.info}>
					<Text style={styles.name}>{title}</Text>
					<Icon
						type="material-community"
						name="heart"
						color="#00a680"
						containerStyle={styles.favorite}
						onPress={confirmRemoveFavorite}
						underlayColor="transparent"
					/>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#f2f2f2'
	},
	loaderRestaurants: {
		marginTop: 10,
		marginBottom: 10
	},
	anounce: {
		margin: 10
	},
	image: {
		width: '100%',
		height: 180
	},
	info: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'row',
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 10,
		paddingBottom: 10,
		marginTop: -30,
		backgroundColor: '#fff'
	},
	name: {
		fontWeight: 'bold',
		fontSize: 30
	},
	favorite: {
		marginTop: -35,
		backgroundColor: '#fff',
		padding: 15,
		borderRadius: 100
	}
});

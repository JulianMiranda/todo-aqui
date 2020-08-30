import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, ScrollView, View, Text, Dimensions} from 'react-native';
import {Rating, ListItem, Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {map} from 'lodash';
import {getOne} from '../../api/dataProvider';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import ListReviews from '../../components/Anounces/ListReviews';
import {Update} from '../../api/dataProvider';
import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
const screensWidth = Dimensions.get('window').width;

export default function Anounce(props) {
	const {navigation, route} = props;
	const {id, title} = route.params;
	const [anounce, setAnounce] = useState(null);
	const [rating, setRating] = useState(0);
	const [isPreference, setIsPreference] = useState(false);
	const [userLogged, setUserLogged] = useState(false);
	const [userMongo, setUserMongo] = useState(null);
	const toastRef = useRef();

	navigation.setOptions({title: title});
	firebase.auth().onAuthStateChanged((user) => {
		user ? setUserLogged(true) : setUserLogged(false);
	});
	useEffect(() => {
		(async () => {
			firebase.auth().onAuthStateChanged(async (user) => {
				if (user) {
					const {claims} = await user.getIdTokenResult();
					/* setUserRole(claims.role); */
					setUserMongo(claims.mongoId);
				} else {
					console.log('Error al conectarse a Firebase');
				}
			});
		})();
	}, []);

	useFocusEffect(
		useCallback(() => {
			getOne('anounces', id).then((anounce) => {
				setAnounce(anounce);
				if (anounce.ratingAvg) setRating(anounce.ratingAvg);
			});
		}, [])
	);
	useEffect(() => {
		if (userLogged && anounce) {
			getOne('users', userMongo).then((user) => {
				const preferences = user.preferences;
				const inFav = preferences.filter((pref) => pref === anounce.id);
				if (inFav.length === 1) {
					setIsPreference(true);
				}
			});
		}
	}, [userLogged, anounce]);

	const addFavorite = () => {
		if (!userLogged) {
			toastRef.current.show(
				'Para usar el sistema de favoritos tienes que estar logeado'
			);
		} else {
			const payload = {
				preferences: anounce.id
			};
			Update('users', payload, userMongo)
				.then((res) => {
					setIsPreference(true);
					toastRef.current.show('Anuncio añadido a favoritos');

					return res;
				})
				.catch((err) => {
					toastRef.current.show('Error al añadir el anuncio a favoritos');

					return err;
				});
		}
	};

	const removeFavorite = () => {
		const payload = {
			preferences: ''
		};
		Update('users', payload, userMongo)
			.then((res) => {
				setIsPreference(false);
				toastRef.current.show('Anuncio eliminado de favoritos');
				return res;
			})
			.catch((err) => {
				toastRef.current.show('Error al eliminar el anuncio a favoritos');
				return err;
			});
	};

	if (!anounce) return <Loading isVisible={true} text="Cargando" />;
	return (
		<ScrollView vertical style={styles.viewBody}>
			<View style={styles.viewFavorite}>
				<Icon
					type="material-community"
					name={isPreference ? 'heart' : 'heart-outline'}
					onPress={isPreference ? removeFavorite : addFavorite}
					color={isPreference ? '#f00' : '#000'}
					size={35}
					underlayColor="transparent"
				/>
			</View>
			<Carousel
				arrayImages={anounce.images}
				height={250}
				width={screensWidth}
			/>
			<TitleAnounce
				title={anounce.title}
				description={anounce.description}
				rating={rating}
			/>
			<AnounceInfo
				title={anounce.title}
				provider={anounce.provider.name}
				category={anounce.category.name}
			/>
			<ListReviews navigation={navigation} idAnounce={id} />
			<Toast ref={toastRef} position="center" opacity={0.9} />
		</ScrollView>
	);
}

function TitleAnounce(props) {
	const {title, description, rating} = props;
	return (
		<View style={styles.viewAnounceTitle}>
			<View style={{flexDirection: 'row'}}>
				<Text style={styles.titleAnounce}>{title}</Text>
				<Rating
					style={styles.rating}
					imageSize={20}
					readonly
					startingValue={parseFloat(rating)}
				/>
			</View>
			<Text style={styles.descriptionAnounce}>{description}</Text>
		</View>
	);
}
function AnounceInfo(props) {
	const {title, provider, category} = props;

	const listInfo = [
		{
			text: provider,
			iconName: 'phone',
			iconType: 'material-community',
			action: null
		},
		{
			text: category,
			iconName: 'account-circle',
			iconType: 'material-community',
			action: null
		}
	];

	return (
		<View style={styles.viewAnounceInfo}>
			<Text style={styles.anounceInfoTitle}>Información sobre el Anuncio</Text>

			{map(listInfo, (item, index) => (
				<ListItem
					key={index}
					title={item.text}
					leftIcon={{
						name: item.iconName,
						type: item.iconType,
						color: '#00a680'
					}}
					containerStyle={styles.containerListItem}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff'
	},
	viewAnounceTitle: {
		padding: 15
	},
	titleAnounce: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	descriptionAnounce: {
		marginTop: 5,
		color: 'grey'
	},
	rating: {
		position: 'absolute',
		right: 0
	},
	viewAnounceInfo: {
		margin: 15,
		marginTop: 25
	},
	anounceInfoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	viewFavorite: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 2,
		backgroundColor: '#fff',
		borderBottomLeftRadius: 100,
		padding: 5,
		paddingLeft: 15
	}
});

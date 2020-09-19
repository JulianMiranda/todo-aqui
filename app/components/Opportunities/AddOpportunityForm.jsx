import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, Alert, Dimensions} from 'react-native';
import {Icon, Avatar, Image, Input, Button} from 'react-native-elements';
import {map, size, filter} from 'lodash';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {uploadImageStorage} from '../../utils/uploadImageFb'; /* 
import Map from '../../components/Map'; */
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Modal from '../Modal';

import {Create} from '../../api/dataProvider';

const widthScreen = Dimensions.get('window').width;
export default function AddOpportunityForm(props) {
	const {
		toastRef,
		idAnounce,
		title,
		provider,
		userId,
		setIsLoading,
		navigation
	} = props;
	/* const [opportunityName, setOpportunityName] = useState(''); */
	const [opportunityDescription, setOpportunityDescription] = useState('');
	const [opportunityCategory, setOpportunityCategory] = useState('');
	const [imagesSelected, setImagesSelected] = useState([]);
	const [restaurantAddress, setRestaurantAddress] = useState('');
	const [isVisibleMap, setIsVisibleMap] = useState(false);
	const [locationRestaurant, setLocationRestaurant] = useState(null);

	const addOpportunity = () => {
		if (!opportunityDescription || !restaurantAddress || !opportunityCategory) {
			toastRef.current.show('Todos los campos del formulario son obligatorios');
		} else if (size(imagesSelected) === 0) {
			toastRef.current.show('La negociación tiene que tener almenos una foto');
		} else {
			setIsLoading(true);

			uploadImageStorage(imagesSelected, 'opportunities')
				.then((response) => {
					let object = {};
					if (response.length > 0) {
						object = response.map((url) => ({
							url
						}));
					}

					const data = {
						state: 'OPP',
						title: title,
						description: opportunityDescription,
						user: userId,
						anounce: idAnounce,
						provider: provider,
						coordinates: [
							locationRestaurant.latitude,
							locationRestaurant.longitude
						],
						images: object
					};

					Create('opportunities', data)
						.then((res) => {
							return res;
						})
						.catch((err) => {
							return err;
						});
					setIsLoading(false);
					navigation.goBack();
				})
				.catch(() => {
					setIsLoading(false);
					toastRef.current.show(
						'Error al enviar sus condiciones, intentelo más tarde'
					);
				});
		}
	};

	return (
		<ScrollView style={styles.scrollView}>
			<ImageOpportunity imagenOpportunity={imagesSelected[0]} />
			<FormAdd
				/* setOpportunityName={setOpportunityName} */
				setOpportunityDescription={setOpportunityDescription}
				setOpportunityCategory={setOpportunityCategory}
				setRestaurantAddress={setRestaurantAddress}
				setIsVisibleMap={setIsVisibleMap}
				locationRestaurant={locationRestaurant}
			/>
			<UploadImage
				toastRef={toastRef}
				imagesSelected={imagesSelected}
				setImagesSelected={setImagesSelected}
			/>
			<Button
				title="Enviar a Proveedor"
				onPress={addOpportunity}
				buttonStyle={styles.btnAddOpportunity}
			/>
			<Map
				isVisibleMap={isVisibleMap}
				setIsVisibleMap={setIsVisibleMap}
				setLocationRestaurant={setLocationRestaurant}
				toastRef={toastRef}
			/>
		</ScrollView>
	);
}

function ImageOpportunity(props) {
	const {imagenOpportunity} = props;

	return (
		<View style={styles.viewPhoto}>
			<Image
				source={
					imagenOpportunity
						? {uri: imagenOpportunity}
						: require('../../../assets/img/no-image.png')
				}
				style={{width: widthScreen, height: 200}}
			/>
		</View>
	);
}

function FormAdd(props) {
	const {
		setOpportunityDescription,
		setOpportunityCategory,
		setRestaurantAddress,
		setIsVisibleMap,
		locationRestaurant
	} = props;

	return (
		<View style={styles.viewForm}>
			{/* <Input
				placeholder="Título del oportunidad"
				containerStyle={styles.input}
				onChange={(e) => setOpportunityName(e.nativeEvent.text)}
			/> */}
			<Input
				placeholder="Descripción del trabajo a realizar"
				multiline={true}
				inputContainerStyle={styles.textArea}
				onChange={(e) => setOpportunityDescription(e.nativeEvent.text)}
			/>
			<Input
				placeholder="Precio ofrecido"
				inputContainerStyle={styles.textArea}
				onChange={(e) => setOpportunityCategory(e.nativeEvent.text)}
			/>
			<Input
				placeholder="Dirección"
				containerStyle={styles.input}
				onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
				rightIcon={{
					type: 'material-community',
					name: 'google-maps',
					color: locationRestaurant ? '#00a680' : '#c2c2c2',
					onPress: () => setIsVisibleMap(true)
				}}
			/>
		</View>
	);
}

function Map(props) {
	const {
		isVisibleMap,
		setIsVisibleMap,
		setLocationRestaurant,
		toastRef
	} = props;
	const [location, setLocation] = useState(null);

	useEffect(() => {
		(async () => {
			const resultPermissions = await Permissions.askAsync(
				Permissions.LOCATION
			);
			const statusPermissions = resultPermissions.permissions.location.status;

			if (statusPermissions !== 'granted') {
				toastRef.current.show(
					'Tienes que aceptar los permisos de localizacion para crear un restaurante',
					3000
				);
			} else {
				const loc = await Location.getCurrentPositionAsync({});
				setLocation({
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001
				});
			}
		})();
	}, []);

	const confirmLocation = () => {
		setLocationRestaurant(location);
		toastRef.current.show('Localizacion guardada correctamente');
		setIsVisibleMap(false);
	};

	return (
		<Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
			<View>
				{location && (
					<MapView
						style={styles.mapStyle}
						initialRegion={location}
						showsUserLocation={true}
						onRegionChange={(region) => setLocation(region)}
					>
						<MapView.Marker
							coordinate={{
								latitude: location.latitude,
								longitude: location.longitude
							}}
							draggable
						/>
					</MapView>
				)}
				<View style={styles.viewMapBtn}>
					<Button
						title="Guardar Ubicacion"
						containerStyle={styles.viewMapBtnContainerSave}
						buttonStyle={styles.viewMapBtnSave}
						onPress={confirmLocation}
					/>
					<Button
						title="Cancelar Ubicacion"
						containerStyle={styles.viewMapBtnContainerCancel}
						buttonStyle={styles.viewMapBtnCancel}
						onPress={() => setIsVisibleMap(false)}
					/>
				</View>
			</View>
		</Modal>
	);
}

function UploadImage(props) {
	const {toastRef, imagesSelected, setImagesSelected} = props;

	const imageSelect = async () => {
		const resultPermissions = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		);

		if (resultPermissions === 'denied') {
			toastRef.current.show(
				'Es necesario aceptar los permisos de la galeria, si los has rechazado tienes que ir ha ajustes y activarlos manualmente.',
				3000
			);
		} else {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3]
			});

			if (result.cancelled) {
				toastRef.current.show(
					'Has cerrado la galeria sin seleccionar ninguna imagen',
					2000
				);
			} else {
				setImagesSelected([...imagesSelected, result.uri]);
			}
		}
	};

	const removeImage = (image) => {
		Alert.alert(
			'Eliminar Imagen',
			'¿Estas seguro de que quieres eliminar la imagen?',
			[
				{
					text: 'Cancel',
					style: 'cancel'
				},
				{
					text: 'Eliminar',
					onPress: () => {
						setImagesSelected(
							filter(imagesSelected, (imageUrl) => imageUrl !== image)
						);
					}
				}
			],
			{cancelable: false}
		);
	};

	return (
		<View style={styles.viewImages}>
			{size(imagesSelected) < 4 && (
				<Icon
					type="material-community"
					name="camera"
					color="#7a7a7a"
					containerStyle={styles.containerIcon}
					onPress={imageSelect}
				/>
			)}
			{map(imagesSelected, (image, index) => (
				<Avatar
					key={index}
					style={styles.miniatureStyle}
					source={{uri: image}}
					onPress={() => removeImage(image)}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	scrollView: {
		height: '100%'
	},
	viewForm: {
		marginLeft: 10,
		marginRight: 10
	},
	input: {
		marginBottom: 10
	},
	textArea: {
		height: 100,
		width: '100%',
		padding: 0,
		margin: 0
	},
	btnAddOpportunity: {
		backgroundColor: '#00a680',
		margin: 20
	},
	viewImages: {
		flexDirection: 'row',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 30
	},
	containerIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		height: 70,
		width: 70,
		backgroundColor: '#e3e3e3'
	},
	miniatureStyle: {
		width: 70,
		height: 70,
		marginRight: 10
	},
	viewPhoto: {
		alignItems: 'center',
		height: 200,
		marginBottom: 20
	},
	mapStyle: {
		width: '100%',
		height: 550
	},
	viewMapBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 10
	},
	viewMapBtnContainerCancel: {
		paddingLeft: 5
	},
	viewMapBtnCancel: {
		backgroundColor: '#a60d0d'
	},
	viewMapBtnContainerSave: {
		paddingRight: 5
	},
	viewMapBtnSave: {
		backgroundColor: '#00a680'
	}
});

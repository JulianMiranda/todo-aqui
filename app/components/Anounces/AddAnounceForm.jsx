import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, Alert, Dimensions} from 'react-native';
import {Icon, Avatar, Image, Input, Button} from 'react-native-elements';
import {map, size, filter} from 'lodash';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import {uploadImageStorage} from '../../utils/uploadImageFb';

import {Create} from '../../api/dataProvider';

const widthScreen = Dimensions.get('window').width;
export default function AddRestaurantForm(props) {
	const {toastRef, setIsLoading, navigation} = props;
	const [anounceName, setAnounceName] = useState('');
	const [anounceDescription, setAnounceDescription] = useState('');
	const [anounceCategory, setAnounceCategory] = useState('');
	const [imagesSelected, setImagesSelected] = useState([]);

	const addAnounce = () => {
		if (!anounceName || !anounceDescription || !anounceCategory) {
			toastRef.current.show('Todos los campos del formulario son obligatorios');
		} else if (size(imagesSelected) === 0) {
			toastRef.current.show('El restaurante tiene que tener almenos una foto');
		} else {
			setIsLoading(true);

			uploadImageStorage(imagesSelected, 'anounces')
				.then((response) => {
					let object = {};
					if (response.length > 0) {
						object = response.map((url) => ({
							url
						}));
					}

					const data = {
						title: anounceName,
						description: anounceDescription,
						provider: '5ee0fc72dd979500172996d3',
						category: '5f4ae64734bd222b049cda69',
						images: object
					};

					Create('anounces', data)
						.then((res) => {
							return res;
						})
						.catch((err) => {
							return err;
						});
					setIsLoading(false);
					navigation.navigate('anounces');
				})
				.catch(() => {
					setIsLoading(false);
					toastRef.current.show(
						'Error al subir el anuncio, intentelo más tarde'
					);
				});
		}
	};

	return (
		<ScrollView style={styles.scrollView}>
			<ImageAnounce imagenAnounce={imagesSelected[0]} />
			<FormAdd
				setAnounceName={setAnounceName}
				setAnounceDescription={setAnounceDescription}
				setAnounceCategory={setAnounceCategory}
			/>
			<UploadImage
				toastRef={toastRef}
				imagesSelected={imagesSelected}
				setImagesSelected={setImagesSelected}
			/>
			<Button
				title="Crear Anuncio"
				onPress={addAnounce}
				buttonStyle={styles.btnAddAnounce}
			/>
		</ScrollView>
	);
}

function ImageAnounce(props) {
	const {imagenAnounce} = props;

	return (
		<View style={styles.viewPhoto}>
			<Image
				source={
					imagenAnounce
						? {uri: imagenAnounce}
						: require('../../../assets/img/no-image.png')
				}
				style={{width: widthScreen, height: 200}}
			/>
		</View>
	);
}

function FormAdd(props) {
	const {setAnounceName, setAnounceDescription, setAnounceCategory} = props;

	return (
		<View style={styles.viewForm}>
			<Input
				placeholder="Título del anuncio"
				containerStyle={styles.input}
				onChange={(e) => setAnounceName(e.nativeEvent.text)}
			/>
			<Input
				placeholder="Descripcion del anuncio"
				multiline={true}
				inputContainerStyle={styles.textArea}
				onChange={(e) => setAnounceDescription(e.nativeEvent.text)}
			/>
			<Input
				placeholder="Categoría"
				multiline={true}
				inputContainerStyle={styles.textArea}
				onChange={(e) => setAnounceCategory(e.nativeEvent.text)}
			/>
		</View>
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
	btnAddAnounce: {
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

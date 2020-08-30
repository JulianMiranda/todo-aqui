import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {AirbnbRating, Button, Input} from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import {Update} from '../../api/dataProvider';

import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';

export default function AddReviewAnounce(props) {
	const {navigation, route} = props;
	const {idAnounce} = route.params;
	const [userRole, setUserRole] = useState(null);
	const [userMongo, setUserMongo] = useState(null);

	const [rating, setRating] = useState(null);
	const [comments, setComments] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const toastRef = useRef();

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

	const addRevew = async () => {
		if (!rating) {
			toastRef.current.show('No has dado ninguna putuación');
		} else {
			setIsLoading(true);
			const paylod = {
				rating: rating
			};
			Update('anounces', paylod, idAnounce)
				.then((res) => {
					return res;
				})
				.catch((err) => {
					toastRef.current.show('Error al enviar la review');
					setIsLoading(false);
					return err;
				});
			setIsLoading(false);
			navigation.goBack();
			/* db.collection('reviews')
				.add(paylod)
				.then(() => {
					updateRestaurant();
				})
				.catch(() => {
					toastRef.current.show('Error al enviar la review');
					setIsLoading(false);
				}); */
		}
	};

	/* const updateRestaurant = () => {
    const restaurantRef = db.collection("restaurants").doc(idRestaurant);

    restaurantRef.get().then((response) => {
      const restaurantData = response.data();
      const ratingTotal = restaurantData.ratingTotal + rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    });
  }; */

	return (
		<View style={styles.viewBody}>
			<View style={styles.viewRating}>
				<AirbnbRating
					count={5}
					reviews={['Pésimo', 'Deficiente', 'Normal', 'Muy Bueno', 'Excelente']}
					defaultRating={0}
					size={35}
					onFinishRating={(value) => {
						setRating(value);
					}}
				/>
			</View>
			<View style={styles.formReview}>
				<Input
					placeholder="Comentario..."
					multiline={true}
					inputContainerStyle={styles.textArea}
					onChange={(e) => setComments(e.nativeEvent.text)}
				/>
				<Button
					title="Enviar Comnetario"
					containerStyle={styles.btnContainer}
					buttonStyle={styles.btn}
					onPress={addRevew}
				/>
			</View>
			<Toast ref={toastRef} position="center" opacity={0.9} />
			<Loading isVisible={isLoading} text="Enviando comenario" />
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1
	},
	viewRating: {
		height: 110,
		backgroundColor: '#f2f2f2'
	},
	formReview: {
		flex: 1,
		alignItems: 'center',
		margin: 10,
		marginTop: 40
	},
	input: {
		marginBottom: 10
	},
	textArea: {
		height: 150,
		width: '100%',
		padding: 0,
		margin: 0
	},
	btnContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		marginTop: 20,
		marginBottom: 10,
		width: '95%'
	},
	btn: {
		backgroundColor: '#00a680'
	}
});

import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, Avatar, Rating} from 'react-native-elements';
import {map} from 'lodash';
import {getOne} from '../../api/dataProvider';

import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
	const {navigation, idAnounce} = props;
	const [userLogged, setUserLogged] = useState(false);
	const [reviews, setReviews] = useState([]);
	const [ratingAvg, setRatingAvg] = useState(0);
	/* console.log(userLogged); */
	firebase.auth().onAuthStateChanged((user) => {
		user ? setUserLogged(true) : setUserLogged(false);
	});

	useEffect(() => {
		console.log('Effect');
		const id = '';
		getOne('anounces', idAnounce).then((result) => {
			setReviews(result.comments);
		});
	}, []);
	console.log(reviews);
	return (
		<View>
			{userLogged ? (
				<Button
					title="Escribe una opinión"
					buttonStyle={styles.btnAddReview}
					titleStyle={styles.btnTitleAddReview}
					icon={{
						type: 'material-community',
						name: 'square-edit-outline',
						color: '#00a680'
					}}
					onPress={() =>
						navigation.navigate('add-review-anounce', {
							idAnounce: idAnounce
						})
					}
				/>
			) : (
				<View>
					<Text
						style={{textAlign: 'center', color: '#00a680', padding: 20}}
						onPress={() => navigation.navigate('login')}
					>
						Para escribir un comentario es necesario estar logeado{' '}
						<Text style={{fontWeight: 'bold'}}>
							pulsa AQUÍ para iniciar sesión
						</Text>
					</Text>
				</View>
			)}

			{map(reviews, (review, index) => (
				<Review key={index} review={review} rating={ratingAvg} />
			))}
		</View>
	);
}

function Review(props) {
	const {review} = props;
	const {rating} = props.review;

	const createReview = new Date();

	return (
		<View style={styles.viewReview}>
			<View style={styles.viewImageAvatar}>
				<Avatar
					size="large"
					rounded
					containerStyle={styles.imageAvatarUser}
					source={require('../../../assets/img/avatar-default.jpg')}
				/>
			</View>
			<View style={styles.viewInfo}>
				<Text style={styles.reviewTitle}>Review</Text>
				<Text style={styles.reviewText}>{review}</Text>
				<Rating imageSize={15} startingValue={rating} readonly />
				<Text style={styles.reviewDate}>
					{createReview.getDate()}/{createReview.getMonth() + 1}/
					{createReview.getFullYear()}
				</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	btnAddReview: {
		backgroundColor: 'transparent'
	},
	btnTitleAddReview: {
		color: '#00a680'
	},
	viewReview: {
		flexDirection: 'row',
		padding: 10,
		paddingBottom: 20,
		borderBottomColor: '#e3e3e3',
		borderBottomWidth: 1
	},
	viewImageAvatar: {
		marginRight: 15
	},
	imageAvatarUser: {
		width: 50,
		height: 50
	},
	viewInfo: {
		flex: 1,
		alignItems: 'flex-start'
	},
	reviewTitle: {
		fontWeight: 'bold'
	},
	reviewText: {
		paddingTop: 2,
		color: 'grey',
		marginBottom: 5
	},
	reviewDate: {
		marginTop: 5,
		color: 'grey',
		fontSize: 12,
		position: 'absolute',
		right: 0,
		bottom: 0
	}
});

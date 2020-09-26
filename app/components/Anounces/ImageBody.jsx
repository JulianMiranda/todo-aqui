import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	Image,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import {Tile} from 'react-native-elements';
import {size} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import Iconos from './Iconos';

export default function ImageBody(props) {
	const {categories, imageUrl, isLoading} = props;
	const navigation = useNavigation();
	const a = {};
	if (categories.length !== 0) {
		a.name = categories[0].name;
	}
	return (
		<View>
			{size(categories) > 0 ? (
				<View style={styles.Img}>
					<Tile
						imageSrc={
							imageUrl
								? {uri: imageUrl}
								: require('../../../assets/img/no-image.png')
						}
						featured
						imageProps={{PlaceholderContent: <ActivityIndicator />}}
						containerStyle={{marginStart: 5, height: 10, opacity: 0.25}}
						titleStyle={{fontSize: 42, color: '#666660', fontWeight: 'bold'}}
						height={160}
						width={'98%'}
					/>
					<Iconos categories={categories} />
				</View>
			) : (
				<View style={styles.loaderAnounces}>
					<ActivityIndicator size="large" />
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	Img: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	loaderAnounces: {
		height: 50,
		marginTop: 100,
		marginBottom: 10,
		alignItems: 'center'
	},
	viewAnounce: {
		flexDirection: 'row',
		margin: 10
	},
	viewAnounceImage: {
		marginRight: 15
	},
	imageRestaurant: {
		width: 100,
		height: 100
	},
	anounceName: {
		fontWeight: 'bold'
	},
	anounceCategory: {
		paddingTop: 2,
		color: 'grey'
	},
	anounceDescription: {
		paddingTop: 2,
		color: 'grey',
		width: 300
	},
	notFoundRestaurants: {
		marginTop: 10,
		marginBottom: 20,
		alignItems: 'center'
	},
	image: {
		height: 230,
		opacity: 0.25,
		width: '100%',
		marginBottom: 25,
		position: 'relative'
	}
});

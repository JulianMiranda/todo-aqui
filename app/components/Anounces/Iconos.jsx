import React, {useState} from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import {Image} from 'react-native-elements';
import {size} from 'lodash';
import {useNavigation} from '@react-navigation/native';

export default function Iconos(props) {
	const {categories} = props;

	const navigation = useNavigation();
	const [x, setX] = useState();
	const a = {};
	if (categories.length !== 0) {
		a.name = categories[0].name;
	}
	return (
		<View>
			<Text style={styles.text}>{a.name ? a.name : ''}</Text>
		</View>
	);
}
const styles = StyleSheet.create({
	text: {
		/* position: 'absolute', */
		marginRight: 30,
		fontSize: 30
	},
	loaderAnounces: {
		marginTop: 10,
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
	}
});

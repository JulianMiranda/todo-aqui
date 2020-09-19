import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, FlatList, Image} from 'react-native';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import {getList} from '../../api/dataProvider';
import firebase from 'firebase';
import * as SecureStore from 'expo-secure-store';

export default function Opportunity(props) {
	const {navigation, route} = props;
	const {id, title} = route.params;
	const [userId, setUserId] = useState(null);
	SecureStore.getItemAsync('userId').then((result) => setUserId(result));

	return (
		<View>
			<Text>
				Estamos acá para ayudarlo! Por favor diganos las características de sus
				necesidades
			</Text>
		</View>
	);
}

/* function NoFoundAnounces() {
	return (
		<View style={{flex: 1, alignItems: 'center'}}>
			<Image
				source={require('../../assets/img/no-result-found.png')}
				resizeMode="cover"
				style={{width: 200, height: 200}}
			/>
		</View>
	);
}

function Anounce(props) {
	const {anounce, navigation} = props;
	const {id, title, images} = anounce.item;

	return (
		<ListItem
			title={title}
			leftAvatar={{
				source: images[0].url
					? {uri: images[0].url}
					: require('../../assets/img/no-image.png')
			}}
			rightIcon={<Icon type="material-community" name="chevron-right" />}
			onPress={() =>
				navigation.navigate('anounces', {
					screen: 'anounce',
					params: {id, title}
				})
			}
		/>
	);
} */

const styles = StyleSheet.create({
	searchBar: {
		marginBottom: 20
	}
});

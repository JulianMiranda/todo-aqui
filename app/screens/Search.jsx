import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, FlatList, Image} from 'react-native';
import {SearchBar, ListItem, Icon} from 'react-native-elements';
import {getList} from '../api/dataProvider';

export default function Search(props) {
	const {navigation} = props;
	const [search, setSearch] = useState('');
	const [anounces, setAnounces] = useState([]);

	const data = {
		filter: {},
		search: {text: search, fields: ['title']},
		fields: {},
		docsPerPage: 10,
		page: 0,
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
		if (search) {
			getList('anounces', data).then((result) => {
				setAnounces(result.data);
			});
		}
	}, [search]);

	return (
		<View>
			<SearchBar
				placeholder="Busca un anuncio..."
				onChangeText={(e) => setSearch(e)}
				value={search}
				containerStyle={styles.searchBar}
			/>
			{anounces.length === 0 ? (
				<NoFoundAnounces />
			) : (
				<FlatList
					data={anounces}
					renderItem={(anounce) => (
						<Anounce anounce={anounce} navigation={navigation} />
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			)}
		</View>
	);
}

function NoFoundAnounces() {
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
}

const styles = StyleSheet.create({
	searchBar: {
		marginBottom: 20
	}
});

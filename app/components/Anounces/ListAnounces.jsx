import React from 'react';
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

export default function ListAnounces(props) {
	const {anounces, handleLoadMore, isLoading} = props;
	const navigation = useNavigation();

	return (
		<View>
			{size(anounces) > 0 ? (
				<FlatList
					data={anounces}
					renderItem={(anounce) => (
						<Anounce anounce={anounce} navigation={navigation} />
					)}
					keyExtractor={(item, index) => index.toString()}
					onEndReachedThreshold={0.5}
					onEndReached={handleLoadMore}
					ListFooterComponent={<FooterList isLoading={isLoading} />}
				/>
			) : (
				<View style={styles.loaderAnounces}>
					<ActivityIndicator size="large" />
					<Text>Cargando Anuncios</Text>
				</View>
			)}
		</View>
	);
}
function Anounce(props) {
	const {anounce, navigation} = props;
	const {id, images, title, provider, description, category} = anounce.item;
	const imageAnounce = images[0].url;
	const goAnounce = () => {
		navigation.navigate('anounce', {
			id,
			title
		});
	};
	return (
		<TouchableOpacity onPress={goAnounce}>
			<View style={styles.viewAnounce}>
				<View style={styles.viewAnounceImage}>
					<Image
						resizeMode="cover"
						PlaceholderContent={<ActivityIndicator color="fff" />}
						source={
							imageAnounce
								? {uri: imageAnounce}
								: require('../../../assets/img/no-image.png')
						}
						style={styles.imageRestaurant}
					/>
				</View>
				<View>
					<Text style={styles.anounceName}>{title}</Text>
					<Text style={styles.anounceCategory}>{category.name}</Text>
					<Text style={styles.anounceDescription}>
						{description.substr(0, 60)}...
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

function FooterList(props) {
	const {isLoading} = props;

	if (isLoading) {
		return (
			<View style={styles.loaderRestaurants}>
				<ActivityIndicator size="large" />
			</View>
		);
	} else {
		return (
			<View style={styles.notFoundRestaurants}>
				<Text>No quedan anuncios por cargar</Text>
			</View>
		);
	}
}
const styles = StyleSheet.create({
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

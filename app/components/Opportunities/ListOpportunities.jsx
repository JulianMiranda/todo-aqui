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

export default function ListOpportunities(props) {
	const {opportunities, handleLoadMore, isLoading} = props;
	const navigation = useNavigation();

	return (
		<View>
			{size(opportunities) > 0 ? (
				<FlatList
					data={opportunities}
					renderItem={(opportunity) => (
						<Opportunity opportunity={opportunity} navigation={navigation} />
					)}
					keyExtractor={(item, index) => index.toString()}
					onEndReachedThreshold={0.5}
					onEndReached={handleLoadMore}
					ListFooterComponent={<FooterList isLoading={isLoading} />}
				/>
			) : (
				<View style={styles.loaderOppListOpportunities}>
					<ActivityIndicator size="large" />
					<Text>Cargando Negociaciones</Text>
				</View>
			)}
		</View>
	);
}
function Opportunity(props) {
	const {opportunity, navigation} = props;
	const {id, images, title, anounce, description, state} = opportunity.item;
	const imageOpportunity = images[0].url;
	const estado = {};
	if (state === 'OPP') {
		estado.state = 'Interesado';
		estado.color = '#DDE705';
	} else if (state === 'QUOT') {
		estado.state = 'Negociando';
		estado.color = 'green';
	}

	const goOpportunity = () => {
		navigation.navigate('opportunity', {
			id,
			title
		});
	};
	return (
		<TouchableOpacity onPress={goOpportunity}>
			<View style={styles.viewOpportunity}>
				<View style={styles.viewOpportunityImage}>
					<Image
						resizeMode="cover"
						PlaceholderContent={<ActivityIndicator color="fff" />}
						source={
							imageOpportunity
								? {uri: imageOpportunity}
								: require('../../../assets/img/no-image.png')
						}
						style={styles.imageRestaurant}
					/>
				</View>
				<View>
					<Text
						style={{
							color: estado.color,
							fontSize: 25
						}}
					>
						{estado.state}
					</Text>
					<Text style={styles.opportunityName}>{title}</Text>
					<Text style={styles.opportunityDescription}>
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
	loaderOppListOpportunities: {
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center'
	},
	viewOpportunity: {
		flexDirection: 'row',
		margin: 30
	},
	viewOpportunityImage: {
		marginRight: 20
	},
	imageRestaurant: {
		width: 100,
		height: 100
	},
	opportunityName: {
		fontWeight: 'bold'
	},
	opportunityCategory: {
		paddingTop: 2,
		color: 'grey'
	},
	opportunityDescription: {
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

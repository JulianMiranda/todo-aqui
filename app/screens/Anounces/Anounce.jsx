import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, ScrollView, View, Text, Dimensions} from 'react-native';
import {Rating, ListItem, Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import {map} from 'lodash';
import {getOne} from '../../api/dataProvider';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import ListReviews from '../../components/Anounces/ListReviews';

const screensWidth = Dimensions.get('window').width;

export default function Anounce(props) {
	const {navigation, route} = props;
	const {id, title} = route.params;
	const [anounce, setAnounce] = useState(null);
	const [rating, setRating] = useState(0);

	navigation.setOptions({title: title});
	useFocusEffect(
		useCallback(() => {
			getOne('anounces', id).then((anounce) => {
				setAnounce(anounce);
				if (anounce.ratingAvg) setRating(anounce.ratingAvg);
			});
		}, [])
	);

	if (!anounce) return <Loading isVisible={true} text="Cargando" />;
	return (
		<ScrollView vertical style={styles.viewBody}>
			<Carousel
				arrayImages={anounce.images}
				height={250}
				width={screensWidth}
			/>
			<TitleAnounce
				title={anounce.title}
				description={anounce.description}
				rating={rating}
			/>
			<AnounceInfo
				title={anounce.title}
				provider={anounce.provider.name}
				category={anounce.category.name}
			/>
			<ListReviews navigation={navigation} idAnounce={id} />
		</ScrollView>
	);
}

function TitleAnounce(props) {
	const {title, description, rating} = props;
	return (
		<View style={styles.viewAnounceTitle}>
			<View style={{flexDirection: 'row'}}>
				<Text style={styles.titleAnounce}>{title}</Text>
				<Rating
					style={styles.rating}
					imageSize={20}
					readonly
					startingValue={parseFloat(rating)}
				/>
			</View>
			<Text style={styles.descriptionAnounce}>{description}</Text>
		</View>
	);
}
function AnounceInfo(props) {
	const {title, provider, category} = props;

	const listInfo = [
		{
			text: provider,
			iconName: 'phone',
			iconType: 'material-community',
			action: null
		},
		{
			text: category,
			iconName: 'account-circle',
			iconType: 'material-community',
			action: null
		}
	];

	return (
		<View style={styles.viewAnounceInfo}>
			<Text style={styles.anounceInfoTitle}>Información sobre el Anuncio</Text>

			{map(listInfo, (item, index) => (
				<ListItem
					key={index}
					title={item.text}
					leftIcon={{
						name: item.iconName,
						type: item.iconType,
						color: '#00a680'
					}}
					containerStyle={styles.containerListItem}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff'
	},
	viewAnounceTitle: {
		padding: 15
	},
	titleAnounce: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	descriptionAnounce: {
		marginTop: 5,
		color: 'grey'
	},
	rating: {
		position: 'absolute',
		right: 0
	},
	viewAnounceInfo: {
		margin: 15,
		marginTop: 25
	},
	anounceInfoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10
	},
	containerListItem: {
		borderBottomColor: '#d8d8d8',
		borderBottomWidth: 1
	}
});

import React, {useState, useEffect} from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import {Image} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import {size} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import {getListNoAuth} from '../../api/dataProvider';

export default function Iconos(props) {
	const {categories, setImageWith} = props;
	const navigation = useNavigation();
	const [subcategories0, setsubcategories0] = useState({});
	const [subcategories1, setsubcategories1] = useState({});
	const [subcategories2, setsubcategories2] = useState({});
	const [icon0, seticon0] = useState(30);
	const [icon1, seticon1] = useState(30);
	const [icon2, seticon2] = useState(30);
	const [state, setState] = useState({
		color: '#444442',
		fontSize: 40
	});

	const category = {};
	if (categories.length !== 0) {
		category.name = categories[0].name;
		category.id = categories[0].id;
	}
	const IcoNames = {};

	if (category.name === 'Pintura') {
		IcoNames.name0 = 'home-city-outline';
		IcoNames.name1 = 'car-side';
		IcoNames.name2 = 'hospital-building';
	} else if (category.name === 'Plomeria') {
		IcoNames.name0 = 'wind-turbine';
		IcoNames.name1 = 'toilet';
		IcoNames.name2 = 'fridge-outline';
	} else {
		IcoNames.name0 = 'television';
		IcoNames.name1 = 'laptop-chromebook';
		IcoNames.name2 = 'cellphone-android';
	}

	useEffect(() => {
		if (size(categories) > 0) {
			const data = {
				filter: {category: ['=', `${category.id}`]},
				search: {},
				fields: {},
				population: [
					{
						path: 'image',
						fields: {
							url: true
						}
					},
					{
						path: 'category',
						fields: {
							name: true
						}
					}
				]
			};
			getListNoAuth('subcategories', data).then((result) => {
				setsubcategories0(result.data[0]);
				setsubcategories1(result.data[1]);
				setsubcategories2(result.data[2]);
			});
		}
	}, [categories]);
	const handleIcon0 = () => {
		const object = {color: 'red', fontSize: 0.1};
		seticon0(30);
		seticon1(15);
		seticon2(15);
		setImageWith(110);
		return setState(object);
	};
	const handleIcon1 = () => {
		const object = {color: 'red', fontSize: 0.1};
		seticon0(15);
		seticon1(30);
		seticon2(15);
		setImageWith(110);
		return setState(object);
	};
	const handleIcon2 = () => {
		const object = {color: 'red', fontSize: 0.1};
		seticon0(15);
		seticon1(15);
		seticon2(30);
		setImageWith(110);
		return setState(object);
	};
	return (
		<View style={styles.body}>
			<Text
				style={{
					color: state.color,
					fontSize: state.fontSize
				}}

				/* style={styles.text} */
			>
				{category.name ? category.name : ''}
			</Text>
			<View style={styles.viewUserInfo}>
				<View
					style={{
						alignItems: 'center',
						marginRight: 10,
						justifyContent: 'center'
					}}
				>
					<Icon
						raised
						size={icon0}
						type="material-community"
						name={IcoNames.name0}
						onPress={handleIcon0}
					/>
					<Text style={{}}>
						{subcategories0.name ? subcategories0.name : ''}
					</Text>
				</View>
				<View
					style={{
						alignItems: 'center',
						marginRight: 10,
						justifyContent: 'center'
					}}
				>
					<Icon
						raised
						size={icon1}
						type="material-community"
						name={IcoNames.name1}
						onPress={handleIcon1}
					/>
					<Text>{subcategories1.name ? subcategories1.name : ''}</Text>
				</View>
				<View style={{alignItems: 'center', justifyContent: 'center'}}>
					<Icon
						raised
						size={icon2}
						type="material-community"
						name={IcoNames.name2}
						/* iconStyle={styles.btnContainer} */
						onPress={handleIcon2}
					/>
					<Text>{subcategories2.name ? subcategories2.name : ''}</Text>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	body: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		color: '#444442',
		fontSize: 40
	},
	viewUserInfo: {
		alignItems: 'flex-start',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: 'transparent',
		paddingBottom: 10
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

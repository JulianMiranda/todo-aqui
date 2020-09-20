import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Anounces from '../screens/Anounces/Anounces';
import AnouncesFiltered from '../screens/Anounces/AnouncesFiltered';
import Anounce from '../screens/Anounces/Anounce';
import AddAnounce from '../screens/Anounces/AddAnounce';
import AddReviewAnounce from '../screens/Anounces/AddRevievAnounce';

const Stack = createStackNavigator();

export default function AnounceStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="anounces"
				component={Anounces}
				options={{title: 'Anuncios'}}
			/>
			<Stack.Screen
				name="add-anounce"
				component={AddAnounce}
				options={{title: 'Añadir Anuncio'}}
			/>
			<Stack.Screen name="anounce" component={Anounce} />
			<Stack.Screen
				name="add-review-anounce"
				component={AddReviewAnounce}
				options={{title: 'Nuevo Comentario'}}
			/>
			<Stack.Screen
				name="anounces-filtered"
				component={AnouncesFiltered}
				options={{title: 'Anuncios'}}
			/>
		</Stack.Navigator>
	);
}

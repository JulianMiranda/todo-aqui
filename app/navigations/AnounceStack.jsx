import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Anounces from '../screens/Anounces/Anounces';
import Anounce from '../screens/Anounces/Anounce';
import AddAnounce from '../screens/Anounces/AddAnounce';

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
		</Stack.Navigator>
	);
}

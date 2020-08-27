import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Anounces from '../screens/Anounces';

const Stack = createStackNavigator();

export default function AnounceStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="anounces"
				component={Anounces}
				options={{title: 'Anouncees'}}
			/>
		</Stack.Navigator>
	);
}

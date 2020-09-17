import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Opportunity from '../screens/Opportunities/Opportunity';
import AddOpportunity from '../screens/Opportunities/AddOpportunity';

const Stack = createStackNavigator();

export default function OpportunityStack(props) {
	console.log(props);
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="opportunities"
				component={Opportunity}
				options={{title: 'Oportunidades'}}
			/>
			<Stack.Screen
				name="add-opportunity"
				component={AddOpportunity}
				options={{title: 'Contactar con Proveedor'}}
			/>
		</Stack.Navigator>
	);
}

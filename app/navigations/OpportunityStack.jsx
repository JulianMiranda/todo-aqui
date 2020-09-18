import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Opportunity from '../screens/Opportunities/Opportunity';
import Opportunities from '../screens/Opportunities/Opportunities';
import AddOpportunity from '../screens/Opportunities/AddOpportunity';

const Stack = createStackNavigator();

export default function OpportunityStack(props) {
	console.log(props);
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="opportunities"
				component={Opportunities}
				options={{title: 'Mis Negociaciones'}}
			/>
			<Stack.Screen
				name="opportunity"
				component={Opportunity}
				options={{title: 'Oportunidad'}}
			/>
			<Stack.Screen
				name="add-opportunity"
				component={AddOpportunity}
				options={{title: 'Contactar con Proveedor'}}
			/>
		</Stack.Navigator>
	);
}

import React, {useState, useRef} from 'react';
import {View} from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddOpportunityForm from '../../components/Opportunities/AddOpportunityForm';

export default function AddOpportunity(props) {
	const {navigation} = props;
	const [isLoading, setIsLoading] = useState(false);
	const toastRef = useRef();

	return (
		<View>
			<AddOpportunityForm
				toastRef={toastRef}
				setIsLoading={setIsLoading}
				navigation={navigation}
			/>
			<Toast ref={toastRef} position="center" opacity={0.9} />
			<Loading isVisible={isLoading} text="Creando oportunidad" />
		</View>
	);
}

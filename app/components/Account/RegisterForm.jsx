import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Icon, Button} from 'react-native-elements';
import {validateEmail} from '../../utils/validations';
import Loading from '../Loading';
import {size, isEmpty} from 'lodash';
import * as firebase from 'firebase';
import {useNavigation} from '@react-navigation/native';

export default function RegisterForm(props) {
	const {toastRef} = props;
	const [showPassword, setShowPassword] = useState(false);
	const [showRepeatPassword, setShowRepeatPassword] = useState(false);
	const [formData, setFormData] = useState(defaultFormValue());
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();
	const onSubmit = () => {
		if (
			isEmpty(formData.email) ||
			isEmpty(formData.password) ||
			isEmpty(formData.repeatPassword)
		) {
			toastRef.current.show('Todos los campos obligtorios');
		} else if (!validateEmail(formData.email)) {
			toastRef.current.show('Email incorrecto');
		} else if (formData.password !== formData.repeatPassword) {
			toastRef.current.show('Las contraseñas tienen q ser iguales no correcto');
		} else if (size(formData.password) < 6) {
			toastRef.current.show(
				'Las contraseñas tienen q ser mayor a 6 caracteres'
			);
		} else {
			setLoading(true);
			firebase
				.auth()
				.createUserWithEmailAndPassword(formData.email, formData.password)
				.then(() => {
					setLoading(false);

					navigation.navigate('account');
				})
				.catch((err) => {
					setLoading(false);
					toastRef.current.show('El email está en uso, pruebe con otro.');
				});
		}
	};
	const onChange = (e, type) => {
		setFormData({...formData, [type]: e.nativeEvent.text});
	};
	return (
		<View style={styles.formConteiner}>
			<Input
				placeholder="Email"
				containerStyle={styles.inputForm}
				onChange={(e) => onChange(e, 'email')}
				rightIcon={
					<Icon
						type="material-community"
						name="at"
						iconStyle={styles.iconRigth}
					/>
				}
			/>
			<Input
				placeholder="Password"
				password={true}
				secureTextEntry={showPassword ? false : true}
				containerStyle={styles.inputForm}
				onChange={(e) => onChange(e, 'password')}
				rightIcon={
					<Icon
						type="material-community"
						name={showPassword ? 'eye-off-outline' : 'eye-outline'}
						iconStyle={styles.iconRigth}
						onPress={() => setShowPassword(!showPassword)}
					/>
				}
			/>
			<Input
				placeholder="Repetir Password"
				password={true}
				secureTextEntry={showRepeatPassword ? false : true}
				containerStyle={styles.inputForm}
				onChange={(e) => onChange(e, 'repeatPassword')}
				rightIcon={
					<Icon
						type="material-community"
						name={showRepeatPassword ? 'eye-off-outline' : 'eye-outline'}
						iconStyle={styles.iconRigth}
						onPress={() => setShowRepeatPassword(!showRepeatPassword)}
					/>
				}
			/>
			<Button
				title="Unirse"
				containerStyle={styles.btnContainerRegister}
				buttonStyle={styles.btnRegister}
				onPress={onSubmit}
			/>
			<Loading isVisible={loading} text="Creando Cuenta" />
		</View>
	);
}

function defaultFormValue() {
	return {email: '', password: '', repeatPassword: ''};
}

const styles = StyleSheet.create({
	formConteiner: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30
	},
	inputForm: {
		width: '100%',
		marginTop: 20
	},
	btnContainerRegister: {
		width: '95%',
		marginTop: 20
	},
	btnRegister: {
		backgroundColor: '#00a680'
	},
	iconRigth: {
		color: '#c1c1c1'
	}
});

import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Input, Icon, Button} from 'react-native-elements';
import {isEmpty} from 'lodash';
import {useNavigation} from '@react-navigation/native';
import * as firebase from 'firebase';
import {validateEmail} from '../../utils/validations';
import Loading from '../Loading';
import {login} from '../../api/dataProvider';

export default function LoginForm(props) {
	const {toastRef} = props;
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState(defaultFormValue());
	const [loading, setLoading] = useState(false);
	const navigation = useNavigation();

	const onChange = (e, type) => {
		setFormData({...formData, [type]: e.nativeEvent.text});
	};
	const onSubmit = () => {
		if (isEmpty(formData.email) || isEmpty(formData.password)) {
			toastRef.current.show('Todos los campos son obligatorios');
		} else if (!validateEmail(formData.email)) {
			toastRef.current.show('El email no es correcto');
		} else {
			setLoading(true);
			firebase
				.auth()
				.signInWithEmailAndPassword(formData.email, formData.password)
				.then(() => {
					setLoading(false);
					/* login()
						.then((res) => {
							console.log('ENTER THEN', res);
							return res;
						})
						.catch((err) => {
							return err;
						}); */
					navigation.navigate('account');
				})
				.catch(() => {
					setLoading(false);
					toastRef.current.show('Email o contraseña incorrecta');
				});
		}
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
						iconStyle={styles.iconRight}
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
						iconStyle={styles.iconRight}
						onPress={() => setShowPassword(!showPassword)}
					/>
				}
			/>

			<Button
				title="Iniciar Sesión"
				containerStyle={styles.btnContainerLogin}
				buttonStyle={styles.btnLogin}
				onPress={onSubmit}
			/>

			<Loading isVisible={loading} text="Iniciando sesión" />
		</View>
	);
}
function defaultFormValue() {
	return {
		email: '',
		password: ''
	};
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
	btnContainerLogin: {
		width: '95%',
		marginTop: 20
	},
	btnLogin: {
		backgroundColor: '#00a680'
	},
	iconRight: {
		color: '#c1c1c1'
	}
});

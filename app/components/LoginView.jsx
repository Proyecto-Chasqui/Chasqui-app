import React from 'react';
import { StyleSheet, Text, Alert, View, Dimensions } from 'react-native';
import { Input, Image, Button } from 'react-native-elements';
import { Formik } from 'formik';
import axios from 'axios';
import GLOBALS from '../Globals';


class LoginView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.serverBaseRoute = GLOBALS.BASE_URL;
    this.login = props.actions.login;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.navigation = props.navigation;
  }

  loginAsGuest() {
    this.login({
      email: "invitado@invitado.com",
      token: "invitado",
      id: 0,
      nickname: "invitado",
      avatar: "",
    });
  }

  handleSubmit(values) {
    axios.post(this.serverBaseRoute + 'rest/client/sso/singIn', {
      email: values.email,
      password: values.contraseña
    })
      .then(res => {
        this.login(res.data);
      }).catch(function (error) {
        Alert.alert('Error', 'Credenciales invalidas, verifique usuario y/o contraseña');
      });

  }

  render() {
    return (
      <View style={styles.principalContainer}>
        <Formik
          initialValues={{ email: '', contraseña: '' }}
          onSubmit={values => this.handleSubmit(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Bienvenidxs</Text>
              </View>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                  style={styles.image}
                />
              </View>
              <View style={styles.inputContainer}>
                <Input
                  inputStyle={{ color: "white", marginLeft: 10 }}
                  placeholderTextColor="white"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder='Correo electronico'
                  leftIcon={{ type: 'font-awesome', name: 'user' }}
                  value={values.email}
                />
              </View>
              <View style={styles.lowerInputContainer}>
                <Input
                  inputStyle={{ color: "white", marginLeft: 10 }}
                  placeholderTextColor="white"
                  onChangeText={handleChange('contraseña')}
                  onBlur={handleBlur('constraseña')}
                  placeholder='Contraseña'
                  leftIcon={{ type: 'font-awesome', name: 'lock' }}
                  secureTextEntry={true}
                  value={values.contraseña}
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button buttonStyle={{ height: 60, backgroundColor: '#80bfff', borderColor: "white", borderWidth: 1 }} titleStyle={{ fontSize: 20, }} onPress={handleSubmit} title="INGRESAR" />
              </View>
              <View style={styles.lowerButtonsContainer} >
                <View style={styles.leftButton}>
                  <Text style={styles.TextStyle} onPress={() => Alert.alert('En Desarrollo', 'Sección en desarrollo')}> Olvide mi contraseña </Text>
                </View>
                <View style={styles.divisor} />
                <View style={styles.rightButton}>
                  <Text style={styles.TextStyle} onPress={() => Alert.alert('En Desarrollo', 'Sección en desarrollo')}> Registrarme </Text>
                </View>
              </View>
              <View style={styles.middleButton} >
                <View>
                  <Text style={styles.TextStyle} onPress={() => this.loginAsGuest()}> Ingresar como invitado </Text>
                </View>
              </View>
            </View>
          )}
        </Formik>

      </View>
    );
  }
}

const styles = StyleSheet.create({

  principalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(51, 102, 255, 1)',
  },

  titleContainer: {
    alignSelf: 'center',
  },

  title: {
    fontSize: 36,
    color: '#ffffff'
  },

  imageContainer: {
    alignSelf: 'center',
    marginTop: "10%"
  },

  image: {
    width: 278 / 2,
    height: 321 / 2,
    resizeMode: 'contain',
  },

  inputContainer: {
    marginTop: '20%',
    width: Dimensions.get('window').width - 40,
    height: 71,
    alignSelf: 'center'
  },

  lowerInputContainer: {
    marginTop: 5,
    width: Dimensions.get('window').width - 40,
    height: 71,
    alignSelf: 'center'
  },

  buttonContainer: {
    marginTop: '2%',
    width: "90%",
    alignSelf: 'center'
  },

  lowerButtonsContainer: {
    marginTop: '5%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  divisor: {
    height: 38,
    width: 1,
    backgroundColor: 'rgba(194, 215, 242, 1)',
  },

  leftButton: {
    justifyContent: 'center',
  },

  rightButton: {
    justifyContent: 'center',
    marginRight: 40
  },

  middleButton: {
    backgroundColor: '#4da6ff',
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    height: 25,
    marginTop: 20,
    marginLeft: 0,
    alignSelf: 'center'
  },


  TextStyle: {
    fontSize: 16,
    color: '#ffffff'

  },


});

export default LoginView;
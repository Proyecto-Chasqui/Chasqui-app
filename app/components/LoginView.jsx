import React from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Input, Image, Button, Overlay } from 'react-native-elements';
import { Formik } from 'formik';
import axios from 'axios';
import GLOBALS from '../Globals';
import base64 from 'react-native-base64';

class LoginView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.serverBaseRoute = GLOBALS.BASE_URL;
    this.login = props.actions.login;
    this.setPassword = props.actions.setPassword;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.navigation = props.navigation;
    this.state = {
      emailRecover: '',
      isVisible: false,
      emailErrorRecover: '',
      dataChange: false,
      loading: false,
    }
  }

  loginAsGuest() {
    
    if(!this.state.loading){
      this.login({
        email: "invitadx@invitadx.com",
        token: "invitado",
        id: 0,
        nickname: "invitadx",
        avatar: "",
      });
    }
  }
  //deprecado
  reLogin() {
    axios.post(this.serverBaseRoute + 'rest/client/sso/singIn', {
      email: this.props.user.email,
      password: this.props.user.password
    }, { withCredentials: true, })
      .then(res => {
        let userData = res.data
        userData.password = values.contraseña
        this.login(userData);
        this.setPassword(values.contraseña);
      }).catch((error) => {
        if (error.response) {
          if (error.response.data.error === "Usuario o Password incorrectos!") {
            Alert.alert(
              'Advertencia',
              'Usuario o Password incorrectos!',
              [
                { text: 'Entendido', onPress: () => null },
              ],
              { cancelable: false },
            );
          } else {
            Alert.alert(
              'Advertencia',
              'ocurrio un error al tratar de comunicarse con el servidor, debe re ingresar',
              [
                { text: 'Entendido', onPress: () => null },
              ],
              { cancelable: false },
            );
          }

        } else if (error.request) {
          Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
        } else {
          Alert.alert('Error', "Ocurrio un error al intentar ingresar, intente más tarde o verifique su conectividad.");
        }
      });
  }
  //usado para registrar en el server su "login", probablemente sea necesario crear una contramedida
  // del lado del servidor cuando se crean 401 unautorized.
  getPersonalData(data, values) {
    const token = base64.encode(`${data.email}:${data.token}`);
    axios.get(this.serverBaseRoute + 'rest/user/adm/read', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`
      }
      , withCredentials: true
    }).then(res => {
      let userData = data
      userData.password = values.contraseña
      this.setPassword(values.contraseña);
      this.login(userData);
      this.setState({loading:false})
    }).catch((error) => {
      Alert.alert('Error', 'ocurrio un error al obtener los datos del usuario, ¿quizas ingreso desde otro dispositivo?');
    });
  }

  handleSubmit(values) {
    if (!this.state.loading) {
      this.setState({loading:true})
      axios.post(this.serverBaseRoute + 'rest/client/sso/singIn', {
        email: values.email,
        password: values.contraseña
      }, { withCredentials: true })
        .then(res => {
          this.getPersonalData(res.data, values)
        }).catch((error) => {
          this.setState({loading:false})
          if (error.response) {
            if (error.response.data.error === "Usuario o Password incorrectos!") {
              Alert.alert(
                'Advertencia',
                'Usuario o Password incorrectos!',
                [
                  { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
              );
            } else {
              Alert.alert(
                'Advertencia',
                'Ocurrio un error al tratar de comunicarse con el servidor',
                [
                  { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
              );
            }

          } else if (error.request) {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
          } else {
            Alert.alert('Error', "Ocurrio un error al intentar ingresar, intente más tarde o verifique su conectividad.");
          }
        });
    }
  }

  resetRecover() {
    this.setState({ emailRecover: '', isVisible: false })
  }

  validRecoverEmail() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return reg.test(this.state.emailRecover)
  }

  showErrorEmailRecover() {
    this.setState({ emailErrorRecover: 'Ingrese un email valido' })
  }

  handleSubmitRecover() {
    if (this.validRecoverEmail()) {
      axios.get(this.serverBaseRoute + 'rest/client/sso/resetPass/' + this.state.emailRecover)
        .then(res => {
          Alert.alert('Aviso', 'La contraseña se restauro correctamente, por favor revise su casilla de correo.', [
            { text: 'Entendido', onPress: () => this.resetRecover() }
          ],
            { cancelable: false });
          this.setState({ emailErrorRecover: '' })
        }).catch((error) => {
          this.setState({ emailErrorRecover: '' })
          if (error.response) {
            Alert.alert('Error', error.response.data.error);
          } else if (error.request) {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
          } else {
            Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.");
          }
        });
    } else {
      this.showErrorEmailRecover()
    }

  }

  handleChangeRecover(text) {
    this.setState({ emailRecover: text, dataChange: true })
  }

  goToRegister() {
    
    if(!this.state.loading){
    this.navigation.navigate('Registrarse')
    }
  }

  hideShowPop() {
    if(!this.state.loading){
      this.setState({ isVisible: !this.state.isVisible })
    }
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.principalContainer}>
        <Overlay
          isVisible={this.state.isVisible}
          width="90%"
          height={290}
          onBackdropPress={() => this.resetRecover()}
          animationType="fade"
        >
          <View style={{ height: "25%" }}>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>Recuperar contraseña</Text>
            </View>
            <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}>
              <Text style={{ fontSize: 18, alignSelf: 'center' }}>Si esta registrado, enviaremos las instrucciones a su correo.</Text>
            </View>
            <View>
              <Text style={styles.emailTitle}>Ingrese su correo</Text>
            </View>
            <View style={{ height: 60 }}>
              <Input
                inputStyle={{ color: "black", marginLeft: 10, }}
                placeholderTextColor="black"
                onChangeText={text => this.handleChangeRecover(text)}
                placeholder=''
                errorStyle={{ color: 'red' }}
                errorMessage={this.state.emailErrorRecover}
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                value={this.state.emailRecover}
              />
            </View>
            <View style={styles.buttonRecoverContainer}>
              <Button buttonStyle={{ width: 140, backgroundColor: 'transparent', borderColor: "grey", borderWidth: 1 }} titleStyle={{ fontSize: 20, color: "black" }} onPress={() => this.resetRecover()} title="Cancelar" />
              <Button disabled={!this.state.dataChange} buttonStyle={{ width: 140, backgroundColor: '#5ebb47', borderColor: "grey", borderWidth: 1, marginLeft: 5 }} titleStyle={{ fontSize: 20, }} onPress={() => this.handleSubmitRecover()} title="Enviar" />
            </View>
          </View>
        </Overlay>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bienvenidxs</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
            style={styles.image}
          />
        </View>
        <Formik
          initialValues={{ email: '', contraseña: '' }}
          onSubmit={values => this.handleSubmit(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View>

              <View style={styles.inputContainer}>
                <Input
                  inputStyle={{ color: "white", marginLeft: 10 }}
                  placeholderTextColor="white"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholder='Correo electrónico'
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
                <Button disabled={this.state.loading} loading={this.state.loading} buttonStyle={{ height: 60, backgroundColor: '#80bfff', borderColor: "white", borderWidth: 1 }} titleStyle={{ fontSize: 20, }} onPress={handleSubmit} title="INGRESAR" />
              </View>
              <View style={styles.lowerButtonsContainer} >
                <View style={styles.leftButton}>
                  <Text style={styles.TextStyle} onPress={() => this.hideShowPop()}> Olvidé mi contraseña </Text>
                </View>
                <View style={styles.divisor} />
                <View style={styles.rightButton}>
                  <Text style={styles.TextStyle} onPress={() => this.goToRegister()}> Registrarme </Text>
                </View>
              </View>
              <View style={styles.middleButton} >
                <View>
                  <Text style={styles.TextStyle} onPress={() => this.loginAsGuest()}> Ingresar como invitadx </Text>
                </View>
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({

  emailTitle: {
    marginTop: 10,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: 'bold'
  },

  infoTextContainer: {
    backgroundColor: "rgba(51, 102, 255, 1)",
    marginTop: -10,
    marginLeft: -10,
    marginRight: -10,
    height: 50,
    alignItems: "center"
  },

  infoText: {
    marginTop: 10,
    fontSize: 19,
    fontWeight: "bold",
    color: "white"
  },

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
    width: 278 / 2.5,
    height: 321 / 2.5,
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

  buttonRecoverContainer: {
    flexDirection: "row",
    marginTop: 15,
    alignSelf: 'center',
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
    marginTop: 10,
    marginLeft: 0,
    alignSelf: 'center'
  },


  TextStyle: {
    fontSize: 16,
    color: '#ffffff'

  },


});

export default LoginView;
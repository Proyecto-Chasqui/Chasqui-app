import React from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Input, Image, Button, Overlay, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import axios from 'axios';
import GLOBALS from '../Globals';
import base64 from 'react-native-base64';
import { AsyncStorage } from 'react-native';
import LoadingView from './LoadingView';

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
      firstLoading: true,
      securePassword: true,
      icon: 'eye-slash'
    }

  }

  componentDidMount() {
    this.retrieveUserData();
  }

  async storeData(key, item) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.log("error on storage", error.message)
      Alert.alert(
        'Error',
        'Ocurrio un error inesperado, vualva a ingresar, si el problema persiste comuniquese con soporte técnico.',
        [
          { text: 'Entendido', onPress: () => this.props.actions.logout() },
        ],
        { cancelable: false },
      );
    }
  };

  async removeStorageUser(){
    await AsyncStorage.removeItem("user");
  }

  loginAsGuest() {
    if (!this.state.loading) {
      axios.get(this.serverBaseRoute, {
      }).then(res => {
        this.props.actions.login({
          email: "invitadx@invitadx.com",
          token: "invitado",
          id: 0,
          nickname: "invitadx",
          avatar: "",
        });
        this.storeData("user", {
          email: "invitadx@invitadx.com",
          token: "invitado",
          id: 0,
          nickname: "invitadx",
          avatar: "",
        })
        this.setState({ loading: false, firstLoading: false })
      }).catch((error) => {
        console.log(error);
        this.setState({ loading: false, firstLoading: false })
        this.removeStorageUser()
        Alert.alert('Error', 'ocurrio un error al comunicarse con el servidor');
      });
    }
  }

  retrieveUserData = async () => {
    try {
      let user = await AsyncStorage.getItem("user");
      if (user !== null) {
        if (JSON.parse(user).id !== 0) {
          this.getPersonalData(JSON.parse(user), JSON.parse(user).password)
        } else {
          this.loginAsGuest()
        }
      } else {
        this.setState({ loading:false, firstLoading: false })
      }
    } catch (error) {
      console.log("value error", error.message);
    }
  };

  async getPersonalData(data, password) {
    const token = base64.encode(`${data.email}:${data.token}`);
    axios.get(this.serverBaseRoute + 'rest/user/adm/read', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`
      }
      , withCredentials: true
    }).then(res => {
      let userData = data
      userData.password = password
      this.setPassword(password);
      this.login(userData);
      this.storeData("user", userData);
      this.setState({ loading: false, firstLoading: false })
    }).catch((error) => {
      this.setState({ loading: false, firstLoading: false })
      this.removeStorageUser()
      Alert.alert('Error', 'ocurrio un error al comunicarse con el servidor');
    });
  }

  handleSubmit(values) {
    if (!this.state.loading) {
      this.setState({ loading: true })
      axios.post(this.serverBaseRoute + 'rest/client/sso/singIn', {
        email: values.email,
        password: values.contraseña
      }, { withCredentials: true })
        .then(res => {
          this.getPersonalData(res.data, values.contraseña)
        }).catch((error) => {
          this.setState({ loading: false })
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

    if (!this.state.loading) {
      this.navigation.navigate('Registrarse')
    }
  }

  hideShowPop() {
    if (!this.state.loading) {
      this.setState({ isVisible: !this.state.isVisible })
    }
  }

  changeIcon() {
    this.setState({
      securePassword: !this.state.securePassword,
      icon: this.state.icon === 'eye-slash' ? 'eye' : 'eye-slash',
    })
  }

  render() {

    if (this.state.firstLoading) {
      return (<LoadingView></LoadingView>)
    }
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
        <View style={{ flex: 1, justifyContent: 'center', }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Bienvenidxs</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('../components/catalogViewComponents/catalogAssets/platform-icon.png')}
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
                    rightIcon={<Icon type='font-awesome' onPress={() => this.changeIcon()} name={this.state.icon}></Icon>}
                    secureTextEntry={this.state.securePassword}
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
        </View>
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
    marginTop: 20,
    alignSelf: 'center',
  },

  image: {
    width: 278 / 2.7,
    height: 321 / 2.7,
    resizeMode: 'contain',
  },

  inputContainer: {
    marginTop: 30,
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
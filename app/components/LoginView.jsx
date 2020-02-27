import React from 'react';
import { StyleSheet, Button, Text, Alert, View } from 'react-native';
import { Input, Image } from 'react-native-elements';
import { Formik } from 'formik';
import axios from 'axios';


class LoginView extends React.Component {
  constructor(props) {
    super(props);
    this.login = props.actions.login;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.navigation = props.navigation;
  }

  handleSubmit(values) {
    axios.post('http://69.61.93.71/chasqui-dev-panel/rest/client/sso/singIn', { 
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
      <View style={{flex: 1,
        flexDirection: 'column', justifyContent: 'center', backgroundColor: 'rgba(51, 102, 255, 1)', width:"100%", height:"100%"}}>
        <Formik
          initialValues={{ email: '', contraseña: '' }}
          onSubmit={values => this.handleSubmit(values)}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={{
            alignItems:'center'}}>
            <View style={styles.TitleAlign}>
              <Text style={styles.Title}>Bienvenidxs</Text>
            </View>
              <Image
                  source={{ uri: 'http://www.proyectochasqui.org/images/logo_chasqui_400.png' }}
                  style={{ width: 200, height: 71, resizeMode: 'contain' }}
                />
              <View style={{ marginTop: '10%', width: "90%", height: 71}}>
                <Input
                    inputStyle={{color:"white"}}                 
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder=' Correo electronico'
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    value={values.email}
                  />
              </View>
              <View style={{ marginTop: '3%', width: "90%", height: 71}}>
                <Input
                    inputStyle={{color:"white"}}   
                    onChangeText={handleChange('contraseña')}
                    onBlur={handleBlur('constraseña')}
                    placeholder=' Contraseña'
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    secureTextEntry={true}
                    value={values.contraseña}
                  />
              </View>
              <View style={{ marginTop: '2%', width: "90%"}}>
                <Button style={{height: 171}} onPress={handleSubmit} title="Ingresar" />
              </View>
              <View style={{marginTop: '5%', flexDirection: 'row', justifyContent:'space-evenly'}} >
                  <View style={styles.MainContainer}>
                    <Text style={styles.TextStyle} onPress={() => Alert.alert('En desarrollo')}> Olvide mi contraseña </Text>
                  </View>
                  <View style = {{ height: 38, width: 1, backgroundColor: 'rgba(194, 215, 242, 1)'}} />
                  <View style={styles.MainContainer}>
                    <Text style={styles.TextStyle} onPress={() => Alert.alert('En desarrollo')}> Registrarme </Text>
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
 
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  TextStyle: {
    fontSize: 16,
    color: '#ffffff'
 
  },

  TitleAlign: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: '25%'
  },

  Title: {
    fontSize: 36,
    color: '#ffffff'
  }
});

export default LoginView;
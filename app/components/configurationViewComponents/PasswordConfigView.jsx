import React from 'react'
import { StyleSheet, Text, Alert, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Input, Image, Button, CheckBox } from 'react-native-elements';
import axios from 'axios';
import GLOBALS from '../../Globals';
import base64 from 'react-native-base64'
import { ScrollView } from 'react-native-gesture-handler';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView'

const OLDPASSWORD = 'Contraseña_anterior';
const NEWPASSWORD = 'Nueva_contraseña';
const CONFIRMNEWPASSWORD = 'Confirmar_contraseña';
const MINLENGTHPASSWORD = 10;
const MAXLENGTHPASSWORD = 26;

class PasswordConfigView extends React.PureComponent {
    constructor(props) {
        super(props),
        this.login = this.props.actions.login;
        this.setPassword = this.props.actions.setPassword;
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            sendingData: false,
            dataChange: false,
            isVisible: false,
            passwordData: {
                old_password: '',
                new_password: '',
                confirm_password: '',
            },
            errorMessage: {
                old_password: '',
                new_password: '',
                confirm_password: '',
            },
        }        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit() {
        if (!this.state.sendingData) {
            if (this.dataValid()) {
                this.setState({  sendingData: true, isVisible: true })
                axios.put(this.serverBaseRoute + 'rest/user/adm/editpassword', {
                    password: this.state.passwordData.confirm_password,
                    oldPassword: this.state.passwordData.old_password
                },{withCredentials: true})
                    .then(res => {
                        let userData = res.data
                        userData.password = this.state.passwordData.confirm_password
                        this.login(userData);
                        this.setPassword(this.state.passwordData.confirm_password)                        
                        this.flushPasswords()
                        this.flushErrors()
                        Alert.alert('Aviso', 'Los datos fueron actualizados correctamente');
                        this.setState({isVisible:false})
                    }).catch((error) => {
                        this.setState({ sendingData: false, dataChange: true, isVisible: false })
                        Alert.alert('Error', 'ocurrio un error al intentar actualizar los datos');
                    });
            } else {
                this.showErrorMessages()
            }
        }
    }

    validOldPassword() {
        return this.props.user.password === this.state.passwordData.old_password;
    }

    validNewPassword() {
        return this.state.passwordData.new_password.length >= MINLENGTHPASSWORD && this.state.passwordData.new_password.length <= MAXLENGTHPASSWORD
    }

    validConfirmPassword() {
        return this.state.passwordData.confirm_password.length >= MINLENGTHPASSWORD && this.state.passwordData.confirm_password.length <= MAXLENGTHPASSWORD
    }

    matchNewPassword() {
        return this.state.passwordData.confirm_password === this.state.passwordData.new_password;
    }

    dataValid() {
        return this.validConfirmPassword() && this.validNewPassword() && this.validOldPassword() && this.matchNewPassword();
    }

    showErrorMessages() {
        this.showErrorOldPassword()
        this.showErrorConfirmPassword()
        this.showErrorNewPassword()
        if (this.validNewPassword() && this.validConfirmPassword) {
            this.showErrorNotMatchPasswords()
        }
    }

    flushErrors(){
        this.setState((prevState) => ({
            dataChange: false,
            errorMessage: Object.assign({}, prevState.errorMessage, {
                old_password: '',
                new_password: '',
                confirm_password: '',
            })
        }))
    }

    showErrorOldPassword() {
        if (!this.validOldPassword()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    old_password: 'Contraseña incorrecta'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    old_password: ''
                })
            }))
        }
    }

    showErrorNewPassword() {
        if (!this.validNewPassword()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    new_password: 'La cantidad de caracteres debe ser entre 10 y 26'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    new_password: ''
                })
            }))
        }
    }

    showErrorConfirmPassword() {
        if (!this.validConfirmPassword()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    confirm_password: 'La cantidad de caracteres debe ser entre 10 y 26'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    confirm_password: ''
                })
            }))
        }
    }


    showErrorNotMatchPasswords() {
        if (!this.matchNewPassword()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    new_password: 'Las contraseñas no coinciden',
                    confirm_password: 'Las contraseñas no coinciden',
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    new_password: '',
                    confirm_password: '',
                })
            }))
        }
    }


    returnValueBasedOnFieldData(field) {
        switch (field) {
            case OLDPASSWORD:
                return this.state.passwordData.old_password
            case NEWPASSWORD:
                return this.state.passwordData.new_password
            case CONFIRMNEWPASSWORD:
                return this.state.passwordData.confirm_password
        }
    }

    assignErrorMessage(field) {
        switch (field) {
            case OLDPASSWORD:
                return this.state.errorMessage.old_password
            case NEWPASSWORD:
                return this.state.errorMessage.new_password
            case CONFIRMNEWPASSWORD:
                return this.state.errorMessage.confirm_password
        }
    }

    normalizeText(text) {
        let normalizeText = text.replace("_", " ");
        normalizeText = normalizeText.charAt(0).toUpperCase() + normalizeText.slice(1)
        return normalizeText;
    }

    flushPasswords(){
        this.setState((prevState) => ({
            sendingData: false,
            dataChange: false,            
            passwordData: Object.assign({}, prevState.passwordData, {
                old_password: '',
                new_password: '',
                confirm_password: ''
            })
        }))
    }

    handleChangeOfField(field, value) {
        switch (field) {
            case OLDPASSWORD:
                this.setState((prevState) => ({
                    dataChange: true,
                    passwordData: Object.assign({}, prevState.passwordData, {
                        old_password: value
                    })
                }))
                break;

            case NEWPASSWORD:
                this.setState((prevState) => ({
                    dataChange: true,
                    passwordData: Object.assign({}, prevState.passwordData, {
                        new_password: value
                    })
                }))
                break;

            case CONFIRMNEWPASSWORD:
                this.setState((prevState) => ({
                    dataChange: true,
                    passwordData: Object.assign({}, prevState.passwordData, {
                        confirm_password: value
                    })
                }))
                break;
        }
    }


    render() {
        const fields = [OLDPASSWORD, NEWPASSWORD, CONFIRMNEWPASSWORD]
        return (
            <KeyboardAvoidingView style={{flex:1}}>
                <LoadingOverlayView isVisible={this.state.isVisible} loadingText={'Enviando sus datos al servidor...'}></LoadingOverlayView>
                <ScrollView  style={{height:Dimensions.get("window").height - 167}}>
                    <View style={styles.stylesComment}>
                        <Text >La nueva contraseña debe tener entre 10 y 26 caracteres de largo. Recomendamos el uso de números, mayúsculas y minúsculas intercaladas y que la contraseña no se relacione directamente con el nombre de usuario ni con datos personales para mayor seguridad.</Text>
                    </View>
                    {fields.map((field, i) => {
                        return (
                            <View style={styles.inputContainer}>
                                <Text style={{fontWeight:"bold"}}>{this.normalizeText(field)}</Text>
                                <Input
                                    inputStyle={{ color: 'rgba(51, 102, 255, 1)', marginLeft: 10 }}
                                    placeholderTextColor='black'
                                    onChangeText={text => this.handleChangeOfField(field, text)}
                                    placeholder={this.normalizeText(field)}
                                    value={this.returnValueBasedOnFieldData(field)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={this.assignErrorMessage(field)}
                                    secureTextEntry={true}
                                    maxLength={26}
                                />
                            </View>)
                    })}
                    <View style={styles.buttonContainer}>
                        <Button loading={this.state.sendingData} disabled={!this.state.dataChange} buttonStyle={{ height: 60, backgroundColor: '#5ebb47', borderColor: "white", borderWidth: 1 }} titleStyle={{ fontSize: 20, }} onPress={()=>this.handleSubmit()} title="Guardar" />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({

    stylesComment: {
        flex: 1,
        alignContent: 'center',
        marginLeft: 20,
        marginRight: 20,
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
        width: 278 / 2,
        height: 321 / 2,
        resizeMode: 'contain',
    },

    inputContainer: {
        marginTop: 30,
        width: Dimensions.get('window').width - 40,
        height: 71,
        alignSelf: 'center',
        marginBottom: 10
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
        alignSelf: 'center',
        marginBottom:15 
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

    avatarSelected: {
        height: 50,
        width: 50,
        borderColor: "transparent",
        borderWidth: 2,
    },

    avatarUnselected: {
        height: 50,
        width: 50,
        borderColor: "#f3f3f3",
        borderWidth: 3,
    },

    avatarText: {
        width: Dimensions.get('window').width - 40,
        alignSelf: 'center'
    },

});


export default PasswordConfigView
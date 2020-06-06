import React from 'react'
import { StyleSheet, Text, Alert, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Input, Image, Button, CheckBox, Header, Icon } from 'react-native-elements';
import axios from 'axios';
import GLOBALS from '../Globals';
import base64 from 'react-native-base64'
import { ScrollView } from 'react-native-gesture-handler';
import LoadingOverlayView from '../components/generalComponents/LoadingOverlayView'

const APODO = 'apodo'
const NOMBRE = 'nombre'
const APELLIDO = 'apellido'
const TELEFONO_MOVIL = 'teléfono_movil'
const TELEFONO_FIJO = 'teléfono_fijo'
const EMAIL = 'correo'
const CONFIRM_EMAIL = 'repetir_correo'
const PASSWORD = 'contraseña'
const CONFIRM_PASSWORD = 'repetir_contraseña'
const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

class UserRegisterView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            sendingData: false,
            dataChange: false,
            isVisible: false,
            userData: {
                apodo: '',
                nombre: '',
                apellido: '',
                telefono_movil: '',
                telefono_fijo: '',
                correo: '',
                repetir_correo: '',
                contraseña: '',
                repetir_contraseña: ''
            },
            errorMessage: {
                apodo: '',
                nombre: '',
                apellido: '',
                telefono_movil: '',
                telefono_fijo: '',
                correo: '',
                repetir_correo: '',
                contraseña: '',
                repetir_contraseña: ''
            },
            imageChecked: [true, false, false, false],
            imageRoutesHashPng: [
                GLOBALS.image_4,
                GLOBALS.image_1,
                GLOBALS.image_2,
                GLOBALS.image_3,
            ],
            imageRoutesPng: [
                require('./configurationViewComponents/configurationAssets/avatar_4.png'),
                require('./configurationViewComponents/configurationAssets/avatar_1.png'),
                require('./configurationViewComponents/configurationAssets/avatar_2.png'),
                require('./configurationViewComponents/configurationAssets/avatar_3.png'),
            ],
            avatarSelected: 0,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    normalizeText(text) {
        let normalizeText = text.replace("_", " ");
        normalizeText = normalizeText.charAt(0).toUpperCase() + normalizeText.slice(1)
        return normalizeText;
    }

    dataValid() {
        return (this.validNickname() &&
            this.validName() &&
            this.validLastname() &&
            (this.validCellPhoneNumber() ||
                this.validPhoneNumber()))
            && this.validPassword() && this.validConfirmPassword()
            && this.validEmail() && this.validConfirmEmail()
            && this.validEqualsEmail() && this.validEqualsPassword()
    }

    validNickname() {
        return this.state.userData.apodo.length > 3
    }

    validName() {
        return this.state.userData.nombre.length > 3
    }

    validLastname() {
        return this.state.userData.apellido.length > 3
    }

    validCellPhoneNumber() {
        return this.state.userData.telefono_movil.length >= 5
    }

    validPhoneNumber() {
        return this.state.userData.telefono_fijo.length >= 5
    }

    validEmail() {
        return reg.test(this.state.userData.correo)
    }

    validConfirmEmail() {
        return reg.test(this.state.userData.repetir_correo)
    }

    validPassword() {
        return this.state.userData.contraseña.length >= 10 && this.state.userData.contraseña.length <= 21
    }

    validConfirmPassword() {
        return this.state.userData.repetir_contraseña.length >= 10 && this.state.userData.repetir_contraseña.length <= 21
    }

    validEqualsEmail() {
        return this.state.userData.correo === this.state.userData.repetir_correo
    }

    validEqualsPassword() {
        return this.state.userData.contraseña === this.state.userData.repetir_contraseña
    }

    showErrorNickName() {
        if (!this.validNickname()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    apodo: 'Debe tener más de 3 caracteres'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    apodo: ''
                })
            }))
        }
    }

    showErrorName() {
        if (!this.validName()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    nombre: 'Debe tener más de 3 caracteres'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    nombre: ''
                })
            }))
        }
    }

    showErrorLastName() {
        if (!this.validLastname()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    apellido: 'Debe tener más de 3 caracteres'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    apellido: ''
                })
            }))
        }
    }



    showErrorCellPhone() {
        if (!this.validCellPhoneNumber()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    telefono_movil: 'Debe tener 6 o más números'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    telefono_fijo: '',
                    telefono_movil: ''
                })
            }))
        }
    }

    showErrorPhoneNumber() {
        if (!this.validPhoneNumber()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    telefono_fijo: 'Debe tener 6 o más números'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    telefono_fijo: '',
                    telefono_movil: ''
                })
            }))
        }
    }


    showErrorPassword() {
        if (!this.validPassword()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    contraseña: 'Debe tener entre 10 a 26 caracteres'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    contraseña: '',
                })
            }))
        }
    }

    showErrorConfirmPassword() {
        if (!this.validConfirmPassword()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    repetir_contraseña: 'Debe tener entre 10 a 26 caracteres'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    repetir_contraseña: ''
                })
            }))
        }
    }

    showErrorEmail() {
        if (!this.validEmail()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    correo: 'Debe escribir un email válido'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    correo: ''
                })
            }))
        }
    }

    showErrorConfirmEmail() {
        if (!this.validConfirmEmail()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    repetir_correo: 'Debe escribir un email válido'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    repetir_correo: ''
                })
            }))
        }
    }

    showErrorEqualsEmails() {
        if (!this.validEqualsEmail()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    correo: 'Los correos no coinciden',
                    repetir_correo: 'Los correos no son iguales',
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    repetir_correo: '',
                    correo: ''
                })
            }))
        }
    }

    showErrorEqualsPasswords() {
        if (!this.validEqualsPassword()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    contraseña: 'Las contraseñas no coinciden',
                    repetir_contraseña: 'Las contraseñas no coinciden',
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    repetir_contraseña: '',
                    correo: ''
                })
            }))
        }
    }

    atLeastOneNumber() {
        return this.validPhoneNumber() || this.validCellPhoneNumber()
    }

    cleanErrorMessageOnPhones() {
        this.setState((prevState) => ({
            errorMessage: Object.assign({}, prevState.errorMessage, {
                telefono_movil: '',
                telefono_fijo: ''
            })
        }))
    }

    showErrorMessages() {
        this.showErrorNickName()
        this.showErrorName()
        this.showErrorLastName()
        if (this.atLeastOneNumber()) {
            this.cleanErrorMessageOnPhones()
        } else {
            this.showErrorCellPhone()
            this.showErrorPhoneNumber()
        }
        if (!this.validEqualsEmail()) {
            this.showErrorEqualsEmails()
        } else {
            this.showErrorEmail()
            this.showErrorConfirmEmail()

        }
        if (!this.validEqualsPassword()) {
            this.showErrorEqualsPasswords()
        } else {
            this.showErrorPassword()
            this.showErrorConfirmPassword()
        }
    }

    showAlertRegistered() {
        this.setState({
            sendingData: false,
            dataChange: false,
            isVisible: false,
        })
        Alert.alert('Aviso', 'Registro completado, se enviara un email a tu casilla. Ya podes ingresar.',
            [
                { text: 'Entendido', onPress: () => this.props.navigation.goBack() }
            ],
            { cancelable: false });
    }



    handleSubmit() {
        if (!this.state.sendingData) {
            if (this.dataValid()) {
                this.setState({ sendingData: true, isVisible: true })
                axios.post(this.serverBaseRoute + 'rest/client/sso/singUp', {
                    email: this.state.userData.correo,
                    password: this.state.userData.contraseña,
                    nickName: this.state.userData.apodo,
                    nombre: this.state.userData.nombre,
                    apellido: this.state.userData.apellido,
                    telefonoFijo: this.state.userData.telefono_fijo,
                    telefonoMovil: this.state.userData.telefono_movil,
                    extension: ".jpg",
                    avatar: this.state.imageRoutesHashPng[this.state.avatarSelected]

                }).then(res => {

                    this.showAlertRegistered()
                }).catch((error) => {
                    this.setState({ sendingData: false, isVisible: false })
                    if (error.response) {
                        Alert.alert('Error', error.response.data.error);
                    } else if (error.request) {
                        Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
                    } else {
                        Alert.alert('Error', "Ocurrio un error al tratar de registrar el usuario");
                    }
                });
            } else {
                this.showErrorMessages()
            }

        }
    }

    returnValueBasedOnFieldData(field) {
        switch (field) {
            case APODO:
                return this.state.userData.apodo
            case NOMBRE:
                return this.state.userData.nombre
            case APELLIDO:
                return this.state.userData.apellido
            case TELEFONO_MOVIL:
                return this.state.userData.telefono_movil
            case TELEFONO_FIJO:
                return this.state.userData.telefono_fijo
            case EMAIL:
                return this.state.userData.correo
            case CONFIRM_EMAIL:
                return this.state.userData.repetir_correo
            case PASSWORD:
                return this.state.userData.contraseña
            case CONFIRM_PASSWORD:
                return this.state.userData.repetir_contraseña

        }
    }

    checkIndex(data, index) {
        data.map((u, i) => {
            if (index == i) {
                data[i] = true;
            } else {
                data[i] = false;
            }
        })
    }

    onCheckAvatar(index) {
        let checks = this.state.imageChecked;
        this.checkIndex(checks, index);
        this.setState({
            avatarSelected: index,
            imageChecked: checks,
            dataChange: true,
        })
    }

    onlyNumbers(value) {
        let reg = new RegExp('^[0-9]+$');
        if (reg.test(value)) {
            let adjustedValue = parseInt(value, 10).toString();
            return adjustedValue
        }
        if (value.length == 0) {
            return value
        }
        return null
    }

    handleChangeOfField(field, value) {
        switch (field) {
            case APODO:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        apodo: value
                    })
                }))
                break;
            case NOMBRE:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        nombre: value
                    })
                }))
                break;

            case APELLIDO:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        apellido: value
                    })
                }))
                break;
            case TELEFONO_MOVIL:
                let datavalue = this.onlyNumbers(value)
                if (datavalue !== null) {
                    this.setState((prevState) => ({
                        dataChange: true,
                        userData: Object.assign({}, prevState.userData, {
                            telefono_movil: datavalue
                        })
                    }))
                }
                break;
            case TELEFONO_FIJO:
                let datavalue2 = this.onlyNumbers(value)
                if (datavalue2 !== null) {
                    this.setState((prevState) => ({
                        dataChange: true,
                        userData: Object.assign({}, prevState.userData, {
                            telefono_fijo: value
                        })
                    }))
                }
                break;
            case PASSWORD:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        contraseña: value
                    })
                }))
                break;
            case CONFIRM_PASSWORD:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        repetir_contraseña: value
                    })
                }))
                break;
            case EMAIL:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        correo: value
                    })
                }))
                break;
            case CONFIRM_EMAIL:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        repetir_correo: value
                    })
                }))
                break;

        }
    }

    assignErrorMessage(field) {
        switch (field) {
            case APODO:
                return this.state.errorMessage.apodo
            case NOMBRE:
                return this.state.errorMessage.nombre
            case APELLIDO:
                return this.state.errorMessage.apellido
            case TELEFONO_MOVIL:
                return this.state.errorMessage.telefono_movil
            case TELEFONO_FIJO:
                return this.state.errorMessage.telefono_fijo
            case EMAIL:
                return this.state.errorMessage.correo
            case CONFIRM_EMAIL:
                return this.state.errorMessage.repetir_correo
            case PASSWORD:
                return this.state.errorMessage.contraseña
            case CONFIRM_PASSWORD:
                return this.state.errorMessage.repetir_contraseña
        }
    }


    render() {
        const fields = [NOMBRE, APELLIDO];
        const fields_2 = [EMAIL, CONFIRM_EMAIL]
        const fields_3 = [PASSWORD, CONFIRM_PASSWORD]
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Header containerStyle={styles.topHeader}>
                        <Button
                            icon={
                                <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.rightHeaderButton}
                            onPress={() => this.props.navigation.goBack()}
                        />
                        <Image
                            style={{ width: 50, height: 55 }}
                            source={require('../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                        />
                    </Header>
                </View>
                <LoadingOverlayView isVisible={this.state.isVisible} loadingText={'Creando el usuario...'}></LoadingOverlayView>
                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}> Registro de usuario </Text>
                </View>
                <KeyboardAvoidingView style={{ flex: 1 }}>
                    <ScrollView style={{}}>
                        <View style={styles.formContainer}>
                            <View style={styles.soloInputContainer}>
                                <Text style={styles.fieldText}>{this.normalizeText(APODO)}</Text>
                                <Input
                                    inputStyle={this.returnValueBasedOnFieldData(APODO).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                    placeholderTextColor='black'
                                    onChangeText={text => this.handleChangeOfField(APODO, text)}
                                    placeholder={this.normalizeText(APODO)}
                                    value={this.returnValueBasedOnFieldData(APODO)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={this.assignErrorMessage(APODO)}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                                {fields.map((field, i) => {
                                    return (
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.fieldText}>{this.normalizeText(field)}</Text>
                                            <Input
                                                inputStyle={this.returnValueBasedOnFieldData(field).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                                placeholderTextColor='black'
                                                onChangeText={text => this.handleChangeOfField(field, text)}
                                                placeholder={this.normalizeText(field)}
                                                value={this.returnValueBasedOnFieldData(field)}
                                                errorStyle={{ color: 'red' }}
                                                errorMessage={this.assignErrorMessage(field)}
                                            />
                                        </View>)
                                })}
                            </View>
                            <Text style={styles.fieldTextPhone} >Ingrese al menos un teléfono</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.fieldText}>{this.normalizeText(TELEFONO_MOVIL)}</Text>
                                    <Input
                                        inputStyle={this.returnValueBasedOnFieldData(TELEFONO_MOVIL).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                        placeholderTextColor='black'
                                        onChangeText={text => this.handleChangeOfField(TELEFONO_MOVIL, text)}
                                        placeholder={this.normalizeText(TELEFONO_MOVIL)}

                                        value={this.returnValueBasedOnFieldData(TELEFONO_MOVIL)}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={this.assignErrorMessage(TELEFONO_MOVIL)}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={styles.fieldText}>{this.normalizeText(TELEFONO_FIJO)}</Text>
                                    <Input
                                        inputStyle={this.returnValueBasedOnFieldData(TELEFONO_FIJO).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                        placeholderTextColor='black'
                                        onChangeText={text => this.handleChangeOfField(TELEFONO_FIJO, text)}
                                        placeholder={this.normalizeText(TELEFONO_FIJO)}
                                        value={this.returnValueBasedOnFieldData(TELEFONO_FIJO)}
                                        errorStyle={{ color: 'red' }}
                                        errorMessage={this.assignErrorMessage(TELEFONO_FIJO)}
                                        keyboardType="numeric"
                                    />
                                </View>
                                {fields_2.map((field, i) => {
                                    return (
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.fieldText}>{this.normalizeText(field)}</Text>
                                            <Input
                                                inputStyle={this.returnValueBasedOnFieldData(field).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                                placeholderTextColor='black'
                                                onChangeText={text => this.handleChangeOfField(field, text)}
                                                placeholder={this.normalizeText(field)}
                                                value={this.returnValueBasedOnFieldData(field)}
                                                errorStyle={{ color: 'red' }}
                                                errorMessage={this.assignErrorMessage(field)}
                                            />
                                        </View>)
                                })}
                                {fields_3.map((field, i) => {
                                    return (
                                        <View style={styles.inputContainer}>
                                            <Text style={styles.fieldText}>{this.normalizeText(field)}</Text>
                                            <Input
                                                inputStyle={this.returnValueBasedOnFieldData(field).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                                placeholderTextColor='black'
                                                onChangeText={text => this.handleChangeOfField(field, text)}
                                                placeholder={this.normalizeText(field)}
                                                value={this.returnValueBasedOnFieldData(field)}
                                                errorStyle={{ color: 'red' }}
                                                errorMessage={this.assignErrorMessage(field)}
                                                secureTextEntry={true}
                                            />
                                        </View>)
                                })}
                            </View>
                            <View style={styles.avatarText}>
                                <Text style={styles.fieldText} >Avatar</Text>
                            </View>
                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                {this.state.imageRoutesPng.map((route, i) => {
                                    return (<CheckBox key={i} checked={this.state.imageChecked[i]}
                                        checkedIcon={<Image style={styles.avatarSelected} source={route} />}
                                        uncheckedIcon={<Image style={styles.avatarUnselected} source={route} />}
                                        onPress={() => this.onCheckAvatar(i)}
                                    />);
                                })}
                            </View>
                            <View style={styles.buttonContainer}>
                                <Button loading={this.state.sendingData} disabled={!this.state.dataChange} titleStyle={{ fontSize: 20, }} buttonStyle={styles.buttonRegisterStyle} onPress={() => this.handleSubmit()} title="Registrarme" />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}
const styles = StyleSheet.create({

    placeholderStyle: {
        marginLeft: 10,
        fontSize: 15
    },

    inputTextStyle: {
        color: 'rgba(51, 102, 255, 1)',
        marginLeft: 10,
        fontSize: 15
    },

    formContainer: {
        marginTop: 15
    },

    titleContainer: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },

    headerTitle: {
        backgroundColor: "white",
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },

    principalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'rgba(51, 102, 255, 1)',
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

    soloInputContainer: {
        width: Dimensions.get('window').width,
        height: 71,
        alignSelf: 'center',
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10
    },

    inputContainer: {
        width: Dimensions.get('window').width / 2,
        height: 71,
        alignSelf: 'center',
        marginBottom: 35
    },

    lowerInputContainer: {
        marginTop: 5,
        width: Dimensions.get('window').width - 40,
        height: 71,
        alignSelf: 'center'
    },

    buttonContainer: {
        marginTop: '2%',
        width: "95%",
        alignSelf: 'center',
        marginBottom: 15
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

    fieldText: {
        fontWeight: "bold",
        marginLeft: 10,
    },

    fieldTextPhone: {
        fontWeight: "bold",
        marginLeft: 10,
        color: "rgba(51, 102, 255, 1)",
        marginBottom: -15
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
        alignSelf: 'center',
        marginTop: 7,
        marginBottom: -5
    },

    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 15,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        marginTop: -25
    },

    buttonRegisterStyle: {
        height: 60,
        backgroundColor: '#5ebb47',
        borderColor: "transparent",
        borderWidth: 1
    },

});

export default UserRegisterView;
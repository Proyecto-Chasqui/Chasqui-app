import React from 'react'
import { StyleSheet, Text, Alert, View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Input, Image, Button, CheckBox } from 'react-native-elements';
import axios from 'axios';
import GLOBALS from '../../Globals';
import base64 from 'react-native-base64'
import { ScrollView } from 'react-native-gesture-handler';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView'

const APODO = 'apodo'
const NOMBRE = 'nombre'
const APELLIDO = 'apellido'
const TELEFONOMOVIL = 'teléfono_movil'
const TELEFONOFIJO = 'teléfono_fijo'

class PersonalDataView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.personalData = this.props.actions.personalData;
        this.login = this.props.actions.login;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            sendingData: false,
            dataChange: false,
            isVisible: false,
            userData: {
                apodo: this.props.personalData.nickName,
                nombre: this.props.personalData.nombre,
                apellido: this.props.personalData.apellido,
                telefono_movil: this.props.personalData.telefonoMovil,
                telefono_fijo: this.props.personalData.telefonoFijo
            },
            errorMessage: {
                apodo: '',
                nombre: '',
                apellido: '',
                telefono_movil: '',
                telefono_fijo: ''
            },
            imageChecked: [true, false, false, false],
            imageRoutesHashPng: [
                GLOBALS.image_4,
                GLOBALS.image_1,
                GLOBALS.image_2,
                GLOBALS.image_3,
            ],
            imageRoutesPng: [
                require('./configurationAssets/avatar_4.png'),
                require('./configurationAssets/avatar_1.png'),
                require('./configurationAssets/avatar_2.png'),
                require('./configurationAssets/avatar_3.png'),
            ],
            avatarSelected: 0,
        }
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

    showErrorMessages() {
        this.showErrorNickName()
        this.showErrorName()
        this.showErrorLastName()
        this.showErrorCellPhone()
        this.showErrorPhoneNumber()
    }

    flushErrors() {
        this.setState({
            errorMessage: {
                apodo: '',
                nombre: '',
                apellido: '',
                telefono_movil: '',
                telefono_fijo: ''
            },
        })
    }

    errorAlert(error){
        if (error.response) {
            if(error.response.status === 401){
                Alert.alert(
                    'Sesion expirada',
                    'Su sesión expiro, retornara a los catalogos para reiniciar su sesión',
                    [
                        { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            }else{
                if(error.response.data !== null){
                    Alert.alert(
                        'Error',
                         error.response.data.error,
                        [
                            { text: 'Entendido', onPress: () => null },
                        ],
                        { cancelable: false },
                    );
                }else{
                    Alert.alert(
                        'Error',
                        'Ocurrio un error inesperado, sera reenviado a los catalogos. Si el problema persiste comuniquese con soporte tecnico.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            }
        } else if (error.request) {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
            [
                { text: 'Entendido', onPress: () => this.props.actions.logout() },
            ],
            { cancelable: false },);
        } else {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde.",
            [
                { text: 'Entendido', onPress: () => this.props.actions.logout() },
            ],
            { cancelable: false },);
        }
    }

    getPersonalData() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/read',{withCredentials: true}).then(res => {
            this.personalData(res.data);
        }).catch((error) => {
            this.errorAlert(error)
        });
    }

    handleSubmit() {
        if (!this.state.sendingData) {
            if (this.dataValid()) {
                this.setState({ sendingData: true, isVisible: true })
                const token = base64.encode(`${this.props.user.email}:${this.props.user.token}`);
                axios.put(this.serverBaseRoute + 'rest/user/adm/edit', {
                    password: null,
                    nickName: this.state.userData.apodo,
                    nombre: this.state.userData.nombre,
                    apellido: this.state.userData.apellido,
                    telefonoFijo: this.state.userData.telefono_fijo,
                    telefonoMovil: this.state.userData.telefono_movil,
                    direccion: null,
                    extension: ".jpg",
                    avatar: this.state.imageRoutesHashPng[this.state.avatarSelected]

                },{withCredentials: true})
                    .then(res => {
                        res.data.nickname = this.state.userData.apodo,
                        this.props.actions.login(res.data);
                        this.setState({
                            sendingData: false,
                            dataChange: false,
                            isVisible: false,
                        })
                        this.login
                        this.getPersonalData()
                        this.flushErrors();
                        Alert.alert('Aviso', 'Los datos fueron actualizados correctamente');
                    }).catch((error) =>{
                        this.flushErrors();
                        this.setState({
                            sendingData: false,
                            dataChange: false,
                            isVisible: false,
                        })
                        this.errorAlert(error)
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
            case TELEFONOMOVIL:
                return this.state.userData.telefono_movil
            case TELEFONOFIJO:
                return this.state.userData.telefono_fijo
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
            case TELEFONOMOVIL:
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
            case TELEFONOFIJO:
                this.setState((prevState) => ({
                    dataChange: true,
                    userData: Object.assign({}, prevState.userData, {
                        telefono_fijo: value
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
            case TELEFONOMOVIL:
                return this.state.errorMessage.telefono_movil
            case TELEFONOFIJO:
                return this.state.errorMessage.telefono_fijo
        }
    }




    render() {
        const fields = [APODO, NOMBRE, APELLIDO];
        return (
            <KeyboardAvoidingView style={{flex:1}}>
            <ScrollView style={{height:Dimensions.get("window").height - 167}}>            
            <LoadingOverlayView isVisible={this.state.isVisible} loadingText={'Enviando sus datos al servidor...'}></LoadingOverlayView>
                    
                    {fields.map((field, i) => {
                        return (
                            <View key={i+10}style={styles.inputContainer}>
                                <Text style={styles.fieldText}>{this.normalizeText(field)}</Text>
                                <Input
                                    inputStyle={{ color: 'rgba(51, 102, 255, 1)', marginLeft: 10 }}
                                    placeholderTextColor='black'
                                    onChangeText={text => this.handleChangeOfField(field, text)}
                                    placeholder={this.normalizeText(field)}
                                    value={this.returnValueBasedOnFieldData(field)}
                                    errorStyle={{ color: 'red' }}
                                    errorMessage={this.assignErrorMessage(field)}
                                />
                            </View>)
                    })}
                    <View style={styles.inputContainer}>
                        <Text style={styles.fieldText}>{this.normalizeText(TELEFONOMOVIL)}</Text>
                        <Input
                            inputStyle={{ color: 'rgba(51, 102, 255, 1)', marginLeft: 10 }}
                            placeholderTextColor='black'
                            onChangeText={text => this.handleChangeOfField(TELEFONOMOVIL, text)}
                            placeholder={this.normalizeText(TELEFONOMOVIL)}
                            value={this.returnValueBasedOnFieldData(TELEFONOMOVIL)}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.assignErrorMessage(TELEFONOMOVIL)}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.fieldText}>{this.normalizeText(TELEFONOFIJO)}</Text>
                        <Input
                            inputStyle={{ color: 'rgba(51, 102, 255, 1)', marginLeft: 10 }}
                            placeholderTextColor='black'
                            onChangeText={text => this.handleChangeOfField(TELEFONOFIJO, text)}
                            placeholder={this.normalizeText(TELEFONOFIJO)}
                            value={this.returnValueBasedOnFieldData(TELEFONOFIJO)}
                            errorStyle={{ color: 'red' }}
                            errorMessage={this.assignErrorMessage(TELEFONOFIJO)}
                            keyboardType="numeric"
                        />
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
                        <Button loading={this.state.sendingData} disabled={!this.state.dataChange} buttonStyle={{ height: 60, backgroundColor: '#5ebb47', borderColor: "white", borderWidth: 1 }} titleStyle={{ fontSize: 20, }} onPress={this.handleSubmit} title="Guardar" />
                    </View>
                    
                </ScrollView>
                </KeyboardAvoidingView>
            
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
        marginBottom: '4%',
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

    fieldText: {
        fontWeight: "bold"
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

export default PersonalDataView;
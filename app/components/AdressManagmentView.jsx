import React from 'react'
import { Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Alert } from 'react-native'
import { Header, Button, Icon, ButtonGroup, Image, Input } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import base64 from 'react-native-base64'
import GOLBALS from './../Globals';

const NAMEREMAINDER = 'nombre_recordatorio *';
const STREET = 'calle_*';
const ELEVATION = 'altura_*';
const DEPARTMENT = 'departamento';
const STREETONE = 'calle_1';
const STREETTWO = 'calle_2';
const LOCATION = 'localidad_*';
const POSTALCODE = 'código_postal';
const COMMENTS = 'comentarios';

class AdressManagmentView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.apiKey = GOLBALS.APIKEY;
        this.serverBaseRoute = GOLBALS.BASE_URL;
        this.adressesData = this.props.actions.adressesData;
        this.state = {
            saveMessage: 'La dirección se guardo correctamente',
            deleteMessage: 'La dirección se eliminó correctamente',
            sendingData: false,
            dataChange: false,
            showMoreInfo: false,
            infoConfirmed:false,
            location: null,
            titleText: 'Nueva dirección',
            isNew: true,
            adressData: {
                id_Direccion:null,
                nombre_recordatorio: '',
                calle: '',
                altura: '',
                departamento: '',
                calle_1: '',
                calle_2: '',
                localidad: '',
                codigo_postal: '',
                comentarios: '',
            },
            errorMessage: {
                nombre_recordatorio: '',
                calle: '',
                altura: '',
                departamento: '',
                calle_1: '',
                calle_2: '',
                localidad: '',
                codigo_postal: '',
                comentarios: '',
            },
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(){
        if(this.state.infoConfirmed){
            if(this.state.isNew){
                this.sendNewDataToServer()
            }else{
                this.sendDataUpdateToServer()
            }
            this.setState({infoConfirmed:false,isNew:false})
        }
    }

    componentDidMount(){
        if(this.props.route.params.adressDataInfo){
            let data = this.props.route.params.adressDataInfo;
            this.setState({
                dataChange:true,
                titleText:'Editando dirección',
                isNew: false,
                adressData: {
                    id_Direccion: data.idDireccion,
                    nombre_recordatorio: data.alias,
                    calle: data.calle,
                    altura: data.altura.toString(),
                    departamento: data.departamento,
                    calle_1: data.calleAdyacente1,
                    calle_2: data.calleAdyacente2,
                    localidad: data.localidad,
                    codigo_postal: data.codigoPostal,
                    comentarios: data.comentario,
                },
            })
        }
    }

    showErrorRemainderName() {
        if (!this.validRemainderName()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    nombre_recordatorio: 'Debe asignar un nombre'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    nombre_recordatorio: ''
                })
            }))
        }
    }

    showErrorElevation() {
        if (!this.validElevation()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    altura: 'Debe escribir una altura'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    altura: ''
                })
            }))
        }
    }

    showErrorStreet() {
        if (!this.validStreet()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    calle: 'Debe escribir una calle'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    calle: ''
                })
            }))
        }
    }

    showErrorLocation() {
        if (!this.validLocation()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    localidad: 'Debe escribir una localidad'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    localidad: ''
                })
            }))
        }
    }

    showErrorMessages() {
        this.showErrorElevation()
        this.showErrorLocation()
        this.showErrorRemainderName()
        this.showErrorStreet()
    }

    assignErrorMessage(field) {
        switch (field) {
            case NAMEREMAINDER:
                return this.state.errorMessage.nombre_recordatorio
            case STREET:
                return this.state.errorMessage.calle
            case ELEVATION:
                return this.state.errorMessage.altura
            case DEPARTMENT:
                return this.state.errorMessage.departamento
            case STREETONE:
                return this.state.errorMessage.calle_1
            case STREETTWO:
                return this.state.errorMessage.calle_2
            case LOCATION:
                return this.state.errorMessage.localidad
            case POSTALCODE:
                return this.state.errorMessage.codigo_postal
            case COMMENTS:
                return this.state.errorMessage.comentarios
        }
    }

    returnValueBasedOnFieldData(field) {
        switch (field) {
            case NAMEREMAINDER:
                return this.state.adressData.nombre_recordatorio
            case STREET:
                return this.state.adressData.calle
            case ELEVATION:
                return this.state.adressData.altura
            case DEPARTMENT:
                return this.state.adressData.departamento
            case STREETONE:
                return this.state.adressData.calle_1
            case STREETTWO:
                return this.state.adressData.calle_2
            case LOCATION:
                return this.state.adressData.localidad
            case POSTALCODE:
                return this.state.adressData.codigo_postal
            case COMMENTS:
                return this.state.adressData.comentarios
        }
    }

    normalizeText(text) {
        let normalizeText = text.replace("_", " ");
        normalizeText = normalizeText.charAt(0).toUpperCase() + normalizeText.slice(1)
        return normalizeText;
    }

    handleChangeOfField(field, value) {
        switch (field) {
            case NAMEREMAINDER:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        nombre_recordatorio: value
                    })
                }))
                break;
            case STREET:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        calle: value
                    })
                }))
                break;
            case ELEVATION:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        altura: value
                    })
                }))
                break;
            case DEPARTMENT:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        departamento: value
                    })
                }))
                break;
            case STREETONE:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        calle_1: value
                    })
                }))
                break;
            case STREETTWO:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        calle_2: value
                    })
                }))
                break;
            case LOCATION:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        localidad: value
                    })
                }))
                break;
            case POSTALCODE:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        codigo_postal: value
                    })
                }))
                break;
            case COMMENTS:
                this.setState((prevState) => ({
                    dataChange: true,
                    adressData: Object.assign({}, prevState.adressData, {
                        comentarios: value
                    })
                }))
                break;
        }
    }

    validRemainderName() {
        return this.state.adressData.nombre_recordatorio.length > 1;
    }

    validStreet() {
        return this.state.adressData.calle.length > 1;
    }

    validElevation() {
        return this.state.adressData.altura.length > 1;
    }

    validLocation() {
        return this.state.adressData.localidad.length > 1;
    }

    dataValid() {
        return this.validRemainderName() && this.validStreet() && this.validElevation() && this.validLocation();
    }

    goBackAdress(){
        this.props.navigation.goBack();
    }

    showAlertActionComplete(text){
        Alert.alert(
            'Aviso',
            text,
            [
                { text: 'Entendido', onPress: () => this.goBackAdress() },
            ],
            { cancelable: false },
        );
    }

    updateAdressData(text){
        const token = base64.encode(`${this.props.user.email}:${this.props.user.token}`);
        axios.get(this.serverBaseRoute + 'rest/user/adm/dir', {
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Basic ${token}`
            }
        }).then(res => {
            this.adressesData(res.data);
            this.showAlertActionComplete(text);
        }).catch(function (error) {
            console.log("error en udpate", error);
            Alert.alert('Error', 'ocurrio un error al obtener los datos del usuario, ¿quizas ingreso desde otro dispositivo?');
        });
    }

    sendDataUpdateToServer(){
        
        this.setState({sendingData:true})
        axios.put(this.serverBaseRoute + 'rest/user/adm/dir', {
            idDireccion: this.state.adressData.id_Direccion,
            calle: this.state.adressData.calle ,
            calleAdyacente1: this.state.adressData.calle_1 ,
            calleAdyacente2: this.state.adressData.calle_2,
            altura: this.state.adressData.altura,
            localidad: this.state.adressData.localidad,
            departamento: this.state.adressData.departamento,
            alias: this.state.adressData.nombre_recordatorio,
            codigoPostal: this.state.adressData.codigo_postal,
            latitud: this.state.location.lat,
            longitud: this.state.location.lng,
            predeterminada: false,
            comentario: this.state.adressData.comentarios,
            pais: '',
            provincia: '',
        }).then(res => {
            this.updateAdressData(this.state.saveMessage);
        }).catch(function (error) {
            console.log(error);
            Alert.alert('Error', 'ocurrio un error al enviar los datos de la direccion');
        });
        this.setState({sendingData:false})
    }

    sendNewDataToServer(){
        this.setState({sendingData:true})
        axios.post(this.serverBaseRoute + 'rest/user/adm/dir', {
            calle: this.state.adressData.calle ,
            calleAdyacente1: this.state.adressData.calle_1 ,
            calleAdyacente2: this.state.adressData.calle_2,
            altura: this.state.adressData.altura,
            localidad: this.state.adressData.localidad,
            departamento: this.state.adressData.departamento,
            alias: this.state.adressData.nombre_recordatorio,
            codigoPostal: this.state.adressData.codigo_postal,
            latitud: this.state.location.lat,
            longitud: this.state.location.lng,
            predeterminada: false,
            comentario: this.state.adressData.comentarios,
            pais: '',
            provincia: '',
        }).then(res => {
            this.updateAdressData(this.state.saveMessage);
        }).catch(function (error) {
            console.log(error);
            Alert.alert('Error', 'ocurrio un error al enviar los datos de la direccion');
        });        
        this.setState({sendingData:false})
    }

    changeLocation(valLocation, sender){    
        console.log('location on change', valLocation);
        sender.setState({location: valLocation,
        infoConfirmed:true});
    }

    goToMap(geoStatus){
        this.props.navigation.navigate('MapaDeDirección',{
            geoFail: geoStatus,
            locationInfo: this.state.location,
            locationEditFunction: this.changeLocation,
            sender: this,
        });
    }

    handleSubmit(values) {
        if (!this.state.sendingData) {
            this.setState({sendingData:true})
            if (this.dataValid()) {
                let encodedQuery = this.state.adressData.calle + '+' + this.state.adressData.altura + '+' + this.state.adressData.localidad + '+' + 'Argentina';
                axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedQuery + '+&key=' + this.apiKey +''
                ).then(res => {
                    if(res.data.status === "OK"){
                        let valLocation = res.data.results[0].geometry.location;
                        this.setState({location: valLocation})
                        this.goToMap(false);
                    }else{                        
                        this.setState({sendingData:false})
                        Alert.alert('Aviso', 'No se pudo ubicar su posición con los datos proporcionados, ¿Que desea hacer?',
                        [
                            { text: 'Cambiar datos', onPress: () => null },
                            { text: 'Marcar en Mapa', onPress: () => this.goToMap(true) },
                        ],
                        { cancelable: false });
                    }
                    
                }).catch(function (error) {
                    Alert.alert('Error', 'Fallo al obtener la ubicación'); 
                });
            } else {
                this.showErrorMessages()
            }
            this.setState({sendingData:false})
        }
    }

    showMoreInfo() {
        this.setState({ showMoreInfo: !this.state.showMoreInfo })
    }

    deleteAdress(){
        if (!this.state.sendingData) {
            this.setState({sendingData:true})
            const token = base64.encode(`${this.props.user.email}:${this.props.user.token}`);
            axios.delete(this.serverBaseRoute + 'rest/user/adm/dir/'+ this.state.adressData.id_Direccion, {
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': `Basic ${token}`
                }
            }).then(res => {
                this.updateAdressData(this.state.deleteMessage);
            }).catch(function (error) {
                Alert.alert('Error', 'ocurrio un error al obtener los datos del usuario, ¿quizas ingreso desde otro dispositivo?');
            });
        }
    }

    alertDeleteAdress(){
        Alert.alert('Pregunta', '¿Esta seguro de eliminar la dirección "' + this.state.adressData.nombre_recordatorio + '" ?',
        [
            { text: 'No', onPress: () => null },
            { text: 'Si', onPress: () => this.deleteAdress() },
        ],
        { cancelable: false });
    }

    render() {
        const fields = [STREET, ELEVATION, DEPARTMENT, LOCATION];
        const fields_2 = [STREETONE, STREETTWO, POSTALCODE]
        return (
            <View>
                <View>
                    <Header containerStyle={styles.topHeader}>
                        <Button
                            icon={
                                <Icon name="bars" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.rightHeaderButton}
                            onPress={() => this.props.navigation.openDrawer()}
                        />
                        <Image
                            style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                            source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                        />
                        {!this.state.isNew ? (
                        <Button
                            icon={
                                <Icon name="trash" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.leftHeaderButton}
                            onPress={() => this.alertDeleteAdress()}
                        />
                        ):(null)
                        }

                    </Header>
                </View>
                <KeyboardAvoidingView>
                    <View style={styles.titleContainer}>
                        <Text style={styles.adressTitle}>{this.state.titleText}</Text>
                    </View>
                    <ScrollView style={{ height: Dimensions.get('window').height - 140 }}>
                        <View style={styles.soloInputContainer}>
                            <Text style={styles.fieldText}>{this.normalizeText(NAMEREMAINDER)}</Text>
                            <Input
                                inputStyle={{ color: 'rgba(51, 102, 255, 1)', marginLeft: 10 }}
                                placeholderTextColor='black'
                                onChangeText={text => this.handleChangeOfField(NAMEREMAINDER, text)}
                                placeholder={'Ej. casa, oficina, etc'}
                                value={this.returnValueBasedOnFieldData(NAMEREMAINDER)}
                                errorStyle={{ color: 'red' }}
                                errorMessage={this.assignErrorMessage(NAMEREMAINDER)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                            {fields.map((field, i) => {
                                return (
                                    <View style={styles.inputContainer}>
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
                                    </View>
                                )
                            })}
                        </View>

                        <View style={styles.moreInfoButtonContainer}>
                            <Text style={styles.caracteristicsStyle}>Agregar información adicional</Text>
                            <View style={styles.verticalDivisor} />
                            <Button icon={
                                this.state.showMoreInfo ? (
                                    <Icon
                                        name='caret-up'
                                        type='font-awesome'
                                        color='#b0b901'
                                        size={30}
                                    />) : (<Icon
                                        name='caret-down'
                                        type='font-awesome'
                                        color='#b0b901'
                                        size={30}
                                    />)}
                                containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                onPress={() => this.showMoreInfo()}></Button>
                        </View>
                        {
                            this.state.showMoreInfo ? (
                                <View>
                                    <Text style={styles.fieldText} > Entre calles</Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {fields_2.map((field, i) => {
                                            return (
                                                <View style={styles.inputContainer}>
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
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={styles.soloInputContainer}>
                                        <Text style={styles.fieldText}>{this.normalizeText(COMMENTS)}</Text>
                                        <Input
                                            inputStyle={{ color: 'rgba(51, 102, 255, 1)', marginLeft: 10 }}
                                            placeholderTextColor='black'
                                            onChangeText={text => this.handleChangeOfField(COMMENTS, text)}
                                            placeholder={'Ej. Casa de rejas verdes'}
                                            value={this.returnValueBasedOnFieldData(COMMENTS)}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={this.assignErrorMessage(COMMENTS)}
                                        />
                                    </View>
                                </View>
                            ) : (
                                    null
                                )
                        }

                        <View style={styles.buttonContainer}>
                            <Button loading={this.state.sendingData} disabled={!this.state.dataChange} buttonStyle={styles.buttonNext} titleStyle={{ fontSize: 20, color:'black' }} onPress={this.handleSubmit} title="Siguiente" />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

export default AdressManagmentView

const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)'
    },

    lowerHeaderStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        height: 35,
    },

    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 15,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },

    leftHeaderButton: {
        backgroundColor: '#66000000',
        marginLeft: 15,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
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

    adressTitle: {
        backgroundColor: "white",
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },

    inputContainer: {
        marginTop: 5,
        width: Dimensions.get('window').width / 2,
        height: 71,
        alignSelf: 'center',
        marginBottom: 10
    },

    soloInputContainer: {
        marginLeft: -5,
        marginTop:10,
        marginBottom: 20,
        width: Dimensions.get('window').width,
        height: 71,
        alignSelf: 'center',
        marginBottom: 10
    },

    fieldText: {
        marginLeft: 10,
        fontWeight:'bold'
    },


    buttonContainer: {
        marginTop: '2%',
        width: "95%",
        alignSelf: 'center'
    },

    TextStyle: {
        fontSize: 16,
        color: '#ffffff'

    },

    descriptionStyle: {
        marginLeft: 20,
        marginRight: 20,
        textAlign: 'justify'
    },

    caracteristicsContanierStyle: {
        flex: 1,
        borderRadius: 5,
        borderColor: "grey",
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
    },

    divisor: {
        borderTopWidth: 2,
        borderTopColor: "#D8D8D8",
        width: "100%"
    },

    verticalDivisor: {
        borderLeftWidth: 2,
        borderLeftColor: "#D8D8D8",
        height: "100%",
        alignSelf: "center"
    },

    buttonProducerContainerStyle: {
        alignSelf: "center",
        flex: 1,
        marginRight: 0,
    },

    buttonProducerStyle: {
        height: null,
        backgroundColor: "transparent"
    },

    caracteristicsStyle: {
        height: 30,
        fontSize: 17,
        flex: 9,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
        marginLeft: 10,
    },

    moreInfoButtonContainer: {
        flexDirection: "row",
        borderColor: 'grey',
        margin:10,
        borderRadius: 3,
        borderWidth: 1
    },

    producerStyle: {
        height: 40,
        width: "90%",
        fontSize: 15,
        alignSelf: "center",
        textAlign: 'justify'
    },

    buttonNext:{ 
        backgroundColor: "#f8f162",
        borderColor: 'grey',
        borderWidth: 1 
    }

})
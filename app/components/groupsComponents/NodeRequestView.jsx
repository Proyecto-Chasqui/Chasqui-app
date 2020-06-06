import React from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, KeyboardAvoidingView, ScrollView, Switch, TouchableOpacity } from 'react-native'
import { Button, Icon, Overlay, CheckBox, Image, Header, Input, ThemeConsumer } from 'react-native-elements';
import axios from 'axios'
import GLOBALS from '../../Globals'
import LoadingOverlayView from '../generalComponents/LoadingOverlayView'
import LoadingView from '../LoadingView'

const NOMBRENODO = 'nombre'
const BARRIO = 'barrio'
const DESCRIPCION = 'descripción'
const ABIERTO = 'NODO_ABIERTO'
const CERRADO = 'NODO_CERRADO'

const toggleSwitch = () => setIsEnabled(previousState => !previousState);

class NodeRequestView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            loadingData: true,
            activeRequest: null,
            sendingData: false,
            dataChange: false,
            isVisible: false,
            isOpen: true,
            dataChecksAdress: [],
            selectedAddress: [],
            nodeData: {
                nombre: '',
                barrio: '',
                descripcion: '',
                tiponodo: ABIERTO,
            },
            errorMessage: {
                nombre: '',
                barrio: '',
                descripcion: '',
            },
        }
    }


    componentDidMount() {
        this.createAddressChecks();
        if (this.props.route.params !== undefined) {
            if (this.props.route.params.editNodeMode) {
                this.setEditActiveNode()
            } else {
                this.getActiveRequest()
            }
        } else {
            this.getActiveRequest()
        }
    }

    createAddressChecks() {
        this.props.adressesData.map((adress, i) => {
            this.addCheck(adress);
        })
    }

    findAndSelectGroup(deleting) {
        if (!deleting) {
            this.props.groupsData.map((group, i) => {
                if (group.id === this.props.groupSelected.id) {
                    this.props.actions.groupSelected(group)
                }
            })
            this.setState({ isVisible: false })
            Alert.alert(
                'Nodo editado!',
                'El Nodo fue editado con exito!',
                [
                    { text: 'Entendido', onPress: () => this.props.navigation.goBack() },
                ],
                { cancelable: false },
            );
        } else {
            Alert.alert(
                'Nodo eliminado',
                'El Nodo fue eliminado con exito',
                [
                    {
                        text: 'Entendido', onPress: () =>
                            this.props.navigation.goBack()
                    },
                ],
                { cancelable: false },
            );
        }
    }

    defineStrategyRoute() {
        let value = ''
        if (this.props.vendorSelected.few.gcc) {
            value = 'rest/user/gcc/'
        }
        if (this.props.vendorSelected.few.nodos) {
            value = 'rest/user/nodo/'
        }
        return value
    }

    errorAlert(error) {
        if (error.response) {
            if (error.response.status === 401) {
                Alert.alert(
                    'Sesion expirada',
                    'Su sesión expiro, retornara a los catalogos para reiniciar su sesión',
                    [
                        { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            } else {
                if (error.response.data !== null) {
                    Alert.alert(
                        'Error',
                        error.response.data.error,
                        [
                            { text: 'Entendido', onPress: () => null },
                        ],
                        { cancelable: false },
                    );
                } else {
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
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
        } else {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde.");
        }
    }

    getGroups(deleting) {
        axios.get((this.serverBaseRoute + this.defineStrategyRoute() + 'all/' + this.props.vendorSelected.id), {}, { withCredentials: true }).then(res => {
            this.props.actions.groupsData(res.data);
            this.setState({ loading: false })
            this.findAndSelectGroup(deleting);
        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            this.errorAlert(error)
        });
    }

    setEditActiveNode() {
        this.setState({ loadingData: false })
        if (this.props.groupSelected !== null) {
            this.setState((prevState) => ({
                dataChange: true,
                isOpen: this.props.groupSelected.tipo === ABIERTO,
                nodeData: Object.assign({}, prevState.nodeData, {
                    nombre: this.props.groupSelected.alias,
                    barrio: this.props.groupSelected.barrio,
                    tipoNodo: this.props.groupSelected.tipo,
                    descripcion: this.props.groupSelected.descripcion,
                })

            }))
            this.onCheckChangedAdress(this.props.groupSelected.direccionDelNodo.id);
        }
    }

    toggleSwitch = () => this.setState({ isOpen: !this.state.isOpen });

    isValidNodeName() {
        return this.state.nodeData.nombre.length > 2
    }

    isValidBarrio() {
        return this.state.nodeData.barrio.length > 2
    }

    isValidDescription() {
        return this.state.nodeData.descripcion.length > 2
    }

    isAdressSelected() {
        return this.state.selectedAddress.length > 0
    }

    returnValueBasedOnFieldData(field) {
        switch (field) {
            case NOMBRENODO:
                return this.state.nodeData.nombre
            case DESCRIPCION:
                return this.state.nodeData.descripcion
            case BARRIO:
                return this.state.nodeData.barrio
        }
    }

    handleChangeOfField(field, value) {
        switch (field) {
            case NOMBRENODO:
                this.setState((prevState) => ({
                    dataChange: true,
                    nodeData: Object.assign({}, prevState.nodeData, {
                        nombre: value
                    })
                }))
                if (value.length < 2 || value.length > 64) {
                    this.setState((prevState) => ({
                        dataChange: true,
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            nombre: "Debe contener entre 2 y 64 caracteres"
                        })
                    }))
                } else {
                    this.setState((prevState) => ({
                        dataChange: true,
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            nombre: ""
                        })
                    }))
                }
                break;
            case DESCRIPCION:
                this.setState((prevState) => ({
                    dataChange: true,
                    nodeData: Object.assign({}, prevState.nodeData, {
                        descripcion: value
                    })
                }))
                if (value.length < 2 || value.length > 64) {
                    this.setState((prevState) => ({
                        dataChange: true,
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            descripcion: "Debe contener entre 2 y 64 caracteres"
                        })
                    }))
                } else {
                    this.setState((prevState) => ({
                        dataChange: true,
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            descripcion: ""
                        })
                    }))
                }
                break;
            case BARRIO:
                this.setState((prevState) => ({
                    dataChange: true,
                    nodeData: Object.assign({}, prevState.nodeData, {
                        barrio: value
                    })
                }))
                if (value.length < 2 || value.length > 64) {
                    this.setState((prevState) => ({
                        dataChange: true,
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            barrio: "Debe contener entre 2 y 64 caracteres"
                        })
                    }))
                } else {
                    this.setState((prevState) => ({
                        dataChange: true,
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            barrio: ""
                        })
                    }))
                }
                break;

        }
    }

    assignErrorMessage(field) {
        switch (field) {
            case NOMBRENODO:
                return this.state.errorMessage.nombre
            case DESCRIPCION:
                return this.state.errorMessage.descripcion
            case BARRIO:
                return this.state.errorMessage.barrio
        }
    }

    createPlaceHolder(field) {
        switch (field) {
            case NOMBRENODO:
                return "Nombre identificador del nodo"
            case DESCRIPCION:
                return "Es la descripción del nodo"
            case BARRIO:
                return "Barrio del domicilio del nodo"
        }
    }


    normalizeText(text) {
        let normalizeText = text.replace("_", " ");
        normalizeText = normalizeText.charAt(0).toUpperCase() + normalizeText.slice(1)
        return normalizeText;
    }

    dataValid() {
        return this.isValidBarrio() && this.isValidDescription && this.isValidNodeName() && this.isAdressSelected()
    }

    showErrorMessages() {
        if (!this.isValidNodeName()) {
            this.setState((prevState) => ({
                dataChange: true,
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    nombre: "Debe contener entre 2 y 64 caracteres"
                })
            }))
        }
        if (!this.isValidDescription()) {
            this.setState((prevState) => ({
                dataChange: true,
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    descripcion: "Debe contener entre 2 y 64 caracteres"
                })
            }))
        }
        if (!this.isValidBarrio()) {
            this.setState((prevState) => ({
                dataChange: true,
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    barrio: "Debe contener entre 2 y 64 caracteres"
                })
            }))
        }
    }

    showAlertRequestSended(text) {
        this.setState({ isVisible: false })
        Alert.alert('Aviso',
            text,
            [
                { text: 'Entendido', onPress: () => this.props.navigation.goBack() },
            ],
            { cancelable: false });
    }

    fillData() {
        this.setState({ loadingData: false })
        if (this.state.activeRequest !== null) {
            this.setState((prevState) => ({
                dataChange: true,
                isOpen: this.state.activeRequest.tipoNodo === ABIERTO,
                nodeData: Object.assign({}, prevState.nodeData, {
                    nombre: this.state.activeRequest.nombreNodo,
                    barrio: this.state.activeRequest.barrio,
                    tipoNodo: this.state.activeRequest.tipoNodo,
                    descripcion: this.state.activeRequest.descripcion,
                })

            }))
            this.onCheckChangedAdress(this.state.activeRequest.domicilio.id);
        }
    }

    findActive(requests) {
        requests.map((request) => {
            if (request.estado === 'solicitud_nodo_en_gestion') {
                this.setState({ activeRequest: request })
            }
        })
    }

    getActiveRequest() {
        axios.get(this.serverBaseRoute + 'rest/user/nodo/solicitudesDeCreacion/' + this.props.vendorSelected.id)
            .then(res => {
                this.findActive(res.data)
                this.fillData()
            }).catch((error) => {
                this.setState({ sendingData: false, isVisible: false })
                console.log("error", error)
                this.errorAlert(error)
            })
    }

    askCancel() {
        Alert.alert('Aviso',
            "¿Esta seguro de cancelar la solicitud?",
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.cancelRequest() },
            ],
            { cancelable: false });
    }

    cancelRequest() {
        if (!this.state.sendingData) {
            this.setState({ sendingData: true, isVisible: true })
            axios.post(this.serverBaseRoute + 'rest/user/nodo/cancelarSolicitudDeCreacion', {
                idSolicitud: this.state.activeRequest.id,
                idVendedor: this.props.vendorSelected.id,
            }).then(res => {
                this.showAlertRequestSended("La solicitud fue cancelada!")
            }).catch((error) => {
                this.setState({ sendingData: false, isVisible: false })
                console.log("error", error.response)
                this.errorAlert(error)
            });
        }
    }

    sendNodeEdit() {
        if (!this.state.sendingData) {
            if (this.dataValid()) {
                this.setState({ sendingData: true, isVisible: true })
                axios.put(this.serverBaseRoute + 'rest/user/nodo/editarNodo', {
                    idNodo: this.props.groupSelected.id,
                    idVendedor: this.props.vendorSelected.id,
                    nombreNodo: this.state.nodeData.nombre,
                    idDireccion: this.state.selectedAddress[0],
                    tipoNodo: (this.state.isOpen) ? ABIERTO : CERRADO,
                    barrio: this.state.nodeData.barrio,
                    descripcion: this.state.nodeData.descripcion,
                }).then(res => {
                    this.getGroups(false)

                }).catch((error) => {
                    this.setState({ sendingData: false, isVisible: false })
                    console.log("error", error.response)
                    this.errorAlert(error)
                });
            } else {
                this.showErrorMessages()
            }
        }
    }

    handleEdit() {
        if (!this.state.sendingData) {
            if (this.dataValid()) {
                this.setState({ sendingData: true, isVisible: true })
                axios.post(this.serverBaseRoute + 'rest/user/nodo/editarSolicitudDeCreacion', {
                    idSolicitud: this.state.activeRequest.id,
                    idVendedor: this.props.vendorSelected.id,
                    nombreNodo: this.state.nodeData.nombre,
                    idDomicilio: this.state.selectedAddress[0],
                    tipoNodo: (this.state.isOpen) ? ABIERTO : CERRADO,
                    barrio: this.state.nodeData.barrio,
                    descripcion: this.state.nodeData.descripcion,
                }).then(res => {

                    this.showAlertRequestSended("La solicitud fue editada con exito")
                }).catch((error) => {
                    this.setState({ sendingData: false, isVisible: false })
                    console.log("error", error.response)
                    this.errorAlert(error)
                });
            } else {
                this.showErrorMessages()
            }
        }
    }

    handleSubmit() {
        if (!this.state.sendingData) {
            if (this.dataValid()) {
                this.setState({ sendingData: true, isVisible: true })
                axios.post(this.serverBaseRoute + 'rest/user/nodo/alta', {
                    idVendedor: this.props.vendorSelected.id,
                    nombreNodo: this.state.nodeData.nombre,
                    idDomicilio: this.state.selectedAddress[0],
                    tipoNodo: (this.state.isOpen) ? ABIERTO : CERRADO,
                    barrio: this.state.nodeData.barrio,
                    descripcion: this.state.nodeData.descripcion,
                }).then(res => {

                    this.showAlertRequestSended("La solicitud fue enviada correctamente, mientras la misma no este aprobada puede editar o cancelarla en esta misma sección.")
                }).catch((error) => {
                    this.setState({ sendingData: false, isVisible: false })
                    console.log("error", error.response)
                    this.errorAlert(error)
                });
            } else {
                this.showErrorMessages()
            }
        }
    }

    unCheckOthers(data, index) {
        data.map((u, i) => {
            if (index != i) {
                u.checked = false;
            }
        })
    }


    flushSelections() {
        this.unCheckOthers(this.state.dataChecksAdress)
        this.setState({ selectedAddress: [] })
    }

    getOpenColor() {
        if (this.state.nodeData.tiponodo === ABIERTO) {
            return "green"
        } else {
            return "blue"
        }
    }

    getCloseColor() {
        if (this.state.nodeData.tiponodo === CERRADO) {
            return "blue"
        } else {
            return "green"
        }
    }

    goToNewAdress() {
        this.flushSelections()
        this.props.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: null,
        });
    }

    goToEditAdress(adressData) {
        this.flushSelections()
        this.props.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: adressData,
        });
    }

    addCheck(vadress) {
        const data = this.state.dataChecksAdress;
        data.push({ adress: vadress, id: vadress.idDireccion, checked: false })
        this.setState({
            dataChecksAdress: data,
        })
    }

    findIndexOf(vadress) {
        const index = this.state.dataChecksAdress.findIndex((x) => x.id === vadress.idDireccion);
        return index
    }

    parseAdress(adress) {
        return adress.calle + ", " + adress.altura + ", " + adress.localidad
    }

    onCheckChangedAdress(id) {
        const data = this.state.dataChecksAdress;
        const index = data.findIndex((x) => x.id === id);
        if (index !== -1) {
            data[index].checked = !data[index].checked;
            this.unCheckOthers(data, index);
            let selectedItems = [];
            let selectedAdressItem = undefined;
            data.map((u, i) => {
                if (u.checked) {
                    selectedItems.push(u.id);
                    selectedAdressItem = u.adress;
                }
            });
            this.setState({
                selectedAddress: selectedItems,
                dataChecksAdress: data,
            });
        }
    }

    editNodeMode() {
        if (this.props.route.params !== undefined) {
            return this.props.route.params.editNodeMode
        } else {
            return false
        }
    }

    render() {
        if (this.state.loadingData) {
            return (<LoadingView></LoadingView>)
        }
        const fields = [NOMBRENODO, BARRIO, DESCRIPCION];
        return (
            <View style={{ flex: 1 }}>
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
                        source={require('../../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                    />
                    {this.state.activeRequest !== null ? (
                        <Button
                            icon={
                                <Icon name="times-circle" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.leftHeaderButton}
                            onPress={() => this.askCancel()}
                        />) : (null)}
                </Header>
                <LoadingOverlayView isVisible={this.state.isVisible} loadingText={'Enviando datos...'}></LoadingOverlayView>
                <View style={styles.titleContainer}>
                    <Text style={styles.adressTitle}>{!this.editNodeMode() ? ("Solicitud de nodo") : ("Gestión del nodo")}</Text>
                </View>
                <KeyboardAvoidingView style={{ flex: 1 }}>
                    <ScrollView style={{}}>
                        <View style={styles.formContainer}>
                            {fields.map((field, i) => {
                                return (
                                    <View key={i} style={styles.soloInputContainer}>
                                        <Text style={styles.sectionTitleTextStyle}>{this.normalizeText(field)}</Text>
                                        <Input
                                            inputStyle={this.returnValueBasedOnFieldData(field).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                            placeholderTextColor='black'
                                            onChangeText={text => this.handleChangeOfField(field, text)}
                                            placeholder={this.createPlaceHolder(field)}
                                            value={this.returnValueBasedOnFieldData(field)}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={this.assignErrorMessage(field)}
                                        />
                                    </View>)
                            })}
                            <View style={{}}>
                                <Text style={styles.sectionTitleTextStyle}>Tipo de nodo</Text>
                                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 15, marginBottom: 5 }}>
                                    <Text style={{ color: this.state.isOpen ? "grey" : "red", fontWeight: "bold", fontSize: 16 }}>Cerrado</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "green" }}
                                        thumbColor={this.state.isOpen ? "blue" : "red"}
                                        onValueChange={() => this.toggleSwitch()}
                                        value={this.state.isOpen}
                                    />
                                    <Text style={{ color: this.state.isOpen ? "blue" : "grey", fontWeight: "bold", fontSize: 16 }}>Abierto</Text>
                                </View>
                                <View style={{ marginTop: 5, marginBottom: 5 }}>
                                    {this.state.isOpen ? (
                                        <Text style={styles.tipText}> Un nodo abierto se verá en la sección "Busca un nodo".</Text>
                                    ) : (
                                            <Text style={styles.tipText}> Un nodo cerrado solo será visible por invitación.</Text>
                                        )
                                    }
                                </View>
                            </View>

                            <View style={{ flex: 1, marginBottom: 10 }}>
                                <Text style={styles.sectionTitleTextStyle}>Dirección del nodo</Text>
                                <Button titleStyle={{ color: "black", }}
                                    containerStyle={styles.buttonAddProductContainer}
                                    buttonStyle={styles.buttonNewAddressStyle}
                                    onPress={() => this.goToNewAdress()} title="Nueva dirección">
                                </Button>
                                {this.props.adressesData.length === 0 ? (
                                    <View style={{ marginStart: 5, marginEnd: 5, borderWidth: 2, borderRadius: 5, flex: 1 }}>
                                        <View style={{ margin: 5, flexDirection: "row" }}>
                                            <View style={styles.searchIconErrorContainer}>
                                                <Icon name="exclamation" type='font-awesome' size={25} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                            </View>
                                            <View style={{ flex: 1, marginStart: 5 }}>
                                                <Text style={{ fontStyle: "italic" }}> No posee ninguna dirección en su perfil, debe crear una nueva dirección para asignar al nodo.</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (null)}
                                {this.props.adressesData.map((adress, i) => {
                                    const index = this.findIndexOf(adress);

                                    return (
                                        <TouchableOpacity key={adress.idDireccion} onPress={() => this.onCheckChangedAdress(adress.idDireccion)} style={{ flexDirection: "row", alignItems: 'center', height: 90, borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                            <View style={{ flex: 1 }}>
                                                <CheckBox
                                                    checked={this.state.dataChecksAdress[index].checked}
                                                    onPress={() => this.onCheckChangedAdress(adress.idDireccion)}
                                                />
                                            </View>
                                            <View style={{ flex: 5 }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{adress.alias}</Text>
                                                <Text style={{ color: "blue" }}>{this.parseAdress(adress)}</Text>
                                                <Text style={{ fontSize: 16 }}>{adress.comentario}</Text>

                                            </View>
                                            <View style={{ flex: 1, marginRight: 10 }}>
                                                <Button icon={
                                                    <Icon
                                                        name='edit'
                                                        type='font-awesome'
                                                        size={25} />
                                                } buttonStyle={{ backgroundColor: "transparent", height: "100%" }} onPress={() => this.goToEditAdress(adress)}></Button>
                                            </View>
                                        </TouchableOpacity>)
                                })}
                            </View>
                            {!this.editNodeMode() ? (
                                <View>
                                    {this.state.activeRequest === null ? (
                                        <View style={styles.buttonContainer}>
                                            <Button loading={this.state.sendingData} disabled={!this.state.dataChange || !(this.state.selectedAddress.length > 0)} titleStyle={{ fontSize: 20, }} buttonStyle={styles.buttonRegisterStyle} onPress={() => this.handleSubmit()} title="Enviar Solicitud" />
                                        </View>
                                    ) : (
                                            <View style={styles.buttonContainer}>
                                                <Button loading={this.state.sendingData} disabled={!this.state.dataChange || !(this.state.selectedAddress.length > 0)} titleStyle={{ fontSize: 20, }} buttonStyle={styles.buttonRegisterStyle} onPress={() => this.handleEdit()} title="Editar Solicitud" />
                                            </View>
                                        )}
                                </View>
                            ) : (
                                    <View style={styles.buttonContainer}>
                                        <Button loading={this.state.sendingData} disabled={!this.state.dataChange || !(this.state.selectedAddress.length > 0)} titleStyle={{ fontSize: 20, }} buttonStyle={styles.buttonRegisterStyle} onPress={() => this.sendNodeEdit()} title="Editar Nodo" />
                                    </View>
                                )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    placeholderStyle: {
        marginLeft: 10,
        fontSize: 15,
        fontStyle: "italic",
        textAlign: "center"
    },

    inputTextStyle: {
        color: 'rgba(51, 102, 255, 1)',
        marginLeft: 10,
        fontSize: 15,
        textAlign: "center",
    },
    searchIconError: {
        marginTop: 8,
    },
    searchIconErrorContainer: {
        backgroundColor: "rgba(51, 102, 255, 1)",
        borderWidth: 2,
        borderRadius: 50,
        width: 45,
        height: 45,
        alignSelf: 'center'
    },
    sectionTitleTextStyle: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: 'rgba(51, 102, 255, 1)',
        color: "white",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: 'black'
    },
    formContainer: {
        marginTop: 0
    },
    tipText: {
        fontWeight: "bold",
        marginLeft: 10,
        color: "blue",
        textAlign: "center"
    },
    soloInputContainer: {
        width: Dimensions.get('window').width,
        height: 71,
        alignSelf: 'center',
        marginLeft: 10,
        marginBottom: 15,
        marginRight: 10
    },
    fieldText: {
        fontWeight: "bold",
        marginLeft: 10,
    },
    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        marginTop: -25
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

    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: -20,
        marginStart: -15,
        marginEnd: -13,
        marginTop: -14.5,
        marginBottom: 0,
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

    searchContainer: {
        marginTop: -20,
        backgroundColor: "transparent",
        marginLeft: -18,
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        borderWidth: 0,
    },

    inputSearchContainer: {
        backgroundColor: "transparent",
        borderColor: "white",
        marginTop: -5,
        height: 30,
        width: "350%",
        borderWidth: 0,
    },

    inputStyle: {
        width: "100%",
        fontSize: 13,
        fontWeight: "bold",
        color: "black",

    },
    iconContainerLeft: {
        backgroundColor: "transparent",
    },

    searchIcon: {
        color: "rgba(51, 102, 255, 1)",
    },

    lowerHeaderButton: {
        backgroundColor: '#66000000',
        marginLeft: 15,
        borderColor: "grey",
        borderLeftWidth: 1,
        borderRadius: 0,
        width: 100,
        height: 20,
        marginBottom: 25,
        marginLeft: -5
    },

    iconLowerHeaderButton: {
        marginRight: 15,
        color: "rgba(51, 102, 255, 1)"
    },

    lowerHeaderButtonTitle: {
        color: "rgba(51, 102, 255, 1)"
    },

    overlayContainer: {
    },

    loadingTextStyle: {
        position: "absolute",
        fontSize: 24,
        marginTop: 5,
        color: 'white',
        fontWeight: "bold",
        marginTop: "100%",
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

    buttonRegisterStyle: {
        height: 60,
        backgroundColor: '#5ebb47',
        borderColor: "transparent",
        borderWidth: 1
    },


    buttonNewAddressStyle: {
        backgroundColor: "#f8f162",
        borderColor: 'grey',
        borderWidth: 1
    },

    buttonAddProductContainer: {
        margin: 10
    },
});

export default NodeRequestView;
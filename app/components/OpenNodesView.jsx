import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native'
import { Header, Button, Icon, Image, Overlay, Input, Badge } from 'react-native-elements'
import axios from 'axios'
import GLOBALS from '../Globals'
import LoadingView from '../components/LoadingView'
import { AsyncStorage } from 'react-native';

class OpenNodesView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL
        this.state = {
            isLoading: true,
            showOpenNodes: true,
        }
    }

    componentDidUpdate() {
        if (this.props.hasReceivedPushNotifications) {
            this.getOpenNodes()
            if (this.props.user.id !== 0) {
                this.getAccessOpenNodeRequests()
            } else {
                this.props.actions.accessOpenNodeRequests([])
            }
            this.props.actions.hasReceivedPushNotifications(false)
        }
    }

    componentDidMount() {
        this.getOpenNodes()
        if (this.props.user.id !== 0) {
            this.getAccessOpenNodeRequests()
        } else {
            this.props.actions.accessOpenNodeRequests([])
        }
    }

    errorAlert(error) {
        if (error.response) {
            if (error.response.status === 401) {
                Alert.alert(
                    'Sesion expirada',
                    'Su sesión expiro, se va a reiniciar la aplicación.',
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
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                } else {
                    Alert.alert(
                        'Error',
                        'Ocurrió un error inesperado, sera reenviado a los catalogos. Si el problema persiste comuníquese con soporte técnico.',
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

    getAccessOpenNodeRequests() {
        axios.get((this.serverBaseRoute + 'rest/user/nodo/obtenerSolicitudesDePertenenciaDeUsuario/' + this.props.vendorSelected.id))
            .then(res => {
                this.props.actions.accessOpenNodeRequests(res.data)
            }).catch((error) => {
                this.setState({ loading: false })
                console.log(error);
                this.errorAlert(error)
            });
    }

    getOpenNodes() {
        this.setState({ loading: true })
        axios.get((this.serverBaseRoute + 'rest/client/vendedor/nodosAbiertos/' + this.props.vendorSelected.id), {}).then(res => {
            this.props.actions.openNodesData(res.data);
            this.setState({ loading: false })
        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            this.errorAlert(error)
        });
    }

    defineZone(zone) {
        if (zone !== null) {
            return zone.nombre
        } else {
            return "No definida"
        }
    }


    parseAdress(adress) {
        if (adress !== null) {
            return adress.calle + ", " + adress.localidad
        } else {
            return "No definida"
        }
    }

    hasDescription(text) {
        if (text !== null) {
            return text.length > 0
        }
        return false
    }

    userIsInNodeOrHasUserRequest(item) {
        let isInNode = false;
        let hasSendRequest = false;
        this.props.groupsData.map((group) => {
            if (group.id === item.idNodo) {
                isInNode = true;
            }
        })

        this.props.accessOpenNodeRequests.map((request) => {
            if (request.nodo.idNodo === item.idNodo && request.estado === "solicitud_pertenencia_nodo_enviado") {
                hasSendRequest = true;
            }
        })

        return isInNode || hasSendRequest;
    }

    async goToLogin() {
        try {
            await AsyncStorage.removeItem("user");
            this.props.navigation.navigate("Catalogos")
            this.props.actions.logout();
        } catch (error) {
            console.log("error on go to login", error.message)
        }
    }

    askSendUserRequest(item) {
        if (this.props.user.id !== 0) {
            Alert.alert(
                'Pregunta',
                "¿Esta seguro de enviar la solicitud al nodo " + item.nombreDelNodo + " ?",
                [
                    { text: 'No', onPress: () => null },
                    { text: 'Si', onPress: () => this.sendUserRequest(item.idNodo) },
                ],
                { cancelable: false },
            );
        } else {
            Alert.alert(
                'Aviso',
                "Debe ingresar con una cuenta para poder enviar una solicitud.",
                [
                    { text: 'Ingresar', onPress: () => this.goToLogin() },
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
        }

    }

    messageAlert(text) {
        Alert.alert(
            'Aviso',
            text,
            [
                { text: 'Entendido', onPress: () => null },
            ],
            { cancelable: false },
        );
    }

    sendUserRequest(nodeId) {
        axios.post((this.serverBaseRoute + 'rest/user/nodo/enviarSolicitudDePertenencia'), {
            idVendedor: this.props.vendorSelected.id,
            idNodo: nodeId,
        }).then(res => {
            this.messageAlert("La solicitud enviada con éxito!, recibirá un email con la decisión cuando el administrador del nodo la gestione. También puede cancelarla en la sección 'Solicitudes' visible desde el botón superior derecho")
            this.getAccessOpenNodeRequests()
        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            this.errorAlert(error)
        });
    }

    askCancelRequest(item) {
        if (this.props.user.id !== 0) {
            Alert.alert(
                'Pregunta',
                "¿Esta seguro de cancelar la solicitud al nodo " + item.nodo.nombreDelNodo + " ?",
                [
                    { text: 'No', onPress: () => null },
                    { text: 'Si', onPress: () => this.cancelUserRequest(item.id) },
                ],
                { cancelable: false },
            );
        } else {
            Alert.alert(
                'Aviso',
                "Debe ingresar con una cuenta para poder cancelar la solicitud.",
                [
                    { text: 'Ingresar', onPress: () => this.props.actions.logout() },
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
        }
    }


    cancelUserRequest(id) {
        axios.post((this.serverBaseRoute + 'rest/user/nodo/cancelarSolicitudDePertenencia/' + id)).then(res => {
            this.messageAlert("La solicitud se cancelo correctamente")
            this.getAccessOpenNodeRequests()
        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            this.errorAlert(error)
        });
    }

    keyExtractor = (item, index) => index.toString()

    canShowRequest(estado) {
        return estado === "solicitud_pertenencia_nodo_enviado"
    }

    renderRequest = ({ item }) => (
        <View>
            {this.canShowRequest(item.estado) ? (
                <View>
                    <View style={styles.nodeItem}>
                        <View style={{ width: "100%" }}>
                            <View style={styles.infoTextContainer}>
                                <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 17, color: "white", }}>{item.nodo.nombreDelNodo}</Text>
                            </View>
                            {this.hasDescription(item.nodo.descripcion) ? (
                                <View style={{ backgroundColor: "#ebedeb" }}>
                                    <View style={{ alingItems: "center", flexDirection: "row", margin: 5, marginStart: 10, marginEnd: 10 }}>
                                        <Text style={{ fontSize: 16, fontWeight: "bold", color: '#00adee' }}>{item.nodo.descripcion}</Text>
                                    </View>
                                    <View style={{ borderBottomWidth: 1, borderColor: "grey" }}></View>
                                </View>
                            ) : (null)}
                            <View style={{ margin: 10, }}>
                                <View style={{ alingItems: "center", flexDirection: "row" }}>
                                    <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Dirección: </Text>{this.parseAdress(item.nodo.direccionDelNodo)}</Text>
                                </View>
                                <View style={{ alingItems: "center", flexDirection: "row" }}>
                                    <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Zona: </Text>{this.defineZone(item.nodo.zona)}</Text>
                                </View>
                                <View style={{ alingItems: "center", flexDirection: "row" }}>
                                    <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Contacto: </Text>{item.nodo.emailAdministrador}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, }}>
                                <Button
                                    title="Cancelar Solicitud" titleStyle={{ color: 'white', justifyContent: "flex-start" }} buttonStyle={styles.subMenuButtonCancelStyle} raised={false} type="solid"
                                    icon={
                                        <View style={{ marginRight: 5, alignSelf: "center" }}>
                                            <Icon name="cancel" size={24} color="white" type='material' />
                                        </View>
                                    }
                                    onPress={() => this.askCancelRequest(item)}
                                ></Button>
                            </View>
                        </View>
                    </View>
                </View>
            ) : (null)}
        </View>
    )

    renderItem = ({ item }) => (
        <View>
            {!this.userIsInNodeOrHasUserRequest(item) ? (
                <View style={styles.nodeItem}>
                    <View style={{ width: "100%" }}>
                        <View style={styles.infoTextContainer}>
                            <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 17, color: "white", }}>{item.nombreDelNodo}</Text>
                        </View>
                        {this.hasDescription(item.descripcion) ? (
                            <View style={{ backgroundColor: "#ebedeb" }}>
                                <View style={{ alingItems: "center", flexDirection: "row", margin: 5, marginStart: 10, marginEnd: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: "bold", color: '#00adee' }}>{item.descripcion}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: "grey" }}></View>
                            </View>
                        ) : (null)}
                        <View style={{ margin: 10, }}>
                            <View style={{ alingItems: "center", flexDirection: "row" }}>
                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Dirección: </Text>{this.parseAdress(item.direccionDelNodo)}</Text>
                            </View>
                            <View style={{ alingItems: "center", flexDirection: "row" }}>
                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Zona: </Text>{this.defineZone(item.zona)}</Text>
                            </View>
                            <View style={{ alingItems: "center", flexDirection: "row" }}>
                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Contacto: </Text>{item.emailAdministrador}</Text>
                            </View>
                        </View>
                        <View>
                            <Button
                                icon={
                                    <View style={{ marginRight: 5 }}>
                                        <Icon name="done" size={24} color="white" type='material' />
                                    </View>
                                }
                                onPress={() => this.askSendUserRequest(item)}
                                title="Enviar Solicitud" titleStyle={{ color: 'white', }} buttonStyle={styles.subMenuButtonOkStyle} raised={false} type="solid"></Button>
                        </View>
                    </View>
                </View>
            ) : (null)}
        </View>
    )

    requestsPending() {
        let value = 0
        this.props.accessOpenNodeRequests.map((request) => {
            if (request.estado === "solicitud_pertenencia_nodo_enviado") {
                value = value + 1
            }
        })
        return value
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header containerStyle={styles.topHeader}>
                    <Button
                        icon={
                            <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.leftHeaderButton}
                        onPress={() => this.props.navigation.popToTop()}
                    />
                    <Image
                        style={{ width: 40, height: 45 }}
                        source={require('../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                    />
                    {this.props.user.id !== 0 ? (
                        <View>
                            {this.state.showOpenNodes ? (
                                <View>
                                    <Button
                                        icon={
                                            <Icon name="file-move" size={22} color="white" type='material-community' />
                                        }
                                        buttonStyle={styles.leftHeaderButton}
                                        onPress={() => this.setState({ showOpenNodes: !this.state.showOpenNodes })}
                                    />
                                    {this.requestsPending() > 0 ? (
                                        <Badge value={this.requestsPending()} status="error" containerStyle={{ position: 'absolute', top: -6, right: -6 }} />
                                    ) : (null)}
                                </View>
                            ) : (
                                    <View>
                                        <TouchableOpacity
                                            style={styles.rightNodesHeaderButton}
                                            onPress={() => this.setState({ showOpenNodes: !this.state.showOpenNodes })}
                                        >
                                            <Image style={styles.badgeImage} source={require('../components/vendorsViewComponents/badge_icons/compra_nodos.png')} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                        </View>
                    ) : (null)}
                </Header>
                {this.state.showOpenNodes ? (
                    <View style={{ flex: 1 }}>
                        {
                            this.state.loading ? (<LoadingView></LoadingView>) : (
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        ListHeaderComponent={
                                            <View style={styles.titleContainer}>
                                                <Text style={styles.title}>Nodos abiertos</Text>
                                            </View>}
                                        keyExtractor={this.keyExtractor}
                                        data={this.props.openNodesData}
                                        renderItem={(item) => this.renderItem(item)}
                                    />
                                </View>)
                        }
                    </View>
                ) : (
                        <View style={{ flex: 1 }}>
                            {this.requestsPending() === 0 ? (
                                <View style={{ position: "absolute", zIndex: 1, width: Dimensions.get("window").width }}>
                                    <View style={styles.viewErrorContainer}>

                                        <View style={styles.searchIconErrorContainer}>
                                            <Icon name="file-move" type='material-community' size={48} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                        </View>
                                        <Text style={styles.errorText}>
                                            No posee ninguna solicitud en gestión
                                        </Text>
                                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                            <Text style={styles.tipErrorText}>
                                                Aqui vera las solicitudes enviadas
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                    <View style={{ flex: 1 }}>
                                        {
                                            this.state.loading ? (<LoadingView></LoadingView>) : (
                                                <View style={{ flex: 1 }}>
                                                    <FlatList
                                                        ListHeaderComponent={
                                                            <View style={styles.titleContainer}>
                                                                <Text style={styles.title}>Solicitudes enviadas</Text>
                                                            </View>}
                                                        keyExtractor={this.keyExtractor}
                                                        data={this.props.accessOpenNodeRequests}
                                                        renderItem={(item) => this.renderRequest(item)}
                                                    />
                                                </View>)
                                        }
                                    </View>
                                )}
                        </View>
                    )}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        marginTop: 150
    },

    errorText: {
        marginTop: 25,
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    tipErrorText: {
        marginTop: 25,
        fontSize: 12,
        alignSelf: 'center',
    },

    searchIconErrorContainer: {
        backgroundColor: "#00adee",
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },
    badgeImage: { height: "100%", width: "100%" },
    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        marginTop: 150
    },

    errorText: {
        marginTop: 25,
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    tipErrorText: {
        marginTop: 25,
        fontSize: 12,
        alignSelf: 'center',
    },

    searchIconErrorContainer: {
        backgroundColor: "#00adee",
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },
    subMenuButtonCancelStyle: {
        backgroundColor: "red",
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 0,
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    subMenuButtonOkStyle: {
        backgroundColor: "#5ebb47",
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 0,
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    itemDataInfoStyle: { fontSize: 16, fontWeight: "bold", fontStyle: "italic", color: "grey" },
    itemDataStyle: { color: "black", fontStyle: "normal" },
    infoTextContainer: {
        backgroundColor: "#00adee",
        width: "100%",
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 1
    },
    title: {
        backgroundColor: "white",
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
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
    nodeItem: {
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        margin: 4,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    topHeader: {
        backgroundColor: '#909090',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        borderBottomWidth: 0,
    },

    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 0,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },

    rightNodesHeaderButton: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginRight: 0,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },

    rightHeaderButtonOnWarn: {
        marginTop: 10,
        backgroundColor: '#66000000',
        marginRight: 0,
        borderColor: '#00adee',
        borderWidth: 1,
        width: 40,
        height: 40
    },

    leftHeaderButton: {
        backgroundColor: '#66000000',
        marginLeft: 0,
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

})
export default OpenNodesView
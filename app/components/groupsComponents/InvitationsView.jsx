import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge } from 'react-native-elements'
import axios from 'axios'
import GLOBALS from '../../Globals'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import LoadingView from '../../components/LoadingView'

class InvitationsView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            loading: false,
            invitations: [],
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
                            { text: 'Entendido', onPress: () => null },
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

    resetInvitations() {
        this.setState({ loading: true })
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/noLeidas', { withCredentials: true }).then(res => {
            this.filterInvitations(res.data);
            this.setState({ loading: false })
        }).catch((error) => {
            this.setState({ loading: false })
            this.errorAlert(error)
        });
    }

    defineAcceptRoute() {
        if (this.props.vendorSelected.few.gcc) {
            return 'rest/user/gcc/aceptar'
        } else {
            return 'rest/user/nodo/aceptarInvitacion'
        }
    }
    sendAccept(id) {
        this.setState({ loading: true })
        axios.post(this.serverBaseRoute + this.defineAcceptRoute(), {
            idInvitacion: id,
        }, { withCredentials: true }).then(res => {
            this.resetInvitations()
            this.getGroups()
            Alert.alert(
                'Aviso',
                "Invitación aceptada!",
                [
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
        }).catch((error) => {
            console.log(error.response);
            Alert.alert(
                'Error',
                "Ocurrio un error, es probable que la invitación haya sido cancelada por el remitente",
                [
                    { text: 'Entendido', onPress: () => this.resetInvitations() },
                ],
                { cancelable: false },
            );
        });
    }

    acceptInvitation(notification) {
        Alert.alert(
            'Aviso',
            "¿Esta seguro de aceptar la invitación?",
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.sendAccept(notification.id) },
            ],
            { cancelable: false },
        );
    }

    declineInvitation(notification) {
        Alert.alert(
            'Aviso',
            "¿Esta seguro de rechazar la invitación?",
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.sendDeclined(notification.id) },
            ],
            { cancelable: false },
        );
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

    getGroups() {
        axios.get((this.serverBaseRoute + this.defineStrategyRoute() + 'all/' + this.props.vendorSelected.id), {}, { withCredentials: true }).then(res => {
            this.props.actions.groupsData(res.data);
        }).catch((error) => {
            console.log(error);
            this.setState({ loading: false })
            this.errorAlert(error)
        });
    }

    defineDeclineInvitationRoute() {
        if (this.props.vendorSelected.few.gcc) {
            return 'rest/user/gcc/rechazar';
        } else {
            return 'rest/user/nodo/rechazarInvitacion';
        }
    }

    sendDeclined(id) {
        this.setState({ loading: true })
        axios.post(this.serverBaseRoute + this.defineDeclineInvitationRoute(), {
            idInvitacion: id,
        }, { withCredentials: true }).then(res => {
            this.resetInvitations()
            Alert.alert(
                'Aviso',
                "Invitación rechazada",
                [
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
        }).catch((error) => {
            console.log(error.response);
            Alert.alert(
                'Error',
                "Ocurrio un error, es probable que la invitación haya sido cancelada por el remitente",
                [
                    { text: 'Entendido', onPress: () => this.this.resetInvitations() },
                ],
                { cancelable: false },
            );
        });
    }

    filterInvitations(notificacions) {
        let vinvitations = []
        notificacions.map((notification) => {
            let message = notification.mensaje
            if (this.isInvitation(message) && this.isInvitationOf(this.props.vendorSelected.nombre, message)) {
                vinvitations.push(notification)
            }
        })
        this.props.actions.invitationsData(vinvitations)
    }

    isInvitationOf(name, message) {
        return message.includes(name);
    }
    isInvitation(message) {
        return message.includes('invitado al grupo de compras') || message.includes('invitado al nodo de compras');
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.markViewedNotification(item.id, "Leido")} disabled={this.isInvitation(item.mensaje)} style={styles.notificationItem}>
            <View style={{ flex: 4, marginLeft: 20 }}>
                <View style={{ alingItems: "center", flexDirection: "row" }}>
                    <Text style={{ fontSize: 11 }}>De:</Text>
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: "blue" }}> {item.usuarioOrigen}</Text>
                </View>
                <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 5 }}>
                    <Icon
                        size={12}
                        name='table'
                        type='font-awesome'
                        color='grey'
                    />
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: "blue" }}> {item.fechaCreacion}</Text>
                </View>
                <Text style={{ fontSize: 13 }}>{item.mensaje}</Text>
                <View style={{}}>
                    {item.estado === "NOTIFICACION_NO_LEIDA" ? (
                        <View style={{ marginTop: 5, flexDirection: "row", justifyContent: "space-evenly" }}>
                            <Button title="Rechazar"
                                buttonStyle={{ backgroundColor: "transparent", borderColor: "black", borderWidth: 2, borderRadius: 8 }}
                                titleStyle={{ color: "red" }}
                                icon={
                                    <Icon
                                        containerStyle={{ marginEnd: 5 }}
                                        size={20}
                                        name='user-times'
                                        type='font-awesome'
                                        color='red'
                                    />
                                }
                                onPress={() => this.declineInvitation(item)}
                            ></Button>
                            <Button title="Aceptar"
                                buttonStyle={{ backgroundColor: "transparent", borderColor: "black", borderWidth: 2, borderRadius: 8 }}
                                titleStyle={{ color: "green" }}
                                icon={<Icon
                                    containerStyle={{ marginEnd: 5 }}
                                    size={20}
                                    name='user-plus'
                                    type='font-awesome'
                                    color='green'
                                />}
                                onPress={() => this.acceptInvitation(item)}
                            ></Button>
                        </View>) : (null)}
                </View>
            </View>
            <View style={{ marginRight: 20, marginLeft: 10 }}>
                {item.estado === "NOTIFICACION_NO_LEIDA" ? (
                    <Icon
                        size={30}
                        name='user-plus'
                        type='font-awesome'
                        color='black'
                    />) : (
                        <View>
                            {item.estado === "NOTIFICACION_RECHAZADA" ? (
                                <Icon
                                    size={30}
                                    name='user-times'
                                    type='font-awesome'
                                    color='red'
                                />) : (<Icon
                                    size={30}
                                    name='user-plus'
                                    type='font-awesome'
                                    color='green'
                                />)}
                        </View>
                    )}
            </View>

        </TouchableOpacity>
    )

    render() {
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
                    <Button
                        icon={
                            <Icon name="history" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.leftHeaderButton}
                        onPress={() => this.resetInvitations()}
                        loading={this.state.loading}
                    />
                </Header>
                {this.state.loading ? (<LoadingView></LoadingView>) : (<View style={{ flex: 1 }}>
                    {this.props.invitationsData.length === 0 && !this.state.loading ? (
                        <View style={styles.viewErrorContainer}>
                            <View style={styles.searchIconErrorContainer}>
                                <Icon name="envelope" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                            </View>
                            <Text style={styles.errorText}>
                                No posee invitaciones
                        </Text>
                            <Text style={styles.tipErrorText}>
                                No posee invitaciones hasta el momento para este catálogo
                        </Text>
                        </View>) : (
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    ListHeaderComponent={
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.adressTitle}>Invitaciones</Text>
                                        </View>}
                                    keyExtractor={this.keyExtractor}
                                    data={this.props.invitationsData}
                                    renderItem={(item) => this.renderItem(item)}
                                />
                            </View>)}
                </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        marginTop: -25,
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

    notificationItem: {
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        margin: 4,
        borderRadius: 5,
        height: 170,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

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
        alignSelf: 'center'
    },

    searchIconErrorContainer: {
        backgroundColor: "rgba(51, 102, 255, 1)",
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },

    buttonMore: {
        backgroundColor: "#5ebb47",
        borderColor: 'grey',
        borderWidth: 1
    }
})

export default InvitationsView
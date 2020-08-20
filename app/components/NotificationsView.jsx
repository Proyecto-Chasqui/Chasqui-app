import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge } from 'react-native-elements'
import axios from 'axios'
import GLOBALS from '../Globals'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import LoadingView from '../components/LoadingView'
import LoadingOverlayView from '../components/generalComponents/LoadingOverlayView'
class NotificationsView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            loading: false,
            firstLoading: false,
            notifications: [],
            page: 1,
            totalNotifications: 1,
            unreadNotifications: this.props.unreadNotifications.length,
            markingAll: false,
            hasMarkedAll: true,
        }
        this.unreadNotificationsUnmarked = 0
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
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
        } else {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde.");
        }
    }

    componentDidUpdate() {
        if (this.props.hasReceivedPushNotifications) {
            this.restartNotifications()
            this.getUnreadNotifications()
            this.props.actions.hasReceivedPushNotifications(false)
        }
        if(!this.state.hasMarkedAll){
            this.fullRestart()
            this.setState({hasMarkedAll:true})
        }   
    }

    componentDidMount() {
        this.setState({ firstLoading: true })
        this.getNotifications(this.state.page)
        this.getTotalNotifications()
    }
    typeInvitation(message) {
        if(message.includes('invitado al grupo de compras')){
            return "grupo"
        }
        if(message.includes('invitado al nodo de compras')){
            return "nodo"
        }
        return "sin definir"
    }

    acceptInvitation(notification) {
        Alert.alert(
            'Aviso',
            "¿Esta seguro de aceptar la invitación?",
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.sendAccept(notification.id, this.typeInvitation(notification.mensaje)) },
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
                { text: 'Si', onPress: () => this.sendDeclined(notification.id, this.typeInvitation(notification.mensaje)) },
            ],
            { cancelable: false },
        );
    }

    restartNotifications() {
        this.setState({ notifications: [], page: 1, firstLoading: true });
        this.getFirstNotifications()
        this.getTotalNotifications()
    }

    defineAcceptRoute(type) {
        if (type === "grupo") {
            return 'rest/user/gcc/aceptar'
        } 
        if(type === "nodo"){
            return 'rest/user/nodo/aceptarInvitacion'
        }
        return ''
    }
 
    sendAccept(id, type) {
        axios.post(this.serverBaseRoute + this.defineAcceptRoute(type), {
            idInvitacion: id,
        }, { withCredentials: true }).then(res => {
            this.markNotification(id, "NOTIFICACION_ACEPTADA");
            this.getUnreadNotifications();
            Alert.alert(
                'Aviso',
                "Invitación aceptada!",
                [
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
        }).catch((error) => {
            console.log("error en send accept",error.response);
            Alert.alert(
                'Error',
                "Ocurrio un error, es probable que la invitación haya sido cancelada por el remitente",
                [
                    { text: 'Entendido', onPress: () => this.restartNotifications() },
                ],
                { cancelable: false },
            );
        });
    }

    defineDeclinedRoute(type) {
        if (type === "grupo") {
            return 'rest/user/gcc/rechazar'
        } 
        if(type === "nodo"){
            return 'rest/user/nodo/rechazarInvitacion'
        }
        return ''
    }
  
    sendDeclined(id, type) {
        axios.post(this.serverBaseRoute + this.defineDeclinedRoute(type), {
            idInvitacion: id,
        }, { withCredentials: true }).then(res => {
            this.markNotification(id, "NOTIFICACION_RECHAZADA");
            this.getUnreadNotifications();
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
                    { text: 'Entendido', onPress: () => this.restartNotifications() },
                ],
                { cancelable: false },
            );
        });
    }

    getUnreadNotifications() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/noLeidas', { withCredentials: true }).then(res => {
            this.props.actions.unreadNotifications(res.data);
            this.setState({ unreadNotifications: res.data.length, markingAll: false })
        }).catch((error) => {
            this.errorAlert(error)
        });
    }

    getTotalNotifications() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/total', { withCredentials: true })
            .then(res => {
                this.setState({ totalNotifications: res.data })
            }).catch((error) => {
                this.setState({ loading: false })
                this.errorAlert(error)
            });
    }

    getFirstNotifications() {
        this.setState({ loading: true })
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/' + 1, { withCredentials: true })
            .then(res => {
                this.setState({ notifications: res.data, loading: false, firstLoading: false });
            }).catch((error) => {
                this.setState({ loading: false, firstLoading: false })
                this.errorAlert(error)
            });
    }

    getNotifications(page) {
        this.setState({ loading: true })
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/' + page, { withCredentials: true })
            .then(res => {
                this.setState({ notifications: this.state.notifications.concat(res.data), loading: false, firstLoading: false });
            }).catch((error) => {
                this.setState({ loading: false, firstLoading: false })
                this.errorAlert(error);
            });
    }

    markNotification(id, value) {
        let array = [];
        let notificationsCopy = this.state.notifications
        notificationsCopy.map((notification, i) => {
            if (notification.id === id) {
                notification.estado = value
            }
            array.push(notification)
        })
        this.setState({
            notificacions: array
        })
        this.setState({ loading: false })
    }



    alertMarkAllNotificiations() {
        if (this.props.unreadNotifications.length > 0) {
            Alert.alert(
                'Pregunta',
                '¿Desea marcar todas las notificaciones como leidas? (las invitaciones no se verán afectadas)',
                [
                    { text: 'No', onPress: () => null },
                    { text: 'Si', onPress: () => this.executeMarkAll() },
                ],
                { cancelable: false },
            );
        } else {
            Alert.alert(
                'Aviso',
                'No posee noficaciones sin leer',
                [
                    { text: 'Entendido', onPress: null },
                ],
                { cancelable: false },
            );
        }
    }

    async alertLongTime() {
        Alert.alert(
            'Pregunta',
            'Tiene demasiadas notificaciones el proceso demorara un tiempo. ¿Desea marcarlas de todas formas?',
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.markAllNotifications() },
            ],
            { cancelable: false },
        );
    }

    fullRestart() {
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.getUnreadNotifications()
            this.restartNotifications()
        }, 2000);
    }

    async executeMarkAll() {
        if (this.props.unreadNotifications.length < 25) {
            this.markAllNotifications()
        } else {
            this.alertLongTime()
        }
    }

    createListUnreadNotifications(){
        this.unreadNotificationsMarked = []
        this.props.unreadNotifications.map((notification, i) => {
            this.unreadNotificationsMarked.push(i);
        })
    }

    decrementUnreadNotifications(){
        this.unreadNotificationsUnmarked = this.unreadNotificationsUnmarked - 1;
        if(this.unreadNotificationsUnmarked <= 0){
            this.setState({hasMarkedAll:true})
        }
    }

    async markAllNotifications() {
        this.setState({ firstLoading: true, markingAll: true, hasMarkedAll:false })
        this.unreadNotificationsUnmarked = this.props.unreadNotifications.length;
        return Promise.all(
            this.props.unreadNotifications.map((notification, i) => {
                if (!this.isInvitation(notification.mensaje)) {
                    this.asyncMarkViewedNotification(notification.id, "Leido");
                }
            })
        )
    }

    async asyncMarkViewedNotification(id, value) {
        this.setState({ loading: true })
        axios.post(this.serverBaseRoute + 'rest/user/adm/notificacion/' + id, {}, { withCredentials: true })
            .then(res => {
                this.decrementUnreadNotifications()
            }).catch((error) => {
                this.decrementUnreadNotifications()
                console.log(error);
            });
    }

    markViewedNotification(id, value) {
        this.setState({ loading: true })
        axios.post(this.serverBaseRoute + 'rest/user/adm/notificacion/' + id, {}, { withCredentials: true })
            .then(res => {
                this.markNotification(id, value)
                this.getUnreadNotifications();
            }).catch((error) => {
                this.setState({ loading: false })
                this.errorAlert(error)
            });
    }

    isInvitation(message) {
        return message.includes('invitado al grupo de compras') || message.includes('invitado al nodo de compras');
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.markViewedNotification(item.id, "Leido")} disabled={this.isInvitation(item.mensaje)} style={styles.notificationItem}>
            <View style={{ flex: 4, margin: 10 }}>
                <View style={{ alingItems: "center", flexDirection: "row" }}>
                    <Text style={{ fontSize: 11 }}>De:</Text>
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: "#00adee" }}> {item.usuarioOrigen}</Text>
                </View>
                <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 5 }}>
                    <Icon
                        size={12}
                        name='table'
                        type='font-awesome'
                        color='grey'
                    />
                    <Text style={{ fontSize: 11, fontWeight: "bold", color: "#00adee" }}> {item.fechaCreacion}</Text>
                </View>
                <Text style={{ fontSize: 13 }}>{item.mensaje}</Text>
                {this.isInvitation(item.mensaje) ? (
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
                ) : (null)}
            </View>
            {this.isInvitation(item.mensaje) ? (
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
            ) : (
                    <View style={{ marginRight: 20, marginLeft: 10 }}>
                        {item.estado === "NOTIFICACION_NO_LEIDA" ? (
                            <Icon
                                size={30}
                                name='envelope'
                                type='font-awesome'
                                color='black'
                            />) : (
                                <Icon
                                    size={30}
                                    name='envelope-open'
                                    type='font-awesome'
                                    color='green'
                                />
                            )}
                    </View>

                )}

        </TouchableOpacity>
    )

    addNotification() {
        this.setState({ loading: true })
        if (!this.state.loading) {
            this.getNotifications(this.state.page + 1)
            this.setState({ page: this.state.page + 1 })
        }
    }

    render() {
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
                            style={{ width: 40, height: 45 }}
                            source={require('../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                        />
                        <View>
                            <Button
                                icon={
                                    <Icon name="bell" size={20} color="white" type='font-awesome' />
                                }
                                buttonStyle={styles.rightHeaderButton}
                                loading={this.state.loading}
                                disabled={this.state.loading}
                                onPress={() => this.alertMarkAllNotificiations()}
                            />
                            {this.props.unreadNotifications.length > 0 ? (
                                <Badge value={this.props.unreadNotifications.length} status="error" containerStyle={{ position: 'absolute', top: -6, right: -6 }} />
                            ) : (null)}
                        </View>
                    </Header>
                </View>
                <LoadingOverlayView isVisible={this.state.markingAll} loadingText="Comunicandose con el servidor..." ></LoadingOverlayView>
                {this.state.firstLoading ? (<LoadingView></LoadingView>) : (
                    <View style={{ flex: 1 }}>
                        {this.state.notifications.length === 0 && !this.state.loading ? (
                            <View style={styles.viewErrorContainer}>
                                <View style={styles.searchIconErrorContainer}>
                                    <Icon name="bell" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                </View>
                                <Text style={styles.errorText}>
                                    No hay notificaciones
                            </Text>
                                <Text style={styles.tipErrorText}>
                                    No posee notificaciones hasta el momento
                            </Text>
                            </View>) : (
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        ListHeaderComponent={
                                            <View style={styles.titleContainer}>
                                                <Text style={styles.adressTitle}>Notificaciones</Text>
                                            </View>}
                                        keyExtractor={this.keyExtractor}
                                        data={this.state.notifications}
                                        renderItem={(item) => this.renderItem(item)}
                                        ListFooterComponent={
                                            <Button titleStyle={{ fontSize: 20, color: 'white' }} buttonStyle={styles.buttonMore} loading={this.state.loading} containerStyle={{ margin: 5 }} onPress={() => this.addNotification()} disabled={this.state.notifications.length >= this.state.totalNotifications} title={"Ver mas notificaciones"}></Button>
                                        }
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

    buttonMore: {
        backgroundColor: "#5ebb47",
        borderColor: 'grey',
        borderWidth: 1
    }
})

export default NotificationsView
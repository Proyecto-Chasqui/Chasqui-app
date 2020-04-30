import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge } from 'react-native-elements'
import axios from 'axios'
import GLOBALS from '../Globals'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import LoadingView from '../components/LoadingView'

class NotificationsView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            loading: false,
            firstLoading:false,
            notifications: [],
            page: 1,
            totalNotifications: 1,
        }
    }

    componentDidMount() {
        this.setState({ firstLoading: true })
        this.getNotifications(this.state.page)
        this.getTotalNotifications()
    }

    getUnreadNotifications() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/noLeidas',{withCredentials: true}).then(res => {
            this.props.actions.unreadNotifications(res.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    getTotalNotifications() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/total',{withCredentials: true})
            .then(res => {
                this.setState({ totalNotifications: res.data })
            }).catch((error) => {
                this.setState({ loading: false })
                Alert.alert('Error', 'No se logro obtener sus notificaciones, intente mas tarde.');
            });
    }

    getNotifications(page) {
        this.setState({ loading: true })
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/' + page,{withCredentials: true})
            .then(res => {
                this.setState({ notifications: this.state.notifications.concat(res.data), loading: false, firstLoading:false });
            }).catch((error) => {
                this.setState({ loading: false, firstLoading:false })
                Alert.alert('Error', 'No se logro obtener sus notificaciones, intente mas tarde.');
            });
    }

    markNotification(id) {
        let array = [];
        let notificationsCopy = this.state.notifications
        notificationsCopy.map((notification, i) => {
            if (notification.id === id) {
                notification.estado = "Leído"
            }
            array.push(notification)
        })
        this.setState({
            notificacions: array
        })
        this.setState({ loading: false })
    }

    markViewedNotification(id) {
        this.setState({ loading: true })
        axios.post(this.serverBaseRoute + 'rest/user/adm/notificacion/' + id,{},{withCredentials: true})
            .then(res => {
                this.markNotification(id)
                this.getUnreadNotifications();
            }).catch((error) => {
                this.setState({ loading: false })
                Alert.alert('Error', 'No se logro marcar la notificación como leída, intente mas tarde.');
            });
    }

    isInvitation(message) {
        return message.includes('invitado al grupo de compras');
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => this.markViewedNotification(item.id)} disabled={this.isInvitation(item.mensaje)} style={styles.notificationItem}>
            <View style={{ flex: 4, marginLeft:20 }}>
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
                                />):(<Icon
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
        this.setState({loading:true})
        if(!this.state.loading){
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
                            style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                            source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                        />
                        <View>
                        <Button
                            icon={
                                <Icon name="bell" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.rightHeaderButton}
                        />
                        {this.props.unreadNotifications.length > 0 ? (
                            <Badge value={this.props.unreadNotifications.length} status="error" containerStyle={{ position: 'absolute', top: -6, right: -6 }}/>
                            ):(null)}
                        </View>
                    </Header>
                </View>
                {this.state.firstLoading ? (<LoadingView></LoadingView>):(<View style={{flex:1}}>
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
        backgroundColor: 'rgba(51, 102, 255, 1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        borderBottomWidth:0,
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
        height: Dimensions.get("window").height / 5.5,
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

export default NotificationsView
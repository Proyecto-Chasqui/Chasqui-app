import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge } from 'react-native-elements'
import GLOBALS from '../../Globals'
import GroupControlsOverlayView from '../../containers/GroupsComponentsContainers/GroupControlsOverlay'
import EditGroupView from '../../containers/GroupsComponentsContainers/EditGroup'
import axios from 'axios'

class DetailGroupView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            showControls: false,
            showEditGroup: false,
        }
    }

    componentDidUpdate(){
        if(this.props.hasReceivedPushNotifications){
            if (this.props.vendorSelected.few.nodos && (this.props.groupSelected.emailAdministrador === this.props.user.email)) {
                this.getRequests()
            }
        }
    }

    componentDidMount() {
        if (this.props.vendorSelected.few.nodos && (this.props.groupSelected.emailAdministrador === this.props.user.email)) {
            this.getRequests()
        }
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    createImageUrl(urlavatar) {
        let url = this.serverBaseRoute + (urlavatar)
        url += '?random_number=' + new Date().getTime();
        return url
    }

    keyExtractor = (item, index) => index.toString()

    goToMember(member) {
        this.props.actions.memberSelected(member);
        this.props.navigation.navigate("Miembro");
    }

    showControls() {
        this.setState({ showControls: !this.state.showControls })
    }

    showEditGroupFromControl() {
        this.showControls()
        this.setState({ showEditGroup: !this.state.showEditGroup })
    }

    filterConfirmed(members) {
        let confirmedMemebers = []
        members.map((member) => {
            if (member.pedido !== null) {
                if (member.pedido.estado === "CONFIRMADO") {
                    confirmedMemebers.push(member)
                }
            }
        })
        return confirmedMemebers
    }

    obtainMembers() {
        if (this.props.onlyConfirmed) {
            return this.filterConfirmed(this.props.groupSelected.miembros)
        } else {
            return this.props.groupSelected.miembros
        }
    }

    errorAlert(error){
        if (error.response) {
            if(error.response.status === 401){
                Alert.alert(
                    'Sesion expirada',
                    'Su sesión expiro, se va a reiniciar la aplicación.',
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

    getRequests() {
        axios.get(this.serverBaseRoute + 'rest/user/nodo/obtenerSolicitudesDePertenenciaANodo/' + this.props.groupSelected.id).then(res => {
            this.props.actions.selectedNodeRequests(res.data)
        }).catch((error) => {
            this.errorAlert(error)
        });
    }


    showEditGroup() {
        this.setState({ showEditGroup: !this.state.showEditGroup })
    }
    isAdministrator(member) {
        return this.props.groupSelected.emailAdministrador === member.email
    }

    isUser(member) {
        if (member.email === this.props.user.email) {
            return (
                {
                    backgroundColor: "white",
                    alignItems: "center",
                    flex: 1,
                    borderWidth: 2,
                    margin: 4,
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    borderColor: '#00adee',
                    elevation: 5,
                }
            )
        } else {
            return (
                {
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
                }
            )
        }
    }

    amountOfNotManageRequests(){
        let count = 0
        if(this.props.vendorSelected.few.nodos){
            this.props.selectedNodeRequests.map((request)=>{
                if(this.props.groupSelected.id === request.nodo.idNodo){
                    if(request.estado === 'solicitud_pertenencia_nodo_enviado'){
                        count = count + 1
                    }
                }
            })
        }
        return count
    }

    definePrice(item){
        if(this.props.vendorSelected.few.nodos && this.props.vendorSelected.few.usaIncentivos){
            return item.pedido.montoActual + item.pedido.incentivoActual
        }else{
            return item.pedido.montoActual
        }
    }

    renderItem = ({ item }) => (
        <View>
            {item.invitacion !== "NOTIFICACION_NO_LEIDA" ? (
                <TouchableOpacity disabled={this.props.disabledPress} onPress={() => (this.goToMember(item))} style={this.isUser(item)}>
                    <View style={{ margin: 2, marginStart: 10, flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
                        <Image
                            style={{ width: 50, height: 50, resizeMode: 'center', }}
                            source={{ uri: (this.normalizeText(this.createImageUrl(item.avatar))) }}
                        />
                        {this.isAdministrator(item) ? (
                            <View style={{ position: "absolute", alignSelf: "flex-start", marginStart: -4, marginTop: 1, borderWidth: 1, borderRadius: 10, backgroundColor: "#5ebb47" }}>
                                <Icon containerStyle={{ margin: 1 }} name="star" size={15} color='#00adee' type='font-awesome' />
                            </View>
                        ) : (null)}
                        <View style={{ marginStart: 10, flex:10}}>
                            <Text style={{ fontSize: 15, fontWeight: "bold", fontStyle: "italic", }}>{item.nickname}</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>{item.email}</Text>
                            <View >
                                {item.pedido != null ? (
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Pedido: {item.pedido.estado}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>Total: ${this.definePrice(item)}</Text>
                                    </View>)
                                    : (<Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Sin pedido</Text>)
                                }
                            </View>
                        </View>
                        {!this.props.disabledPress ? (
                            <View style={{ flex: 1, alignItems: "flex-end", marginEnd: 5 }}>
                                <Icon
                                    name='chevron-right'
                                    type='font-awesome'
                                    color='#00adee'
                                />
                            </View>
                        ) : (null)}
                    </View>
                </TouchableOpacity>) : (null)}</View>
                
    )

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.props.hideHeaders ? (null) : (
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
                                source={ require('../../components/catalogViewComponents/catalogAssets/platform-icon.png') }
                            />
                            <View>
                                <Button
                                    icon={
                                        <Icon name="cogs" size={20} color="white" type='font-awesome' />
                                    }
                                    buttonStyle={styles.rightHeaderButton}
                                    onPress={() => this.showControls()}
                                />
                                {this.amountOfNotManageRequests() > 0 ? (
                                    <Badge value={this.amountOfNotManageRequests()} status="error" containerStyle={{ position: 'absolute', top: -6, right: -6 }} />
                                ) : (null)}
                            </View>

                        </Header>
                        <GroupControlsOverlayView navigation={this.props.navigation} showEditGroup={() => this.showEditGroupFromControl()} showControls={() => this.showControls()} isVisible={this.state.showControls}></GroupControlsOverlayView>
                        <EditGroupView navigation={this.props.navigation} showEditGroup={() => this.showEditGroup()} isVisible={this.state.showEditGroup}></EditGroupView>
                    </View>
                )}
                <View style={{ flex: 1 }}>
                    <FlatList
                        ListHeaderComponent={
                            <View>
                                {this.props.hideHeaders ? (null) : (
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.adressTitle}>{this.props.groupSelected.alias}</Text>
                                    </View>)}
                            </View>
                        }
                        keyExtractor={this.keyExtractor}
                        data={this.obtainMembers()}
                        renderItem={(item) => this.renderItem(item)}
                    />
                </View>

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
        marginEnd:5,
        marginStart:5
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
    },
    groupItem: {
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


    subMenuButtonContainer: {
    },

    subMenuButtonOkStyle: {
        backgroundColor: "#5ebb47",
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 1,
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
})

export default DetailGroupView
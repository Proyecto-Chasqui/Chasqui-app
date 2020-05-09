import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge } from 'react-native-elements'
import GLOBALS from '../Globals'
import { TouchableOpacity } from 'react-native-gesture-handler';
import GroupsControlsOverlayView from '../containers/GroupsComponentsContainers/GroupsControlsOverlay'

class GroupsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            showControls: false,
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

    getAdminAvatar(members, adminEmail) {
        let admin = null
        members.map((member, i) => {
            if (member.email === adminEmail) {
                admin = member
            }
        })
        console.log(this.normalizeText(this.createImageUrl(admin.avatar)))
        return this.normalizeText(this.createImageUrl(admin.avatar))
    }

    calcularPedidosConfirmados(miembros) {
        let count = 0
        miembros.map((miembro) => {
            if (miembro.pedido != null) {
                if (miembro.pedido.estado === "CONFIRMADO") {
                    count = count + 1
                }
            }
        })
        return count
    }

    calculateAmount(miembros) {
        let count = 0
        miembros.map((miembro) => {
            if (miembro.pedido != null) {
                if (miembro.pedido.estado === "CONFIRMADO") {
                    count = count + miembro.pedido.montoActual
                }
            }
        })
        return count
    }

    goToMembers(group) {
        this.props.actions.groupSelected(group);
        this.props.navigation.navigate("Grupo");
    }

    keyExtractor = (item, index) => index.toString()

    showControls() {
        this.setState({ showControls: !this.state.showControls })
    }

    renderItem = ({ item }) => (
        <View style={styles.groupItem}>
            <View style={{ backgroundColor: "rgba(51, 102, 255, 1)", flexDirection: "row", alignItems: "center", justifyContent: "center", borderTopStartRadius: 3, borderTopEndRadius: 3, flex: 1, width: "100%" }}>
                <Text style={{ textAlign: "center", fontSize: 18, margin: 2, fontWeight: "bold", color: "white" }}> {item.alias} </Text>
            </View>
            <View style={{ flex: 3, width: "100%" }}>
                <TouchableOpacity onPress={() => (this.goToMembers(item))}>
                    <View style={{ borderBottomWidth: 2 }}></View>
                    <Text style={{ backgroundColor: "#ebedeb", fontSize: 15, textAlign: "center", fontWeight: "bold" }}> {item.descripcion}</Text>
                    <View style={{ borderBottomWidth: 1 }}></View>
                    <View style={{ justifyContent: "center", backgroundColor: "#ebedeb", borderBottomWidth: 1, borderColor: "black", flexDirection: "row", alignItems: "center" }}>
                        <View style={{ margin: 3, flexDirection: "row", alignItems: "center" }}>
                            <Icon
                                name='user'
                                type='font-awesome'
                                color='blue'
                                size={22}
                            />
                            <Text style={{ fontWeight: "bold", fontSize: 15 }}> {item.emailAdministrador}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", margin: 5, flexWrap: "wrap" }}>
                        <View style={{ backgroundColor: "#ebedeb", marginBottom: 3, borderWidth: 1, borderColor: "black", borderRadius: 5, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ margin: 3, flexDirection: "row", alignItems: "center" }}>
                                <Image style={{ height: 25, width: 25 }} source={require('../components/vendorsViewComponents/badge_icons/compra_grupal.png')} />
                                <Text style={{ fontWeight: "bold", marginRight: 2 }}> {item.miembros.length}</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: "#ebedeb", marginBottom: 3, borderWidth: 1, borderColor: "black", borderRadius: 5, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ margin: 3, flexDirection: "row", alignItems: "center" }}>
                                <Icon
                                    name='shopping-cart'
                                    type='font-awesome'
                                    color='black'
                                    size={20}
                                />
                                <Text style={{ fontSize: 16, fontWeight: "bold" }}> Confirmados: {this.calcularPedidosConfirmados(item.miembros)} / {item.miembros.length}</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: "#ebedeb", marginBottom: 3, flexDirection: "row", justifyContent: "center", alignItems: "center", borderColor: "black", borderWidth: 1, borderRadius: 5 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}> Min. Monto: </Text>
                            <View style={{ flexDirection: "row", margin: 3 }}>
                                <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}>${this.props.vendorSelected.montoMinimo}</Text>
                                <View style={{ marginLeft: 5, marginRight: 5 }}>
                                    {this.calculateAmount(item.miembros) >= this.props.vendorSelected.montoMinimo ? (
                                        <Icon name="check" type='font-awesome' size={22} color={"green"}></Icon>
                                    ) : (<Icon name="check" type='font-awesome' size={22} color={"white"}></Icon>)}
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ borderTopWidth: 1, flexDirection: "row", justifyContent: "center" }}>
                        <View style={{ width: 300, backgroundColor: "#ebedeb", borderRadius: 5, borderWidth: 1, margin: 7 }}>
                            <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16, margin: 7 }}>Total : ${this.calculateAmount(item.miembros)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {item.esAdministrador ? (
                    <Button titleStyle={{ color: 'white', }} containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonOkStyle}
                        title="Confirmar pedido grupal"
                    />
                ) : (null)}
            </View>
        </View>
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
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                        source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                    />
                    <Button
                        icon={
                            <Icon name='users' size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.showControls()}
                    />
                </Header>
                <GroupsControlsOverlayView showControls={() => this.showControls()} isVisible={this.state.showControls}></GroupsControlsOverlayView>
                <View style={{ flex: 1 }}>
                    {this.props.groupsData.length > 0 ? (
                        <FlatList
                            ListHeaderComponent={
                                <View style={styles.titleContainer}>
                                    <Text style={styles.adressTitle}>Grupos</Text>
                                </View>}
                            keyExtractor={this.keyExtractor}
                            data={this.props.groupsData}
                            renderItem={(item) => this.renderItem(item)}
                        />
                    ) : (
                            <View style={{ position: "absolute", zIndex: 1, width: Dimensions.get("window").width }}>
                                <View style={styles.viewErrorContainer}>

                                    <View style={styles.searchIconErrorContainer}>
                                        <Icon name="users" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                    </View>
                                    <Text style={styles.errorText}>
                                        No pertenece a ningun grupo
                                    </Text>
                                    <View style={{justifyContent:"center", alignContent:"center", alignItems:"center"}}>
                                        <Button
                                        title="Puede aceptar una invitación o crear uno"
                                            buttonStyle={styles.tipErrorText}
                                            onPress={() => this.showControls()}
                                            type="clear"
                                        />
                                    </View>
                                </View>
                            </View>

                        )}
                </View>

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

    rightHeaderButtonOnWarn: {
        marginTop:10,
        backgroundColor: '#66000000',
        marginRight: 0,
        borderColor: 'rgba(51, 102, 255, 1)',
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
        alignSelf: 'center',
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

export default GroupsView;
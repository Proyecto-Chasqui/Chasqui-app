import React from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { Header, Button, Icon, SearchBar, Image, Badge } from 'react-native-elements';
import LoadingView from '../../components/LoadingView'
import axios from 'axios'
import GLOBALS from '../../Globals'
import { createIconSet } from 'react-native-vector-icons';
import base64 from 'react-native-base64';

class GroupHistoryShoppingCartsView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = { isLoading: false }
    }

    componentDidMount() {
        this.getGroupHistoryCarts()
    }

    keyExtractor = (item, index) => index.toString()

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
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
        } else {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde.");
        }
    }

    getGroupHistoryCarts() {
        this.setState({ isLoading: true })
        axios.post((this.serverBaseRoute + 'rest/user/pedido/pedidosColectivosConEstados'), {
            idGrupo: this.props.groupSelected.id,
            estados: ["CONFIRMADO", "PREPARADO", "ENTREGADO"]
        }, { withCredentials: true }).then(res => {
            this.props.actions.groupHistoryShoppingCarts(res.data);
            this.setState({ isLoading: false })
        }).catch((error) => {
            this.setState({ isLoading: false })
            this.errorAlert(error)
        });
    }

    defineIcon(item) {
        return (
            <View style={{ marginRight: 20, marginLeft: 10 }}>
                {this.createIcon(item)}
            </View>
        )
    }

    compareIds(a, b) {

        return -1;
    }

    createIcon(item) {
        switch (item.estado) {
            case "ABIERTO":
                return (
                    <Icon
                        size={30}
                        name='shopping-cart'
                        type='font-awesome'
                        color='blue'
                    />
                )
            case "CANCELADO":
                return (
                    <Icon
                        size={30}
                        name='shopping-cart'
                        type='font-awesome'
                        color='red'
                    />
                )
            case "VENCIDO":
                return (
                    <Icon
                        size={30}
                        name='user-plus'
                        type='font-awesome'
                        color='black'
                    />
                )
            case "CONFIRMADO":
                return (
                    <Icon
                        size={30}
                        name='shopping-cart'
                        type='font-awesome'
                        color='green'
                    />
                )
            case "PREPARADO": {
                return (
                    <Icon
                        size={30}
                        name='check-circle-o'
                        type='font-awesome'
                        color='green'
                    />
                )
            }
            case "ENTREGADO": {
                return (
                    <Icon
                        size={30}
                        name='truck'
                        type='font-awesome'
                        color='green'
                    />
                )
            }
            default:
                return (
                    <Icon
                        size={30}
                        name='user-plus'
                        type='font-awesome'
                        color='black'
                    />
                )
        }
    }

    cartIsConfirmed(estado) {
        return estado === "CONFIRMADO" || estado === "PREPARADO" || estado === "ENTREGADO"
    }

    calculateSingleFinalAmount(groupCart) {
        let count = 0
        if (groupCart.pedidos !== null) {
            groupCart.pedidos.map((pedido) => {
                if (this.cartIsConfirmed(pedido.estado)) {
                    count = count + pedido.montoActual
                    if (pedido.incentivoActual !== null) {
                        count = count + pedido.incentivoActual
                    }
                }
            })
        }
        return count
    }

    calculateFinalAmount(groupCart) {
        let count = 0
        if (groupCart.pedidos !== null) {
            groupCart.pedidos.map((pedido) => {
                if (this.cartIsConfirmed(pedido.estado)) {
                    count = count + pedido.montoActual + pedido.incentivoActual
                }
            })
        }
        return count
    }

    calculateNodeAmount(groupCart) {
        let count = 0
        if (groupCart.pedidos !== null) {
            groupCart.pedidos.map((pedido) => {
                if (this.cartIsConfirmed(pedido.estado)) {
                    count = count + pedido.incentivoActual
                }
            })
        }
        return count
    }
    calculateAmount(groupCart) {
        let amount = 0
        if (groupCart.pedidos !== null) {
            groupCart.pedidos.map((pedido) => {
                if (this.cartIsConfirmed(pedido.estado)) {
                    amount = amount + pedido.montoActual
                }
            })
        }
        return amount
    }


    goToCart(cart) {
        this.props.actions.groupHistoryShoppingCartSelected(cart)
        this.props.navigation.navigate("DetalleHistorialPedidosGrupo")
    }
    isAdmin() {
        return this.props.groupSelected.emailAdministrador === this.props.user.email
    }
    keyExtractor = (item, index) => index.toString()
    renderItem = ({ item }) => (
        <View>
            {true ? (
                <TouchableOpacity onPress={() => this.goToCart(item)} style={styles.notificationItem}>
                    <View style={{ flex: 4, marginLeft: 20 }}>
                        <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 5 }}>
                            <Text style={{ fontSize: 11, color: "black" }}>Confirmado el:</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", color: "blue" }}> {item.fechaModificacion}</Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 13, }}>
                                Estado:
                             </Text>
                            <Text style={{ fontSize: 13, marginLeft: 5, fontWeight: "bold" }}>
                                {item.estado}
                            </Text>
                        </View>
                        {this.props.vendorSelected.few.nodos ? (
                            <View>
                                {this.isAdmin() ? (
                                    <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", flexWrap: "wrap", marginBottom: 5 }}>
                                        <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Ingreso Nodo :</Text> $ {this.calculateNodeAmount(item)} </Text>
                                        <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Costo al Nodo :</Text> $ {this.calculateAmount(item)} </Text>
                                        <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Precio Final :</Text> $ {this.calculateFinalAmount(item)} </Text>
                                    </View>
                                ) : (
                                        <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 5 }}>
                                            <Text style={[styles.itemDataInfoStyle, styles.itemDataStyle]}>Total: </Text>
                                            <Text style={styles.itemDataInfoStyle}>${this.calculateSingleFinalAmount(item)}</Text>
                                        </View>
                                    )}
                            </View>
                        ) : (
                                <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 5 }}>
                                    <Text style={[styles.itemDataInfoStyle, styles.itemDataStyle]}>Total: </Text>
                                    <Text style={styles.itemDataInfoStyle}>${this.calculateSingleFinalAmount(item)}</Text>
                                </View>
                            )}
                    </View>
                    {this.defineIcon(item)}
                </TouchableOpacity>) : (null)}
        </View>
    )

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
                    </Header>
                </View>
                {this.state.isLoading ? (<LoadingView></LoadingView>) : (
                    <View style={{ flex: 1 }}>
                        {this.props.groupHistoryShoppingCarts.length > 0 ? (
                            <View >
                                <FlatList
                                    ListHeaderComponent={
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.adressTitle}>Historial de pedidos colectivos</Text>
                                        </View>}
                                    keyExtractor={this.keyExtractor}
                                    data={this.props.groupHistoryShoppingCarts.sort((a, b) => this.compareIds(a, b))}
                                    renderItem={(item) => this.renderItem(item)}
                                />
                            </View>
                        ) : (
                                <View style={styles.viewErrorContainer}>
                                    <View style={styles.searchIconErrorContainer}>
                                        <Icon name="exclamation" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                    </View>
                                    <Text style={styles.errorText}>
                                        No posee pedidos
                            </Text>
                                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                        <Text style={styles.tipErrorText}>
                                            Aún no ha <Text style={{ fontWeight: "bold" }}>abierto</Text> o <Text style={{ fontWeight: "bold" }}>confirmado</Text> un pedido para este catálogo
                            </Text>
                                    </View>

                                </View>
                            )}
                    </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemDataInfoStyle: {
        alignSelf: "center",
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "italic", color: "grey"
    },
    itemDataStyle: {
        color: "black",
        fontStyle: "normal"
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

    buttonAddProductStyle: {
        height: "100%",
        backgroundColor: "#5ebb47",
    },

    buttonAddProductContainer: {

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
        backgroundColor: "grey",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    cartIconOkContainer: {
        backgroundColor: "green",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },

    subMenuButtonContainer: {
        flex: 1
    },

    subMenuButtonOkStyle: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "#5ebb47",
        borderColor: 'black',
        borderWidth: 1
    },

    subMenuButtonNotStyle: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "#f0f0f0",
        borderColor: 'black',
        borderWidth: 1
    }
    ,
    totalPriceCartStyle: {
        textAlign: 'center',
        marginTop: 7,
        fontSize: 15,
    },

    singleItemContainer: {
        margin: 5,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        backgroundColor: "white",
        marginLeft: 20,
        marginRight: 20,
    },

    quantityContainer: {
        flex: 12,
        marginBottom: 5,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 5,
        marginRight: 5,
    },

    priceStyle: {
        fontSize: 16,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    containerList: {

        flexDirection: "row",
        margin: 10,
    },

    overlayAvatarContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 7,
        marginLeft: -7,
    },

    cardImageView: {
    },

    cardImageContainer: {
        borderWidth: 1,
        borderRadius: 50,

    },
    cardImage: {
        width: null,
        height: null,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 50,
        resizeMode: 'contain',
    },

    nameTextStyle: {
        fontSize: 12,
        alignSelf: 'flex-start',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    badge: {
        marginTop: 10,
        marginLeft: 2,
        backgroundColor: '#00b300',
        height: 30,
        borderRadius: 5,
        borderColor: "black",
        alignSelf: 'flex-start'
    },

    badgeCobertura: {
        backgroundColor: '#48bb78',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 40
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

    badgeProductos: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },

    tagDestacado: {
        position: "absolute",
        alignSelf: 'flex-start',
    },


    nameProducerTextStyle: {
        fontSize: 10,
        alignSelf: 'flex-start'
    },


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 60
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

})

export default GroupHistoryShoppingCartsView
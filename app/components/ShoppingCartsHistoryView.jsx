import React from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { Header, Button, Icon, SearchBar, Image, Badge } from 'react-native-elements';
import OverlayShoppingCartView from '../containers/CatalogComponentsContainers/OverlayShoppingCart';
import LoadingView from '../components/LoadingView'
import axios from 'axios'
import GLOBALS from '../Globals'
import { createIconSet } from 'react-native-vector-icons';

class ShoppingCartsHistoryView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            search: '',
            isLoading: false,
            isVisible: false,
            showShoppingCart: false,
            searchHasChanged: false,
        };
    }

    componentDidUpdate() {
        if (this.props.hasReceivedPushNotifications) {
            this.getShoppingCarts();
            this.props.actions.hasReceivedPushNotifications(false)
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        this.getShoppingCarts();
    }

    showShoppingCart() {
        this.setState({ showShoppingCart: !this.state.showShoppingCart })
    }

    showCart(item) {
        return true;
    }

    defineIcon(item) {
        return (
            <View style={{ marginRight: 20, marginLeft: 10 }}>
                {this.createIcon(item)}
            </View>
        )
    }

    compareIds(a, b) {
        if (a.id < b.id) {
            return 1;
        }
        if (a.id > b.id) {
            return -1;
        }
        return 0;
    }

    createIcon(item) {
        switch (item.estado) {
            case "ABIERTO":
                return (
                    <Icon
                        size={30}
                        name='shopping-cart'
                        type='font-awesome'
                        color='#00adee'
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

    goToCart(item) {
        if (item.estado !== "ABIERTO") {
            this.props.actions.historyCartSelected(item)
            this.props.navigation.navigate("HistorialDePedido")
        } else {
            this.setState({ showShoppingCart: !this.state.showShoppingCart })
        }
    }

    inWaitingOfGroupConfirmation(cart) {
        return (cart.estado === "CONFIRMADO" && cart.direccion === null && cart.puntoDeRetiro === null && cart.idGrupo !== null)
    }

    defineText() {
        if (this.props.vendorSelected.few.gcc) {
            return "En espera de confirmación grupal"
        } else {
            return "En espera de confirmación del nodo"
        }
    }

    definePrice(item) {
        return item.montoActual + item.incentivoActual;
    }

    renderItem = ({ item }) => (
        <View>
            {this.showCart(item) ? (
                <TouchableOpacity onPress={() => this.goToCart(item)} style={styles.notificationItem}>
                    <View style={{ flex: 4, margin: 10 }}>
                        <View style={{ alingItems: "center", flexDirection: "row" }}>
                            <Text style={{ fontSize: 11 }}>Tipo de pedido:</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", color: '#00adee' }}> {item.idGrupo === null ? ("Individual") : ("Colectivo")}</Text>
                        </View>
                        {this.inWaitingOfGroupConfirmation(item) ? (
                            <View style={{ alingItems: "center", flexDirection: "row" }}>
                                <Text style={{ fontSize: 12, fontWeight: "bold", color: '#00adee' }}>Aviso: </Text>
                                <Text style={{ fontSize: 12, fontWeight: "bold", color: "green" }}>{this.defineText()}</Text>
                            </View>
                        ) : (null)}
                        <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 5 }}>
                            <Text style={{ fontSize: 11, color: "black" }}>Creado el:</Text>
                            <Text style={{ fontSize: 11, fontWeight: "bold", color: '#00adee' }}> {item.fechaCreacion}</Text>
                        </View>

                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 13, }}>
                                Estado:
                             </Text>
                            <Text style={{ fontSize: 13, marginLeft: 5, fontWeight: "bold" }}>
                                {item.estado}
                            </Text>
                        </View>
                        <View style={{ alignContent: "center", alignItems: "center", flexDirection: "row", marginBottom: 5 }}>
                            <Text >Total: </Text>
                            <Text style={{ fontWeight: "bold", marginLeft: 5 }} >${this.definePrice(item)}</Text>
                        </View>
                    </View>
                    {this.defineIcon(item)}
                </TouchableOpacity>) : (null)}
        </View>
    )

    keyExtractor = (item, index) => index.toString()
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
    getShoppingCarts() {
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "CONFIRMADO",
                "PREPARADO",
                "ENTREGADO",
                "ABIERTO",
                "ENVIADO",
            ]
        }, { withCredentials: true }).then(res => {
            this.props.actions.historyShoppingCarts(res.data);
            this.setState({ isLoading: false })
        }).catch((error) => {
            this.setState({ isLoading: false })
            this.errorAlert(error)
        });
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
                                    <Icon name="shopping-cart" size={20} color="white" type='font-awesome' />
                                }
                                buttonStyle={styles.leftHeaderButton}
                                onPress={() => this.setState({ showShoppingCart: !this.state.showShoppingCart })}
                            />
                            {this.props.shoppingCarts.length > 0 ? (
                                <Badge value={this.props.shoppingCarts.length} status="error" containerStyle={{ position: 'absolute', top: -6, right: -6 }} />
                            ) : (null)}
                        </View>
                    </Header>
                </View>
                <OverlayShoppingCartView
                    showFilter={() => this.showShoppingCart()}
                    isVisible={this.state.showShoppingCart}
                    navigation={this.props.navigation}>
                </OverlayShoppingCartView>
                {this.state.isLoading ? (<LoadingView></LoadingView>) : (
                    <View style={{ flex: 1 }}>
                        {this.props.historyShoppingCarts.length > 0 ? (
                            <View >
                                <FlatList
                                    ListHeaderComponent={
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.adressTitle}>Historial de pedidos</Text>
                                        </View>}
                                    keyExtractor={this.keyExtractor}
                                    data={this.props.historyShoppingCarts.sort((a, b) => this.compareIds(a, b))}
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


export default ShoppingCartsHistoryView;
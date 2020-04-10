import React from 'react'
import GLOBAL from '../../Globals';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar } from 'react-native-elements';
import QuantitySelector from '../../components/catalogViewComponents/QuantitySelectorView';
import axios from 'axios';

class ProductItemView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation;
        this.serverBaseRoute = GLOBAL.BASE_URL;
        this.shoppingCarts = this.props.actions.shoppingCarts;
        this.state = {
            showInfo: false,
            validCart: false,
            initialValue: 0,
            quantityValue: 0,
            idPedido: 0,
            buttonDisabled: true,
            buttonLoading:false,
        }
    }

    componentDidUpdate() {
        if (this.props.shoppingCartSelected.id !== undefined) {
            if (this.state.idPedido !== this.props.shoppingCartSelected.id) {
                this.setState({
                    initialValue: this.setProductQuantity(),
                    quantityValue: this.setProductQuantity(),
                    idPedido: this.props.shoppingCartSelected.id,
                    buttonDisabled: true,
                })
            }
        }
    }

    setQuantityValue(value, equals) {
        this.setState({ quantityValue: value, buttonDisabled: equals })
    }

    componentDidMount() {
        this.setState({
            initialValue: this.setProductQuantity(),
            quantityValue: this.setProductQuantity(),
        })

    }

    setProductQuantity() {
        let value = 0;
        if (this.props.shoppingCartSelected.id !== undefined) {
            this.props.shoppingCartSelected.productosResponse.map((product) => {
                if (this.props.item.idVariante === product.idVariante) {
                    value = product.cantidad
                }
            })
        }
        return value;
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    updateCartSelected() {
        this.props.shoppingCarts.map((cart, i) => {
            if (cart.id === this.props.shoppingCartSelected.id) {
                this.props.actions.shoppingCartSelected(cart)
            }
        })
        this.setState({ buttonLoading: false })
    }

    getShoppingCarts() {
        axios.post((this.serverBaseRoute + '/rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "ABIERTO"
            ]
        }).then(res => {
            this.shoppingCarts(res.data);
            this.updateCartSelected();
            this.setState({ showWaitSign: false, idPedido: 0 })
        }).catch((error) => {
            console.log(error);
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los pedidos del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    addProductToCart() {
        console.log("state at sending",this.state)
        console.log("item", this.props.item)
        this.setState({ buttonLoading: true, buttonDisabled: true })
        if (this.state.quantityValue > this.state.initialValue) {
            axios.put((this.serverBaseRoute + 'rest/user/pedido/individual/agregar-producto'), {
                idPedido: this.props.shoppingCartSelected.id,
                idVariante: this.props.item.idVariante,
                cantidad: this.state.quantityValue - this.state.initialValue,
            }).then(res => {
                this.getShoppingCarts()
            }).catch((error) => {
                this.setState({ buttonLoading: false, buttonDisabled: false })
                if (error.response) {
                    Alert.alert('Aviso', error.response.data.error);
                } else if (error.request) {
                    Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
                } else {
                    Alert.alert('Error', "Ocurrio un error al intentar comunicarse con el servidor, intente más tarde o verifique su conectividad.");
                }
            });
        } else {
            axios.put((this.serverBaseRoute + 'rest/user/pedido/individual/eliminar-producto'), {
                idPedido: this.props.shoppingCartSelected.id,
                idVariante: this.props.item.idVariante,
                cantidad: this.state.initialValue - this.state.quantityValue,
            }).then(res => {
                this.getShoppingCarts();
            }).catch((error) => {
                console.log(error);
                this.setState({ buttonLoading: false, buttonDisabled: false })
                if (error.response) {
                    Alert.alert('Aviso', error.response.data.error);
                } else if (error.request) {
                    Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
                } else {
                    Alert.alert('Error', "Ocurrio un error al intentar comunicarse con el servidor, intente más tarde o verifique su conectividad.");
                }
            });
        }
    }

    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({ showInfo: !this.state.showInfo })} style={{ borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                    <View style={stylesListCard.containerList}>
                        <View style={stylesListCard.cardImageView}>
                            <Avatar overlayContainerStyle={stylesListCard.overlayAvatarContainer} rounded size={80} source={{ uri: (this.normalizeText(this.serverBaseRoute + this.props.item.imagen)) }} renderPlaceholderContent={<ActivityIndicator size="large" color="#0000ff" />} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View >
                                <Text style={stylesListCard.priceStyle}>{this.props.item.cantidad} x {this.props.item.precio} = $ {this.props.item.cantidad * this.props.item.precio}</Text>
                            </View>
                            <View>
                                <Text style={stylesListCard.nameTextStyle}>{this.props.item.nombre}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                {this.state.showInfo ? (
                    <View style={{ flex: 1, backgroundColor: '#ebedeb', borderBottomWidth:2, borderColor:'black'}}>
                        <View  style={{ backgroundColor: '#ebedeb', marginTop:10,marginBottom:10, flexDirection:'row'}}>
                        <View style={stylesListCard.quantityContainer}>
                            <QuantitySelector disabled={false} functionValueComunicator={(value, change) => this.setQuantityValue(value, change)} text={""} initialValue={this.state.initialValue.toString()}></QuantitySelector>
                        </View>
                        <View style={stylesListCard.singleItemContainer}>
                            <Button
                                onPress={() => this.addProductToCart()}
                                titleStyle={{ color: "black", fontSize: 20 }}
                                containerStyle={stylesListCard.buttonAddProductContainer}
                                disabled={this.state.buttonDisabled}
                                loading={this.state.buttonLoading}
                                buttonStyle={stylesListCard.buttonAddProductStyle} title={this.state.initialValue>0?"Modificar":"Agregar"}></Button>
                        </View>
                        </View>
                    </View>) : (null)}
            </View>)
    }
}

const stylesListCard = StyleSheet.create({

    buttonAddProductStyle: {
        height: "100%",
        backgroundColor: "#f8f162",
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
        flex:3,
        marginBottom: 5,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 20,
        marginRight: 20,
    },

    quantityContainer:{
        flex:5,
        marginBottom: 5,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 20,
        marginRight: 20,
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

export default ProductItemView
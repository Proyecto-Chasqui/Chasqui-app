import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar } from 'react-native-elements';
import GLOBAL from '../../Globals';
import axios from 'axios';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView'
import ProductItemView from '../../containers/ConfirmShoppingCartContainers/ProductItem'

class ItemInfoCartView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation;
        this.serverBaseRoute = GLOBAL.BASE_URL;
        this.shoppingCarts = this.props.actions.shoppingCarts;
        this.state = {
            showWaitSign: false,
            guest: this.props.user.id === 0,
            validCart: false,
        }
    }
    normalizeText(text) {
        return encodeURI(text);
    }

    cancelCartAlert() {
        Alert.alert(
            'Pregunta',
            '¿Esta seguro de cancelar su pedido individual?',
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.cancelCart() },

            ],
            { cancelable: false },
        );
    }



    showAlertInvalidCart(){
        Alert.alert(
            'Aviso',
            'Debe agregar al menos un producto para confirmar',
            [
                { text: 'Entendido', onPress: () => null },

            ],
            { cancelable: false },
        );
    }

    goToProduct(idVariante) {
        this.props.allProducts.map((product) =>{
            if(product.idProducto === idVariante){
                this.props.actions.productSelected(product);
            }
        })
        this.goProduct();
        this.props.functionShow();        
    }

    goProduct(){
        this.navigation.navigate("Producto");
    }

    goToRegister(){
        this.props.actions.logout();
    }

    getShoppingCarts() {
        axios.post((this.serverBaseRoute + '/rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "ABIERTO"
            ]
        }).then(res => {
            this.shoppingCarts(res.data);
            this.setState({ showWaitSign: false })
            Alert.alert(
                'Aviso',
                'El pedido ha sido cancelado correctamente',
                [
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
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

    cancelCart() {
        this.setState({ showWaitSign: true })
        axios.delete((this.serverBaseRoute + 'rest/user/pedido/individual/' + this.props.shoppingCartSelected.id)).then(res => {
            this.props.actions.shoppingCartUnselected();
            this.getShoppingCarts();
        }).catch((error) => {
            this.setState({ showWaitSign: false })
            console.log("error", error);
            Alert.alert(
                'Error',
                'Ocurrio un error al cancelar el pedido, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    confirmCart(){
        if(this.props.shoppingCartSelected.productosResponse == 0){
            this.showAlertInvalidCart()
        }else{
            this.props.functionShow();     
            this.navigation.navigate('ConfirmarPedido')
        }
    }

    compareIds(a,b){
        if (a.idVariante > b.idVariante) {
            return 1;
          }
          if (a.idVariante < b.idVariante) {
            return -1;
          }
          // a must be equal to b
          return 0;
    }


    render() {
        if (this.props.shoppingCartSelected.id === undefined) {
            return (
                <View>
                    <View style={{ height: Dimensions.get("window").height - 270 }}>
                        <View style={stylesListCard.viewSearchErrorContainer}>
                            {this.state.guest ?
                                (
                                    <View style={stylesListCard.viewErrorContainer}>
                                        <View style={stylesListCard.searchIconErrorContainer}>
                                            <Icon name="user" type='font-awesome' size={50} color={"white"} containerStyle={stylesListCard.searchIconError}></Icon>
                                        </View>
                                        <Text style={stylesListCard.errorText}>
                                            Debe ingresar con una cuenta
                                        </Text><Button onPress={()=>this.goToRegister()}title="Ingresar" type="clear"/>
                                    </View>
                                )
                                :
                                (
                                    <View style={stylesListCard.viewErrorContainer}>
                                        <View style={stylesListCard.searchIconErrorContainer}>
                                            <Icon name="shopping-cart" type='font-awesome' size={50} color={"white"} containerStyle={stylesListCard.searchIconError}></Icon>
                                        </View>
                                        <Text style={stylesListCard.errorText}>
                                            No tiene ningún pedido seleccionado
                                        </Text>
                                        <Text style={stylesListCard.tipErrorText}>
                                            Seleccione o abra uno en la opción <Text style={{ fontWeight: 'bold' }}>Ver pedidos</Text>
                                        </Text>
                                    </View>
                                )
                            }

                        </View>
                    </View>
                    <View style={{ backgroundColor: '#ebedeb', height: Dimensions.get("window").height - 710, }}>
                        <View style={{ marginTop: 15 }}>
                            <View style={stylesListCard.singleItemContainer}>
                                <Text style={stylesListCard.totalPriceCartStyle}> Total : $ - - - </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginTop: 2 }}>
                                <Button disabled={true} titleStyle={{ color: 'black', }} title='Cancelar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonNotStyle}></Button>
                                <Button disabled={true} titleStyle={{ color: 'white', }} title='Confirmar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonOkStyle}></Button>
                            </View>
                        </View>
                    </View>
                </View>
            )

        }

        return (
            <View>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText="Comunicandose con el servidor..."></LoadingOverlayView>
                <View style={{ height: Dimensions.get("window").height - 270 }}>
                    {this.props.shoppingCartSelected.productosResponse.length == 0 ?
                        (
                            <View style={stylesListCard.viewSearchErrorContainer}>
                                <View style={stylesListCard.viewErrorContainer}>
                                    <View style={stylesListCard.cartIconOkContainer}>
                                        <Icon name="shopping-cart" type='font-awesome' size={50} color={"white"} containerStyle={stylesListCard.searchIconError}></Icon>
                                    </View>
                                    <Text style={stylesListCard.errorText}>
                                        Ya puede agregar productos!
                        </Text>

                                </View>
                            </View>
                        )
                        : (
                            <FlatList data={this.props.shoppingCartSelected.productosResponse.sort((a, b) => this.compareIds(a,b))} keyExtractor={item => item.idVariante} windowSize={15}
                                renderItem={({ item }) =>
                                
                                 <View style={{ flex: 1, backgroundColor: '#ebedeb', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                <ProductItemView  touchable={true} item={item}></ProductItemView>
                                </View>
                                    

                                } />)
                    }
                </View>
                <View style={{ backgroundColor: '#ebedeb', height: Dimensions.get("window").height - 710, }}>
                    <View style={{ marginTop: 15 }}>
                        <View style={stylesListCard.singleItemContainer}>
                            <Text style={stylesListCard.totalPriceCartStyle}> Total : $ {this.props.shoppingCartSelected.montoActual} </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginTop: 2 }}>
                            <Button onPress={() => this.cancelCartAlert()} titleStyle={{ color: 'black', }} title='Cancelar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonNotStyle}></Button>
                            <Button onPress={() => this.confirmCart()} titleStyle={{ color: 'white', }} title='Confirmar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonOkStyle}></Button>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const stylesListCard = StyleSheet.create({

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
        margin: 10
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
export default ItemInfoCartView
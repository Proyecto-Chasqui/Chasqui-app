import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar } from 'react-native-elements';
import GLOBAL from '../../Globals';
import axios from 'axios';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView';
import ProductItemView from '../../containers/ConfirmShoppingCartContainers/ProductItem';

class CartBriefingView extends React.PureComponent {
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

    compareIds(a, b) {
        if (a.idVariante > b.idVariante) {
            return 1;
        }
        if (a.idVariante < b.idVariante) {
            return -1;
        }
        return 0;
    }
    getDataProducts() {
        if (this.props.shoppingCartSelected.productosResponse !== undefined) {
            return this.props.shoppingCartSelected.productosResponse.sort((a, b) => this.compareIds(a, b))
        } else {
            return []
        }
    }

    obtainTotalPrice() {
        if (this.props.shoppingCartSelected.montoActual !== undefined) {
            return (this.props.shoppingCartSelected.montoActual).toFixed(2)
        } else {
            return 0
        }

    }

    showMinAmount() {
        return this.props.vendorSelected.few.seleccionDeDireccionDelUsuario
    }

    setStyleDistance() {
        if (this.showMinAmount()) {
            return "space-evenly"
        } else {
            return "center"
        }
    }
    keyExtractor = (item, index) => index.toString()
    render() {

        return (
            <View style={{flex:1}}>
                <View style={stylesListCard.titleContainer}>
                    <Text style={stylesListCard.adressTitle}>Verifique su compra</Text>
                </View>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText="Comunicandose con el servidor..."></LoadingOverlayView>
                <View style={{ height: Dimensions.get("window").height - 265 }}>
                    <FlatList data={this.getDataProducts()}
                        keyExtractor={this.keyExtractor} windowSize={15}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, backgroundColor: '#ebedeb', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                <ProductItemView touchable={true} item={item}></ProductItemView>
                            </View>
                        } />

                </View>
                <View style={{ }}>
                    <View style={{ marginTop: 15 }}>

                        <View style={stylesListCard.singleItemContainer}>
                            <View>
                                <Text style={stylesListCard.totalPriceCartStyle}> Total : $ {this.obtainTotalPrice()} </Text>
                            </View>
                            {this.showMinAmount() ? (
                                <View style={{ backgroundColor: 'transparent', flexDirection: "row", alignItems: "center", }}>
                                    <Text style={{ fontSize: 15, }}> Min. Monto: </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ textAlign: "center", marginRight: 5 }}>${this.props.vendorSelected.montoMinimo}</Text>
                                        {this.props.shoppingCartSelected.montoActual >= this.props.vendorSelected.montoMinimo ? (
                                            <Icon name="check" type='font-awesome' size={20} color={"green"}></Icon>
                                        ) : (<Icon name="check" type='font-awesome' size={20} color={"#ebedeb"}></Icon>)}
                                    </View>
                                </View>
                            ) : (null)}

                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const stylesListCard = StyleSheet.create({
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
        fontSize: 15,
    },

    singleItemContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems:"center",
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
        backgroundColor: '#00adee',
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
export default CartBriefingView
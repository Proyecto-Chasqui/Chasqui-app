import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar } from 'react-native-elements';
import GLOBAL from '../../Globals';
import axios from 'axios';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView';
import ProductItemView from '../../containers/ConfirmShoppingCartContainers/ProductItem';
import DetailGroupView from '../../containers/GroupsComponentsContainers/GroupDetail';

class GroupCartBriefingView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation;
        this.serverBaseRoute = GLOBAL.BASE_URL;
        //this.shoppingCarts = this.props.actions.shoppingCarts;
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

    calculateAmount() {
        let count = 0
        this.props.groupSelected.miembros.map((miembro) => {
            if (miembro.pedido != null) {
                if (miembro.pedido.estado === "CONFIRMADO") {
                    count = count + miembro.pedido.montoActual
                }
            }
        })
        return count
    }

    calculateNodeAmount() {
        let count = 0
        this.props.groupSelected.miembros.map((miembro) => {
            if (miembro.pedido != null) {
                if (miembro.pedido.estado === "CONFIRMADO") {
                    count = count + miembro.pedido.incentivoActual
                }
            }
        })
        return count
    }

    calculateFinalAmount() {
        let count = 0
        this.props.groupSelected.miembros.map((miembro) => {
            if (miembro.pedido != null) {
                if (miembro.pedido.estado === "CONFIRMADO") {
                    count = count + miembro.pedido.montoActual + miembro.pedido.incentivoActual
                }
            }
        })
        return count
    }

    hasNodeAndIncentives() {
        return this.props.vendorSelected.few.nodos && this.props.vendorSelected.few.usaIncentivos;
    }

    defineTitleText() {
        if (this.props.vendorSelected.few.nodos) {
            return "Nodo"
        } else {
            return "Grupo"
        }
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <View style={stylesListCard.titleContainer}>
                    <Text style={stylesListCard.adressTitle}>Información de la compra</Text>
                </View>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText="Comunicandose con el servidor..."></LoadingOverlayView>
                <View style={{ flex: 1}}>
                    <Text style={stylesListCard.sectionTitleTextStyle}>{this.defineTitleText()}</Text>
                    <View style={{ backgroundColor: "white" }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>{this.props.groupSelected.alias}</Text>
                    </View>
                    <Text style={stylesListCard.sectionTitleTextStyle}>Pedidos</Text>
                    <DetailGroupView onlyConfirmed={true} hideHeaders={true} navigation={this.props.navigation}></DetailGroupView>
                </View>
                <View style={{}}>
                    <View style={{ marginTop: 15, }}>
                        <View style={[stylesListCard.singleItemContainer,{flexDirection: this.hasNodeAndIncentives()?("column"):("row")}]}>
                            {this.hasNodeAndIncentives() ? (
                                <View style={{  }}>
                                    <View style={{ marginBottom: 5 }}>
                                        <Text style={stylesListCard.itemDataInfoStyle}><Text style={stylesListCard.itemDataStyle}> Ingreso Nodo :</Text> $ {this.calculateNodeAmount()} </Text>
                                        <Text style={stylesListCard.itemDataInfoStyle}><Text style={stylesListCard.itemDataStyle}> Costo al Nodo :</Text> $ {this.calculateAmount()} </Text>
                                        <Text style={stylesListCard.itemDataInfoStyle}><Text style={stylesListCard.itemDataStyle}> Precio Final :</Text> $ {this.calculateFinalAmount()} </Text>
                                    </View>
                                </View>
                            ) : (
                                    <View style={{ height: 50, justifyContent: "center" }}>
                                        <Text style={stylesListCard.itemDataInfoStyle}><Text style={stylesListCard.itemDataStyle}> Total :</Text> $ {this.calculateAmount()} </Text>
                                    </View>
                                )}
                            {this.showMinAmount() ? (
                                <View style={{ backgroundColor: 'transparent', flexDirection: "row", alignItems: "center" }}>
                                    <Text style={[stylesListCard.itemDataInfoStyle,stylesListCard.itemDataStyle]}> Min. Monto: </Text>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={[stylesListCard.itemDataInfoStyle,{marginRight:5}]}>${this.props.vendorSelected.montoMinimo}</Text>
                                        {this.calculateAmount() >= this.props.vendorSelected.montoMinimo ? (
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
    itemDataInfoStyle: { fontSize: 16, fontWeight: "bold", fontStyle: "italic", color: "grey" },
    itemDataStyle: { color: "black", fontStyle: "normal" },
    requestItemData: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%", },
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
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 5,
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
export default GroupCartBriefingView
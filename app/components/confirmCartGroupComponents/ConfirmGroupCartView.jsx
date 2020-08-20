import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert, TextInput, KeyboardAvoidingView } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar, Input } from 'react-native-elements';
import GLOBAL from '../../Globals';
import axios from 'axios';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView';
import ProductItemView from '../../containers/ConfirmShoppingCartContainers/ProductItem';
import DetailGroupView from '../../containers/GroupsComponentsContainers/GroupDetail'


class ConfirmGroupCartView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation;
        this.serverBaseRoute = GLOBAL.BASE_URL;
        this.shoppingCarts = this.props.actions.shoppingCarts;
        this.comment = "",
            this.sellerPointSelected = this.props.sellerPointSelected,
            this.adressSelected = this.props.adressSelected,
            this.answers = this.props.answers,
            this.state = {
                showWaitSign: false,
                guest: this.props.user.id === 0,
                validCart: false,
                zone: undefined,
                loadingZone: false,
            }
    }

    compareIds(a, b) {
        if (a.idVariante > b.idVariante) {
            return 1;
        }
        if (a.idVariante < b.idVariante) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }

    goToShippingMap() {
        this.navigation.navigate("Entregas")
    }
    parseAdress(adress) {
        return adress.calle + ", " + adress.altura + ", " + adress.localidad
    }


    parseDate(string) {
        let parts = string.split('-');
        let parsedDate = parts[0] + "/" + parts[1] + "/" + parts[2].split(' ')[0];
        return parsedDate;
    }

    updateText(text) {
        if (this.comment !== text) {
            this.props.comment(text)
            this.comment = text
        }
    }

    getDataProducts() {
        if (this.props.shoppingCartSelected.productosResponse !== undefined) {
            return this.props.shoppingCartSelected.productosResponse.sort((a, b) => this.compareIds(a, b))
        } else {
            return []
        }
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

    obtainTotalPrice() {
        let total = 0;
        this.props.groupSelected.miembros.map((member) => {
            if (member.pedido !== null) {
                if (member.pedido.estado === "CONFIRMADO") {
                    total = total + member.pedido.montoActual
                }
            }
        })
        return total
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
            <ScrollView style={{ flex: 1 }} >
                <View style={stylesListCard.titleContainer}>
                    <Text style={stylesListCard.adressTitle}>Los datos de su compra</Text>
                </View>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText="Comunicandose con el servidor..."></LoadingOverlayView>
                <Text style={stylesListCard.sectionTitleTextStyle}>{this.defineTitleText()}</Text>
                <View style={{ backgroundColor: "white" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center" }}>{this.props.groupSelected.alias}</Text>
                </View>
                <View >
                    <Text style={stylesListCard.sectionTitleTextStyle}>Su pedido</Text>
                    <DetailGroupView onlyConfirmed={true} disabledPress={true} hideHeaders={true}></DetailGroupView>
                    {this.props.answers.length > 0 ? (
                        <View style={{ flex: 1 }}>
                            <Text style={stylesListCard.sectionTitleTextStyle} > Respuestas del cuestionario </Text>
                            <FlatList data={this.props.answers}
                                ListHeaderComponent={
                                <View style={{ flex:1, alignItems:"center",flexDirection: "row", marginLeft:5, marginRight:5, backgroundColor: '#ebedeb', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                    <Text style={{flex:1,color:"black",fontWeight:"bold", textAlign:"center", }}>Pregunta </Text><Text style={{borderLeftWidth:2,height:"100%",borderColor:"#e1e1e1"}}></Text><Text  style={{flex:1,textAlign:"center",color:'#00adee',fontWeight:"bold"}}>Respuesta</Text>
                                </View>
                                }
                                keyExtractor={item => item.nombre} windowSize={15}
                                renderItem={({ item }) =>
                                    <View style={{ flex:1, alignItems:"center",flexDirection: "row", marginLeft:5, marginRight:5, backgroundColor: '#ebedeb', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                        <Text style={{flex:1,color:"black",fontWeight:"bold", textAlign:"center"}}>{item.nombre}  </Text><Text style={{borderLeftWidth:2,height:"100%",borderColor:"#e1e1e1"}}></Text><Text  style={{flex:1,textAlign:"center",color:'#00adee',fontWeight:"bold"}}>{item.opcionSeleccionada}</Text>
                                    </View>
                                } />
                        </View>) : (null)
                    }
                    {this.props.adressSelected !== undefined ? (
                        <View style={{ flex: 1 }}>
                            <Text style={stylesListCard.sectionTitleTextStyle}>Será entregado en</Text>
                            <View style={{ flex: 1 }}>
                                <Text style={{ margin: 5, color: '#00adee', fontSize: 16, fontWeight: 'bold', textAlign: "center" }}>{this.parseAdress(this.props.adressSelected)}</Text>
                                {this.props.zone != undefined ? (
                                    <View style={{ flex: 1, }}>
                                        <Text style={stylesListCard.sectionTitleTextStyle}> Detalles de la zona de entrega</Text>
                                        <View style={{ flex: 1, marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Zona de entrega: </Text>
                                                <Text style={{ fontSize: 12 }}>{this.props.zone.nombre}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Cierre de pedidos: </Text>
                                                <Text style={{ fontSize: 12 }}>{this.parseDate(this.props.zone.fechaCierrePedidos)}</Text>
                                            </View>
                                            <Text style={{ fontStyle: 'italic' }}>{this.props.zone.descripcion}</Text>
                                        </View>
                                    </View>
                                ) : (
                                        <Text style={{ fontSize: 13, marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, fontStyle: 'italic', textAlign: "justify" }}>
                                            La dirección seleccionada no se encuentra dentro del alcance de alguna zona de entrega, recuerde comunicarse con el vendedor para coordinar la entrega.
                                        </Text>
                                    )}
                            </View>
                        </View>
                    ) : (null)}
                    {this.props.sellerPointSelected !== undefined ? (
                        <View style={{ height: 130 }}>
                            <Text style={stylesListCard.sectionTitleTextStyle}>Lo pasa a retirar en</Text>
                            <ScrollView style={{ marginLeft: 20, marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{this.props.sellerPointSelected.nombre}</Text>
                                <Text style={{ color: '#00adee' }}>{this.parseAdress(this.props.sellerPointSelected.direccion)}</Text>
                                <Text style={{ fontSize: 14, }}>{this.props.sellerPointSelected.mensaje}</Text>
                            </ScrollView>
                        </View>
                    ) : (null)}
                    <View style={{ justifyContent: "center" }}>
                        <Text style={stylesListCard.sectionTitleTextStyle}>Comentario [ {this.comment.length} / 200 ]</Text>
                        <TextInput style={{ marginLeft: 10, alignSelf: "flex-start", borderColor: 'gray', }}
                            placeholder={"  Puede dejar un comentario para el pedido aqui."}
                            placeholderTextColor='#00adee'
                            multiline
                            numberOfLines={4}
                            onChangeText={text => this.updateText(text)}
                            value={this.comment}
                            maxLength={200}>
                        </TextInput>
                    </View>


                </View>
                {this.hasNodeAndIncentives() ? (
                    <View style={{}}>
                        <View style={{ backgroundColor: "#00adee", borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, }}>
                            <View style={stylesListCard.singleItemContainer}>
                                <Text style={stylesListCard.itemDataInfoStyle}><Text style={stylesListCard.itemDataStyle}> Ingreso Nodo :</Text> $ {this.calculateNodeAmount()} </Text>
                                <Text style={stylesListCard.itemDataInfoStyle}><Text style={stylesListCard.itemDataStyle}> Costo al Nodo :</Text> $ {this.obtainTotalPrice()} </Text>
                                <Text style={stylesListCard.itemDataInfoStyle}><Text style={stylesListCard.itemDataStyle}> Precio Final :</Text> $ {this.calculateFinalAmount()} </Text>
                            </View>
                        </View>
                    </View>
                ) : (
                        <View style={{ backgroundColor: "black", }}>
                            <View style={{ alignItems: "center", backgroundColor: "#00adee", borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, }}>
                                <View style={[stylesListCard.singleItemContainer, { height: 40, justifyContent: "center" }]}>
                                    <Text style={[stylesListCard.itemDataInfoStyle]}><Text style={[stylesListCard.itemDataStyle]}> Total :</Text> $ {this.obtainTotalPrice()} </Text>
                                </View>
                            </View>
                        </View>
                    )}
            </ScrollView>
        )
    }
}

const stylesListCard = StyleSheet.create({
    itemDataInfoStyle: {
        alignSelf: "center",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic", color: "grey"
    },
    itemDataStyle: {
        color: "black",
        fontStyle: "normal"
    },
    requestItemData: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        width: "100%",
    },
    sectionTitleTextStyle: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: '#00adee',
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
        alignSelf: "center",
        margin: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        backgroundColor: "white",
        width: "95%"
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
export default ConfirmGroupCartView
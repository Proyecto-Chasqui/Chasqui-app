import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert, TextInput } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar, Input } from 'react-native-elements';
import GLOBAL from '../../Globals';
import axios from 'axios';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView';
import ProductItemView from '../../containers/ConfirmShoppingCartContainers/ProductItem';

class ConfirmCartView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation;
        this.serverBaseRoute = GLOBAL.BASE_URL;
        this.shoppingCarts = this.props.actions.shoppingCarts;
        this.comment= "",
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

    goToShippingMap(){
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

    updateText(text){
        if(this.comment !== text ){
            this.props.comment(text)
            this.comment = text 
        }
    }

    getDataProducts(){
        if (this.props.shoppingCartSelected.productosResponse !== undefined){
        return this.props.shoppingCartSelected.productosResponse.sort((a, b) => this.compareIds(a, b))
        }else{
            return []
        }
    }

    obtainTotalPrice(){
        if (this.props.shoppingCartSelected.montoActual !== undefined) {
            return (this.props.shoppingCartSelected.montoActual).toFixed(2)
        } else {
            return 0
        }
        
    }
    render() {

        return (
            <View>
                <View style={stylesListCard.titleContainer}>
                    <Text style={stylesListCard.adressTitle}>Los datos de su compra</Text>
                </View>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText="Comunicandose con el servidor..."></LoadingOverlayView>
                <View style={{ height: Dimensions.get("window").height - 300 }}>
                    <Text style={stylesListCard.sectionTitleTextStyle}>Su pedido</Text>
                    <FlatList data={this.getDataProducts()}
                        keyExtractor={item => item.idVariante} windowSize={15}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, backgroundColor: '#ebedeb', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                <ProductItemView touchable={false} item={item}></ProductItemView>
                            </View>
                        } />
                    {this.props.answers.length > 0 ? (
                        <View style={{height:65}}>
                            <Text style={stylesListCard.sectionTitleTextStyle} > Respuestas del cuestionario </Text>
                            <FlatList data={this.props.answers}
                                keyExtractor={item => item.nombre} windowSize={15}
                                renderItem={({ item }) =>
                                    <View style={{flex: 1, flexDirection: "row", backgroundColor: '#ebedeb', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                        <Text style={{color:"black",fontWeight:"bold"}}>{item.nombre} : </Text><Text  style={{color:"blue",fontWeight:"bold"}}>{item.opcionSeleccionada}</Text>
                                    </View>
                                } />
                        </View>) : (null)
                    }
                    {this.props.adressSelected !== undefined ? (
                        <View style={{height:150}}>
                        <Text style={stylesListCard.sectionTitleTextStyle}>Será entregado en</Text>
                        <View>
                            <Text style={{ margin:5, color: "blue", fontSize:16,fontWeight:'bold', textAlign:"center" }}>{this.parseAdress(this.props.adressSelected)}</Text>
                            {this.props.zone != undefined ? (
                                <View>
                                    <Text style={stylesListCard.sectionTitleTextStyle}> Detalles de la zona de entrega</Text>
                                    <ScrollView style={{marginLeft:20, marginRight:20, marginBottom:10, marginTop:10}}>                                            
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:12, fontWeight:'bold'}}>Zona de entrega: </Text>
                                                    <Text style={{fontSize:12}}>{this.props.zone .nombre}</Text>
                                                </View>
                                                <View  style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:12, fontWeight:'bold'}}>Cierre de pedidos: </Text>
                                                    <Text style={{fontSize:12}}>{this.parseDate(this.props.zone .fechaCierrePedidos)}</Text>
                                                </View>
                                                <Text style={{fontStyle:'italic'}}>{ this.props.zone .descripcion }</Text>
                                    </ScrollView>
                                 </View>
                            ):(
                                <Text style={{fontSize:13, marginLeft:20, marginRight:20, marginBottom:10, marginTop:10, fontStyle:'italic', textAlign:"justify"}}>
                                     La dirección seleccionada no se encuentra dentro del alcance de alguna zona de entrega, recuerde comunicarse con el vendedor para coordinar la entrega.
                                </Text>
                            )}
                        </View>
                        </View>
                    ) : (null)}
                    {this.props.sellerPointSelected !== undefined ? (
                        <View style={{height:130}}>
                        <Text style={stylesListCard.sectionTitleTextStyle}>Lo pasa a retirar en</Text>
                        <ScrollView style={{ flex: 5, marginLeft:20, marginRight:10, marginBottom:10, marginTop:10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{this.props.sellerPointSelected.nombre}</Text>
                            <Text style={{ color: "blue" }}>{this.parseAdress(this.props.sellerPointSelected.direccion)}</Text>
                            <Text style={{ fontSize: 14,  }}>{this.props.sellerPointSelected.mensaje}</Text>
                        </ScrollView>
                        </View>
                        ) : (null)}
                    <View>
                    <Text style={stylesListCard.sectionTitleTextStyle}>Comentario [ {this.comment.length} / 200 ]</Text>
                        <TextInput style={{ height: 40, marginLeft:10, borderColor: 'gray', }}
                        placeholder={"  Puede dejar un comentario para el pedido aqui."}
                        placeholderTextColor="blue"
                        multiline
                        numberOfLines={3}
                        onChangeText={text => this.updateText(text)}
                        value={this.comment}
                        maxLength = {200}></TextInput>
                    </View>
                    

                </View>
                <View style={{ backgroundColor: '#ebedeb' }}>
                    <View style={{ marginTop: 0 }}>
                        <View style={stylesListCard.singleItemContainer}>
                            <Text style={stylesListCard.totalPriceCartStyle}> Total : $ {this.obtainTotalPrice()} </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const stylesListCard = StyleSheet.create({
    sectionTitleTextStyle:{ 
        textAlign: "center",
        fontSize: 16, 
        fontWeight: "bold", 
        backgroundColor: 'rgba(51, 102, 255, 1)',
        color:"white",
        borderBottomWidth:1,
        borderTopWidth:1,
        borderColor:'black'
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
        marginTop: 7,
        fontSize: 15,
    },

    singleItemContainer: {
        marginTop: 5,
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
export default ConfirmCartView
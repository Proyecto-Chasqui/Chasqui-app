import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar } from 'react-native-elements';
import GLOBAL from '../../Globals'

class ItemInfoCartView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation;
        this.serverBaseRoute = GLOBAL.BASE_URL;
    }
    normalizeText(text) {
        return encodeURI(text);
    }

    render() {
        if (this.props.shoppingCartSelected.id === null) {
            return <Text> No se selecciono ningun carrito, por favor seleccione uno desde la sección 'Ver pedidos'</Text>
        }

        return (
            <View >
                <View style={{height:Dimensions.get("window").height - 270}}>
                    <FlatList data={this.props.shoppingCartSelected.productosResponse} keyExtractor={item => item.idVariante} windowSize={15} renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => null} style={{ borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                            <View style={stylesListCard.containerList}>
                                <View style={stylesListCard.cardImageView}>
                                    <Avatar overlayContainerStyle={stylesListCard.overlayAvatarContainer} rounded size={65} source={{ uri: (this.normalizeText(this.serverBaseRoute + item.imagen)) }} renderPlaceholderContent={<ActivityIndicator size="large" color="#0000ff" />} />
                                </View>
                                <View style={{ flex: 2 }}>
                                    <View >
                                        <Text style={stylesListCard.priceStyle}>{item.cantidad} x {item.precio} = $ {item.cantidad * item.precio}</Text>
                                    </View>
                                    <View >
                                        <Text style={stylesListCard.nameTextStyle}>{item.nombre}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>

                    } />
                </View>
                <View style={{backgroundColor:'#ebedeb', height: Dimensions.get("window").height - 710, }}>
                    <View style={{marginTop:15}}>
                    <View style={stylesListCard.singleItemContainer}>
                        <Text style={stylesListCard.totalPriceCartStyle}> Total : $ {this.props.shoppingCartSelected.montoActual} </Text>
                    </View>
                    <View style={{flexDirection:'row', marginLeft:15, marginRight:15, marginTop:2}}>
                        <Button  titleStyle={{ color: 'black', }} title='Cancelar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonNotStyle}></Button>
                        <Button  titleStyle={{ color: 'white', }} title='Confirmar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonOkStyle}></Button>
                    </View>
                    </View>
                </View>
            </View>
        )
    }
}

const stylesListCard = StyleSheet.create({
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
        textAlign:'center',
        marginTop:7,
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
import React from 'react'
import { StyleSheet, View, Text, Image, ScrollView, Dimensions, Animated, ActivityIndicator, Button } from 'react-native';
import { Card, Badge, Icon } from 'react-native-elements';
import GLOBALS from '../../Globals';

class ProductCardsView extends React.Component {
    constructor(props) {
        super(props);
        this.serverBaseRoute = GLOBALS.BASE_URL;
        console.log("productos", props.products);
    }

    normalizeText(text) {
        console.log(encodeURI(text));
        return encodeURI(text);
    }

    render() {
        return (
            <ScrollView>
                <View style={stylesCards.flexView}>
                    {this.props.products.map((product, i) => {
                        return (
                            <View style={stylesCards.wiewCard} key={product.id}>
                                <Card containerStyle={stylesCards.card}>
                                    <View style={stylesCards.cardImageView}>
                                        <Image style={stylesCards.cardImage} PlaceholderContent={<ActivityIndicator />} source={{ uri: (this.normalizeText(this.serverBaseRoute + product.imagenPrincipal)) }} />
                                    </View>
                                    {product.destacado ? 
                                    (<Badge badgeStyle={stylesCards.badge} containerStyle={stylesCards.tagDestacado} 
                                        value={<Text style={stylesCards.textBadge}>Destacado</Text>} />
                                    ):(
                                        null)                                        
                                    }
                                    <View flexDirection="column">
                                        <View>
                                            <Text style={stylesCards.priceStyle}>$ {product.precio}</Text>
                                        </View>
                                        <View style={{height:50}}>
                                            <Text style={stylesCards.nameTextStyle}>{product.nombreProducto}</Text>
                                        </View>
                                        <View style={{height:50}}>
                                            <Text style={stylesCards.nameProducerTextStyle}>{product.nombreFabricante}</Text>
                                        </View>
                                        <View style={{width:"50%"}}>
                                            <Button containerStyel={stylesCards.buttonStyle} buttonStyle={stylesCards.buttonStyle} title="Agregar" />
                                        </View>
                                    </View>
                                </Card>
                            </View>
                        )
                    }
                    )}
                </View>
            </ScrollView>
        )
    }
}

const stylesCards = StyleSheet.create({
    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        marginTop: 230
    },

    errorText: {
        marginTop: 7,
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    tipErrorText: {
        marginTop: 7,
        fontSize: 16,
        alignSelf: 'center'
    },

    searchIconErrorContainer: {
        backgroundColor: "grey",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },


    flexView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 135,
        flexWrap: 'wrap',
    },

    flexViewCentered: {
        flex: 1,
        flexDirection: 'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',
    },

    viewTagsOrgAndSellStrat: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    viewBadgesTOrg: {
        width: "65%",
        position: 'relative',
        marginTop: -15,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },

    backgroundBadge: {
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginLeft: 4
    },

    viewBadgesSellStrat: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        position: 'relative',
        marginTop: -15,
        marginLeft: 5,
        marginRight: -5
    },

    badgeImage: {
        height: 30,
        width: 30,
    },

    viewTagsZonesAndSellModes: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginRight: -5
    },

    viewBadgesSellingModes: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 0,
        borderRadius: 5,
    },

    backgroundSellModeBadge: {
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        alignItems: 'flex-end',
        marginLeft: 4
    },

    viewZones: {
        position: 'relative',
        marginTop: 0,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
        width: '80%',
    },

    viewProducts: {
        position: 'relative',
        width: '104%',
        marginTop: 1,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    badge: {
        marginTop:-15,
        backgroundColor: '#00b300',
        height: 30,
        borderRadius: 5,
        borderColor:"black",
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

    badgeProductos: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },

    tagDestacado: {
        alignSelf: 'flex-start',
    },

    wiewCard: {
        width: "50%",
        backgroundColor: "black"
    },

    card: {
        height: 360,
        borderRadius: 2,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },

    cardImageView: {
        marginTop: -16,
        marginLeft: -16,
        marginRight: -16,
    },

    cardImage: {
        width: null,
        height: 150,
        resizeMode: 'cover',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2
    },

    cardText: {
        textAlign: "left",
        marginTop: 0
    },

    priceStyle: {
        fontSize: 20,
        alignSelf:'flex-start'
    },

    nameTextStyle: {
        fontSize: 13,
        alignSelf:'flex-start',
        fontWeight: "bold",
        alignContent:'center',
        alignContent:'center'
    },

    nameProducerTextStyle: {
        fontSize: 10,
        alignSelf:'flex-start'
    },

    buttonStyle: {
        backgroundColor: 'black',
        width: "50%"
    },

    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: -20,
        marginStart: -15,
        marginEnd: -13,
        marginTop: -14.5,
        marginBottom: 0,
    },
});



export default ProductCardsView;
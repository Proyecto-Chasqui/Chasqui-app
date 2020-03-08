import React from 'react'
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native';
import { Card, Badge, Icon, Image } from 'react-native-elements';
import GLOBALS from '../../Globals';
import SealsView from '../catalogViewComponents/SealsView'

class ProductCardsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.serverBaseRoute = GLOBALS.BASE_URL;
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    render() {
        if (this.props.products.length < 1) {
            return (
                <View style={stylesCards.viewSearchErrorContainer}>
                    <View style={stylesCards.viewErrorContainer}>
                        <View style={stylesCards.searchIconErrorContainer}>
                            <Icon name="search" type='font-awesome' size={50} color={"white"} containerStyle={stylesCards.searchIconError}></Icon>
                        </View>
                        <Text style={stylesCards.errorText}>
                            No se encontraron productos
                    </Text>
                        <Text style={stylesCards.tipErrorText}>
                            Revise los filtros o la busqueda
                    </Text>
                    </View>
                </View>
            );
        }

        return (
            <ScrollView>
                <View style={stylesCards.flexView}>
                    {this.props.products.map((product, i) => {
                        return (
                            <View style={stylesCards.wiewCard} key={product.id}>
                                <Card containerStyle={stylesCards.card}>
                                    <View style={stylesCards.cardImageView}>
                                        <Image style={stylesCards.cardImage} PlaceholderContent={<ActivityIndicator  size="large" color="#0000ff" />}  source={{ uri: (this.normalizeText(this.serverBaseRoute + product.imagenPrincipal)) }} />
                                    </View>
                                    {product.destacado ?
                                        (<Badge badgeStyle={stylesCards.badge} containerStyle={stylesCards.tagDestacado}
                                            value={<Text style={stylesCards.textBadge}>Destacado</Text>} />
                                        ) : (
                                            null)
                                    }
                                    <View style={{flexDirection:"column"}}>
                                        <View>
                                            <Text style={stylesCards.priceStyle}>$ {product.precio}</Text>
                                        </View>
                                        <View style={{ height: 50 }}>
                                            <Text style={stylesCards.nameTextStyle}>{product.nombreProducto}</Text>
                                        </View>
                                        <View style={{ height: 30 }}>
                                            <Text style={stylesCards.nameProducerTextStyle}>{product.nombreFabricante}</Text>
                                        </View>
                                        <SealsView sealsContainer={stylesCards.sealContainerStyle}
                                                sealsStyle={stylesCards.sealStyle}
                                                productSeals={product.medallasProducto}
                                                producerSeals={product.medallasProductor} >
                                        </SealsView>
                                        <View style={{flexDirection:"column", width: "50%",alignSelf:"flex-start" }}>
                                            <Button containerStyle={stylesCards.containerButtonStyle} buttonStyle={stylesCards.buttonStyle} title="Agregar" />
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
        marginTop: -15,
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
    },

    card: {
        height: 385,
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
        marginTop: -15,
        marginLeft: -15,
        marginRight: -15,
    },

    cardImage: {
        width: null,
        height: 150,
        marginLeft: 0,
        marginRight: 0,
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
        alignSelf: 'flex-start'
    },

    nameTextStyle: {
        fontSize: 13,
        alignSelf: 'flex-start',
        fontWeight: "bold",
        alignContent: 'center',
        alignContent: 'center'
    },

    nameProducerTextStyle: {
        fontSize: 10,
        alignSelf: 'flex-start'
    },

    sealContainerStyle:{
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height:60
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

    containerButtonStyle:{
        flexDirection:"column-reverse",
    }, 

    buttonStyle: {
        backgroundColor: 'black',
        width: "50%",
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
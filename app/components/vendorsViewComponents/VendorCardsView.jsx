import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Dimensions } from 'react-native';
import { Card, Badge, Icon } from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import GLOBALS from '../../Globals';

class VendorMultipleCardsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.vendors = props.actions.vendors;
        this.state = {
            maxTagTextLength: 32
        }
    }

    screenLowerThan(value, styleA, styleB) {
        if (Dimensions.get('window').width < value) {
            return styleB;
        }
        return styleA;
    }

    createScrollText(text, styleText) {
        return (
            <TextTicker style={styleText} loop duration={6000} marqueeDelay={3000} repeatSpacer={0} bounce={true} >{" " + text + " "}</TextTicker>
        )
    }

    cropText(text) {
        if (text.length > this.state.maxTagTextLength) {
            return text.slice(0, this.state.maxTagTextLength - 1) + "..";
        } else {
            return text;
        }
    }

    selectVendor(vendor){
        this.props.actions.vendorSelected(vendor);
        this.props.navigation.navigate('Catalogo');
        this.props.navigation.reset({
            index: 1,
            routes: [{ name: 'Catalogo' }],
          });
    }

    render() {
        let stylesCards = this.props.multipleCards ? stylesMultipleCards : stylesSingleCards;
        if (this.props.vendors.length < 1) {
            return (
                <View style={stylesSingleCards.viewSearchErrorContainer}>
                    <View style={stylesSingleCards.viewErrorContainer}>
                        <View style={stylesSingleCards.searchIconErrorContainer}>
                            <Icon name="search" type='font-awesome' size={50} color={"white"} containerStyle={stylesSingleCards.searchIconError}></Icon>
                        </View>
                        <Text style={stylesSingleCards.errorText}>
                            No se encontraron vendedores
                    </Text>
                        <Text style={stylesSingleCards.tipErrorText}>
                            Revise los filtros o la busqueda
                    </Text>
                    </View>
                </View>
            );
        }
        return (
            <ScrollView>
                <View style={stylesCards.flexView}>
                    {
                        this.props.vendors.map((u, i) => {
                            if (u.visibleEnMulticatalogo) {
                                return (
                                    <View style={stylesCards.wiewCard}  key={u.id}>
                                        <Card containerStyle={stylesCards.card}>
                                            <View style={stylesCards.cardImageView}>
                                                <Image onStartShouldSetResponder={() => this.selectVendor(u)} style={stylesCards.cardImage} source={{ uri: (this.serverBaseRoute + u.imagen) }} />
                                            </View>
                                            <View style={stylesCards.viewTagsOrgAndSellStrat}>
                                                <View style={stylesCards.viewBadgesTOrg}>
                                                    {(u.tagsTipoOrganizacion.map((tag) =>
                                                        <Badge badgeStyle={stylesCards.badge} containerStyle={stylesCards.tagOrganizacion} value={this.props.multipleCards ? this.createScrollText(tag.nombre, stylesCards.textBadge) : <Text style={stylesCards.textBadge}>{this.cropText(tag.nombre)}</Text>} />
                                                    ))}
                                                </View>
                                                <View style={stylesCards.viewBadgesSellStrat}>
                                                    {u.few.seleccionDeDireccionDelUsuario ? (<View style={stylesCards.backgroundBadge}><Image style={stylesCards.badgeImage} source={require('./badge_icons/entrega_domicilio.png')} /></View>) : null}
                                                    {u.few.puntoDeEntrega ? (<View style={stylesCards.backgroundBadge}><Image style={stylesCards.badgeImage} source={require('./badge_icons/entrega_lugar.png')} /></View>) : null}
                                                </View>
                                            </View>
                                            <Text style={stylesCards.nameTextStyle}>{u.nombre}</Text>
                                            <View style={stylesCards.viewTagsZonesAndSellModes} >
                                                <View style={stylesCards.viewZones}>
                                                    {(u.tagsZonaDeCobertura.map((tag) =>
                                                        <Badge badgeStyle={stylesCards.badgeCobertura} containerStyle={stylesCards.tagOrganizacion} value={this.props.multipleCards ? this.createScrollText(tag.nombre, stylesCards.textBadge) : <Text style={stylesCards.textBadge}>{this.cropText(tag.nombre)}</Text>} />
                                                    ))}
                                                </View>
                                                <View style={stylesCards.viewBadgesSellingModes}>
                                                    {u.few.gcc ? (<View style={stylesCards.backgroundSellModeBadge}><Image style={stylesCards.badgeImage} source={require('./badge_icons/compra_grupal.png')} /></View>) : null}
                                                    {u.few.nodos ? (<View style={stylesCards.backgroundSellModeBadge}><Image style={stylesCards.badgeImage} source={require('./badge_icons/compra_nodos.png')} /></View>) : null}
                                                    {u.few.compraIndividual ? (<View style={stylesCards.backgroundSellModeBadge} ><Image style={stylesCards.badgeImage} source={require('./badge_icons/compra_individual.png')} /></View>) : null}
                                                </View>
                                            </View>
                                            <View style={stylesCards.viewProducts}>
                                                {(u.tagsTipoProductos.map((tag) =>
                                                    <Badge badgeStyle={stylesCards.badgeProductos} containerStyle={stylesCards.tagOrganizacion} value={this.props.multipleCards ? this.createScrollText(tag.nombre, stylesCards.textBadge) : <Text style={stylesCards.textBadge} >{this.cropText(tag.nombre)}</Text>} />
                                                ))}
                                            </View>
                                        </Card>
                                    </View>
                                );
                            }
                        })
                    }
                </View>
            </ScrollView>
        );
    }
}

const stylesMultipleCards = StyleSheet.create({

    flexView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 50,
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
        alignSelf: 'flex-end'
    },

    viewBadgesSellStrat: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        position: 'relative',
        marginTop: -15,
        marginLeft: 5,
    },

    badgeImage: {
        height: 30,
        width: 30,
    },

    viewTagsZonesAndSellModes: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },

    viewBadgesSellingModes: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 0,
        marginLeft: 5,
        borderRadius: 5,
    },

    backgroundSellModeBadge: {
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        alignItems: 'flex-end',
    },

    viewZones: {
        position: 'relative',
        marginTop: 0,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
        width: '65%',
    },

    viewProducts: {
        position: 'relative',
        width: '100%',
        marginTop: 1,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 2
    },

    badge: {
        backgroundColor: '#412467',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start'
    },

    badgeCobertura: {
        backgroundColor: '#48bb78',
        height: 23,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },

    badgeProductos: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        height: 23,
        borderRadius: 5,
        alignSelf: 'flex-start'
    },

    tagOrganizacion: {
        alignSelf: 'flex-start',
    },

    nameTextStyle: {
        fontSize: 16,
        alignContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: -4,
        width: 240,
        fontWeight: "bold",
    },

    wiewCard: {
        flexDirection: "column",
        width: "50%",
    },

    card: {
        height: 370,
        marginTop: 2,
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
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
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },

    cardText: {
        textAlign: "left",
        marginTop: 0
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

const stylesSingleCards = StyleSheet.create({
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
        marginBottom: 50,
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
        backgroundColor: '#412467',
        height: 30,
        borderRadius: 5,
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

    tagOrganizacion: {
        alignSelf: 'flex-start',
    },

    nameTextStyle: {
        fontSize: 18,
        alignContent: 'center',
        marginTop: 5,
        marginBottom: 8,
        marginLeft: -4,
        width: "100%",
        fontWeight: "bold",
    },

    wiewCard: {
        width: "100%",
        borderRadius: 5,
    },

    card: {
        height: 345,
        borderRadius: 10,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
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
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },

    cardText: {
        textAlign: "left",
        marginTop: 0
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

export default VendorMultipleCardsView;
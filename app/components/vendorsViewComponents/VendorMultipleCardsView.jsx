import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Dimensions, } from 'react-native';
import { Card, Badge } from 'react-native-elements';

class VendorMultipleCardsView extends React.Component {
    constructor(props) {
        super(props);
        console.log("props multiple cards", props);
        this.vendors = props.actions.vendors;
        this.state = {
            maxTagTextLength: 16
        }
    }

    screenLowerThan(value,styleA,styleB){
        if(Dimensions.get('window').width < value){
            return styleB;
        }
        return styleA;
    }

    cropText(text){
        if(text.length > this.state.maxTagTextLength){
            return text.slice(0, this.state.maxTagTextLength -1) + "..";
        }else{
            return text;
        }
    }

    render() {
        return(
        <ScrollView>
            <View style={this.screenLowerThan(480, stylesCards.flexView, stylesCards.flexViewCentered)}>
                {
                    this.props.vendors.map((u, i) => {
                        if (u.visibleEnMulticatalogo) {
                            return (
                                <View style={stylesCards.wiewCard} key={i}>
                                    <Card containerStyle={stylesCards.card}>
                                        <Image style={stylesCards.cardImage} source={{ uri: 'http://69.61.93.71/chasqui-dev-panel/' + u.imagen }} />
                                        <View style={stylesCards.viewBadgesTOrg}>
                                            {(u.tagsTipoOrganizacion.map((tag) =>
                                                <Badge badgeStyle={stylesCards.badge} containerStyle={stylesCards.tagOrganizacion} value={<Text style={stylesCards.textBadge}>{"  " + this.cropText(tag.nombre) + "  "}</Text>} />
                                            ))}
                                        </View>
                                        <View style={stylesCards.viewBadgesSellStrat}>
                                            {u.few.seleccionDeDireccionDelUsuario ? (<View style={stylesCards.backgroundBadge}><Image style={stylesCards.badgeImage} source={require('./badge_icons/entrega_domicilio.png')} /></View>) : null}
                                            {u.few.puntoDeEntrega ? (<View style={stylesCards.backgroundBadge}><Image style={stylesCards.badgeImage} source={require('./badge_icons/entrega_lugar.png')} /></View>) : null}
                                        </View>
                                        <Text style={stylesCards.nameTextStyle}>{u.nombre}</Text>
                                        <View style={stylesCards.viewBadgesSellingModes}>
                                            {u.few.gcc ? (<View ><Image style={stylesCards.badgeImage} source={require('./badge_icons/compra_grupal.png')} /></View>) : null}
                                            {u.few.nodos ? (<View ><Image style={stylesCards.badgeImage} source={require('./badge_icons/compra_nodos.png')} /></View>) : null}
                                            {u.few.compraIndividual ? (<View ><Image style={stylesCards.badgeImage} source={require('./badge_icons/compra_individual.png')} /></View>) : null}
                                        </View>
                                        <View style={stylesCards.viewZones}>
                                            {(u.tagsZonaDeCobertura.map((tag) =>
                                                <Badge badgeStyle={stylesCards.badgeCobertura} containerStyle={stylesCards.tagOrganizacion} value={<Text style={stylesCards.textBadge}>{"  " + this.cropText(tag.nombre) + "  "}</Text>} />
                                            ))}
                                        </View>
                                        <View style={stylesCards.viewProducts}>
                                            {(u.tagsTipoProductos.map((tag) =>
                                                <Badge badgeStyle={stylesCards.badgeProductos} containerStyle={stylesCards.tagOrganizacion} value={<Text style={stylesCards.textBadge}>{"  " + this.cropText(tag.nombre) + "  "}</Text>} />
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

const stylesCards = StyleSheet.create ({
    
    flexView: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },

    flexViewCentered: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    topHeader:{
        backgroundColor:'rgba(51, 102, 255, 1)'
    },
    lowerHeaderStyle:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        height: 40,
    },  

    backgroundBadge:{
        backgroundColor:'#e5e5e5',
        borderRadius:5,
       
    },
    viewBadgesSellingModes:{
        flexDirection:'row',
        alignSelf:'flex-end',
        marginTop: 10
    },

    viewBadgesSellStrat:{
        flexDirection:'row',
        alignSelf:'flex-end',
        position:'absolute',
        marginTop: 120,
    },  

    badgeImage:{
        height: 30,
        width: 30,
    },

    viewBadgesTOrg:{
      position:'absolute',
      marginTop: 120,
      marginLeft: -5,
      flexDirection:'row',
      alignSelf:'flex-start'
    },

    viewZones:{
        position:'absolute',
        marginTop: 185,
        marginLeft: -5,
        width: 125,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
    },

    viewProducts:{
        position:'absolute',
        marginTop: 260,
        marginLeft: -5,
        width:175,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
    },

    textBadge:{
        color: "white",
        fontWeight: "bold",
    },

    badge: {
        backgroundColor:'#412467',
        height: 30,
        borderRadius:5,
        alignSelf:'flex-start'
    },

    badgeCobertura: {
        backgroundColor:'#48bb78',
        height: 23,
        borderRadius:5,
        alignSelf:'flex-start',
    },

    badgeProductos:{
        backgroundColor:'rgba(51, 102, 255, 1)',
        height: 23,
        borderRadius:5,
        alignSelf:'flex-start'
    },

    tagOrganizacion: {
       alignSelf:'flex-start',
    },

    nameTextStyle: {
        fontSize: 16,
        alignContent: 'center',
        marginTop: 16,
        marginLeft: -4,
        width: 240,
        fontWeight: "bold",
    },

    wiewCard: {
        width: 240,
        borderRadius:5,        
    },

    card:{
        height: 370,
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

    cardImage : { 
        width: 210,
        height: 150,
        resizeMode: 'cover',
        marginTop: -16,
        marginLeft: -16,
        borderTopRightRadius:10,
        borderTopLeftRadius:10
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
        marginEnd:-13,
        marginTop: -14.5,
        marginBottom: 0,
    },

    headerButton:{
        backgroundColor:'#66000000',
        marginLeft:15, 
        borderColor:"white", 
        borderWidth: 1,
        width:40,
        height:40
    },

    lowerHeaderButton:{
        backgroundColor:'#66000000',
        marginLeft:15, 
        borderColor:"grey", 
        borderLeftWidth: 1,
        borderRadius: 0,
        width:100,
        height:20,
        marginBottom: 25,
        marginLeft: -5
    },

    iconLowerHeaderButton:{
        marginRight: 15,
        color:"rgba(51, 102, 255, 1)" 
    },
    lowerHeaderButtonTitle:{
        color:"blue"
    },
    menuSelectorItems:{
        borderColor:"grey",
        borderWidth:2
    },

    searchButtonReveal:{
        alignSelf:'center', 
        width:"100%",
        color:"rgba(51, 102, 255, 1)" 
    },
});

export default VendorMultipleCardsView;
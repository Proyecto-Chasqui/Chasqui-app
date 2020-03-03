import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Dimensions, Animated } from 'react-native';
import { Card, Badge } from 'react-native-elements';
import TextTicker from 'react-native-text-ticker'

class VendorMultipleCardsView extends React.Component {
    constructor(props) {
        super(props);
        console.log("multiple cards",props.multipleCards);
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

    createScrollText(text,styleText){
        return(
            <TextTicker style={styleText} loop duration={5000} marqueeDelay={6000} repeatSpacer={0} bounce={true} >{" "+text+" "}</TextTicker>
        )
    }

    cropText(text){
        if(text.length > this.state.maxTagTextLength){
            return text.slice(0, this.state.maxTagTextLength -1) + "..";
        }else{
            return text;
        }
    }

    render() {
        let stylesCards = this.props.multipleCards ? stylesMultipleCards : stylesSingleCards;
        return(
        <ScrollView>
            <View style={stylesCards.flexView}>
                {
                    this.props.vendors.map((u, i) => {
                        if (u.visibleEnMulticatalogo) {
                            return (
                                <View style={stylesCards.wiewCard} key={i}>
                                    <Card containerStyle={stylesCards.card}>
                                        <View style={stylesCards.cardImageView}>
                                         <Image style={stylesCards.cardImage} source={{ uri: 'http://69.61.93.71/chasqui-dev-panel/' + u.imagen }} />
                                        </View>
                                        <View style={stylesCards.viewTagsOrgAndSellStrat}>                                            
                                            <View style={stylesCards.viewBadgesTOrg}> 
                                                {(u.tagsTipoOrganizacion.map((tag) =>
                                                    <Badge badgeStyle={stylesCards.badge} containerStyle={stylesCards.tagOrganizacion} value={this.createScrollText(tag.nombre,stylesCards.textBadge)} />
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
                                                    <Badge badgeStyle={stylesCards.badgeCobertura} containerStyle={stylesCards.tagOrganizacion} value={this.createScrollText(tag.nombre,stylesCards.textBadge)} />
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
                                                <Badge badgeStyle={stylesCards.badgeProductos} containerStyle={stylesCards.tagOrganizacion} value={this.createScrollText(tag.nombre,stylesCards.textBadge)} />
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

const stylesMultipleCards = StyleSheet.create ({
    
    flexView: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',        
    },

    flexViewCentered: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',
    }, 

    viewTagsOrgAndSellStrat:{
        flexDirection:'row',
        justifyContent:'space-between'
    },

    viewBadgesTOrg:{
      width:"65%",
      position:'relative',
      marginTop: -15,
      marginLeft: -5,
      flexDirection:'row',
      alignSelf:'flex-start'
    },

    backgroundBadge:{
        backgroundColor:'#e5e5e5',
        borderRadius:5,
        alignSelf:'flex-end'
    },

    viewBadgesSellStrat:{
        flexDirection:'row',
        alignSelf:'flex-end',
        position:'relative',
        marginTop: -15,
        marginLeft: 5,
    },  

    badgeImage:{
        height: 30,
        width: 30,
    },

    viewTagsZonesAndSellModes:{
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between'
    },

    viewBadgesSellingModes:{
        flexDirection:'row',
        alignSelf:'center',
        marginTop: 0,
        marginLeft: 5,
        borderRadius:5,
    },

    backgroundSellModeBadge:{
        backgroundColor:'#e5e5e5',
        borderRadius:5,
        alignItems:'flex-end',
    },

    viewZones:{
        position:'relative',
        marginTop: 0,
        marginLeft: -5,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
        width:'65%',
    },

    viewProducts:{
        position:'relative',
        width:'100%',
        marginTop: 1,
        marginLeft: -5,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
    },

    textBadge:{
        color: "white",
        fontWeight: "bold",
        marginRight: 2
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
        marginTop: 5,
        marginBottom: 5,
        marginLeft: -4,
        width: 240,
        fontWeight: "bold",
    },

    wiewCard: {
        width: "50%",
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

    cardImageView: {   
        marginTop: -16,
        marginLeft: -16,
        marginRight: -16,
    },

    cardImage : { 
        width: null,
        height: 150,
        resizeMode: 'cover',
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
});

const stylesSingleCards = StyleSheet.create ({
    
    flexView: {
        flex: 1,
        flexDirection:'row',
        marginTop: 15,
        marginBottom: 55,
        flexWrap: 'wrap',        
    },

    flexViewCentered: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',
    }, 

    viewTagsOrgAndSellStrat:{
        flexDirection:'row',
        justifyContent:'space-between'
    },

    viewBadgesTOrg:{
      width:"65%",
      position:'relative',
      marginTop: -15,
      marginLeft: -5,
      flexDirection:'row',
      alignSelf:'flex-start'
    },

    backgroundBadge:{
        backgroundColor:'#e5e5e5',
        borderRadius:5,
        alignSelf:'flex-end'
    },

    viewBadgesSellStrat:{
        flexDirection:'row',
        alignSelf:'flex-end',
        position:'relative',
        marginTop: -15,
        marginLeft: 5,
        marginRight: -5
    },  

    badgeImage:{
        height: 30,
        width: 30,
    },

    viewTagsZonesAndSellModes:{
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between',
        marginBottom: 5,
        marginRight: -5
    },

    viewBadgesSellingModes:{
        flexDirection:'row',
        alignSelf:'center',
        marginTop: 0,
        marginLeft: 5,
        borderRadius:5,
    },

    backgroundSellModeBadge:{
        backgroundColor:'#e5e5e5',
        borderRadius:5,
        alignItems:'flex-end',
    },

    viewZones:{
        position:'relative',
        marginTop: 0,
        marginLeft: -5,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
        width:'80%',
    },

    viewProducts:{
        position:'relative',
        width:'104%',
        marginTop: 1,
        marginLeft: -5,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
    },

    textBadge:{
        color: "white",
        fontWeight: "bold",
        marginRight: 2
    },

    badge: {
        backgroundColor:'#412467',
        height: 30,
        borderRadius:5,        
        alignSelf:'flex-start'
    },

    badgeCobertura: {
        backgroundColor:'#48bb78',
        height: 30,
        borderRadius:5,
        alignSelf:'flex-start',
        marginRight: 2,
        marginTop: 2
    },

    badgeProductos:{
        backgroundColor:'rgba(51, 102, 255, 1)',
        height: 30,
        borderRadius:5,
        alignSelf:'flex-start',
        marginRight: 2,
        marginTop:2
    },

    tagOrganizacion: {
       alignSelf:'flex-start',
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
        borderRadius:5,      
    },

    card:{
        height: 340,
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

    cardImage : { 
        width: null,
        height: 150,
        resizeMode: 'cover',
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
});

export default VendorMultipleCardsView;
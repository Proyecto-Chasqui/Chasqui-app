import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, Dimensions, } from 'react-native';
import { Card, Badge } from 'react-native-elements';

class VendorSingleCardView extends React.Component {
    constructor(props) {
        super(props);
        console.log("props single cards", props);
        this.vendors = props.actions.vendors;
        this.state = {
            maxTagTextLength: 32
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
            <View style={styles.flexViewCentered}>
            {
                this.props.vendors.map((u, i) => {
                    if(u.visibleEnMulticatalogo){
                    return (
                        <View style={styles.wiewCard}  key={i}>
                            <Card containerStyle ={styles.card}>
                                <Image style={styles.cardImage} source={{ uri: 'http://69.61.93.71/chasqui-dev-panel/' + u.imagen}}/>      
                                    <View style={styles.viewBadgesTOrg}>
                                        {(u.tagsTipoOrganizacion.map((tag) =>
                                            <Badge badgeStyle={styles.badge} containerStyle={styles.tagOrganizacion} value={<Text style={styles.textBadge}>{"  "+this.cropText(tag.nombre)+"  "}</Text>} />
                                        ))}                                
                                    </View>
                                    <View style={styles.viewBadgesSellStrat}>
                                        {u.few.seleccionDeDireccionDelUsuario ? (<View style={styles.backgroundBadge}><Image style={styles.badgeImage} source={require('./badge_icons/entrega_domicilio.png')} /></View>):null}
                                        {u.few.puntoDeEntrega  ? (<View style={styles.backgroundBadge}><Image style={styles.badgeImage} source={require('./badge_icons/entrega_lugar.png')} /></View>):null}
                                    </View>    
                                <Text style={styles.nameTextStyle}>{u.nombre}</Text>
                                     <View style={styles.viewBadgesSellingModes}>
                                        {u.few.gcc  ? (<View style={styles.backgroundBadge}><Image style={styles.badgeImage} source={require('./badge_icons/compra_grupal.png')} /></View>) : null}
                                        {u.few.nodos  ? (<View style={styles.backgroundBadge}><Image style={styles.badgeImage} source={require('./badge_icons/compra_nodos.png')} /></View>) : null}
                                        {u.few.compraIndividual  ? (<View style={styles.backgroundBadge}><Image style={styles.badgeImage} source={require('./badge_icons/compra_individual.png')} /></View>) : null} 
                                    </View>                                  
                                <View style={styles.viewZones}>
                                        {(u.tagsZonaDeCobertura.map((tag) =>
                                            <Badge badgeStyle={styles.badgeCobertura} containerStyle={styles.tagOrganizacion} value={<Text style={styles.textBadge}>{"  "+this.cropText(tag.nombre)+"  "}</Text>} />
                                        ))}                          
                                </View>                                
                                <View style={styles.viewProducts}>
                                        {(u.tagsTipoProductos.map((tag) =>
                                            <Badge badgeStyle={styles.badgeProductos} containerStyle={styles.tagOrganizacion} value={<Text style={styles.textBadge}>{"  "+this.cropText(tag.nombre)+"  "}</Text>} />
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

const styles = StyleSheet.create ({
    
    flexView: {
        flex: 1,
        flexDirection:'row',
        marginTop: 0,
        marginBottom: 60,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },

    flexViewCentered: {
        flex: 1,
        flexDirection:'row',
        marginTop: 0,
        marginBottom: 60,
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
        height: 35,
    },  

    backgroundBadge:{
        backgroundColor:'#e5e5e5',
        borderRadius:5,
        marginLeft: 5
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
        marginTop: 130,
    },  

    badgeImage:{
        height: 30,
        width: 30,
                
    },

    viewBadgesTOrg:{
      position:'absolute',
      marginTop: 130,
      flexDirection:'row',
      alignSelf:'flex-start'
    },

    viewZones:{
        position:'absolute',
        marginTop: 202,
        width: 300,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
    },

    viewProducts:{
        position:'absolute',
        marginTop: 262,
        width:Dimensions.get('window').width - 30,
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
        height: 30,
        borderRadius:5,
        alignSelf:'flex-start',
    },

    badgeProductos:{
        backgroundColor:'rgba(51, 102, 255, 1)',
        height: 28,
        borderRadius:5,
        alignSelf:'flex-start'
    },

    tagOrganizacion: {
       alignSelf:'flex-start',
       marginRight: 3
    },

    nameTextStyle: {
        fontSize: 20,
        alignContent: 'center',
        marginTop: 20,
        width: Dimensions.get('window').width - 30,
        fontWeight: "bold",
    },

    wiewCard: {
        width: Dimensions.get('window').width,
        borderRadius:5,        
    },

    card:{
        height: 350,
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
        width: Dimensions.get('window').width - 30,
        height: 160,
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
        color:"rgba(51, 102, 255, 1)"
    },

    overlayContainer:{
        alignSelf:'flex-start',
        
    },
    overlay:{
        alignSelf:'flex-end',
        marginTop: 35,
        width:Dimensions.get('window').width /1.5,
    },
    menuSelectorItems:{
        backgroundColor:"#f4f4f4",
        borderWidth:1,
        borderColor: "#f4f4f4",
        height: 300,
    },
    searchButtonReveal:{
        alignSelf:'center', 
        width:"100%",
        borderColor:"rgba(51, 102, 255, 1)" 
    },
    titleButtonReveal:{
        color:"black"
    },
    searchButtonResetTitle:{
        color:"rgba(51, 102, 255, 1)"
    },
    searchButtonReset:{        
        borderColor:"rgba(0, 0, 0, 0)" 
    },
});

export default VendorSingleCardView;
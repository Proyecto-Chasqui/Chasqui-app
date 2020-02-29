import React from 'react';
import { StyleSheet, View, Text, Alert, Image, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { Card, Badge } from 'react-native-elements';
import LoadingView from '../components/LoadingView';
import {Header, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

class VendorsView extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.vendors = props.actions.vendors;
 
        this.state = {
            isLoading: true,
          };      
    }    
    
    cropText(text){
        if(text.length > 32){
            return text.slice(0, 31) + "..";
        }else{
            return text;
        }
    }

    componentWillMount() {
        this.getVendors(this.props);  
    }

    screenLowerThan(value,styleA,styleB){
        console.log("dimension", Dimensions.get('window').width);
        if(Dimensions.get('window').width < value){
            return styleB;
        }
        return styleA;
    }

    getVendors(props){
        axios.get('http://69.61.93.71/chasqui-dev-panel/rest/client/vendedor/all')
        .then(res => {
           this.vendors(res.data);
           console.log("vendedores",res.data);
           this.setState({
                isLoading: false
            });
        }).catch(function (error) {

            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los vendedores, vuelva a intentar mas tarde.',
                [                  
                  {text: 'Entendido', onPress: () =>  props.actions.logout()},
                ],
                {cancelable: false},
              );
        });
    }
    

    render() {
        
        if (this.state.isLoading) {
            return <LoadingView></LoadingView>;
        }
        
        return(
        <View style={{marginBottom:75}}>    
            <Header>
            <Button
                icon={
                <Icon name="bars" size={20} color="white"/>
                }
                buttonStyle={styles.headerButton}
                onPress={() => this.props.navigation.openDrawer()}
            />
            <Image
            style={{ width: 50, height: 50, alignSelf:'center', resizeMode:'contain'}}
            source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
            />
            <Button
                icon={
                <Icon name="truck" size={20} color="white"/>
                }
                buttonStyle={styles.headerButton}
                onPress={() => this.props.navigation.openDrawer()}
            />
            </Header>
          
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
        </View>
        );        
    }    
}



const stylesSoloCard = StyleSheet.create ({
    
    flexView: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 50,
        flexWrap: 'wrap',
        justifyContent: 'center'
    },

    flexViewCentered: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 10,
        flexWrap: 'wrap',
        justifyContent: 'center'
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
        marginTop: 160,
    },  

    badgeImage:{
        height: 30,
        width: 30,
                
    },

    viewBadgesTOrg:{
      position:'absolute',
      marginTop: 160,
      flexDirection:'row',
      alignSelf:'flex-start'
    },

    viewZones:{
        position:'absolute',
        marginTop: 230,
        width: 300,
        flexDirection:'row',
        alignSelf:'flex-start',
        flexWrap: 'wrap',
    },

    viewProducts:{
        position:'absolute',
        marginTop: 292,
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
        height: 370,
        borderRadius: 10,
    },

    cardImage : { 
        width: Dimensions.get('window').width - 30,
        height: 190,
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
});

const stylesCards = StyleSheet.create ({
    
    flexView: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 10,
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },

    flexViewCentered: {
        flex: 1,
        flexDirection:'row',
        marginTop: -9,
        marginBottom: 10,
        flexWrap: 'wrap',
        justifyContent: 'center'
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
    }
});

const styles = stylesSoloCard;


export default VendorsView;
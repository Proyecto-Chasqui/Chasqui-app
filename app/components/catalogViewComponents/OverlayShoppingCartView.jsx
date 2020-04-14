import React from 'react'
import { StyleSheet, Dimensions, View, Text, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon, Overlay, CheckBox, Image, Header } from 'react-native-elements';
import ItemInfoCartView from '../../containers/CatalogComponentsContainers/ItemInfoCart';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView';
import GLOBAL from '../../Globals';
import axios from 'axios';

class OverlayShoppingCartView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.shoppingCarts = this.props.shoppingCarts;
        this.serverBaseRoute = GLOBAL.BASE_URL;
        this.shoppingCartSelected = this.props.actions.shoppingCartSelected;
        this.shoppingCarts = this.props.actions.shoppingCarts;
        this.vendorSelected = this.props.vendorSelected
        this.state = {
            showShoppingCarts: false,
            shoppingCartTypeSelected: 'Ver pedidos',
            getShoppingCarts: false,
            showWaitSign:false,
            guest: this.props.user.id === 0,
        }
    }

    showShoppingCarts() {
        this.setState({ showShoppingCarts: !this.state.showShoppingCarts })
        if (this.state.showShoppingCarts) {
            this.setState({ shoppingCartTypeSelected: 'Ver pedidos' })
        } else {
            this.setState({ shoppingCartTypeSelected: 'Seleccione un pedido' })
        }
    }

    alertOpenCart(){
        Alert.alert(
            'Aviso',
            '¿Seguro que desea abrir un pedido Individual?',
            [
                { text: 'Si', onPress: () => this.openCart() },
                { text: 'No', onPress: () => null},
            ],
            { cancelable: false },
        );
    }

    getShoppingCarts(){
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'),{
            idVendedor: this.props.vendorSelected.id,
            estados: [
              "ABIERTO"
            ]
          }).then(res => {
            this.shoppingCarts(res.data);
            this.setState({showWaitSign:false});
            this.showShoppingCarts();
        }).catch((error) =>{
            console.log(error);
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los pedidos del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    openCart(){
        this.setState({showWaitSign:true})
        axios.post((this.serverBaseRoute + 'rest/user/pedido/obtenerIndividual'),{
            idVendedor: this.props.vendorSelected.id
        }).then(res => {
            this.shoppingCartSelected(res.data);
            this.getShoppingCarts();
        }).catch((error) => {
            this.setState({showWaitSign:false})
            console.log("error", error);
            Alert.alert(
                'Error',
                'Ocurrio un error al crear el pedido, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    selectCart(cart){
        this.shoppingCartSelected(cart);
        this.showShoppingCarts();
    }

    validCatalog(){
        console.log("VALID")
        if(this.vendorSelected.few.compraIndividual !== undefined){
            return this.vendorSelected.few.compraIndividual
        }else{
            return false
        }
    }

    render() {

        return (
           
            <Overlay containerStyle={styles.overlayContainer}
                overlayStyle={styles.overlay}
                windowBackgroundColor="rgba(0, 0, 0, 0.3)"
                onBackdropPress={() => this.props.showFilter()} isVisible={this.props.isVisible}
                animationType="fade"
            >
                 <View style={styles.topHeader}>
                    <View style={styles.containerIconStyle}>
                        <Icon iconStyle={styles.shoppingCartIcon} name="shopping-cart" size={30} color="white" type='font-awesome' />
                    </View>
                    <Text style={styles.title}>PEDIDOS</Text>
                </View>

                <View style={styles.selectorContainer}>
                    <Button disabled={this.state.guest} titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title={this.state.shoppingCartTypeSelected}
                        onPress={() => this.showShoppingCarts()} icon=
                        {this.state.showShoppingCarts ? (<Icon containerStyle={styles.iconContainer} iconStyle={styles.iconRevealButton} name="caret-up" size={20} color={'black'} type='font-awesome' />
                        ) :
                            (<Icon containerStyle={styles.iconContainer} iconStyle={styles.iconRevealButton} name="caret-down" size={20} color={'black'} type='font-awesome' />
                            )
                        } iconRight />
                </View>
                <View style={styles.divisor}></View>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText="Comunicandose con el servidor..."></LoadingOverlayView>
                

                {this.state.showShoppingCarts ?

                    <View>
                        {this.validCatalog() ? (
                        <ScrollView>
                        {this.props.shoppingCarts.length > 0 ? (
                                this.props.shoppingCarts.map((cart, i) => {
                                    return (
                                    <View style={styles.selectorContainer}>
                                        <View style={{flex:1, justifyContent:"center", borderColor:"#D8D8D8", borderWidth:2, borderBottomWidth:0, borderTopRightRadius:5, borderTopLeftRadius:5, marginLeft:-2, marginRight:-2, marginTop:-2, alignItems:'center', flexDirection:"row", backgroundColor:'rgba(51, 102, 255, 1)'}}>
                                            <Text style={{fontWeight:'bold', color:"white", fontSize:15, marginRight:20, }}> Pedido {cart.idGrupo==null?('Individual'):('Colectivo')}</Text>
                                            <View style={{backgroundColor:"white", borderColor:"black", borderRadius:5, borderWidth:1, margin:4}}>
                                                <Image style={styles.badgeImage} source={require('../vendorsViewComponents/badge_icons/compra_individual.png')} />
                                            </View>
                                        </View>
                                        <View style={{margin:5}}>
                                        <Text style={{textAlign:"center"}}> Total: ${(cart.montoActual).toFixed(2)} </Text>                                      
                                        <Text style={{textAlign:"center"}}> Creado el: {cart.fechaCreacion} </Text>
                                        </View>
                                        <View style={{margin:5}}>
                                            { this.props.shoppingCartSelected.id === cart.id ?
                                            (null):
                                            (<Button onPress={()=>this.selectCart(cart)} title="Seleccionar" titleStyle={{ color: 'white', }}  containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonOkStyle}></Button>)                                                                                 
                                            }
                                        </View>
                                         </View>
                                    )
                                }) 
                        ):( 
                        <View style={styles.selectorContainer}>    
                        <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Abrir Pedido Individual"
                        onPress={() => this.alertOpenCart()} icon={
                            <Image style={styles.badgeImage} source={require('../vendorsViewComponents/badge_icons/compra_individual.png')} />
                        } 
                         iconRight />
                         </View>
                         )
                        }
                        </ScrollView>
                        ):( <View style={styles.viewErrorContainer}>
                            <View style={styles.searchIconErrorContainer}>
                                <Icon name="exclamation" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                            </View>
                            <Text style={styles.errorText}>
                                Catálogo no soportado
                            </Text>
                            <Text style={styles.tipErrorText}>
                                El catálogo no opera con pedidos <Text style={{ fontWeight: 'bold' }}>Individuales</Text>
                            </Text>
                        </View>)}
                    </View>

                    :
                    (
                        <View style={{ marginLeft: -9, marginRight:-9}}>

                                    <ItemInfoCartView  functionShow={()=>this.props.showFilter()}  navigation = {this.props.navigation}></ItemInfoCartView>

                        </View>
                    )
                }

            </Overlay>
        );
    }
}

const styles = StyleSheet.create({

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

    badgeImage: {
        height: 30,
        width: 30,
    },

    selectorContainer: {
        borderWidth: 2,
        borderRadius: 3,
        margin: 10,
        borderColor: '#D8D8D8',
    },

    titleButtonReveal: {
        flex: 1,
        color: "black",
        alignSelf: 'center',
    },

    iconRevealButton: {
        alignSelf: 'flex-end',
        color: "#D7DF01",
    },

    iconContainer: {
    },

    overlayContainer: {
        
    },

    containerIconStyle: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 3,
    },

    shoppingCartIcon: {
        marginTop: 2,
        marginLeft: 3,
        marginRight: 7,
        marginBottom: 3,
    },

    title: {
        fontSize: 18,
        color: "white",
        marginLeft: 30,
        marginRight: 30
    },

    topHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(51, 102, 255, 1)',
        marginLeft: -10,
        marginRight: -10,
        height: 58,
    },

    overlay: {
        alignSelf: "flex-end",
        width: Dimensions.get("window").width - 100,
        height: Dimensions.get("window").height,

    },

    scrollViewFilters: {
        marginLeft: -10,
        marginRight: -10,
    },

    menuSelectorItems: {
        backgroundColor: null,
        borderTopWidth: 2,
        borderTopColor: "#f4f4f4",
        width: "100%",
    },

    divisor: {
        borderTopWidth: 2,
        borderTopColor: "#D8D8D8",
        marginLeft: -9,
        width: "107%"
    },

    buttonAndIconContainer: {
        flexDirection: "row",
        width: "104%",
        alignSelf: 'flex-end',
    },

    searchButtonReveal: {
        alignSelf: 'center',
    },

    searchContainerButtonReveal: {
        flexDirection: "row",
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
    },

})

export default OverlayShoppingCartView;
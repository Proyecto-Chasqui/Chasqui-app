import React from 'react'
import { StyleSheet, Dimensions, View, Text, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon, Overlay, CheckBox, Image, Header } from 'react-native-elements';
import ItemInfoCartView from '../../containers/CatalogComponentsContainers/ItemInfoCart';


class OverlayShoppingCartView extends React.PureComponent {
    constructor(props) {
        super(props);
        console.log("carts", this.props)
        this.shoppingCarts = this.props.shoppingCarts;
        this.shoppingCartSelected = this.props.actions.shoppingCartSelected;
        this.state = {
            showShoppingCarts: false,
            shoppingCartTypeSelected: 'Ver pedidos',
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
                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title={this.state.shoppingCartTypeSelected}
                        onPress={() => this.showShoppingCarts()} icon=
                        {this.state.showShoppingCarts ? (<Icon containerStyle={styles.iconContainer} iconStyle={styles.iconRevealButton} name="caret-up" size={20} color={'black'} type='font-awesome' />
                        ) :
                            (<Icon containerStyle={styles.iconContainer} iconStyle={styles.iconRevealButton} name="caret-down" size={20} color={'black'} type='font-awesome' />
                            )
                        } iconRight />
                </View>
                <View style={styles.divisor}></View>


                {this.state.showShoppingCarts ?

                    <View>
                        <ScrollView>
                        {this.props.shoppingCarts.length > 0 ? (
                                this.props.shoppingCarts.map((cart, i) => {
                                    return (
                                    <View style={styles.selectorContainer}>
                                        <View style={{alignSelf:'center', alignItems:'center', flexDirection:"row"}}>
                                        <Text style={{fontWeight:'bold', fontSize:15, marginRight:20}}> Pedido {cart.idGrupo==null?('Individual'):('Colectivo')}</Text>
                                        <Image style={styles.badgeImage} source={require('../vendorsViewComponents/badge_icons/compra_individual.png')} />
                                        </View>
                                        <Text> Total: ${cart.montoActual} </Text>                                      
                                        <Text> Creado el: {cart.fechaCreacion} </Text>
                                        { this.props.shoppingCartSelected.id === cart.id ?
                                        (null):
                                        (<Button onPress={()=>this.shoppingCartSelected(cart)}title="Seleccionar"></Button>)                                                                                 
                                        }
                                         </View>
                                    )
                                }) 
                        ):( 
                        <View style={styles.selectorContainer}>    
                        <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Individual"
                        onPress={() => null} icon={
                                                    <Icon containerStyle={styles.iconContainer}
                                                    iconStyle={styles.iconRevealButton} 
                                                    name="caret-down" size={20} 
                                                    color={'black'} 
                                                    type='font-awesome' />
                        } 
                         iconRight />
                         </View>
                         )
                        }
                        </ScrollView>
                    </View>

                    :
                    (
                        <View style={{ marginLeft: -9, marginRight:-9}}>
                            {this.props.shoppingCartSelected.id ? (
                                <ScrollView>
                                    <ItemInfoCartView  navigation = {this.props.navigation}></ItemInfoCartView>
                                </ScrollView>) : (<Text>Seleccione un carrito</Text>)
                            }
                        </View>
                    )
                }

            </Overlay>
        );
    }
}

const styles = StyleSheet.create({
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
        alignSelf: 'flex-end',
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
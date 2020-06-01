import React from 'react'
import { StyleSheet, Dimensions, View, Text, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon, Overlay, CheckBox, Image, Header } from 'react-native-elements';
import ItemInfoCartView from '../../containers/CatalogComponentsContainers/ItemInfoCart';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView';
import ButtonOpenIndividualCart from '../../containers/CatalogComponentsContainers/OverlayShoppingCartComponentsContainers/ButtonOpenIndividualCart'
import ButtonOpenGroupCart from '../../containers/CatalogComponentsContainers/OverlayShoppingCartComponentsContainers/ButtonOpenGroupCart'
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
            showWaitSign: false,
            guest: this.props.user.id === 0,
        }
    }

    defineStrategyRoute(){
        let value = ''
        if(this.props.vendorSelected.few.gcc){
            value = 'rest/user/gcc/'
        }
        if(this.props.vendorSelected.few.nodos){
            value = 'rest/user/nodo/'
        }
        return value
    }

    showShoppingCarts() {
        this.setState({ showShoppingCarts: !this.state.showShoppingCarts })
        if (this.state.showShoppingCarts) {
            this.setState({ shoppingCartTypeSelected: 'Ver pedidos' })
        } else {
            this.setState({ shoppingCartTypeSelected: 'Seleccione un pedido' })
        }
    }

    alertOpenCart() {
        Alert.alert(
            'Aviso',
            '¿Seguro que desea abrir un pedido individual?',
            [
                { text: 'Si', onPress: () => this.openCart() },
                { text: 'No', onPress: () => null },
            ],
            { cancelable: false },
        );
    }

    alertOpenGroupCart(group) {
        Alert.alert(
            'Aviso',
            '¿Seguro que desea abrir un pedido para el grupo ' + group.alias + '?',
            [
                { text: 'Si', onPress: () => this.openCartOnGroup(group) },
                { text: 'No', onPress: () => null },
            ],
            { cancelable: false },
        );
    }

    openCartOnGroup(group) {
        this.setState({ showWaitSign: true })
        axios.post((this.serverBaseRoute + this.defineStrategyRoute()+ 'individual'), {
            idGrupo: group.id,
            idVendedor: this.props.vendorSelected.id
        }, { withCredentials: true }).then(res => {
            this.shoppingCartSelected(res.data);
            this.getShoppingCarts();
        }).catch((error) => {
            this.setState({ showWaitSign: false })
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            console.log(error.config);
            Alert.alert(
                'Error',
                'Ocurrio un error al crear el pedido para el grupo, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
        });
    }

    getShoppingCarts() {
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "ABIERTO"
            ]
        }, { withCredentials: true }).then(res => {
            this.shoppingCarts(res.data);
            this.setState({ showWaitSign: false });
            this.showShoppingCarts();
        }).catch((error) => {
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

    openCart() {
        this.setState({ showWaitSign: true })
        axios.post((this.serverBaseRoute + 'rest/user/pedido/obtenerIndividual'), {
            idVendedor: this.props.vendorSelected.id
        }, { withCredentials: true }).then(res => {
            this.shoppingCartSelected(res.data);
            this.getShoppingCarts();
        }).catch((error) => {
            this.setState({ showWaitSign: false })
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

    selectCartById(id) {
        this.props.shoppingCarts.map((vcart, i) => {
            if (vcart.id === id) {
                this.shoppingCartSelected(vcart);
                this.showShoppingCarts();
            }
        })
    }

    selectCart(cart) {
        this.shoppingCartSelected(cart);
        this.showShoppingCarts();
    }

    validCatalog() {
        return true;
        if (this.vendorSelected.few.compraIndividual !== undefined) {
            return this.vendorSelected.few.compraIndividual
        } else {
            return false
        }
    }

    canShowCartBasedOnVendorState(cart) {
        if (!this.props.vendorSelected.ventasHabilitadas) {
            return (cart.estado === "ABIERTO")
        } else {
            return true
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
                        <Icon iconStyle={styles.shoppingCartIcon} name="shopping-cart" size={20} color="white" type='font-awesome' />
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

                    <View style={{ flex: 1 }}>

                        {this.validCatalog() ? (
                            <ScrollView style={{ flex: 1 }}>
                                {(!this.props.vendorSelected.ventasHabilitadas) ? (
                                    <View style={styles.selectorContainer}>
                                        <Text style={{ marginTop: 5, marginLeft: 5, marginRight: 5, fontSize: 16, fontStyle: 'italic', textAlign: "center", fontWeight: "bold" }}>Las ventas estan deshabilitadas</Text>
                                        <Text style={{ marginBottom: 5, marginLeft: 5, marginRight: 5, fontStyle: 'italic', textAlign: "justify" }}>Por el momento no podrá abrir nuevos pedidos, pero podra gestionar los pedidos abiertos existentes</Text>
                                    </View>
                                ) : (null)}
                                <ButtonOpenIndividualCart selectCart={(id) => this.selectCartById(id)} actionFunction={() => this.alertOpenCart()}></ButtonOpenIndividualCart>
                                {this.props.groupsData.map((group, i) => {
                                    return (
                                        <ButtonOpenGroupCart group={group} selectCart={(id) => this.selectCartById(id)} actionFunction={() => this.alertOpenGroupCart(group)}></ButtonOpenGroupCart>
                                    )
                                })}
                            </ScrollView>
                        ) : (<View style={styles.viewErrorContainer}>
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
                        <View style={{ marginLeft: -9, marginRight: -9 }}>

                            <ItemInfoCartView functionShow={() => this.props.showFilter()} navigation={this.props.navigation}></ItemInfoCartView>

                        </View>
                    )
                }

            </Overlay>
        );
    }
}

const styles = StyleSheet.create({
    titleButtonNewCartReveal: {
        color: "white"
    },
    buttonNewCartButton: {
        backgroundColor: 'rgba(51, 102, 255, 1)'
    },
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
        flex:1,
        justifyContent:"center"
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
        alignSelf: 'center',
        borderWidth:2,
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
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 3,
        height:40,
        width:40,
        justifyContent:"center"
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
        marginTop: -12,
        height: 58,
    },

    overlay: {
        alignSelf: "flex-end",
        width: Dimensions.get("window").width - 50,
        height: Dimensions.get("window").height,

        flex: 1,
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
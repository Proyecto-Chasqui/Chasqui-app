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

        this.state = {
            showShoppingCarts: false,
            shoppingCartTypeSelected: 'Ver pedidos',
            getShoppingCarts: false,
            showWaitSign: false,
            guest: this.props.user.id === 0,
            vendorSelected: this.props.vendorSelected
        }
    }

    defineStrategyRoute() {
        let value = ''
        if (this.props.vendorSelected.few.gcc) {
            value = 'rest/user/gcc/'
        }
        if (this.props.vendorSelected.few.nodos) {
            value = 'rest/user/nodo/'
        }
        return value
    }

    componentDidUpdate() {
        if (this.props.hasReceivedPushNotifications) {
            this.forceUpdate();
            this.props.actions.hasReceivedPushNotifications(false)
        }
        if (this.props.resetState.reset) {
            this.setState({ vendorSelected: this.props.vendorSelected })
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

    alertOpenCart() {
        Alert.alert(
            'Aviso',
            '¿Seguro que desea abrir un pedido individual?',
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.openCart() },
            ],
            { cancelable: false },
        );
    }

    defineTypeGroup() {
        if (this.props.vendorSelected.few.gcc) {
            return "grupo"
        } else {
            return "nodo"
        }
    }

    errorAlert(error) {
        if (error.response) {
            if (error.response.status === 401) {
                Alert.alert(
                    'Sesion expirada',
                    'Su sesión expiro, se va a reiniciar la aplicación.',
                    [
                        { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            } else {
                if (error.response.data !== null) {
                    Alert.alert(
                        'Error',
                        error.response.data.error,
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                } else {
                    Alert.alert(
                        'Error',
                        'Ocurrió un error inesperado, sera reenviado a los catalogos. Si el problema persiste comuníquese con soporte técnico.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            }
        } else if (error.request) {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false });
        } else {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde.",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false });
        }
    }

    alertOpenGroupCart(group) {
        Alert.alert(
            'Aviso',
            '¿Seguro que desea abrir un pedido para el ' + this.defineTypeGroup() + ' ' + group.alias + '?',
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.openCartOnGroup(group) },
            ],
            { cancelable: false },
        );
    }

    openCartOnGroup(group) {
        this.setState({ showWaitSign: true })
        axios.post((this.serverBaseRoute + this.defineStrategyRoute() + 'individual'), {
            idGrupo: group.id,
            idVendedor: this.props.vendorSelected.id
        }, { withCredentials: true }).then(res => {
            this.shoppingCartSelected(res.data);
            this.getShoppingCarts();
        }).catch((error) => {
            this.setState({ showWaitSign: false })
            this.errorAlert(error)
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
            this.errorAlert(error)
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
            this.errorAlert(error)
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

    vendorHasAtLeastOneModeOfSelling() {
        return this.state.vendorSelected.few.gcc || this.state.vendorSelected.few.nodos || this.state.vendorSelected.few.compraIndividual
    }

    validCatalog() {
        return this.vendorHasAtLeastOneModeOfSelling();
    }

    canShowCartBasedOnVendorState(cart) {
        if (!this.props.vendorSelected.ventasHabilitadas) {
            return (cart.estado === "ABIERTO")
        } else {
            return true
        }

    }

    defineButtonTitle() {
        if (this.state.vendorSelected.few.gcc) {
            return "Ingrese a Mis grupos"
        } else {
            return "Ingrese a Mis nodos"
        }
    }

    goToGroups(){
        this.props.showFilter()
        this.props.navigation.navigate("MisGrupos")
    }

    render() {

        return (

            <Overlay containerStyle={styles.overlayContainer}
                overlayStyle={styles.overlay}
                windowBackgroundColor="rgba(0, 0, 0, 0.3)"
                onBackdropPress={() => this.props.showFilter()} isVisible={this.props.isVisible}
                animationType="fade"
            >
                <View style={{ flex: 1 }}>
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
                                            <ButtonOpenGroupCart key={group.id} group={group} selectCart={(id) => this.selectCartById(id)} actionFunction={() => this.alertOpenGroupCart(group)}></ButtonOpenGroupCart>
                                        )
                                    })}
                                    {this.state.vendorSelected.few.gcc || this.state.vendorSelected.few.nodos ? (
                                        <View style={{flex:1, margin: 10}}>
                                            {this.props.groupsData.length === 0 ?
                                                (
                                                    <View style={{ flex: 1, width:"100%",borderWidth: 2, borderRadius: 3, borderColor: '#D8D8D8', flexDirection: "column", alignSelf: "center" }}>
                                                        <View style={{ marginTop: 15, marginBottom: 15, alignSelf: "center" }}>
                                                            <View style={styles.viewErrorContainer}>

                                                                <View style={styles.searchIconErrorContainer}>
                                                                    <Icon name="users" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                                                </View>
                                                                <Text style={styles.errorText}>
                                                                    No pertenece a ningun {this.state.vendorSelected.few.gcc ? ("grupo") : ("nodo")}
                                                                </Text>
                                                                <Text style={styles.errorText2}>
                                                                    Para comenzar a comprar en un {this.state.vendorSelected.few.gcc ? ("grupo") : ("nodo")}
                                                                </Text>
                                                                <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                                                    <Button
                                                                        title={this.defineButtonTitle()}
                                                                        buttonStyle={styles.buttonTipErrorText2}
                                                                        onPress={() => this.goToGroups()}
                                                                        type="solid"
                                                                    />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                                :
                                                (null)}
                                        </View>
                                    ) : (null)}
                                </ScrollView>
                            ) : (<View style={styles.viewErrorContainer}>
                                <View style={styles.searchIconErrorContainer}>
                                    <Icon name="exclamation" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                </View>
                                <Text style={styles.errorText}>
                                    Catálogo sin modos de venta
                            </Text>
                                <Text style={styles.tipErrorText}>
                                    El catálogo no esta <Text style={{ fontWeight: 'bold' }}>configurado</Text> para la venta
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
                </View>
            </Overlay>
        );
    }
}

const styles = StyleSheet.create({
    titleButtonNewCartReveal: {
        color: "white"
    },
    buttonNewCartButton: {
        backgroundColor: '#00adee'
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
        flex: 1,
        justifyContent: "center"
    },

    errorText: {
        marginTop: 25,
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    errorText2: {
        marginTop: 5,
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    buttonTipErrorText: {
        marginTop: 25,
        alignSelf: 'center'
    },

    
    buttonTipErrorText2: {
        marginTop: 10,
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
        borderWidth: 2,
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
        color: "#00adee",
    },

    iconContainer: {
    },

    overlayContainer: {
    },

    containerIconStyle: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 3,
        height: 40,
        width: 40,
        justifyContent: "center"
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
        backgroundColor: '#909090',
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
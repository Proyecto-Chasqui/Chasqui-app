import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar } from 'react-native-elements';
import GLOBAL from '../../Globals';
import axios from 'axios';
import LoadingOverlayView from '../generalComponents/LoadingOverlayView'
import ProductItemView from '../../containers/ConfirmShoppingCartContainers/ProductItem'

class ItemInfoCartView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation;
        this.serverBaseRoute = GLOBAL.BASE_URL;
        this.shoppingCarts = this.props.actions.shoppingCarts;
        this.state = {
            showWaitSign: false,
            guest: this.props.user.id === 0,
            validCart: false,
        }
    }
    normalizeText(text) {
        return encodeURI(text);
    }

    cancelCartAlert() {
        Alert.alert(
            'Pregunta',
            '¿Esta seguro de cancelar su pedido?',
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.cancelCart() },

            ],
            { cancelable: false },
        );
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

    getGroups() {
        axios.get((this.serverBaseRoute + this.defineStrategyRoute() + 'all/' + this.props.vendorSelected.id), {}, { withCredentials: true }).then(res => {
            this.props.actions.groupsData(res.data);
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                Alert.alert(
                    'Error Grupos',
                    error.response.data.error,
                    [
                        { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.");
            }
        });
    }

    showAlertInvalidCart() {
        Alert.alert(
            'Aviso',
            'Debe agregar al menos un producto para confirmar',
            [
                { text: 'Entendido', onPress: () => null },

            ],
            { cancelable: false },
        );
    }

    showAlert(text) {
        Alert.alert(
            'Aviso',
            text,
            [
                { text: 'Entendido', onPress: () => null },

            ],
            { cancelable: false },
        );
    }

    goToProduct(idVariante) {
        this.props.allProducts.map((product) => {
            if (product.idProducto === idVariante) {
                this.props.actions.productSelected(product);
            }
        })
        this.goProduct();
        this.props.functionShow();
    }

    goProduct() {
        this.navigation.navigate("Producto");
    }

    goToRegister() {
        this.props.actions.logout();
    }

    detectAlert(alertText){
        if(this.props.shoppingCartSelected.idGrupo !== null){
            if(this.isAdminOfGroup()){
                Alert.alert(
                    'Aviso',
                    alertText,
                    [
                        { text: this.defineSection(), onPress: ()=> this.navigation.navigate("MisGrupos")},
                        { text: 'Entendido', onPress: () => null },
                    ],
                    { cancelable: false },
                );
            }else{
                Alert.alert(
                    'Aviso',
                    alertText,
                    [
                        { text: 'Entendido', onPress: () => null },
                    ],
                    { cancelable: false },
                );
            }
        }else{
            this.showAlert(alertText)
        }
        this.props.functionShow();
        this.props.actions.shoppingCartUnselected();
    }

    getShoppingCarts(alertText) {
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "ABIERTO"
            ]
        }, { withCredentials: true }).then(res => {
            this.shoppingCarts(res.data);
            this.setState({ showWaitSign: false })
            this.detectAlert(alertText)
        }).catch((error) => {
            console.log(error);
            this.props.actions.shoppingCartUnselected();
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

    cancelCart() {
        this.setState({ showWaitSign: true })
        axios.delete((this.serverBaseRoute + 'rest/user/pedido/individual/' + this.props.shoppingCartSelected.id)).then(res => {
            this.getShoppingCarts('El pedido ha sido cancelado correctamente');
        }, { withCredentials: true }).catch((error) => {
            this.setState({ showWaitSign: false })
            console.log("error", error);
            Alert.alert(
                'Error',
                'Ocurrio un error al cancelar el pedido, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    refreshExpiration() {
        axios.post((this.serverBaseRoute + 'rest/user/pedido/refrescarVencimiento'), {
            id: this.props.shoppingCartSelected.id
        }, { withCredentials: true }).then(res => {
        }).catch((error) => {
            console.log("error", error);
        });
    }
    obtainActiveMembers(members){
        let actives = 0
        members.map((member)=>{
            if(member.invitacion === "NOTIFICACION_ACEPTADA"){
                actives = actives + 1
            }
        })
        return actives
    }

    hasFullConfirmedCartsOnGroup(idGroup){
        let value = false;
        let countConfirmedCarts = 0;
        let totalMembers = 0;
        let vgroup = null; 
        this.props.groupsData.map((group)=>{
            if(group.id === idGroup){
                vgroup = group
            }
        })
        if(vgroup !== null){
            totalMembers = this.obtainActiveMembers(vgroup.miembros)
            vgroup.miembros.map((member)=>{
                if(member.pedido !== null){
                    if(member.invitacion === "NOTIFICACION_ACEPTADA"){
                        if(member.pedido.estado === "CONFIRMADO"){
                            countConfirmedCarts = countConfirmedCarts + 1
                        }
                    }
                }
            })
            value = (totalMembers - 1  === countConfirmedCarts)
        }

        return value
    }

    defineColectiveType(){
        if(this.props.vendorSelected.few.gcc){
            return "grupo"
        }else{
            return "nodo"
        }
    }

    defineSection(){
        if(this.props.vendorSelected.few.gcc){
            return "Mis grupos"
        }else{
            return "Mis nodos"
        }
    }

    alertGroupConfirm() {
        if (!this.isAdminOfGroup()) {
            Alert.alert(
                'Aviso',
                '¿Esta seguro de confirmar el pedido del ' +  this.defineColectiveType() + ' ' + this.props.shoppingCartSelected.aliasGrupo + '? una vez confirmado, no podrá cambiarlo.',
                [
                    { text: 'No', onPress: () => null },
                    { text: 'Si', onPress: () => this.confirmCartOnGroup('Su pedido en el grupo ' + this.props.shoppingCartSelected.aliasGrupo + ' fue confirmado correctamente. Deberá esperar a que el administrador confirme el pedido colectivo para que se confirme por completo.') },
                ],
                { cancelable: false },
            );
        } else {
            if(!this.hasFullConfirmedCartsOnGroup(this.props.shoppingCartSelected.idGrupo)){
                Alert.alert(
                    'Aviso',
                    'Debido a que es el administrador, se le recomienda confirmar su pedido individual en ultimo lugar, para que pueda usarlo en ultima instancia para correcciones de falta de productos en algún pedido de sus integrantes. ¿Esta seguro de confirmar el pedido del ' +  this.defineColectiveType() + ' ' + this.props.shoppingCartSelected.aliasGrupo + '? una vez confirmado, no podrá cambiarlo.',
                    [
                        { text: 'No', onPress: () => null },
                        { text: 'Si', onPress: () => this.confirmCartOnGroup('Su pedido en el ' +  this.defineColectiveType() + ' ' + this.props.shoppingCartSelected.aliasGrupo + ' fue confirmado correctamente. Recuerde que tiene que confirmar el pedido colectivo en la sección ' +this.defineSection()+' cuando decida concretar todos los pedidos realizados.') },
                    ],
                    { cancelable: false },
                );
            }else{
                Alert.alert(
                    'Aviso',
                    '¿Esta seguro de confirmar el pedido del ' +  this.defineColectiveType() + ' ' + this.props.shoppingCartSelected.aliasGrupo + '? una vez confirmado, no podrá cambiarlo.',
                    [
                        { text: 'No', onPress: () => null },
                        { text: 'Si', onPress: () => this.confirmCartOnGroup('Su pedido en el ' +  this.defineColectiveType() + ' ' + this.props.shoppingCartSelected.aliasGrupo + ' fue confirmado correctamente.Todos los integrantes del mismo confirmaron sus pedidos, puede completar el pedido colectivo en la sección "' + this.defineSection() + '".') },
                    ],
                    { cancelable: false },
                );
            }
        }
    }

    goToConfirm() {
        if (this.props.shoppingCartSelected.idGrupo !== null) {
            this.refreshExpiration();
            this.alertGroupConfirm();
        } else {
            this.refreshExpiration()
            this.props.functionShow();
            this.navigation.navigate('ConfirmarPedido')
        }
    }

    getUnreadNotifications() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/noLeidas', { withCredentials: true }).then(res => {
            this.props.actions.unreadNotifications(res.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    defineRouteTypeGroupConfirm(){
        if(this.props.vendorSelected.few.nodos){
            return 'rest/user/nodo/confirmarIndividualEnNodo'
        }else{
            return 'rest/user/pedido/individualEnGrupo/confirmar'
        }
    }

    confirmCartOnGroup(text) {
        this.setState({ showWaitSign: true })
        if (this.props.shoppingCartSelected.idGrupo !== null) {
            axios.post((this.serverBaseRoute + this.defineRouteTypeGroupConfirm()), {
                idPedido: this.props.shoppingCartSelected.id
            }, { withCredentials: true }).then(res => {
                this.getShoppingCarts(text);                
                this.getUnreadNotifications();
                this.getGroups();
            }).catch((error) => {
                this.setState({ showWaitSign: false })
                this.showAlert("ocurrio un error al confirmar el pedido en el grupo")
            });
        }
    }

    hasDeliveryAndRetrievePoint() {
        return this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.few.puntoDeEntrega
    }

    validToConfirm() {
        if (this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && !this.props.vendorSelected.few.puntoDeEntrega) {
            if (this.props.shoppingCartSelected.idGrupo === null) {
                if (this.props.shoppingCartSelected.montoActual >= this.props.vendorSelected.montoMinimo) {
                    this.goToConfirm()
                } else {
                    this.showAlert("Debe alcanzar el monto minímo para poder confirmar el pedido")
                }
            } else {
                if (this.isAdminOfGroup()) {
                    if (this.validateGroupAmount()) {
                        this.goToConfirm()
                    } else {
                        this.showAlert("Debe alcanzar el monto minímo para poder confirmar el pedido")
                    }
                } else {
                    this.goToConfirm();
                }
            }
        }
    }


    confirmCart() {
        if (this.props.shoppingCartSelected.productosResponse == 0) {
            this.showAlertInvalidCart()
        } else {
            if (!this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && !this.props.vendorSelected.few.puntoDeEntrega) {
                this.showAlert("No puede confirmar el pedido, por que el catálogo no esta configurado correctamente.")
            }

            if (this.hasDeliveryAndRetrievePoint()) {
                this.goToConfirm()
            }

            if (!this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.few.puntoDeEntrega) {
                this.goToConfirm()
            }

            this.validToConfirm()

        }
    }

    compareIds(a, b) {
        if (a.idVariante > b.idVariante) {
            return 1;
        }
        if (a.idVariante < b.idVariante) {
            return -1;
        }
        return 0;
    }

    typeShoppingCart() {
        if (this.props.shoppingCartSelected.idGrupo === null) {
            return '../vendorsViewComponents/badge_icons/compra_individual.png'
        } else {
            return '../vendorsViewComponents/badge_icons/compra_grupal.png'
        }
    }

    isAdminOfGroup() {
        let isAdmin = false;
        this.props.groupsData.map((group) => {
            if(group.id === this.props.shoppingCartSelected.idGrupo){
                if (group.emailAdministrador === this.props.shoppingCartSelected.cliente.email) {
                    isAdmin = true;
                }
            }
        })
        return isAdmin;
    }

    showMinAmount() {
        if (this.props.shoppingCartSelected.idGrupo !== null) {
            return this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.montoMinimo >= 1 && this.isAdminOfGroup();
        } else {
            return this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.montoMinimo >= 1;
        }
    }

    setStyleDistance() {
        if (this.showMinAmount()) {
            return "space-evenly"
        } else {
            return "center"
        }
    }

    findGroupName() {
        let nombre = "Error grupo desconocido"
        let idGrupo = this.props.shoppingCartSelected.idGrupo
        this.props.groupsData.map((group) => {
            if (group.id === idGrupo) {
                nombre = group.alias;
            }
        })
        return nombre;
    }
    validateGroupAmount() {
        let idGroup = this.props.shoppingCartSelected.idGrupo;
        let vgroup = null;
        let totalAmount = 0;
        this.props.groupsData.map((group) => {
            if (group.id === idGroup) {
                vgroup = group
            }
        })
        if (vgroup !== null) {
            vgroup.miembros.map((member) => {
                if (member.pedido !== null) {
                    if (member.pedido.estado === "CONFIRMADO") {
                        totalAmount = totalAmount + member.pedido.montoActual;
                    }
                }
            })
        }
        if (this.props.shoppingCartSelected.idGrupo !== null) {
            if (this.props.shoppingCartSelected.idGrupo === idGroup) {
                totalAmount = totalAmount + this.props.shoppingCartSelected.montoActual;
            }
        }
        return totalAmount > this.props.vendorSelected.montoMinimo;
    }

    definteText() {
        if (this.props.shoppingCartSelected.idGrupo === null) {
            return "Min. Monto: "
        } else {
            return "Min. Monto colectivo: "
        }
    }

    defineTotalPriceCart(){
        if(this.props.vendorSelected.few.nodos && this.props.vendorSelected.few.usaIncentivos){
            return this.props.shoppingCartSelected.montoActual + this.props.shoppingCartSelected.incentivoActual
        }else{
            return this.props.shoppingCartSelected.montoActual
        }
    }

    render() {
        if (this.props.shoppingCartSelected.id === undefined) {
            return (
                <View>
                    <View style={{ height: Dimensions.get("window").height - 255 }}>
                        <View style={stylesListCard.viewSearchErrorContainer}>
                            {this.state.guest ?
                                (
                                    <View style={stylesListCard.viewErrorContainer}>
                                        <View style={stylesListCard.searchIconErrorContainer}>
                                            <Icon name="user" type='font-awesome' size={50} color={"white"} containerStyle={stylesListCard.searchIconError}></Icon>
                                        </View>
                                        <Text style={stylesListCard.errorText}>
                                            Debe ingresar con una cuenta
                                        </Text><Button onPress={() => this.goToRegister()} title="Ingresar" type="clear" />
                                    </View>
                                )
                                :
                                (
                                    <View style={stylesListCard.viewErrorContainer}>
                                        <View style={stylesListCard.searchIconErrorContainer}>
                                            <Icon name="shopping-cart" type='font-awesome' size={50} color={"white"} containerStyle={stylesListCard.searchIconError}></Icon>
                                        </View>
                                        <Text style={stylesListCard.errorText}>
                                            No tiene ningún pedido seleccionado
                                        </Text>
                                        <Text style={stylesListCard.tipErrorText}>
                                            Seleccione o abra uno en la opción <Text style={{ fontWeight: 'bold' }}>Ver pedidos</Text>
                                        </Text>
                                    </View>
                                )
                            }

                        </View>
                    </View>
                    <View style={{ backgroundColor: '#ebedeb' }}>
                        <View style={{}}>
                            <View style={stylesListCard.singleItemContainer}>
                                <Text style={stylesListCard.totalPriceCartStyle}> Total : $ - - - </Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginBottom: 10 }}>
                                <Button disabled={true} titleStyle={{ color: 'black', }} title='Cancelar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonNotStyle}></Button>
                                <Button disabled={true} titleStyle={{ color: 'white', }} title='Confirmar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonOkStyle}></Button>
                            </View>
                        </View>
                    </View>
                </View>
            )

        }

        return (
            <View>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText="Comunicandose con el servidor..."></LoadingOverlayView>
                <View style={{ height: Dimensions.get("window").height - 255 }}>

                    {this.props.shoppingCartSelected.idGrupo === null ? (null) : (
                        <View style={{ backgroundColor: '#ebedeb', flexDirection: "row", justifyContent: this.setStyleDistance(), borderBottomColor: "#dfdfdf", borderBottomWidth: 1 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={stylesListCard.sectionTitleTextStyle}> Comprando en </Text>
                                <Text style={{ fontSize: 15, fontWeight: "bold", textAlign: "center", marginStart: 5, marginEnd: 5 }}> {this.findGroupName()} </Text>
                            </View>
                        </View>
                    )}


                    <View style={{ backgroundColor: '#ebedeb', flexDirection: "row", justifyContent: this.setStyleDistance(), borderBottomColor: "#dfdfdf", borderBottomWidth: 1 }}>
                        <View style={{ backgroundColor: 'white', flexDirection: "row", borderRadius: 5, marginTop: 5, marginBottom: 5 }}>
                            {this.props.shoppingCartSelected.idGrupo === null ?
                                (<Image style={stylesListCard.badgeImage} source={require('../vendorsViewComponents/badge_icons/compra_individual.png')} />)
                                :
                                (
                                    <View>
                                {this.props.vendorSelected.few.gcc ? (
                                <Image style={stylesListCard.badgeImage} source={require('../vendorsViewComponents/badge_icons/compra_grupal.png')} />
                                ):(
                                    <Image style={stylesListCard.badgeImage} source={require('../vendorsViewComponents/badge_icons/compra_nodos.png')} />
                                )}
                                </View>
                                )}
                        </View>

                        {this.showMinAmount() ?
                            (
                                <View style={{ backgroundColor: 'white', marginTop: 5, marginBottom: 5, flexDirection: "row", justifyContent: "center", alignItems: "center", borderColor: "grey", borderWidth: 1, borderRadius: 5 }}>
                                    <Text> {this.definteText()} </Text>
                                    <View style={{ flexDirection: "row", }}>
                                        <Text style={{ textAlign: "center", }}>${this.props.vendorSelected.montoMinimo}</Text>
                                        {this.props.shoppingCartSelected.idGrupo === null ? (
                                            <View style={{ marginLeft: 5, marginRight: 5 }}>
                                                {this.props.shoppingCartSelected.montoActual >= this.props.vendorSelected.montoMinimo ? (
                                                    <Icon name="check" type='font-awesome' size={20} color={"green"}></Icon>
                                                ) : (<Icon name="check" type='font-awesome' size={20} color={"#ebedeb"}></Icon>)}
                                            </View>
                                        ) : (
                                                <View style={{ marginLeft: 5, marginRight: 5 }}>
                                                    {this.validateGroupAmount() ? (
                                                        <Icon name="check" type='font-awesome' size={20} color={"green"}></Icon>
                                                    ) : (<Icon name="check" type='font-awesome' size={20} color={"#ebedeb"}></Icon>)}
                                                </View>
                                            )}
                                    </View>
                                </View>
                            )
                            :
                            (null)}
                        <View>

                        </View>
                    </View>


                    {this.props.shoppingCartSelected.productosResponse.length == 0 ?
                        (
                            <View style={stylesListCard.viewSearchErrorContainer}>
                                <View style={stylesListCard.viewErrorContainer}>
                                    <View style={stylesListCard.cartIconOkContainer}>
                                        <Icon name="shopping-cart" type='font-awesome' size={50} color={"white"} containerStyle={stylesListCard.searchIconError}></Icon>
                                    </View>
                                    <Text style={stylesListCard.errorText}>
                                        Ya puede agregar productos!
                                    </Text>

                                </View>
                            </View>
                        )
                        : (
                            <FlatList data={this.props.shoppingCartSelected.productosResponse.sort((a, b) => this.compareIds(a, b))} keyExtractor={item => item.idVariante} windowSize={15}
                                renderItem={({ item }) =>

                                    <View style={{ flex: 1, backgroundColor: '#ebedeb', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                        <ProductItemView touchable={true} item={item}></ProductItemView>
                                    </View>


                                } />)
                    }
                </View>
                <View style={{ backgroundColor: '#ebedeb', }}>
                    <View style={{ justifyContent: "center" }}>
                        <View style={stylesListCard.singleItemContainer}>
                            <Text style={stylesListCard.totalPriceCartStyle}> Total : $ {(this.defineTotalPriceCart()).toFixed(2)} </Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginBottom: 10 }}>
                            <Button onPress={() => this.cancelCartAlert()} titleStyle={{ color: 'black', }} title='Cancelar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonNotStyle}></Button>
                            <Button onPress={() => this.confirmCart()} titleStyle={{ color: 'white', }} title='Confirmar' containerStyle={stylesListCard.subMenuButtonContainer} buttonStyle={stylesListCard.subMenuButtonOkStyle}></Button>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const stylesListCard = StyleSheet.create({

    sectionTitleTextStyle: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: 'rgba(51, 102, 255, 1)',
        color: "white",
        marginLeft: -2,
        marginRight: -2,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: 'black'
    },

    badgeImage: {
        height: 30,
        width: 30,
        borderColor: "grey",
        borderWidth: 1,
        borderRadius: 5,
    },

    viewSearchErrorContainer: {
        height: "100%",
        justifyContent: "center",
        flex: 1,
    },

    viewErrorContainer: {
        marginTop: 0,
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
        borderWidth: 2,
    },

    cartIconOkContainer: {
        backgroundColor: "green",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center',
        borderWidth: 2,
    },

    searchIconError: {
        marginTop: 23,
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

    subMenuButtonNotStyle: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "#f0f0f0",
        borderColor: 'black',
        borderWidth: 1
    }
    ,
    totalPriceCartStyle: {
        textAlign: 'center',
        marginTop: 7,
        fontSize: 15,
    },

    singleItemContainer: {
        marginTop: 10,
        marginBottom: 10,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 20,
        marginRight: 20,
    },
    priceStyle: {
        fontSize: 16,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    containerList: {
        flexDirection: "row",
        margin: 10
    },

    overlayAvatarContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 7,
        marginLeft: -7,
    },

    cardImageView: {
    },

    cardImageContainer: {
        borderWidth: 1,
        borderRadius: 50,

    },
    cardImage: {
        width: null,
        height: null,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 50,
        resizeMode: 'contain',
    },

    nameTextStyle: {
        fontSize: 12,
        alignSelf: 'flex-start',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    badge: {
        marginTop: 10,
        marginLeft: 2,
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


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 40
    },

    sealStyle: {
        height: 30,
        width: 30,
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
        position: "absolute",
        alignSelf: 'flex-start',
    },


    nameProducerTextStyle: {
        fontSize: 10,
        alignSelf: 'flex-start'
    },


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 60
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

})
export default ItemInfoCartView
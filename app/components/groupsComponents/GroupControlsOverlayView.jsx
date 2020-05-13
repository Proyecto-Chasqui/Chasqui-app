import React from 'react'
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native'
import { Button, Icon, Overlay, CheckBox, Image, Header } from 'react-native-elements';
import axios from 'axios'
import GLOBALS from '../../Globals'
import LoadingOverlayView from '../generalComponents/LoadingOverlayView'

class GroupControlsOverlayView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        console.log("group in control", this.props.groupSelected)
        console.log("vendor", this.props.vendorSelected)
        this.state={
            showWaitSign:false,
        }
    }

    hasCartOpen(){
        let confirmed = false;
        this.props.groupSelected.miembros.map((miembro)=>{
            if(miembro.pedido != null){
                if(miembro.email === this.props.user.email && miembro.pedido.estado === "ABIERTO"){
                    confirmed = true;
                }
            }
        })
        return confirmed
    }

    hasCartConfirmed(){
        let confirmed = false;
        this.props.groupSelected.miembros.map((miembro)=>{
            if(miembro.pedido != null){
                if(miembro.email === this.props.user.email && miembro.pedido.estado === "CONFIRMADO"){
                    confirmed = true;
                }
            }
        })
        return confirmed
    }

    openCartOnGroup(group) {
        console.log("grupo", group);
        this.setState({ showWaitSign: true })
        axios.post((this.serverBaseRoute + 'rest/user/gcc/individual'), {
            idGrupo: group.id,
            idVendedor: this.props.vendorSelected.id
        }, { withCredentials: true }).then(res => {
            this.props.actions.shoppingCartSelected(res.data);
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
            this.props.actions.shoppingCarts(res.data);
            this.setState({ showWaitSign: false });
            this.gotToCatalog();
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

    gotToCatalog(){
        this.setState({ showWaitSign: false });
        Alert.alert(
            'Aviso',
            'Pedido creado, será enviado a la catálogo para comenzar su compra.',
            [
                { text: 'Entendido', onPress: () => this.props.navigation.navigate("Productos") },
            ],
            { cancelable: false },
        );        
    }

    findOpenCart(){
        let openFinded = false;
        this.props.shoppingCarts.map((cart)=>{
            if(cart.idGrupo != null){
                if(cart.cliente.email === this.props.user.email && cart.idGrupo === this.props.groupSelected.id){
                    this.props.actions.shoppingCartSelected(cart)
                    openFinded = true
                }
            }            
        })
        if(!openFinded){
            this.openCartOnGroup(this.props.groupSelected)
        }else{
            this.gotToCatalog();
        }
    }

    selectOpenCart(){
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "ABIERTO"
            ]
        }, { withCredentials: true }).then(res => {
            this.props.actions.shoppingCarts(res.data);
            this.findOpenCart()
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

    openCart(){
        this.setState({ showWaitSign: true });
        if(!this.hasCartOpen()){
            this.openCartOnGroup(this.props.groupSelected)
        }else{
            this.selectOpenCart();
        }
    }

    goToAdminMembers(){
        this.props.showControls()
        this.props.navigation.navigate("GestionarMiembros")
    }

    render() {
        return (
            <Overlay containerStyle={styles.overlayContainer}
                overlayStyle={styles.overlay}
                windowBackgroundColor="rgba(0, 0, 0, 0.2)"
                onBackdropPress={() => this.props.showControls()} isVisible={this.props.isVisible}
                animationType="slide"
            >
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText={"Comunicandose con el servidor..."}></LoadingOverlayView>
                <View style={{ flex: 1 }}>
                    <View style={styles.topHeader}>
                        <Text style={{ fontSize: 20, margin: 15, textAlign: "center", color: "white", fontWeight: "bold" }}> Opciones del grupo</Text>
                    </View>
                    <View style={{ justifyContent: "space-evenly", flex: 1, marginTop: 5 }}>

                        {this.props.groupSelected.esAdministrador ? (
                            <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                <Button
                                    title="Historial de pedidos"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='archive'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                    raised
                                />
                                <Button
                                    title="Gestionar grupo"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='clipboard'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                    onPress={()=>this.props.showEditGroup()}
                                    raised
                                />

                                <Button
                                    title="Administrar integrantes"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    raised
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='users'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                    onPress={()=>this.goToAdminMembers()}
                                />
                                
                                <Button
                                    disabled = {this.hasCartConfirmed()}
                                    title="Comenzar mi pedido"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='shopping-cart'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                    onPress={()=>this.openCart()}
                                    raised
                                />       
                            </View>
                        ) : (
                                <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                    <Button
                                        title="Historial de pedidos"
                                        titleStyle={styles.normalTitleButton}
                                        buttonStyle={styles.normalButtonStyle}
                                        containerStyle={styles.contanierNormalButton}
                                        icon={                                        
                                            <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='archive'
                                            type='font-awesome'
                                            color='white'
                                            />
                                        }
                                        raised
                                    />
                                    <Button
                                        disabled = {this.hasCartConfirmed()}
                                        title="Comenzar mi pedido"
                                        titleStyle={styles.normalTitleButton}
                                        buttonStyle={styles.normalButtonStyle}
                                        containerStyle={styles.contanierNormalButton}
                                        icon={                                        
                                            <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='shopping-cart'
                                            type='font-awesome'
                                            color='white'
                                            />
                                        }
                                        onPress={()=>this.openCart()}
                                        raised
                                    />

                                    <Button
                                        title="Salir del grupo"
                                        titleStyle={styles.normalTitleButton}
                                        buttonStyle={styles.normalButtonStyle}
                                        containerStyle={styles.contanierNormalButton}
                                        icon={                                        
                                            <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='sign-out'
                                            type='font-awesome'
                                            color='white'
                                            />
                                        }
                                        raised
                                    />
                                </View>
                            )}
                    </View>
                </View>
            </Overlay>
        )
    }
}

const styles = StyleSheet.create({
    overlayContainer: { flexDirection: "column", alignItems: "flex-end" },
    overlay: {
        maxHeight: 260,
    },
    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        borderTopEndRadius:3,
        borderTopStartRadius:3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        borderBottomWidth: 0,
        marginStart: -10,
        marginEnd:-10,
        marginTop: -10,
    },

    normalTitleButton: { fontWeight: "bold", fontSize: 18 },
    normalButtonStyle: { backgroundColor: "rgba(51, 102, 255, 1)" },
    contanierNormalButton: { marginTop: 5 },
    iconContainerStyle:{marginEnd:10},

})

export default GroupControlsOverlayView;
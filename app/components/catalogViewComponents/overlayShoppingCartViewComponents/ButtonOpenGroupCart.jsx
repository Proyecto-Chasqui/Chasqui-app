import React from 'react'
import { StyleSheet, Dimensions, View, Text, Alert } from 'react-native'
import { Button, Image } from 'react-native-elements';

class ButtonOpenGroupCart extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            cart: null,
            existOpenCart: false,
            memberCart: null,
            cartConfirmed: false,
        }
    }

    componentDidMount() {
        this.existOpenCart()
        this.cartConfirmed()
    }

    existOpenCart() {
        this.props.shoppingCarts.map((vcart, i) => {
            if (vcart.estado === "ABIERTO" && vcart.idGrupo === this.props.group.id) {
                this.setState({ cart: vcart, existOpenCart: true })
            }
        })
    }

    cartConfirmed() {
        this.props.group.miembros.map((miembro, i) => {
            if (miembro.email === this.props.user.email) {
                if (miembro.pedido != null) {
                    if (miembro.pedido.estado === "CONFIRMADO") {
                        this.setState({ cartConfirmed: true, memberCart: miembro.pedido })
                    }
                }
            }
        })
    }

    render() {
        if (this.state.existOpenCart) {
            return (
                <View style={{
                    borderWidth: 2,
                    borderRadius: 3,
                    margin: 10,
                    borderColor: (this.props.shoppingCartSelected.id === this.state.cart.id) ? ('black'):("#D8D8D8"),
                }}>
                    <View style={{  justifyContent: "center", borderColor: (this.props.shoppingCartSelected.id === this.state.cart.id) ? ('black'):("#D8D8D8"), borderWidth: 2, borderBottomWidth: 0, borderTopRightRadius: 5, borderTopLeftRadius: 5, marginLeft: -2, marginRight: -2, marginTop: -2, alignItems: 'center', flexDirection: "row", backgroundColor: (this.props.shoppingCartSelected.id === this.state.cart.id) ? ('#5ebb47'):('rgba(51, 102, 255, 1)') }}>
                        <View style={{ flex: 8, alignItems: "center", margin: 5 }}>
                            <Text style={styles.aliasStyle}>{this.props.group.alias}</Text>
                        </View>
                        <View style={styles.iconStyle}>
                            <Image style={styles.badgeImage} source={require('../../vendorsViewComponents/badge_icons/compra_grupal.png')} />
                        </View>
                    </View>
                    <View style={{ margin: 5 }}>
                        <Text style={styles.textResumeStyle}> Total: ${(this.state.cart.montoActual).toFixed(2)} </Text>
                        <Text style={styles.textResumeStyle}> Creado el: {this.state.cart.fechaCreacion} </Text>
                    </View>
                    <View style={{ margin: 5 }}>
                        {this.props.shoppingCartSelected.id === this.state.cart.id ?
                            (null) :
                            (<Button onPress={() => this.props.selectCart(this.state.cart.id)} title="Seleccionar" titleStyle={{ color: 'white', }} containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonOkStyle}></Button>)
                        }
                    </View>
                </View>
            )
        } else {
            return (
                <View>
                    {this.state.cartConfirmed ?
                        (
                            <View style={styles.selectorContainer}>
                                <View style={{ justifyContent: "center", borderColor: "#D8D8D8", borderWidth: 2, borderBottomWidth: 0, borderTopRightRadius: 5, borderTopLeftRadius: 5, marginLeft: -2, marginRight: -2, marginTop: -2, alignItems: 'center', flexDirection: "row", backgroundColor: 'rgba(51, 102, 255, 1)' }}>
                                    <View style={{ flex: 8, alignItems: "center",  margin: 5 }}>
                                        <Text style={styles.aliasStyle}>{this.props.group.alias}</Text>
                                    </View>
                                    <View style={styles.iconStyle}>
                                        <Image style={styles.badgeImage} source={require('../../vendorsViewComponents/badge_icons/compra_grupal.png')} />
                                    </View>
                                </View>
                                <View style={{ margin: 5 }}>
                                    <View style={styles.messageContainer}>
                                        <Text style={{ marginTop: 3, textAlign: "center", color: "white", fontSize: 17, fontWeight: "bold" }}> Confirmado </Text>
                                        <Text style={{ marginBottom: 3, textAlign: "center", color: "white",  fontSize: 12, fontStyle: "italic", fontWeight: "bold" }}> En espera de confirmación grupal </Text>
                                    </View>
                                    <View style={{ marginTop: 3 }}>
                                        <Text style={styles.textResumeStyle}> Total: ${(this.state.memberCart.montoActual).toFixed(2)} </Text>
                                        <Text style={styles.textResumeStyle}> Creado el: {this.state.memberCart.fechaCreacion} </Text>
                                    </View>
                                </View>
                            </View>)
                        :
                        (
                            <View>
                                <View style={styles.selectorContainer}>
                                    <View style={{ flex: 1, justifyContent: "center", borderColor: "#D8D8D8", borderWidth: 2, borderBottomWidth: 0, borderTopRightRadius: 5, borderTopLeftRadius: 5, marginLeft: -2, marginRight: -2, marginTop: -2, alignItems: 'center', flexDirection: "row", backgroundColor: 'rgba(51, 102, 255, 1)' }}>
                                        <View style={{ flex: 8, alignItems: "center", margin: 5 }}>
                                            <Text style={styles.aliasStyle}>{this.props.group.alias}</Text>
                                        </View>
                                        <View style={styles.iconStyle}>
                                            <Image style={styles.badgeImage} source={require('../../vendorsViewComponents/badge_icons/compra_grupal.png')} />
                                        </View>
                                    </View>
                                    <View style={{ margin: 5 }}>
                                        <View style={styles.selectorContainer}>
                                            <Button disabled={!this.props.vendorSelected.ventasHabilitadas}
                                                titleStyle={styles.titleButtonNewCartReveal}
                                                buttonStyle={styles.buttonNewCartButton}
                                                containerStyle={styles.containerButtonNewCart}
                                                type="clear"
                                                title="Abrir Pedido"
                                                onPress={() => this.props.actionFunction()}
                                                iconRight />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                </View>
            )
        }
    }
}

export default ButtonOpenGroupCart

const styles = StyleSheet.create({
    badgeImage: { flex: 1, height: 25, width: 25 },
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

    selectorContainer: {
        borderWidth: 2,
        borderRadius: 3,
        margin: 10,
        borderColor: '#D8D8D8',
    },

    messageContainer: {
        borderWidth: 2,
        borderRadius: 3,
        margin: 0,
        borderColor: 'rgba(51, 102, 255, 1)',
        backgroundColor: "#5ebb47",
    },
    aliasStyle: { fontWeight: 'bold', color: "white", fontSize: 15 },
    iconStyle: { flex: 1, backgroundColor: "white", borderColor: "black", borderRadius: 5, borderWidth: 1, margin: 4 },
    textResumeStyle: { textAlign: "center", fontWeight: "bold" },
})
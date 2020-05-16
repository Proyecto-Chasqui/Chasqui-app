import React from 'react'
import { StyleSheet, Dimensions, View, Text, Alert } from 'react-native'
import { Button, Image } from 'react-native-elements';

class ButtonOpenIndividualCart extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            cart: null,
            existOpenCart: false,
        }
    }

    componentDidMount() {
        this.existOpenCart()
    }

    existOpenCart() {
        this.props.shoppingCarts.map((vcart, i) => {
            if (vcart.estado === "ABIERTO" && vcart.idGrupo === null) {
                this.setState({ cart: vcart, existOpenCart: true })
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
                    <View style={{ flex: 1, justifyContent: "center", borderColor: (this.props.shoppingCartSelected.id === this.state.cart.id) ? ('black'):("#D8D8D8"), borderWidth: 2, borderBottomWidth: 0, borderTopRightRadius: 5, borderTopLeftRadius: 5, marginLeft: -2, marginRight: -2, marginTop: -2, alignItems: 'center', flexDirection: "row", backgroundColor: (this.props.shoppingCartSelected.id === this.state.cart.id) ? ('#5ebb47'):('rgba(51, 102, 255, 1)') }}>
                        <Text style={{ fontWeight: 'bold', color: "white", fontSize: 15, marginRight: 20, }}> Pedido Individual </Text>
                        <View style={{ backgroundColor: "white", borderColor: "black", borderRadius: 5, borderWidth: 1, margin: 4 }}>
                            <Image style={styles.badgeImage} source={require('../../vendorsViewComponents/badge_icons/compra_individual.png')} />
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
                </View>)
        } else {
            return (
                <View style={{
                    borderWidth: 2,
                    borderRadius: 3,
                    margin: 10,
                    borderColor: "#D8D8D8",
                }}>
                <View style={{ flex: 1, justifyContent: "center", borderColor: "#D8D8D8", borderWidth: 2, borderBottomWidth: 0, borderTopRightRadius: 5, borderTopLeftRadius: 5, marginLeft: -2, marginRight: -2, marginTop: -2, alignItems: 'center', flexDirection: "row", backgroundColor: 'rgba(51, 102, 255, 1)' }}>
                        <Text style={{ fontWeight: 'bold', color: "white", fontSize: 15, marginRight: 20, textAlign:"center" }}> Pedido Individual </Text>
                        <View style={{ backgroundColor: "white", borderColor: "black", borderRadius: 5, borderWidth: 1, margin: 4 }}>
                            <Image style={styles.badgeImage} source={require('../../vendorsViewComponents/badge_icons/compra_individual.png')} />
                        </View>
                    </View>
                    <View style={{ margin: 15 , borderWidth:2, borderRadius:5, borderColor:"#D8D8D8"}}>
                    <Button disabled={!this.props.vendorSelected.ventasHabilitadas} titleStyle={styles.titleButtonNewCartReveal} buttonStyle={styles.buttonNewCartButton} containerStyle={styles.containerButtonNewCart} type="clear" title="Abrir Pedido"
                        onPress={() => this.props.actionFunction()} 
                        iconRight />
                    </View>
                </View>
            )
        }
    }
}

export default ButtonOpenIndividualCart

const styles = StyleSheet.create({
    titleButtonNewCartReveal: {
        color: "white"
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

    buttonNewCartButton: {
        backgroundColor: 'rgba(51, 102, 255, 1)',

    },
    badgeImage: { height: 25, width: 25 },
    titleButtonNewCartReveal: {
        color: "white"
    },

    buttonNewCartButton: {
        backgroundColor: 'rgba(51, 102, 255, 1)'
    },

    selectorContainer: {
        borderWidth: 2,
        borderRadius: 3,
        margin: 10,
        borderColor: '#D8D8D8',
    },
    textResumeStyle: {
        textAlign: "center",
        fontWeight: "bold"
    },
})
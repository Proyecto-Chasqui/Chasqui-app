import React from 'react'
import { StyleSheet, Dimensions, View, Text, Alert } from 'react-native'
import { Button, Image } from 'react-native-elements';

class ButtonOpenIndividualCart extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return(
        <View style={styles.selectorContainer}>
            <Button disabled={!this.props.vendorSelected.ventasHabilitadas} titleStyle={styles.titleButtonNewCartReveal} buttonStyle={styles.buttonNewCartButton} containerStyle={styles.containerButtonNewCart} type="clear" title="Abrir Pedido Individual"
                onPress={() => this.props.actionFunction()} icon={
                    <View style={{ backgroundColor: "white", borderColor: "black", borderRadius: 5, borderWidth: 1, marginLeft: 10 }}>
                        <Image style={styles.badgeImage} source={require('../../vendorsViewComponents/badge_icons/compra_individual.png')} />
                    </View>
                }
                iconRight />
        </View>
        )
    }
}

export default ButtonOpenIndividualCart

const styles = StyleSheet.create({
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
})
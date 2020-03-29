import React from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

class DeliveryAdressConfigView extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View>
            <View>
            <Button titleStyle={{ color: "black", }}
                containerStyle={styles.buttonAddProductContainer}
                buttonStyle={styles.buttonNewAddressStyle} title="Nueva dirección">
            </Button>
            </View>
            <ScrollView style={{height:Dimensions.get('window').height - 210}}>

                {this.props.adressesData.map((adressData, i) => {
                    return (                        
                        <View style={styles.directionContanierStyle}>
                            <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5, marginBottom: 5 }}>
                                <Text style={styles.caracteristicsStyle} >{adressData.alias}</Text>
                                <View style={styles.verticalDivisor} />
                                <Button icon={
                                    <Icon
                                    name='caret-right'
                                    type='font-awesome'
                                    color='#b0b901'
                                    size={30}
                                    />}
                                    containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                    onPress={() => null}></Button>
                            </View>
                        </View>
                    )
                })
                }
            </ScrollView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    directionContanierStyle: {
        flex: 1,
        borderRadius: 5,
        borderColor: "grey",
        borderWidth: 1,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5
    },

    verticalDivisor: {
        borderLeftWidth: 2,
        borderLeftColor: "#D8D8D8",
        height: "125%",
        alignSelf: "center"
    },

    caracteristicsStyle: {
        height: 30,
        fontSize: 17,
        flex: 6,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
    },

    buttonProducerContainerStyle: {
        alignSelf: "center",
        flex: 1,
        marginRight: 0,
    },

    buttonProducerStyle: {
        height: null,
        backgroundColor: "transparent"
    },

    buttonNewAddressStyle: {
        backgroundColor: "#f8f162",
        borderColor: 'grey',
        borderWidth: 1
    },

    buttonAddProductContainer: {
        margin: 10
    },

})

export default DeliveryAdressConfigView
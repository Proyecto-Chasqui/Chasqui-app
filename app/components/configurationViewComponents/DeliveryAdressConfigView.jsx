import React from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { ScrollView,} from 'react-native-gesture-handler';

class DeliveryAdressConfigView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = props.navigation;
    }

    goToNewAdress() {
        this.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: null,
        });
    }

    goToEditAdress(adressData) {
        this.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: adressData,
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Button titleStyle={{ color: "white", }}
                        containerStyle={styles.buttonAddProductContainer}
                        buttonStyle={styles.buttonNewAddressStyle}
                        onPress={() => this.goToNewAdress()} title="Nueva dirección">
                    </Button>
                </View>
                <ScrollView>

                    {this.props.adressesData.map((adressData, i) => {
                        return (
                            <TouchableOpacity onPress={() => this.goToEditAdress(adressData)} key={i} style={styles.directionContanierStyle}>
                                <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5, marginBottom: 5 }}>
                                    <Text style={styles.caracteristicsStyle} >{adressData.alias}</Text>
                                    <View style={styles.verticalDivisor} />
                                    <Button icon={
                                        <Icon
                                            name='caret-right'
                                            type='font-awesome'
                                            color='#00adee'
                                            size={30}
                                        />}
                                        containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                        onPress={() => this.goToEditAdress(adressData)}></Button>
                                </View>
                            </TouchableOpacity>
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
        backgroundColor:"white",
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
        backgroundColor: "#00adee",
        borderColor: 'grey',
        borderWidth: 1
    },

    buttonAddProductContainer: {
        margin: 10
    },

})

export default DeliveryAdressConfigView
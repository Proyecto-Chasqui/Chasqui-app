import React from 'react'
import { Overlay, Button } from 'react-native-elements'
import {Text, View, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

class NoSellsVarnOverlayView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isVisible : this.props.isVisible
        }
    }

    showMessage(){
        if(this.props.message === "" || this.props.message === undefined){
            return "El catálogo se encuentra deshabilitado para la venta pero aún puede terminar de gestionar los pedidos que tenga abiertos y navegar la tienda."
        }else{
            return this.props.message
        }
    }
    hideWarn(){
        this.setState({isVisible: !this.state.isVisible})
    }

    render() {
        return (
            <Overlay
                isVisible={this.state.isVisible}
                width="90%"
                height="50%"
                onBackdropPress={() => null}
                animationType="fade"
            >
                <View style={{flex:1}}>
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoText}>Catálogo deshabilitado</Text>
                    </View>
                    <ScrollView style={{ marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                    <Text style={{ fontSize: 18, alignSelf: 'center', textAlign:"justify" }}>{this.showMessage()}</Text>
                    </ScrollView>
                    <Button onPress={() => this.hideWarn()} title="Entendido" titleStyle={{ color: 'white', }}  buttonStyle={styles.subMenuButtonOkStyle} />
                </View>
            </Overlay>)
    }
}

const styles = StyleSheet.create({

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
    
    emailTitle:{
        marginTop:10,
        alignSelf:'center',
        fontSize: 18,
        fontWeight: 'bold'
      },  
    
      infoTextContainer: {
        backgroundColor: "rgba(51, 102, 255, 1)",
        marginTop: -10,
        marginLeft: -10,
        marginRight: -10,
        height: 50,
        alignItems: "center"
    },
    
    infoText: {
        marginTop: 10,
        fontSize: 19,
        fontWeight: "bold",
        color: "white"
    },
})

export default NoSellsVarnOverlayView
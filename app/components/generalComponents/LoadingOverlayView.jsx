import React from 'react'
import { Overlay } from 'react-native-elements'
import {Text, View, StyleSheet} from 'react-native'

class LoadingOverlayView extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Overlay
                isVisible={this.props.isVisible}
                width="90%"
                height={110}
                onBackdropPress={() => null}
                animationType="fade"
            >
                <View style={{ height: "25%" }}>
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoText}>Por favor espere...</Text>
                    </View>
                    <View style={{ marginTop: 15, marginLeft: 10, marginRight: 10 }}>
                        <Text style={{ fontSize: 18, alignSelf: 'center' }}>{this.props.loadingText}</Text>
                    </View>
                </View>
            </Overlay>)
    }
}

const styles = StyleSheet.create({
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

export default LoadingOverlayView
import React from 'react';
import { View, Text, ActivityIndicator, Dimensions, StyleSheet} from 'react-native';
import GLOBALS from '../../Globals';
import { Header, Button, Icon, Image,  } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import {WebView} from 'react-native-webview';
import axios from 'axios';

class ProducerView extends React.PureComponent{
    constructor(props){
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
    }
    
    normalizeText(text) {
        return encodeURI(text);
    }

    render(){
        const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";
        return (
            <View style={{ flex:1}}>
                <View>
                <View style={styles.producerNameContainer}>
                    <Text style={styles.producerName}>{this.props.producerSelected.nombreProductor}</Text>
                </View>
                {this.props.producerSelected.pathImagen === null ? 
                (
                    <Image onStartShouldSetResponder={() =>null} style={{ width: Dimensions.get("window").width, height: 300, alignSelf: 'center', resizeMode: 'contain' }}
                    source={ require('./catalogAssets/imagennodisponible.png') }
                    PlaceholderContent={<ActivityIndicator />}
                    />
                )
                :(
                    <Image style={{ width: Dimensions.get("window").width, height: 300, alignSelf: 'center', resizeMode: 'contain' }}
                    source={{ uri: this.normalizeText(this.serverBaseRoute + this.props.producerSelected.pathImagen) }}
                    PlaceholderContent={<ActivityIndicator />}
                    />
                    )
                }
                <ScrollView >
                    <View style={{ height: Dimensions.get('window').height-355, }}>
                                <WebView
                                    scalesPageToFit={false}
                                    style={{backgroundColor:"transparent"}}
                                    containerStyle={{ }}
                                    injectedJavaScript={INJECTEDJAVASCRIPT}
                                    style={{flex: 1}}
                                    source={{ html: this.props.producerSelected.descripcionLarga }}
                                />
                    </View>
                </ScrollView>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    producerNameContainer:{
        alignContent:"center",
    },
    producerName:{
        fontSize:22,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
        fontWeight: "bold",
        alignSelf:"center",
    },
    producerDescriptionSWContainer:{
        height: Dimensions.get('window').height-410,
    },
    producerDescription:{
        fontSize:20,
        marginLeft: 20,
        marginRight: 20
    }
})

export default ProducerView;

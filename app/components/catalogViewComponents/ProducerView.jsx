import React from 'react';
import { View, Text, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
import GLOBALS from '../../Globals';
import { Header, Button, Icon, Image, } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';
import axios from 'axios';

class ProducerView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    render() {
        const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";
        return (
            <View style={{ flex: 1 }}>
                <Header containerStyle={styles.topHeader} statusBarProps={{ translucent: true }}>
                    <Button
                        icon={
                            <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <Image
                        style={{ width: 40, height: 45 }}
                        source={require('./catalogAssets/platform-icon.png')}
                    />
                </Header>
                <View>
                    <View style={styles.producerNameContainer}>
                        <Text style={styles.producerName}>{this.props.producerSelected.nombreProductor}</Text>
                    </View>
                    {this.props.producerSelected.pathImagen === null ?
                        (
                            <Image onStartShouldSetResponder={() => null} style={{ width: Dimensions.get("window").width, height: 300, alignSelf: 'center', resizeMode: 'contain' }}
                                source={require('./catalogAssets/imagennodisponible.png')}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                        )
                        : (
                            <Image style={{ width: Dimensions.get("window").width, height: 300, alignSelf: 'center', resizeMode: 'contain' }}
                                source={{ uri: this.normalizeText(this.serverBaseRoute + this.props.producerSelected.pathImagen) }}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                        )
                    }
                    <ScrollView >
                        <WebView
                            scalesPageToFit={false}
                            style={{ backgroundColor: "transparent", height: Dimensions.get("window").height - 450 }}
                            containerStyle={{}}
                            injectedJavaScript={INJECTEDJAVASCRIPT}
                            source={{ html: this.props.producerSelected.descripcionLarga }}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    producerNameContainer: {
        alignContent: "center",
    },
    producerName: {
        fontSize: 22,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 5,
        fontWeight: "bold",
        alignSelf: "center",
    },
    producerDescriptionSWContainer: {
        height: Dimensions.get('window').height - 410,
    },
    producerDescription: {
        fontSize: 20,
        marginLeft: 20,
        marginRight: 20
    },
    
    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
    },

    lowerHeaderStyle: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        
        elevation: 9,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        height:35
    },

    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 15,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },
})

export default ProducerView;

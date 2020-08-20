import React from 'react'
import GLOBALS from '../Globals'
import { View, StyleSheet, Dimensions, } from 'react-native'
import { WebView } from 'react-native-webview';
import { Text, Header, Image, Button, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

class TermsAndConditionsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.privacyUrl = GLOBALS.TERMS_AND_CONDITIONS_URL
    }

    render() {
        const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";
        return (
            <View style={{flex:1}}>
                <View>
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
                            source={require('../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                        />
                    </Header>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.adressTitle}>Términos y condiciones</Text>
                </View>
                <ScrollView style={{flex:1}}>
                    {this.privacyUrl !== "" ? (
                        <WebView
                            originWhitelist={["*"]}
                            scalesPageToFit={false}
                            style={{ backgroundColor: "transparent" }}
                            style={{ height:Dimensions.get("window").height -135}}
                            containerStyle={{}}
                            source={{ uri: this.privacyUrl }}
                        />
                    ) : (
                            <View style={styles.viewErrorContainer}>
                                <View style={styles.searchIconErrorContainer}>
                                    <Icon name="file-remove" type='material-community' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                </View>
                                <Text style={styles.errorText}>
                                    No hay términos y condiciones
                                </Text>
                                <Text style={styles.tipErrorText}>
                                    Por el momento no hay términos y condiciones disponibles 
                                </Text>
                            </View>
                        )}
                </ScrollView>
            </View>
        )
    }
}


const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: '#909090',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        borderBottomWidth: 0,
    },
    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 0,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },

    leftHeaderButton: {
        backgroundColor: '#66000000',
        marginLeft: 15,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },

    titleContainer: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },

    adressTitle: {
        backgroundColor: "white",
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },

    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        marginTop: 150
    },

    errorText: {
        marginTop: 25,
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    tipErrorText: {
        marginTop: 25,
        fontSize: 12,
        alignSelf: 'center'
    },

    searchIconErrorContainer: {
        backgroundColor: "#00adee",
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },
})

export default TermsAndConditionsView
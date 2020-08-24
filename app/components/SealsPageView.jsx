import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Card, Header, Button, Icon, SearchBar, Image } from 'react-native-elements';
import { WebView } from 'react-native-webview'
import GLOBALS from '../Globals';
import { ScrollView } from 'react-native-gesture-handler';

class SealsPageView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
    }

    render() {
        const INJECTEDJAVASCRIPT = "document.body.style.userSelect = 'none'";
        return (
            <View style={{ flex:1 }}>
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
                <ScrollView horizontal={true}>
                    <View style={{ flexDirection: "row", justifyContent: "center"}}>
                        {this.props.sealsSelected.map((seal, i) => {
                            return (
                                <View key={seal.idMedalla + i} style={{height:50}}>
                                    <Card containerStyle={styles.cardStyle}>
                                        <View style={{ flexDirection: "column", width: Dimensions.get("window").width - 60 }}>
                                            <Image
                                                onStartShouldSetResponder={() => null}
                                                containerStyle={{ alignSelf: "center" }}
                                                style={{ width: 150, height: 150, marginBottom: 5, resizeMode: 'stretch' }}
                                                source={{ uri: this.serverBaseRoute + seal.pathImagen }}
                                            />
                                        </View>
                                        <View style={{ height: Dimensions.get("window").height - 300 }}>
                                            <WebView
                                                originWhitelist={["*"]}
                                                scalesPageToFit={false}
                                                containerStyle={{ height: 100, }}
                                                injectedJavaScript={INJECTEDJAVASCRIPT}
                                                style={{ flex: 1 }}
                                                source={{ html: seal.descripcion }}
                                            />
                                        </View>
                                    </Card>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle: {
        alignSelf: 'center', shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
    topHeader: {
        backgroundColor: '#909090',
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

export default SealsPageView;
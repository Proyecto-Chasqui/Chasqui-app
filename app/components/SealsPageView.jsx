import React from 'react'
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Card, Button, Icon, SearchBar, Image } from 'react-native-elements';
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
            <ScrollView horizontal={true}>
            <View style={{flexDirection:"row"}}>
            {this.props.sealsSelected.map((seal, i) => {
                return (
                    <View key={seal.idMedalla + i}> 
                        <Card containerStyle={styles.cardStyle}>
                            <View style={{ flexDirection: "column", width: Dimensions.get("window").width - 60 }}>
                                <Image
                                    onStartShouldSetResponder={() =>null}
                                    containerStyle={{ alignSelf: "center" }}
                                    style={{ width: 150, height: 150, marginBottom:5, resizeMode: 'stretch' }}
                                    source={{ uri: this.serverBaseRoute + seal.pathImagen }}
                                />
                            </View>
                            <View  style={{ height: Dimensions.get("window").height - 100}}>
                                <WebView
                                    originWhitelist= {["*"]}
                                    scalesPageToFit={false}
                                    containerStyle={{ height: 100, }}
                                    injectedJavaScript={INJECTEDJAVASCRIPT}
                                    style={{flex: 1}}
                                    source={{ html: seal.descripcion }}
                                />
                            </View>
                        </Card>
                    </View>
                );
            })}
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardStyle:{
        height: Dimensions.get("window").height - 50,
        
        alignSelf: 'center', shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 9,
    },
})

export default SealsPageView;
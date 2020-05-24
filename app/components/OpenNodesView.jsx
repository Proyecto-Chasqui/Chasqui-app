import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native'
import { Header, Button, Icon, Image, Overlay, Input } from 'react-native-elements'
import axios from 'axios'
import GLOBALS from '../Globals'
import LoadingView from '../components/LoadingView'

class OpenNodesView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL
        this.state = {
            isLoading: true,
        }
    }

    componentDidMount() {
        this.getOpenNodes()
    }

    getOpenNodes() {
        this.setState({ loading: true })
        axios.get((this.serverBaseRoute + 'rest/client/vendedor/nodosAbiertos/' + this.props.vendorSelected.id), {}).then(res => {
            console.log("nodos abiertos", res.data);
            this.props.actions.openNodesData(res.data);
            this.setState({ loading: false })
        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            if (error.response) {
                Alert.alert(
                    'Error',
                    error.response.data.error,
                    [
                        { text: 'Entendido', onPress: () => null },
                    ],
                    { cancelable: false },
                );
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.");
            }
        });
    }

    defineZone(zone) {
        if (zone !== null) {
            return zone.nombre
        } else {
            return "No definida"
        }
    }


    parseAdress(adress) {
        if (adress !== null) {
            return adress.calle + ", " + adress.localidad
        } else {
            return "No definida"
        }
    }

    hasDescription(text) {
        if (text !== null) {
            return text.length > 0
        }
        return false
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <View style={styles.nodeItem}>
            <View style={{ width: "100%" }}>
                <View style={styles.infoTextContainer}>
                        <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 17, color: "white", }}>{item.nombreDelNodo}</Text>
                </View>
                {this.hasDescription(item.descripcion) ? (
                    <View style={{ backgroundColor: "#ebedeb" }}>
                        <View style={{ alingItems: "center", flexDirection: "row", margin: 5, marginStart: 10, marginEnd: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "blue" }}>{item.descripcion}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 1, borderColor: "grey" }}></View>
                    </View>
                ) : (null)}
                <View style={{ margin: 10, }}>
                    <View style={{ alingItems: "center", flexDirection: "row" }}>
                        <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Dirección: </Text>{this.parseAdress(item.direccionDelNodo)}</Text>
                    </View>
                    <View style={{ alingItems: "center", flexDirection: "row" }}>
                        <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Zona: </Text>{this.defineZone(item.zona)}</Text>
                    </View>
                    <View style={{ alingItems: "center", flexDirection: "row" }}>
                        <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Contacto: </Text>{item.emailAdministrador}</Text>
                    </View>
                </View>
                <View>
                    <Button
                        icon={
                            <View style={{ marginRight: 5 }}>
                                <Icon name="done" size={20} color="white" type='material' />
                            </View>
                        }
                        title="Enviar Solicitud" titleStyle={{ color: 'white', }} buttonStyle={styles.subMenuButtonOkStyle} raised={false} type="solid"></Button>
                </View>
            </View>
        </View>
    )


    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header containerStyle={styles.topHeader}>
                    <Button
                        icon={
                            <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.props.navigation.popToTop()}
                    />
                    <Image
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                        source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                    />
                </Header>
                {this.state.loading ? (<LoadingView></LoadingView>) : (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ListHeaderComponent={
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>Nodos abiertos</Text>
                                </View>}
                            keyExtractor={this.keyExtractor}
                            data={this.props.openNodesData}
                            renderItem={(item) => this.renderItem(item)}
                        />
                    </View>)}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    subMenuButtonOkStyle: {
        backgroundColor: "#5ebb47",
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 0,
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    itemDataInfoStyle: { fontSize: 16, fontWeight: "bold", fontStyle: "italic", color: "grey" },
    itemDataStyle: { color: "black", fontStyle: "normal" },
    infoTextContainer: {
        backgroundColor: "rgba(51, 102, 255, 1)",
        width: "100%",
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "grey",
        borderBottomWidth: 1
    },
    title: {
        backgroundColor: "white",
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
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
    nodeItem: {
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        margin: 4,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        marginTop: -25,
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

    rightHeaderButtonOnWarn: {
        marginTop: 10,
        backgroundColor: '#66000000',
        marginRight: 0,
        borderColor: 'rgba(51, 102, 255, 1)',
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

})
export default OpenNodesView
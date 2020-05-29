import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Dimensions, Alert, } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar, Header, ButtonGroup } from 'react-native-elements';
import { NavigationActions, StackActions } from '@react-navigation/native';
import GLOBALS from '../../Globals'


class HistoryCartBriefingView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
    }

    goToGroups() {
        this.props.navigation.dispatch(
            StackActions.replace('MisGrupos')
        );
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    compareIds(a, b) {
        if (a.idVariante > b.idVariante) {
            return 1;
        }
        if (a.idVariante < b.idVariante) {
            return -1;
        }
        return 0;
    }

    getDataProducts() {
        if (this.props.historyCartSelected.productosResponse !== undefined) {
            return this.props.historyCartSelected.productosResponse.sort((a, b) => this.compareIds(a, b))
        } else {
            return []
        }
    }

    parseDate(string) {
        let parts = string.split('-');
        let parsedDate = parts[0] + "/" + parts[1] + "/" + parts[2].split(' ')[0];
        return parsedDate;
    }

    parseAdress(adress) {
        return adress.calle + ", " + adress.altura + ", " + adress.localidad
    }

    obtainTotalPrice() {
        if (this.props.historyCartSelected.montoActual !== undefined) {
            return (this.props.historyCartSelected.montoActual + this.props.historyCartSelected.incentivoActual).toFixed(2)
        } else {
            return 0
        }

    }

    inWaitingOfGroupConfirmation() {
        return (this.props.historyCartSelected.direccion === null && this.props.historyCartSelected.puntoDeRetiro === null && this.props.historyCartSelected.idGrupo !== null)
    }

    defineWord() {
        if (this.props.vendorSelected.few.gcc) {
            return "grupo"
        } else {
            return "nodo"
        }
    }

    defineText() {
        if (this.props.vendorSelected.few.gcc) {
            return "Mis grupos"
        } else {
            return "Mis nodos"
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View>
                    <Header containerStyle={styles.topHeader}>
                        <Button
                            icon={
                                <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.rightHeaderButton}
                            onPress={() => this.props.navigation.goBack()}
                        />
                        <Image
                            style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                            source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                        />
                    </Header>
                </View>
                <Text style={styles.sectionTitleTextStyle}>Productos</Text>
                <View style={{ flex: 1 }}>
                    <FlatList data={this.getDataProducts()}
                        keyExtractor={item => item.idVariante} windowSize={15}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, backgroundColor: 'white', borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                <View>
                                    <View style={styles.containerList}>
                                        <View style={styles.cardImageView}>
                                            <Avatar overlayContainerStyle={styles.overlayAvatarContainer} rounded size={80} source={{ uri: (this.normalizeText(this.serverBaseRoute + item.imagen)) }} renderPlaceholderContent={<ActivityIndicator size="large" color="#0000ff" />} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View >
                                                <Text style={styles.priceStyle}>{item.cantidad} x {item.precio + item.incentivo} = $ {(item.cantidad * (item.precio + item.incentivo)).toFixed(2)}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.nameTextStyle}>{item.nombre}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        } />

                </View>
                {this.props.historyCartSelected.aliasGrupo !== null ?
                    (
                        <View>
                            <Text style={styles.sectionTitleTextStyle}>Realizado en </Text>
                            <Text style={{ margin: 5, color: "blue", fontSize: 16, fontWeight: 'bold', textAlign: "center" }}>{this.props.historyCartSelected.aliasGrupo}</Text>
                        </View>
                    )
                    : (null)
                }
                {this.inWaitingOfGroupConfirmation() ? (
                    <TouchableOpacity onPress={() => this.goToGroups()} style={{}}>
                        <Text style={styles.sectionTitleTextStyle}> Aviso </Text>
                        <Text style={{ fontSize: 15, marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, fontStyle: 'italic', textAlign: "auto" }}>
                            Su pedido dentro del {this.defineWord()} esta confirmado, pero esta a la espera de la <Text style={{ fontWeight: "bold", color: "blue" }}>confirmación</Text> por parte del administrador.
                                </Text>
                        <Text style={{ fontSize: 15, marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, fontStyle: 'italic', textAlign: "center" }}>
                            Puede presionar aquí para ir a <Text style={{ fontWeight: "bold", color: "blue" }}>{this.defineText()}</Text>.
                                </Text>
                    </TouchableOpacity>
                ) : (
                        null
                    )}
                <View >
                    {this.props.historyCartSelected.direccion !== null ? (
                        <View style={{ height: 150 }}>
                            <Text style={styles.sectionTitleTextStyle}>Dirección de entrega</Text>
                            <Text style={{ margin: 5, color: "blue", fontSize: 16, fontWeight: 'bold', textAlign: "center" }}>{this.parseAdress(this.props.historyCartSelected.direccion)}</Text>
                            <View style={{ flex: 1 }}>
                                {this.props.historyCartSelected.zona != null ? (
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.sectionTitleTextStyle}> Detalles de la zona de entrega</Text>
                                        <ScrollView style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Zona de entrega: </Text>
                                                <Text style={{ fontSize: 12 }}>{this.props.historyCartSelected.zona.nombre}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Cierre de pedidos: </Text>
                                                <Text style={{ fontSize: 12 }}>{this.parseDate(this.props.historyCartSelected.zona.fechaCierrePedidos)}</Text>
                                            </View>
                                            <Text style={{ fontStyle: 'italic' }}>{this.props.historyCartSelected.zona.descripcion}</Text>
                                        </ScrollView>
                                    </View>
                                ) : (
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.sectionTitleTextStyle}> Detalles de la zona de entrega</Text>
                                            <Text style={{ fontSize: 13, marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10, fontStyle: 'italic', textAlign: "center" }}>
                                                La entrega fue coordinada con el vendedor
                                            </Text>
                                        </View>
                                    )}
                            </View>
                        </View>
                    ) : (
                            <View>
                                {this.props.historyCartSelected.puntoDeRetiro !== null ? (
                                    <View style={{ height: 130 }}>
                                        <Text style={styles.sectionTitleTextStyle}>Punto de retiro seleccionado</Text>
                                        <ScrollView style={{ flex: 5, marginLeft: 20, marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{this.props.historyCartSelected.puntoDeRetiro.nombre}</Text>
                                            <Text style={{ color: "blue" }}>{this.parseAdress(this.props.historyCartSelected.puntoDeRetiro.direccion)}</Text>
                                            <Text style={{ fontSize: 14, }}>{this.props.historyCartSelected.puntoDeRetiro.mensaje}</Text>
                                        </ScrollView>
                                    </View>
                                ) : (null)}
                            </View>
                        )}

                            <View style={{ backgroundColor: "black", }}>
                                <View style={{ backgroundColor: "rgba(51, 102, 255, 1)", borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, }}>
                                    <View style={styles.singleItemContainer}>
                                    <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}> Total:</Text> $ {this.obtainTotalPrice()} </Text>
                                    </View>
                                </View>
                            </View>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    itemDataInfoStyle: {
        alignSelf: "center",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic", color: "grey"
    },
    itemDataStyle: {
        color: "black",
        fontStyle: "normal"
    },
    sectionTitleTextStyle: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold",
        backgroundColor: 'rgba(51, 102, 255, 1)',
        color: "white",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: 'black'
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

    leftHeaderButton: {
        backgroundColor: '#66000000',
        marginLeft: 15,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
    },

    buttonAddProductStyle: {
        height: "100%",
        backgroundColor: "#5ebb47",
    },

    buttonAddProductContainer: {

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
        backgroundColor: "grey",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    cartIconOkContainer: {
        backgroundColor: "green",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },

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

    subMenuButtonNotStyle: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "#f0f0f0",
        borderColor: 'black',
        borderWidth: 1
    }
    ,
    totalPriceCartStyle: {
        textAlign: 'center',
        marginTop: 7,
        fontSize: 15,
    },

    singleItemContainer: {
        justifyContent:"center",
        margin: 5,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        backgroundColor: "white",
        marginLeft: 20,
        marginRight: 20,
    },

    quantityContainer: {
        flex: 12,
        marginBottom: 5,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 5,
        marginRight: 5,
    },

    priceStyle: {
        fontSize: 16,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    containerList: {

        flexDirection: "row",
        margin: 10,
    },

    overlayAvatarContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 7,
        marginLeft: -7,
    },

    cardImageView: {
    },

    cardImageContainer: {
        borderWidth: 1,
        borderRadius: 50,

    },
    cardImage: {
        width: null,
        height: null,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 50,
        resizeMode: 'contain',
    },

    nameTextStyle: {
        fontSize: 12,
        alignSelf: 'flex-start',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    badge: {
        marginTop: 10,
        marginLeft: 2,
        backgroundColor: '#00b300',
        height: 30,
        borderRadius: 5,
        borderColor: "black",
        alignSelf: 'flex-start'
    },

    badgeCobertura: {
        backgroundColor: '#48bb78',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 40
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

    badgeProductos: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },

    tagDestacado: {
        position: "absolute",
        alignSelf: 'flex-start',
    },


    nameProducerTextStyle: {
        fontSize: 10,
        alignSelf: 'flex-start'
    },


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 60
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

})

export default HistoryCartBriefingView;
import React from 'react'
import { Text, View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { Header, Button, Icon, SearchBar, Image, Badge } from 'react-native-elements';
import LoadingView from '../LoadingView'
import axios from 'axios'
import GLOBALS from '../../Globals'
import { createIconSet } from 'react-native-vector-icons';
import base64 from 'react-native-base64';

class GroupHistoryShoppingCartDetailView extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    obtainTotalPrice() {
        if (this.props.groupHistoryShoppingCartSelected.montoTotal !== undefined) {
            let value = 0
            value = value + this.props.groupHistoryShoppingCartSelected.montoTotal;
            if (this.props.groupHistoryShoppingCartSelected.incentivoTotal !== null) {
                value = value + this.props.groupHistoryShoppingCartSelected.incentivoTotal
            }
            return (value).toFixed(2)
        } else {
            return 0
        }

    }

    calculateFinalAmount() {
        if (this.props.groupHistoryShoppingCartSelected.montoTotal !== undefined) {
            return (this.props.groupHistoryShoppingCartSelected.montoTotal + this.props.groupHistoryShoppingCartSelected.incentivoTotal).toFixed(2)
        } else {
            return 0
        }
    }

    calculateNodeAmount() {
        if (this.props.groupHistoryShoppingCartSelected.incentivoTotal !== undefined) {
            return (this.props.groupHistoryShoppingCartSelected.incentivoTotal).toFixed(2)
        } else {
            return 0
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
    keyExtractor = (item, index) => index.toString()

    isUser(member) {
        if (member.email === this.props.user.email) {
            return (
                {
                    backgroundColor: "white",
                    alignItems: "center",
                    flex: 1,
                    borderWidth: 2,
                    margin: 4,
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    borderColor: "blue",
                    elevation: 5,
                }
            )
        } else {
            return (
                {
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
                }
            )
        }
    }
    hasNodeAndIncentives() {
        return this.props.vendorSelected.few.nodos && this.props.vendorSelected.few.usaIncentivos;
    }
    goToCartDetail(cart) {
        this.props.actions.historyCartSelected(cart)
        this.props.navigation.navigate("HistorialDePedido")
    }
    isAdmin() {
        return this.props.groupSelected.emailAdministrador === this.props.user.email
    }
    renderItem = ({ item }) => (
        <TouchableOpacity disabled={this.props.disabledPress} onPress={() => this.goToCartDetail(item)} style={this.isUser(item.cliente)}>
            <View style={{ margin: 2, marginStart: 10, flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
                <View style={{ marginStart: 10, flex: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold", fontStyle: "italic", }}>{item.cliente.alias}</Text>
                    <Text style={{ fontSize: 12, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>{item.cliente.email}</Text>
                    <View>
                        {item != null ? (
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Pedido: {item.estado}</Text>
                                <Text style={{ fontSize: 14, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>Total: ${item.montoActual + item.incentivoActual}</Text>
                            </View>)
                            : (<Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Sin pedido</Text>)
                        }
                    </View>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end", marginEnd: 5 }}>
                    <Icon
                        name='chevron-right'
                        type='font-awesome'
                        color='blue'
                    />
                </View>
            </View>
        </TouchableOpacity>
    )

    render() {
        return (
            <View>
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
                            style={{ width: 50, height: 55 }}
                            source={require('../../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                        />
                    </Header>
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.adressTitle}>Detalle del pedido colectivo</Text>
                </View>
                <View>
                    <Text style={styles.sectionTitleTextStyle}>Pedido de los integrantes</Text>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.props.groupHistoryShoppingCartSelected.pedidos}
                        renderItem={(item) => this.renderItem(item)}
                    />
                </View>
                <View >
                    {this.props.groupHistoryShoppingCartSelected.direccion !== null ? (
                        <View style={{ height: 150 }}>
                            <Text style={styles.sectionTitleTextStyle}>Dirección de entrega</Text>
                            <Text style={{ margin: 5, color: "blue", fontSize: 16, fontWeight: 'bold', textAlign: "center" }}>{this.parseAdress(this.props.groupHistoryShoppingCartSelected.direccion)}</Text>
                            <View style={{ flex: 1 }}>
                                {this.props.groupHistoryShoppingCartSelected.zona != null ? (
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.sectionTitleTextStyle}> Detalles de la zona de entrega</Text>
                                        <ScrollView style={{ marginLeft: 20, marginRight: 20, marginBottom: 10, marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Zona de entrega: </Text>
                                                <Text style={{ fontSize: 12 }}>{this.props.groupHistoryShoppingCartSelected.zona.nombre}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Cierre de pedidos: </Text>
                                                <Text style={{ fontSize: 12 }}>{this.parseDate(this.props.groupHistoryShoppingCartSelected.zona.fechaCierrePedidos)}</Text>
                                            </View>
                                            <Text style={{ fontStyle: 'italic' }}>{this.props.groupHistoryShoppingCartSelected.zona.descripcion}</Text>
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
                                {this.props.groupHistoryShoppingCartSelected.puntoDeRetiro !== null ? (
                                    <View style={{ height: 130 }}>
                                        <Text style={styles.sectionTitleTextStyle}>Punto de retiro seleccionado</Text>
                                        <ScrollView style={{ flex: 5, marginLeft: 20, marginRight: 10, marginBottom: 10, marginTop: 10 }}>
                                            <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{this.props.groupHistoryShoppingCartSelected.puntoDeRetiro.nombre}</Text>
                                            <Text style={{ color: "blue" }}>{this.parseAdress(this.props.groupHistoryShoppingCartSelected.puntoDeRetiro.direccion)}</Text>
                                            <Text style={{ fontSize: 14, }}>{this.props.groupHistoryShoppingCartSelected.puntoDeRetiro.mensaje}</Text>
                                        </ScrollView>
                                    </View>
                                ) : (null)}
                            </View>
                        )}
                    {this.isAdmin() ? (
                        <View>
                            {
                                this.hasNodeAndIncentives() ? (
                                    <View style={{}}>
                                        <View style={{ backgroundColor: "rgba(51, 102, 255, 1)", borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, }}>
                                            <View style={styles.singleItemContainer}>
                                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}> Ingreso Nodo :</Text> $ {this.calculateNodeAmount()} </Text>
                                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}> Costo al Nodo :</Text> $ {this.obtainTotalPrice()} </Text>
                                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}> Precio Final :</Text> $ {this.calculateFinalAmount()} </Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                        <View style={{}}>
                                            <View style={{ alignItems: "center", backgroundColor: "rgba(51, 102, 255, 1)", borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, }}>
                                                <View style={[styles.singleItemContainer, { width: "95%", height: 40, justifyContent: "center" }]}>
                                                    <Text style={[styles.itemDataInfoStyle]}><Text style={[styles.itemDataStyle]}> Total :</Text> $ {this.obtainTotalPrice()} </Text>
                                                </View>
                                            </View>
                                        </View>
                                    )
                            }
                        </View>
                    ) : (
                            <View style={{}}>
                                <View style={{ alignItems: "center", backgroundColor: "rgba(51, 102, 255, 1)", borderColor: 'black', borderBottomWidth: 1, borderTopWidth: 1, }}>
                                    <View style={[styles.singleItemContainer, { width: "90%", height: 40, justifyContent: "center" }]}>
                                        <Text style={[styles.itemDataInfoStyle]}><Text style={[styles.itemDataStyle]}> Total :</Text> $ {this.obtainTotalPrice()} </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                </View>
            </View>)
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
        margin: 5,
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

export default GroupHistoryShoppingCartDetailView;
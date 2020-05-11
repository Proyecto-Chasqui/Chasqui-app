import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert, ActivityIndicator } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge, Avatar } from 'react-native-elements'
import GLOBALS from '../../Globals'

class MemberView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.serverBaseRoute = GLOBALS.BASE_URL;
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    createImageUrl(urlavatar) {
        let url = this.serverBaseRoute + (urlavatar)
        url += '?random_number=' + new Date().getTime();
        return url
    }

    cartNotConfirmed(){
        return this.props.memberSelected.pedido.estado === "VENCIDO" || this.props.memberSelected.pedido.estado === "CANCELADO"
    }

    createText(){
        if(this.props.memberSelected.pedido.estado === "VENCIDO"){
            return "El pedido de " + this.props.memberSelected.nickname + " se ha vencido"
        }
        if(this.props.memberSelected.pedido.estado === "CANCELADO"){
            return  this.props.memberSelected.nickname + " ha cancelado su pedido"
        }
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <View style={{ flex: 1, backgroundColor: 'white', borderBottomColor: "#e1e1e1", borderBottomWidth: 2, opacity: this.cartNotConfirmed()?(0.25):(1)}}>
            <View>
                <View style={styles.containerList}>
                    <View style={styles.cardImageView}>
                        <Avatar overlayContainerStyle={styles.overlayAvatarContainer} rounded size={80} source={{ uri: (this.normalizeText(this.serverBaseRoute + item.imagen)) }} renderPlaceholderContent={<ActivityIndicator size="large" color="#0000ff" />} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View >
                            <Text style={styles.priceStyle}>{item.cantidad} x {item.precio} = $ {(item.cantidad * item.precio).toFixed(2)}</Text>
                        </View>
                        <View>
                            <Text style={styles.nameTextStyle}>{item.nombre}</Text>
                        </View>
                    </View>
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
                        onPress={() => this.props.navigation.goBack()}
                    />
                    <Image
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                        source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                    />
                </Header>
                <View >
                    <View style={{ margin: 2, marginStart: 10, flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
                        <Image
                            style={{ width: 50, height: 50, resizeMode: 'center', }}
                            source={{ uri: (this.normalizeText(this.createImageUrl(this.props.memberSelected.avatar))) }}
                        />
                        <View style={{ marginStart: 10, flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold", fontStyle: "italic", }}>{this.props.memberSelected.nickname}</Text>
                            <Text style={{ fontSize: 12, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>{this.props.memberSelected.email}</Text>
                            {this.props.memberSelected.pedido != null ? (
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Pedido: {this.props.memberSelected.pedido.estado}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>Total: ${this.props.memberSelected.pedido.montoActual}</Text>
                                </View>
                            ) : (null)
                            }
                        </View>
                    </View>
                </View>
                <View >
                    {this.props.memberSelected.pedido != null ? (
                        <View>
                        {this.cartNotConfirmed()?(
                            <View style={{position:"absolute", zIndex:1, width:Dimensions.get("window").width}}>
                            <View style={styles.viewErrorContainer}>

                                <View style={styles.searchIconErrorContainer}>
                                    <Icon name="exclamation" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                </View>
                                <Text style={styles.errorText}>
                                    {this.createText()}
                            </Text>
                                <Text style={styles.tipErrorText}>
                                    Deberá iniciar un nuevo pedido
                            </Text>
                            </View>
                        </View>
                        ):(null)}
                        <FlatList
                            ListHeaderComponent={
                                <View style={styles.titleContainer}>
                                    <Text style={styles.sectionTitleTextStyle}>Pedido</Text>
                                </View>}
                            keyExtractor={this.keyExtractor}
                            data={this.props.memberSelected.pedido.productosResponse}
                            renderItem={(item) => this.renderItem(item)}
                        />
                        </View>
                    ) : (
                            <View>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.sectionTitleTextStyle}>Pedido</Text>
                                </View>
                                <View style={styles.viewErrorContainer}>

                                    <View style={styles.searchIconErrorContainer}>
                                        <Icon name="shopping-cart" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                    </View>
                                    <Text style={styles.errorText}>
                                        {this.props.memberSelected.nickname} no posee un pedido en curso
                                </Text>
                                    <Text style={styles.tipErrorText}>
                                        Cuando comience uno podra ver los detalles
                                </Text>
                                </View>
                            </View>
                        )}
                </View>

            </View>
        )
    }
}


const styles = StyleSheet.create({

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

    notificationItem: {
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        margin: 4,
        borderRadius: 5,
        height: Dimensions.get("window").height / 5.5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
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
        backgroundColor: "rgba(51, 102, 255, 1)",
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },

    buttonMore: {
        backgroundColor: "#5ebb47",
        borderColor: 'grey',
        borderWidth: 1
    },
    groupItem: {
        backgroundColor: "white",
        alignItems: "center",
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


    subMenuButtonContainer: {
    },

    subMenuButtonOkStyle: {
        backgroundColor: "#5ebb47",
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 1,
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
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

    priceStyle: {
        fontSize: 16,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    nameTextStyle: {
        fontSize: 12,
        alignSelf: 'flex-start',
    },

})

export default MemberView;
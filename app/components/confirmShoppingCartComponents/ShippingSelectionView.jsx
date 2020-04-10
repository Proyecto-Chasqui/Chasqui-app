import React from 'react'
import { Text, View, Dimensions, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Header, Button, Icon, ButtonGroup, Image, Input, Overlay, CheckBox } from 'react-native-elements'

class ShippingSelectionView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation
        this.state = {
            addressSize: 0,
            showMoreInfo: false,
            showSellerPoints: false,
            showAdresses: false,
            checked: false,
            title: 'Seleccione un metodo de envio',
            dataChecksSellerPoints: [],
            dataChecksAdress: [],
            selectedSellerPoint: [],
            selectedAddress: [],
            showRevert: true,
        }
    }

    componentDidMount() {
        this.constructDataForChecked()
        this.setVisualsBasedOnStrats()
    }

    setVisualsBasedOnStrats() {

        if (this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.few.puntoDeEntrega) {

        } else {
            if (this.props.vendorSelected.few.seleccionDeDireccionDelUsuario) {
                this.showMoreInfoAddress()
            }
            if (this.props.vendorSelected.few.puntoDeEntrega) {
                this.showMoreInfoSellerPoint()
            }

            this.setState({ showRevert: false })
        }
    }

    showMoreInfoSellerPoint() {
        this.setState({ showMoreInfo: !this.state.showMoreInfo, title: 'Seleccione donde retirar', showSellerPoints: !this.state.showSellerPoints })
    }

    showMoreInfoAddress() {
        this.setState({ showMoreInfo: !this.state.showMoreInfo, title: 'Seleccione una direccion de envio', showAdresses: !this.state.showAdresses })
    }

    revertSelection() {
        this.setState({
            showMoreInfo: !this.state.showMoreInfo,
            showSellerPoints: false,
            showAdresses: false,
            title: 'Seleccione un metodo de envio',
            selectedSellerPoint: [],
            selectedAddress: [],
        })
        this.unCheckOthers(this.state.dataChecksSellerPoints)
        this.unCheckOthers(this.state.dataChecksAdress)

    }

    parseAdress(adress) {
        return adress.calle + ", " + adress.altura + ", " + adress.localidad
    }

    constructDataForChecked() {
        const checksSellerPoints = [];
        this.props.sellerPoints.map((u, i) => {
            checksSellerPoints.push({ id: u.id, checked: false });
        })
        this.setState({
            dataChecksSellerPoints: checksSellerPoints,
        })
    }
    unCheckOthers(data, index) {
        data.map((u, i) => {
            if (index != i) {
                u.checked = false;
            }
        })
    }

    onCheckChangedSellerPoint(id) {
        const data = this.state.dataChecksSellerPoints;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        this.unCheckOthers(data, index);
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        this.setState({
            selectedSellerPoint: selectedItems,
            dataChecksSellerPoints: data,
        });
    }

    addCheck(adress) {
        const data = this.state.dataChecksAdress;
        data.push({ id: adress.idDireccion, checked: false })
        this.setState({
            dataChecksAdress: data,
        })
        const index = data.findIndex((x) => x.id === adress.idDireccion);
        return index
    }

    onCheckChangedAdress(id) {
        const data = this.state.dataChecksAdress;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        this.unCheckOthers(data, index);
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        this.setState({
            selectedAddress: selectedItems,
            dataChecksAdress: data,
        });
    }

    flushAdressSelection() {
        this.unCheckOthers(this.state.dataChecksAdress);
        this.setState({ selectedAddress: [] });
    }

    goToNewAdress() {
        this.flushAdressSelection()
        this.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: null,
        });
    }

    goToEditAdress(adressData) {
        this.flushAdressSelection()
        this.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: adressData,
        });
    }

    render() {
        return (
            <View style={{ height: Dimensions.get("window").height - 210 }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.adressTitle}>{this.state.title}</Text>
                </View>
                {this.state.showMoreInfo ? (
                    <View>
                        {this.state.showRevert ? (
                            <View style={styles.moreInfoButtonContainer}>
                                <Text style={styles.caracteristicsStyle}>Elegir otro metodo</Text>
                                <View style={styles.verticalDivisor} />
                                <Button icon={
                                    this.state.showMoreInfo ? (
                                        <Icon
                                            name='caret-up'
                                            type='font-awesome'
                                            color='#b0b901'
                                            size={30}
                                        />) : (<Icon
                                            name='caret-down'
                                            type='font-awesome'
                                            color='#b0b901'
                                            size={30}
                                        />)}
                                    containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                    onPress={() => this.revertSelection()}></Button>
                            </View>) : (null)}

                        {this.state.showSellerPoints ? (
                            <ScrollView style={{ height: Dimensions.get("window").height - 330 }}>
                                <View style={{ borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}></View>
                                {this.props.sellerPoints.map((sellerPoint, i) => {
                                    return (
                                        <TouchableOpacity onPress={() => this.onCheckChangedSellerPoint(sellerPoint.id)} style={{ flexDirection: "row", alignItems: 'center', height: 130, borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                            <View style={{ flex: 1 }}>
                                                <CheckBox
                                                    checked={this.state.dataChecksSellerPoints[i].checked}
                                                    onPress={() => this.onCheckChangedSellerPoint(sellerPoint.id)}
                                                />
                                            </View>
                                            <View style={{ flex: 5 }}>
                                                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{sellerPoint.nombre}</Text>
                                                <Text style={{ color: "blue" }}>{this.parseAdress(sellerPoint.direccion)}</Text>
                                                <Text style={{ fontSize: 16 }}>{sellerPoint.mensaje}</Text>
                                            </View>
                                        </TouchableOpacity>)
                                })}
                            </ScrollView>) : (null)}

                        {this.state.showAdresses ? (
                            <View>
                                <Button titleStyle={{ color: "black", }}
                                    containerStyle={styles.buttonAddProductContainer}
                                    buttonStyle={styles.buttonNewAddressStyle}
                                    onPress={() => this.goToNewAdress()} title="Nueva dirección">
                                </Button>
                                <ScrollView style={{ height: Dimensions.get("window").height - 330 }}>
                                    <View style={{ borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}></View>
                                    {this.props.adressesData.map((adress, i) => {
                                        const index = this.addCheck(adress);
                                        return (
                                            <TouchableOpacity onPress={() => this.onCheckChangedAdress(adress.idDireccion)} style={{ flexDirection: "row", alignItems: 'center', height: 130, borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
                                                <View style={{ flex: 1 }}>
                                                    <CheckBox
                                                        checked={this.state.dataChecksAdress[index].checked}
                                                        onPress={() => this.onCheckChangedAdress(adress.idDireccion)}
                                                    />
                                                </View>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{adress.alias}</Text>
                                                    <Text style={{ color: "blue" }}>{this.parseAdress(adress)}</Text>
                                                    <Text style={{ fontSize: 16 }}>{adress.comentario}</Text>
                                                </View>
                                                <View style={{ flex: 1, marginRight:10}}>
                                                    <Button icon={
                                                        <Icon
                                                        name='edit'
                                                        type='font-awesome'
                                                        size={25} />
                                                    }  buttonStyle={{backgroundColor:"transparent",height:"100%"}}onPress={() => this.goToEditAdress(adress)}></Button>
                                                </View>
                                            </TouchableOpacity>)
                                    })}
                                </ScrollView>
                            </View>) : (null)}

                    </View>
                ) : (
                        <View>
                            {this.props.vendorSelected.few.puntoDeEntrega ? (
                                <View style={styles.moreInfoButtonContainer}>
                                    <Text style={styles.caracteristicsStyle}>Paso a retirar</Text>
                                    <View style={styles.verticalDivisor} />
                                    <Button icon={
                                        this.state.showMoreInfo ? (
                                            <Icon
                                                name='caret-up'
                                                type='font-awesome'
                                                color='#b0b901'
                                                size={30}
                                            />) : (<Icon
                                                name='caret-down'
                                                type='font-awesome'
                                                color='#b0b901'
                                                size={30}
                                            />)}
                                        containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                        onPress={() => this.showMoreInfoSellerPoint()}></Button>
                                </View>) : (null)}

                            {this.props.vendorSelected.few.seleccionDeDireccionDelUsuario ? (
                                <View style={styles.moreInfoButtonContainer}>
                                    <Text style={styles.caracteristicsStyle}>Envio a domicilio</Text>
                                    <View style={styles.verticalDivisor} />
                                    <Button icon={
                                        this.state.showMoreInfo ? (
                                            <Icon
                                                name='caret-up'
                                                type='font-awesome'
                                                color='#b0b901'
                                                size={30}
                                            />) : (<Icon
                                                name='caret-down'
                                                type='font-awesome'
                                                color='#b0b901'
                                                size={30}
                                            />)}
                                        containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                        onPress={() => this.showMoreInfoAddress()}></Button>
                                </View>) : (null)}
                        </View>
                    )}

            </View>)
    }
}

const styles = StyleSheet.create({

    buttonContainer: {
        marginTop: '2%',
        width: "95%",
        alignSelf: 'center'
    },

    TextStyle: {
        fontSize: 16,
        color: '#ffffff'

    },

    descriptionStyle: {
        marginLeft: 20,
        marginRight: 20,
        textAlign: 'justify'
    },

    caracteristicsContanierStyle: {
        flex: 1,
        borderRadius: 5,
        borderColor: "grey",
        borderWidth: 1,
        marginLeft: 20,
        marginRight: 20,
    },

    divisor: {
        borderTopWidth: 2,
        borderTopColor: "#D8D8D8",
        width: "100%"
    },

    verticalDivisor: {
        borderLeftWidth: 2,
        borderLeftColor: "#D8D8D8",
        height: "100%",
        alignSelf: "center"
    },

    buttonProducerContainerStyle: {
        alignSelf: "center",
        flex: 1,
        marginRight: 0,
    },

    buttonProducerStyle: {
        height: null,
        backgroundColor: "transparent"
    },

    caracteristicsStyle: {
        height: 30,
        fontSize: 17,
        flex: 9,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
        marginLeft: 10,
    },

    moreInfoButtonContainer: {
        flexDirection: "row",
        borderColor: 'grey',
        margin: 10,
        borderRadius: 3,
        borderWidth: 1
    },

    producerStyle: {
        height: 40,
        width: "90%",
        fontSize: 15,
        alignSelf: "center",
        textAlign: 'justify'
    },

    buttonNext: {
        backgroundColor: "#5ebb47",
        borderColor: 'grey',
        borderWidth: 1
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

    buttonProducerContainerStyle: {
        alignSelf: "center",
        flex: 1,
        marginRight: 0,
    },

    buttonProducerStyle: {
        height: null,
        backgroundColor: "transparent"
    },

    buttonNewAddressStyle: {
        backgroundColor: "#f8f162",
        borderColor: 'grey',
        borderWidth: 1
    },

    buttonAddProductContainer: {
        margin: 10
    },
})

export default ShippingSelectionView
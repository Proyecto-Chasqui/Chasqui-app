import React from 'react'
import { Text, View, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Alert, TouchableWithoutFeedbackBase } from 'react-native'
import { Header, Button, Icon, ButtonGroup, Image, Input, Overlay, CheckBox } from 'react-native-elements'
import axios from 'axios'
import GLOBALS from '../../Globals';

class ShippingSelectionView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.navigation = this.props.navigation
        this.zoneWarnText = "La dirección del domicilio no está asociada con ninguna zona de entrega del vendedor. Por favor comuniquese con el administrador del catálogo para confirmar los detalles de la compra."
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            addressSize: 0,
            showMoreInfo: false,
            showSellerPoints: false,
            showAdresses: false,
            checked: false,
            title: 'Seleccione un método de envío',
            dataChecksSellerPoints: [],
            dataChecksAdress: [],
            selectedSellerPoint: [],
            selectedAddress: [],
            showRevert: true,
            zone:undefined,
            loadingZone:false,
        }
    }

    getZoneOfAdress(id){
            this.setState({loadingZone:true})
            axios.post((this.serverBaseRoute + 'rest/client/vendedor/obtenerZonaDeDireccion'),
            {
                idDireccion: id,
                idVendedor: this.props.vendorSelected.id
            })
            .then(res => {
                if(this.state.selectedAddress.length === 0){
                    this.setState({zone:undefined, loadingZone:false});
                    this.props.setZone(undefined);
                }else{
                this.setState({zone:res.data, loadingZone:false});
                this.props.setZone(res.data);
                }
            }).catch((error) => {
                
                if (error.response) {
                    this.setState({zone:undefined, loadingZone:false});
                    this.props.setZone(undefined);
                } 
            });
        
    }

    componentDidMount() {
        this.constructDataForChecked()
        this.setVisualsBasedOnStrats()
    }

    setVisualsBasedOnStrats() {

        if (this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.few.puntoDeEntrega) {
                if(this.props.shoppingCartSelected.montoActual < this.props.vendorSelected.montoMinimo){
                    console.log("minimo menor")
                    this.showMoreInfoSellerPoint()
                    this.setState({ showRevert: false })
                }
        } else {
            if (this.props.vendorSelected.few.seleccionDeDireccionDelUsuario) {
                if(this.props.shoppingCartSelected.montoActual > this.props.vendorSelected.montoMinimo){
                    this.showMoreInfoAddress()
                }
            }
            if (this.props.vendorSelected.few.puntoDeEntrega) {
                this.showMoreInfoSellerPoint()
            }

            this.setState({ showRevert: false })
        }
    }

    flushSelections() {
        this.unCheckOthers(this.state.dataChecksSellerPoints)
        this.unCheckOthers(this.state.dataChecksAdress)
        this.props.selectedSPFunction(undefined)
        this.props.selectedAdressFunction(undefined)
        this.setState({zone:undefined})
    }

    showMoreInfoSellerPoint() {
        this.setState({
            showMoreInfo: !this.state.showMoreInfo,
            title: 'Seleccione donde retirar',
            showSellerPoints: !this.state.showSellerPoints
        })
        this.flushSelections()
    }

    showMoreInfoAddress() {
        this.setState({
            showMoreInfo: !this.state.showMoreInfo,
            title: 'Seleccione una dirección de envío',
            showAdresses: !this.state.showAdresses
        })
        this.unCheckOthers(this.state.dataChecksSellerPoints)
        this.flushSelections()
    }

    revertSelection() {
        this.setState({
            showMoreInfo: !this.state.showMoreInfo,
            showSellerPoints: false,
            showAdresses: false,
            title: 'Seleccione un método de envío',
            selectedSellerPoint: [],
            selectedAddress: [],
        })
        this.unCheckOthers(this.state.dataChecksSellerPoints)
        this.unCheckOthers(this.state.dataChecksAdress)
        this.props.selectedSPFunction(undefined)
        this.props.selectedAdressFunction(undefined)

    }

    parseAdress(adress) {
        return adress.calle + ", " + adress.altura + ", " + adress.localidad
    }

    constructDataForChecked() {
        const checksSellerPoints = [];
        this.props.sellerPoints.map((u, i) => {
            checksSellerPoints.push({sp:u, id: u.id, checked: false });
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
        let selectedItems = [];
        let selectedSPItem = undefined;
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
                selectedSPItem = u.sp;
            }
        });
        this.setState({
            selectedSellerPoint: selectedItems,
            dataChecksSellerPoints: data,
        });
        this.props.selectedSPFunction(selectedSPItem)
    }

    addCheck(vadress) {
        const data = this.state.dataChecksAdress;
        data.push({adress:vadress, id: vadress.idDireccion, checked: false })
        this.setState({
            dataChecksAdress: data,
        })
        const index = data.findIndex((x) => x.id === vadress.idDireccion);
        return index
    }

    onCheckChangedAdress(id) {
        
        const data = this.state.dataChecksAdress;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        this.unCheckOthers(data, index);
        let selectedItems = [];
        let selectedAdressItem = undefined;
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
                selectedAdressItem = u.adress;
            }
        });
        this.setState({
            selectedAddress: selectedItems,
            dataChecksAdress: data,
        });
        this.props.selectedAdressFunction(selectedAdressItem)
        this.getZoneOfAdress(id)
    }

    flushAdressSelection() {
        this.unCheckOthers(this.state.dataChecksAdress);
        this.setState({ selectedAddress: [] });
    }

    goToNewAdress() {
        this.flushSelections()
        this.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: null,
        });
    }

    goToEditAdress(adressData) {
        this.flushSelections()
        this.navigation.navigate('GestiónDeDirección', {
            adressDataInfo: adressData,
        });
    }

    parseDate(string) {
        let parts = string.split('-');
        let parsedDate = parts[0] + "/" + parts[1] + "/" + parts[2].split(' ')[0];
        return parsedDate;
    }

    minAmount(){
        return this.props.shoppingCartSelected.montoActual < this.props.vendorSelected.montoMinimo && (this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.few.puntoDeEntrega)
    }

    setDimensionsOnSP(){
        if(this.minAmount()){
            return  Dimensions.get("window").height - 330
        }else{
            return  Dimensions.get("window").height - 330
        }

    }

    getHeightValue(){
        if(this.props.vendorSelected.few.seleccionDeDireccionDelUsuario && this.props.vendorSelected.few.puntoDeEntrega){
            return 460
        }else{
            return 440
        }
    }
    render() {
        return (
            <View style={{ height: Dimensions.get("window").height - 155}}>
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
                            <View>
                                <View >
                                { this.minAmount() ? (
                                    <View style={{margin: 10}}>
                                    <Text style={{fontSize:16, textAlign:"justify", fontStyle:"italic"}}> {"Debido a que su pedido no supera el monto minimo de $" + this.props.vendorSelected.montoMinimo +", solo puede pasar a retirar el pedido por alguno de los siguientes puntos de retiro."}</Text>
                                    </View>
                                ):(null)}            
                                </View>                                                
                            <ScrollView style={{ height: this.setDimensionsOnSP() }}>

                                <View style={{ borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}></View>
                                {this.props.sellerPoints.map((sellerPoint, i) => {
                                    return (
                                        <TouchableOpacity key={sellerPoint.id} onPress={() => this.onCheckChangedSellerPoint(sellerPoint.id)} style={{ flexDirection: "row", alignItems: 'center', height: 200, borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
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
                            </ScrollView>
                            </View>) : (null)}

                        {this.state.showAdresses ? (
                            <View>
                                <Button titleStyle={{ color: "black", }}
                                    containerStyle={styles.buttonAddProductContainer}
                                    buttonStyle={styles.buttonNewAddressStyle}
                                    onPress={() => this.goToNewAdress()} title="Nueva dirección">
                                </Button>
                                        <ScrollView style={{height:120}}>
                                            <View style={{borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}></View>
                                            <View style={{marginLeft:20, marginRight:20, marginTop:10}}><Text style={{textAlign:"center", fontSize:15, fontWeight:"bold"}}>Información sobre la entrega</Text></View>
                                            {this.state.zone !== undefined?(
                                            <View style={{marginLeft:20, marginRight:20, marginBottom:10}}>                                            
                                                <View style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:15, fontWeight:'bold'}}>Zona de entrega: </Text>
                                                    <Text style={{fontSize:15}}>{this.state.zone.nombre}</Text>
                                                </View>
                                                <View  style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:15, fontWeight:'bold'}}>Cierre de pedidos: </Text>
                                                    <Text style={{fontSize:15}}>{this.parseDate(this.state.zone.fechaCierrePedidos)}</Text>
                                                </View>
                                                <Text style={{fontStyle:'italic'}}>{ this.state.zone.descripcion }</Text>
                                            </View>)
                                            :(<View style={{marginLeft:20, marginRight:20, marginBottom:10}}>
                                                {this.state.selectedAddress.length === 0 || this.state.loadingZone? 
                                                (<Text>Seleccione una dirección para obtener mas información sobre la entrega</Text>)
                                                :
                                                (<Text>{this.zoneWarnText}</Text>)}                                            
                                            </View>)}
                                            
                                        </ScrollView>
                                        <View style={{borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}></View>
                                <ScrollView style={{ height: Dimensions.get("window").height - this.getHeightValue() }}>
                                    
                                    <View style={{ borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}></View>
                                    
                                    {this.props.adressesData.map((adress, i) => {
                                        const index = this.addCheck(adress);
                                        
                                        return (
                                            <TouchableOpacity key={adress.idDireccion} onPress={() => this.onCheckChangedAdress(adress.idDireccion)} style={{ flexDirection: "row", alignItems: 'center', height: 90, borderBottomColor: "#e1e1e1", borderBottomWidth: 2 }}>
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
                                                <View style={{ flex: 1, marginRight: 10 }}>
                                                    <Button icon={
                                                        <Icon
                                                            name='edit'
                                                            type='font-awesome'
                                                            size={25} />
                                                    } buttonStyle={{ backgroundColor: "transparent", height: "100%" }} onPress={() => this.goToEditAdress(adress)}></Button>
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
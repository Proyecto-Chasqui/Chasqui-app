import React from 'react'
import { View, Text, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Header, Button, Icon, Image, Tooltip, Badge } from 'react-native-elements';
import GLOBALS from '../Globals';
import SealsView from '../components/catalogViewComponents/SealsView';
import QuantitySelector from '../components/catalogViewComponents/QuantitySelectorView';
import WebView from 'react-native-webview'
import { ScrollView } from 'react-native-gesture-handler';
import { SliderBox } from "react-native-image-slider-box";
import OverlayShoppingCartView from '../containers/CatalogComponentsContainers/OverlayShoppingCart'
import axios from 'axios';
import ProductItemView from '../containers/ConfirmShoppingCartContainers/ProductItem';

class ProductView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.tooltipRef = null,
            this.state = {
                showCaracteristics: false,
                images: [],
                showShoppingCart: false,
                initialValue: 0,
                quantityValue: 0,
                idPedido: 0,
                buttonDisabled: true,
                intentAddingWithOutCart: false,
                idProduct: 0,
            }
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.shoppingCarts = this.props.actions.shoppingCarts
    }

    setQuantityValue(value, equals) {
        this.setState({ quantityValue: value, buttonDisabled: equals })
    }

    componentDidMount() {
        this.getImages(this.props);
        this.setProductQuantity();
    }

    componentDidUpdate() {
        if (this.props.shoppingCartSelected.id !== undefined) {
            if (this.state.idPedido !== this.props.shoppingCartSelected.id) {
                this.setProductQuantity()
            }
            if (this.state.idProduct != this.props.productSelected.idProducto) {
                this.setProductQuantity()
                this.getImages()
            }
            if (this.props.shoppingCartSelected.montoActual > this.state.cartPrice || this.props.shoppingCartSelected.montoActual < this.state.cartPrice) {
                this.setProductQuantity()
            }
        }
    }

    setProductQuantity() {
        let value = 0;
        if (this.props.shoppingCartSelected.id !== undefined) {
            this.props.shoppingCartSelected.productosResponse.map((product) => {
                if (this.props.productSelected.idProducto === product.idVariante) {
                    value = product.cantidad
                }
            })
        }
        this.setState({
            initialValue: value,
            quantityValue: value,
            idPedido: this.props.shoppingCartSelected.id,
            buttonDisabled: true,
            idProduct: this.props.productSelected.idProducto,
            cartPrice: this.props.shoppingCartSelected.montoActual
        })
        return value;
    }

    parseImageURL(urlImages) {
        let varImageRoutes = []
        urlImages.map((imageData, i) => {
            let route = this.normalizeText(this.serverBaseRoute + imageData.path)
            varImageRoutes.push(route)
        })
        this.setState({ images: varImageRoutes })
    }

    getImages() {
        axios.get((this.serverBaseRoute + 'rest/client/producto/images/' + this.props.productSelected.idProducto)).then(res => {
            this.parseImageURL(res.data);
        }).catch((error) => {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener las imagenes, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    showCaracteristics() {
        this.setState({
            showCaracteristics: !this.state.showCaracteristics,
        });
        return this.state.showCaracteristics;
    }

    haventSeals() {
        return this.props.productSelected.medallasProducto === null && this.props.productSelected.medallasProductor.length == 0;
    }

    getProducer() {
        let varProducer = {}
        this.props.producers.map((producer, i) => {
            if (producer.idProductor === this.props.productSelected.idFabricante) {
                varProducer = producer;
            }
        });
        return varProducer;
    }

    async goToSeals() {
        let sealsSelected = [];
        await this.props.seals.map((seal, i) => {
            if (this.props.productSelected.medallasProducto !== null) {
                this.props.productSelected.medallasProducto.map((productSeal, i) => {
                    if (seal.nombre === productSeal.nombre) {
                        sealsSelected.push(seal);
                    }
                })
            }
            if (this.props.productSelected.medallasProductor !== null) {
                this.props.productSelected.medallasProductor.map((producerSeal, i) => {
                    if (seal.nombre === producerSeal.nombre) {
                        sealsSelected.push(seal);
                    }
                })
            }
        })
        this.props.actions.sealsSelected(sealsSelected);
        this.props.navigation.navigate("Sellos");
    }

    async normalizeData(data) {
        let regex = /(<([^>]+)>)/ig;
        data = await data.replace(regex, '');
        data = await data.replace('&oacute;', 'ó');
        data = await data.replace('&iexcl;', '¡');
        data = await data.replace('&aacute;', 'á');
        data = await data.replace('&eacute;', 'é');
        data = await data.replace('&iacute;', 'í');
        data = await data.replace('&uacute;', 'ú');
        data = await data.replace('&ntilde;', 'ñ');
        data = await data.replace('&nbsp;', ' ');
    }

    async goToProducer() {
        let producer = this.getProducer();
        this.props.actions.producerSelected(producer);
        this.props.navigation.navigate("Fabricante");
    }


    showShoppingCart() {
        this.setState({ showShoppingCart: !this.state.showShoppingCart })
    }

    updateCartSelected() {
        this.props.shoppingCarts.map((cart, i) => {
            if (cart.id === this.props.shoppingCartSelected.id) {
                this.props.actions.shoppingCartSelected(cart)
            }
        })
        this.setState({ buttonLoading: false })
    }

    getShoppingCarts() {
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "ABIERTO"
            ]
        }).then(res => {
            this.shoppingCarts(res.data);
            this.updateCartSelected();
            this.setState({ showWaitSign: false, idPedido: 0 })
            this.tooltipRef.toggleTooltip();
        }).catch((error) => {
            console.log(error);
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los pedidos del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    doRemove(){
        axios.put((this.serverBaseRoute + 'rest/user/pedido/individual/eliminar-producto'), {
            idPedido: this.props.shoppingCartSelected.id,
            idVariante: this.props.productSelected.idVariante,
            cantidad: this.state.initialValue - this.state.quantityValue,
        }).then(res => {
            this.getShoppingCarts();
        }).catch((error) => {
            console.log(error);
            this.setState({ buttonLoading: false, buttonDisabled: false })
            if (error.response) {
                Alert.alert('Aviso', error.response.data.error);
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
            } else {
                Alert.alert('Error', "Ocurrio un error al intentar comunicarse con el servidor, intente más tarde o verifique su conectividad.");
            }
        });
    }

    addProductToCart() {
        this.setState({ buttonLoading: true, buttonDisabled: true })
        if (this.state.quantityValue > this.state.initialValue) {
            axios.put((this.serverBaseRoute + 'rest/user/pedido/individual/agregar-producto'), {
                idPedido: this.props.shoppingCartSelected.id,
                idVariante: this.props.productSelected.idVariante,
                cantidad: this.state.quantityValue - this.state.initialValue,
            }).then(res => {
                this.getShoppingCarts()
            }).catch((error) => {
                this.setState({ buttonLoading: false, buttonDisabled: false })
                if (error.response) {                    
                    if(error.response.data.error === "El vendedor por el momento no permite hacer compras o agregar mas productos, intentelo mas tarde."){
                        this.props.actions.resetState({reset:true})
                        Alert.alert('Aviso', "No se permiten hacer compras por el momento, solo puede remover productos. Tenga en cuenta que si remueve productos no podrá agregarlos luego.");
                    }else{  
                    Alert.alert('Aviso', error.response.data.error);
                    }
                } else if (error.request) {
                    Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
                } else {
                    Alert.alert('Error', "Ocurrio un error al intentar comunicarse con el servidor, intente más tarde o verifique su conectividad.");
                }
            });
        } else {
            console.log("vendorSelected",this.props.vendorSelected.ventasHabilitadas )
            if(!this.props.vendorSelected.ventasHabilitadas){
                Alert.alert(
                    'Advertencia',
                    'Si remueve el producto, no podrá volverlo a agregar. ¿Esta seguro de removerlo?',
                    [
                        { text: 'No', onPress: () => this.setState({ buttonLoading: false, buttonDisabled: false }) },
                        { text: 'Si', onPress: () => this.doRemove() },
                    ],
                    { cancelable: false },
                );
            }else{
                this.doRemove()
            }

        }
    }

    equalsQuantity() {
        return this.state.quantityValue === this.state.initialValue
    }


    parseProduct(){
        let item = {
            nombre: this.props.productSelected.nombreProducto,
            idVariante: this.props.productSelected.idVariante,
            precio: this.props.productSelected.precio,
            cantidad: this.state.quantityValue,
            imagen: this.props.productSelected.imagenPrincipal
        }
        return item
    }

    defineText(){
        let text = "Producto Agregado al pedido!";

        if(this.state.quantityValue > this.state.initialValue || this.state.quantityValue < this.state.initialValue){
            text = "Producto Modificado!"
        }
        if(this.state.quantityValue == 0){
            text = "Producto Removido del pedido"
        }
        return text;
    }

    render() {
        return (

            <View>
                <Header containerStyle={styles.topHeader}>
                    <Button
                        icon={
                            <Icon name="bars" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        disabledStyle={styles.rightHeaderButton}
                        disabled={this.state.buttonLoading}
                        loading={this.state.buttonLoading}
                        onPress={() => this.props.navigation.openDrawer()}
                    />
                    <Image
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'contain' }}
                        source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                    />
                    <View>
                        <Button
                            icon={
                                <Icon name="shopping-cart" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.leftHeaderButton}
                            disabledStyle={styles.leftHeaderButton}
                            disabled={this.state.buttonLoading}
                            loading={this.state.buttonLoading}
                            onPress={() => this.setState({ showShoppingCart: !this.state.showShoppingCart })}
                        />
                                            {this.props.shoppingCarts.length > 0 ? (
                    <Badge value={this.props.shoppingCarts.length} status="error" containerStyle={{ position: 'absolute', top: -6, right: -6 }}/>
                    ):(null)}
                        <View style={{position:'absolute',marginLeft:35,marginTop:55}}>
                            <Tooltip containerStyle={{borderColor:'black',borderWidth:1, backgroundColor:"white",height:150, width:300, marginLeft:-135}} ref={(ref) => { this.tooltipRef = ref }} withOverlay={false} 
                            pointerColor='rgba(51, 102, 255, 1)'
                            popover={
                            <View style={{ width:"100%"}}>
                                <View style={{marginTop:5}}>
                                    <Text style={{textAlign:"center", fontWeight:"bold", }}>
                                    {this.defineText()}
                                    </Text>
                                </View>
                                <ProductItemView touchable={false} item={this.parseProduct()}></ProductItemView>
                            </View>
                            }>                                
                            </Tooltip>
                        </View>
                    </View>
                    
                </Header>



                <ScrollView style={styles.productPageContainer} >

                    <View style={styles.topSectionContainer}>
                        {this.props.productSelected.destacado ? (<Text style={styles.featuredTag}>Destacado</Text>) : (<Text style={{ marginTop: -10 }}></Text>)}
                        <Text style={styles.productNameStyle}>{this.props.productSelected.nombreProducto}</Text>
                        {this.state.images.length > 0 ? (

                            <SliderBox images={this.state.images}
                                sliderBoxHeight={280}
                                dotColor='rgba(51, 102, 255, 1)'
                                inactiveDotColor='white'
                                circleLoop
                            />
                        ) : (<Image style={{ width: Dimensions.get("window").width, height: 280, alignSelf: 'center', resizeMode: 'contain', backgroundColor: "white" }}
                            source={{ uri: null }}
                            PlaceholderContent={<ActivityIndicator />}
                        />)
                        }
                    </View>
                    <Text style={styles.priceStyle}>$ {this.props.productSelected.precio}</Text>
                    <ScrollView style={styles.descriptionViewContainer}>
                        <View style={{ height: 100 }}>
                            <WebView
                                originWhitelist={["*"]}
                                scalesPageToFit={false}
                                style={{ backgroundColor: "transparent" }}
                                containerStyle={{}}
                                source={{ html: this.props.productSelected.descripcion }}
                            />
                        </View>
                    </ScrollView>
                    <View style={styles.caracteristicsContanierStyle}>
                        <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5, marginBottom: 5 }}>
                            <Text style={styles.caracteristicsStyle} >Caracteristicas</Text>
                            <View style={styles.verticalDivisor} />
                            <Button icon={
                                this.state.showCaracteristics ? (
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
                                containerStyle={styles.buttonCaracteristicsContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                onPress={() => this.showCaracteristics()}></Button>
                        </View>
                        {this.state.showCaracteristics ?
                            (
                                <View>
                                    <View>
                                        <View style={styles.divisor} />
                                        <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5, marginBottom: 5 }}>
                                            <Text style={styles.producerStyle}>{this.props.productSelected.nombreFabricante}</Text>
                                            <View style={styles.verticalDivisor} />
                                            <Button icon={
                                                <Icon
                                                    name='caret-right'
                                                    type='font-awesome'
                                                    color='#b0b901'
                                                    size={30}
                                                />}
                                                containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                                onPress={() => this.goToProducer()}></Button>
                                        </View>
                                    </View>
                                    {this.haventSeals() ? (null) : (
                                        <View>
                                            <View style={styles.divisor} />
                                            <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5, marginBottom: 5 }}>
                                                <SealsView sealsContainer={styles.sealsContainer} sealsStyle={styles.sealsStyle} productSeals={this.props.productSelected.medallasProducto} producerSeals={this.props.productSelected.medallasProductor} ></SealsView>
                                                <View style={styles.verticalDivisor} />
                                                <Button icon={
                                                    <Icon
                                                        name='caret-right'
                                                        type='font-awesome'
                                                        color='#b0b901'
                                                        size={30}
                                                    />}
                                                    containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                                    onPress={() => this.goToSeals()}></Button>
                                            </View></View>)
                                    }
                                </View>
                            ) : (null)
                        }
                    </View>
                    <View style={{ marginTop: 20 }}></View>
                    {
                        this.props.shoppingCartSelected.id !== undefined ?
                            (
                                <View style={styles.singleItemContainer}>
                                    <QuantitySelector vendorAllowSells={this.props.vendorSelected.ventasHabilitadas} disabled={this.state.buttonLoading} functionValueComunicator={(value, change) => this.setQuantityValue(value, change)} text={"Cantidad : "} initialValue={this.state.initialValue.toString()}></QuantitySelector>
                                </View>
                            )
                            :
                            (null)
                    }
                    <View style={styles.singleItemContainer}>
                        {this.props.shoppingCartSelected.id === undefined ?
                            (<Text style={styles.totalPriceCartStyle}> No posee un pedido seleccionado </Text>)
                            :
                            (<Text style={styles.totalPriceCartStyle}> Total del pedido: $ {this.props.shoppingCartSelected.montoActual} </Text>)
                        }

                    </View>
                    {this.props.shoppingCartSelected.id !== undefined ? (
                        <View style={styles.singleItemContainer}>
                            <Button
                                onPress={() => this.addProductToCart()}
                                titleStyle={{ color: "black", fontSize: 20 }}
                                containerStyle={styles.buttonAddProductContainer}
                                disabled={this.state.buttonDisabled}
                                loading={this.state.buttonLoading}
                                buttonStyle={styles.buttonAddProductStyle} title={this.state.initialValue > 0 ? "Modificar" : "Agregar"}></Button>
                        </View>) : (
                            <View style={styles.singleItemContainer}>
                                <Button
                                    onPress={() => this.showShoppingCart()}
                                    titleStyle={{ color: "black", fontSize: 20 }}
                                    containerStyle={styles.buttonAddProductContainer}
                                    buttonStyle={styles.buttonAddProductStyle} title="Seleccionar pedido"></Button>
                            </View>
                        )

                    }
                </ScrollView>
                <OverlayShoppingCartView
                    showFilter={() => this.showShoppingCart()}
                    isVisible={this.state.showShoppingCart}
                    navigation={this.props.navigation}>

                </OverlayShoppingCartView>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
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
        height: 35,
    },

    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: -20,
        marginStart: -15,
        marginEnd: -13,
        marginTop: -14.5,
        marginBottom: 0,
    },

    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 15,
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

    productPageContainer: {
        marginBottom: 80,
    },

    topSectionContainer: {
        backgroundColor: "white"
    },

    featuredTag: {
        color: "green",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 5
    },
    productNameStyle: {
        fontSize: 22,
        height: 60,
        marginLeft: 20,
        marginRight: 20,
        textAlign: 'justify'
    },

    priceStyle: {
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 15,
        marginLeft: 20,
        marginRight: 20,
    },

    descriptionViewContainer: {
        height: 100,
        marginBottom: 5,
        marginLeft: 15,
        marginRight: 15
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
        height: "125%",
        alignSelf: "center"
    },

    caracteristicsStyle: {
        height: 30,
        fontSize: 17,
        flex: 23,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
    },

    producerStyle: {
        height: 40,
        flex: 23,
        fontSize: 15,
        alignSelf: "center",
        textAlign: 'justify'
    },

    buttonProducerContainerStyle: {

        flex: 5,
        alignSelf: "center",
    },

    buttonCaracteristicsContainerStyle: {
        flex: 5,
        alignSelf: "center",
    },



    buttonProducerStyle: {
        height: null,
        backgroundColor: "transparent"
    },

    sealsContainer: {
        flexDirection: "row",
        flex: 23,
        height: 50,
    },

    sealsStyle: {
        height: 50,
        width: 50,

    },

    singleItemContainer: {
        marginBottom: 5,
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 20,
        marginRight: 20,
    },

    totalPriceCartStyle: {
        alignSelf: "center",
        marginTop: 10,
        fontSize: 20,
    },

    buttonAddProductStyle: {
        height: "100%",
        backgroundColor: "#f8f162",
    },

    buttonAddProductContainer: {

    },

});

export default ProductView
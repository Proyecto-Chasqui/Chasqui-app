import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Header, Button, Icon, Image } from 'react-native-elements';
import GLOBALS from '../Globals';
import SealsView from '../components/catalogViewComponents/SealsView';
import QuantitySelector from '../components/catalogViewComponents/QuantitySelectorView';
import WebView from 'react-native-webview'
import { ScrollView } from 'react-native-gesture-handler';

class ProductView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state={
            showCaracteristics:false,
        }
        this.serverBaseRoute = GLOBALS.BASE_URL;
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    showCaracteristics(){
        this.setState({
            showCaracteristics: !this.state.showCaracteristics,
        });
        return this.state.showCaracteristics;
    }
    
    componentWillUnmount() {
    }

    haventSeals(){
        return this.props.productSelected.medallasProducto === null && this.props.productSelected.medallasProductor.length == 0  ;
    }

    getProducer(){
        let varProducer = {}
        this.props.producers.map((producer, i) => {
            if(producer.idProductor === this.props.productSelected.idFabricante){
                varProducer = producer;
            }
        });
        return varProducer;
    }
    
    async goToSeals(){
        let sealsSelected = [];
        await this.props.seals.map((seal, i) => {
            if(this.props.productSelected.medallasProducto !== null){
                this.props.productSelected.medallasProducto.map((productSeal, i) => {
                    if(seal.nombre === productSeal.nombre){
                        sealsSelected.push(seal);
                    }
                })
            }
            if(this.props.productSelected.medallasProductor !== null){
                this.props.productSelected.medallasProductor.map((producerSeal, i) => {
                    if(seal.nombre === producerSeal.nombre){
                        sealsSelected.push(seal);
                    }
                })
            }
        })
        this.props.actions.sealsSelected(sealsSelected);
        this.props.navigation.navigate("Sellos");
    }

    async normalizeData(data){
        let regex = /(<([^>]+)>)/ig;
        data = await data.replace(regex, '');
        data = await data.replace('&oacute;','ó');
        data = await data.replace('&iexcl;','¡');
        data = await data.replace('&aacute;','á');
        data = await data.replace('&eacute;','é');
        data = await data.replace('&iacute;','í');
        data = await data.replace('&uacute;','ú');
        data = await data.replace('&ntilde;','ñ');
        data = await data.replace('&nbsp;',' ');
    }

    async goToProducer(){       
        let producer = this.getProducer();   
        this.props.actions.producerSelected(producer);
        this.props.navigation.navigate("Fabricante");
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
                        onPress={() => this.props.navigation.openDrawer()}
                    />
                    <Image
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'contain' }}
                        source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                    />
                    <Button
                        icon={
                            <Icon name="shopping-cart" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.leftHeaderButton}
                        onPress={() => null}
                    />
                </Header>

                <ScrollView style={styles.productPageContainer} >
                    
                    <View style={styles.topSectionContainer}>
                        {this.props.productSelected.destacado ? (<Text style={styles.featuredTag}>Destacado</Text>) : (<Text style={{marginTop: -10}}></Text>)}
                        <Text style={styles.productNameStyle}>{this.props.productSelected.nombreProducto}</Text>
                        <Image
                            style={{ width: null, height: 280, alignSelf: 'center', resizeMode: 'contain' }}
                            source={{ uri: this.normalizeText(this.serverBaseRoute + this.props.productSelected.imagenPrincipal) }}
                        />
                    </View>
                    <Text style={styles.priceStyle}>$ {this.props.productSelected.precio}</Text>
                    <ScrollView style={styles.descriptionViewContainer}>
                        <View style={{ height: 100 }}>
                                <WebView
                                    scalesPageToFit={false}
                                    style={{backgroundColor:"transparent"}}
                                    containerStyle={{ }}
                                    source={{ html: this.props.productSelected.descripcion }}
                                />
                        </View>
                    </ScrollView>
                    <View style={styles.caracteristicsContanierStyle}>
                        <View style={{ flexDirection: "row", marginLeft: 20, marginTop: 5, marginBottom: 5 }}>
                            <Text style={styles.caracteristicsStyle} >Caracterisiticas</Text>
                            <View style={styles.verticalDivisor} />
                            <Button icon={
                                this.state.showCaracteristics?(
                                    <Icon
                                    name='caret-up'
                                    type='font-awesome'
                                    color='#b0b901'
                                    size={30}
                                />):(<Icon
                                    name='caret-down'
                                    type='font-awesome'
                                    color='#b0b901'
                                    size={30}
                                    />)}
                                containerStyle={styles.buttonProducerContainerStyle} buttonStyle={styles.buttonProducerStyle}
                                onPress={() => this.showCaracteristics()}></Button>                      
                        </View>
                        { this.state.showCaracteristics?
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
                                onPress={()=>this.goToProducer()}></Button>
                        </View>
                        </View>
                        {this.haventSeals() ? (null):(
                            <View>
                        <View style={styles.divisor} />
                        <View style={{ flexDirection: "row", marginLeft: 20,  marginTop: 5, marginBottom: 5 }}>
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
                                onPress={()=>this.goToSeals()}></Button>
                        </View></View>)
                        }
                        </View>
                        ):(null)
                        }
                    </View>
                    <View style={{marginTop:20}}></View>
                    <View style={styles.singleItemContainer}>
                        <QuantitySelector text={"Cantidad : "}></QuantitySelector>
                    </View>
                    <View style={styles.singleItemContainer}>
                        <Text style={styles.totalPriceCartStyle}> El total de tu pedido : $ 0 </Text>
                    </View>
                    <View style={styles.singleItemContainer}>
                        <Button titleStyle={{color:"black", fontSize:20}} containerStyle={styles.buttonAddProductContainer} buttonStyle={styles.buttonAddProductStyle} title="Agregar"></Button>
                    </View>
                </ScrollView>
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
        marginBottom:80,
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

    descriptionViewContainer:{
        height: 100,
        marginBottom: 5,
        marginLeft: 15,
        marginRight:15
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
        width: "90%",
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 8,
    },

    producerStyle: {
        height: 40,
        width: "90%",
        fontSize: 15,
        alignSelf: "center",
        textAlign: 'justify'
    },

    buttonProducerContainerStyle: {
        alignSelf: "center",
        width: "10%",
        marginRight: 20,
    },

    buttonProducerStyle: {
        height: null,
        backgroundColor: "transparent"
    },

    sealsContainer: {
        flexDirection: "row",
        width: "90%",
        height: 50,
    },

    sealsStyle: {
        height: 50,
        width: 50,

    },

    singleItemContainer:{
        marginBottom:5,
        height:50,
        borderRadius:5,
        borderWidth:1,
        borderColor:"grey",
        marginLeft:20,
        marginRight:20,
    },

    totalPriceCartStyle:{
        alignSelf:"center",
        marginTop:10,
        fontSize:20,      
    },

    buttonAddProductStyle:{
        height:"100%",
        backgroundColor: "#f8f162",
    },

    buttonAddProductContainer:{

    },

});

export default ProductView
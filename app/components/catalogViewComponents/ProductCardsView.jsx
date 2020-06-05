import React from 'react'
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Card, Badge, Icon, Image, Button, Avatar  } from 'react-native-elements';
import GLOBALS from '../../Globals';
import SealsView from '../catalogViewComponents/SealsView';


class ProductCardsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.catalogViewModes = GLOBALS.CATALOG_VIEW_MODES;
        this.navigation = props.navigation;
        this.size = (props.size != undefined) ? (props.size) : (2);
        this.vendorSelected = this.props.vendorSelected
        this.state = {
            unmounted:true
        }
    }

    componentDidMount(){
        this.setState({unmounted:false})
    }

    componentWillUnmount(){
        this.setState({unmounted:true})
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    goToProductDetails(product) {
        this.props.actions.productSelected(product);
        this.navigation.navigate('Producto');
    }

    definePrice(item){
            if(this.vendorSelected.few.nodos && this.vendorSelected.few.usaIncentivos){
                return item.precio + item.incentivo
            }else{
                return item.precio
            }
    }

    render() {
        if (this.props.products.length < 1 || this.state.unmounted) {
            return (
                <View style={stylesMultipleCards.viewSearchErrorContainer}>
                    <View style={stylesMultipleCards.viewErrorContainer}>
                        <View style={stylesMultipleCards.searchIconErrorContainer}>
                            <Icon name="search" type='font-awesome' size={50} color={"white"} containerStyle={stylesMultipleCards.searchIconError}></Icon>
                        </View>
                        <Text style={stylesMultipleCards.errorText}>
                            No se encontraron productos
                    </Text>
                        <Text style={stylesMultipleCards.tipErrorText}>
                            Revise los filtros o la búsqueda
                    </Text>
                    </View>
                </View>
            );
        }
        if (this.props.viewSelected === undefined || this.props.viewSelected === this.catalogViewModes.TWOCARDS || this.props.viewSelected === this.catalogViewModes.SINGLECARD) {
            let stylesCards = this.props.viewSelected === this.catalogViewModes.TWOCARDS ? stylesMultipleCards : stylesSingleCards;
            return (
                <FlatList numColumns={this.props.size} key={this.props.size} windowSize={15} data={this.props.products} renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => this.goToProductDetails(item)} style={stylesCards.wiewCard}>
                        <Card containerStyle={stylesCards.card}>
                            <View style={stylesCards.cardImageView}>
                                <Image onStartShouldSetResponder={() => null} style={stylesCards.cardImage} PlaceholderContent={<ActivityIndicator size="large" color="#0000ff" />} source={{ uri: (this.normalizeText(this.serverBaseRoute + item.imagenPrincipal)) }} />
                            </View>
                            {item.destacado ?
                                (<Badge badgeStyle={stylesCards.badge} containerStyle={stylesCards.tagDestacado}
                                    value={<Text style={stylesCards.textBadge}>Destacado</Text>} />
                                ) : (
                                    <Badge badgeStyle={stylesCards.invisibleBadge} containerStyle={stylesCards.tagDestacado}
                                    value={<Text style={stylesCards.textBadge}></Text>} />)
                            }
                            <View style={{ flexDirection: "column" }}>
                                <View>
                                    <Text style={stylesCards.priceStyle}>$ {this.definePrice(item)}</Text>
                                </View>
                                <ScrollView style={{ height: 80 }}>
                                    <Text style={stylesCards.nameTextStyle}>{item.nombreProducto}</Text>
                                </ScrollView>
                                <ScrollView style={{ height: 50}}>
                                    <Text style={stylesCards.nameProducerTextStyle}>{item.nombreFabricante}</Text>
                                </ScrollView>
                                <SealsView sealsContainer={stylesCards.sealContainerStyle}
                                    sealsStyle={stylesCards.sealStyle}
                                    productSeals={item.medallasProducto}
                                    producerSeals={item.medallasProductor} >
                                </SealsView>
                            </View>
                        </Card>
                    </TouchableOpacity>
                }
                    keyExtractor={item => item.idProducto}
                >
                </FlatList>
            )
        }
        if (this.props.viewSelected === this.catalogViewModes.LIST) {
            return (
                <FlatList data={this.props.products} keyExtractor={item => item.idProducto} windowSize={15} renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => this.goToProductDetails(item)} style={{ borderBottomColor:"#e1e1e1", borderBottomWidth:2}}>
                        <View style={stylesListCard.containerList}>
                        <View style={stylesListCard.cardImageView}>
                            <Avatar overlayContainerStyle={stylesListCard.overlayAvatarContainer} rounded size={100} source={{ uri: (this.normalizeText(this.serverBaseRoute + item.imagenPrincipal)) }} renderPlaceholderContent={<ActivityIndicator size="large" color="#0000ff" />}/>
                        </View>
                        {item.destacado ?
                                (<Badge badgeStyle={stylesListCard.badge} containerStyle={stylesListCard.tagDestacado}
                                    value={<Text style={stylesListCard.textBadge}>Destacado</Text>} />
                                ) : (
                                    null)
                            }
                        <View style={{ flex:2, height: 170 }}>                            
                            <ScrollView style={{ height: 130 }}>
                                <Text style={stylesListCard.nameTextStyle}>{item.nombreProducto}</Text>
                            </ScrollView>
                            <ScrollView style={{ height: 100, }}>
                                    <Text style={stylesListCard.nameProducerTextStyle}>{item.nombreFabricante}</Text>
                            </ScrollView>
                            <SealsView sealsContainer={stylesMultipleCards.sealContainerStyle}
                                    sealsStyle={stylesMultipleCards.sealStyle}
                                    productSeals={item.medallasProducto}
                                    producerSeals={item.medallasProductor} >
                            </SealsView>
                            <View  style={{ height: 30}}>
                                <Text style={stylesMultipleCards.priceStyle}>$ {this.definePrice(item)}</Text>
                            </View>

                        </View>
                        </View>
                    </TouchableOpacity>

                } />)
        }
    }
}

const stylesListCard = StyleSheet.create({
    containerList:{
        flexDirection:"row",
        margin:10
    },

    overlayAvatarContainer:{
        backgroundColor: 'transparent',
        marginTop:25,
        marginBottom:-25,
    },

    cardImageView: {
        flex:1,
        height:"100%",
    },
    cardImageContainer:{
        borderWidth: 1,
        borderRadius:50,
        backgroundColor:"green",

    },
    cardImage: {
        width:null,
        height: null,
        marginLeft: 0,
        marginRight: 0,
        borderRadius:50,
        resizeMode: 'contain',
    },

    nameTextStyle: {
        fontSize: 13,
        alignSelf: 'flex-start',
        fontWeight: "bold",
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    badge: {
        marginTop:10,
        marginLeft:2,
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
        position:"absolute",
        alignSelf: 'flex-start',
    },

    nameTextStyle: {
        fontSize: 13,
        alignSelf: 'flex-start',
        fontWeight: "bold",
        alignContent: 'center',
        alignContent: 'center'
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

const stylesMultipleCards = StyleSheet.create({
    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        marginTop: 230
    },

    errorText: {
        marginTop: 7,
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    tipErrorText: {
        marginTop: 7,
        fontSize: 16,
        alignSelf: 'center'
    },

    searchIconErrorContainer: {
        backgroundColor: "grey",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },


    flexView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 135,
        flexWrap: 'wrap',
    },

    flexViewCentered: {
        flex: 1,
        flexDirection: 'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',
    },

    viewTagsOrgAndSellStrat: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    viewBadgesTOrg: {
        width: "65%",
        position: 'relative',
        marginTop: -15,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },

    backgroundBadge: {
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginLeft: 4
    },

    viewBadgesSellStrat: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        position: 'relative',
        marginTop: -15,
        marginLeft: 5,
        marginRight: -5
    },

    badgeImage: {
        height: 30,
        width: 30,
    },

    viewTagsZonesAndSellModes: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginRight: -5
    },

    viewBadgesSellingModes: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 0,
        borderRadius: 5,
    },

    backgroundSellModeBadge: {
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        alignItems: 'flex-end',
        marginLeft: 4
    },

    viewZones: {
        position: 'relative',
        marginTop: 0,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
        width: '80%',
    },

    viewProducts: {
        position: 'relative',
        width: '104%',
        marginTop: 1,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    invisibleBadge: {
        marginTop: -15,
        backgroundColor: 'transparent',
        height: 30,
        borderRadius: 5,
        borderColor: "transparent",
        alignSelf: 'flex-start'
    },

    badge: {
        marginTop: -15,
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

    badgeProductos: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },

    tagDestacado: {
        alignSelf: 'flex-start',
    },

    wiewCard: {
        width: "50%",
    },

    card: {
        height: 415,
        borderRadius: 2,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },

    cardImageView: {
        marginTop: -15,
        marginLeft: -15,
        marginRight: -15,
    },

    cardImage: {
        width: null,
        height: 150,
        marginLeft: 0,
        marginRight: 0,
        resizeMode: 'cover',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2,
    },

    cardText: {
        textAlign: "left",
        marginTop: 0
    },

    priceStyle: {
        fontSize: 20,
        alignSelf: 'flex-start'
    },

    nameTextStyle: {
        fontSize: 13,
        alignSelf: 'flex-start',
        fontWeight: "bold",
        alignContent: 'center',
        alignContent: 'center'
    },

    nameProducerTextStyle: {
        fontSize: 10,
        alignSelf: 'flex-start'
    },

    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 55,
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

    containerButtonStyle: {

    },

    buttonStyle: {
        backgroundColor: "#f8f162",
        width: "100%"
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
});

const stylesSingleCards = StyleSheet.create({
    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        marginTop: 230
    },

    errorText: {
        marginTop: 7,
        fontSize: 22,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    tipErrorText: {
        marginTop: 7,
        fontSize: 16,
        alignSelf: 'center'
    },

    searchIconErrorContainer: {
        backgroundColor: "grey",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },


    flexView: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 135,
        flexWrap: 'wrap',
    },

    flexViewCentered: {
        flex: 1,
        flexDirection: 'row',
        marginTop: -9,
        marginBottom: 55,
        flexWrap: 'wrap',
    },

    viewTagsOrgAndSellStrat: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    viewBadgesTOrg: {
        width: "65%",
        position: 'relative',
        marginTop: -15,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },

    backgroundBadge: {
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        alignSelf: 'flex-end',
        marginLeft: 4
    },

    viewBadgesSellStrat: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        position: 'relative',
        marginTop: -15,
        marginLeft: 5,
        marginRight: -5
    },

    badgeImage: {
        height: 30,
        width: 30,
    },

    viewTagsZonesAndSellModes: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 5,
        marginRight: -5
    },

    viewBadgesSellingModes: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 0,
        borderRadius: 5,
    },

    backgroundSellModeBadge: {
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        alignItems: 'flex-end',
        marginLeft: 4
    },

    viewZones: {
        position: 'relative',
        marginTop: 0,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
        width: '80%',
    },

    viewProducts: {
        position: 'relative',
        width: '104%',
        marginTop: 1,
        marginLeft: -5,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        flexWrap: 'wrap',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    badge: {
        marginTop: -15,
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

    badgeProductos: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },

    tagDestacado: {
        alignSelf: 'flex-start',
    },

    wiewCard: {
        width: "100%",
    },

    card: {
        height: 385,
        borderRadius: 2,
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },

    cardImageView: {
        marginTop: -15,
        marginLeft: -15,
        marginRight: -15,
    },

    cardImage: {
        width: null,
        height: 150,
        marginLeft: 0,
        marginRight: 0,
        resizeMode: 'cover',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2
    },

    cardText: {
        textAlign: "left",
        marginTop: 1
    },

    priceStyle: {
        fontSize: 22,
        alignSelf: 'flex-start'
    },

    nameTextStyle: {
        fontSize: 15,
        alignSelf: 'flex-start',
        fontWeight: "bold",
        alignContent: 'center',
        alignContent: 'center'
    },

    nameProducerTextStyle: {
        fontSize: 12,
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

    containerButtonStyle: {

    },

    buttonStyle: {
        backgroundColor: "#f8f162",
        width: "100%"
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
});


export default ProductCardsView;
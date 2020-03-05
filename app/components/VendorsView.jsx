import React from 'react';
import { StyleSheet, View, Text, Alert, Image, ScrollView, Dimensions, Picker, Modal, TouchableHighlight } from 'react-native';
import axios from 'axios';
import LoadingView from '../components/LoadingView';
import { Header, Button, Icon, Overlay, CheckBox ,SearchBar} from 'react-native-elements';
import VendorMultipleCards from '../containers/VendorMultipleCards';
import GLOBALS from '../Globals';

class VendorsView extends React.Component {

    constructor(props) {
        super(props);
        this.vendors = props.actions.vendors;
        this.vendorTags = props.actions.vendorTags;
        this.productSeals = props.actions.productSeals;
        this.productionSeals = props.actions.productionSeals;
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.minWidth = false,
        this.state = {
            search: '',
            isLoadingFilterVendors:false,            
            isLoading: true,
            multipleCards: false,
            maxTagTextLength: 32,
            isVisible: false,
            isLoadingVendors: true,
            isLoadingTags: true,
            isLoadingProductionSeals: true,
            isLoadingProductSeals: true,
            showTypeOrganizacionSet: false,
            showTypeProductSet: false,
            showZoneCoverage: false,
            showSellingModes: false,
            filtersHasChange: false,
            dataChecksTipoOrganizacion: [],
            dataChecksZonaEntrega: [],
            dataChecksTipoProducto: [],
            selectedTagsTipoOrganizacion: [],
            selectedTipoProducto: [],
            selectedTagsZonaDeCobertura: [],
            dataCheckHomeDelivery: false,
            dataCheckOnSiteDelivery: false,            
            dataCheckIndividualMode: false,
            dataCheckGroupMode: false,
            dataCheckNodeMode: false,
        };
    }
    
    updateSearch = search => {
        this.setState({ search: search, filtersHasChange: true });
    };

    switchStyle() {
        this.setState({
            multipleCards: !this.state.multipleCards,
            maxTagTextLength: (this.state.maxTagTextLength === 32) ? 16 : 32
        });
    }

    showFilters() {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    componentWillMount() {
        this.getVendors(this.props);
        this.getVendorsTags(this.props);
    }

    screenLowerThan(value, styleA, styleB) {
        if (Dimensions.get('window').width < value) {
            return styleB;
        }
        return styleA;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.filtersHasChange) {
            this.getFilterVendors();
            this.setState({ filtersHasChange: false });
        }
    }

    getFilterVendors() {
        let props = this.props;
        this.setState({
            isLoadingFilterVendors: true
        });
        axios.post( this.serverBaseRoute + 'rest/client/vendedor/obtenerVendedoresConTags/', {
            idsTagsTipoOrganizacion: this.state.selectedTagsTipoOrganizacion,
            idsTagsTipoProducto: this.state.selectedTipoProducto,
            idsTagsZonaDeCobertura: this.state.selectedTagsZonaDeCobertura,
            nombre: this.state.search === undefined ? "" : this.state.search,
            usaEstrategiaNodos: this.state.dataCheckNodeMode,
            usaEstrategiaGrupos: this.state.dataCheckGroupMode,
            usaEstrategiaIndividual:  this.state.dataCheckIndividualMode,
            entregaADomicilio:  this.state.dataCheckHomeDelivery,
            usaPuntoDeRetiro: this.state.dataCheckOnSiteDelivery,
        }).then(res => {
                this.vendors(res.data);
                this.setState({
                    isLoadingFilterVendors: false
                });
        }).catch(function (error) {

            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los vendedores, vuelva a intentar mas tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    getVendors(props) {
        axios.get(this.serverBaseRoute + 'rest/client/vendedor/all')
            .then(res => {
                this.vendors(res.data);

                this.setState({
                    isLoadingVendors: false,
                });
            }).catch(function (error) {

                Alert.alert(
                    'Error',
                    'Ocurrio un error al obtener los vendedores, vuelva a intentar mas tarde.',
                    [
                        { text: 'Entendido', onPress: () => props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            });
    }

    getVendorsTags(props) {
        axios.get(this.serverBaseRoute + 'rest/client/vendedor/obtenerTags')
            .then(res => {
                this.vendorTags(res.data);
                this.constructDataForChecked(res.data);
                this.setState({
                    isLoadingTags: false,
                });
            }).catch(function (error) {
                Alert.alert(
                    'Error',
                    'Ocurrio un error al obtener los datos de tags, vuelva a intentar mas tarde.',
                    [
                        { text: 'Entendido', onPress: () => props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            });
    }

    onCheckChangedOrganizacion(id) {
        const data = this.state.dataChecksTipoOrganizacion;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        this.setState({
            filtersHasChange: true,
            selectedTagsTipoOrganizacion: selectedItems,
            dataChecksTipoOrganizacion: data,
        });
    }

    onCheckChangedProducto(id) {
        const data = this.state.dataChecksTipoProducto;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        this.setState({
            filtersHasChange: true,
            selectedTipoProducto: selectedItems,
            dataChecksTipoProducto: data,
        });
    }

    onCheckChangedZonasDeEntrega(id) {
        const data = this.state.dataChecksZonaEntrega;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        this.setState({
            filtersHasChange: true,
            selectedTagsZonaDeCobertura: selectedItems,
            dataChecksZonaEntrega: data,
        });
    }

    unCheckAll() {
        const dataZona = this.state.dataChecksZonaEntrega;
        const dataOrga = this.state.dataChecksTipoOrganizacion;
        const dataProducto = this.state.dataChecksTipoProducto;
        dataZona.map((u, i) => {
            u.checked = false;
        });
        dataOrga.map((u, i) => {
            u.checked = false;
        });
        dataProducto.map((u, i) => {
            u.checked = false;
        });

        this.setState({
            filtersHasChange: true,
            showTypeOrganizacionSet: false,
            showTypeProductSet: false,
            showZoneCoverage: false,
            showSellingModes: false,
            showDeliveryType: false,
            dataChecksTipoOrganizacion: dataOrga,
            dataChecksZonaEntrega: dataZona,
            dataChecksTipoProducto: dataProducto,
            selectedTagsTipoOrganizacion: [],
            selectedTipoProducto: [],
            selectedTagsZonaDeCobertura: [],
            dataCheckHomeDelivery: false,
            dataCheckOnSiteDelivery: false,            
            dataCheckIndividualMode: false,
            dataCheckGroupMode: false,
            dataCheckNodeMode: false,
        });

    }

    showTypeOrganizacionSet(){
        this.setState({
            showTypeOrganizacionSet: !this.state.showTypeOrganizacionSet,
            showTypeProductSet: false,
            showZoneCoverage: false,
            showDeliveryType: false,
            showSellingModes: false,
        })
    }

    showTypeProductSet(){
        this.setState({
            showTypeOrganizacionSet: false,
            showTypeProductSet: !this.state.showTypeProductSet,
            showZoneCoverage: false,
            showDeliveryType: false,
            showSellingModes: false,
        })
    }

    showZoneCoverage(){
        this.setState({
            showTypeOrganizacionSet: false,
            showTypeProductSet: false,
            showZoneCoverage: !this.state.showZoneCoverage,
            showDeliveryType: false,
            showSellingModes: false,
        })
    }

    showDeliveryType(){
        this.setState({
            showTypeOrganizacionSet: false,
            showTypeProductSet: false,
            showZoneCoverage: false,
            showDeliveryType: !this.state.showDeliveryType,
            showSellingModes: false,
        })
    }

    showSellingModes(){
        this.setState({
            showTypeOrganizacionSet: false,
            showTypeProductSet: false,
            showZoneCoverage: false,
            showDeliveryType: false,
            showSellingModes: !this.state.showSellingModes,
        })
    }

    constructDataForChecked(data) {
        const checksTipoOrganizacion = [];
        const checksTipoProducto = [];
        const checksZonaEntrega = [];
        data.tagsTipoOrganizacion.map((u, i) => {
            checksTipoOrganizacion.push({ id: u.id, checked: false });
        })
        data.tagsTipoProducto.map((u, i) => {
            checksTipoProducto.push({ id: u.id, checked: false });
        })
        data.tagsZonaDeCobertura.map((u, i) => {
            checksZonaEntrega.push({ id: u.id, checked: false });
        })
        this.setState({
            dataChecksTipoOrganizacion: checksTipoOrganizacion,
            dataChecksTipoProducto: checksTipoProducto,
            dataChecksZonaEntrega: checksZonaEntrega
        })
    }


    render() {

        if (this.state.isLoadingVendors || this.state.isLoadingTags) {
            return <LoadingView></LoadingView>;
        }

        return (
            <View style={{ marginBottom: 75 }}>
                <Overlay containerStyle={styles.overlayContainer}
                    overlayStyle={styles.overlay}
                    windowBackgroundColor="rgba(0, 0, 0, 0.3)"
                    onBackdropPress={() => this.showFilters()} isVisible={this.state.isVisible}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, marginTop: -6}}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ alignSelf: 'flex-start', marginLeft: 15, fontSize: 15, fontWeight: 'bold' }}>Buscar Por:</Text>
                        </View>
                        <Button titleStyle={styles.searchButtonResetTitle} buttonStyle={styles.searchButtonReset} type="clear" title="Limpiar Filtros"
                            onPress={() => this.unCheckAll()} />
                    </View>
                <ScrollView style={styles.scrollViewFilters}>
                    <View style={styles.divisor}/>
                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Tipo de organización"
                        onPress={() => this.showTypeOrganizacionSet()} icon={<Icon iconStyle={styles.iconRevealButton}  name="caret-down" iconRight={true} size={20} color="blue" type='font-awesome' />
                    } iconRight/>
                    {this.state.showTypeOrganizacionSet ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>
                                {this.props.vendorTags.tagsTipoOrganizacion.map((u, i) => {
                                    return (<CheckBox title={u.nombre} key={u.id} checked={this.state.dataChecksTipoOrganizacion[i].checked}
                                        onPress={() => this.onCheckChangedOrganizacion(u.id)}
                                    />);
                                })
                                }
                            </ScrollView>
                        </View>
                        : null}

                    <View style={styles.divisor}/>                    
                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Tipo de producto"
                        onPress={() => this.showTypeProductSet()} icon={<Icon iconStyle={styles.iconRevealButton}  name="caret-down" iconRight={true} size={20} color="blue" type='font-awesome' />
                    } iconRight/>                   
                    {this.state.showTypeProductSet ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>
                                {this.props.vendorTags.tagsTipoProducto.map((u, i) => {
                                    return (<CheckBox title={u.nombre}  key={u.id} checked={this.state.dataChecksTipoProducto[i].checked}
                                        onPress={() => this.onCheckChangedProducto(u.id)}
                                    />);
                                })
                                }
                            </ScrollView>
                        </View>
                        : null}

                    <View style={styles.divisor}/>
                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Zona de entrega"
                        onPress={() => this.showZoneCoverage()} icon={<Icon iconStyle={styles.iconRevealButton}  name="caret-down"  iconRight={true} size={20} color="blue" type='font-awesome' />
                    } iconRight/>   
                    {this.state.showZoneCoverage ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>
                                {this.props.vendorTags.tagsZonaDeCobertura.map((u, i) => {
                                    return (<CheckBox title={u.nombre}  key={u.id} checked={this.state.dataChecksZonaEntrega[i].checked}
                                        onPress={() => this.onCheckChangedZonasDeEntrega(u.id)}
                                    />);
                                })
                                }
                            </ScrollView>
                        </View>
                        : null}
                    
                    <View style={styles.divisor}/>
                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Tipo de entrega"
                        onPress={() => this.showDeliveryType()} icon={<Icon iconStyle={styles.iconRevealButton}  name="caret-down"  iconRight={true} size={20} color="blue" type='font-awesome' />
                    } iconRight/>                       
                    {this.state.showDeliveryType ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>                                                               
                                <CheckBox title="Entrega a domicilio" checked={this.state.dataCheckHomeDelivery}
                                        checkedIcon={<Image style={styles.badgeFilterSelected} source={require('./vendorsViewComponents/badge_icons/entrega_domicilio.png')} />}
                                        uncheckedIcon={<Image style={styles.badgeFilterUnselected} source={require('./vendorsViewComponents/badge_icons/entrega_domicilio.png')} />}
                                        onPress={() => 
                                            this.setState({
                                                dataCheckHomeDelivery: !this.state.dataCheckHomeDelivery,
                                                filtersHasChange: true,
                                            }) }
                                    />
                                <CheckBox title="Punto de retiro" checked={this.state.dataCheckOnSiteDelivery}
                                        checkedIcon={<Image style={styles.badgeFilterSelected} source={require('./vendorsViewComponents/badge_icons/entrega_lugar.png')} />}
                                        uncheckedIcon={<Image style={styles.badgeFilterUnselected} source={require('./vendorsViewComponents/badge_icons/entrega_lugar.png')} />}
                                        onPress={() => 
                                            this.setState({
                                                dataCheckOnSiteDelivery: !this.state.dataCheckOnSiteDelivery,
                                                filtersHasChange: true,
                                            }) }
                                    />
                            </ScrollView>
                        </View>
                        : null}
                    
                    <View style={styles.divisor}/>
                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Modo de venta"
                        onPress={() => this.showSellingModes()} icon={<Icon iconStyle={styles.iconRevealButton}  name="caret-down"  iconRight={true} size={20} color="blue" type='font-awesome' />
                    } iconRight/> 
                    {this.state.showSellingModes ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>                                                               
                                <CheckBox title="Individual" checked={this.state.dataCheckIndividualMode}
                                        checkedIcon={<Image style={styles.badgeFilterSelected} source={require('./vendorsViewComponents/badge_icons/compra_individual.png')} />}
                                        uncheckedIcon={<Image style={styles.badgeFilterUnselected} source={require('./vendorsViewComponents/badge_icons/compra_individual.png')} />}
                                        onPress={() => this.setState({
                                            dataCheckIndividualMode: !this.state.dataCheckIndividualMode,
                                            filtersHasChange: true,
                                        }) }
                                    />
                                <CheckBox title="Grupal" checked={this.state.dataCheckGroupMode}
                                        checkedIcon={<Image style={styles.badgeFilterSelected} source={require('./vendorsViewComponents/badge_icons/compra_grupal.png')} />}
                                        uncheckedIcon={<Image style={styles.badgeFilterUnselected} source={require('./vendorsViewComponents/badge_icons/compra_grupal.png')} />}
                                        onPress={() => this.setState({
                                            dataCheckGroupMode: !this.state.dataCheckGroupMode,
                                            filtersHasChange: true,
                                        }) }
                                    />
                                <CheckBox title="Nodo" checked={this.state.dataCheckNodeMode}
                                        checkedIcon={<Image style={styles.badgeFilterSelected} source={require('./vendorsViewComponents/badge_icons/compra_nodos.png')} />}
                                        uncheckedIcon={<Image style={styles.badgeFilterUnselected} source={require('./vendorsViewComponents/badge_icons/compra_nodos.png')} />}
                                        onPress={() => this.setState({
                                            dataCheckNodeMode: !this.state.dataCheckNodeMode,
                                            filtersHasChange: true,
                                        }) }
                                    />
                            </ScrollView>
                        </View>
                        : null}
                    <View style={styles.divisor}/>
                    </ScrollView>
                </Overlay>
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
                    {this.minWidth ? (
                    ! this.state.multipleCards ? (<Button
                        icon={
                            <Icon name="th" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.leftHeaderButton}
                        onPress={() => this.switchStyle()}
                    />) : (<Button
                        icon={
                            <Icon name="th-large" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.leftHeaderButton}
                        onPress={() => this.switchStyle()}
                    />)
                    )
                    : 
                    null
                    }                    
                </Header>
                <Header backgroundColor='white' containerStyle={styles.lowerHeaderStyle}
                    leftComponent={
                        <SearchBar
                        placeholder="Tu busqueda comienza aquí"
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                        containerStyle={styles.searchContainer}
                        inputContainerStyle={styles.inputSearchContainer}
                        inputStyle={styles.inputStyle}
                        leftIconContainerStyle={styles.iconContainerLeft}
                        placeholderTextColor={"rgba(51, 102, 255, 1)"}
                        searchIcon={<Icon name="search" type='font-awesome' size={16} iconStyle={styles.searchIcon} />}
                        lightTheme
                      />
                    }
                    rightComponent={
                        <Button
                            icon={<Icon name="caret-down" type='font-awesome' size={20} iconStyle={styles.iconLowerHeaderButton} />}
                            buttonStyle={styles.lowerHeaderButton}
                            onPress={() => this.showFilters()}
                            title="Filtros"
                            titleStyle={styles.lowerHeaderButtonTitle}
                        />
                    }
                />
                {
                    this.state.isLoadingFilterVendors ? 
                        (<LoadingView textStyle={ {
                            position:"absolute",
                            fontSize: 24,
                            marginTop: 5,
                            color: 'black',
                            fontWeight: "bold",
                            marginTop: "100%",
                        }}></LoadingView>)
                        :
                        (<VendorMultipleCards multipleCards={this.state.multipleCards}/>)
                }
            </View>
        );

    }
}



const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)'
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
//Search container

    searchContainer:{       
        marginTop:-20,  
        backgroundColor:"transparent",
        marginLeft:-18,
        borderBottomColor:"transparent",
        borderTopColor:"transparent",
        borderWidth:0,
    },

    inputSearchContainer:{
        backgroundColor:"transparent",
        borderColor:"white",
        marginTop:-5,
        height:30,
        width:"350%",
        borderWidth:0,
    },

    inputStyle:{
        width:"100%",
        fontSize: 13,
        fontWeight: "bold",
        color:"black",
        
    },
    iconContainerLeft:{
        backgroundColor:"transparent",
    },

    searchIcon:{
        color: "rgba(51, 102, 255, 1)",
    },
//end Search container
    lowerHeaderButton: {
        backgroundColor: '#66000000',
        marginLeft: 15,
        borderColor: "grey",
        borderLeftWidth: 1,
        borderRadius: 0,
        width: 100,
        height: 20,
        marginBottom: 25,
        marginLeft: -5
    },

    iconLowerHeaderButton: {
        marginRight: 15,
        color: "rgba(51, 102, 255, 1)"
    },

    lowerHeaderButtonTitle: {
        color: "rgba(51, 102, 255, 1)"
    },

    overlayContainer: {
    },

    overlay: {
        alignSelf:"flex-end",
        width: 300,
        height: "75%" ,
        borderWidth:2,
        borderColor:"#D8D8D8",
    },
    
    scrollViewFilters:{
        marginLeft:-10,
        marginRight:-10
    },

    menuSelectorItems: {
        backgroundColor: null,
        borderTopWidth: 2,
        borderTopColor: "#f4f4f4",
        width:"100%",      
    },

    divisor:{
        borderTopWidth:2,
        borderTopColor:"#D8D8D8",
        marginLeft:-9,
        width:"107%"
    },  

    buttonAndIconContainer:{
        flexDirection:"row",
        width: "104%",
        alignSelf:'flex-end',
    },

    searchButtonReveal: {
        alignSelf: 'center',
        width: "100%",
    },

    searchContainerButtonReveal: {
        flexDirection:"row",
        alignSelf:'flex-start',
        width: "105%",
        marginLeft:-5,
        justifyContent:'space-between'
    },

    titleButtonReveal: {
        color: "black",
        alignSelf:'flex-end',
        width:"70%"
    },

    iconRevealButton:{
        marginLeft:50,
        alignSelf:'flex-end',
        color:"#D7DF01"
    },  

    iconContainer:{
        borderWidth:2,
        borderColor: "#D8D8D8"
    },

    searchButtonResetTitle: {
        color: "rgba(51, 102, 255, 1)"
    },
    
    searchButtonReset: {
        borderColor: "rgba(0, 0, 0, 0)"
    },

    badgeFilterSelected: {
        borderColor:"#BDBDBD",
        backgroundColor: "#81BEF7",
        borderRadius: 5,
        borderWidth: 2
    },

    badgeFilterUnselected:{
        borderColor:"#BDBDBD",
        borderRadius: 5,
        borderWidth: 2
    },
});

export default VendorsView;
import React from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, BackHandler } from 'react-native';
import { Header, Button, Icon, SearchBar, Image,Badge } from 'react-native-elements';
import GLOBALS from '../Globals';
import ProductCardsView from '../containers/CatalogComponentsContainers/ProductCards';
import LoadingView from '../components/LoadingView';
import ProductFilterView from '../containers/CatalogComponentsContainers/ProductFilter';
import OverlayShoppingCartView from '../containers/CatalogComponentsContainers/OverlayShoppingCart';
import base64 from 'react-native-base64'
import axios from 'axios';
import NoSellsWarnOverlayView from '../components/generalComponents/NoSellsWarnOverlayView'
import ShakeEventExpo from '../ShakeEventExpo'

class CatalogView extends React.Component {
    constructor(props) {
        super(props);
        this.products = props.actions.products;
        this.producers = props.actions.producers;
        this.zones = props.actions.zones;
        this.cleanZones = props.actions.cleanZones;
        this.personalData = props.actions.personalData;
        this.adressesData = props.actions.adressesData;
        this.seals = props.actions.seals;
        this.sellerPoints = props.actions.sellerPoints;
        this.cleanSellerPoints = props.actions.cleanSellerPoints;
        this.flushproducts = props.actions.flushproducts;
        this.shoppingCarts = props.actions.shoppingCarts;
        this.allProducts = props.actions.allProducts;
        this.shoppingCartUnselected = props.actions.shoppingCartUnselected;
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.backButtonClick = this.backButtonClick.bind(this);
        this.goBackCatalogs = this.goBackCatalogs.bind(this);
        this.vendorId = 0;
        this.state = {
            search: '',
            isLoadingSearchProducts: false,
            isLoadingFilterComponent: false,
            isLoading: true,
            multipleCards: false,
            isVisible: false,
            showShoppingCart:false,
            isLoadingProducts: true,
            isLoadingProductSeals: true,
            isLoadingProductionSeals: true,
            searchHasChanged: false,
            viewSelected: GLOBALS.CATALOG_VIEW_MODES.TWOCARDS,
            viewSize: 2,
            shakeDetected:false,
        };
        console.log("vendor", this.props.vendorSelected);
    }

    userLogged(){
        let value = false
        if(this.props.user !== undefined){
                value = this.props.user.id !== 0
        }
        return value
    }

    findSelectedGroup() {
        if(this.props.groupSelected !== undefined){
            this.props.groupsData.map((group) => {
                if (group.id === this.props.groupSelected.id) {
                    this.props.actions.groupSelected(group);
                }
            })
        }
      }

    getUserShoppingCarts(){
        if(this.vendorHasAtLeastOneModeOfSelling()){                    
            this.getShoppingCarts(this.props);
        }else{
            this.shoppingCarts([]);
        }
    }
    updateInfo(){
        if (this.props.vendorSelected !== undefined) {
            if(this.userLogged()){
                this.getUserShoppingCarts()
                this.getUnreadNotifications();
                this.getPersonalData(this.props);
                if(this.props.vendorSelected.few.gcc || this.props.vendorSelected.few.nodos){
                    this.getGroups();
                }
            }
        }
    }

    vendorHasAtLeastOneModeOfSelling(){
        return this.props.vendorSelected.few.gcc || this.props.vendorSelected.few.nodos || this.props.vendorSelected.few.compraIndividual
    }

    load() {
        if (this.props.vendorSelected.id !== undefined) {
            if(this.userLogged()){
                this.getUserShoppingCarts();
                this.getUnreadNotifications();
                this.props.actions.shoppingCartUnselected();
                this.getPersonalData(this.props);
                this.getAdressesData(this.props);
                if(this.props.vendorSelected.few.gcc || this.props.vendorSelected.few.nodos){
                    this.getGroups();
                }
            }else{
                this.props.actions.shoppingCartUnselected();
                this.shoppingCarts([]);
            }
            this.vendorId = this.props.vendorSelected.id;
            this.getVendorInfoData();
            this.getProducts(this.props);
            this.getProducers(this.props);
            this.getSeals(this.props);
            this.cleanZones();
            this.cleanSellerPoints();
            if (this.props.vendorSelected.few.seleccionDeDireccionDelUsuario) {
                this.getZones(this.props);
            }
            if (this.props.vendorSelected.few.puntoDeEntrega) {
                this.getSellerPoints(this.props);
            }
        }else{
            this.props.actions.vendorUnSelected();
            this.props.actions.shoppingCartUnselected();
            this.vendorId = 0;        
            this.props.navigation.navigate("Catalogos")
        }
    }

    getVendorInfoData(){
        axios.get((this.serverBaseRoute + 'rest/client/vendedor/datosPortada/'+this.props.vendorSelected.nombreCorto),{},{withCredentials: true})
        .then(res => {
            this.props.actions.infoDataVendorSelected(res.data);
        }).catch( (error) => {
            console.log("error en vandor info",error);
            if (error.response) {
                if(error.response.status === 401){
                    Alert.alert(
                        'Sesion expirada',
                        'Su sesión expiro, se va a reiniciar la aplicación.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }else{
                    Alert.alert(
                        'Error',
                        'Ocurrio un error inesperado, si el problema persiste comuníquese con soporte técnico',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            }
        });
    }

    defineStrategyRoute(){
        let value = ''
        if(this.props.vendorSelected.few.gcc){
            value = 'rest/user/gcc/'
        }
        if(this.props.vendorSelected.few.nodos){
            value = 'rest/user/nodo/'
        }
        return value
    }

    getGroups(){
        axios.get((this.serverBaseRoute + this.defineStrategyRoute() + 'all/'+this.props.vendorSelected.id),{},{withCredentials: true}).then(res => {
            this.props.actions.groupsData(res.data);
            this.findSelectedGroup()
        }).catch( (error) => {
            if (error.response) {
                if(error.response.status === 401){
                    Alert.alert(
                        'Sesion expirada',
                        'Su sesión expiro, se va a reiniciar la aplicación.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }else{
                    Alert.alert(
                        'Error',
                        'Ocurrio un error inesperado, si el problema persiste comuníquese con soporte técnico',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            }
        });
    }

    
    getAdressesData(props) {
        const token = base64.encode(`${props.user.email}:${props.user.token}`);
        axios.get(this.serverBaseRoute + 'rest/user/adm/dir', {
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Basic ${token}`
            },
            withCredentials: true
        }).then(res => {
            this.adressesData(res.data);
        }).catch(function (error) {
            Alert.alert('Error', 'ocurrio un error al obtener los datos del usuario, ¿quizas ingreso desde otro dispositivo?');
        });
    }

    getUnreadNotifications() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/noLeidas',{withCredentials: true}).then(res => {
            this.props.actions.unreadNotifications(res.data);
        }).catch((error) => {
            console.log("error",error)
            if (error.response) {
                if(error.response.status === 401){
                    Alert.alert(
                        'Sesion expirada',
                        'Su sesión expiro, se va a reiniciar la aplicación.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }else{
                    Alert.alert(
                        'Error',
                        'Ocurrio un error inesperado, si el problema persiste comuníquese con soporte técnico',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            }
        });
    }

    getPersonalData(props) {
        const token = base64.encode(`${props.user.email}:${props.user.token}`);
        axios.get(this.serverBaseRoute + 'rest/user/adm/read', {
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Basic ${token}`
            }
            ,withCredentials: true
        }).then(res => {
            this.personalData(res.data);
        }).catch((error) => {
            if (error.response) {
                if(error.response.status === 401){
                    Alert.alert(
                        'Sesion expirada',
                        'Su sesión expiro, se va a reiniciar la aplicación.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }else{
                    Alert.alert(
                        'Error',
                        'Ocurrio un error inesperado, si el problema persiste comuníquese con soporte técnico',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            }
        });
    }

    componentWillUnmount() {
        ShakeEventExpo.removeListener();
        BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
    }

    goBackCatalogs() {
        this.props.actions.vendorUnSelected();
        this.props.actions.shoppingCartUnselected();
        this.vendorId = 0;
        this.props.navigation.goBack(null);
    }

    backButtonClick() {
        if (this.props.navigation && this.props.navigation.canGoBack() && this.props.navigation.dangerouslyGetState().index === 0) {
            if(!this.state.isLoadingProducts){
                Alert.alert(
                    'Pregunta',
                    '¿Desea volver a la lista de catálogos?',
                    [                        
                        { text: 'No', onPress: () => null },
                        { text: 'Si', onPress: () => this.goBackCatalogs()},
                    ],
                    { cancelable: true },
                );
            }else{
                Alert.alert(
                    'Aviso',
                    'Por favor espere a que termine de cargar el catálogo',
                    [,
                        { text: 'Entendido', onPress: () => null },
                    ],
                    { cancelable: true },
                );
            }

            return true;
        }
        return false;
    }

    componentDidUpdate() {
        if (this.props.vendorSelected.id !== undefined) {
            if (this.vendorId != this.props.vendorSelected.id) {
                this.setState({
                    isLoadingProducts: true,
                })
                this.load();
                this.props.navigation.navigate("Catalogo");
            }
        }
        if(this.props.hasReceivedPushNotifications){
            this.updateInfo();
            this.props.actions.hasReceivedPushNotifications(false);
        }
        if(this.props.hasReceivedExpiredCartNotification){
            this.props.actions.shoppingCartUnselected();
            this.props.actions.hasReceivedExpiredCartNotification(false)
        }

    }

    restart(){
        this.props.actions.resetState({ reset: true })
        this.setState({isLoadingProducts:true})
        this.load()
        this.setState({shakeDetected:false})
    }


    componentDidMount() {
        ShakeEventExpo.addListener(() => {            
            if(!this.state.shakeDetected){
                this.setState({shakeDetected:true})
                Alert.alert(
                    'Aviso',
                    '¿Desea actualizar los datos de la aplicación?',
                    [,
                        { text: 'No', onPress: () => this.setState({shakeDetected:false}) },
                        { text: 'Si', onPress: () => this.restart() },
                    ],
                    { cancelable: false },
                );
            }
        });
        BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
        this.load();

    }
   
    getShoppingCarts(props){
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'),{
            idVendedor: props.vendorSelected.id,
            estados: [
              "ABIERTO"
            ]
          },{withCredentials: true}).then(res => {
            this.shoppingCarts(res.data);
        }).catch((error) =>{
            console.log(error);
            if (error.response) {
                if(error.response.status === 401){
                    Alert.alert(
                        'Sesion expirada',
                        'Su sesión expiro, se va a reiniciar la aplicación.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }else{
                    Alert.alert(
                        'Error',
                        'Ocurrio un error inesperado, si el problema persiste comuníquese con soporte técnico',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
            }
        });
    }

    getSeals(props) {
        axios.get((this.serverBaseRoute + 'rest/client/medalla/all/')).then(res => {
            this.seals(res.data);
        }, {withCredentials: true}).catch((error)=> {
            console.log("error en sellos")
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los productos del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }


    getZones(props) {
        axios.get((this.serverBaseRoute + 'rest/client/zona/all/' + this.props.vendorSelected.id)).then(res => {
            this.zones(res.data);
        }).catch((error) => {
            console.log("error en zonas")
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener las zonas del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    getSellerPoints(props) {
        axios.get((this.serverBaseRoute + 'rest/client/vendedor/puntosDeRetiro/' + this.props.vendorSelected.nombreCorto)).then(res => {
            this.sellerPoints(res.data.puntosDeRetiro);
        }).catch((error) => {
            console.log("error seller points")
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los puntos de retiro del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    stopSearch() {
        this.setState({ searchHasChanged: false });
    }

    showFilters() {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    isLoadingSearch(value) {
        this.setState({ isLoadingSearchProducts: value });
    }

    getProducts(props) {
        axios.post(this.serverBaseRoute + 'rest/client/producto/productosByMultiplesFiltros/', {
            idVendedor: this.props.vendorSelected.id,
            idCategoria: null,
            idsSellosProducto: [],
            idProductor: null,
            idsSellosProductor: [],
            numeroDeOrden: 1,
            query: "",
            pagina: 1,
            cantItems: 100,
            precio: null
        }).then(res => {
            this.products(res.data.productos);
            this.allProducts(res.data.productos);
            this.setState({
                isLoadingProducts: false,
            });
        }).catch(function (error) {
            console.log("error en productos")
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los productos del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    getProducers(props) {
        axios.get((this.serverBaseRoute + 'rest/client/productor/all/' + props.vendorSelected.id)).then(res => {
            this.producers(res.data);
        }).catch((error)=> {
            console.log("error en productores",error)
            if (error.response) {
                if (error.response.status === 404) {
                  Alert.alert(
                    'Catálogo en construcción',
                    'El Catálogo esta en construcción, vuelva mas tarde.',
                    [
                      { text: 'Entendido', onPress: () => this.goBackCatalogs() },
                    ],
                    { cancelable: false },
                  );
                } else {
                  Alert.alert(
                    'Error',
                    'Ocurrió un error inesperado, sera reenviado a los catalogos. Si el problema persiste comuníquese con soporte técnico.',
                    [
                      { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                  );
                }
              } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
              } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.",
                [
                    { text: 'Entendido', onPress: () => this.props.actions.logout() },
                ],
                { cancelable: false },);
              }
        });
    }


    updateSearch = search => {
        this.setState({ search: search });
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState( {searchHasChanged: true});
        }, 1000);
    }
    
    isLoadingComponent(value) {
        this.setState({ isLoadingFilterComponent: value });
    }

    viewSelected(value) {
        this.setState({
            viewSelected: value,
            viewSize: (value === undefined || value === GLOBALS.CATALOG_VIEW_MODES.TWOCARDS) ? (2) : (1),
        });
    }

    showShoppingCart(){
        this.setState({showShoppingCart:!this.state.showShoppingCart})
    }

    defineImageURL(){
        if(this.props.infoDataVendorSelected.urlLogo !== null){
            return encodeURI(this.serverBaseRoute + this.props.infoDataVendorSelected.urlLogo)
        }else{
            return null
        }
    }

    render() {

        if (this.state.isLoadingProducts || this.state.isLoadingFilterComponent) {
            return <LoadingView></LoadingView>;
        }

        return (
            <View style={{ flex:1}}>
                <Header barStyle="light-content" containerStyle={styles.topHeader}>
                    <Button
                        icon={
                            <Icon name="bars" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.props.navigation.openDrawer()}
                    />
                    <Image
                        style={{ width: 40, height: 45 }}
                        source={ require('../components/catalogViewComponents/catalogAssets/platform-icon.png') }/>
                    <View>
                    <Button
                        icon={
                            <Icon name="shopping-cart" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.leftHeaderButton}
                        onPress={() => this.setState({showShoppingCart: !this.state.showShoppingCart})}
                    />
                    {this.props.shoppingCarts.length > 0 ? (
                    <Badge value={this.props.shoppingCarts.length} status="error" containerStyle={{ position: 'absolute', top: -6, right: -6 }}/>
                    ):(null)}
                    </View>
                </Header>
                <NoSellsWarnOverlayView isVisible={!this.props.vendorSelected.ventasHabilitadas} message={this.props.vendorSelected.mensajeVentasDeshabilitadas}></NoSellsWarnOverlayView>
                <View backgroundColor='white' style={styles.lowerHeaderStyle}>
                        <View style={{flex:1}}>
                        <SearchBar
                            placeholder="Tu búsqueda comienza aquí"
                            onChangeText={this.updateSearch}
                            value={this.state.search}
                            containerStyle={styles.searchContainer}
                            inputContainerStyle={styles.inputSearchContainer}
                            inputStyle={styles.inputStyle}
                            leftIconContainerStyle={styles.iconContainerLeft}
                            placeholderTextColor={"rgba(0, 173, 224, 1)"}
                            searchIcon={<Icon name="search" type='font-awesome' size={16} iconStyle={styles.searchIcon} />}
                            lightTheme
                        />
                        </View>
                        <View style={{borderLeftColor:"grey", borderLeftWidth:1, height:"75%"}}>                           
                        </View>
                        <Button
                            icon={<Icon name="caret-down" type='font-awesome' size={20} iconStyle={styles.iconLowerHeaderButton} />}
                            buttonStyle={styles.lowerHeaderButton}
                            onPress={() => this.showFilters()}
                            title="Filtros"
                            titleStyle={styles.lowerHeaderButtonTitle}
                        />
                </View>
                <ProductFilterView showFilter={() => this.showFilters()}
                    isVisible={this.state.isVisible}
                    searchValue={this.state.search}
                    searchHasChanged={this.state.searchHasChanged}
                    functionStopSearch={() => this.stopSearch()}
                    isLoadingSearch={(value) => this.isLoadingSearch(value)}
                    isLoadingComponent={(value) => this.isLoadingComponent(value)}
                    viewSelected={(value) => this.viewSelected(value)}
                    goBackFunction= {()=>this.goBackCatalogs()}
                    >
                </ProductFilterView>
                <OverlayShoppingCartView
                    showFilter={() => this.showShoppingCart()}
                    isVisible={this.state.showShoppingCart}
                    navigation= {this.props.navigation}>                    
                </OverlayShoppingCartView>
                {
                    this.state.isLoadingSearchProducts ?
                        (<LoadingView textStyle={styles.loadingTextStyle}></LoadingView>)
                        :
                        (<ProductCardsView size={this.state.viewSize} viewSelected={this.state.viewSelected} navigation={this.props.navigation}></ProductCardsView>)
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: '#909090',
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
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
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        height:35
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

    searchContainer: {
        backgroundColor: "transparent",
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        borderWidth: 0,  
        flex:1,        
        padding:0,
    },

    inputSearchContainer: {
        backgroundColor: "transparent",
        borderColor: "white",
        height:32,
    },

    inputStyle: {
        fontSize: 13,
        fontWeight: "bold",
        color: "rgba(0, 173, 224, 1)",
    },
    iconContainerLeft: {
        backgroundColor: "transparent",
    },

    searchIcon: {
        color: "#00adee",
    },

    lowerHeaderButton: {
        backgroundColor: '#66000000',
        borderRadius: 0,
        width: 90,
    },

    iconLowerHeaderButton: {
        marginRight: 15,
        color: "#00adee"
    },

    lowerHeaderButtonTitle: {
        color: "rgba(0, 173, 224, 1)",
        fontSize:13
    },

    overlayContainer: {
    },

    loadingTextStyle: {
        position: "absolute",
        fontSize: 24,
        marginTop: 5,
        color: 'white',
        fontWeight: "bold",
        marginTop: "100%",
    },
});

export default CatalogView;
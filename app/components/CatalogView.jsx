import React from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, BackHandler  } from 'react-native';
import { Header, Button, Icon, SearchBar, Image } from 'react-native-elements';
import GLOBALS from '../Globals';
import ProductCardsView from '../containers/CatalogComponentsContainers/ProductCards';
import LoadingView from '../components/LoadingView';
import ProductFilterView from '../containers/CatalogComponentsContainers/ProductFilter';
import axios from 'axios';

class CatalogView extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props.navigation.dangerouslyGetState())
        console.log(this.props.navigation)
        this.products = props.actions.products;
        this.producers = props.actions.producers;
        this.zones = props.actions.zones;
        this.seals = props.actions.seals;
        this.flushproducts = props.actions.flushproducts;
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
            isLoadingProducts: true,
            isLoadingProductSeals: true,
            isLoadingProductionSeals: true,
            searchHasChanged: false,
            viewSelected: GLOBALS.CATALOG_VIEW_MODES.TWOCARDS,
            viewSize:2,
        };
    }

    load() {
        if (this.props.vendorSelected.id !== undefined) {
            this.vendorId = this.props.vendorSelected.id;
            this.getProducts(this.props);
            this.getProducers(this.props);
            this.getSeals(this.props);
            if(this.props.vendorSelected.few.seleccionDeDireccionDelUsuario){
                this.getZones(this.props);
            }
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backButtonClick);
      }
    
      componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.backButtonClick);
      }

      goBackCatalogs(){
        this.props.navigation.goBack(null);
      }

      backButtonClick(){
        if(this.props.navigation && this.props.navigation.canGoBack() && this.props.navigation.dangerouslyGetState().index === 0){
            Alert.alert(
                'Pregunta',
                '¿Desea volver a la lista de catalogos?',
                [
                    { text: 'Si', onPress: () => this.goBackCatalogs()},
                    { text: 'No', onPress: () => null},
                ],
                { cancelable: true },
            );
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
    }


    componentDidMount() {
        this.load();
    }

    getSeals(props){
        axios.get((this.serverBaseRoute + 'rest/client/medalla/all')).then(res => {
            this.seals(res.data);
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los productos del servidor, vuelva a intentar mas tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    
    getZones(props){
        axios.get((this.serverBaseRoute + '/rest/client/zona/all/' + this.props.vendorSelected.id)).then(res => {
            this.zones(res.data);
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener las zonas del servidor, vuelva a intentar mas tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
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
        axios.post(this.serverBaseRoute + 'rest/client/producto/productosByMultiplesFiltros', {
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
            this.setState({
                isLoadingProducts: false,
            });
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los productos del servidor, vuelva a intentar mas tarde.',
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
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los productos del servidor, vuelva a intentar mas tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }


    updateSearch = search => {
        this.setState({ search: search, searchHasChanged: true });
    }
    isLoadingComponent(value) {
        this.setState({ isLoadingFilterComponent: value });
    }

    viewSelected(value){
        this.setState({
            viewSelected: value,
            viewSize: (value === undefined || value === GLOBALS.CATALOG_VIEW_MODES.TWOCARDS )?(2):(1),
        });
    }

    render() {

        if (this.state.isLoadingProducts || this.state.isLoadingFilterComponent) {
            return <LoadingView></LoadingView>;
        }

        return (
            <View style={{height:Dimensions.get("window").height}}>
                <Header containerStyle={styles.topHeader}>
                    <Button
                        icon={
                            <Icon name="bars" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.props.navigation.openDrawer()}
                    />
                    <Image
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
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
                <ProductFilterView showFilter={() => this.showFilters()}
                        isVisible={this.state.isVisible}
                        searchValue={this.state.search}
                        searchHasChanged={this.state.searchHasChanged}
                        functionStopSearch={() => this.stopSearch()}
                        isLoadingSearch={(value) => this.isLoadingSearch(value)}
                        isLoadingComponent={(value) => this.isLoadingComponent(value)}
                        viewSelected={(value) => this.viewSelected(value)}>
                </ProductFilterView>
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

    searchContainer: {
        marginTop: -20,
        backgroundColor: "transparent",
        marginLeft: -18,
        borderBottomColor: "transparent",
        borderTopColor: "transparent",
        borderWidth: 0,
    },

    inputSearchContainer: {
        backgroundColor: "transparent",
        borderColor: "white",
        marginTop: -5,
        height: 30,
        width: "350%",
        borderWidth: 0,
    },

    inputStyle: {
        width: "100%",
        fontSize: 13,
        fontWeight: "bold",
        color: "black",

    },
    iconContainerLeft: {
        backgroundColor: "transparent",
    },

    searchIcon: {
        color: "rgba(51, 102, 255, 1)",
    },

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
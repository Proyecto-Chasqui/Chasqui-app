import React from 'react'
import {StyleSheet, Dimensions, View, Text, Alert} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Icon, Overlay, CheckBox, Image } from 'react-native-elements';
import axios from 'axios';
import GLOBALS from '../../Globals'

class ProductFilterView extends React.PureComponent{
    constructor(props){
        super(props)
        this.typesViewsGlobals = [GLOBALS.CATALOG_VIEW_MODES.TWOCARDS, GLOBALS.CATALOG_VIEW_MODES.SINGLECARD, GLOBALS.CATALOG_VIEW_MODES.LIST];
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.productionSeals = props.actions.productionSeals;
        this.productSeals = props.actions.productSeals;
        this.productCategories = props.actions.productCategories;
        this.products = props.actions.products;
        this.dataProductsDate = new Date()
        this.state={
            showCategories: false,
            showProducers: false,
            showSeals: false,
            filtersHasChange: false,
            dataChecksCategories: [],
            dataChecksProducers: [],
            dataChecksProductSeals: [],
            dataChecksProducerSeals:[],
            dataChecksTypeView:[],
            selectedProducer:[],
            selectedCategories:[],
            selectedProductSeals:[],
            selectedProducerSeals:[],
        }
    }

    
    hasProductListExpired(){
        let dateNow = new Date();
        let productDates = new Date();
        productDates.setTime(this.dataProductsDate.getTime())
        productDates.setMinutes(productDates.getMinutes() + 30)
        return (dateNow.getTime() > productDates.getTime())     
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    componentDidUpdate() {
        if (this.state.filtersHasChange) {
            this.props.isLoadingSearch(true);
            this.getFilterProducts(this.props);
            this.setState({ filtersHasChange: false });
        }
        if (this.props.searchHasChanged) {
            this.props.isLoadingSearch(true);
            this.getFilterProducts(this.props);
            this.props.functionStopSearch();
        }
        if(this.hasProductListExpired()){
            this.getFilterProducts(this.props)
            this.dataProductsDate = new Date()
        }
    }

    componentDidMount(){
        this.dataProductsDate = new Date()
        this.getProductionSeals(this.props);
        this.getProductSeals(this.props);
        this.getProductCategories(this.props);        
    }

    getFilterProducts(props) {
        props.isLoadingSearch(true);
        axios.post(this.serverBaseRoute + 'rest/client/producto/productosByMultiplesFiltros', {
            idVendedor: this.props.vendorSelected.id,
            idCategoria: (this.state.selectedCategories.length > 0 ? (this.state.selectedCategories[0]):(null)),
            idsSellosProducto: this.state.selectedProductSeals,
            idProductor: (this.state.selectedProducer.length > 0 ? (this.state.selectedProducer[0]):(null)),
            idsSellosProductor: this.state.selectedProducerSeals,
            numeroDeOrden: 1,
            query: (this.props.searchValue !== undefined ? (this.props.searchValue):("")),
            pagina: 1,
            cantItems: 9999,
            precio: null
        }).then(res => {
            this.products(res.data.productos);
            this.setState({
                isLoadingProducts: false,
            });
            this.dataProductsDate = new Date()
            props.isLoadingSearch(false);
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los productos del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
                ],
                { cancelable: true },
            );
        });
    }

    getProductionSeals(props){
        axios.get((this.serverBaseRoute + 'rest/client/medalla/productor/all')).then(res => {
            this.productionSeals(res.data);
            this.constructDataForChecked();
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los sellos de productos del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    getProductSeals(props){
        axios.get((this.serverBaseRoute + 'rest/client/medalla/producto/all')).then(res => {
            this.productSeals(res.data);
            this.constructDataForChecked();
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los sellos de productores del servidor, vuelva a intentar más tarde.',
                [
                    { text: 'Entendido', onPress: () => props.actions.logout() },
                ],
                { cancelable: false },
            );
        });
    }

    getProductCategories(props){
        axios.get((this.serverBaseRoute + 'rest/client/categoria/all/' + this.props.vendorSelected.id)).then(res => {
            this.productCategories(res.data);
            this.constructDataForChecked();
        }).catch((error) =>{
            if (error.response) {
                if (error.response.status === 404) {
                  Alert.alert(
                    'Catálogo en construcción',
                    'El Catálogo esta en construcción, vuelva mas tarde.',
                    [
                      { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                  );
                } else {
                  Alert.alert(
                    'Error',
                    'Ocurrio un error inesperado, sera reenviado a los catalogos. Si el problema persiste comuniquese con soporte tecnico.',
                    [
                      { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                  );
                }
              } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
              } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.");
              }
        });
    }
    
    constructDataForChecked() {
        const checksCategories = [];
        const checksProducers = [];
        const checksProductSeals = [];
        const checksProducerSeals = [];
        const checksTypeView =[];
        this.props.productCategories.map((u, i) => {
            checksCategories.push({ id: u.idCategoria, checked: false });
        })
        this.props.producers.map((u, i) => {
            checksProducers.push({ id: u.idProductor, checked: false });
        })
        this.props.productSeals.map((u, i) => {
            checksProductSeals.push({ id: u.idMedalla, checked: false });
        })
        this.props.productionSeals.map((u, i) => {
            checksProducerSeals.push({ id: u.idMedalla, checked: false });
        })
        this.typesViewsGlobals.map((u, i) => {
            checksTypeView.push({ id: i, checked: false });
        })
        this.setState({
            dataChecksCategories: checksCategories,
            dataChecksProducers: checksProducers,
            dataChecksProductSeals: checksProductSeals,
            dataChecksProducerSeals: checksProducerSeals,
            dataChecksTypeView: checksTypeView,
        })
    }

    unCheckAll(){
        this.unCheckOthers(this.state.dataChecksCategories, -1);
        this.unCheckOthers(this.state.dataChecksProducers, -1);
        this.unCheckOthers(this.state.dataChecksProductSeals, -1);
        this.unCheckOthers(this.state.dataChecksProducerSeals, -1);
        this.setState({
            selectedCategories: [],
            selectedProducer:[],
            selectedProducerSeals:[],
            selectedProductSeals:[],
            filtersHasChange:true,
            showCategories:false,
            showProducers:false,
            showSeals:false,
        })
    }

    unCheckOthers(data, index){
        data.map((u,i)=>{
            if(index != i){
                u.checked = false;
            }
        })
    }

    onCheckChangedCategories(id) {
        const data = this.state.dataChecksCategories;        
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        this.unCheckOthers(data,index);
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        this.setState({
            filtersHasChange: true,
            selectedCategories: selectedItems,
            dataChecksCategories: data,
        });
    }

    onCheckChangedProducer(id) {
        const data = this.state.dataChecksProducers;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        this.unCheckOthers(data,index);
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        this.setState({
            filtersHasChange: true,
            selectedProducer: selectedItems,
            dataChecksProducers: data,
        });
    }

    onCheckChangedProducerSeal(id) {
        const data = this.state.dataChecksProducerSeals;
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
            selectedProducerSeals: selectedItems,
            dataChecksProducerSeals: data,
        });
    }

    onCheckChangedProductSeal(id) {
        const data = this.state.dataChecksProductSeals;
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
            selectedProductSeals: selectedItems,
            dataChecksProductSeals: data,
        });
    }

    onCheckTypeView(id){
        const data = this.state.dataChecksTypeView;
        const index = data.findIndex((x) => x.id === id);
        data[index].checked = !data[index].checked;
        this.unCheckOthers(data, index);
        const selectedItems = [];
        data.map((u, i) => {
            if (u.checked) {
                selectedItems.push(u.id);
            }
        });
        if(selectedItems.length>0){
            this.props.viewSelected(this.typesViewsGlobals[selectedItems[0]]), 
            this.setState({
                dataChecksTypeView: data,
            });
        }else{
            data[index].checked = !data[index].checked;
        }
    }

    showCategoriesSet(){
        this.setState({
            showCategories: !this.state.showCategories,
            showProducers: false,
            showSeals: false,
            showViews: false,
        })
    }

    
    showProducerSet(){
        this.setState({
            showCategories: false,
            showProducers: !this.state.showProducers,
            showSeals: false,
            showViews: false,
        })
    }

    showSealsSet(){
        this.setState({
            showCategories: false,
            showProducers: false,
            showSeals: !this.state.showSeals,
            showViews: false,
        })
    }

    showViewTypesSet(){
        this.setState({
            showCategories: false,
            showProducers: false,
            showSeals: false,
            showViews: !this.state.showViews,
        })
    }

    render(){
        return(
            <Overlay containerStyle={styles.overlayContainer}
            overlayStyle={styles.overlay}
            windowBackgroundColor="rgba(0, 0, 0, 0.3)"
            onBackdropPress={() => this.props.showFilter()} isVisible={this.props.isVisible}
            animationType="fade"
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3, marginTop: -6 }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ alignSelf: 'flex-start', marginLeft: 15, fontSize: 15, fontWeight: 'bold' }}>Buscar Por:</Text>
                </View>
                <Button titleStyle={styles.searchButtonResetTitle} buttonStyle={styles.searchButtonReset} type="clear" title="Limpiar Filtros"
                    onPress={() => this.unCheckAll()} />
            </View>
            <ScrollView style={styles.scrollViewFilters}>
                <View style={styles.divisor} />
                <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Categoria"
                    onPress={() => this.showCategoriesSet()} icon={<Icon iconStyle={styles.iconRevealButton} name="caret-down" iconRight={true} size={20} color={this.state.iconColor} type='font-awesome' />
                    } iconRight />
                {this.state.showCategories ?
                    <View style={styles.menuSelectorItems}>
                        <ScrollView>        
                            {this.props.productCategories.map((u, i) => {
                                return (<CheckBox title={u.nombre} key={u.idCategoria} checked={this.state.dataChecksCategories[i].checked}
                                    onPress={() => this.onCheckChangedCategories(u.idCategoria)}
                                />);
                            })
                            }
                        </ScrollView>
                    </View>
                    : null}
                
                <View style={styles.divisor} />
                <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Productor"
                    onPress={() => this.showProducerSet()} icon={<Icon iconStyle={styles.iconRevealButton} name="caret-down" iconRight={true} size={20} color={this.state.iconColor} type='font-awesome' />
                    } iconRight />
                {this.state.showProducers ?
                    <View style={styles.menuSelectorItems}>
                        <ScrollView>
                            {this.props.producers.map((u, i) => {
                                return (<CheckBox title={u.nombreProductor} key={u.idProductor} checked={this.state.dataChecksProducers[i].checked}
                                    onPress={() => this.onCheckChangedProducer(u.idProductor)}
                                />);
                            })
                            }
                        </ScrollView>
                    </View>
                    : null}
                
                                
                <View style={styles.divisor} />
                <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Sello"
                    onPress={() => this.showSealsSet()} icon={<Icon iconStyle={styles.iconRevealButton} name="caret-down" iconRight={true} size={20} color={this.state.iconColor} type='font-awesome' />
                    } iconRight />
                {this.state.showSeals ?
                    <View style={styles.menuSelectorItems}>
                        <ScrollView>
                            {this.props.productionSeals.map((u, i) => {
                                return (<CheckBox title={u.nombre} key={u.idMedalla} checked={this.state.dataChecksProducerSeals[i].checked}
                                    checkedIcon={<Image style={styles.badgeFilterSelected} source={{ uri: this.normalizeText(this.serverBaseRoute + u.pathImagen) }} />}
                                    uncheckedIcon={<Image style={styles.badgeFilterUnselected} source={{ uri: this.normalizeText(this.serverBaseRoute + u.pathImagen) }} />}
                                    onPress={() => this.onCheckChangedProducerSeal(u.idMedalla)}
                                />);
                            })
                            }
                            {this.props.productSeals.map((u, i) => {
                                return (<CheckBox title={u.nombre} key={u.idMedalla} checked={this.state.dataChecksProductSeals[i].checked}
                                    checkedIcon={<Image style={styles.badgeFilterSelected} source={{ uri: this.normalizeText(this.serverBaseRoute + u.pathImagen) }} />}
                                    uncheckedIcon={<Image style={styles.badgeFilterUnselected} source={{ uri: this.normalizeText(this.serverBaseRoute + u.pathImagen) }} />}                                    
                                    onPress={() => this.onCheckChangedProductSeal(u.idMedalla)}
                                />);
                            })
                            }
                        </ScrollView>
                    </View>
                    : null}
                
                <View style={styles.divisor} />
                <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} containerStyle={styles.searchContainerButtonReveal} type="clear" title="Ver resultados como"
                    onPress={() => this.showViewTypesSet()} icon={<Icon iconStyle={styles.iconRevealButton} name="caret-down" iconRight={true} size={20} color={this.state.iconColor} type='font-awesome' />
                    } iconRight />
                {this.state.showViews ?
                    <View style={styles.menuSelectorItems}>
                        <ScrollView>
                            {this.typesViewsGlobals.map((u, i) => {
                                return (<CheckBox title={u} key={i} checked={this.state.dataChecksTypeView[i].checked}
                                    onPress={() => this.onCheckTypeView(i)}
                                />);
                            })
                            }
                        </ScrollView>
                    </View>
                    : null}
                <View style={styles.divisor} />
            </ScrollView>
            </Overlay>         

        )
    }
}

const styles = StyleSheet.create({

    overlayContainer: {
        
    },

    overlay: {
        alignSelf:"flex-end",
        width: 300,
        height: Dimensions.get("window").height - 210,
        borderWidth: 2,
        borderColor: "#D8D8D8",
    },

    scrollViewFilters: {
        marginLeft: -10,
        marginRight: -10,
    },

    menuSelectorItems: {
        backgroundColor: null,
        borderTopWidth: 2,
        borderTopColor: "#f4f4f4",
        width: "100%",
    },

    divisor: {
        borderTopWidth: 2,
        borderTopColor: "#D8D8D8",
        marginLeft: -9,
        width: "107%"
    },

    buttonAndIconContainer: {
        flexDirection: "row",
        width: "104%",
        alignSelf: 'flex-end',
    },

    searchButtonReveal: {
        alignSelf: 'center',
        width: "100%",
    },

    searchContainerButtonReveal: {
        flexDirection: "row",
        alignSelf: 'flex-start',
        width: "105%",
        marginLeft: -5,
        justifyContent: 'space-between'
    },

    titleButtonReveal: {
        color: "black",
        alignSelf: 'flex-end',
        width: "70%"
    },

    iconRevealButton: {
        marginLeft: 50,
        alignSelf: 'flex-end',
        color: "#D7DF01"
    },

    iconContainer: {
        borderWidth: 2,
        borderColor: "#D8D8D8"
    },

    searchButtonResetTitle: {
        color: "rgba(51, 102, 255, 1)"
    },

    searchButtonReset: {
        borderColor: "rgba(0, 0, 0, 0)"
    },

    badgeFilterSelected: {
        height:40,
        width:40,
        borderColor: "blue",
        borderRadius: 5,
        borderWidth: 2
    },

    badgeFilterUnselected: {
        height:40,
        width:40,
        borderColor: "#BDBDBD",
        borderRadius: 5,
        borderWidth: 2
    },
});


export default ProductFilterView
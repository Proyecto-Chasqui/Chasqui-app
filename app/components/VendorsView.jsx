import React from 'react';
import { StyleSheet, View, Text, Alert, Image, ScrollView, Dimensions, Picker, Modal, TouchableHighlight } from 'react-native';
import axios from 'axios';
import LoadingView from '../components/LoadingView';
import { Header, Button, Icon, Overlay, Card, Badge, CheckBox } from 'react-native-elements';
import VendorMultipleCards from '../containers/VendorMultipleCards';

class VendorsView extends React.Component {

    constructor(props) {
        super(props);
        this.vendors = props.actions.vendors;
        this.vendorTags = props.actions.vendorTags;
        this.state = {
            isLoading: true,
            multipleCards: false,
            maxTagTextLength: 32,
            isVisible: false,
            showTipoOrganizacionSet: false,
            showTipoProductoSet: false,
            showZonaCobertura: false,
            filtersHasChange: false,
            dataChecksTipoOrganizacion: [],
            dataChecksZonaEntrega: [],
            dataChecksTipoProducto: [],
            selectedTagsTipoOrganizacion: [],
            selectedTipoProducto: [],
            selectedTagsZonaDeCobertura: [],
        };
    }

    cropText(text) {
        if (text.length > this.state.maxTagTextLength) {
            return text.slice(0, this.state.maxTagTextLength - 1) + "..";
        } else {
            return text;
        }
    }

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
        this.getVendors();
        this.getVendorsTags();
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
        axios.post('http://69.61.93.71/chasqui-dev-panel/rest/client/vendedor/obtenerVendedoresConTags', {
            idsTagsTipoOrganizacion: this.state.selectedTagsTipoOrganizacion,
            idsTagsTipoProducto: this.state.selectedTipoProducto,
            idsTagsZonaDeCobertura: this.state.selectedTagsZonaDeCobertura,
            nombre: "",
            usaEstrategiaNodos: false,
            usaEstrategiaGrupos: false,
            usaEstrategiaIndividual: false,
            entregaADomicilio: false,
            usaPuntoDeRetiro: false,
        })
            .then(res => {
                this.vendors(res.data);
                this.setState({
                    isLoading: false
                });
            })
    }

    getVendors() {
        axios.get('http://69.61.93.71/chasqui-dev-panel/rest/client/vendedor/all')
            .then(res => {
                this.vendors(res.data);

                this.setState({
                    isLoading: false
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
            selectedTagsZonaDeCobertura: [],
            dataChecksZonaEntrega: dataZona,
            selectedTipoProducto: [],
            dataChecksTipoProducto: dataProducto,
            selectedTagsTipoOrganizacion: [],
            dataChecksTipoOrganizacion: dataOrga,
            showTipoOrganizacionSet: false,
            showTipoProductoSet: false,
            showZonaCobertura: false,
        });

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

    getVendorsTags() {
        axios.get('http://69.61.93.71/chasqui-dev-panel/rest/client/vendedor/obtenerTags')
            .then(res => {
                this.vendorTags(res.data);
                this.constructDataForChecked(res.data);
                this.setState({
                    isLoading: false,
                });
            }).catch(function (error) {

                Alert.alert(
                    'Error',
                    'Ocurrio un error al obtener los datos del servidor, vuelva a intentar mas tarde.',
                    [
                        { text: 'Entendido', onPress: () => props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            });
    }


    render() {

        if (this.state.isLoading) {
            return <LoadingView></LoadingView>;
        }

        return (
            <View style={{ marginBottom: 75 }}>
                <Overlay containerStyle={styles.overlayContainer}
                    overlayStyle={styles.overlay}
                    windowBackgroundColor="rgba(0, 0, 0, 0)"
                    onBackdropPress={() => this.showFilters()} isVisible={this.state.isVisible}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ alignSelf: 'flex-start', marginLeft: 15, fontSize: 15, fontWeight: 'bold' }}>Buscar Por:</Text>
                        </View>
                        <Button titleStyle={styles.searchButtonResetTitle} buttonStyle={styles.searchButtonReset} type="outline" title="Limpiar Filtros"
                            onPress={() => this.unCheckAll()} />
                    </View>
                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} type="outline" title="Tipo de organización"
                        onPress={() => this.setState({
                            showTipoOrganizacionSet: !this.state.showTipoOrganizacionSet,
                            showTipoProductoSet: false,
                            showZonaCobertura: false,
                        })} />
                    {this.state.showTipoOrganizacionSet ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>
                                {this.props.vendorTags.tagsTipoOrganizacion.map((u, i) => {
                                    return (<CheckBox title={u.nombre} checked={this.state.dataChecksTipoOrganizacion[i].checked}
                                        onPress={() => this.onCheckChangedOrganizacion(u.id)}
                                    />);
                                })
                                }
                            </ScrollView>
                        </View>
                        : null}

                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} type="outline" title="Tipo de productos"
                        onPress={() => this.setState({
                            showTipoOrganizacionSet: false,
                            showTipoProductoSet: !this.state.showTipoProductoSet,
                            showZonaCobertura: false
                        })} />
                    {this.state.showTipoProductoSet ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>
                                {this.props.vendorTags.tagsTipoProducto.map((u, i) => {
                                    return (<CheckBox title={u.nombre} checked={this.state.dataChecksTipoProducto[i].checked}
                                        onPress={() => this.onCheckChangedProducto(u.id)}
                                    />);
                                })
                                }
                            </ScrollView>
                        </View>
                        : null}

                    <Button titleStyle={styles.titleButtonReveal} buttonStyle={styles.searchButtonReveal} type="outline" title="Zona de entregas"
                        onPress={() => this.setState({
                            showTipoOrganizacionSet: false,
                            showTipoProductoSet: false,
                            showZonaCobertura: !this.state.showZonaCobertura
                        })} />
                    {this.state.showZonaCobertura ?
                        <View style={styles.menuSelectorItems}>
                            <ScrollView>
                                {this.props.vendorTags.tagsZonaDeCobertura.map((u, i) => {
                                    return (<CheckBox title={u.nombre} checked={this.state.dataChecksZonaEntrega[i].checked}
                                        onPress={() => this.onCheckChangedZonasDeEntrega(u.id)}
                                    />);
                                })
                                }
                            </ScrollView>
                        </View>
                        : null}
                </Overlay>
                <Header containerStyle={styles.topHeader}>
                    <Button
                        icon={
                            <Icon name="bars" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.headerButton}
                        onPress={() => this.props.navigation.openDrawer()}
                    />
                    <Image
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'contain' }}
                        source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                    />
                    {this.state.multipleCards ? (<Button
                        icon={
                            <Icon name="th" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.headerButton}
                        onPress={() => this.switchStyle()}
                    />) : (<Button
                        icon={
                            <Icon name="th-large" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.headerButton}
                        onPress={() => this.switchStyle()}
                    />)
                    }
                </Header>
                <Header backgroundColor='white' containerStyle={styles.lowerHeaderStyle}
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
                <VendorMultipleCards multipleCards={this.state.multipleCards}/>
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

    headerButton: {
        backgroundColor: '#66000000',
        marginLeft: 15,
        borderColor: "white",
        borderWidth: 1,
        width: 40,
        height: 40
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
        alignSelf: 'flex-start',

    },
    overlay: {
        alignSelf: 'flex-end',
        marginTop: 35,
        width: Dimensions.get('window').width / 1.5,
    },
    menuSelectorItems: {
        backgroundColor: "#f4f4f4",
        borderWidth: 1,
        borderColor: "#f4f4f4",
        height: 300,
    },
    searchButtonReveal: {
        alignSelf: 'center',
        width: "100%",
        borderColor: "rgba(51, 102, 255, 1)"
    },
    titleButtonReveal: {
        color: "black"
    },
    searchButtonResetTitle: {
        color: "rgba(51, 102, 255, 1)"
    },
    searchButtonReset: {
        borderColor: "rgba(0, 0, 0, 0)"
    },
});

export default VendorsView;
import React from 'react';
import { StyleSheet, View, Alert, Image, Dimensions, BackHandler } from 'react-native';
import axios from 'axios';
import LoadingView from '../components/LoadingView';
import { Header, Button, Icon, SearchBar } from 'react-native-elements';
import VendorCards from '../containers/VendorsComponentContainers/VendorCards';
import VendorFilters from '../containers/VendorsComponentContainers/VendorFilters';
import GLOBALS from '../Globals';

class VendorsView extends React.PureComponent {

    constructor(props) {
        super(props);
        this.vendors = props.actions.vendors;
        this.vendorTags = props.actions.vendorTags;
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.minWidth = false,
            this.state = {
                search: '',
                isLoadingSearchVendors: false,
                isLoadingFilterComponent: false,
                isLoading: true,
                multipleCards: false,
                isVisible: false,
                isLoadingVendors: true,
                isLoadingTags: true,
                searchHasChanged: false,
            };
    }

    updateSearch = search => {
        this.setState({ search: search, });
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({ searchHasChanged: true });
        }, 800);
    }

    stopSearch() {
        this.setState({ searchHasChanged: false });
    }

    switchStyle() {
        this.setState({
            multipleCards: !this.state.multipleCards
        });
    }

    showFilters() {
        this.setState({
            isVisible: !this.state.isVisible
        })
    }

    resetVendorSelected() {
        let idVendor = this.props.vendorSelected.id
        this.props.vendors.map((vendor, i) => {
            if (idVendor === vendor.id) {
                this.props.actions.vendorSelected(vendor)
            }
        })
    }

    componentDidUpdate() {
        if (this.props.resetState.reset) {
            this.setState({
                isLoadingVendors: true,
            });
            this.getVendors();
            this.props.actions.resetState({ reset: false })
        }
    }

    componentDidMount() {
        this.getVendors();
    }

    screenLowerThan(value, styleA, styleB) {
        if (Dimensions.get('window').width < value) {
            return styleB;
        }
        return styleA;
    }


    getVendors() {
        axios.get(this.serverBaseRoute + 'rest/client/vendedor/all')
            .then(res => {
                this.vendors(res.data);
                this.setState({
                    isLoadingVendors: false,
                });
                this.resetVendorSelected();
            }).catch((error) => {
                Alert.alert(
                    'Error',
                    'Ocurrio un error al obtener los datos del servidor, vuelva a intentar más tarde.',
                    [
                        { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            });
    }

    isLoadingSearch(value) {
        this.setState({ isLoadingSearchVendors: value });
    }

    isLoadingComponent(value) {
        this.setState({ isLoadingFilterComponent: value });
    }

    render() {

        if (this.state.isLoadingVendors || this.state.isLoadingFilterComponent) {
            return <LoadingView></LoadingView>;
        }

        return (
            <View style={{ flex: 1 }}>
                <Header containerStyle={styles.topHeader} statusBarProps={{ translucent: true }}>
                    <Button
                        icon={
                            <Icon name="bars" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.props.navigation.openDrawer()}
                    />
                    <Image
                        style={{ width: 40, height: 45 }}
                        source={require('../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                    />
                </Header>
                <View backgroundColor='white' style={styles.lowerHeaderStyle}>
                        <View style={{flex:1}}>
                        <SearchBar
                            placeholder="Búsqueda por nombre"
                            onChangeText={this.updateSearch}
                            value={this.state.search}
                            containerStyle={styles.searchContainer}
                            inputContainerStyle={styles.inputSearchContainer}
                            inputStyle={styles.inputStyle}
                            leftIconContainerStyle={styles.iconContainerLeft}
                            placeholderTextColor={"#00adee"}
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
                <VendorFilters showFilter={() => this.showFilters()}
                    isVisible={this.state.isVisible}
                    searchValue={this.state.search}
                    searchHasChanged={this.state.searchHasChanged}
                    functionStopSearch={() => this.stopSearch()}
                    isLoadingSearch={(value) => this.isLoadingSearch(value)}
                    isLoadingComponent={(value) => this.isLoadingComponent(value)}>
                </VendorFilters>

                {
                    this.state.isLoadingSearchVendors ?
                        (<LoadingView ></LoadingView>)
                        :
                        (<VendorCards navigation={this.props.navigation} multipleCards={this.state.multipleCards} />)
                }
            </View>
        );

    }
}



const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: '#909090',
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

    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 15,
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
        color: "black",
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
        color: "#00adee",
        fontSize:13
    },

    overlayContainer: {
    },

    loadingTextStyle: {
        position: "absolute",
        fontSize: 24,
        marginTop: 5,
        color: 'black',
        fontWeight: "bold",
        marginTop: "100%",
    },
});

export default VendorsView;
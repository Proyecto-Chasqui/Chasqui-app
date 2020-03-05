import React from 'react';
import { StyleSheet, View, Alert, Image, Dimensions } from 'react-native';
import axios from 'axios';
import LoadingView from '../components/LoadingView';
import { Header, Button, Icon, SearchBar } from 'react-native-elements';
import VendorCards from '../containers/VendorsComponentContainers/VendorCards';
import VendorFilters from '../containers/VendorsComponentContainers/VendorFilters';
import GLOBALS from '../Globals';

class VendorsView extends React.Component {

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
        this.setState({ search: search, searchHasChanged: true });
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

    componentWillMount() {
        this.getVendors(this.props);
    }

    screenLowerThan(value, styleA, styleB) {
        if (Dimensions.get('window').width < value) {
            return styleB;
        }
        return styleA;
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
                    'Ocurrio un error al obtener los datos del servidor, vuelva a intentar mas tarde.',
                    [
                        { text: 'Entendido', onPress: () => props.actions.logout() },
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
            <View style={{ marginBottom: 75 }}>
                <View style={{backgroundColor:"green"}}>
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
                            !this.state.multipleCards ? (<Button
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
                </View>
                <View style={{backgroundColor:"Black"}}></View>
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
                        (<LoadingView textStyle={styles.loadingTextStyle}></LoadingView>)
                        :
                        (<VendorCards multipleCards={this.state.multipleCards} />)
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
        color: 'black',
        fontWeight: "bold",
        marginTop: "100%",
    },
});

export default VendorsView;
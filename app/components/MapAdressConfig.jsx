import React from 'react'
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import { UrlTile, Marker, Polygon } from 'react-native-maps';
import { Header, Button, Icon, SearchBar, Image, Overlay } from 'react-native-elements';

class MapAdressConfig extends React.PureComponent {
    constructor(props) {
        super(props)
        this.initialCamera = {
            center: {
                latitude: -34.7067799,
                longitude: -58.278568,
            },
            pitch: 1,
            heading: 1,
            zoom: 15,
        }
        this.initialRegion = {
            latitude: -34.7067799,
            longitude: -58.278568,
            latitudeDelta: 0.5,
            longitudeDelta: 0.1,
        }
        this.state = {
            canMoveMarker: this.props.route.params.geoFail,
            initialRegion: this.initialRegion,
            initialCamera: this.initialCamera,
            markerLocation: this.props.route.params.locationInfo ? (this.props.route.params.locationInfo) : ({
                lat: -34.7067799,
                lng: -58.278568,
            }),
        }
        this.mapRef = null
        this.refMarker = null
    }

    componentDidMount() {
        if (this.state.markerLocation !== null) {
            let camera = {
                center: {
                    latitude: this.state.markerLocation.lat,
                    longitude: this.state.markerLocation.lng,
                },
                pitch: 1,
                heading: 1,
                zoom: 19
            }
            this.setState({
                initialCamera: camera
            })
        }
    }

    createCoordinateParse(lat, lng) {
        return ({
            latitude: lat,
            longitude: lng,
        })
    }

    confirmLocation() {
        this.props.route.params.locationEditFunction(this.state.markerLocation, this.props.route.params.sender);
        this.props.navigation.goBack();
    }

    canMoveMarker() {
        this.setState({ canMoveMarker: true });
    }

    wrongLocation() {
        Alert.alert(
            'Pregunta',
            '¿Que desea hacer?',
            [
                { text: 'Volver', onPress: () => this.props.navigation.goBack() },
                { text: 'Marcar en el mapa', onPress: () => this.canMoveMarker() },
            ],
            { cancelable: false },
        );
    }

    createCoordinateParseLatLng(latlng) {
        return {
            lat: latlng.latitude,
            lng: latlng.longitude
        }
    }

    moveMarker(e) {
        if (this.state.canMoveMarker) {
            this.setState({ markerLocation: this.createCoordinateParseLatLng(e.nativeEvent.coordinate) })
        }
    }

    render() {
        return (
            <View>
                <View>
                    <Header containerStyle={styles.topHeader}>
                        <Button
                            icon={
                                <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                            }
                            buttonStyle={styles.rightHeaderButton}
                            onPress={() => this.props.navigation.goBack()}
                        />
                        <Image
                            style={{ width: 40, height: 45 }}
                            source={require('../components/catalogViewComponents/catalogAssets/platform-icon.png')}
                        />
                    </Header>
                </View>
                <View style={styles.titleContainer}>
                    {!this.state.canMoveMarker ?
                        (<Text style={styles.adressTitle}>¿Es correcta la ubicación?</Text>)
                        :
                        (<Text style={styles.adressTitle}> Ajuste la ubicación</Text>)
                    }

                </View>
                <MapView style={styles.mapStyle}
                    ref={(ref) => { this.mapRef = ref }}
                    camera={this.state.initialCamera}
                    maxZoomLevel={20}
                    onPress={(e) => this.moveMarker(e)}
                >
                    <Marker
                        coordinate={this.createCoordinateParse(this.state.markerLocation.lat, this.state.markerLocation.lng)}
                        onPress={() => null}
                        ref={(ref) => { this.refMarker = ref }}
                    >
                        <View style={{ backgroundColor: "white", borderWidth: 1.5, borderColor: '#00adee', width: 30, height: 30, borderTopStartRadius: 50, borderTopEndRadius: 50, borderBottomEndRadius: 50, borderBottomStartRadius: 50 }}>
                            <Icon
                                name='home'
                                type='material'
                                color='#00adee'
                                size={25}
                                iconStyle={{ marginTop: 0 }}
                            />
                        </View>

                    </Marker>

                </MapView>
                {!this.state.canMoveMarker ? (
                    <View style={styles.submenu}>
                        
                        <Button containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonNotStyle}
                            icon={
                                <Icon name="cancel" size={20} color="black" type='material' />
                            }
                            titleStyle={{ marginLeft: 10, color: 'black', marginRight: 10 }}
                            title="No es correcta"
                            onPress={() => this.wrongLocation()}
                        />

                        <Button containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonOkStyle}
                            icon={
                                <Icon name="done" size={20} color="white" type='material' />
                            }
                            titleStyle={{ marginLeft: 15, color: 'white', marginRight: 20 }}
                            title="Es correcta"
                            onPress={() => this.confirmLocation()}
                        />


                    </View>
                ) : (
                        <View style={styles.submenu}>

                            <Button containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonOkStyle}
                                icon={
                                    <Icon name="done-all" size={20} color="white" type='material' />
                                }
                                titleStyle={{ marginLeft: 15, color: 'white', marginRight: 20 }}
                                title="Listo"
                                onPress={() => this.confirmLocation()}
                            />

                        </View>
                    )
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    subMenuButtonContainer: {
        flex: 1
    },

    subMenuButtonOkStyle: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "#5ebb47",
        borderColor: 'black',
        borderWidth: 1
    },

    subMenuButtonNotStyle: {
        marginLeft: 5,
        marginRight: 5,
        backgroundColor: "#f0f0f0",
        borderColor: 'black',
        borderWidth: 1
    }
    ,

    submenu: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,


    },

    titleContainer: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },
    adressTitle: {
        backgroundColor: "white",
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    viewSearchErrorContainer: {
        height: "100%"
    },

    infoTextContainer: {
        backgroundColor: "#00adee",
        marginTop: -10,
        marginLeft: -10,
        marginRight: -10,
        height: 50,
        alignItems: "center"
    },

    infoText: {
        marginTop: 10,
        fontSize: 22,
        fontWeight: "bold",
        color: "white"
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

    titleZoneStyle: {
        fontSize: 30,
        backgroundColor: "grey",
        alignContent: "center"
    },
    itemContainer: {
        marginTop: 10,
        width: "80%",
        flexDirection: "row",
        alignContent: "center"
    },
    iconStyle: {
        marginLeft: 10,
        marginRight: 10
    },

    zoneNameStyle: {
        fontSize: 20,
    },
    zoneMessageStyle: {
        fontSize: 20,
    },
    zoneDateStyle: {
        fontSize: 20,
    },

    topHeader: {
        backgroundColor: '#909090',
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
    container: {
        backgroundColor: '#fff',
        alignItems: 'flex-end',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 177,
    },
});

export default MapAdressConfig;
import React from 'react'
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Alert, ScrollView } from 'react-native';
import { UrlTile, Marker, Polygon } from 'react-native-maps';
import { Header, Button, Icon, SearchBar, Image, Overlay } from 'react-native-elements';
import axios from 'axios';
import GLOBALS from '../Globals';

class DeliveryZonesView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.vendorID = this.props.vendorSelected.id;
        this.zones = this.props.zones;
        this.sellerPoints = this.props.sellerPoints;
        this.parsedZones = [],
            this.initialRegion = {
                latitude: -34.7067799,
                longitude: -58.278568,
                latitudeDelta: 1.1922,
                longitudeDelta: 1.1421,
            }
        this.state = {
            showSP: false,
            showDZ: false,
            zones: [],
            sellerPoints: this.sellerPoints,
            isVisible: false,
            isSPDataVisible: false,
            zoneSelected: null,
            sellerPointSelected: null,
            initialRegion: this.initialRegion,
        }
    }

    componentDidUpdate() {
        if (this.vendorID !== this.props.vendorSelected.id) {
            this.zones = this.props.zones;
            this.sellerPoints = this.props.sellerPoints;
            this.createZones();
            this.setState(
                {
                    sellerPoints: this.sellerPoints,
                    showSP: false,
                    showDZ: false,
                })
            this.vendorID = this.props.vendorSelected.id;
        }
    }

    componentDidMount() {
        this.createZones();
    }

    createCoordinates(coordinates) {
        let varCoordinates = []
        if (coordinates !== null) {
            coordinates.map((coord, i) => {
                varCoordinates.push((this.createCoordinate(coord.x, coord.y)));
            })
        }
        return varCoordinates;
    }

    createCoordinate(lat, lng) {
        return ({
            latitude: lat,
            longitude: lng,
        })
    }

    createCoordinateParse(lat, lng) {
        return ({
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
        })
    }

    showHideSP() {
        if (this.state.showSP) {
            this.setState({
                sellerPoints: this.sellerPoints,
            })
        } else {
            this.setState({
                sellerPoints: [],
            })
        }
        this.setState({ showSP: !this.state.showSP })
    }

    showHideDZ() {
        if (this.state.showDZ) {
            this.setState({
                zones: this.parsedZones,
            })
        } else {
            this.setState({
                zones: [],
            })
        }

        this.setState({ showDZ: !this.state.showDZ })
    }

    createZones() {
        let varZones = []
        this.zones.map((zone, i) => {
            let parsedZone = {
                id: zone.properties.id,
                name: zone.properties.nombreZona,
                closeDate: zone.properties.fechaCierre,
                message: zone.properties.mensaje,
                coordinates: this.createCoordinates(zone.geometry.coordinates),
            }
            varZones.push(parsedZone);
        })
        this.parsedZones = varZones
        this.setState({ zones: varZones })
    }

    showZoneData(zone) {
        this.setState({ isVisible: !this.state.isVisible, zoneSelected: zone })
    }

    showSPData(sellerPoint) {
        this.setState({ isSPDataVisible: !this.state.isSPDataVisible, sellerPointSelected: sellerPoint })
    }

    hidePop() {
        this.setState({ isVisible: !this.state.isVisible })
    }

    hidePopSP() {
        this.setState({ isSPDataVisible: !this.state.isSPDataVisible })
    }

    parseDate(string) {
        let parts = string.split('-');
        let parsedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
        return parsedDate;
    }


    render() {
        if (this.parsedZones.length === 0 && this.sellerPoints.length === 0) {
            return (
                <View style={styles.viewSearchErrorContainer}>
                    <View style={styles.viewErrorContainer}>
                        <View style={styles.searchIconErrorContainer}>
                            <Icon name="map" type='font-awesome' size={50} color={"white"} containerStyle={styles.searchIconError}></Icon>
                        </View>
                        <Text style={styles.errorText}>
                            Este catálogo no posee entregas.
                    </Text>
                        <Text style={styles.tipErrorText}>
                            Es posible que el catálogo este en mantenimiento.
                    </Text>
                    </View>
                </View>
            );
        }
        return (
            <View>
                <Overlay
                    isVisible={this.state.isVisible}
                    width="90%"
                    height={300}
                    onBackdropPress={() => this.hidePop()}
                    animationType="fade"
                >
                    <View>
                    {this.state.zoneSelected !== null ? (
                        <View style={{ flex: 1, margin: -10 }}>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoText} >Zona de entrega</Text>
                            </View>

                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="book" size={20} color="black" type='font-awesome' />
                                <ScrollView style={{ height: 80 }}>
                                    <View style={{ flexDirection: "row", height: 80, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={styles.zoneNameStyle}> {this.state.zoneSelected.name}</Text>
                                    </View>
                                </ScrollView>
                            </View>
                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="file" size={20} color="black" type='font-awesome' />
                                <ScrollView style={{ height: 80 }}>
                                    <View style={{ flexDirection: "row", height: 80, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={styles.zoneMessageStyle} > {this.state.zoneSelected.message}</Text>
                                    </View>
                                </ScrollView>
                            </View>
                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="calendar" size={20} color="black" type='font-awesome' />
                                <ScrollView style={{ height: 80 }}>
                                    <View style={{ flexDirection: "row", height: 80, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={styles.zoneDateStyle} >Cierre: {this.parseDate(this.state.zoneSelected.closeDate)}</Text>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    ) : (null)}
                    </View>
                </Overlay>
                <Overlay
                    isVisible={this.state.isSPDataVisible}
                    width="90%"
                    height={240}
                    onBackdropPress={() => this.hidePopSP()}
                    animationType="fade"
                >
                    <View>
                    {this.state.sellerPointSelected !== null ? (
                        <View style={{ flex: 1, margin: -10 }}>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoText} >Punto de retiro</Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="book" size={20} color="black" type='font-awesome' />
                                <ScrollView style={{ height: 75 }}>
                                    <View style={{ flexDirection: "row", height: 75, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={styles.zoneNameStyle}> {this.state.sellerPointSelected.nombre}</Text>
                                    </View>
                                </ScrollView>
                            </View>
                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="file" size={20} color="black" type='font-awesome' />
                                <ScrollView style={{ height: 110 }}>
                                    <View style={{ flexDirection: "row", height: 110, justifyContent: "center", alignItems: "center" }}>
                                        <Text style={styles.zoneMessageStyle} > {this.state.sellerPointSelected.mensaje}</Text>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    ) : (null)}
                    </View>
                </Overlay>
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
                        style={{ width: 50, height: 55 }}
                        source={ require('../components/catalogViewComponents/catalogAssets/platform-icon.png') }
                        />
                    </Header>
                </View>
                <View style={styles.container}>

                    <MapView style={styles.mapStyle}
                        initialRegion={this.state.initialRegion}
                        maxZoomLevel={20}
                    >
                        {this.state.zones.map((zone, i) => {
                            if (zone.coordinates.length > 0) {
                                return (
                                    <Polygon key={i}
                                        coordinates={zone.coordinates}
                                        fillColor={"rgba( 108, 53, 170 ,0.5)"}
                                        strokeColor={"blue"}
                                        strokeWidth={2}
                                        tappable={true}
                                        title={"UNQ"}
                                        description={"descripcion unq"}
                                        onPress={() => this.showZoneData(zone)}
                                    />
                                );
                            }
                        })}

                        {this.state.sellerPoints.map((sellerPoint, i) => {
                            if (sellerPoint.direccion.latitud !== null) {
                                return (
                                    <Marker key={i}
                                        coordinate={this.createCoordinateParse(sellerPoint.direccion.latitud, sellerPoint.direccion.longitud)}
                                        onPress={() => this.showSPData(sellerPoint)}
                                    >
                                        <View style={{ backgroundColor: "white", borderWidth: 1.5, borderColor: "blue", width: 30, height: 30, borderTopStartRadius: 50, borderTopEndRadius: 50, borderBottomEndRadius: 0, borderBottomStartRadius: 50 }}>
                                            <Icon
                                                name='store-mall-directory'
                                                type='material'
                                                color='blue'
                                                size={25}
                                                iconStyle={{ marginTop: 1 }}
                                            />
                                        </View>
                                    </Marker>

                                );
                            }
                        })}

                    </MapView>
                    <View style={{ position: "absolute", marginTop: 5 }}>
                        {this.sellerPoints.length === 0 ? (null) : (
                            <Icon
                                reverse
                                name='store-mall-directory'
                                type='material'
                                color={this.state.showSP ? ('rgba(51, 102, 255, 0.4)') : ('rgba(51, 102, 255, 1)')}
                                size={18}
                                onPress={() => this.showHideSP()}
                            />)
                        }
                        {this.parsedZones.length === 0 ? (null) : (
                            <Icon
                                reverse
                                name='layers'
                                type='material'
                                color={this.state.showDZ ? ('rgba(51, 102, 255, 0.4)') : ('rgba(51, 102, 255, 1)')}
                                size={18}
                                onPress={() => this.showHideDZ()}
                            />)
                        }
                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    viewSearchErrorContainer: {
        height: "100%"
    },

    infoTextContainer: {
        backgroundColor: "rgba(51, 102, 255, 1)",

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
        borderTopWidth: 1,
        borderColor: "grey",
        width: "100%",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    },
    iconStyle: {
        marginLeft: 10,
        marginRight: 10
    },

    zoneNameStyle: {
        fontSize: 18,
    },
    zoneMessageStyle: {
        fontSize: 18,
        marginEnd:5,
    },
    zoneDateStyle: {
        fontSize: 18,
    },

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        borderBottomWidth: 0,
        marginTop: -25,
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
        height: Dimensions.get('window').height - 75,
    },
});

export default DeliveryZonesView
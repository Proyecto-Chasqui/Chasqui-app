import React from 'react'
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import { UrlTile, Marker, Polygon } from 'react-native-maps';
import { Header, Button, Icon, SearchBar, Image, Overlay } from 'react-native-elements';
import axios from 'axios';
import GLOBALS from '../Globals';

class DeliveryZonesView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.zones = this.props.zones;
        this.state = {
            zones: [],
            isVisible: false,
            zoneSelected: null
        }
    }

    componentDidMount() {
        this.createZones();
    }

    createCoordinates(coordinates) {
        let varCoordinates = []
        if (coordinates !== null) {
            coordinates.map((coord, i) => {
                let coordinate = {
                    latitude: coord.x,
                    longitude: coord.y,
                }
                varCoordinates.push(coordinate);
            })
        }
        return varCoordinates;
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
        this.setState({ zones: varZones })
    }

    showZoneData(zone) {
        this.setState({ isVisible: !this.state.isVisible, zoneSelected: zone })
    }

    hidePop() {
        this.setState({ isVisible: !this.state.isVisible })
    }

    render() {
        return (
            <View>
                <Overlay
                    isVisible={this.state.isVisible}
                    width="auto"
                    height="50%"
                    onBackdropPress={() => this.hidePop()}
                    animationType="fade"
                >
                    {this.state.zoneSelected !== null ? (
                        <View>
                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="book" size={20} color="black" type='font-awesome' />
                                <Text style={styles.zoneNameStyle}> {this.state.zoneSelected.name}</Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="file" size={20} color="black" type='font-awesome' />
                                <Text style={styles.zoneMessageStyle} > {this.state.zoneSelected.message}</Text>
                            </View>
                            <View style={styles.itemContainer}>
                                <Icon iconStyle={styles.iconStyle} name="calendar" size={20} color="black" type='font-awesome' />
                                <Text style={styles.zoneDateStyle} >fecha de cierre: {this.state.zoneSelected.closeDate}</Text>
                            </View>
                        </View>
                    ) : (null)}
                </Overlay>
                <View>
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
                    </Header>
                </View>
                <View style={styles.container}>

                    <MapView style={styles.mapStyle}
                        initialRegion={{
                            latitude: -34.7067799,
                            longitude: -58.278568,
                            latitudeDelta: 1.1922,
                            longitudeDelta: 1.1421,
                        }}
                        minZoomLevel={0}
                        maxZoomLevel={20}
                    >
                        {this.state.zones.map((zone, i) => {
                            if (zone.coordinates.length > 0) {
                                return (
                                    <Polygon
                                        coordinates={zone.coordinates}
                                        fillColor={"green"}
                                        strokeColor={"blue"}
                                        strokeWidth={5}
                                        tappable={true}
                                        title={"UNQ"}
                                        description={"descripcion unq"}
                                        onPress={() => this.showZoneData(zone)}
                                    />
                                );
                            }
                        })}
                    </MapView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    titleZoneStyle: {
        fontSize: 30,
        backgroundColor: "grey",
        alignContent:"center"
    },
    itemContainer:{
        height:60,
        flexDirection:"row",
        alignContent:"center"
    },  
    iconStyle:{
        marginLeft:10, 
        marginRight:10},
    zoneNameStyle: {
        fontSize: 20,
    },
    zoneMessageStyle: {
        
        width:Dimensions.get("window").width -50,
        fontSize: 20,
    },
    zoneDateStyle: {
        fontSize: 20,
    },

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)'
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});

export default DeliveryZonesView
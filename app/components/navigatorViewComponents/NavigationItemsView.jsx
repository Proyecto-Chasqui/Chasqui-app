import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Text, Header, Button, Icon, } from 'react-native-elements';

class NavigationItemsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
    }

    goToCatalogs() {
        this.props.actions.vendorUnSelected();
        this.props.actions.flushproducts();
        this.props.actions.shoppingCartUnselected();
        this.props.actions.groupsData([]);
        this.navigation.navigate('Catalogos');
        this.navigation.reset({
            index: 0,
            routes: [{ name: 'Catalogos' }],
        });
    }

    goToDeliveryZones() {
        this.navigation.navigate('Entregas');
    }

    goToProducts() {
        this.navigation.navigate('Productos');
    }

    goToShoppingCartsHistory() {
        this.navigation.navigate('HistorialPedidos');
    }

    showControls() {
        return this.props.vendorSelected.id !== undefined;
    }

    goToGroups() {
        this.navigation.navigate('MisGrupos');
    }
    goToOpenNodes() {
        this.navigation.navigate('NodosAbiertos');
    }

    render() {
        return (
            <View style={{ backgroundColor: "white", flex: 1 }}>
                {this.showControls() ? (
                    <View style={{ flex: 1, backgroundColor: "white", marginLeft: 60 }}>
                        <TouchableOpacity
                            onPress={() => this.goToCatalogs()}
                            style={styles.optionContainer}
                        >
                            <Text style={styles.menuButtonTitleSection}>Catálogos </Text>
                        </TouchableOpacity>
                        {this.props.vendorSelected.few.seleccionDeDireccionDelUsuario || this.props.vendorSelected.few.puntoDeEntrega ?
                            (
                                <TouchableOpacity
                                    onPress={() => this.goToDeliveryZones()}
                                    style={styles.optionContainer}
                                >
                                    <Text style={styles.menuButtonTitleSection}>Entregas</Text>
                                </TouchableOpacity>
                            ) : (null)
                        }
                        {this.props.user.id != 0 ? (
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => this.goToShoppingCartsHistory()}
                                    style={styles.optionContainer}
                                >
                                    <Text style={styles.menuButtonTitleSection}>Historial de pedidos</Text>
                                </TouchableOpacity>
                                {this.props.vendorSelected.few.gcc ? (
                                    <TouchableOpacity
                                        onPress={() => this.goToGroups()}
                                        style={styles.optionContainer}
                                    >
                                        <Text style={styles.menuButtonTitleSection}>Mis grupos</Text>
                                    </TouchableOpacity>
                                ) : (null)}
                                {this.props.vendorSelected.few.nodos ? (
                                    <View >
                                        <TouchableOpacity
                                            onPress={() => this.goToGroups()}
                                            style={styles.optionContainer}
                                        >
                                            <Text style={styles.menuButtonTitleSection}>Mis nodos</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => this.goToOpenNodes()}
                                            style={styles.optionContainer}
                                        >
                                            <Text style={styles.menuButtonTitleSection}>Nodos abiertos</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (null)}
                            </View>
                        ) : (
                            <View>
                            {this.props.vendorSelected.few.nodos ? (
                                <View >
                                    <TouchableOpacity
                                        onPress={() => this.goToOpenNodes()}
                                        style={styles.optionContainer}
                                    >
                                        <Text style={styles.menuButtonTitleSection}>Nodos abiertos</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (null)}
                            </View>
                        )}
                    </View>
                ) : (
                        null
                    )}

            </View>
        );

    }
}

const styles = StyleSheet.create({
    optionContainer: {
        backgroundColor: "white",
        height: 40,
        flexDirection: "row",
        alignItems: "center"
    },
    menuButtonSection: {
        backgroundColor: "white",
        alignSelf: "flex-start",

    },
    menuButtonTitleSection: {
        color: "black",
        textAlign: "left",
        fontSize: 15,
        fontWeight: "bold",
    },
    menuButtonTitleFixedSection: {
        color: "black",
        alignContent: "flex-start",
        alignSelf: 'flex-end',

    }
});

export default NavigationItemsView;
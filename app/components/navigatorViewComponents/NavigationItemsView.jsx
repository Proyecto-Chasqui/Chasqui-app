import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Header, Button, Icon } from 'react-native-elements';

class NavigationItemsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
    }

    goToCatalogs() {
        this.props.actions.vendorUnSelected();
        this.props.actions.flushproducts();
        this.props.actions.shoppingCartUnselected();
        this.navigation.navigate('Catalogos');
        this.navigation.reset({
            index: 0,
            routes: [{ name: 'Catalogos' }],
          });
    }

    goToDeliveryZones() {
        this.navigation.navigate('Entregas');
    }

    goToProducts(){
        this.navigation.navigate('Productos');
    }

    showControls(){
        return this.props.vendorSelected.id !== undefined;
    }

    render() {
        return (
            <View style={{ backgroundColor: "white"}}>
                {this.showControls() ? (
                    <View style={{ backgroundColor: "white",marginTop:10,marginBottom:10, alignItems:"flex-start", }}>
                        <Button
                            buttonStyle={styles.menuButtonSection}
                            onPress={() => this.goToCatalogs()}
                            title="Catálogos"
                            titleStyle={styles.menuButtonTitleSection}
                        />
                        {this.props.vendorSelected.few.seleccionDeDireccionDelUsuario || this.props.vendorSelected.few.puntoDeEntrega ?
                        (                        
                        <Button
                                buttonStyle={styles.menuButtonSection}
                                onPress={() => this.goToDeliveryZones()}
                                title="Entregas"
                                titleStyle={styles.menuButtonTitleSection}
                        />
                        ) : (null)
                        }
                        <Button
                            buttonStyle={styles.menuButtonSection}
                            onPress={() => this.goToProducts()}
                            title="Productos"
                            titleStyle={styles.menuButtonTitleSection}
                        />
                    </View>
                ) : (
                        null
                    )}

            </View>
        );

    }
}

const styles = StyleSheet.create({
    menuButtonSection: {
        backgroundColor: "white"
    },
    menuButtonTitleSection: {
        color: "black",
        marginLeft: 50
    }
});

export default NavigationItemsView;
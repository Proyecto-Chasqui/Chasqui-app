import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Header, Button, Icon } from 'react-native-elements';

class NavigationItemsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
    }

    goToCatalogs() {
        //this.props.actions.vendorUnSelected();
        //this.props.actions.flushproducts();
        this.navigation.navigate('Catalogos');
        this.navigation.reset({
            index: 0,
            routes: [{ name: 'Catalogos' }],
          });
    }

    goToDeliveryZones() {
        this.navigation.navigate('Entregas');
    }

    showControls(){
        return this.props.vendorSelected.id !== undefined;
    }

    render() {
        return (
            <View style={{ backgroundColor: "white" }}>
                {this.showControls() ? (
                    <View>
                        <Button
                            buttonStyle={styles.menuButtonSection}
                            onPress={() => this.goToCatalogs()}
                            title="Catalogos"
                            titleStyle={styles.menuButtonTitleSection}
                        />
                        {this.props.vendorSelected.few.seleccionDeDireccionDelUsuario ?
                            (<Button
                                buttonStyle={styles.menuButtonSection}
                                onPress={() => this.goToDeliveryZones()}
                                title="Entregas"
                                titleStyle={styles.menuButtonTitleSection}
                            />) : (null)
                        }
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
        marginRight: 100,
        color: "black"
    }
});

export default NavigationItemsView;
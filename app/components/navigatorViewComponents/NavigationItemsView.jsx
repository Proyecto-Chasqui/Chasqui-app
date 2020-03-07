import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text, Header, Button, Icon } from 'react-native-elements';

class NavigationItemsView extends React.Component {
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        console.log("actions in items",props.actions);
    }

    goToCatalogs(){
        this.props.actions.vendorUnSelected()
        this.navigation.navigate('Catalogos')
    }

    render() {
        return (
            <View style={{ backgroundColor: "white" }}>
                {this.props.vendorSelected.id !== undefined ? (
                    <Button
                        buttonStyle={styles.menuButtonSection}
                        onPress={() => this.goToCatalogs()}
                        title="Catalogos"
                        titleStyle={styles.menuButtonTitleSection}
                    />
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
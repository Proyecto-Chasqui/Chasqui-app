import React from 'react'
import { Text, View, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native'
import { Header, Button, Icon, ButtonGroup, Image } from 'react-native-elements';
import PersonalDataView from '../containers/ConfigurationComponentsContainers/PersonalData';
import PasswordConfigView from '../containers/ConfigurationComponentsContainers/PasswordConfig';
import DeliveryAdressConfigView from '../containers/ConfigurationComponentsContainers/DeliveryAdressConfig';
import axios from 'axios';
import GLOBALS from '../Globals';


class ConfigurationView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            selectedIndex: 0
        }
        this.updateIndex = this.updateIndex.bind(this)
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
    }

    render() {
        const buttons = ['Datos', 'Direcciones', 'Contraseña']
        const { selectedIndex } = this.state
        return (
            <KeyboardAvoidingView style={{ flex: 1 }}>
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
                        source={ require('../components/catalogViewComponents/catalogAssets/platform-icon.png') }
                        />
                    </Header>
                </View>
                <View>
                    <ButtonGroup
                        textStyle={{ fontWeight: 'bold' }}
                        selectedTextStyle={{ fontWeight: 'bold' }}
                        selectedButtonStyle={{ backgroundColor: "#5ebb47" }}
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{ height: 50 }} />
                </View>
                {this.state.selectedIndex === 0 ? (<PersonalDataView></PersonalDataView>) : (null)}
                {this.state.selectedIndex === 1 ? (<DeliveryAdressConfigView navigation={this.props.navigation}></DeliveryAdressConfigView>) : (null)}
                {this.state.selectedIndex === 2 ? (<PasswordConfigView></PasswordConfigView>) : (null)}
            </KeyboardAvoidingView>);
    }
}



const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: '#909090',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        borderBottomWidth:0,
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
})

export default ConfigurationView;
import React from 'react'
import { Text, View, StyleSheet,Alert, KeyboardAvoidingView } from 'react-native'
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
        <KeyboardAvoidingView>
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
            <View>
                <ButtonGroup
                textStyle={{fontWeight:'bold'}}
                selectedTextStyle={{fontWeight:'bold'}}
                selectedButtonStyle={{ backgroundColor:"#5ebb47"}}
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
        backgroundColor: 'rgba(51, 102, 255, 1)',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
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
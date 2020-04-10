import React from 'react'
import { Text, View, StyleSheet,Alert,Dimensions } from 'react-native'
import { Header, Button, Icon, ButtonGroup, Image } from 'react-native-elements';
import CartBriefingView from '../containers/ConfirmShoppingCartContainers/CartBriefing';
import ShippingSelectionView from '../containers/ConfirmShoppingCartContainers/ShippingSelection';

class ConfirmShoppingCartView extends React.PureComponent{
    constructor(props){
        super(props)
        this.state = {
            selectedIndex:0,
            maxIndex:1,
            minIndex:0,
            showBack:false,
        }
    }

    back(){
        if(this.state.selectedIndex > this.state.minIndex){
            this.setState({selectedIndex:this.state.selectedIndex - 1, showBack:this.state.selectedIndex - 1 > 0})
        }
    }

    next(){
        if(this.state.selectedIndex < this.state.maxIndex){
            this.setState({selectedIndex:this.state.selectedIndex +1, showBack:this.state.selectedIndex +1 > 0})
        }
    }
    
    alertGoOutConfirm(){
        Alert.alert(
            'Aviso',
            '¿Esta seguro de salir de la confirmación de compra?',
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.props.navigation.goBack() },                
            ],
            { cancelable: false },
        );        
    }

    render(){
        return(
        <View>
            <Header containerStyle={styles.topHeader}>
                <Button
                    icon={
                        <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                    }
                    buttonStyle={styles.rightHeaderButton}
                    onPress={() => this.alertGoOutConfirm()}
                />
                <Image
                    style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                    source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                />
            </Header>
            <View>
            {this.state.selectedIndex === 0 ? (<CartBriefingView></CartBriefingView>) : (null)}
            {this.state.selectedIndex === 1 ? (<ShippingSelectionView navigation={this.props.navigation}></ShippingSelectionView>) : (null)}
            {this.state.selectedIndex === 2 ? (<PasswordConfigView></PasswordConfigView>) : (null)}
            <View style={{ backgroundColor: '#ebedeb', height:Dimensions.get("window").height - 725 }}>
                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginTop: 15 }}>
                            {this.state.showBack ? ( <Button onPress={() => this.back()} titleStyle={{ color: 'black', }} title='Atras' containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonNotStyle}></Button>
                            ):(null)}
                           <Button onPress={() => this.next()} titleStyle={{ color: 'white', }} title='Siguiente' containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonOkStyle}></Button>
                        </View>
                    </View>
                </View>
            </View>
        </View>
            )
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

    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        marginTop: 150
    },

    errorText: {
        marginTop: 25,
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: 'center'
    },

    tipErrorText: {
        marginTop: 25,
        fontSize: 12,
        alignSelf: 'center'
    },

    searchIconErrorContainer: {
        backgroundColor: "grey",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    cartIconOkContainer: {
        backgroundColor: "green",
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },

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
    totalPriceCartStyle: {
        textAlign: 'center',
        marginTop: 7,
        fontSize: 15,
    },

    singleItemContainer: {
        marginBottom: 5,
        height: 40,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "grey",
        marginLeft: 20,
        marginRight: 20,
    },
    priceStyle: {
        fontSize: 16,
        alignSelf: 'flex-start',
        fontWeight: 'bold'
    },
    containerList: {
        flexDirection: "row",
        margin: 10
    },

    overlayAvatarContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        marginRight: 7,
        marginLeft: -7,
    },

    cardImageView: {
    },

    cardImageContainer: {
        borderWidth: 1,
        borderRadius: 50,

    },
    cardImage: {
        width: null,
        height: null,
        marginLeft: 0,
        marginRight: 0,
        borderRadius: 50,
        resizeMode: 'contain',
    },

    nameTextStyle: {
        fontSize: 12,
        alignSelf: 'flex-start',
    },

    textBadge: {
        color: "white",
        fontWeight: "bold",
        marginRight: 4,
        marginLeft: 4
    },

    badge: {
        marginTop: 10,
        marginLeft: 2,
        backgroundColor: '#00b300',
        height: 30,
        borderRadius: 5,
        borderColor: "black",
        alignSelf: 'flex-start'
    },

    badgeCobertura: {
        backgroundColor: '#48bb78',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 40
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

    badgeProductos: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        height: 30,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginRight: 2,
        marginTop: 2
    },

    tagDestacado: {
        position: "absolute",
        alignSelf: 'flex-start',
    },


    nameProducerTextStyle: {
        fontSize: 10,
        alignSelf: 'flex-start'
    },


    sealContainerStyle: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height: 60
    },

    sealStyle: {
        height: 30,
        width: 30,
    },

})

export default ConfirmShoppingCartView

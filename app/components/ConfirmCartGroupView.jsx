import React from 'react'
import { Text, View, StyleSheet, Alert, Dimensions, KeyboardAvoidingView } from 'react-native'
import { Header, Button, Icon, ButtonGroup, Image } from 'react-native-elements';
import CartBriefingView from '../containers/ConfirmShoppingCartContainers/CartBriefing';
import ShippingSelectionView from '../containers/ConfirmShoppingCartContainers/ShippingSelection';
import QuestionaryView from '../components/confirmShoppingCartComponents/QuestionaryView';
import ConfirmCartView from '../containers/ConfirmShoppingCartContainers/ConfirmCart';
import axios from 'axios'
import GLOBALS from '../Globals';
import LoadingOverlayView from '../components/generalComponents/LoadingOverlayView';
import GroupCartBriefingView from '../containers/ConfirmGroupCartContainers/GroupCartBriefing'
import { ScrollView } from 'react-native-gesture-handler';
import ConfirmGroupCart from '../containers/ConfirmGroupCartContainers/ConfirmGroupCart';

class ConfirmCartGroupView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            showWaitSign: false,
            dataShippingChanged: false,
            dataAnswersChange: false,
            selectedIndex: 0,
            maxIndex: 3,
            minIndex: 0,
            showBack: false,
            allownext: false,
            loading:false,
            sellerPointSelected: undefined,
            adressSelected: undefined,
            zone: undefined,
            questions: [],
            answers: [],
            cantProductsInCart: 0,
            comment:"",
        }
    }

    componentDidMount() {
        this.retrieveQuestions()
        this.setAllowNext(this.state.selectedIndex)
        //this.setCantProducts()
    }

    setCantProducts(){
        this.setState({cantProductsInCart: this.props.shoppingCartSelected.productosResponse.length, allownext: this.props.shoppingCartSelected.productosResponse.length > 0})
        if(this.props.shoppingCartSelected.productosResponse.length === 0){
            Alert.alert(
                'Aviso',
                'Su pedido no puede ser confirmado, por que no posee productos. Será enviado al catálogo.',
                [
                    { text: 'Entendido', onPress: () => this.props.navigation.goBack() },
                ],
                { cancelable: false },
            );
        }
    }
    
    errorAlert(error){
        if (error.response) {
            if(error.response.status === 401){
                Alert.alert(
                    'Sesion expirada',
                    'Su sesión expiro, se va a reiniciar la aplicación.',
                    [
                        { text: 'Entendido', onPress: () => this.props.actions.logout() },
                    ],
                    { cancelable: false },
                );
            }else{
                if(error.response.data !== null){
                    Alert.alert(
                        'Error',
                         error.response.data.error,
                        [
                            { text: 'Entendido', onPress: () => null },
                        ],
                        { cancelable: false },
                    );
                }else{
                    Alert.alert(
                        'Error',
                        'Ocurrió un error inesperado, sera reenviado a los catalogos. Si el problema persiste comuníquese con soporte técnico.',
                        [
                            { text: 'Entendido', onPress: () => this.props.actions.logout() },
                        ],
                        { cancelable: false },
                    );
                }
            }
        } else if (error.request) {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde",
            [
                { text: 'Entendido', onPress: () => this.props.actions.logout() },
            ],
            { cancelable: false },);
        } else {
            Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde.",
            [
                { text: 'Entendido', onPress: () => this.props.actions.logout() },
            ],
            { cancelable: false },);
        }
    }

    retrieveQuestions() {
        this.setState( {allownext: true, loading:true} )
        axios.get((this.serverBaseRoute + 'rest/client/vendedor/preguntasDeConsumoColectivo/' + this.props.vendorSelected.nombreCorto))
            .then(res => {
                this.setState({ questions: res.data, loading:false });
            }).catch((error) => {
                this.setState({loading:false });
                Alert.alert(
                    'Error',
                    'Ocurrio un error al obtener las preguntas de consumo, vuelva a intentar más tarde.',
                    [
                        { text: 'Entendido', onPress: () => this.props.navigation.goBack() },
                    ],
                    { cancelable: false },
                );
            });
    }

    
    showAlert(text){
        Alert.alert(
            'Aviso',
             text,
            [
                { text: 'Entendido', onPress: () => this.props.navigation.goBack() },

            ],
            { cancelable: false },
        );
    }

    componentDidUpdate() {
        if (this.state.dataShippingChanged) {
            this.setAllowNext(1)
            this.setState({ dataShippingChanged: false })
        }
        if (this.state.dataAnswersChange) {
            this.setAllowNext(2)
            this.setState({ dataAnswersChange: false })
        }
       // if(this.props.shoppingCartSelected.productosResponse !== undefined){
       //     if(this.state.cantProductsInCart != this.props.shoppingCartSelected.productosResponse.length){
       //         this.setCantProducts()
       //     }
       // }
    }

    setSellerPointSelected(sellerPoint) {
        this.setState({ sellerPointSelected: sellerPoint, dataShippingChanged: true })
    }

    setAdressSelected(adress) {
        this.setState({ adressSelected: adress, dataShippingChanged: true })
    }

    setAnswers(vanswers) {
        this.setState({ answers: vanswers, dataAnswersChange: true })
    }

    hasQuestionsAnswered() {
        let allAnswered = true
        this.state.answers.map((answer) => {
            if (answer.opcionSeleccionada === null) {
                allAnswered = false
            }
            if (answer.opcionSeleccionada === "") {
                allAnswered = false
            }
        })
        return allAnswered
    }

    atLeastOneConfirmed(){
        let ret = false
        this.props.groupSelected.miembros.map((miembro, i)=>{
            if(miembro.pedido !== null){
                if(miembro.pedido.estado === "CONFIRMADO"){
                    ret = true
                }
            }
        })
        return ret
    }

    setAllowNext(index) {
        if (index == 0) {
            this.setState({ allownext: this.atLeastOneConfirmed() && !this.state.loading })
        }
        if (index == 1) {
            let allow = this.state.sellerPointSelected !== undefined || this.state.adressSelected !== undefined
            this.setState({ allownext: allow })
        }
        if (index == 2) {
            if (this.state.answers.length === 0) {
                this.setState({ allownext: false })
            } else {
                this.setState({ allownext: this.hasQuestionsAnswered() })
            }
        }

    }

    back() {
        if (this.state.selectedIndex > this.state.minIndex) {
            this.setState({ selectedIndex: this.defineJumpValue(this.state.selectedIndex - 1,true), showBack: this.defineJumpValue(this.state.selectedIndex - 1,true) > 0 })
            this.setAllowNext(this.defineJumpValue(this.state.selectedIndex - 1, true))
        }
    }

    defineJumpValue(index, back){
        let retIndex = index;
        if(this.state.questions.length===0){
            if(index == 2){
                back ? retIndex = retIndex - 1 : retIndex = retIndex + 1
            }
        }
        return retIndex;
    }

    next() {
        if (this.state.selectedIndex < this.state.maxIndex) {
            this.setState({ selectedIndex: this.defineJumpValue(this.state.selectedIndex + 1,false), showBack: this.defineJumpValue(this.state.selectedIndex + 1,false) > 0 })
            this.setAllowNext(this.defineJumpValue(this.state.selectedIndex + 1, false))
        }
    }

    alertGoOutConfirm() {
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
    defineStrategyRoute(){
        let value = ''
        if(this.props.vendorSelected.few.gcc){
            value = 'rest/user/gcc/'
        }
        if(this.props.vendorSelected.few.nodos){
            value = 'rest/user/nodo/'
        }
        return value
    }

    getGroups(){
        this.setState({loading:true})
        axios.get((this.serverBaseRoute + this.defineStrategyRoute()+'all/'+this.props.vendorSelected.id),{},{withCredentials: true}).then(res => {
            this.props.actions.groupsData(res.data);     
        }).catch( (error) => {
            this.setState({loading:false})
            console.log(error);
            this.errorAlert(error)
        });
    }

    finishConfirm(){        
        this.getGroups();
        this.props.navigation.goBack();
    }
    
    getShoppingCarts() {
        axios.post((this.serverBaseRoute + 'rest/user/pedido/conEstados'), {
            idVendedor: this.props.vendorSelected.id,
            estados: [
                "ABIERTO"
            ]
        },{withCredentials: true}).then(res => {
            this.props.actions.shoppingCarts(res.data);
            this.setState({ showWaitSign: false, loading:false, allownext:false})
            Alert.alert(
                'Aviso',
                'El pedido fue confirmado correctamente. Se le enviará un email con el resumen de su pedido.',
                [
                    { text: 'Entendido', onPress: () => this.finishConfirm() },
                ],
                { cancelable: false },
            );
        }).catch((error) => {
            console.log(error);
            this.errorAlert(error)
        });
    }

    getUnreadNotifications() {
        axios.get(this.serverBaseRoute + 'rest/user/adm/notificacion/noLeidas', { withCredentials: true }).then(res => {
            this.props.actions.unreadNotifications(res.data);
        }).catch((error) => {
            this.errorAlert(error)
        });
    }
    
    confirmCart(){        
        this.setState({ showWaitSign: true, loading:true, allownext:false})
        axios.post((this.serverBaseRoute + this.defineStrategyRoute() + 'confirmar'),{
            idDireccion: this.state.adressSelected !== undefined ? this.state.adressSelected.idDireccion : null,
            idGrupo: this.props.groupSelected.id,
            idPuntoDeRetiro: this.state.sellerPointSelected !== undefined ? this.state.sellerPointSelected.id : null,
            opcionesSeleccionadas: this.state.answers,
            idZona: null,
            comentario: this.state.comment,
        },{withCredentials: true}).then(res => {
                this.getShoppingCarts();
                this.getUnreadNotifications();
        }).catch((error) => {
            this.setState({ showWaitSign: false, loading:false, allownext:true})
            this.errorAlert(error)
            });
    }

    modifyZone(vzone){
        this.setState({zone:vzone})
    }

    modifyComment(vcomment){
        this.setState({comment:vcomment})
    }

    render() {
        return (
            <KeyboardAvoidingView style={{ flex: 1 }} >
                <Header containerStyle={styles.topHeader}>
                    <Button
                        icon={
                            <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.alertGoOutConfirm()}
                    />
                        <Image
                        style={{ width: 40, height: 45 }}
                        source={ require('../components/catalogViewComponents/catalogAssets/platform-icon.png') }
                        />
                </Header>
                <LoadingOverlayView isVisible={this.state.showWaitSign} loadingText={'Confirmando su pedido...'}></LoadingOverlayView>
                <View  style={{flex:1}} >
                    {this.state.selectedIndex === 0 ? (<GroupCartBriefingView navigation={this.props.navigation}></GroupCartBriefingView>) : (null)}
                    {this.state.selectedIndex === 1 ? (<ShippingSelectionView isGroup={true} setZone={(vzone) => this.modifyZone(vzone)} spSelected={this.state.sellerPointSelected} adressSelected={this.state.adressSelected} selectedSPFunction={(sp) => this.setSellerPointSelected(sp)} selectedAdressFunction={(adress) => this.setAdressSelected(adress)} navigation={this.props.navigation}></ShippingSelectionView>) : (null)}
                    {this.state.selectedIndex === 2 ? (<QuestionaryView questions={this.state.questions} answerSetFunction={(vanswers) => this.setAnswers(vanswers)}></QuestionaryView>) : (null)}
                    {this.state.selectedIndex === 3 ? (<ConfirmGroupCart isGroup={true}
                                                                        navigation={this.props.navigation}
                                                                        comment = {(vcomment) => this.modifyComment(vcomment)}
                                                                        zone={this.state.zone}
                                                                        sellerPointSelected={this.state.sellerPointSelected}
                                                                        adressSelected={this.state.adressSelected}
                                                                        answers={this.state.answers}/>) : (null)}
                    <View style={{ marginBottom: 5, marginTop:5 }}>
                        <View >
                            <View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15}}>
                                {this.state.showBack ? (<Button onPress={() => this.back()} titleStyle={{ color: 'black', }} title='Atras' containerStyle={styles.subMenuButtonContainer} buttonStyle={styles.subMenuButtonNotStyle}></Button>
                                ) : (null)}
                                {this.state.selectedIndex === this.state.maxIndex ? (
                                <Button disabled={!this.state.allownext} 
                                    onPress={() => this.confirmCart()} 
                                    titleStyle={{ color: 'white', }} 
                                    title='Confirmar'
                                    containerStyle={styles.subMenuButtonContainer}
                                    buttonStyle={styles.subMenuButtonOkStyle}>
                                </Button>                                    
                                ):
                                (
                                <Button loading={this.state.loading}
                                    disabled={!this.state.allownext} 
                                    onPress={() => this.next()} 
                                    titleStyle={{ color: 'white', }} 
                                    title='Siguiente' 
                                    containerStyle={styles.subMenuButtonContainer}
                                     buttonStyle={styles.subMenuButtonOkStyle}>
                                 </Button>
                                )}
                                 </View>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
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
        borderBottomWidth:0,
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
        backgroundColor: '#00adee',
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

export default ConfirmCartGroupView

import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge, Input, Overlay } from 'react-native-elements'
import GLOBALS from '../../Globals'
import axios from 'axios'
const ALIAS = "Alias";
const DESCRIPCION = "Descripción";

class NewGroupView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute= GLOBALS.BASE_URL;
        this.state = {
            groupData: {
                alias: "",
                descripcion: ""
            },
            errorMessage: {
                alias: "",
                descripcion: ""
            },
            loading: false,
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

    getGroups(){
        axios.get((this.serverBaseRoute + 'rest/user/gcc/all/'+this.props.vendorSelected.id),{},{withCredentials: true}).then(res => {
            this.props.actions.groupsData(res.data);
            this.setState({loading:false})
            this.cancel()
            Alert.alert(
                'Grupo creado!',
                'El grupo fue creado con exito!',
                [
                    { text: 'Entendido', onPress: () => null },
                ],
                { cancelable: false },
            );
        }).catch( (error) => {
            this.setState({loading:false})
            console.log(error);
            this.errorAlert(error)
        });
    }

    sendCreateGroup(){
        this.setState({loading:true})
        axios.post((this.serverBaseRoute + 'rest/user/gcc/alta'),{
            idVendedor:this.props.vendorSelected.id,
            alias:this.state.groupData.alias,
            descripcion:this.state.groupData.descripcion
        },{withCredentials: true}).then(res => {
            this.getGroups();
        }).catch( (error) => {
            this.setState({loading:false})
            console.log(error);
            this.errorAlert(error)
        });
    }


    handleChangeOfField(field, value) {
        switch (field) {
            case ALIAS:
                if (value.length <= 64) {
                    this.setState((prevState) => ({
                        groupData: Object.assign({}, prevState.groupData, {
                            alias: value
                        })
                    }))
                    this.setState((prevState) => ({
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            alias: ''
                        })
                    }))
                } else {
                    this.showErrorAlias();
                }
                break;
            case DESCRIPCION:
                if (value.length <= 64) {
                    this.setState((prevState) => ({
                        groupData: Object.assign({}, prevState.groupData, {
                            descripcion: value
                        })
                    }))
                    this.setState((prevState) => ({
                        errorMessage: Object.assign({}, prevState.errorMessage, {
                            descripcion: ''
                        })
                    }))
                } else {
                    this.showErrorDescription();
                }
                break;
        }
    }
    returnValueBasedOnFieldData(field) {
        switch (field) {
            case ALIAS:
                return this.state.groupData.alias
            case DESCRIPCION:
                return this.state.groupData.descripcion
        }
    }
    normalizeText(text) {
        let normalizeText = text.replace("_", " ");
        normalizeText = normalizeText.charAt(0).toUpperCase() + normalizeText.slice(1)
        return normalizeText;
    }

    assignPlaceholderText(field) {
        switch (field) {
            case ALIAS:
                return "Nombre identificador del grupo"
            case DESCRIPCION:
                return "Descripción del grupo"
        }
    }

    assignErrorMessage(field) {
        switch (field) {
            case ALIAS:
                return this.state.errorMessage.alias
            case DESCRIPCION:
                return this.state.errorMessage.descripcion
        }
    }

    validAlias() {
        return this.state.groupData.alias.length > 3 && this.state.groupData.alias.length < 64;
    }

    validDescription() {
        return this.state.groupData.descripcion.length > 3 && this.state.groupData.descripcion.length < 64;
    }

    showErrorAlias() {
        if (!this.validAlias()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    alias: 'Debe tener entre 3 y 64 caracteres'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    alias: ''
                })
            }))
        }
    }

    showErrorDescription() {
        if (!this.validDescription()) {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    descripcion: 'Debe tener entre 3 y 64 caracteres'
                })
            }))
        } else {
            this.setState((prevState) => ({
                errorMessage: Object.assign({}, prevState.errorMessage, {
                    descripcion: ''
                })
            }))
        }
    }

    validForm() {
        return this.validAlias() && this.validDescription()
    }

    showErrors() {
        this.showErrorDescription()
        this.showErrorAlias()
    }

    createGroup() {
        if (!this.state.loading) {
            if (this.validForm()) {
                this.sendCreateGroup();
            } else {
                this.showErrors();
            }
        }
    }

    flushData() {
        this.setState({
            groupData: {
                alias: "",
                descripcion: ""
            },
            errorMessage: {
                alias: "",
                descripcion: ""
            }
        })
    }

    cancel() {
        this.flushData();
        this.props.showNewGroup()
    }
    render() {
        const fields = [ALIAS, DESCRIPCION];
        return (
            <Overlay containerStyle={styles.overlayContainer}
                overlayStyle={styles.overlay}
                windowBackgroundColor="rgba(0, 0, 0, 0.2)"
                isVisible={this.props.isVisible}
                animationType="fade"
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.topHeader}>
                        <Text style={{ fontSize: 20, margin: 15, textAlign: "center", color: "white", fontWeight: "bold" }}> Nuevo grupo </Text>
                    </View>
                    <View style={{ justifyContent: "space-evenly", flex: 1, marginTop: 5 }}>
                        <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                            {fields.map((field, i) => {
                                return (
                                    <View key={i} style={{ flex: 1 }}>
                                        <Text style={styles.fieldText}>{this.normalizeText(field)}</Text>
                                        <Input
                                            inputStyle={this.returnValueBasedOnFieldData(field).length == 0 ? styles.placeholderStyle : styles.inputTextStyle}
                                            placeholderTextColor='black'
                                            onChangeText={text => this.handleChangeOfField(field, text)}
                                            placeholder={this.assignPlaceholderText(field)}
                                            value={this.returnValueBasedOnFieldData(field)}
                                            errorStyle={{ color: 'red' }}
                                            errorMessage={this.assignErrorMessage(field)}
                                        />
                                    </View>
                                )
                            })}
                            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                                <Button
                                    title="Cancelar"
                                    titleStyle={styles.cancelarTitleButton}
                                    buttonStyle={styles.cancelarButtonStyle}
                                    containerStyle={styles.contanierCancelarButton}
                                    onPress={() => this.cancel()}
                                    raised
                                    disabled={this.state.loading}
                                />
                                <Button
                                    title="Crear"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierCancelarButton}
                                    onPress={() => this.createGroup()}
                                    raised
                                    loading={this.state.loading}
                                    icon={
                                        <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='group-add'
                                            type='material'
                                            color='white'
                                        />
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Overlay>
        )
    }
}

const styles = StyleSheet.create({

    overlayContainer: { flexDirection: "column", alignItems: "flex-end" },
    overlay: {
        maxHeight: 300,
    },
    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        borderTopEndRadius: 3,
        borderTopStartRadius: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        borderBottomWidth: 0,
        marginStart: -10,
        marginEnd: -10,
        marginTop: -10,
    },

    normalTitleButton: { fontWeight: "bold", fontSize: 18 },
    normalButtonStyle: { backgroundColor: "rgba(51, 102, 255, 1)", flex: 1 },
    contanierNormalButton: {},
    cancelarTitleButton: { fontWeight: "bold", fontSize: 18, color: "black" },
    cancelarButtonStyle: { backgroundColor: "transparent" },
    contanierCancelarButton: { flex: 1, marginStart: 5 },
    iconContainerStyle: { marginEnd: 10 },
    placeholderStyle: {
        marginLeft: 10,
        fontSize: 15
    },

    inputTextStyle: {
        color: 'rgba(51, 102, 255, 1)',
        marginLeft: 10,
        fontSize: 15
    },

    fieldText: {
        fontWeight: "bold",
        marginLeft: 10,
        fontSize: 18
    },
})


export default NewGroupView;
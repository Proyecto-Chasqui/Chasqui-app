import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert } from 'react-native'
import { Header, Button, Icon, Image, Overlay, Input, ButtonGroup, Badge } from 'react-native-elements'
import GLOBALS from '../../Globals'
import axios from 'axios'



class AdministrationMembersView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            isVisible: false,
            showEditGroup: false,
            email: "",
            dataChange: false,
            emailError: "",
            loading: false,
            selectedIndex: 0,
        }
        this.updateIndex = this.updateIndex.bind(this)
    }



    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
    }

    normalizeText(text) {
        return encodeURI(text);
    }

    createImageUrl(urlavatar) {
        let url = this.serverBaseRoute + (urlavatar)
        url += '?random_number=' + new Date().getTime();
        return url
    }

    keyExtractor = (item, index) => index.toString()

    goToMember(member) {
        this.props.actions.memberSelected(member);
        this.props.navigation.navigate("Miembro");
    }

    showAlert(message) {
        Alert.alert(
            'Aviso',
            message,
            [
                { text: 'Entendido', onPress: () => null },
            ],
            { cancelable: false },
        );
    }

    defineMessage(member) {
        if (member.nickname == null) {
            return "al usuario ".concat(member.email)
        } else {
            return "al usuario ".concat(member.nickname)
        }
    }

    askActionRemoveMember(member) { 
        Alert.alert(
            'Pregunta',
            "¿Esta seguro de expulsar a " + this.defineMessage(member) + " ?",
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.sendRemoveMember(member.email) },
            ],
            { cancelable: false },
        );
    }

    askActionRemoveMemberWithCartActive(member) { 
        Alert.alert(
            'Pregunta',
            "El usuario que va a expulsar posee un pedido ABIERTO o CONFIRMADO, expulsarlo cancelará su pedido. ¿Esta seguro de expulsar a " + this.defineMessage(member) + " ?",
            [
                { text: 'No', onPress: () => null },
                { text: 'Si', onPress: () => this.sendRemoveMember(member.email) },
            ],
            { cancelable: false },
        );
    }

    removeMember(member) {
        if (!this.state.loading) {
            if (member.pedido !== null) {
                if (!(member.pedido.estado == "ABIERTO" || member.pedido.estado == "CONFIRMADO")) {
                    this.askActionRemoveMember(member)
                } else {
                    this.askActionRemoveMemberWithCartActive(member)
                }
            } else {
                this.askActionRemoveMember(member)
            }
        }
    }

    passAdministration(member) {
        if (!this.state.loading) {
            Alert.alert(
                'Pregunta',
                "¿Esta seguro que desea ceder la administración a " + member.nickname + " ?",
                [
                    { text: 'No', onPress: () => null },
                    { text: 'Si', onPress: () => this.sendPassAdministration(member.email) },
                ],
                { cancelable: false },
            );
        }
    }

    validEmail() {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return reg.test(this.state.email)
    }
    resetInvitation() {
        this.setState({ email: '', isVisible: false, emailError: '', loading: false })
    }
    showErrorEmail() {
        this.setState({ emailError: 'Ingrese un email valido' })
    }

    defineInvitationRoute() {
        if (this.props.vendorSelected.few.gcc) {
            return 'rest/user/gcc/invitacion';
        } else {
            return 'rest/user/nodo/enviarInvitacion';
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
                        error.response.data.error.replace('Grupo inexistente',''),
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

    handleSubmit() {
        this.setState({ loading: true })
        if (this.validEmail()) {
            axios.post((this.serverBaseRoute + this.defineInvitationRoute()), {
                idGrupo: this.props.groupSelected.id,
                emailInvitado: this.state.email
            }, { withCredentials: true }).then(res => {
                this.getGroups()
                Alert.alert('Aviso', 'La invitación fue enviada correctamente', [
                    { text: 'Entendido', onPress: () => this.resetInvitation() }
                ],
                    { cancelable: false });
            }).catch((error) => {
                this.resetInvitation();
                this.errorAlert(error);
            });
        } else {
            this.setState({ loading: false })
            this.showErrorEmail()
        }

    }

    defineStrategyRoute() {
        let value = ''
        if (this.props.vendorSelected.few.gcc) {
            value = 'rest/user/gcc/'
        }
        if (this.props.vendorSelected.few.nodos) {
            value = 'rest/user/nodo/'
        }
        return value
    }

    sendPassAdministration(email) {
        if(!this.state.loading){
        this.setState({ loading: true })
        axios.post((this.serverBaseRoute + this.defineStrategyRoute() + 'cederAdministracion'), {
            idGrupo: this.props.groupSelected.id,
            emailCliente: email
        }, { withCredentials: true }).then(res => {
            this.getGroups()
            this.setState({ loading: false })            
            Alert.alert(
                'Aviso',
                'La administración fue cedida con exito',
                [
                    { text: 'Entendido', onPress: () => this.props.navigation.goBack() },
                ],
                { cancelable: false },
            );

        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            this.errorAlert(error);
        });
        }
    }

    sendRemoveMember(email) {
        this.setState({ loading: true })
        axios.post((this.serverBaseRoute + this.defineStrategyRoute() + 'quitarMiembro'), {
            idGrupo: this.props.groupSelected.id,
            emailCliente: email
        }, { withCredentials: true }).then(res => {
            this.getGroups()
            Alert.alert(
                'Aviso',
                "Usuario removido con exito",
                [
                    { text: 'Entendido', onPress: () => this.setState({ loading: false }) },
                ],
                { cancelable: false },
            );
        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            this.errorAlert(error)
        });
    }

    getRequests() {
        axios.get(this.serverBaseRoute + 'rest/user/nodo/obtenerSolicitudesDePertenenciaANodo/' + this.props.groupSelected.id, { withCredentials: true }).then(res => {
            this.props.actions.selectedNodeRequests(res.data)
        }).catch((error) => {
            console.log(error);
            this.errorAlert(error)
        });
    }

    getGroups() {
        this.setState({ loading: true })
        axios.get((this.serverBaseRoute + this.defineStrategyRoute() + 'all/' + this.props.vendorSelected.id), {}, { withCredentials: true }).then(res => {
            this.props.actions.groupsData(res.data);
            this.setState({ loading: false })
            this.findSelectedGroup()
        }).catch((error) => {
            console.log("error on get grupos");
            this.setState({ loading: false })
            console.log(error);
            this.errorAlert(error)
        });
    }

    findSelectedGroup() {
        this.props.groupsData.map((group) => {
            if (group.id === this.props.groupSelected.id) {
                this.props.actions.groupSelected(group);
            }
        })
    }

    amountOfNotManageRequests() {
        let count = 0
        this.props.selectedNodeRequests.map((request) => {
            if (request.estado === 'solicitud_pertenencia_nodo_enviado') {
                count = count + 1
            }
        })
        return count
    }

    showEditGroup() {
        this.setState({ showEditGroup: !this.state.showEditGroup })
    }

    isAdministrator(member) {
        return this.props.groupSelected.emailAdministrador === member.email
    }

    handleChange(text) {
        this.setState({ email: text, dataChange: true })
    }

    showOverlayInvitation() {
        this.setState({ isVisible: !this.state.isVisible })
    }

    isInvited(member) {
        return member.invitacion === "NOTIFICACION_NO_LEIDA";
    }

    isUser(member) {
        if (member.email === this.props.user.email) {
            return (
                {
                    backgroundColor: "white",
                    alignItems: "center",
                    flex: 1,
                    borderWidth: 2,
                    margin: 4,
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    borderColor: '#00adee',
                    elevation: 5,
                }
            )
        } else {
            return (
                {
                    backgroundColor: "white",
                    alignItems: "center",
                    flex: 1,
                    borderWidth: 1,
                    margin: 4,
                    borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }
            )
        }
    }

    hasData(data) {
        let value = false
        if (data !== null) {
            value = data.length > 0;
        }
        return value
    }

    rejectRequest(item) {
        Alert.alert(
            'Pregunta',
            '¿Esta seguro que desea rechazar la solicitud de ' + item.cliente.nombre + '?',
            [
                { text: 'No', onPress: () => null },
                {
                    text: 'Si', onPress: () => this.manageRequest(item, {
                        url: 'rechazarSolicitudDePertenencia/',
                        successMessage: 'La solicitud ha sido rechazada correctamente.',
                    }),
                },
            ],
            { cancelable: false },
        );

    }

    acceptRequest(item) {
        Alert.alert(
            'Pregunta',
            '¿Esta seguro que desea aceptar la solicitud de ' + item.cliente.nombre + '?',
            [
                { text: 'No', onPress: () => null },
                {
                    text: 'Si', onPress: () => this.manageRequest(item, {
                        url: 'aceptarSolicitudDePertenencia/',
                        successMessage: 'La solicitud se acepto con éxito, podrá ver al usuario en la sección integrantes.',
                    }),
                },
            ],
            { cancelable: false },
        );
    }

    refreshData(){
        this.getGroups()
        this.getRequests()
    }

    manageRequest(item, action) {
        this.setState({ loading: true })
        axios.post((this.serverBaseRoute + this.defineStrategyRoute() + action.url + item.id), { withCredentials: true }).then(res => {
            this.getGroups()
            this.getRequests()
            this.showAlert(action.successMessage)
        }).catch((error) => {
            this.setState({ loading: false })
            console.log(error);
            if (error.response) {
                if(error.response.data.error === 'La solicitud ya fue gestionada'){
                    Alert.alert(
                        'Solicitud ya gestionada',
                        'La solicitud ya esta gestionada, o fue cancelada por el usuario remitente',
                        [
                            { text: 'Entendido', onPress: () => this.refreshData() },
                        ],
                        { cancelable: false },
                    );
                }else{
                    this.errorAlert(error)
                }
            } else if (error.request) {
                Alert.alert('Error', "Ocurrio un error de comunicación con el servidor, intente más tarde");
            } else {
                Alert.alert('Error', "Ocurrio un error al tratar de enviar la recuperación de contraseña, intente más tarde o verifique su conectividad.");
            }
        });
    }

    renderRequests = ({ item }) => (
        <View>
            {item.estado === 'solicitud_pertenencia_nodo_enviado' ? (
                <View style={styles.itemRequest}>
                    <View style={{ width: "100%" }}>
                        <View style={styles.titleRequestContainer}>
                            <Text style={{ fontWeight: "bold", textAlign: "center", fontSize: 17, color: "white", }}>{item.cliente.nombre}</Text>
                        </View>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", margin: 5 }}>
                            <View style={styles.requestItemData}>
                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Nombre:</Text> {item.cliente.nombre} </Text>
                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Apellido:</Text> {item.cliente.apellido}</Text>
                            </View>
                            <View style={styles.requestItemData}>
                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Email:</Text> {item.cliente.email}</Text>
                            </View>
                            <View style={styles.requestItemData}>
                                {this.hasData(item.cliente.telefonoFijo) ? (
                                    <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Telefono fijo:</Text> {item.cliente.telefonoFijo} </Text>
                                ) : (null)}
                                {this.hasData(item.cliente.telefonoMovil) ? (
                                    <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Teléfono móvil:</Text> {item.cliente.telefonoMovil}</Text>
                                ) : (null)}
                            </View>
                            <View style={styles.requestItemData}>
                                <Text style={styles.itemDataInfoStyle}><Text style={styles.itemDataStyle}>Enviado el :</Text> {item.fechaCreacion}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ width: "100%", flexDirection: "row" }}>
                        <Button
                            icon={
                                <View style={{ marginRight: 5, alignSelf: "center" }}>
                                    <Icon name="cancel" size={24} color="white" type='material' />
                                </View>
                            }
                            onPress={() => this.rejectRequest(item)}
                            title="Rechazar" titleStyle={{ color: 'white', }}
                            buttonStyle={styles.subMenuButtonCancelStyle}
                            containerStyle={{ width: "50%" }}
                            disabled={this.state.loading}
                            loading={this.state.loading}
                            raised={false} type="solid"></Button>
                        <Button
                            icon={
                                <View style={{ marginRight: 5 }}>
                                    <Icon name="done" size={24} color="white" type='material' />
                                </View>
                            }
                            onPress={() => this.acceptRequest(item)}
                            title="Aceptar" titleStyle={{ color: 'white', }}
                            buttonStyle={styles.subMenuButtonOkStyle}
                            disabled={this.state.loading}
                            loading={this.state.loading}
                            containerStyle={{ width: "50%" }}
                            raised={false} type="solid"></Button>
                    </View>
                </View>
            ) : (null)}
        </View>
    )

    setActiveColor(index) {
        if (index === this.state.selectedIndex) {
            return "white"
        } else {
            return "black"
        }
    }

    renderItem = ({ item }) => (
        <View style={this.isUser(item)}>
            <View style={{ margin: 2, marginStart: 10, flexDirection: "row", alignItems: "center", alignSelf: "stretch" }}>
                {item.avatar !== null ? (
                    <Image
                        style={{ width: 50, height: 50, resizeMode: 'center', }}
                        source={{ cache: 'relaod', uri: (this.normalizeText(this.createImageUrl(item.avatar))) }}
                    />) : (
                        <Image
                            style={{ width: 50, height: 50, resizeMode: 'center', }}
                            source={{ cache: 'relaod', uri: (this.normalizeText(this.createImageUrl(this.props.user.avatar))) }}
                        />
                    )}
                {this.isAdministrator(item) ? (
                    <View style={{ position: "absolute", alignSelf: "flex-start", marginStart: -4, marginTop: 1, borderWidth: 1, borderRadius: 10, backgroundColor: "#5ebb47" }}>
                        <Icon containerStyle={{ margin: 1 }} name="star" size={15} color='#00adee' type='font-awesome' />
                    </View>
                ) : (null)}
                {this.isInvited(item) ? (
                    <View style={{ position: "absolute", alignSelf: "flex-start", marginStart: -4, marginTop: 1, borderWidth: 1, borderRadius: 10, backgroundColor: "#5ebb47" }}>
                        <Icon containerStyle={{ margin: 1 }} name="email-plus" size={15} color='#00adee' type='material-community' />
                    </View>
                ) : (null)}
                <View style={{ marginStart: 10, flex: 1 }}>
                    {item.nickname == null ? (<Text style={{ fontSize: 15, fontWeight: "bold", fontStyle: "italic", color: "black" }}>Usuario no registrado</Text>) : (
                        <Text style={{ fontSize: 15, fontWeight: "bold", fontStyle: "italic", }}>{item.nickname}</Text>
                    )}
                    <Text style={{ fontSize: 12, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>{item.email}</Text>
                    <View>
                        {item.pedido != null ? (
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Pedido: {item.pedido.estado}</Text>
                            </View>)
                            : (
                                <View>
                                    {this.isInvited(item) ? (
                                        <Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: '#00adee' }} >Invitación enviada</Text>
                                    ) : (
                                            <Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Sin pedido</Text>
                                        )}
                                </View>
                            )
                        }
                    </View>
                </View>
                {!this.isAdministrator(item) ? (
                    <View style={{ margin: 2, marginStart: 10, justifyContent: "center", flexDirection: "row" }}>
                        <Button icon={
                            <Icon name="account-minus" size={25} color="white" type='material-community' />
                        }
                            containerStyle={{ margin: 2 }}
                            buttonStyle={{ backgroundColor: "#5ebb47", borderColor: "black", borderWidth: 1, borderRadius: 7 }}
                            onPress={() => this.removeMember(item)}
                            loading={this.state.loading}
                        >
                        </Button>
                        {item.invitacion !== "NOTIFICACION_NO_LEIDA" ? (
                            <Button icon={
                                <Icon name="account-star" size={25} color="white" type='material-community' />
                            }
                                buttonStyle={{ backgroundColor: "#5ebb47", borderColor: "black", borderWidth: 1, borderRadius: 7 }}
                                onPress={() => this.passAdministration(item)}
                                loading={this.state.loading}
                                containerStyle={{ margin: 2 }}>
                            </Button>) : (
                                null
                            )}
                    </View>
                ) : (
                        <View style={{ marginEnd: 12 }}>
                            <Icon name="account-star" size={25} color='#00adee' type='material-community' />
                        </View>)}
            </View>
        </View>
    )

    render() {
        const members = () => <Text style={{ fontWeight: "bold", fontSize: 16, color: this.setActiveColor(0) }}>Integrantes</Text>
        const requests = () =>
            <View style={{flexDirection:"row", alignItems:"center"}}>
            {this.amountOfNotManageRequests() > 0 ? (
                <Badge value={this.amountOfNotManageRequests()} status="error" containerStyle={{ position: 'relative', marginRight:5 }} />
            ) : (null)} 
                <Text style={{ fontWeight: "bold", fontSize: 16, color: this.setActiveColor(1) }}>Solicitudes</Text>
            </View>

        const buttons = [{ element: members }, { element: requests },]
        const { selectedIndex } = this.state
        
        return (
            <View style={{ flex: 1 }}>
                <Overlay
                    isVisible={this.state.isVisible}
                    width="90%"
                    height={245}
                    onBackdropPress={() => this.resetInvitation()}
                    animationType="fade"
                >
                    <View style={{ height: "25%" }}>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoText}>Invitar</Text>
                        </View>
                        <View style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}>
                            <Text style={{ fontSize: 18, alignSelf: 'center' }}>Escriba el correo del usuario al que desea invitar.</Text>
                        </View>
                        <View style={{ height: 60 }}>
                            <Input
                                inputStyle={{ color: "black", marginLeft: 10, }}
                                placeholderTextColor="black"
                                onChangeText={text => this.handleChange(text)}
                                placeholder=''
                                errorStyle={{ color: 'red' }}
                                errorMessage={this.state.emailError}
                                leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                                value={this.state.email}
                            />
                        </View>
                        <View style={styles.buttonRecoverContainer}>
                            <Button buttonStyle={{ width: 140, backgroundColor: 'transparent', borderColor: "grey", borderWidth: 1 }} titleStyle={{ fontSize: 20, color: "black" }} disabled={this.state.loading} onPress={() => this.resetInvitation()} title="Cancelar" />
                            <Button buttonStyle={{ width: 140, backgroundColor: '#5ebb47', borderColor: "grey", borderWidth: 1, marginLeft: 5 }} titleStyle={{ fontSize: 20, }} disabled={this.state.loading} onPress={() => this.handleSubmit()} title="Enviar" />
                        </View>
                    </View>
                </Overlay>
                {this.props.hideHeaders ? (null) : (
                    <View>
                        <Header containerStyle={styles.topHeader}>
                            <Button
                                icon={
                                    <Icon name="arrow-left" size={20} color="white" type='font-awesome' />
                                }
                                loading={this.state.loading}
                                buttonStyle={styles.rightHeaderButton}
                                onPress={() => this.props.navigation.goBack()}
                            />
                            <Image
                                style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                                source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                            />
                            <Button
                                icon={
                                    <Icon name="user-plus" size={20} color="white" type='font-awesome' />
                                }
                                loading={this.state.loading}
                                buttonStyle={styles.rightHeaderButton}
                                onPress={() => this.showOverlayInvitation()}
                            />
                        </Header>
                    </View>
                )}
                {this.props.vendorSelected.few.nodos ? (
                <View style={styles.buttonGroupContainer}>

                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{borderColor:"white"}}
                        selectedButtonStyle={{ backgroundColor: "#5ebb47" }}
                    />
                </View>
                ):(null)}
                {this.state.selectedIndex === 0 ? (
                    <View style={{ flex: 1 }}>
                        <FlatList
                            ListHeaderComponent={
                                <View>
                                    {this.props.hideHeaders ? (null) : (
                                        <View style={styles.titleContainer}>
                                            <Text style={styles.adressTitle}>Administración de integrantes</Text>
                                        </View>)}
                                </View>
                            }
                            keyExtractor={this.keyExtractor}
                            data={this.props.groupSelected.miembros}
                            renderItem={(item) => this.renderItem(item)}
                        />
                    </View>
                ) : (null)}
                {this.state.selectedIndex === 1 ? (
                    <View style={{ flex: 1 }}>
                        {this.amountOfNotManageRequests() > 0 ? (
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    ListHeaderComponent={
                                        <View>
                                            {this.props.hideHeaders ? (null) : (
                                                <View style={styles.titleContainer}>
                                                    <Text style={styles.adressTitle}>Solicitudes de ingreso</Text>
                                                </View>)}
                                        </View>
                                    }
                                    keyExtractor={this.keyExtractor}
                                    data={this.props.selectedNodeRequests}
                                    renderItem={(item) => this.renderRequests(item)}
                                />
                            </View>
                        ) : (
                                <View style={{ width: Dimensions.get("window").width, flexDirection: "row", justifyContent: "center", height: "100%", }}>
                                    <View style={styles.viewErrorContainer}>

                                        <View style={styles.searchIconErrorContainer}>
                                            <Icon name="file-move" type='material-community' size={48} color={"white"} containerStyle={styles.searchIconError}></Icon>
                                        </View>
                                        <Text style={styles.errorText}>
                                            No posee ninguna solicitud para gestionar
                                        </Text>
                                        <View style={{ justifyContent: "center", alignContent: "center", alignItems: "center" }}>
                                            <Text style={styles.tipErrorText}>
                                                Aquí vera las solicitudes enviadas a su nodo
                                            </Text>
                                            <Text style={styles.tipErrorText}>
                                                Recibirá solicitudes mientras el nodo este abierto
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                    </View>
                ) : (null)}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonGroupContainer: {
        backgroundColor: '#00adee',   
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
        height: 50
    },
    itemRequest: {
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        margin: 4,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },
    itemDataInfoStyle: { fontSize: 16, fontWeight: "bold", fontStyle: "italic", color: "grey" },
    itemDataStyle: { color: "black", fontStyle: "normal" },
    requestItemData: { flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "100%", },

    overlayContainer: {

    },
    overlay: {
        height: 200,
    },
    buttonRecoverContainer: {
        flexDirection: "row",
        marginTop: 15,
        alignSelf: 'center',
    },
    emailTitle: {
        marginTop: 10,
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },

    titleRequestContainer: {
        backgroundColor: "#00adee",
        height: 50,
        alignItems: "center",
        justifyContent: "center"
    },

    infoTextContainer: {
        backgroundColor: "#00adee",
        marginTop: -10,
        marginLeft: -10,
        marginRight: -10,
        height: 50,
        alignItems: "center"
    },

    infoText: {
        marginTop: 10,
        fontSize: 19,
        fontWeight: "bold",
        color: "white"
    },

    principalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00adee',
    },
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
        borderBottomWidth: 0,
    },
    rightHeaderButton: {
        backgroundColor: '#66000000',
        marginRight: 0,
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

    titleContainer: {
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },

    adressTitle: {
        backgroundColor: "white",
        alignSelf: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },

    notificationItem: {
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        margin: 4,
        borderRadius: 5,
        height: Dimensions.get("window").height / 5.5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    viewSearchErrorContainer: {
        height: "100%"
    },

    viewErrorContainer: {
        justifyContent: "center",
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
        backgroundColor: "#00adee",
        borderWidth: 2,
        borderRadius: 50,
        width: 100,
        height: 100,
        alignSelf: 'center'
    },

    searchIconError: {
        marginTop: 23,
    },

    buttonMore: {
        backgroundColor: "#5ebb47",
        borderColor: 'grey',
        borderWidth: 1
    },
    groupItem: {
        backgroundColor: "white",
        alignItems: "center",
        flex: 1,
        borderWidth: 1,
        margin: 4,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },


    subMenuButtonContainer: {
    },

    subMenuButtonOkStyle: {
        backgroundColor: "#5ebb47",
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 1,
        borderRadius: 0,
        borderBottomRightRadius: 5,
        borderLeftWidth: 1,
    },

    subMenuButtonCancelStyle: {
        backgroundColor: "red",
        borderColor: 'black',
        borderTopWidth: 1,
        marginBottom: 0,
        borderRadius: 0,
        borderBottomLeftRadius: 5,
    },
})

export default AdministrationMembersView
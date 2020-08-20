import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Button, Icon, Overlay, CheckBox, Image, Header, Badge } from 'react-native-elements';

class GroupsControlsOverlayView extends React.PureComponent {
    constructor(props) {
        super(props)
    }

    goToNewGroup() {
        this.props.showControls();
        this.props.showNewGroup();
    }

    updateGroupsData(){
        this.props.showControls();
        this.props.updateData();
    }

    goToInvitations(){
        this.props.showControls();
        this.props.navigation.navigate("Invitaciones")
    }

    goToNodeRequest(){
        this.props.showControls();
        this.props.navigation.navigate("SolicitudDeNodo")
    }

    render() {
        return (
            <Overlay containerStyle={styles.overlayContainer}
                overlayStyle={styles.overlay}
                windowBackgroundColor="rgba(0, 0, 0, 0.2)"
                onBackdropPress={() => this.props.showControls()} isVisible={this.props.isVisible}
                animationType="slide"
            >
                <View style={{ flex: 1 }}>
                    <View style={styles.topHeader}>
                        <Text style={{ fontSize: 20, margin: 15, textAlign: "center", color: "white", fontWeight: "bold" }}> Acciones </Text>
                    </View>
                    <View style={{ justifyContent: "space-evenly", flex: 1, marginTop: 5 }}>
                        <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                            {this.props.groupsData.length > 0 ? (
                                <Button
                                    title="Actualizar"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    icon={
                                        <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='history'
                                            type='font-awesome'
                                            color='white'
                                        />
                                    }
                                    raised
                                    onPress={()=>this.updateGroupsData()}
                                />
                            ) : (null)}
                            {this.props.vendorSelected.few.gcc ?(
                            <Button
                                title="Crear grupo"
                                titleStyle={styles.normalTitleButton}
                                buttonStyle={styles.normalButtonStyle}
                                containerStyle={styles.contanierNormalButton}
                                onPress={() => this.goToNewGroup()}
                                raised
                                icon={
                                    <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='group-add'
                                        type='material'
                                        color='white'
                                        size={35}
                                    />
                                }
                            />):(
                                <Button
                                title="Solicitar Nodo"
                                titleStyle={styles.normalTitleButton}
                                buttonStyle={styles.normalButtonStyle}
                                containerStyle={styles.contanierNormalButton}
                                onPress={() => null}
                                raised
                                icon={
                                    <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='group-add'
                                        type='material'
                                        color='white'
                                        size={35}
                                    />
                                }
                                onPress={()=> this.goToNodeRequest()}
                            />                                
                            )}
                            <View>
                            <Button
                                title="Ver invitaciones"
                                titleStyle={styles.normalTitleButton}
                                buttonStyle={styles.normalButtonStyle}
                                containerStyle={styles.contanierNormalButton}
                                icon={
                                    <View>
                                    <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='envelope'
                                        type='font-awesome'
                                        color='white'
                                    />
                                    {this.props.invitationsData.length > 0 ? (
                                        <Badge value={this.props.invitationsData.length} status="error" containerStyle={{ position: 'absolute', left:-7, top:-5  }}/>
                                    ):(null)}
                                    </View>
                                }
                                raised
                                onPress={()=>this.goToInvitations()}
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
        maxHeight: 280,
    },
    topHeader: {
        backgroundColor: '#00adee',
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
    normalButtonStyle: { backgroundColor: '#00adee' },
    contanierNormalButton: { marginTop: 5 },
    iconContainerStyle: { marginEnd: 10 },

})

export default GroupsControlsOverlayView;
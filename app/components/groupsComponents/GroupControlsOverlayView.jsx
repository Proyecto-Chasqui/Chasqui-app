import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { Button, Icon, Overlay, CheckBox, Image, Header } from 'react-native-elements';

class GroupControlsOverlayView extends React.PureComponent {
    constructor(props) {
        super(props)
        console.log("group in control", this.props.groupSelected)
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
                        <Text style={{ fontSize: 20, margin: 15, textAlign: "center", color: "white", fontWeight: "bold" }}> Opciones del grupo</Text>
                    </View>
                    <View style={{ justifyContent: "space-evenly", flex: 1, marginTop: 5 }}>

                        {this.props.groupSelected.esAdministrador ? (
                            <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                <Button
                                    title="Historial de pedidos"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='archive'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                    raised
                                />
                                <Button
                                    title="Gestionar grupo"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='clipboard'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                    raised
                                />

                                <Button
                                    title="Administrar integrantes"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    raised
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='users'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                />

                                <Button
                                    title="Comenzar mi pedido"
                                    titleStyle={styles.normalTitleButton}
                                    buttonStyle={styles.normalButtonStyle}
                                    containerStyle={styles.contanierNormalButton}
                                    icon={                                        
                                        <Icon
                                        containerStyle={styles.iconContainerStyle}
                                        name='shopping-cart'
                                        type='font-awesome'
                                        color='white'
                                        />
                                    }
                                    raised
                                />

                            </View>
                        ) : (
                                <View style={{ justifyContent: "space-evenly", flex: 1 }}>
                                    <Button
                                        title="Historial de pedidos"
                                        titleStyle={styles.normalTitleButton}
                                        buttonStyle={styles.normalButtonStyle}
                                        containerStyle={styles.contanierNormalButton}
                                        icon={                                        
                                            <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='archive'
                                            type='font-awesome'
                                            color='white'
                                            />
                                        }
                                        raised
                                    />
                                    <Button
                                        title="Comenzar mi pedido"
                                        titleStyle={styles.normalTitleButton}
                                        buttonStyle={styles.normalButtonStyle}
                                        containerStyle={styles.contanierNormalButton}
                                        icon={                                        
                                            <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='shopping-cart'
                                            type='font-awesome'
                                            color='white'
                                            />
                                        }
                                        raised
                                    />

                                    <Button
                                        title="Salir del grupo"
                                        titleStyle={styles.normalTitleButton}
                                        buttonStyle={styles.normalButtonStyle}
                                        containerStyle={styles.contanierNormalButton}
                                        icon={                                        
                                            <Icon
                                            containerStyle={styles.iconContainerStyle}
                                            name='sign-out'
                                            type='font-awesome'
                                            color='white'
                                            />
                                        }
                                        raised
                                    />
                                </View>
                            )}
                    </View>
                </View>
            </Overlay>
        )
    }
}

const styles = StyleSheet.create({
    overlayContainer: { flexDirection: "column", alignItems: "flex-end" },
    overlay: {
        maxHeight: 260,
    },
    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        borderTopEndRadius:3,
        borderTopStartRadius:3,
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
        marginEnd:-10,
        marginTop: -10,
    },

    normalTitleButton: { fontWeight: "bold", fontSize: 18 },
    normalButtonStyle: { backgroundColor: "rgba(51, 102, 255, 1)" },
    contanierNormalButton: { marginTop: 5 },
    iconContainerStyle:{marginEnd:10},

})

export default GroupControlsOverlayView;
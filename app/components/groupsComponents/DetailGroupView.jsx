import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge } from 'react-native-elements'
import GLOBALS from '../../Globals'
import GroupControlsOverlayView from '../../containers/GroupsComponentsContainers/GroupControlsOverlay'
import EditGroupView from '../../containers/GroupsComponentsContainers/EditGroup'

class DetailGroupView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state={
            showControls:false,
            showEditGroup:false,
        }
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

    goToMember(member){
        this.props.actions.memberSelected(member);
        this.props.navigation.navigate("Miembro");
    }

    showControls(){
        this.setState({showControls:!this.state.showControls})
    }

    showEditGroupFromControl(){
        this.showControls()
        this.setState({showEditGroup:!this.state.showEditGroup})
    }

    filterConfirmed(members){
        let confirmedMemebers = []
        members.map((member)=>{
            if(member.pedido !== null){
                if(member.pedido.estado === "CONFIRMADO"){
                    confirmedMemebers.push(member)
                }
            }
        })
        return confirmedMemebers
    }

    obtainMembers(){
        if(this.props.onlyConfirmed){
            return this.filterConfirmed(this.props.groupSelected.miembros)
        }else{
            return this.props.groupSelected.miembros
        }
    }
    
    showEditGroup(){
        this.setState({showEditGroup:!this.state.showEditGroup})
    }
    isAdministrator(member){
        return this.props.groupSelected.emailAdministrador === member.email
    }

    isUser(member){
        if(member.email === this.props.user.email){
            return(
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
                    borderColor:"blue",
                    elevation: 5,
                }
            )
        }else{
            return(
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

    renderItem = ({ item }) => (
        <View>
        { item.invitacion !== "NOTIFICACION_NO_LEIDA" ?(
        <TouchableOpacity disabled={this.props.disabledPress} onPress={()=>(this.goToMember(item))} style={this.isUser(item)}>
            <View style={{ margin: 2, marginStart:10, flexDirection: "row", alignItems: "center", alignSelf:"stretch" }}>
                <Image
                    style={{ width: 50, height: 50, resizeMode: 'center',  }}
                    source={{ uri: (this.normalizeText(this.createImageUrl(item.avatar))) }}
                />
                {this.isAdministrator(item)?(
                <View style={{position:"absolute", alignSelf:"flex-start", marginStart:-4, marginTop:1,borderWidth:1, borderRadius:10, backgroundColor:"#5ebb47" }}>
                    <Icon containerStyle={{margin:1}} name="star" size={15} color="blue" type='font-awesome' />
                </View>
                ):(null)}
                <View style={{ marginStart: 10,flex:1  }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold", fontStyle: "italic", }}>{item.nickname}</Text>
                    <Text style={{ fontSize: 12, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>{item.email}</Text>
                    <View>
                        {item.pedido != null ?(
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Pedido: {item.pedido.estado}</Text>
                            <Text style={{ fontSize: 14, fontWeight: "bold", fontStyle: "italic", color: "grey" }}>Total: ${item.pedido.montoActual}</Text>
                        </View>)
                            : (<Text style={{ fontSize: 14, marginEnd: 10, fontWeight: "bold", fontStyle: "italic", color: "grey" }} >Sin pedido</Text>)
                        }
                    </View>
                </View>
                {!this.props.disabledPress?(
                <View style={{flex:1,alignItems:"flex-end", marginEnd:5}}>
                <Icon                    
                    name='chevron-right'
                    type='font-awesome'
                    color='blue'
                    />
                </View>
                ):(null)}
            </View>
        </TouchableOpacity>):(null)}</View>
    )

    render() {
        return (
            <View style={{flex:1}}>
                {this.props.hideHeaders?(null):(
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
                        style={{ width: 50, height: 50, alignSelf: 'center', resizeMode: 'center' }}
                        source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/dc32d347623fd85be9939fdf43d9374e/icon-homer-ch.png' }}
                    />
                    <Button
                        icon={
                            <Icon name="cogs" size={20} color="white" type='font-awesome' />
                        }
                        buttonStyle={styles.rightHeaderButton}
                        onPress={() => this.showControls()}
                    />
                </Header>
                <GroupControlsOverlayView navigation={this.props.navigation} showEditGroup={() => this.showEditGroupFromControl()} showControls={()=>this.showControls()} isVisible={this.state.showControls}></GroupControlsOverlayView>
                <EditGroupView navigation={this.props.navigation} showEditGroup={() => this.showEditGroup()} isVisible={this.state.showEditGroup}></EditGroupView>
                </View>
                )}
                <View>
                    <FlatList
                        ListHeaderComponent={
                            <View>
                            {this.props.hideHeaders?(null):(
                            <View style={styles.titleContainer}>
                                <Text style={styles.adressTitle}>{this.props.groupSelected.alias}</Text>
                            </View>)}
                            </View>
                            }
                        keyExtractor={this.keyExtractor}
                        data={this.obtainMembers()}
                        renderItem={(item) => this.renderItem(item)}
                    />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({

    topHeader: {
        backgroundColor: 'rgba(51, 102, 255, 1)',
        marginTop: -25,
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
        backgroundColor: "rgba(51, 102, 255, 1)",
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
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
})

export default DetailGroupView
import React from 'react'
import { View, Text, StyleSheet, Dimensions, FlatList, Alert, TouchableOpacity } from 'react-native'
import { Header, Button, Icon, Image, ListItem, Badge } from 'react-native-elements'
import GLOBALS from '../../Globals'
import axios from 'axios'

class RequestQuantityView extends React.PureComponent{
    constructor(props){
        super(props)
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.state = {
            requestQuantity : 0,
            idNode: this.props.idNode,
            date: this.props.date,
        }
    }

    componentDidUpdate(){
        if(this.state.date !== this.props.date){
            this.getRequestsNumberFor(this.state.idNode)
            this.setState({date: this.props.date})
        }
    }

    componentDidMount(){
        this.getRequestsNumberFor(this.state.idNode)
    }

    getRequestsNumberFor(vidNode){
        axios.get(this.serverBaseRoute + 'rest/user/nodo/obtenerSolicitudesDePertenenciaANodo/' + vidNode, { withCredentials: true }).then(res => {
            this.setState({requestQuantity:this.amountOfNotManageRequests(res.data)})
        }).catch((error) => {
        });
    }

    amountOfNotManageRequests(requests){
        let count = 0
        requests.map((request)=>{
            if(request.estado === 'solicitud_pertenencia_nodo_enviado'){
                count = count + 1
            }
        })
        return count
    }

    render(){

        if(this.state.requestQuantity === 0){
            return(null)
        }

        return(
            <View style={{ backgroundColor: "#ebedeb", marginBottom: 3, borderWidth: 1, borderColor: "black", borderRadius: 5, flexDirection: "row", alignItems: "center" }}>
            <View style={{ margin: 3, flexDirection: "row", alignItems: "center" }}>
                <Icon
                    name='file-move'
                    type='material-community'
                    color='green'
                    size={20}
                />
                <Text style={{ fontSize: 16, fontWeight: "bold" }}> Solicitudes: {this.state.requestQuantity} </Text>
            </View>
        </View>
        )
    }
}

export default RequestQuantityView
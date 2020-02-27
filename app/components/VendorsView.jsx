import React from 'react';
import { StyleSheet, View, Text, Alert, Image, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { Card, ListItem, Button, Icon } from 'react-native-elements'



class VendorsView extends React.Component {
    constructor(props) {
        super(props);
        this.vendors = props.actions.vendors;
        this.state = {
            isLoading: true
          };       
    }    
    
    componentWillMount() {
        this.getVendors();
    }

    getVendors(props){
        axios.get('http://69.61.93.71/chasqui-dev-panel/rest/client/vendedor/all')
        .then(res => {
           this.vendors(res.data);
           this.setState({
                isLoading: false
            });
        }).catch(function (error) {
            Alert.alert(
                'Error',
                'Ocurrio un error al obtener los vendedores, vuelva a intentar mas tarde.',
                [                  
                  {text: 'Entendido', onPress: () =>  props.navigation.navigate('Bienvenidxs')},
                ],
                {cancelable: false},
              );
        });
    }
    
    render() {
        if (this.state.isLoading) {
            return <View><Text>Loading...</Text></View>;
        }
        return(
        <ScrollView>
            <View style={styles.flexView}>
            {

                this.props.vendors.map((u, i) => {
                    return (
                        <View style={styles.wiewCard}>
                            <Card>
                                <View style={styles.card} key={i} >
                                    <Image style={styles.cardImage} source={{ uri: 'http://69.61.93.71/chasqui-dev-panel/' + u.imagen}}/>      
                                    <Text style={styles.nameTextStyle}>{u.nombre}</Text>
                                    <Text>{u.tagsTipoOrganizacion.nombre}</Text>                          
                                </View>
                            </Card>  
                        </View>                          
                    );
                })
            }
            </View>            
        </ScrollView>
        );
    }
}

const styles = StyleSheet.create ({

    flexView: {
        flex: 1,
        flexDirection:'row',
        flexWrap: 'wrap',
        alignContent: 'center'
    },

    nameTextStyle: {
        width: Dimensions.get('window').width / 2.5,
    },

    wiewCard: {
        width: Dimensions.get('window').width / 2,
        
    },

    card:{
        height: Dimensions.get('window').height / 2.7
    },

    cardImage : { 
        width: Dimensions.get('window').width / 2.3,
        height: 120,
        resizeMode: 'cover',
        marginTop: -14.5,
        marginBottom: -15.5,
        marginLeft: -17,
    },

    cardText: {
        textAlign: "left",
        marginTop: 0        
    },

    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingVertical: -20,
        marginStart: -15,
        marginEnd:-13,
        marginTop: -14.5,
        marginBottom: 0,
    }
});

export default VendorsView;
import React from 'react';
import { Image, View, StyleSheet, Text, Dimensions } from "react-native";


class LoadingView extends React.Component{
    constructor (props){
        super(props);
    }
    render (){
        return(
            <View style={styles.mainContainer}>
                <View styles={styles.imageContainer}>
                    <Image source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/3393d9d818fe4c927b72cccaf5dd72c0/chk-loading.gif' }}
                    style={styles.image}></Image>
                </View>
                <Text style={styles.loadingText}>Cargando...</Text>
            </View>            
        );
    }
}

const styles = StyleSheet.create ({
    mainContainer:{
        flex:1,
        flexDirection:'column',
        alignItems:'center',
        alignContent:'center',
        backgroundColor:'rgba(51, 102, 255, 1)'
    },

    imageContainer:{
        
    },

    loadingText:{
        fontSize: 24,
        marginTop: 5,
        color: 'white',
        fontWeight: "bold",
    },

    image:{
        marginTop: Dimensions.get('window').height / 4,
        width: 278 / 2,
        height: 321 / 2,
        resizeMode: 'contain',
    }
});

export default LoadingView;
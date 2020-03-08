import React from 'react';
import { Image, View, StyleSheet, Text, Dimensions } from "react-native";


class LoadingView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.textStyle = props.textStyle;
    }
    render() {
        return (
            <View style={styles.mainContainer}>
                <View styles={styles.imageContainer}>
                    <Image source={{ uri: 'https://trello-attachments.s3.amazonaws.com/5e569e21b48d003fde9f506f/278x321/3393d9d818fe4c927b72cccaf5dd72c0/chk-loading.gif' }}
                        style={styles.image}></Image>
                </View>
                {this.textStyle === undefined || this.textStyle === {} ? (
                    <Text style={styles.loadingText}>Cargando...</Text>)
                    :
                    (<Text style={this.textStyle}>Cargando...</Text>)
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(51, 102, 255, 1)'
    },

    imageContainer: {

    },

    loadingText: {
        position: "absolute",
        fontSize: 24,
        marginTop: 5,
        color: 'white',
        fontWeight: "bold",
        marginTop: "100%",
    },

    image: {
        marginTop: "50%",
        width: 278 / 2,
        height: 321 / 2,
        resizeMode: 'contain',
    }
});

export default LoadingView;
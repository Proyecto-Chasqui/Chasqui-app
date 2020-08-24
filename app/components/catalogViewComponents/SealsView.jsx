import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import GLOBALS from '../../Globals';

class SealsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.productSeals = this.setSeals(props.productSeals);
        this.producerSeals = this.setSeals(props.producerSeals);
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.sealsStyle = this.setStyle(props.sealsStyle);
        this.sealsContainer = this.setContainerStyle(props.sealsContainer);
    }

    setContainerStyle(data){
        if(data == undefined){
            return style.sealContainerStyle;
        }
        else
        {               
            return data
        };
    }

    setStyle(data){
        if(data == undefined){
            return style.sealStyle;
        }
        else
        {               
            return data
        };
    }

    setSeals(data){
        if(data == undefined){
            return [];
        }
        else
        {               
            return data
        };
    }

    normalizeText(text) {
        
        return encodeURI(text);
    }

    render() {
        if(this.setSeals(this.props.producerSeals).length == 0 && this.setSeals(this.props.productSeals).length == 0){
            return (
                <View style={this.sealsContainer} >
                    <Image style={this.sealsStyle} placeholderStyle={style.placeHolderStyle} source={null}></Image>
                </View>
            );
        }

        return (
            <View style={this.sealsContainer} >
                {this.setSeals(this.props.productSeals).length > 0 ? (
                    this.props.productSeals.map((seal, i) => {
                        return (
                                <Image key={i} style={this.sealsStyle}  PlaceholderContent={<ActivityIndicator  color="#0000ff" />} source={{ uri: (this.normalizeText(this.serverBaseRoute + seal.pathImagen)) }} />
                            
                        );
                    })
                ) : (null)}
                {this.setSeals(this.props.producerSeals).length > 0 ? (
                    this.props.producerSeals.map((seal, i) => {
                        return (
                                <Image key={i+200} style={this.sealsStyle}  PlaceholderContent={<ActivityIndicator color="#0000ff" />} source={{ uri: (this.normalizeText(this.serverBaseRoute + seal.pathImagen)) }} />
                            
                        );
                    })
                ) : (null)}
            </View>
        );
    }
}

const style = StyleSheet.create({
    
    placeHolderStyle:{
        backgroundColor:"transparent"
    },

    sealContainerStyle:{
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 3,
        height:120
    },

    sealStyle: {
        height: 60,
        width: 60,
    },
});

export default SealsView;

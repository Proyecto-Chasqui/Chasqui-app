import React from 'react'
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import GLOBALS from '../../Globals';

class SealsView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.productSeals = this.setSeals(props.productSeals);
        this.producerSeals = this.setSeals(props.producerSeals);
        this.serverBaseRoute = GLOBALS.BASE_URL;
        this.sealsStyle = props.sealsStyle;
        this.sealsContainer = props.sealsContainer;
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
        if(this.productSeals.length == 0 && this.producerSeals.length == 0){
            return (
                <View style={this.sealsContainer} >
                    <Image style={this.sealsStyle}  source={null}></Image>
                </View>
            );
        }

        return (
            <View style={this.sealsContainer} >
                {this.productSeals !== null ? (
                    this.productSeals.map((seal, i) => {
                        return (
                                <Image style={this.sealsStyle} PlaceholderContent={<ActivityIndicator  color="#0000ff" />} source={{ uri: (this.normalizeText(this.serverBaseRoute + seal.pathImagen)) }} />
                            
                        );
                    })
                ) : (null)}
                {this.producerSeals !== null ? (
                    this.producerSeals.map((seal, i) => {
                        return (
                                <Image style={this.sealsStyle} PlaceholderContent={<ActivityIndicator color="#0000ff" />} source={{ uri: (this.normalizeText(this.serverBaseRoute + seal.pathImagen)) }} />
                            
                        );
                    })
                ) : (null)}
            </View>
        );
    }
}

export default SealsView;

import React from 'react'
import { Button, Icon, Input, Text } from 'react-native-elements';
import { View , TextInput, StyleSheet} from 'react-native';

class QuantitySelectorView extends React.PureComponent{
    constructor(props){
        super(props)
        this.text = this.props.text;
        this.state = {
            value: this.setInitialValue(props.initialValue)
        }        
    }

    setInitialValue(value){
        if(value === undefined){
            return "0"
        }
        return value;
    }

    onChangeText(text){
        let reg = new RegExp('^[0-9]+$');
        console.log(reg.test(text));
        if(reg.test(text)){
            let adjustedValue = parseInt(text, 10).toString();
            this.setState({
                value: adjustedValue
            })
        }
    }

    substract(){
        let varValue = parseInt(this.state.value)
        if(varValue > 0){
            varValue = varValue - 1;
            this.setState({
                value: varValue.toString() 
            })
        }
    }

    add(){
        let varValue = parseInt(this.state.value);
        if(varValue > -1){
            varValue = varValue + 1;
            this.setState({
                value: varValue.toString() 
            })
        }
    }

    render(){
        return(
        <View style={{flexDirection:"row",width:"100%"}}>
            <View style={{ width:"10%"}}>
            <Button buttonStyle={{height:"100%", backgroundColor:"transparent", }}
                icon={
                    <Icon
                    name='caret-left'
                    type='font-awesome'
                    color='#b0b901'
                    size={30}
                    />
                }
                onPress={() => this.substract()}
                />
            </View>
            <View style={styles.verticalDivisor} />
            <View style={{alignSelf:"center", height:"100%", justifyContent:"center", alignContent:"center", flexDirection:"row", width:"80%" }}> 
                <Text style={{alignSelf:"center", fontSize:20}}>{this.props.text}</Text>
                <TextInput style={{ width:"25%",height:"100%", alignSelf:"center", fontSize:20}} containerStyle={{alignSelf:"center", }}
                        maxLength={10}
                        keyboardType='numeric'
                        onChangeText={text => this.onChangeText(text)}
                        value = {this.state.value}
                />
            </View>
            <View style={styles.verticalDivisor} />
            <View style={{ width:"9%"}}>
            <Button buttonStyle={{height:"100%", backgroundColor:"transparent"}}
                icon={
                        <Icon
                        name='caret-right'
                        type='font-awesome'
                        color='#b0b901'
                        size={30}
                        />
                }
                onPress={() => this.add()}
                />
            </View>
        </View>
        );
    }

}

const styles = StyleSheet.create({
    verticalDivisor: {
        borderLeftWidth: 2,
        borderLeftColor: "#D8D8D8",
        height: "100%",
        alignSelf: "center"
    },
})

export default QuantitySelectorView;
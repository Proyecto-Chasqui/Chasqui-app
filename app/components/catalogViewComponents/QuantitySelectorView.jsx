import React from 'react'
import { Button, Icon, Input, Text } from 'react-native-elements';
import { View , TextInput, StyleSheet} from 'react-native';

class QuantitySelectorView extends React.PureComponent{
    constructor(props){
        super(props)
        this.text = this.props.text;
        this.functionValueComunicator = this.props.functionValueComunicator;
        this.state = {
            initialValue: this.setInitialValue(this.props.initialValue),
            value: this.setInitialValue(this.props.initialValue)
        }        
    }

    componentDidUpdate(){
        if(this.state.initialValue !== this.props.initialValue){
            this.setState({initialValue: this.setInitialValue(this.props.initialValue),
            value:this.setInitialValue(this.props.initialValue)})
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
        if(reg.test(text)){
            let adjustedValue = parseInt(text, 10).toString();
            this.setState({
                value: adjustedValue
            })
            let change = this.valueEquals(parseInt(text, 10))
            this.functionValueComunicator(parseInt(text, 10), change);
        }
    }

    substract(){
        let varValue = parseInt(this.state.value)
        if(varValue > 0){
            varValue = varValue - 1;
            this.setState({
                value: varValue.toString() 
            })
            this.functionValueComunicator(varValue, (this.valueEquals(varValue)));
        }
    }

    valueEquals(varValue){
        return parseInt(this.state.initialValue) === varValue
    }

    add(){
        let varValue = parseInt(this.state.value);
        if(varValue > -1){
            varValue = varValue + 1;
            this.setState({
                value: varValue.toString() 
            })
            this.functionValueComunicator(varValue, (this.valueEquals(varValue)));
        }
        
    }

    render(){
        return(
        <View style={{flexDirection:"row", flex:1}}>
            <View style={{flex:3}} >
            <Button buttonStyle={{height:"100%", backgroundColor:"transparent", }}
                icon={
                    <Icon
                    name='caret-left'
                    type='font-awesome'
                    color='#b0b901'
                    size={30}
                    />
                }
                disabled={this.props.disabled}
                onPress={() => this.substract()}
                />
            </View>
            <View style={styles.verticalDivisor} />
            <View style={{flex:12, alignSelf:"center", height:"100%", justifyContent:"center", alignContent:"center", flexDirection:"row" }}> 
                <Text style={{alignSelf:"center", fontSize:20}}>{this.props.text}</Text>
                <TextInput style={{height:"100%", alignSelf:"center", fontSize:20}} containerStyle={{alignSelf:"center", }}
                        maxLength={10}
                        keyboardType='numeric'
                        onChangeText={text => this.onChangeText(text)}
                        value = {this.state.value}                        
                        editable={!this.props.disabled}
                />
            </View>
            <View style={styles.verticalDivisor} />
            <View style={{flex:3}} >
            <Button buttonStyle={{height:"100%", backgroundColor:"transparent"}}
                icon={
                        <Icon
                        name='caret-right'
                        type='font-awesome'
                        color='#b0b901'
                        size={30}
                        />
                }
                disabled={this.props.disabled}
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
    },
})

export default QuantitySelectorView;
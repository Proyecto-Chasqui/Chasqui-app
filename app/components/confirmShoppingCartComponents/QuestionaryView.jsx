import React from 'react'
import RNPickerSelect from 'react-native-picker-select';
import { Text, View, Dimensions, StyleSheet } from 'react-native';
import { Icon,  } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

class QuestionaryView extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            questions: [],
            answers: [],
        }
    }
    componentDidMount(){
        this.parseQuestions(this.props.questions)
        this.props.answerSetFunction([])
    }

    parseQuestions(listQuestions) {
        const questionsParsed = []
        const anwersParsed = []
        listQuestions.map((question) => {
            let nameQuestion = question.nombre
            let options = []
            question.opciones.map((option) => {
                options.push({ label: option, value: option, color: "black" })
            })
            questionsParsed.push({ nameQuestion, options })
            anwersParsed.push({nombre: nameQuestion, opcionSeleccionada: null})
        })
        this.setState({questions: questionsParsed, answers:anwersParsed})
    }

    setAnswer(nameQuestion, vanswer){
        let copyAnswers = this.state.answers
        copyAnswers.map((answer, i)=>{
            if(answer.nombre === nameQuestion){
                copyAnswers[i].opcionSeleccionada = vanswer
            }
        })
        this.setState({answers: copyAnswers})
        this.props.answerSetFunction(copyAnswers)   
    }

    setColor(i){
        
    }

    render() {
        return (
            <View style={{ height: Dimensions.get("window").height - 155 }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.adressTitle}>Preguntas de consumo</Text>
                </View>
                <View style={{margin:15, justifyContent:'center',}}>
                    <Text style={{textAlign:'center', fontSize:15, fontWeight:'bold'}}> Por favor responda las siguientes preguntas </Text>
                </View>
                <ScrollView>
                {this.state.questions.map((question, i) => {
                    return (
                        <View key={i} style={{flexDirection:"row", alignItems:"center"}}>
                            <View style={{marginLeft:10, flex:2,flexDirection:"row"}}>
                                {this.state.answers[i].opcionSeleccionada !== null ?(
                                    <Icon name="check" type='font-awesome' size={20} color={"green"}></Icon>
                                ):(<Icon name="check" type='font-awesome' size={20} color={"#ebedeb"}></Icon>)}
                                <Text style={{textAlign:"center"}}> {i+1}. </Text>
                            </View>
                            <View key={i} style={{ flex:14,
                                borderColor: this.state.answers[i].opcionSeleccionada === null ? "black" : "blue", borderWidth: 1, borderRadius: 10, margin: 8, marginRight:15
                            }}>
                                <RNPickerSelect
                                    onValueChange={(value) => this.setAnswer(question.nameQuestion, value)}
                                    items={question.options}
                                    placeholder={{
                                        label: question.nameQuestion,
                                        value: null,
                                        color: "blue"
                                    }}
                                    value={this.state.answers[i].opcionSeleccionada}
                                    useNativeAndroidPickerStyle={true}
                                />
                            </View>
                        </View>
                    )
                })}
                </ScrollView>
            </View>)
    }
}

const styles = StyleSheet.create({
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
})

export default QuestionaryView
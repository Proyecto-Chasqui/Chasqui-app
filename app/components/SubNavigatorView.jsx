import React from 'react'
import Catalog from '../containers/Catalog';
import Product from '../containers/Product';
import Producer from '../containers/CatalogComponentsContainers/Producer';
import SealsPage from '../containers/SealsPage';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const FadeTransition = (index,position) =>{
    const sceneRange = [index-1, index];
    const outputOpacity = [0,1];
    const transition = position.interpolated({
      inputRange: sceneRange,
      outputRange: outputOpacity,
    });
  
    return{
      opacity: transition,
    }
  }
  
  const NavigationConfig = () =>{
    return {
      screenInterpolator:(sceneProps) =>{
        const position = sceneProps.position;
        const scene = sceneProps.scene;
        const index = scene.index;
  
        return FadeTransition(index,position);
      }
    }
  }

class SubNavigatorView extends React.PureComponent{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Stack.Navigator initialRouteName="Catalogo" transitionConfig={NavigationConfig}>
                  <Stack.Screen name='Catalogo' component={Catalog}  options={{headerShown: false}}/>
                  <Stack.Screen name='Producto' component={Product}  options={{headerShown: false}} />
                  <Stack.Screen name='Fabricante' component={Producer}  options={{headerShown: false}} />
                  <Stack.Screen name='Sellos' component={SealsPage}  options={{headerShown: false}} />
            </Stack.Navigator>
          );
    }
}

export default SubNavigatorView
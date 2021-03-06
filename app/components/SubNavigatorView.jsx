import React from 'react'
import Catalog from '../containers/Catalog';
import Product from '../containers/Product';
import Producer from '../containers/CatalogComponentsContainers/Producer';
import SealsPage from '../containers/SealsPage';
import DeliveryZones from '../containers/DeliveryZones';
import Configuration from '../containers/Configuration';
import AdressManagment from '../containers/AdressManagment';
import MapAdressConfig from '../components/MapAdressConfig';
import ConfirShoppingCart from '../containers/ConfirmShoppingCart';
import Notifications from '../containers/Notifications';
import ShoppingCartsHistory from '../containers/ShoppingCartsHistory';
import HistoryCartBreifing from '../containers/ShoppingCartsHistoryContainers/HistoryCartBriefingContainer';
import GroupsView from '../containers/GroupsContainer';
import GroupDetail from '../containers/GroupsComponentsContainers/GroupDetail';
import Member from '../containers/GroupsComponentsContainers/Member';
import NewGroup from '../containers/GroupsComponentsContainers/NewGroup';
import confirmCartGroupView from '../containers/ConfirmCartGroup';
import AdministrationMembersView from '../containers/GroupsComponentsContainers/AdministrationMembers';
import InvitationsView from '../containers/GroupsComponentsContainers/Invitations';
import GroupHistoryShoppingCartsView from '../containers/GroupsComponentsContainers/GroupHistoryShoppingCarts';
import GroupHistoryShoppingCartDetailView from '../containers/GroupsComponentsContainers/GroupHistoryShoppingCartDetail';
import NodeRequestView from '../containers/GroupsComponentsContainers/NodeRequest';
import OpenNodesView from '../containers/OpenNodes'
import PrivacyPolicyView from '../components/PrivacyPolicyView'
import TermsAndConditionsView from '../components/TermsAndConditionsView'
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
            <Stack.Navigator initialRouteName="Productos" transitionConfig={NavigationConfig}>
                  <Stack.Screen name='Productos' component={Catalog}  options={{headerShown: false}}/>
                  <Stack.Screen name='Producto' component={Product}  options={{headerShown: false}} />
                  <Stack.Screen name='Fabricante' component={Producer}  options={{headerShown: false}} />
                  <Stack.Screen name='Sellos' component={SealsPage}  options={{headerShown: false}} />
                  <Stack.Screen name='Entregas' component={DeliveryZones}  options={{headerShown: false}} />
                  <Stack.Screen name='Configuración' component={Configuration} options ={{headerShown:false}}/>
                  <Stack.Screen name='GestiónDeDirección' component={AdressManagment} options ={{headerShown:false}} />
                  <Stack.Screen name='MapaDeDirección' component={MapAdressConfig} options={{headerShown:false}} />
                  <Stack.Screen name='ConfirmarPedido' component={ConfirShoppingCart} options={{headerShown:false}} />
                  <Stack.Screen name='Notificaciones' component={Notifications} options={{headerShown:false}} />
                  <Stack.Screen name='HistorialPedidos' component={ShoppingCartsHistory} options={{headerShown:false}}  />
                  <Stack.Screen name='HistorialDePedido' component={HistoryCartBreifing} options={{headerShown:false}}  />
                  <Stack.Screen name='MisGrupos' component={GroupsView} options={{headerShown:false}}  />
                  <Stack.Screen name='Grupo' component={GroupDetail} options={{headerShown:false}}  />
                  <Stack.Screen name='Miembro' component={Member} options={{headerShown:false}}  />   
                  <Stack.Screen name='NuevoGrupo' component={NewGroup} options={{headerShown:false}}  />   
                  <Stack.Screen name='ConfirmarColectivo' component={confirmCartGroupView} options={{headerShown:false}}  />  
                  <Stack.Screen name='GestionarMiembros' component={AdministrationMembersView} options={{headerShown:false}}  />                   
                  <Stack.Screen name='Invitaciones' component={InvitationsView} options={{headerShown:false}}  />                   
                  <Stack.Screen name='HistorialPedidosGrupo' component={GroupHistoryShoppingCartsView} options={{headerShown:false}}  />                   
                  <Stack.Screen name='DetalleHistorialPedidosGrupo' component={GroupHistoryShoppingCartDetailView} options={{headerShown:false}}  />                   
                  <Stack.Screen name='SolicitudDeNodo' component={NodeRequestView} options={{headerShown:false}}  />                   
                  <Stack.Screen name='NodosAbiertos' component={OpenNodesView} options={{headerShown:false}}  />                   
                  <Stack.Screen name='TerminosYCondiciones' component={TermsAndConditionsView} options={{headerShown:false}}  />                   
                  <Stack.Screen name='PoliticasDePrivacidad' component={PrivacyPolicyView} options={{headerShown:false}}  />                   
                
             </Stack.Navigator>
          );
    }
}

export default SubNavigatorView
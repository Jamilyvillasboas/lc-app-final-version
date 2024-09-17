import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens'; 

import Home from './src/app/home/Index.js';
import Entradas from './src/app/home/Entradas.js';
import Vendas from './src/app/home/Vendas.js';
import Estoque from './src/app/home/Estoque.js';
import Metas from './src/app/home/Metas.js';
import Saídas from './src/app/home/Saidas.js';


enableScreens();

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{
          headerShown: false, 
        }}>
      <Stack.Screen 
        name="Home" 
        component={Home} 
      />
      <Stack.Screen 
        name="Entradas" 
        component={Entradas} 
      />
      <Stack.Screen 
        name="Saídas" 
        component={Saídas} 
      />
      <Stack.Screen 
        name="Estoque" 
        component={Estoque} 
      />
      <Stack.Screen 
        name="Metas" 
        component={Metas} 
      />
      <Stack.Screen 
        name="Vendas" 
        component={Vendas} 
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
}

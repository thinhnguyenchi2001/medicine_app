import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/views/screens/LoginScreen';
import RegistrationScreen from './src/views/screens/RegistrationScreen';
import OnBoardScreen from './src/views/screens/OnBoardScreen';
import DetailsScreen from './src/views/screens/DetailsScreen';
import BottomNavigator from './src/views/navigation/BottomNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './src/views/components/Loader';
import SearchScreen from './src/views/screens/SearchScreen';
import {COLORS2} from './src/conts/colors';
import ObjectScreen from './src/views/screens/ObjectScreen';
import CategoryScreen from './src/views/screens/CategoryScreen';
import UserScreen from './src/views/screens/UseScreen';
import HomeScreen from './src/views/screens/HomeScreen';
import ShipScreen from './src/views/screens/ShipScreen';
import CartScreen from './src/views/screens/CartScreen';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
<>
            <StatusBar
              backgroundColor={COLORS2.white}
              barStyle="dark-content"
            />
            <Stack.Navigator
              initialRouteName='BoardScreen'
              screenOptions={{headerShown: false}}>
              <Stack.Screen
                name="RegistrationScreen"
                component={RegistrationScreen}
              />
              <Stack.Screen name="LoginScreen" component={LoginScreen} />
              <Stack.Screen name="BoardScreen" component={OnBoardScreen} />
              <Stack.Screen name="Home" component={BottomNavigator} />
              <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
              <Stack.Screen name="SearchScreen" component={SearchScreen} />
              <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
              <Stack.Screen name="ObjectScreen" component={ObjectScreen} />
              <Stack.Screen name="UserScreen" component={UserScreen} />
              <Stack.Screen name="HomeScreen" component={HomeScreen} />
              <Stack.Screen name="ShipScreen" component={ShipScreen} />
              <Stack.Screen name="CartScreen" component={CartScreen} />
            </Stack.Navigator>
          </>
        
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;

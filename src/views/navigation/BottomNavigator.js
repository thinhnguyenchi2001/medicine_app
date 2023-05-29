import 'react-native-gesture-handler';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS2} from '../../conts/colors';
import {View} from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import SearchScreen from '../screens/SearchScreen';
import ObjectScreen from '../screens/ObjectScreen';
import CategoryScreen from '../screens/CategoryScreen';


const Tab = createBottomTabNavigator();

const BottomNavigator = () => {

  return (
    <Tab.Navigator
      screenOptions={{
        style: {
          height: 55,
          borderTopWidth: 0,
          elevation: 0,
        },
        showLabel: false,
        activeTintColor: COLORS2.primary
      }}>
      <Tab.Screen
        name="Nổi bật"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="home-filled" color={color} size={28} />
          ),
        navigationKey:'HomeScreen'
        }}
      />
      <Tab.Screen
        name="Danh mục"
        component={CategoryScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="local-mall" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Tìm kiếm"
        component={SearchScreen}
        options={{
          tabBarIcon: ({color}) => (
            <View
              style={{
                height: 60,
                width: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS2.white,
                borderColor: COLORS2.primary,
                borderWidth: 2,
                borderRadius: 30,
                top: -25,
                elevation: 5,
              }}>
              <Icon name="search" color={COLORS2.primary} size={28} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Đối tượng"
        component={ObjectScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="favorite" color={color} size={28} />
          ),
        }}
      />
      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Icon name="shopping-cart" color={color} size={28} />
          ),
        }}
        navigationKey='CartScreen'
      />
    </Tab.Navigator>
  );
};

export default BottomNavigator;

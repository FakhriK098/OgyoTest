import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailScreen from '../screens/DetailScreen';
import { RootStackParamList } from './types';
import MainTabs from './TabsNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerNavigator } from './DrawerNavigator';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { SuperAdminProfileScreen } from '../screens/SuperAdminProfileScreen';
import { SuperAdminEditProfileScreen } from '../screens/SuperAdminEditProfileScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainDrawer"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FCFCFC' },
        }}
      >
        {/* Main Application with Drawer & Bottom Tabs */}
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

        {/* Stack-accessible screens */}
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            animationEnabled: true,
          }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            animationEnabled: true,
          }}
        />

        {/* Super Admin Dedicated Profile & Edit Screens */}
        <Stack.Screen
          name="SuperAdminProfile"
          component={SuperAdminProfileScreen}
          options={{
            animationEnabled: true,
          }}
        />

        <Stack.Screen
          name="SuperAdminEditProfile"
          component={SuperAdminEditProfileScreen}
          options={{
            animationEnabled: true,
          }}
        />

        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{
            animationEnabled: true,
          }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            animationEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

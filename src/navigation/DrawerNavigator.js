import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { CustomDrawerContent } from './CustomDrawerContent';
import { COLORS } from '../constants/colors';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.primaryLight,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: COLORS.textDark,
        drawerStyle: {
          width: 300,
          backgroundColor: COLORS.surface,
        },
      }}
    >
      <Drawer.Screen
        name="DashboardTabs"
        component={BottomTabNavigator}
        options={{
          drawerLabel: 'Home Store',
        }}
      />
      <Drawer.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          drawerLabel: 'Admin Dashboard',
        }}
      />
    </Drawer.Navigator>
  );
};

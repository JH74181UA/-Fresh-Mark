// src/navigation/AppNavigator.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import { Colors, FontSizes } from '../theme';
import { useApp } from '../context/AppContext';
import CustomerDrawerContent from './CustomerDrawerContent';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CartScreen from '../screens/CartScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// ─── Shared header options ───────────────────────────────────────────────────
const sharedHeaderOptions = {
  headerStyle: { backgroundColor: Colors.header },
  headerTintColor: Colors.white,
  headerTitleStyle: { fontWeight: '700', fontSize: FontSizes.lg, color: Colors.white },
  headerShadowVisible: false,
};

// ─── Cart Badge Component ─────────────────────────────────────────────────────
const CartTabIcon = ({ focused, color }) => {
  const { getCartCount } = useApp();
  const count = getCartCount();
  return (
    <View>
      <Ionicons name={focused ? 'cart' : 'cart-outline'} size={24} color={color} />
      {count > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      )}
    </View>
  );
};

// ─── Customer Bottom Tabs ─────────────────────────────────────────────────────
const CustomerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
      headerStyle: { backgroundColor: Colors.header },
      headerTintColor: Colors.white,
      headerTitleStyle: { fontWeight: '700', fontSize: FontSizes.lg },
      headerShadowVisible: false,
      tabBarIcon: ({ focused, color }) => {
        const icons = {
          Home: focused ? 'home' : 'home-outline',
          Products: focused ? 'storefront' : 'storefront-outline',
          Cart: focused ? 'cart' : 'cart-outline',
          Favorites: focused ? 'heart' : 'heart-outline',
          Profile: focused ? 'person' : 'person-outline',
        };
        if (route.name === 'Cart') return <CartTabIcon focused={focused} color={color} />;
        return <Ionicons name={icons[route.name] || 'ellipse-outline'} size={24} color={color} />;
      },
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeTabStack}
      options={{ headerShown: false, title: 'Home' }}
    />
    <Tab.Screen
      name="Products"
      component={ProductsTabStack}
      options={{ headerShown: false, title: 'Products' }}
    />
    <Tab.Screen
      name="Cart"
      component={CartScreen}
      options={{ title: '🛒 My Cart', headerTitle: 'My Cart' }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{ title: 'Favorites', headerTitle: '❤️ Favorites' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileTabStack}
      options={{ headerShown: false, title: 'Profile' }}
    />
  </Tab.Navigator>
);

// Nested stacks inside tabs
const HomeTabStack = () => {
  const { signOut } = useApp();
  return (
    <Stack.Navigator screenOptions={sharedHeaderOptions}>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const ProductsTabStack = () => (
  <Stack.Navigator screenOptions={sharedHeaderOptions}>
    <Stack.Screen
      name="ProductsList"
      component={ProductsScreen}
      options={{ title: '🛒 Daily Groceries' }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={({ route }) => ({
        title: route.params?.product?.name || 'Product Details',
        headerBackTitle: 'Back',
      })}
    />
  </Stack.Navigator>
);

const ProfileTabStack = () => (
  <Stack.Navigator screenOptions={sharedHeaderOptions}>
    <Stack.Screen
      name="ProfileMain"
      component={ProfileScreen}
      options={{ title: 'My Profile' }}
    />
    <Stack.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ title: 'Edit Profile' }}
    />
  </Stack.Navigator>
);

// ─── Customer Drawer ─────────────────────────────────────────────────────────
const CustomerDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomerDrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: {
        backgroundColor: Colors.drawerBg,
        width: 280,
      },
      drawerActiveTintColor: Colors.primary,
      drawerInactiveTintColor: Colors.textSecondary,
      overlayColor: Colors.overlay,
    }}
  >
    <Drawer.Screen name="CustomerTabs" component={CustomerTabs} />
    <Drawer.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={{ ...sharedHeaderOptions, headerShown: true, title: 'Product Details' }}
    />
    <Drawer.Screen
      name="EditProfile"
      component={EditProfileScreen}
      options={{ ...sharedHeaderOptions, headerShown: true, title: 'Edit Profile' }}
    />
  </Drawer.Navigator>
);

// ─── Admin Stack ─────────────────────────────────────────────────────────────
const AdminStack = () => (
  <Stack.Navigator screenOptions={sharedHeaderOptions}>
    <Stack.Screen
      name="AdminDashboard"
      component={AdminDashboardScreen}
      options={{ title: '🔐 Admin Panel' }}
    />
    <Stack.Screen
      name="Products"
      component={ProductsScreen}
      options={{ title: 'All Products' }}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={({ route }) => ({
        title: route.params?.product?.name || 'Product Details',
      })}
    />
  </Stack.Navigator>
);

// ─── Auth Stack ───────────────────────────────────────────────────────────────
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      ...sharedHeaderOptions,
      headerShown: false,
    }}
  >
    <Stack.Screen name="Landing" component={HomeScreen} />
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        headerShown: true,
        title: 'Sign In',
        headerLeft: null,
      }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ headerShown: true, title: 'Sign Up' }}
    />
  </Stack.Navigator>
);

// ─── Root Navigator ───────────────────────────────────────────────────────────
const AppNavigator = () => {
  const { isAuthenticated, user } = useApp();

  return (
    <NavigationContainer
      documentTitle={{
        formatter: (options, route) => 'FreshMart Grocery',
      }}
    >
      {!isAuthenticated ? (
        <AuthStack />
      ) : user?.role === 'admin' ? (
        <AdminStack />
      ) : (
        <CustomerDrawer />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 60,
    paddingTop: 6,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
});

export default AppNavigator;

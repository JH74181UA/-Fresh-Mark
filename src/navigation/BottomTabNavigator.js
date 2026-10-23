import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductsListScreen } from '../screens/ProductsListScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const Tab = createBottomTabNavigator();

export const BottomTabNavigator = () => {
  const { totalItemsCount } = useCart();
  const { favoritesCount } = useFavorites();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProductsTab"
        component={ProductsListScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'nutrition' : 'nutrition-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarBadge: favoritesCount > 0 ? favoritesCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'heart' : 'heart-outline'}
              size={size || 22}
              color={focused ? COLORS.danger : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarBadge: totalItemsCount > 0 ? totalItemsCount : undefined,
          tabBarBadgeStyle: styles.badge,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size || 22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    height: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Header = ({
  title,
  showBack = false,
  showMenu = true,
  showCart = true,
  rightComponent,
}) => {
  const navigation = useNavigation();
  const { totalItemsCount } = useCart();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : showMenu ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.openDrawer()}
            accessibilityLabel="Open drawer menu"
          >
            <Ionicons name="menu-outline" size={26} color={COLORS.textDark} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <View style={styles.centerContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {user?.role && (
          <View style={[
            styles.rolePill,
            user.role === 'admin' ? styles.adminPill : styles.customerPill
          ]}>
            <Text style={[
              styles.roleText,
              user.role === 'admin' ? styles.adminRoleText : styles.customerRoleText
            ]}>
              {user.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightComponent ? (
          rightComponent
        ) : showCart ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Cart')}
            accessibilityLabel="View Cart"
          >
            <Ionicons name="cart-outline" size={24} color={COLORS.textDark} />
            {totalItemsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  leftContainer: {
    width: 44,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  rolePill: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customerPill: {
    backgroundColor: COLORS.customerBadgeLight,
  },
  adminPill: {
    backgroundColor: COLORS.adminBadgeLight,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  customerRoleText: {
    color: COLORS.customerBadge,
  },
  adminRoleText: {
    color: COLORS.adminBadge,
  },
  rightContainer: {
    width: 44,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});

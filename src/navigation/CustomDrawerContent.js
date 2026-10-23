import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export const CustomDrawerContent = (props) => {
  const { user, isAdmin, isAuthenticated, logout, quickSwitchRole } = useAuth();
  const { totalItemsCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { navigation } = props;

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to log out of FreshMart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.closeDrawer();
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
        {/* User Profile Header in Drawer */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user?.email || 'guest@freshmart.com'}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  isAdmin ? styles.adminBadge : styles.customerBadge,
                ]}
              >
                <Ionicons
                  name={isAdmin ? 'shield-checkmark' : 'person'}
                  size={12}
                  color={isAdmin ? COLORS.adminBadge : COLORS.customerBadge}
                />
                <Text
                  style={[
                    styles.roleBadgeText,
                    isAdmin ? styles.adminBadgeText : styles.customerBadgeText,
                  ]}
                >
                  {isAdmin ? 'ADMIN ACCOUNT' : 'CUSTOMER ACCOUNT'}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Role Switcher for MCA Exam Testing */}
          <View style={styles.roleSwitchCard}>
            <Text style={styles.roleSwitchLabel}>Exam Fast Switch:</Text>
            <View style={styles.switchButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  !isAdmin ? styles.switchBtnActive : styles.switchBtnInactive,
                ]}
                onPress={() => quickSwitchRole('customer')}
              >
                <Text
                  style={[
                    styles.switchBtnText,
                    !isAdmin ? styles.switchBtnTextActive : styles.switchBtnTextInactive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  isAdmin ? styles.switchBtnAdminActive : styles.switchBtnInactive,
                ]}
                onPress={() => quickSwitchRole('admin')}
              >
                <Text
                  style={[
                    styles.switchBtnText,
                    isAdmin ? styles.switchBtnTextActive : styles.switchBtnTextInactive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Navigation Links */}
        <View style={styles.navSection}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('HomeTab')}
          >
            <Ionicons name="home-outline" size={22} color={COLORS.primary} style={styles.navIcon} />
            <Text style={styles.navItemText}>Home Screen</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('ProductsTab')}
          >
            <Ionicons name="nutrition-outline" size={22} color={COLORS.primary} style={styles.navIcon} />
            <Text style={styles.navItemText}>Daily Groceries</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('FavoritesTab')}
          >
            <Ionicons name="heart-outline" size={22} color={COLORS.danger} style={styles.navIcon} />
            <Text style={styles.navItemText}>My Favorites</Text>
            {favoritesCount > 0 && (
              <View style={[styles.navBadge, { backgroundColor: COLORS.dangerLight }]}>
                <Text style={[styles.navBadgeText, { color: COLORS.danger }]}>{favoritesCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('CartTab')}
          >
            <Ionicons name="cart-outline" size={22} color={COLORS.primary} style={styles.navIcon} />
            <Text style={styles.navItemText}>Shopping Cart</Text>
            {totalItemsCount > 0 && (
              <View style={[styles.navBadge, { backgroundColor: COLORS.primaryLight }]}>
                <Text style={[styles.navBadgeText, { color: COLORS.primary }]}>{totalItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Ionicons name="person-outline" size={22} color={COLORS.primary} style={styles.navIcon} />
            <Text style={styles.navItemText}>Customer Profile</Text>
          </TouchableOpacity>

          {isAdmin && (
            <TouchableOpacity
              style={styles.navItem}
              onPress={() => navigation.navigate('AdminDashboard')}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={COLORS.adminBadge}
                style={styles.navIcon}
              />
              <Text style={[styles.navItemText, { color: COLORS.adminBadge }]}>
                Admin Inventory Console
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Ionicons name="log-in-outline" size={22} color={COLORS.textDark} style={styles.navIcon} />
            <Text style={styles.navItemText}>Sign In with Role</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Ionicons name="person-add-outline" size={22} color={COLORS.textDark} style={styles.navIcon} />
            <Text style={styles.navItemText}>Create New Account</Text>
          </TouchableOpacity>
        </View>

        {/* MCA Exam Tag Footer */}
        <View style={styles.examFooterBox}>
          <Text style={styles.examFooterTitle}>MCA Sem III Model Exam</Text>
          <Text style={styles.examFooterSub}>October 2026 • React Native App</Text>
          <Text style={styles.examFooterTech}>Stack + Tab + Drawer Navigation</Text>
        </View>
      </DrawerContentScrollView>

      {/* Bottom Sign Out Action */}
      <View style={styles.bottomDrawerContainer}>
        {isAuthenticated ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: COLORS.primary }]}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Ionicons name="log-in-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.logoutBtnText, { color: COLORS.primary }]}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    paddingTop: 0,
  },
  profileHeader: {
    backgroundColor: COLORS.surfaceVariant,
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userInfo: {
    marginLeft: 14,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  customerBadge: {
    backgroundColor: COLORS.customerBadgeLight,
  },
  adminBadge: {
    backgroundColor: COLORS.adminBadgeLight,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  customerBadgeText: {
    color: COLORS.customerBadge,
  },
  adminBadgeText: {
    color: COLORS.adminBadge,
  },
  roleSwitchCard: {
    marginTop: 14,
    backgroundColor: COLORS.surface,
    padding: 10,
    borderRadius: 12,
  },
  roleSwitchLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  switchButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  switchBtnActive: {
    backgroundColor: COLORS.primary,
  },
  switchBtnAdminActive: {
    backgroundColor: COLORS.adminBadge,
  },
  switchBtnInactive: {
    backgroundColor: COLORS.surfaceVariant,
  },
  switchBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  switchBtnTextActive: {
    color: COLORS.white,
  },
  switchBtnTextInactive: {
    color: COLORS.textDark,
  },
  navSection: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  navIcon: {
    marginRight: 14,
  },
  navItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  navBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  navBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
    marginHorizontal: 12,
  },
  examFooterBox: {
    margin: 16,
    padding: 14,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  examFooterTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  examFooterSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  examFooterTech: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  bottomDrawerContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
    backgroundColor: COLORS.white,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.danger,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export const CustomDrawerContent = (props) => {
  const { user, isAdmin, isSuperAdmin, isAuthenticated, logout, quickSwitchRole } = useAuth();
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

  const getRoleBadgeStyle = () => {
    if (isSuperAdmin) return styles.superAdminBadge;
    if (isAdmin) return styles.adminBadge;
    return styles.customerBadge;
  };

  const getRoleTextStyle = () => {
    if (isSuperAdmin) return styles.superAdminBadgeText;
    if (isAdmin) return styles.adminBadgeText;
    return styles.customerBadgeText;
  };

  const getRoleTitle = () => {
    if (isSuperAdmin) return 'SUPER ADMIN';
    if (isAdmin) return 'STORE ADMIN';
    return 'CUSTOMER ACCOUNT';
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
        {/* User Profile Header in Drawer */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarRow}>
            <Image
              source={{
                uri:
                  user?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              }}
              style={[
                styles.avatar,
                isSuperAdmin && { borderColor: COLORS.superAdminBadge, borderWidth: 3 },
              ]}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name || 'Guest User'}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1}>
                {user?.email || 'guest@freshmart.com'}
              </Text>
              <View style={[styles.roleBadge, getRoleBadgeStyle()]}>
                <Ionicons
                  name={isSuperAdmin ? 'ribbon' : isAdmin ? 'shield-checkmark' : 'person'}
                  size={12}
                  color={
                    isSuperAdmin
                      ? COLORS.superAdminBadge
                      : isAdmin
                      ? COLORS.adminBadge
                      : COLORS.customerBadge
                  }
                />
                <Text style={[styles.roleBadgeText, getRoleTextStyle()]}>
                  {getRoleTitle()}
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Role Switcher for MCA Exam Testing (3 Roles) */}
          <View style={styles.roleSwitchCard}>
            <Text style={styles.roleSwitchLabel}>Exam Fast Role Switch:</Text>
            <View style={styles.switchButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  user?.role === 'customer' ? styles.switchBtnActive : styles.switchBtnInactive,
                ]}
                onPress={() => quickSwitchRole('customer')}
              >
                <Text
                  style={[
                    styles.switchBtnText,
                    user?.role === 'customer'
                      ? styles.switchBtnTextActive
                      : styles.switchBtnTextInactive,
                  ]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  user?.role === 'admin' ? styles.switchBtnAdminActive : styles.switchBtnInactive,
                ]}
                onPress={() => quickSwitchRole('admin')}
              >
                <Text
                  style={[
                    styles.switchBtnText,
                    user?.role === 'admin'
                      ? styles.switchBtnTextActive
                      : styles.switchBtnTextInactive,
                  ]}
                >
                  Admin
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.switchBtn,
                  isSuperAdmin ? styles.switchBtnSuperAdminActive : styles.switchBtnInactive,
                ]}
                onPress={() => quickSwitchRole('super_admin')}
              >
                <Text
                  style={[
                    styles.switchBtnText,
                    isSuperAdmin
                      ? styles.switchBtnTextActive
                      : styles.switchBtnTextInactive,
                  ]}
                >
                  Super Admin
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
            <Text style={styles.navItemText}>Home Store</Text>
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

          {/* Super Admin Profile Screen Link */}
          <TouchableOpacity
            style={[
              styles.navItem,
              isSuperAdmin && { backgroundColor: COLORS.superAdminBadgeLight },
            ]}
            onPress={() => navigation.navigate('SuperAdminProfile')}
          >
            <Ionicons
              name="ribbon-outline"
              size={22}
              color={COLORS.superAdminBadge}
              style={styles.navIcon}
            />
            <Text
              style={[
                styles.navItemText,
                { color: COLORS.superAdminBadge, fontWeight: '700' },
              ]}
            >
              Super Admin Profile
            </Text>
            {isSuperAdmin && (
              <View style={[styles.navBadge, { backgroundColor: COLORS.superAdminBadge }]}>
                <Text style={[styles.navBadgeText, { color: COLORS.white, fontSize: 9 }]}>
                  PRO
                </Text>
              </View>
            )}
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
            <Text style={styles.navItemText}>Sign In / Switch Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Ionicons name="person-add-outline" size={22} color={COLORS.textDark} style={styles.navIcon} />
            <Text style={styles.navItemText}>Register New Account</Text>
          </TouchableOpacity>
        </View>

        {/* MCA Exam Tag Footer */}
        <View style={styles.examFooterBox}>
          <Text style={styles.examFooterTitle}>FreshMart • Super Admin Edition</Text>
          <Text style={styles.examFooterSub}>October 2026 • React Native Expo</Text>
          <Text style={styles.examFooterTech}>Stack + Tab + Drawer Navigation</Text>
        </View>
      </DrawerContentScrollView>

      {/* Bottom Sign Out Action */}
      <View style={styles.bottomDrawerContainer}>
        {isAuthenticated ? (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.danger} />
            <Text style={styles.logoutBtnText}>Sign Out ({getRoleTitle()})</Text>
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
  superAdminBadge: {
    backgroundColor: COLORS.superAdminBadgeLight,
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
  superAdminBadgeText: {
    color: COLORS.superAdminBadge,
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
    gap: 6,
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
  switchBtnSuperAdminActive: {
    backgroundColor: COLORS.superAdminBadge,
  },
  switchBtnInactive: {
    backgroundColor: COLORS.surfaceVariant,
  },
  switchBtnText: {
    fontSize: 10,
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
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  navIcon: {
    marginRight: 14,
  },
  navItemText: {
    flex: 1,
    fontSize: 14,
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
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.danger,
  },
});

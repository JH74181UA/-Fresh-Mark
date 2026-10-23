// src/navigation/CustomerDrawerContent.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';

const DrawerItem = ({ icon, label, badge, onPress, active }) => (
  <TouchableOpacity
    style={[styles.drawerItem, active && styles.drawerItemActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Ionicons name={icon} size={20} color={active ? Colors.primary : Colors.textSecondary} />
    <Text style={[styles.drawerLabel, active && styles.drawerLabelActive]}>{label}</Text>
    {badge !== undefined && badge > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const CustomerDrawerContent = (props) => {
  const { user, signOut, getCartCount, favorites } = useApp();
  const currentRoute = props.state?.routeNames?.[props.state?.index];

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const navigate = (screen) => {
    props.navigation.navigate(screen);
    props.navigation.closeDrawer();
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail} numberOfLines={1}>{user?.email}</Text>
        <View style={styles.badge2}>
          <Text style={styles.badge2Text}>👤 Customer</Text>
        </View>
      </View>

      {/* Navigation Items */}
      <ScrollView style={styles.navSection} showsVerticalScrollIndicator={false}>
        <Text style={styles.navGroup}>MAIN</Text>
        <DrawerItem
          icon="home-outline"
          label="Home"
          onPress={() => navigate('Home')}
          active={currentRoute === 'Home'}
        />
        <DrawerItem
          icon="storefront-outline"
          label="Products"
          onPress={() => navigate('Products')}
          active={currentRoute === 'Products'}
        />
        <DrawerItem
          icon="cart-outline"
          label="My Cart"
          badge={getCartCount()}
          onPress={() => navigate('Cart')}
          active={currentRoute === 'Cart'}
        />
        <DrawerItem
          icon="heart-outline"
          label="Favorites"
          badge={favorites.length}
          onPress={() => navigate('Favorites')}
          active={currentRoute === 'Favorites'}
        />

        <View style={styles.divider} />
        <Text style={styles.navGroup}>ACCOUNT</Text>
        <DrawerItem
          icon="person-outline"
          label="My Profile"
          onPress={() => navigate('Profile')}
          active={currentRoute === 'Profile'}
        />
        <DrawerItem
          icon="create-outline"
          label="Edit Profile"
          onPress={() => {
            props.navigation.navigate('EditProfile');
            props.navigation.closeDrawer();
          }}
        />

        <View style={styles.divider} />
        <Text style={styles.navGroup}>INFO</Text>
        <DrawerItem
          icon="information-circle-outline"
          label="About FreshMart"
          onPress={() => Alert.alert('FreshMart', 'Your daily grocery shopping app.\nVersion 1.0.0 • MCA Exam 2026')}
        />
        <DrawerItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => Alert.alert('Support', 'Email: support@freshmart.com')}
        />
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.drawerBg,
  },
  profileSection: {
    padding: Spacing.xl,
    paddingTop: 55,
    backgroundColor: '#080808',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '800' },
  userName: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700', marginBottom: 2 },
  userEmail: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: Spacing.sm },
  badge2: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 3,
  },
  badge2Text: { color: Colors.primary, fontSize: FontSizes.xs, fontWeight: '600' },
  navSection: { flex: 1, padding: Spacing.md },
  navGroup: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: 2,
    gap: Spacing.md,
  },
  drawerItemActive: {
    backgroundColor: Colors.primary + '15',
  },
  drawerLabel: { flex: 1, color: Colors.textSecondary, fontSize: FontSizes.md, fontWeight: '500' },
  drawerLabelActive: { color: Colors.primary, fontWeight: '700' },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.error + '15',
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  logoutText: { color: Colors.error, fontSize: FontSizes.md, fontWeight: '700' },
});

export default CustomerDrawerContent;

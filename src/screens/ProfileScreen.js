// src/screens/ProfileScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';

const MenuItem = ({ icon, label, value, onPress, color }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.menuIcon, { backgroundColor: (color || Colors.primary) + '20' }]}>
      <Ionicons name={icon} size={18} color={color || Colors.primary} />
    </View>
    <View style={styles.menuContent}>
      <Text style={styles.menuLabel}>{label}</Text>
      {value && <Text style={styles.menuValue} numberOfLines={1}>{value}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
  </TouchableOpacity>
);

const StatBox = ({ value, label, icon }) => (
  <View style={styles.statBox}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ProfileScreen = ({ navigation }) => {
  const { user, signOut, cartItems, favorites, getCartCount } = useApp();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={[styles.roleBadge, user?.role === 'admin' && styles.adminBadge]}>
          <Text style={styles.roleText}>
            {user?.role === 'admin' ? '🔐 Admin' : '👤 Customer'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatBox value={getCartCount()} label="Cart Items" icon="🛒" />
        <StatBox value={favorites.length} label="Favorites" icon="❤️" />
        <StatBox value={cartItems.length} label="Products" icon="📦" />
      </View>

      {/* Account Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        <MenuItem icon="person-outline" label="Full Name" value={user?.name} onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon="mail-outline" label="Email" value={user?.email} onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon="call-outline" label="Phone" value={user?.phone || 'Not set'} onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon="location-outline" label="Address" value={user?.address || 'Not set'} onPress={() => navigation.navigate('EditProfile')} />
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <MenuItem icon="create-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon="cart-outline" label="My Cart" value={`${getCartCount()} items`} onPress={() => navigation.navigate('Cart')} />
        <MenuItem icon="heart-outline" label="My Favorites" value={`${favorites.length} items`} onPress={() => navigation.navigate('Favorites')} />
        <MenuItem icon="bag-outline" label="Browse Products" onPress={() => navigation.navigate('Products')} />
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <MenuItem icon="information-circle-outline" label="App Version" value="1.0.0" onPress={() => {}} />
        <MenuItem icon="star-outline" label="Rate the App" onPress={() => Alert.alert('Thank You!', 'Thank you for using FreshMart! 🛒')} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => Alert.alert('Support', 'Email: support@freshmart.com')} />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>FreshMart v1.0.0 • MCA Exam 2026</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: Spacing.xxxl,
    backgroundColor: '#080808',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: Colors.primaryDark,
  },
  avatarText: { color: Colors.white, fontSize: FontSizes.xxxl, fontWeight: '800' },
  name: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '700', marginBottom: 4 },
  email: { color: Colors.textSecondary, fontSize: FontSizes.md, marginBottom: Spacing.md },
  roleBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary + '50',
  },
  adminBadge: {
    backgroundColor: '#E67E2220',
    borderColor: '#E67E2250',
  },
  roleText: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIcon: { fontSize: 22, marginBottom: 4 },
  statValue: { color: Colors.primary, fontSize: FontSizes.xl, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600', textAlign: 'center' },
  section: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '700', marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 1, color: Colors.textSecondary },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '500' },
  menuValue: { color: Colors.textSecondary, fontSize: FontSizes.xs, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.error + '15',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    marginBottom: Spacing.xl,
  },
  logoutText: { color: Colors.error, fontSize: FontSizes.md, fontWeight: '700' },
  footer: { color: Colors.textSecondary, fontSize: FontSizes.xs, textAlign: 'center', marginBottom: Spacing.xl },
});

export default ProfileScreen;

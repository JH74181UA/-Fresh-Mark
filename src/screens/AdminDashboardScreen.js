// src/screens/AdminDashboardScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';
import { PRODUCTS, CATEGORIES } from '../data/products';

const StatCard = ({ icon, value, label, color }) => (
  <View style={[styles.statCard, { borderLeftColor: color || Colors.primary }]}>
    <Ionicons name={icon} size={24} color={color || Colors.primary} />
    <Text style={[styles.statValue, { color: color || Colors.primary }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const AdminDashboardScreen = ({ navigation }) => {
  const { user, signOut } = useApp();

  const totalProducts = PRODUCTS.length;
  const inStockProducts = PRODUCTS.filter((p) => p.inStock).length;
  const outOfStock = totalProducts - inStockProducts;
  const categories = CATEGORIES.length - 1; // exclude 'all'

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.adminAvatar}>
          <Ionicons name="shield-checkmark" size={36} color={Colors.white} />
        </View>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.adminName}>{user?.name}</Text>
        <Text style={styles.adminEmail}>{user?.email}</Text>
        <View style={styles.adminBadge}>
          <Text style={styles.adminBadgeText}>🔐 Admin Panel</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Store Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard icon="cube-outline" value={totalProducts} label="Total Products" color={Colors.primary} />
          <StatCard icon="checkmark-circle-outline" value={inStockProducts} label="In Stock" color="#27AE60" />
          <StatCard icon="close-circle-outline" value={outOfStock} label="Out of Stock" color={Colors.error} />
          <StatCard icon="grid-outline" value={categories} label="Categories" color="#9B59B6" />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Products')}
        >
          <View style={[styles.actionIcon, { backgroundColor: Colors.primary + '20' }]}>
            <Ionicons name="cube-outline" size={22} color={Colors.primary} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionLabel}>View All Products</Text>
            <Text style={styles.actionSub}>{totalProducts} products in catalog</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Categories</Text>
        {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
          const count = PRODUCTS.filter((p) => p.category === cat.id).length;
          return (
            <View key={cat.id} style={styles.catRow}>
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={styles.catName}>{cat.name}</Text>
              <View style={styles.catBadge}>
                <Text style={styles.catCount}>{count}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Admin Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Admin Account</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{user?.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user?.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoLabel}>Phone:</Text>
          <Text style={styles.infoValue}>{user?.phone || 'Not set'}</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: Spacing.xxxl,
    backgroundColor: '#0A0A0A',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: Spacing.xl,
  },
  adminAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E67E22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#E67E22',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeText: { color: Colors.textSecondary, fontSize: FontSizes.md },
  adminName: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '800', marginBottom: 4 },
  adminEmail: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: Spacing.md },
  adminBadge: {
    backgroundColor: '#E67E2220',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: '#E67E2250',
  },
  adminBadgeText: { color: '#E67E22', fontSize: FontSizes.sm, fontWeight: '700' },
  statsSection: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl },
  sectionTitle: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700', marginBottom: Spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 4,
  },
  statValue: { fontSize: FontSizes.xxl, fontWeight: '800' },
  statLabel: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600' },
  section: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionContent: { flex: 1 },
  actionLabel: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '600' },
  actionSub: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  catIcon: { fontSize: 20 },
  catName: { flex: 1, color: Colors.white, fontSize: FontSizes.md, fontWeight: '500' },
  catBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  catCount: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: '700' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  infoValue: { flex: 1, color: Colors.white, fontSize: FontSizes.sm, fontWeight: '500' },
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
    marginBottom: 100,
  },
  logoutText: { color: Colors.error, fontSize: FontSizes.md, fontWeight: '700' },
});

export default AdminDashboardScreen;

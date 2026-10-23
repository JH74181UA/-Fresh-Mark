import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardScreen = ({ navigation }) => {
  const { products, toggleStockStatus } = useProducts();
  const { user, quickSwitchRole } = useAuth();

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = totalProducts - inStockCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Admin Dashboard" showMenu={true} showCart={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Admin Welcome Banner */}
        <View style={[styles.adminBanner, SHADOWS.soft]}>
          <View style={styles.bannerRow}>
            <View style={styles.adminIconBox}>
              <Ionicons name="shield-checkmark" size={28} color={COLORS.adminBadge} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adminGreeting}>Administrator Console</Text>
              <Text style={styles.adminSub}>{user?.email || 'admin@freshmart.com'}</Text>
            </View>
          </View>
          <View style={styles.roleChip}>
            <Text style={styles.roleChipText}>Store Manager Privileges</Text>
          </View>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, SHADOWS.soft]}>
            <View style={[styles.metricIconCircle, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="cube-outline" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.metricNumber}>{totalProducts}</Text>
            <Text style={styles.metricLabel}>Total Products</Text>
          </View>

          <View style={[styles.metricCard, SHADOWS.soft]}>
            <View style={[styles.metricIconCircle, { backgroundColor: COLORS.customerBadgeLight }]}>
              <Ionicons name="checkmark-done-circle-outline" size={20} color={COLORS.customerBadge} />
            </View>
            <Text style={styles.metricNumber}>{inStockCount}</Text>
            <Text style={styles.metricLabel}>In Stock</Text>
          </View>

          <View style={[styles.metricCard, SHADOWS.soft]}>
            <View style={[styles.metricIconCircle, { backgroundColor: COLORS.dangerLight }]}>
              <Ionicons name="close-circle-outline" size={20} color={COLORS.danger} />
            </View>
            <Text style={styles.metricNumber}>{outOfStockCount}</Text>
            <Text style={styles.metricLabel}>Out of Stock</Text>
          </View>

          <View style={[styles.metricCard, SHADOWS.soft]}>
            <View style={[styles.metricIconCircle, { backgroundColor: COLORS.secondaryLight }]}>
              <Ionicons name="wallet-outline" size={20} color={COLORS.secondary} />
            </View>
            <Text style={styles.metricNumber}>$1,842</Text>
            <Text style={styles.metricLabel}>Today's Revenue</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Inventory Stock Management</Text>
          <Text style={styles.sectionSubtitle}>
            Toggle the switch next to any product to instantly mark it In-Stock or Out-of-Stock across the customer app.
          </Text>

          <View style={styles.inventoryList}>
            {products.map((item) => (
              <View key={item.id} style={styles.inventoryItem}>
                <Image source={{ uri: item.image }} style={styles.thumbImage} />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ${item.price.toFixed(2)} • {item.unit}
                  </Text>
                </View>

                <View style={styles.stockStatusContainer}>
                  <Text
                    style={[
                      styles.stockLabel,
                      item.inStock ? styles.inStockLabel : styles.outStockLabel,
                    ]}
                  >
                    {item.inStock ? 'In Stock' : 'Out'}
                  </Text>
                  <Switch
                    value={item.inStock}
                    onValueChange={() => toggleStockStatus(item.id)}
                    trackColor={{ false: COLORS.dangerLight, true: COLORS.primaryLight }}
                    thumbColor={item.inStock ? COLORS.primary : COLORS.danger}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Switch Role Button */}
        <View style={styles.roleSwitchSection}>
          <CustomButton
            title="Switch Back to Customer View"
            icon="swap-horizontal"
            type="outline"
            onPress={() => quickSwitchRole('customer')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  adminBanner: {
    backgroundColor: COLORS.surface,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  adminIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.adminBadgeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminGreeting: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  adminSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleChip: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: COLORS.adminBadgeLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.adminBadge,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  quickActionsCard: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 16,
  },
  inventoryList: {
    gap: 10,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  thumbImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceVariant,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  itemPrice: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  stockStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  inStockLabel: {
    color: COLORS.customerBadge,
  },
  outStockLabel: {
    color: COLORS.danger,
  },
  roleSwitchSection: {
    marginTop: 20,
  },
});

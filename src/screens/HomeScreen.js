import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { Header } from '../components/Header';
import { BannerCarousel } from '../components/BannerCarousel';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = ({ navigation }) => {
  const { products, categories, selectedCategory, setSelectedCategory, toggleStockStatus } = useProducts();
  const { user, isAuthenticated, quickSwitchRole } = useAuth();

  const featuredProducts = products.filter((p) => p.isFeatured);
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="FreshMart Grocery" showMenu={true} showCart={true} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Brand Bar & Quick Auth Options */}
        <View style={styles.authBanner}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="leaf" size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandTitle}>FreshMart Express</Text>
              <Text style={styles.brandSubtitle}>
                {isAuthenticated
                  ? `Delivering to ${user?.name || 'Customer'} (15-30 mins)`
                  : 'Welcome! Sign in to order'}
              </Text>
            </View>
          </View>

          {/* Sign In & Sign Up / Role Switcher buttons */}
          <View style={styles.authActionsRow}>
            {isAuthenticated ? (
              <View style={styles.roleSwitcherRow}>
                <Text style={styles.roleIndicatorLabel}>Current Role:</Text>
                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    user?.role === 'customer' ? styles.activeRoleBtn : styles.inactiveRoleBtn,
                  ]}
                  onPress={() => quickSwitchRole('customer')}
                >
                  <Ionicons
                    name="person"
                    size={14}
                    color={user?.role === 'customer' ? COLORS.white : COLORS.textDark}
                  />
                  <Text
                    style={[
                      styles.roleBtnText,
                      user?.role === 'customer' && styles.activeRoleBtnText,
                    ]}
                  >
                    Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    user?.role === 'admin' ? styles.activeAdminRoleBtn : styles.inactiveRoleBtn,
                  ]}
                  onPress={() => quickSwitchRole('admin')}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={14}
                    color={user?.role === 'admin' ? COLORS.white : COLORS.textDark}
                  />
                  <Text
                    style={[
                      styles.roleBtnText,
                      user?.role === 'admin' && styles.activeRoleBtnText,
                    ]}
                  >
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loginButtonsRow}>
                <TouchableOpacity
                  style={styles.authPillBtn}
                  onPress={() => navigation.navigate('SignIn')}
                >
                  <Text style={styles.authPillText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authPillBtn, styles.signUpPillBtn]}
                  onPress={() => navigation.navigate('SignUp')}
                >
                  <Text style={[styles.authPillText, styles.signUpPillText]}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Search Bar Input (tapping or entering navigates to Products list) */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ProductsTab')}
          >
            <Ionicons name="search-outline" size={20} color={COLORS.textMuted} />
            <Text style={styles.searchPlaceholder}>Search fresh fruits, veggies, groceries...</Text>
            <View style={styles.filterIconBtn}>
              <Ionicons name="options-outline" size={18} color={COLORS.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Promotional Grocery Banner */}
        <BannerCarousel onShopNow={() => navigation.navigate('ProductsTab')} />

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ProductsTab')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            navigation.navigate('ProductsTab');
          }}
        />

        {/* Exclusive Offers / Featured Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Exclusive Offers</Text>
            <Text style={styles.sectionSub}>Handpicked fresh groceries at special discounts</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProductsTab')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
              onStockToggle={() => toggleStockStatus(product.id)}
            />
          ))}
        </View>

        {/* Best Selling Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Best Selling</Text>
            <Text style={styles.sectionSub}>Daily essentials most loved by our customers</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProductsTab')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productGrid}>
          {bestSellers.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
              onStockToggle={() => toggleStockStatus(product.id)}
            />
          ))}
        </View>

        {/* Examination Context Footer Card */}
        <View style={styles.examCard}>
          <View style={styles.examBadge}>
            <Text style={styles.examBadgeText}>MCA SEMESTER III MODEL EXAM - OCT 2026</Text>
          </View>
          <Text style={styles.examTitle}>Grocery Shopping Mobile Application</Text>
          <Text style={styles.examSub}>
            Built with React Native, Stack, Bottom Tab & Drawer Navigation, Local State Context, Role-based Access (Admin / Customer).
          </Text>
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
    paddingBottom: 32,
  },
  authBanner: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  brandSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  authActionsRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  roleSwitcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIndicatorLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginRight: 8,
  },
  roleToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeRoleBtn: {
    backgroundColor: COLORS.primary,
  },
  activeAdminRoleBtn: {
    backgroundColor: COLORS.adminBadge,
  },
  inactiveRoleBtn: {
    backgroundColor: COLORS.surfaceVariant,
  },
  roleBtnText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    color: COLORS.textDark,
  },
  activeRoleBtnText: {
    color: COLORS.white,
  },
  loginButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  authPillBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  authPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  signUpPillBtn: {
    backgroundColor: COLORS.primary,
  },
  signUpPillText: {
    color: COLORS.white,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  filterIconBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  examCard: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  examBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  examBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  examTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  examSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
});

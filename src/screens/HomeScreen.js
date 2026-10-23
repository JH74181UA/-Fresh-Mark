// src/screens/HomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';

const { width } = Dimensions.get('window');

const FeatureCard = ({ icon, text }) => (
  <View style={styles.featureCard}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🛒</Text>
            </View>
          </View>
          <Text style={styles.appName}>FreshMart</Text>
          <Text style={styles.tagline}>Your Daily Grocery Destination</Text>

          {/* Hero Image Placeholder */}
          <View style={styles.heroImageBox}>
            <Text style={styles.heroImageText}>🥦🍎🥛🍞🥩</Text>
            <Text style={styles.heroSubText}>Fresh · Organic · Delivered</Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.featuresRow}>
          <FeatureCard icon="🚚" text="Fast Delivery" />
          <FeatureCard icon="🌿" text="100% Fresh" />
          <FeatureCard icon="💳" text="Easy Pay" />
          <FeatureCard icon="🔒" text="Secure" />
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Get Started</Text>
          <View style={styles.line} />
        </View>

        {/* Customer Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Customer</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Browse groceries, manage cart and favorites
          </Text>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate('SignIn', { role: 'customer' })}
            >
              <Ionicons name="log-in-outline" size={18} color={Colors.white} />
              <Text style={styles.primaryBtnText}>Customer Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => navigation.navigate('SignUp', { role: 'customer' })}
            >
              <Ionicons name="person-add-outline" size={18} color={Colors.primary} />
              <Text style={styles.outlineBtnText}>Customer Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Section */}
        <View style={[styles.section, { marginBottom: Spacing.xxxl }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#F39C12" />
            <Text style={[styles.sectionTitle, { color: '#F39C12' }]}>Admin</Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            Manage store, products and orders
          </Text>
          <View style={styles.btnGroup}>
            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: '#E67E22' }]}
              onPress={() => navigation.navigate('SignIn', { role: 'admin' })}
            >
              <Ionicons name="log-in-outline" size={18} color={Colors.white} />
              <Text style={styles.primaryBtnText}>Admin Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Credentials */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>🔑 Demo Credentials</Text>
          <View style={styles.demoRow}>
            <Text style={styles.demoLabel}>Customer:</Text>
            <Text style={styles.demoValue}>john@gmail.com / John@123</Text>
          </View>
          <View style={styles.demoRow}>
            <Text style={styles.demoLabel}>Admin:</Text>
            <Text style={styles.demoValue}>admin@grocery.com / Admin@123</Text>
          </View>
        </View>

        {/* Categories preview */}
        <View style={styles.categoriesPreview}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['🍎 Fruits', '🥦 Veggies', '🥛 Dairy', '🍞 Bakery', '🥩 Meat', '🍿 Snacks', '🥤 Drinks'].map(
              (cat, idx) => (
                <View key={idx} style={styles.catChip}>
                  <Text style={styles.catChipText}>{cat}</Text>
                </View>
              )
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    backgroundColor: '#080808',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: Spacing.xl,
  },
  logoWrap: {
    marginBottom: Spacing.md,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  tagline: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '500',
    marginBottom: Spacing.xl,
  },
  heroImageBox: {
    backgroundColor: '#111',
    borderRadius: 20,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  heroImageText: {
    fontSize: 38,
    letterSpacing: 8,
    marginBottom: Spacing.sm,
  },
  heroSubText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    letterSpacing: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  featureCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureText: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    paddingHorizontal: Spacing.md,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.md,
  },
  btnGroup: {
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  outlineBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  outlineBtnText: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  demoBox: {
    marginHorizontal: Spacing.lg,
    backgroundColor: '#0D1F0D',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  demoTitle: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  demoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  demoLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  demoValue: {
    color: Colors.white,
    fontSize: FontSizes.xs,
  },
  categoriesPreview: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  catChip: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catChipText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
});

export default HomeScreen;

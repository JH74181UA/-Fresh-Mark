import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

export const ProfileScreen = ({ navigation }) => {
  const { user, isAdmin, logout, quickSwitchRole } = useAuth();
  const { totalItemsCount } = useCart();
  const { favoritesCount } = useFavorites();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from FreshMart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  // If Admin is viewing customer-only area
  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Customer Profile" showMenu={true} showCart={true} />
        <View style={styles.adminNoticeContainer}>
          <View style={styles.adminNoticeCard}>
            <View style={styles.adminIconCircle}>
              <Ionicons name="shield" size={40} color={COLORS.adminBadge} />
            </View>
            <Text style={styles.adminNoticeTitle}>Admin Mode Active</Text>
            <Text style={styles.adminNoticeDesc}>
              The Customer Profile & Edit features are restricted to Customer accounts in accordance with Role-Based Access Control requirements.
            </Text>
            <View style={styles.adminInfoBox}>
              <Text style={styles.adminInfoLabel}>Logged in as:</Text>
              <Text style={styles.adminInfoValue}>{user?.name}</Text>
              <Text style={styles.adminInfoEmail}>{user?.email}</Text>
            </View>
            <CustomButton
              title="Switch to Customer Role"
              icon="swap-horizontal"
              onPress={() => quickSwitchRole('customer')}
              style={{ marginTop: 20, width: '100%' }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Profile"
        showMenu={true}
        showCart={true}
        rightComponent={
          <TouchableOpacity
            style={styles.editHeaderBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="create-outline" size={22} color={COLORS.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={[styles.profileCard, SHADOWS.soft]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.avatarCameraBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="camera" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'customer@freshmart.com'}</Text>

          <View style={styles.roleBadgeContainer}>
            <Ionicons name="shield-checkmark" size={14} color={COLORS.customerBadge} />
            <Text style={styles.roleBadgeText}>Verified Customer Account</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statBox, SHADOWS.soft]}
            onPress={() => navigation.navigate('CartTab')}
          >
            <Text style={styles.statNumber}>{totalItemsCount}</Text>
            <Text style={styles.statLabel}>Cart Items</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, SHADOWS.soft]}
            onPress={() => navigation.navigate('FavoritesTab')}
          >
            <Text style={styles.statNumber}>{favoritesCount}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </TouchableOpacity>

          <View style={[styles.statBox, SHADOWS.soft]}>
            <Text style={styles.statNumber}>Gold</Text>
            <Text style={styles.statLabel}>Membership</Text>
          </View>
        </View>

        {/* Customer Details Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editSectionText}>Edit Details</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, SHADOWS.soft]}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoDetails}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.name || 'Alex Johnson'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoDetails}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user?.email || 'alex.customer@freshmart.com'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoDetails}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user?.phone || '+91 98765 43210'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            </View>
            <View style={styles.infoDetails}>
              <Text style={styles.infoLabel}>Delivery Address</Text>
              <Text style={styles.infoValue}>
                {user?.address || 'Apartment 4B, Green Valley Heights, MG Road, Bangalore - 560001'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <CustomButton
            title="Edit Profile Information"
            icon="create-outline"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
          />

          <CustomButton
            title="Sign Out"
            type="outline"
            icon="log-out-outline"
            onPress={handleLogout}
            style={styles.logoutButton}
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
    paddingBottom: 36,
  },
  editHeaderBtn: {
    padding: 6,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: COLORS.primaryLight,
  },
  avatarCameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  roleBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.customerBadgeLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.customerBadge,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  editSectionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoDetails: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  actionButtonsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  editButton: {
    width: '100%',
  },
  logoutButton: {
    width: '100%',
  },
  adminNoticeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminNoticeCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  adminIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.adminBadgeLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminNoticeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  adminNoticeDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  adminInfoBox: {
    backgroundColor: COLORS.surfaceVariant,
    padding: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
  },
  adminInfoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  adminInfoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 2,
  },
  adminInfoEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});

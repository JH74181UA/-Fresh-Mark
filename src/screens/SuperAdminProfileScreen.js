import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { useAuth } from '../context/AuthContext';

export const SuperAdminProfileScreen = ({ navigation }) => {
  const { user, isSuperAdmin, logout, changePassword, quickSwitchRole } = useAuth();

  // Change password modal state
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Logout confirmation dialog
  const handleLogout = () => {
    Alert.alert(
      'Super Admin Sign Out',
      'Are you sure you want to end your Super Admin session? You will need to sign in again to access administrative controls.',
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

  // Change password handler with validation
  const handleChangePassword = () => {
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    setTimeout(() => {
      const res = changePassword(currentPassword, newPassword);
      setPasswordLoading(false);
      if (res.success) {
        setPasswordModalVisible(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        Alert.alert('Success', 'Super Admin master password updated successfully!');
      } else {
        setPasswordError(res.message);
      }
    }, 500);
  };

  // Security Access Guard: Prevent customers and regular admins from viewing/editing Super Admin profile
  if (!isSuperAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Super Admin Area" showBack={true} showMenu={true} showCart={false} />
        <View style={styles.restrictedContainer}>
          <View style={[styles.restrictedCard, SHADOWS.medium]}>
            <View style={styles.restrictedIconBox}>
              <Ionicons name="lock-closed" size={44} color={COLORS.danger} />
            </View>
            <Text style={styles.restrictedTitle}>Access Restricted</Text>
            <Text style={styles.restrictedDesc}>
              This section requires <Text style={{ fontWeight: '800' }}>Super Admin</Text> privileges.
              Regular Admins and Customers are prevented from viewing or editing the Super Admin profile.
            </Text>
            <View style={styles.currentRoleBox}>
              <Text style={styles.currentRoleLabel}>Your current role:</Text>
              <Text style={styles.currentRoleValue}>{user?.role?.toUpperCase() || 'GUEST'}</Text>
            </View>
            <CustomButton
              title="Switch to Super Admin Account"
              icon="shield-checkmark"
              onPress={() => quickSwitchRole('super_admin')}
              style={{ width: '100%', marginTop: 18, backgroundColor: COLORS.superAdminBadge }}
            />
            <CustomButton
              title="Go Back"
              type="outline"
              onPress={() => navigation.goBack()}
              style={{ width: '100%', marginTop: 10 }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Super Admin Profile"
        showBack={true}
        showMenu={true}
        showCart={false}
        rightComponent={
          <TouchableOpacity
            style={styles.headerEditBtn}
            onPress={() => navigation.navigate('SuperAdminEditProfile')}
          >
            <Ionicons name="create-outline" size={22} color={COLORS.superAdminBadge} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Master Card */}
        <View style={[styles.profileCard, SHADOWS.soft]}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.crownBadge}>
              <Ionicons name="ribbon" size={16} color={COLORS.white} />
            </View>
          </View>

          <Text style={styles.fullName}>{user?.name || 'Super Admin'}</Text>
          <Text style={styles.username}>@{user?.username || 'evelyn.superadmin'}</Text>

          {/* Role & Status Badges */}
          <View style={styles.badgesRow}>
            <View style={styles.superAdminPill}>
              <Ionicons name="shield-checkmark" size={13} color={COLORS.superAdminBadge} />
              <Text style={styles.superAdminPillText}>ROLE: SUPER ADMIN</Text>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.activeDot} />
              <Text style={styles.statusPillText}>{user?.status || 'Active / Verified'}</Text>
            </View>
          </View>
        </View>

        {/* Executive Privileges Card */}
        <View style={[styles.privilegesCard, SHADOWS.soft]}>
          <View style={styles.privilegesHeader}>
            <Ionicons name="key" size={18} color={COLORS.superAdminBadge} />
            <Text style={styles.privilegesTitle}>System Authority & Privileges</Text>
          </View>
          <View style={styles.privilegeTagsRow}>
            <View style={styles.privilegeTag}>
              <Text style={styles.privilegeTagText}>Store Overrides</Text>
            </View>
            <View style={styles.privilegeTag}>
              <Text style={styles.privilegeTagText}>Manage Admins</Text>
            </View>
            <View style={styles.privilegeTag}>
              <Text style={styles.privilegeTagText}>Catalog Management</Text>
            </View>
            <View style={styles.privilegeTag}>
              <Text style={styles.privilegeTagText}>Financial Reports</Text>
            </View>
            <View style={styles.privilegeTag}>
              <Text style={styles.privilegeTagText}>Security Audits</Text>
            </View>
          </View>
        </View>

        {/* Detailed Account Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Credentials & Contact</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SuperAdminEditProfile')}>
            <Text style={styles.editActionLink}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.infoCard, SHADOWS.soft]}>
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-outline" size={20} color={COLORS.superAdminBadge} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{user?.name}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="at-outline" size={20} color={COLORS.superAdminBadge} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>System Username</Text>
              <Text style={styles.infoValue}>{user?.username || 'evelyn.superadmin'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={20} color={COLORS.superAdminBadge} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Official Email Address</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="call-outline" size={20} color={COLORS.superAdminBadge} />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Direct Phone Number</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
          </View>

          {user?.address && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="business-outline" size={20} color={COLORS.superAdminBadge} />
                </View>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoLabel}>Headquarters / Address</Text>
                  <Text style={styles.infoValue}>{user?.address}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons: Edit Profile, Change Password, Logout */}
        <View style={styles.actionButtonsBox}>
          <CustomButton
            title="Edit Super Admin Profile"
            icon="create-outline"
            onPress={() => navigation.navigate('SuperAdminEditProfile')}
            style={[styles.primaryActionBtn, { backgroundColor: COLORS.superAdminBadge }]}
          />

          <CustomButton
            title="Change Master Password"
            icon="key-outline"
            type="outline"
            onPress={() => setPasswordModalVisible(true)}
            style={styles.passwordBtn}
            textStyle={{ color: COLORS.superAdminBadge }}
          />

          <CustomButton
            title="Sign Out (Super Admin)"
            icon="log-out-outline"
            type="danger"
            onPress={handleLogout}
            style={styles.logoutBtn}
          />
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="key" size={20} color={COLORS.superAdminBadge} />
                <Text style={styles.modalTitle}>Change Master Password</Text>
              </View>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>
                Ensure your new password contains at least 6 characters with letters, numbers, and symbols.
              </Text>

              {passwordError ? (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
                  <Text style={styles.errorBannerText}>{passwordError}</Text>
                </View>
              ) : null}

              <CustomInput
                label="Current Password *"
                placeholder="Enter current password"
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                icon="lock-closed-outline"
              />

              <CustomInput
                label="New Password *"
                placeholder="Minimum 6 characters"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={setNewPassword}
                icon="shield-outline"
              />

              <CustomInput
                label="Confirm New Password *"
                placeholder="Re-enter new password"
                secureTextEntry={true}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                icon="checkmark-done-outline"
              />

              <View style={styles.modalButtonRow}>
                <CustomButton
                  title="Cancel"
                  type="outline"
                  onPress={() => setPasswordModalVisible(false)}
                  style={{ flex: 1 }}
                />
                <CustomButton
                  title="Update Password"
                  loading={passwordLoading}
                  onPress={handleChangePassword}
                  style={{ flex: 1.5, backgroundColor: COLORS.superAdminBadge }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  headerEditBtn: {
    padding: 6,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: COLORS.superAdminBadge,
  },
  crownBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: COLORS.superAdminBadge,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  fullName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  username: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  superAdminPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.superAdminBadgeLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  superAdminPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.superAdminBadge,
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.customerBadgeLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.customerBadge,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.customerBadge,
  },
  privilegesCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  privilegesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  privilegesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  privilegeTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  privilegeTag: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  privilegeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  editActionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.superAdminBadge,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.superAdminBadgeLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoTextContainer: {
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
  actionButtonsBox: {
    marginTop: 24,
    gap: 12,
  },
  primaryActionBtn: {
    width: '100%',
  },
  passwordBtn: {
    width: '100%',
    borderColor: COLORS.superAdminBadge,
  },
  logoutBtn: {
    width: '100%',
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  restrictedCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  restrictedIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  restrictedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  restrictedDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  currentRoleBox: {
    backgroundColor: COLORS.surfaceVariant,
    padding: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  currentRoleLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  currentRoleValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.danger,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 14,
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerLight,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorBannerText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '700',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 8,
  },
});

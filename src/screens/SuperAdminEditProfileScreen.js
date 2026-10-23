import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
];

export const SuperAdminEditProfileScreen = ({ navigation }) => {
  const { user, isSuperAdmin, updateProfile } = useAuth();

  const [avatar, setAvatar] = useState(
    user?.avatar || PRESET_AVATARS[0]
  );
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || 'evelyn.superadmin');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Pick image from device gallery using expo-image-picker
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera roll permissions are needed to choose a profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setAvatar(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Image Picker', 'Could not access image library. You may also select a preset avatar below.');
    }
  };

  // Form validation
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Full name must be at least 3 characters';
    }

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid official email address';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanPhone.length < 10) {
      newErrors.phone = 'Phone number must have at least 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please complete all required fields correctly before saving.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        avatar,
      });

      setLoading(false);
      Alert.alert(
        'Profile Updated',
        'Super Admin profile details have been saved successfully.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 500);
  };

  // Cancel handler
  const handleCancel = () => {
    Alert.alert(
      'Discard Changes?',
      'Any unsaved modifications to the Super Admin profile will be lost.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  if (!isSuperAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="Super Admin Area" showBack={true} showCart={false} />
        <View style={styles.restrictedContainer}>
          <Text style={styles.restrictedText}>Unauthorized Access</Text>
          <CustomButton
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Edit Super Admin" showBack={true} showCart={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Title */}
          <View style={styles.headerInfo}>
            <Text style={styles.pageTitle}>Update Super Admin Profile</Text>
            <Text style={styles.pageSubtitle}>
              Modify master executive credentials and administrative contact details.
            </Text>
          </View>

          {/* Avatar Section & Picker */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
              <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
                <Ionicons name="camera" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.changePhotoBtn} onPress={handlePickImage}>
              <Ionicons name="image-outline" size={16} color={COLORS.superAdminBadge} />
              <Text style={styles.changePhotoText}>Choose Photo from Device</Text>
            </TouchableOpacity>

            {/* Quick Preset Avatars */}
            <View style={styles.presetsRow}>
              <Text style={styles.presetLabel}>Or select an executive preset:</Text>
              <View style={styles.presetThumbnails}>
                {PRESET_AVATARS.map((uri, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setAvatar(uri)}
                    style={[
                      styles.presetCircle,
                      avatar === uri && styles.activePresetCircle,
                    ]}
                  >
                    <Image source={{ uri }} style={styles.presetImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formCard}>
            <CustomInput
              label="Full Name *"
              placeholder="e.g. Dr. Evelyn Vance"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              error={errors.name}
              icon="person-outline"
            />

            <CustomInput
              label="System Username *"
              placeholder="e.g. evelyn.superadmin"
              autoCapitalize="none"
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errors.username) setErrors({ ...errors, username: null });
              }}
              error={errors.username}
              icon="at-outline"
            />

            <CustomInput
              label="Official Email Address *"
              placeholder="e.g. superadmin@freshmart.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              error={errors.email}
              icon="mail-outline"
            />

            <CustomInput
              label="Direct Phone Number *"
              placeholder="e.g. +91 99887 76655"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors({ ...errors, phone: null });
              }}
              error={errors.phone}
              icon="call-outline"
            />

            <CustomInput
              label="Headquarters / Address (Optional)"
              placeholder="Executive Suite, Tech Tower, Bangalore"
              multiline={true}
              numberOfLines={2}
              value={address}
              onChangeText={setAddress}
              icon="business-outline"
            />

            {/* Action Buttons: Save & Cancel */}
            <View style={styles.buttonRow}>
              <CustomButton
                title="Cancel"
                type="outline"
                onPress={handleCancel}
                style={styles.cancelBtn}
              />

              <CustomButton
                title="Save Changes"
                loading={loading}
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: COLORS.superAdminBadge }]}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerInfo: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  avatarSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: COLORS.superAdminBadge,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.superAdminBadge,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.superAdminBadgeLight,
    marginBottom: 12,
  },
  changePhotoText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.superAdminBadge,
  },
  presetsRow: {
    alignItems: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 10,
  },
  presetLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  presetThumbnails: {
    flexDirection: 'row',
    gap: 12,
  },
  presetCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activePresetCircle: {
    borderColor: COLORS.superAdminBadge,
  },
  presetImage: {
    width: '100%',
    height: '100%',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.5,
  },
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  restrictedText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.danger,
  },
});

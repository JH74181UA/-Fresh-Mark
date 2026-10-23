// src/screens/EditProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useApp();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field) => (val) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';

    if (form.phone && !/^[0-9]{10}$/.test(form.phone.trim()))
      e.phone = 'Enter a valid 10-digit phone number';

    if (!form.address.trim()) e.address = 'Address is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      setLoading(false);
      setSuccess(true);
      Alert.alert('✅ Profile Updated', 'Your profile has been updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {(form.name || user?.name)?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.title}>Edit Profile</Text>
          <Text style={styles.subtitle}>Update your account information</Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Full Name"
            value={form.name}
            onChangeText={update('name')}
            placeholder="Enter your full name"
            leftIcon="person-outline"
            error={errors.name}
            autoCapitalize="words"
          />
          <CustomInput
            label="Email Address"
            value={form.email}
            onChangeText={update('email')}
            placeholder="Enter your email"
            keyboardType="email-address"
            leftIcon="mail-outline"
            error={errors.email}
            editable={false}
          />
          <Text style={styles.emailNote}>⚠️ Email cannot be changed</Text>
          <CustomInput
            label="Phone Number"
            value={form.phone}
            onChangeText={update('phone')}
            placeholder="Enter 10-digit phone number"
            keyboardType="phone-pad"
            leftIcon="call-outline"
            error={errors.phone}
          />
          <CustomInput
            label="Delivery Address"
            value={form.address}
            onChangeText={update('address')}
            placeholder="Enter your full address"
            leftIcon="location-outline"
            error={errors.address}
            multiline
            numberOfLines={3}
            autoCapitalize="sentences"
          />

          {success && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>✅ Profile updated successfully!</Text>
            </View>
          )}

          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: Spacing.sm }}
          />
          <CustomButton
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            style={{ marginTop: Spacing.sm }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingBottom: Spacing.xxxl },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: Spacing.xxxl,
    backgroundColor: '#080808',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: Spacing.xl,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '800' },
  title: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.md },
  form: { paddingHorizontal: Spacing.xl },
  emailNote: { color: Colors.warning, fontSize: FontSizes.xs, marginTop: -8, marginBottom: Spacing.md },
  successBanner: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  successText: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: '600', textAlign: 'center' },
});

export default EditProfileScreen;

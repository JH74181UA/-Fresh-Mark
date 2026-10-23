import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    const cleanedPhone = phone.replace(/[^0-9]/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanedPhone.length < 10) {
      newErrors.phone = 'Phone number must contain at least 10 digits';
    }

    if (!address.trim()) {
      newErrors.address = 'Delivery address is required';
    } else if (address.trim().length < 10) {
      newErrors.address = 'Please provide a complete delivery address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      Alert.alert('Validation Error', 'Please correct the highlighted fields before saving.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      setLoading(false);
      Alert.alert('Success', 'Profile information updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Edit Profile" showBack={true} showCart={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerInfo}>
            <Text style={styles.pageTitle}>Update Personal Info</Text>
            <Text style={styles.pageSubtitle}>
              Keep your contact details up-to-date for smooth grocery delivery.
            </Text>
          </View>

          <View style={styles.formCard}>
            <CustomInput
              label="Full Name *"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              error={errors.name}
              icon="person-outline"
            />

            <CustomInput
              label="Email Address *"
              placeholder="e.g. alex@example.com"
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
              label="Phone Number *"
              placeholder="e.g. +91 98765 43210"
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
              label="Delivery Address *"
              placeholder="Apartment, Street, Area, City, Pincode"
              multiline={true}
              numberOfLines={3}
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                if (errors.address) setErrors({ ...errors, address: null });
              }}
              error={errors.address}
              icon="location-outline"
            />

            <View style={styles.buttonRow}>
              <CustomButton
                title="Cancel"
                type="outline"
                onPress={() => navigation.goBack()}
                style={styles.cancelBtn}
              />

              <CustomButton
                title="Save Changes"
                loading={loading}
                onPress={handleSave}
                style={styles.saveBtn}
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
    padding: 20,
    paddingBottom: 40,
  },
  headerInfo: {
    marginBottom: 20,
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
});

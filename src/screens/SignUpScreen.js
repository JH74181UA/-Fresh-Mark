import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';

export const SignUpScreen = ({ navigation }) => {
  const { signUp } = useAuth();

  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanedPhone = phone.replace(/[^0-9]/g, '');

    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (cleanedPhone.length < 10) {
      errs.phone = 'Phone number must have at least 10 digits';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (!address.trim()) {
      errs.address = 'Delivery address is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = () => {
    if (!validate()) {
      Alert.alert('Incomplete Form', 'Please complete all required fields correctly.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        address: address.trim(),
        role,
      });

      setLoading(false);
      if (res.success) {
        Alert.alert('Account Created', res.message, [
          { text: 'Start Shopping', onPress: () => navigation.navigate('MainDrawer') },
        ]);
      } else {
        Alert.alert('Registration Error', res.message);
      }
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Create Account" showBack={true} showCart={false} showMenu={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Description */}
          <View style={styles.headerBox}>
            <Text style={styles.title}>Join FreshMart</Text>
            <Text style={styles.subtitle}>
              Sign up today for daily fresh grocery deliveries right at your doorstep.
            </Text>
          </View>

          {/* Role Selection */}
          <View style={styles.roleSelectionBox}>
            <Text style={styles.roleSelectionLabel}>Select Account Role:</Text>
            <View style={styles.roleTabs}>
              <TouchableOpacity
                style={[styles.roleTab, role === 'customer' && styles.activeCustomerTab]}
                onPress={() => setRole('customer')}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={role === 'customer' ? COLORS.white : COLORS.textDark}
                />
                <Text
                  style={[styles.roleTabText, role === 'customer' && styles.activeRoleTabText]}
                >
                  Customer
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleTab, role === 'admin' && styles.activeAdminTab]}
                onPress={() => setRole('admin')}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={role === 'admin' ? COLORS.white : COLORS.textDark}
                />
                <Text
                  style={[styles.roleTabText, role === 'admin' && styles.activeRoleTabText]}
                >
                  Admin
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Form Fields */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Full Name *"
              placeholder="e.g. Rahul Sharma"
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
              placeholder="e.g. rahul@example.com"
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
              label="Mobile Phone *"
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
              label="Password *"
              placeholder="Minimum 6 characters"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              icon="lock-closed-outline"
            />

            <CustomInput
              label="Confirm Password *"
              placeholder="Re-enter your password"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
              }}
              error={errors.confirmPassword}
              icon="checkmark-done-outline"
            />

            <CustomInput
              label="Delivery Address *"
              placeholder="House/Flat No, Street, City, Pincode"
              multiline={true}
              numberOfLines={2}
              value={address}
              onChangeText={(text) => {
                setAddress(text);
                if (errors.address) setErrors({ ...errors, address: null });
              }}
              error={errors.address}
              icon="location-outline"
            />

            <CustomButton
              title={`Register as ${role === 'admin' ? 'Admin' : 'Customer'}`}
              loading={loading}
              onPress={handleSignUp}
              style={{ marginTop: 10 }}
            />
          </View>

          {/* Already have an account */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.footerLink}> Sign In here</Text>
            </TouchableOpacity>
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
  headerBox: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  roleSelectionBox: {
    marginBottom: 16,
  },
  roleSelectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 14,
    padding: 4,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  activeCustomerTab: {
    backgroundColor: COLORS.primary,
  },
  activeAdminTab: {
    backgroundColor: COLORS.adminBadge,
  },
  roleTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  activeRoleTabText: {
    color: COLORS.white,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
});

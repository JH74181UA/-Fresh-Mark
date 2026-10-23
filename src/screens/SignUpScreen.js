// src/screens/SignUpScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const SignUpScreen = ({ navigation }) => {
  const { signUp } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';

    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit phone number';

    if (!form.address.trim()) e.address = 'Address is required';

    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[A-Z])/.test(form.password)) e.password = 'Password must contain at least one uppercase letter';

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = signUp({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
        role: 'customer',
      });
      setLoading(false);
      if (result.success) {
        Alert.alert('Success! 🎉', result.message, [
          { text: 'Sign In Now', onPress: () => navigation.navigate('SignIn', { role: 'customer' }) },
        ]);
      } else {
        Alert.alert('Registration Failed', result.message);
      }
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-add" size={32} color={Colors.white} />
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join FreshMart and shop fresh groceries daily</Text>
        </View>

        {/* Form */}
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
          />
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
            label="Address"
            value={form.address}
            onChangeText={update('address')}
            placeholder="Enter your delivery address"
            leftIcon="location-outline"
            error={errors.address}
            multiline
            numberOfLines={3}
            autoCapitalize="sentences"
          />
          <CustomInput
            label="Password"
            value={form.password}
            onChangeText={update('password')}
            placeholder="Min. 6 chars with uppercase"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />
          <CustomInput
            label="Confirm Password"
            value={form.confirmPassword}
            onChangeText={update('confirmPassword')}
            placeholder="Re-enter your password"
            secureTextEntry
            leftIcon="shield-outline"
            error={errors.confirmPassword}
          />

          <CustomButton
            title="Create Account"
            onPress={handleSignUp}
            loading={loading}
            style={{ marginTop: Spacing.sm }}
          />

          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn', { role: 'customer' })}
            >
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 50,
    paddingBottom: Spacing.xxxl,
    backgroundColor: '#080808',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  title: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '800', marginBottom: Spacing.sm },
  subtitle: { color: Colors.textSecondary, fontSize: FontSizes.md, textAlign: 'center' },
  form: { paddingHorizontal: Spacing.xl },
  signInRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  signInText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  signInLink: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: '700' },
});

export default SignUpScreen;

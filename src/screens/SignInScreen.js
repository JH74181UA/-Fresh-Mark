// src/screens/SignInScreen.js
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

const SignInScreen = ({ navigation, route }) => {
  const role = route?.params?.role || 'customer';
  const { signIn } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const result = signIn(email.trim(), password, role);
      setLoading(false);
      if (result.success) {
        // Navigation is handled by the navigator based on auth state
      } else {
        Alert.alert('Sign In Failed', result.message, [{ text: 'OK' }]);
      }
    }, 800);
  };

  const isAdmin = role === 'admin';

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
          <View style={[styles.iconCircle, isAdmin && styles.adminCircle]}>
            <Ionicons
              name={isAdmin ? 'shield-checkmark' : 'person'}
              size={32}
              color={Colors.white}
            />
          </View>
          <Text style={styles.title}>
            {isAdmin ? 'Admin Sign In' : 'Welcome Back!'}
          </Text>
          <Text style={styles.subtitle}>
            {isAdmin
              ? 'Sign in to access the admin panel'
              : 'Sign in to your FreshMart account'}
          </Text>
          {/* Role badge */}
          <View style={[styles.roleBadge, isAdmin && styles.adminBadge]}>
            <Text style={styles.roleBadgeText}>
              {isAdmin ? '🔐 Admin Portal' : '👤 Customer Portal'}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <CustomInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            leftIcon="mail-outline"
            error={errors.email}
            autoCapitalize="none"
          />
          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <CustomButton
            title={`Sign In as ${isAdmin ? 'Admin' : 'Customer'}`}
            onPress={handleSignIn}
            loading={loading}
            style={isAdmin ? { backgroundColor: '#E67E22' } : {}}
          />

          {/* Demo hint */}
          <View style={styles.hintBox}>
            <Text style={styles.hintTitle}>💡 Demo Login</Text>
            {isAdmin ? (
              <Text style={styles.hintText}>admin@grocery.com / Admin@123</Text>
            ) : (
              <Text style={styles.hintText}>john@gmail.com / John@123</Text>
            )}
          </View>

          {!isAdmin && (
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp', { role: 'customer' })}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: Spacing.xxxl,
  },
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
  adminCircle: {
    backgroundColor: '#E67E22',
    shadowColor: '#E67E22',
  },
  title: {
    color: Colors.white,
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  roleBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primary + '50',
  },
  adminBadge: {
    backgroundColor: '#E67E2220',
    borderColor: '#E67E2250',
  },
  roleBadgeText: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  form: {
    paddingHorizontal: Spacing.xl,
  },
  hintBox: {
    backgroundColor: '#0D1A0D',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  hintTitle: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '700',
    marginBottom: 4,
  },
  hintText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  signupText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  signupLink: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
});

export default SignInScreen;

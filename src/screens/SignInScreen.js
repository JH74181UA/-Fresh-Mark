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

export const SignInScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = () => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password, role);
      setLoading(false);
      if (res.success) {
        navigation.navigate('MainDrawer');
      } else {
        Alert.alert('Login Failed', res.message);
      }
    }, 500);
  };

  // Quick 1-click test credentials for MCA exam grading
  const handleQuickDemo = (demoRole) => {
    if (demoRole === 'super_admin') {
      setEmail('superadmin@freshmart.com');
      setPassword('superadmin123');
      setRole('super_admin');
    } else if (demoRole === 'admin') {
      setEmail('admin@freshmart.com');
      setPassword('admin123');
      setRole('admin');
    } else {
      setEmail('alex.customer@freshmart.com');
      setPassword('customer123');
      setRole('customer');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Sign In" showBack={true} showCart={false} showMenu={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Welcome Header */}
          <View style={styles.headerBox}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your fresh grocery shopping experience.
            </Text>
          </View>

          {/* Role Selection Tabs */}
          <View style={styles.roleTabs}>
            <TouchableOpacity
              style={[styles.roleTab, role === 'customer' && styles.activeCustomerTab]}
              onPress={() => setRole('customer')}
            >
              <Ionicons
                name="person"
                size={14}
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
                size={14}
                color={role === 'admin' ? COLORS.white : COLORS.textDark}
              />
              <Text
                style={[styles.roleTabText, role === 'admin' && styles.activeRoleTabText]}
              >
                Admin
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, role === 'super_admin' && styles.activeSuperAdminTab]}
              onPress={() => setRole('super_admin')}
            >
              <Ionicons
                name="ribbon"
                size={14}
                color={role === 'super_admin' ? COLORS.white : COLORS.textDark}
              />
              <Text
                style={[styles.roleTabText, role === 'super_admin' && styles.activeRoleTabText]}
              >
                Super Admin
              </Text>
            </TouchableOpacity>
          </View>

          {/* Credentials Form */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Email Address"
              placeholder="e.g. name@example.com"
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
              label="Password"
              placeholder="Enter your password"
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              error={errors.password}
              icon="lock-closed-outline"
            />

            <CustomButton
              title={`Sign In as ${role === 'admin' ? 'Admin' : 'Customer'}`}
              loading={loading}
              onPress={handleSignIn}
              style={{ marginTop: 8 }}
            />
          </View>

          {/* Exam Fast-Track Demo Buttons */}
          <View style={styles.demoCard}>
            <Text style={styles.demoTitle}>Examiner Quick Login Options</Text>
            <Text style={styles.demoSub}>
              Tap either button below to auto-fill sample credentials for rapid evaluation:
            </Text>

            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={styles.demoPillCustomer}
                onPress={() => handleQuickDemo('customer')}
              >
                <Ionicons name="person-circle" size={18} color={COLORS.customerBadge} />
                <Text style={styles.demoPillCustomerText}>Fill Customer Credentials</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoPillAdmin}
                onPress={() => handleQuickDemo('admin')}
              >
                <Ionicons name="shield-checkmark" size={18} color={COLORS.adminBadge} />
                <Text style={styles.demoPillAdminText}>Fill Store Admin Credentials</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.demoPillSuperAdmin}
                onPress={() => handleQuickDemo('super_admin')}
              >
                <Ionicons name="ribbon" size={18} color={COLORS.superAdminBadge} />
                <Text style={styles.demoPillSuperAdminText}>Fill Super Admin Credentials</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}> Sign Up here</Text>
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
    alignItems: 'center',
    marginVertical: 14,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  roleTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 14,
    padding: 4,
    marginTop: 16,
    marginBottom: 20,
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
  activeSuperAdminTab: {
    backgroundColor: COLORS.superAdminBadge,
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
  demoCard: {
    backgroundColor: COLORS.surfaceVariant,
    padding: 16,
    borderRadius: 16,
    marginTop: 20,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  demoSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  demoButtonsRow: {
    gap: 8,
  },
  demoPillCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.customerBadgeLight,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  demoPillCustomerText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.customerBadge,
  },
  demoPillAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.adminBadgeLight,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  demoPillAdminText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.adminBadge,
  },
  demoPillSuperAdmin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.superAdminBadgeLight,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  demoPillSuperAdminText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.superAdminBadge,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
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

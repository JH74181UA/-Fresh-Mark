import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const CustomButton = ({
  title,
  onPress,
  type = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  size = 'medium',
  icon,
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.border;
    switch (type) {
      case 'primary':
        return COLORS.primary;
      case 'secondary':
        return COLORS.secondary;
      case 'outline':
        return 'transparent';
      case 'danger':
        return COLORS.danger;
      default:
        return COLORS.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.textLight;
    if (type === 'outline') return COLORS.primary;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[size],
        { backgroundColor: getBackgroundColor() },
        type === 'outline' && styles.outlineBorder,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && (
            <Ionicons
              name={icon}
              size={size === 'small' ? 16 : 20}
              color={getTextColor()}
              style={styles.icon}
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }, styles[`${size}Text`], textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  outlineBorder: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  smallText: {
    fontSize: 13,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  largeText: {
    fontSize: 17,
  },
});

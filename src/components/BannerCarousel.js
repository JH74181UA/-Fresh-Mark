import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

export const BannerCarousel = ({ onShopNow }) => {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.textContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SPECIAL DEAL</Text>
          </View>
          <Text style={styles.title}>Fresh Groceries</Text>
          <Text style={styles.subtitle}>Get Up to 40% OFF today</Text>
          
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={onShopNow}
          >
            <Text style={styles.buttonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.circleGraphic}>
          <Text style={styles.emojiGraphic}>🥦🍎🥑</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  banner: {
    backgroundColor: '#EBF8EE',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D4EED8',
    overflow: 'hidden',
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    zIndex: 2,
  },
  badge: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  circleGraphic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D7F1DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emojiGraphic: {
    fontSize: 32,
  },
});

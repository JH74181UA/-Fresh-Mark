import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';

export const CartItemCard = ({ item, onIncrease, onDecrease, onRemove, onPress }) => {
  const { product, quantity } = item;
  const itemTotal = (product.price * quantity).toFixed(2);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.container, SHADOWS.soft]}
    >
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Details & Controls */}
      <View style={styles.detailsContainer}>
        <View style={styles.topRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.name} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.unit}>{product.unit || 'Standard unit'}</Text>
          </View>

          {/* Delete Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={onRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        {/* Bottom row: Quantity buttons and price */}
        <View style={styles.bottomRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={onDecrease}
            >
              <Ionicons
                name={quantity === 1 ? 'trash-outline' : 'remove'}
                size={16}
                color={quantity === 1 ? COLORS.danger : COLORS.primary}
              />
            </TouchableOpacity>

            <View style={styles.qtyNumberContainer}>
              <Text style={styles.qtyText}>{quantity}</Text>
            </View>

            <TouchableOpacity
              style={[styles.qtyButton, styles.plusButton]}
              onPress={onIncrease}
            >
              <Ionicons name="add" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${itemTotal}</Text>
            <Text style={styles.unitPrice}>(${product.price.toFixed(2)} each)</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceVariant,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  unit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  deleteButton: {
    padding: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  qtyNumberContainer: {
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  unitPrice: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
});

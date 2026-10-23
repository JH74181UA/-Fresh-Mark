// src/components/CartItem.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';

const CartItem = ({ item }) => {
  const { updateCartQuantity, removeFromCart } = useApp();

  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price} / {item.unit}</Text>
        <View style={styles.row}>
          <View style={styles.qtyControl}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateCartQuantity(item.id, -1)}
            >
              <Ionicons name="remove" size={14} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateCartQuantity(item.id, 1)}
            >
              <Ionicons name="add" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtotal}>₹{(item.price * item.quantity).toFixed(0)}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeBtn}
        onPress={() => removeFromCart(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={18} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: BorderRadius.md,
    backgroundColor: '#222',
  },
  details: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  name: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  price: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  qtyBtn: {
    backgroundColor: Colors.primary,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  subtotal: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  removeBtn: {
    marginLeft: Spacing.sm,
    padding: 4,
  },
});

export default CartItem;

// src/screens/CartScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';
import CartItem from '../components/CartItem';

const CartScreen = ({ navigation }) => {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useApp();

  const subtotal = getCartTotal();
  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const discount = cartItems.length > 0 ? Math.floor(subtotal * 0.05) : 0;
  const total = subtotal + deliveryFee - discount;

  const handleCheckout = () => {
    Alert.alert(
      '🎉 Order Placed!',
      `Your order of ₹${total} has been placed successfully!\n\nEstimated delivery: 30-45 minutes`,
      [
        {
          text: 'Continue Shopping',
          onPress: () => {
            clearCart();
            navigation.navigate('Products');
          },
        },
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyScreen}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
        <Text style={styles.emptySubtitle}>
          Add fresh groceries to your cart to get started
        </Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.shopBtnText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Items count + Clear */}
      <View style={styles.topBar}>
        <Text style={styles.itemsCount}>{getCartCount()} items</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount (5%)</Text>
              <Text style={[styles.summaryValue, { color: Colors.primary }]}>- ₹{discount}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total}</Text>
            </View>
          </View>
        }
      />

      {/* Checkout Button */}
      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>₹{total}</Text>
          <Text style={styles.checkoutSavings}>You save ₹{discount}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <Ionicons name="bag-check-outline" size={20} color={Colors.white} />
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  emptyScreen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emptyEmoji: { fontSize: 70, marginBottom: Spacing.xl },
  emptyTitle: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '700', marginBottom: Spacing.sm },
  emptySubtitle: { color: Colors.textSecondary, fontSize: FontSizes.md, textAlign: 'center', marginBottom: Spacing.xxxl },
  shopBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
  },
  shopBtnText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  itemsCount: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  clearText: { color: Colors.error, fontSize: FontSizes.sm, fontWeight: '600' },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 120 },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700', marginBottom: Spacing.md },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: { color: Colors.textSecondary, fontSize: FontSizes.md },
  summaryValue: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '600' },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    marginTop: Spacing.sm,
  },
  totalLabel: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700' },
  totalValue: { color: Colors.primary, fontSize: FontSizes.xl, fontWeight: '800' },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  checkoutTotal: { color: Colors.white, fontSize: FontSizes.xl, fontWeight: '700' },
  checkoutSavings: { color: Colors.primary, fontSize: FontSizes.xs },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  checkoutBtnText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
});

export default CartScreen;

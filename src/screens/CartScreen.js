import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { Header } from '../components/Header';
import { CartItemCard } from '../components/CartItemCard';
import { CustomButton } from '../components/CustomButton';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    discount,
    totalAmount,
    totalItemsCount,
  } = useCart();

  const { user } = useAuth();
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleCheckout = () => {
    const generatedId = 'FM-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(generatedId);
    setOrderModalVisible(true);
  };

  const handleOrderDone = () => {
    setOrderModalVisible(false);
    clearCart();
    navigation.navigate('HomeTab');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Shopping Cart"
        showMenu={true}
        showCart={false}
        rightComponent={
          cartItems.length > 0 ? (
            <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
              <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          ) : null
        }
      />

      {cartItems.length > 0 ? (
        <View style={styles.container}>
          {/* Cart Items List */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.product.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CartItemCard
                item={item}
                onIncrease={() => updateQuantity(item.product.id, 1)}
                onDecrease={() => updateQuantity(item.product.id, -1)}
                onRemove={() => removeFromCart(item.product.id)}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    productId: item.product.id,
                  })
                }
              />
            )}
            ListFooterComponent={
              <View style={styles.footerSummary}>
                {/* Delivery Notice */}
                <View style={styles.deliveryBanner}>
                  <Ionicons
                    name={subtotal > 20 ? 'checkmark-circle' : 'information-circle'}
                    size={20}
                    color={subtotal > 20 ? COLORS.success : COLORS.warning}
                  />
                  <Text style={styles.deliveryBannerText}>
                    {subtotal > 20
                      ? 'Congratulations! You unlocked FREE delivery.'
                      : `Add $${(20 - subtotal).toFixed(2)} more for FREE delivery.`}
                  </Text>
                </View>

                {/* Price Breakdown Card */}
                <View style={[styles.billCard, SHADOWS.soft]}>
                  <Text style={styles.billTitle}>Bill Summary</Text>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Subtotal ({totalItemsCount} items)</Text>
                    <Text style={styles.billVal}>${subtotal.toFixed(2)}</Text>
                  </View>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>5% Special Discount</Text>
                    <Text style={[styles.billVal, styles.discountVal]}>
                      -${discount.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.billRow}>
                    <Text style={styles.billLabel}>Delivery Fee</Text>
                    <Text style={styles.billVal}>
                      {deliveryFee === 0 ? (
                        <Text style={styles.freeText}>FREE</Text>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.billRow}>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <Text style={styles.totalVal}>${totalAmount.toFixed(2)}</Text>
                  </View>
                </View>

                {/* Delivery Address Preview */}
                <View style={styles.addressPreviewCard}>
                  <View style={styles.addressHeader}>
                    <View style={styles.addressTitleRow}>
                      <Ionicons name="location" size={16} color={COLORS.primary} />
                      <Text style={styles.addressTitle}>Delivery Address</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
                      <Text style={styles.changeAddressText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.addressText}>
                    {user?.address || 'Apartment 4B, Green Valley Heights, MG Road, Bangalore'}
                  </Text>
                </View>
              </View>
            }
          />

          {/* Sticky Checkout Bottom Bar */}
          <View style={[styles.checkoutBar, SHADOWS.medium]}>
            <View>
              <Text style={styles.checkoutTotalLabel}>Total Amount</Text>
              <Text style={styles.checkoutTotalVal}>${totalAmount.toFixed(2)}</Text>
            </View>

            <CustomButton
              title="Proceed to Checkout"
              icon="arrow-forward"
              onPress={handleCheckout}
              style={styles.checkoutBtn}
            />
          </View>
        </View>
      ) : (
        /* Empty Cart State */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyCartIconBox}>
            <Ionicons name="cart-outline" size={64} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySub}>
            Looks like you haven't added any groceries yet. Explore our daily fresh products and stock up your pantry!
          </Text>
          <CustomButton
            title="Start Shopping"
            icon="basket-outline"
            onPress={() => navigation.navigate('ProductsTab')}
            style={styles.startShoppingBtn}
          />
        </View>
      )}

      {/* Order Success Confirmation Modal */}
      <Modal visible={orderModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark-done" size={48} color={COLORS.white} />
            </View>

            <Text style={styles.modalSuccessTitle}>Order Placed Successfully!</Text>
            <Text style={styles.modalOrderNumber}>Order ID: #{orderId}</Text>

            <View style={styles.orderSummaryCard}>
              <View style={styles.summaryItemRow}>
                <Text style={styles.summaryItemLabel}>Items Ordered:</Text>
                <Text style={styles.summaryItemVal}>{totalItemsCount} items</Text>
              </View>
              <View style={styles.summaryItemRow}>
                <Text style={styles.summaryItemLabel}>Paid Amount:</Text>
                <Text style={styles.summaryItemVal}>${totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItemRow}>
                <Text style={styles.summaryItemLabel}>Estimated Delivery:</Text>
                <Text style={styles.summaryItemVal}>20 - 30 Minutes</Text>
              </View>
            </View>

            <Text style={styles.thankYouText}>
              Thank you for ordering with FreshMart! Your groceries are being carefully packed by our team.
            </Text>

            <CustomButton
              title="Back to Home Screen"
              onPress={handleOrderDone}
              style={{ width: '100%', marginTop: 10 }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  clearBtn: {
    padding: 6,
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  footerSummary: {
    marginTop: 10,
  },
  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surfaceVariant,
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  deliveryBannerText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  billCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  billTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  billLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  billVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  discountVal: {
    color: COLORS.success,
  },
  freeText: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  totalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  addressPreviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  changeAddressText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  checkoutTotalLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  checkoutTotalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  checkoutBtn: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyCartIconBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  startShoppingBtn: {
    width: '75%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalSuccessTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  modalOrderNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
    marginBottom: 16,
  },
  orderSummaryCard: {
    backgroundColor: COLORS.surfaceVariant,
    width: '100%',
    padding: 14,
    borderRadius: 14,
    gap: 8,
    marginBottom: 14,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItemLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  summaryItemVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  thankYouText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
});

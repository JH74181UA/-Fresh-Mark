import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params || {};
  const { getProductById, toggleStockStatus } = useProducts();
  const { addToCart, getItemQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAdmin } = useAuth();

  const product = getProductById(productId) || {
    id: 'unknown',
    name: 'Grocery Product',
    category: 'Groceries',
    price: 3.99,
    unit: '1 Unit',
    rating: 4.8,
    reviewsCount: 120,
    inStock: true,
    description: 'Fresh healthy grocery item.',
    nutrition: 'Healthy and natural nutrients.',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
  };

  const [quantity, setQuantity] = useState(1);
  const favorite = isFavorite(product.id);
  const existingInCart = getItemQuantity(product.id);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product.inStock) {
      Alert.alert('Out of Stock', 'This item is currently out of stock.');
      return;
    }
    addToCart(product, quantity);
    Alert.alert(
      'Added to Cart',
      `Added ${quantity} × ${product.name} to your shopping cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('CartTab') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title={product.name}
        showBack={true}
        showCart={true}
        rightComponent={
          <TouchableOpacity
            style={styles.headerFavBtn}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={24}
              color={favorite ? COLORS.danger : COLORS.textDark}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Hero Image Container */}
        <View style={styles.imageCard}>
          <Image
            source={{ uri: product.image }}
            style={styles.heroImage}
            resizeMode="contain"
          />

          {product.badge && (
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}

          {!product.inStock && (
            <View style={styles.outOfStockBanner}>
              <Text style={styles.outOfStockText}>Currently Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsContainer}>
          {/* Category & Rating */}
          <View style={styles.topMetaRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{product.category}</Text>
            </View>

            <View style={styles.ratingBox}>
              <Ionicons name="star" size={15} color={COLORS.secondary} />
              <Text style={styles.ratingVal}>{product.rating}</Text>
              <Text style={styles.ratingCount}>({product.reviewsCount} reviews)</Text>
            </View>
          </View>

          {/* Name & Unit */}
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.unitText}>{product.unit}</Text>

          {/* Price & Quantity Selector Row */}
          <View style={styles.priceQuantityRow}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                {product.originalPrice && (
                  <Text style={styles.originalPrice}>
                    ${product.originalPrice.toFixed(2)}
                  </Text>
                )}
              </View>
            </View>

            {/* Quantity Stepper */}
            <View style={styles.quantityPicker}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={handleDecrease}
                disabled={quantity <= 1}
              >
                <Ionicons
                  name="remove"
                  size={18}
                  color={quantity <= 1 ? COLORS.textLight : COLORS.primary}
                />
              </TouchableOpacity>

              <View style={styles.qtyBox}>
                <Text style={styles.qtyValue}>{quantity}</Text>
              </View>

              <TouchableOpacity style={styles.qtyBtn} onPress={handleIncrease}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Admin Stock Management */}
          {isAdmin && (
            <View style={styles.adminActionCard}>
              <View>
                <Text style={styles.adminCardTitle}>Admin Inventory Control</Text>
                <Text style={styles.adminCardSub}>
                  Status: {product.inStock ? 'Available in Stock' : 'Marked Out of Stock'}
                </Text>
              </View>
              <CustomButton
                title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                size="small"
                type={product.inStock ? 'danger' : 'primary'}
                onPress={() => toggleStockStatus(product.id)}
              />
            </View>
          )}

          {/* Product Description */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionHeading}>Product Details</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Nutrition Info */}
          {product.nutrition && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionHeading}>Nutritions & Facts</Text>
              <View style={styles.nutritionBox}>
                <Ionicons name="nutrition-outline" size={20} color={COLORS.primary} />
                <Text style={styles.nutritionText}>{product.nutrition}</Text>
              </View>
            </View>
          )}

          {/* Delivery & Assurance Perks */}
          <View style={styles.perksCard}>
            <View style={styles.perkItem}>
              <Ionicons name="flash-outline" size={20} color={COLORS.primary} />
              <Text style={styles.perkText}>Fast 15-30 mins delivery</Text>
            </View>
            <View style={styles.perkItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.primary} />
              <Text style={styles.perkText}>100% Quality organic guarantee</Text>
            </View>
            <View style={styles.perkItem}>
              <Ionicons name="refresh-outline" size={20} color={COLORS.primary} />
              <Text style={styles.perkText}>Instant replacement if not fresh</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, SHADOWS.medium]}>
        <View style={styles.bottomPriceInfo}>
          <Text style={styles.bottomTotalLabel}>Total Price</Text>
          <Text style={styles.bottomTotalPrice}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>

        <View style={styles.bottomBtnWrapper}>
          <CustomButton
            title={
              !product.inStock
                ? 'Out of Stock'
                : existingInCart > 0
                ? `Add More (${existingInCart} in Cart)`
                : 'Add to Cart'
            }
            icon="cart-outline"
            disabled={!product.inStock}
            onPress={handleAddToCart}
            style={styles.addToCartBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  headerFavBtn: {
    padding: 6,
  },
  imageCard: {
    backgroundColor: COLORS.surface,
    height: 270,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  badgePill: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  outOfStockBanner: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  outOfStockText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '800',
  },
  detailsContainer: {
    padding: 20,
  },
  topMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: COLORS.surfaceVariant,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingVal: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  unitText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  priceQuantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderLight,
  },
  priceLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  quantityPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 14,
    padding: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBox: {
    paddingHorizontal: 16,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  adminActionCard: {
    backgroundColor: COLORS.adminBadgeLight,
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adminCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.adminBadge,
  },
  adminCardSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  infoSection: {
    marginTop: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textMuted,
  },
  nutritionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.primaryLight,
    padding: 12,
    borderRadius: 12,
  },
  nutritionText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  perksCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  perkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perkText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  bottomPriceInfo: {
    marginRight: 16,
  },
  bottomTotalLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bottomTotalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  bottomBtnWrapper: {
    flex: 1,
  },
  addToCartBtn: {
    width: '100%',
  },
});

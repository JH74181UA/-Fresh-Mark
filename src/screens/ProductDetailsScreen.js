// src/screens/ProductDetailsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart, toggleFavorite, isFavorite, isInCart } = useApp();
  const [quantity, setQuantity] = useState(1);

  const favorited = isFavorite(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    Alert.alert(
      '✅ Added to Cart',
      `${quantity}x ${product.name} added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Overlay buttons */}
          <TouchableOpacity
            style={styles.favOverlay}
            onPress={() => toggleFavorite(product)}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={24}
              color={favorited ? Colors.error : Colors.white}
            />
          </TouchableOpacity>
          {product.badge && (
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>{product.badge}</Text>
            </View>
          )}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>{discount}% OFF</Text>
            </View>
          )}
          {!product.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          {/* Category */}
          <Text style={styles.category}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Text>

          {/* Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= Math.floor(product.rating) ? 'star' : star - 0.5 <= product.rating ? 'star-half' : 'star-outline'}
                size={16}
                color={Colors.starActive}
              />
            ))}
            <Text style={styles.ratingNum}>{product.rating}</Text>
            <Text style={styles.reviews}>({product.reviews} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            <Text style={styles.unit}>/ {product.unit}</Text>
            {product.originalPrice > product.price && (
              <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
            )}
            {discount > 0 && (
              <View style={styles.saveBadge}>
                <Text style={styles.saveText}>Save {discount}%</Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          {/* Quantity */}
          <Text style={styles.sectionLabel}>Quantity</Text>
          <View style={styles.qtyRow}>
            <View style={styles.qtyControl}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={20} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.qty}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.totalPrice}>Total: ₹{product.price * quantity}</Text>
          </View>

          {/* Info chips */}
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Ionicons name="leaf-outline" size={14} color={Colors.primary} />
              <Text style={styles.chipText}>Fresh</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="shield-checkmark-outline" size={14} color={Colors.primary} />
              <Text style={styles.chipText}>Quality Checked</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="car-outline" size={14} color={Colors.primary} />
              <Text style={styles.chipText}>Fast Delivery</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(product)}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? Colors.error : Colors.white}
          />
        </TouchableOpacity>
        {product.inStock ? (
          <TouchableOpacity
            style={[styles.addToCartBtn, inCart && styles.addedBtn]}
            onPress={handleAddToCart}
          >
            <Ionicons name={inCart ? 'cart' : 'cart-outline'} size={20} color={Colors.white} />
            <Text style={styles.addToCartText}>
              {inCart ? 'Add More to Cart' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.addToCartBtn, styles.disabledBtn]}>
            <Text style={styles.addToCartText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  imageContainer: {
    position: 'relative',
    height: 280,
    backgroundColor: '#111',
  },
  image: { width: '100%', height: '100%' },
  favOverlay: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BorderRadius.full,
    padding: 10,
  },
  imageBadge: {
    position: 'absolute',
    top: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageBadgeText: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '700' },
  discountBadge: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountBadgeText: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '700' },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outOfStockText: { color: Colors.white, fontSize: FontSizes.xl, fontWeight: '700' },
  detailsCard: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: Spacing.xl,
    paddingBottom: 100,
  },
  category: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  name: { color: Colors.white, fontSize: FontSizes.xxl, fontWeight: '800', marginBottom: Spacing.md },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: 4 },
  ratingNum: { color: Colors.starActive, fontSize: FontSizes.md, fontWeight: '700', marginLeft: 4 },
  reviews: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: Spacing.md },
  price: { color: Colors.primary, fontSize: FontSizes.xxxl, fontWeight: '800' },
  unit: { color: Colors.textSecondary, fontSize: FontSizes.md },
  originalPrice: { color: Colors.textSecondary, fontSize: FontSizes.md, textDecorationLine: 'line-through' },
  saveBadge: { backgroundColor: Colors.primary + '20', borderRadius: BorderRadius.sm, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: Colors.primary },
  saveText: { color: Colors.primary, fontSize: FontSizes.xs, fontWeight: '700' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },
  sectionLabel: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700', marginBottom: Spacing.sm },
  description: { color: Colors.textSecondary, fontSize: FontSizes.md, lineHeight: 22 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl },
  qtyControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderRadius: BorderRadius.full, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  qtyBtn: { backgroundColor: Colors.primary, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  qty: { color: Colors.white, fontSize: FontSizes.xl, fontWeight: '700', paddingHorizontal: Spacing.xl, minWidth: 50, textAlign: 'center' },
  totalPrice: { color: Colors.white, fontSize: FontSizes.xl, fontWeight: '700' },
  chipRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.card, borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  chipText: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.card,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  favBtn: {
    width: 50,
    height: 50,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    height: 50,
  },
  addedBtn: { backgroundColor: Colors.primaryDark },
  disabledBtn: { backgroundColor: Colors.border },
  addToCartText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
});

export default ProductDetailsScreen;

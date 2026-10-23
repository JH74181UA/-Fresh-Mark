// src/components/ProductCard.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

const ProductCard = ({ product, onPress, showFavButton = true }) => {
  const { addToCart, toggleFavorite, isFavorite, isInCart } = useApp();
  const favorited = isFavorite(product.id);
  const inCart = isInCart(product.id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Badge */}
      {product.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{product.badge}</Text>
        </View>
      )}

      {/* Favorite button */}
      {showFavButton && (
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(product)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={18}
            color={favorited ? Colors.error : Colors.textSecondary}
          />
        </TouchableOpacity>
      )}

      {/* Product Image */}
      <Image
        source={{ uri: product.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={11} color={Colors.starActive} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.reviews}>({product.reviews})</Text>
        </View>

        {/* Price */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{product.price}</Text>
          {product.originalPrice > product.price && (
            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
          )}
        </View>
        <Text style={styles.unit}>per {product.unit}</Text>

        {/* Add to cart */}
        {product.inStock ? (
          <TouchableOpacity
            style={[styles.cartBtn, inCart && styles.cartBtnAdded]}
            onPress={() => addToCart(product, 1)}
          >
            <Ionicons
              name={inCart ? 'checkmark-circle' : 'cart-outline'}
              size={14}
              color={Colors.white}
            />
            <Text style={styles.cartBtnText}>{inCart ? 'Added' : 'Add'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.outOfStockBtn}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  favBtn: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: BorderRadius.full,
    padding: 5,
    zIndex: 10,
  },
  image: {
    width: '100%',
    height: 110,
    backgroundColor: '#222',
  },
  info: {
    padding: Spacing.sm,
  },
  category: {
    color: Colors.primary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  name: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    lineHeight: 17,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  rating: {
    color: Colors.starActive,
    fontSize: FontSizes.xs,
    marginLeft: 2,
    fontWeight: '600',
  },
  reviews: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    color: Colors.primary,
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  originalPrice: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    textDecorationLine: 'line-through',
  },
  unit: {
    color: Colors.textSecondary,
    fontSize: 9,
    marginTop: 1,
    marginBottom: Spacing.xs,
  },
  cartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 4,
    marginTop: 4,
  },
  cartBtnAdded: {
    backgroundColor: Colors.primaryDark,
  },
  cartBtnText: {
    color: Colors.white,
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  outOfStockBtn: {
    backgroundColor: Colors.border,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    paddingVertical: 6,
    marginTop: 4,
  },
  outOfStockText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
});

export default ProductCard;

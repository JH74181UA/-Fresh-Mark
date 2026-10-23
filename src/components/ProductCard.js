import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 column layout with padding

export const ProductCard = ({ product, onPress, onStockToggle }) => {
  const { addToCart, getItemQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isAdmin } = useAuth();

  const favorite = isFavorite(product.id);
  const cartQty = getItemQuantity(product.id);

  const handleAddToCart = (e) => {
    e?.stopPropagation?.();
    if (!product.inStock) return;
    addToCart(product, 1);
  };

  const handleFavoriteToggle = (e) => {
    e?.stopPropagation?.();
    toggleFavorite(product);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, SHADOWS.soft, !product.inStock && styles.outOfStockCard]}
    >
      {/* Top row: badge & favorite icon */}
      <View style={styles.topRow}>
        {product.badge ? (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={20}
            color={favorite ? COLORS.danger : COLORS.textMuted}
          />
        </TouchableOpacity>
      </View>

      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="contain"
        />
        {!product.inStock && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>Out of Stock</Text>
          </View>
        )}
      </View>

      {/* Product Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.categoryText}>{product.category}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.unit}>{product.unit}</Text>

        {/* Rating row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={COLORS.secondary} />
          <Text style={styles.ratingText}>{product.rating}</Text>
          <Text style={styles.reviewsText}>({product.reviewsCount})</Text>
        </View>

        {/* Price and Add button */}
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
            )}
          </View>

          {isAdmin ? (
            <TouchableOpacity
              style={[
                styles.adminStockBtn,
                { backgroundColor: product.inStock ? COLORS.customerBadgeLight : COLORS.dangerLight }
              ]}
              onPress={onStockToggle}
            >
              <Text
                style={[
                  styles.adminStockText,
                  { color: product.inStock ? COLORS.customerBadge : COLORS.danger }
                ]}
              >
                {product.inStock ? 'In Stock' : 'Restock'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.addButton,
                cartQty > 0 && styles.activeAddButton,
                !product.inStock && styles.disabledAddButton,
              ]}
              onPress={handleAddToCart}
              disabled={!product.inStock}
            >
              {cartQty > 0 ? (
                <View style={styles.cartQtyBadge}>
                  <Text style={styles.cartQtyText}>{cartQty}</Text>
                </View>
              ) : (
                <Ionicons name="add" size={20} color={COLORS.white} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 16,
  },
  outOfStockCard: {
    opacity: 0.85,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeContainer: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '800',
  },
  favoriteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 105,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  outOfStockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  outOfStockText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: '800',
    backgroundColor: COLORS.dangerLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  infoContainer: {
    marginTop: 6,
  },
  categoryText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  unit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    marginLeft: 3,
  },
  reviewsText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeAddButton: {
    backgroundColor: COLORS.primaryDark,
  },
  disabledAddButton: {
    backgroundColor: COLORS.border,
  },
  cartQtyBadge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartQtyText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
  adminStockBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  adminStockText: {
    fontSize: 11,
    fontWeight: '700',
  },
});

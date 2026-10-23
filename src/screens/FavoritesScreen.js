// src/screens/FavoritesScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius } from '../theme';
import { useApp } from '../context/AppContext';

const FavoriteItem = ({ item, onRemove, onAddToCart, onPress }) => (
  <TouchableOpacity style={styles.itemCard} onPress={onPress} activeOpacity={0.85}>
    <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
    <View style={styles.itemInfo}>
      <Text style={styles.itemCategory}>
        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
      </Text>
      <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={11} color={Colors.starActive} />
        <Text style={styles.rating}>{item.rating}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.unit}>/ {item.unit}</Text>
      </View>
    </View>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
        <Ionicons name="heart" size={20} color={Colors.error} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.cartBtn, !item.inStock && styles.cartBtnDisabled]}
        onPress={item.inStock ? onAddToCart : undefined}
      >
        <Ionicons name="cart-outline" size={16} color={Colors.white} />
        <Text style={styles.cartBtnText}>{item.inStock ? 'Add' : 'N/A'}</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const FavoritesScreen = ({ navigation }) => {
  const { favorites, removeFromFavorites, addToCart } = useApp();

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    Alert.alert('✅ Added to Cart', `${item.name} added to your cart!`, [
      { text: 'OK' },
      { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const handleRemoveFav = (item) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${item.name} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeFromFavorites(item.id) },
      ]
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyScreen}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <Text style={styles.emptyEmoji}>💚</Text>
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptySubtitle}>
          Tap the heart icon on any product to save it here for quick access
        </Text>
        <TouchableOpacity
          style={styles.browseBtn}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.browseBtnText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.topBar}>
        <Text style={styles.count}>{favorites.length} saved items</Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            onRemove={() => handleRemoveFav(item)}
            onAddToCart={() => handleAddToCart(item)}
            onPress={() => navigation.navigate('ProductDetails', { product: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    lineHeight: 22,
  },
  browseBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
  },
  browseBtnText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
  topBar: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  count: { color: Colors.textSecondary, fontSize: FontSizes.sm },
  listContent: { paddingHorizontal: Spacing.lg, paddingBottom: 100 },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemImage: { width: 90, height: 110, backgroundColor: '#222' },
  itemInfo: { flex: 1, padding: Spacing.md },
  itemCategory: { color: Colors.primary, fontSize: FontSizes.xs, fontWeight: '700', textTransform: 'uppercase' },
  itemName: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '600', marginBottom: 4, lineHeight: 18 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  rating: { color: Colors.starActive, fontSize: FontSizes.xs, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { color: Colors.primary, fontSize: FontSizes.md, fontWeight: '700' },
  unit: { color: Colors.textSecondary, fontSize: FontSizes.xs },
  actions: {
    padding: Spacing.sm,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeBtn: {
    padding: Spacing.sm,
  },
  cartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cartBtnDisabled: { backgroundColor: Colors.border },
  cartBtnText: { color: Colors.white, fontSize: FontSizes.xs, fontWeight: '700' },
});

export default FavoritesScreen;

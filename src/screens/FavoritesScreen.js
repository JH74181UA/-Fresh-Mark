import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/colors';
import { Header } from '../components/Header';
import { CustomButton } from '../components/CustomButton';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const FavoritesScreen = ({ navigation }) => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart, getItemQuantity } = useCart();
  const { isAdmin, quickSwitchRole } = useAuth();

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    Alert.alert('Added to Cart', `${product.name} has been added to your shopping cart.`);
  };

  const handleAddAllToCart = () => {
    if (favorites.length === 0) return;
    favorites.forEach((item) => {
      addToCart(item, 1);
    });
    Alert.alert('Success', `All ${favorites.length} favorite items added to your cart!`);
  };

  if (isAdmin) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header title="My Favorites" showMenu={true} showCart={true} />
        <View style={styles.adminNoticeContainer}>
          <View style={styles.adminNoticeCard}>
            <View style={styles.adminIconCircle}>
              <Ionicons name="heart-dislike" size={40} color={COLORS.danger} />
            </View>
            <Text style={styles.adminNoticeTitle}>Customer Favorites Only</Text>
            <Text style={styles.adminNoticeDesc}>
              The Wishlist & Favorites collection is reserved for Customer accounts. Admin accounts oversee inventory and store management.
            </Text>
            <CustomButton
              title="Switch to Customer Role"
              icon="swap-horizontal"
              onPress={() => quickSwitchRole('customer')}
              style={{ marginTop: 16, width: '100%' }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="My Favorites"
        showMenu={true}
        showCart={true}
        rightComponent={
          favorites.length > 0 ? (
            <TouchableOpacity onPress={clearFavorites} style={styles.clearHeaderBtn}>
              <Ionicons name="trash-bin-outline" size={20} color={COLORS.danger} />
            </TouchableOpacity>
          ) : null
        }
      />

      <View style={styles.container}>
        {favorites.length > 0 && (
          <View style={styles.topActionsBar}>
            <Text style={styles.favoritesCountText}>
              <Text style={styles.boldText}>{favorites.length}</Text> saved items
            </Text>

            <TouchableOpacity style={styles.addAllBtn} onPress={handleAddAllToCart}>
              <Ionicons name="cart-outline" size={16} color={COLORS.primary} />
              <Text style={styles.addAllText}>Add All to Cart</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const inCartCount = getItemQuantity(item.id);
            return (
              <View style={[styles.favoriteCard, SHADOWS.soft]}>
                <TouchableOpacity
                  style={styles.imageBox}
                  onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                >
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.infoBox}
                  onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
                >
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.productUnit}>{item.unit || item.category}</Text>
                  <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
                </TouchableOpacity>

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeFromFavorites(item.id)}
                    accessibilityLabel="Remove from favorites"
                  >
                    <Ionicons name="heart-dislike-outline" size={20} color={COLORS.danger} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cartBtn, inCartCount > 0 && styles.activeCartBtn]}
                    onPress={() => handleAddToCart(item)}
                    accessibilityLabel="Add to cart"
                  >
                    <Ionicons
                      name="cart"
                      size={16}
                      color={inCartCount > 0 ? COLORS.white : COLORS.primary}
                    />
                    <Text
                      style={[
                        styles.cartBtnText,
                        inCartCount > 0 && styles.activeCartBtnText,
                      ]}
                    >
                      {inCartCount > 0 ? `In Cart (${inCartCount})` : 'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyHeartBox}>
                <Ionicons name="heart-outline" size={56} color={COLORS.danger} />
              </View>
              <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
              <Text style={styles.emptySub}>
                Explore our daily fresh groceries and tap the heart icon on any item to save it for later.
              </Text>
              <CustomButton
                title="Browse Daily Groceries"
                icon="basket-outline"
                onPress={() => navigation.navigate('ProductsTab')}
                style={{ marginTop: 24, width: '80%' }}
              />
            </View>
          }
        />
      </View>
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
  clearHeaderBtn: {
    padding: 6,
  },
  topActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  favoritesCountText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.textDark,
  },
  addAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  addAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listContent: {
    padding: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: COLORS.surfaceVariant,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  productUnit: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  activeCartBtn: {
    backgroundColor: COLORS.primary,
  },
  cartBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  activeCartBtnText: {
    color: COLORS.white,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyHeartBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.dangerLight + '40',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  adminNoticeContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminNoticeCard: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    width: '100%',
  },
  adminIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  adminNoticeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  adminNoticeDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});

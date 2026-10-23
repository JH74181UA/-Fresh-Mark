import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { Header } from '../components/Header';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { useProducts } from '../context/ProductsContext';
import { useAuth } from '../context/AuthContext';

export const ProductsListScreen = ({ navigation }) => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    getFilteredProducts,
    toggleStockStatus,
    addNewProduct,
  } = useProducts();

  const { isAdmin } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  // Admin add product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Fruits & Veggies');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [formError, setFormError] = useState('');

  const filteredProducts = getFilteredProducts();

  const handleCreateProduct = () => {
    if (!newProdName.trim() || !newProdPrice.trim() || !newProdUnit.trim()) {
      setFormError('Please enter product name, price, and unit.');
      return;
    }

    const priceNum = parseFloat(newProdPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Please enter a valid positive price.');
      return;
    }

    addNewProduct({
      name: newProdName.trim(),
      category: newProdCategory,
      categoryId: newProdCategory.toLowerCase().includes('fruit') ? 'fruits_veg' : 'bakery_snacks',
      price: priceNum,
      unit: newProdUnit.trim(),
      description: newProdDesc.trim() || 'Fresh high-quality grocery item sourced directly from local producers.',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
      badge: 'New Arrival',
    });

    // Reset and close
    setNewProdName('');
    setNewProdPrice('');
    setNewProdUnit('');
    setNewProdDesc('');
    setFormError('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Daily Groceries"
        showMenu={true}
        showCart={true}
        rightComponent={
          isAdmin ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={28} color={COLORS.primary} />
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Search Input Box */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search groceries (apples, milk, oil)..."
            placeholderTextColor={COLORS.textLight}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Pills Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <Text style={styles.countText}>
          Showing <Text style={styles.boldText}>{filteredProducts.length}</Text> items
        </Text>
        {isAdmin && (
          <View style={styles.adminIndicator}>
            <Ionicons name="shield-checkmark" size={13} color={COLORS.adminBadge} />
            <Text style={styles.adminIndicatorText}>Admin Inventory Mode</Text>
          </View>
        )}
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
            onStockToggle={() => toggleStockStatus(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="basket-outline" size={64} color={COLORS.textLight} />
            <Text style={styles.emptyTitle}>No Groceries Found</Text>
            <Text style={styles.emptySub}>
              We couldn't find anything matching "{searchQuery}". Try a different keyword or category.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Admin Add Product Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Grocery Item</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {formError ? <Text style={styles.modalError}>{formError}</Text> : null}

              <CustomInput
                label="Product Name"
                placeholder="e.g. Fresh Mangoes"
                value={newProdName}
                onChangeText={setNewProdName}
                icon="leaf-outline"
              />

              <CustomInput
                label="Price ($)"
                placeholder="e.g. 5.99"
                keyboardType="decimal-pad"
                value={newProdPrice}
                onChangeText={setNewProdPrice}
                icon="cash-outline"
              />

              <CustomInput
                label="Unit / Weight"
                placeholder="e.g. 1 kg (3-4 pcs)"
                value={newProdUnit}
                onChangeText={setNewProdUnit}
                icon="scale-outline"
              />

              <CustomInput
                label="Description"
                placeholder="Detailed description of the grocery item..."
                value={newProdDesc}
                onChangeText={setNewProdDesc}
                multiline={true}
                numberOfLines={3}
                icon="document-text-outline"
              />

              <CustomButton
                title="Save & Publish Product"
                onPress={handleCreateProduct}
                style={{ marginTop: 12, marginBottom: 8 }}
              />
            </ScrollView>
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
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.textDark,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  countText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  boldText: {
    fontWeight: '700',
    color: COLORS.textDark,
  },
  adminIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.adminBadgeLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  adminIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.adminBadge,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  addBtn: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 14,
  },
  emptySub: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  resetButton: {
    marginTop: 16,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  modalError: {
    color: COLORS.danger,
    fontSize: 13,
    marginBottom: 12,
    backgroundColor: COLORS.dangerLight,
    padding: 8,
    borderRadius: 8,
  },
});

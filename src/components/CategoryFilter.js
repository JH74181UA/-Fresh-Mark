import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(category.id)}
              style={[styles.chip, isSelected && styles.activeChip]}
            >
              {category.icon && (
                <Ionicons
                  name={category.icon}
                  size={16}
                  color={isSelected ? COLORS.white : COLORS.textDark}
                  style={styles.icon}
                />
              )}
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceVariant,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  icon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  activeChipText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});

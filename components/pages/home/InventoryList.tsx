import React, {useState} from "react"
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import ItemCard from "@/components/pages/home/ItemCard";
import {Item} from "@/components/pages/home/types"
import * as colors from "@/constants/colors/catppuccin-palette.json"

const inventoryCategories = ['All', 'Canned/Packed', 'Fruits/Vegetables', 'Cooked Food'];

const InventoryList = ({items} : {items:Item[]}) => {
    const [activeCategory, setActiveCategory] = useState('All');

    // FIX: Filtering logic is now case-insensitive to prevent mismatches.
    const filteredInventory = items.filter(item =>
        activeCategory === 'All' ||
        (item.category && item.category.toLowerCase() === activeCategory.toLowerCase())
    );

    return <View style={styles.inventorySection}>
        <Text style={styles.sectionTitle}>Inventory</Text>
        {/* Category Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {inventoryCategories.map(category => (
                <TouchableOpacity
                    key={category}
                    style={[styles.categoryChip, activeCategory === category && styles.activeCategoryChip]}
                    onPress={() => setActiveCategory(category)}
                >
                    <Text
                        style={[styles.categoryChipText, activeCategory === category && styles.activeCategoryChipText]}>
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Inventory Grid */}
        <View style={styles.inventoryGrid}>
            {filteredInventory.map(item => (
                <ItemCard key={item.id} item={item}/>
            ))}
        </View>
    </View>
}

export default InventoryList

const styles = StyleSheet.create({
    inventorySection: {
        marginTop: 30,
        paddingBottom: 100, // To avoid being covered by the nav bar
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.latte.colors.text.hex,
        marginBottom: 15,
    },
    categoryScroll: {
        marginBottom: 20,
    },
    categoryChip: {
        backgroundColor: colors.latte.colors.crust.hex,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    activeCategoryChip: {
        backgroundColor: colors.latte.colors.green.hex
    },
    categoryChipText: {
        color: colors.latte.colors.text.hex,
        fontWeight: '500',
    },
    activeCategoryChipText: {
        color: colors.latte.colors.base.hex,
    },
    inventoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Align items to the left
    },
})

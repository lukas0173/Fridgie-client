import React, { useState} from "react"
import {View, Text, ScrollView, TouchableOpacity, StyleSheet} from "react-native";

import {ItemCard} from "@/app/(tabs)/(home)/Components.Home";

const inventoryCategories = ['All', 'Canned/Packed', 'Fruits/Vegetables', 'Condiments'];

const inventoryItems = [
    {id: 'inv1', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed'},
    {id: 'inv2', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed'},
    {id: 'inv3', name: 'Sữa Vinamilk', expiry: '5 days', category: 'Fruits/Vegetables'},
    {id: 'inv4', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed'},
    {id: 'inv5', name: 'Sữa Vinamilk', expiry: '3 days', category: 'Condiments'},
    {id: 'inv6', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed'},
    {id: 'inv7', name: 'Sữa Vinamilk', expiry: '1 day', category: 'Canned/Packed'},
    {id: 'inv8', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Fruits/Vegetables'},
    {id: 'inv9', name: 'Sữa Vinamilk', expiry: '8 days', category: 'Canned/Packed'},
    {id: 'inv10', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed'},
    {id: 'inv11', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Condiments'},
    {id: 'inv12', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed'},
];

const InventoryList = () => {
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredInventory = inventoryItems.filter(item =>
        activeCategory === 'All' || item.category === activeCategory
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
                <ItemCard key={item.id} name={item.name} expiry={item.expiry}/>
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
        color: '#333',
        marginBottom: 15,
    },
    categoryScroll: {
        marginBottom: 20,
    },
    categoryChip: {
        backgroundColor: '#E0E0E0',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    activeCategoryChip: {
        backgroundColor: '#4CAF50',
    },
    categoryChipText: {
        color: '#333',
        fontWeight: '500',
    },
    activeCategoryChipText: {
        color: '#FFFFFF',
    },
    inventoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
})
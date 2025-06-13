import React, {useState} from "react"
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";

import ItemCard from "@/app/(tabs)/(home)/ItemCard";
import {Item} from "@/app/(tabs)/(home)/types"

const inventoryCategories = ['All', 'Canned/Packed', 'Fruits/Vegetables', 'Condiments'];

const inventoryItems: Item[] = [
    {
        id: 'inv1',
        name: 'Sữa Vinamilk',
        expiry: 'Tomorrow',
        category: 'Canned/Packed',
        status: 'Critical',
        dayAdded: '10/05/2025',
        dayExpired: '21/05/2025',
        quantity: 1
    },
    {
        id: 'inv2',
        name: 'Canned Tuna',
        expiry: '35 days',
        category: 'Canned/Packed',
        status: 'Neutral',
        dayAdded: '25/04/2025',
        dayExpired: '30/06/2025',
        quantity: 3
    },
    {
        id: 'inv3',
        name: 'Apples',
        expiry: '5 days',
        category: 'Fruits/Vegetables',
        status: 'Warning',
        dayAdded: '16/05/2025',
        dayExpired: '25/05/2025',
        quantity: 6
    },
    {
        id: 'inv4',
        name: 'Orange Juice',
        expiry: '12 days',
        category: 'Canned/Packed',
        status: 'Neutral',
        dayAdded: '09/05/2025',
        dayExpired: '01/06/2025',
        quantity: 1
    },
    {
        id: 'inv5',
        name: 'Ketchup',
        expiry: '90 days',
        category: 'Condiments',
        status: 'Neutral',
        dayAdded: '01/04/2025',
        dayExpired: '30/08/2025',
        quantity: 1
    },
    {
        id: 'inv6',
        name: 'Pasta',
        expiry: '120 days',
        category: 'Canned/Packed',
        status: 'Neutral',
        dayAdded: '21/02/2025',
        dayExpired: '21/10/2025',
        quantity: 2
    },
    {
        id: 'inv7',
        name: 'Lettuce',
        expiry: '1 day',
        category: 'Fruits/Vegetables',
        status: 'Critical',
        dayAdded: '20/05/2025',
        dayExpired: '21/05/2025',
        quantity: 1
    },
    {
        id: 'inv8',
        name: 'Tomatoes',
        expiry: '4 days',
        category: 'Fruits/Vegetables',
        status: 'Warning',
        dayAdded: '17/05/2025',
        dayExpired: '24/05/2025',
        quantity: 8
    },
    {
        id: 'inv9',
        name: 'Mustard',
        expiry: '80 days',
        category: 'Condiments',
        status: 'Neutral',
        dayAdded: '15/03/2025',
        dayExpired: '05/09/2025',
        quantity: 1
    },
    {
        id: 'inv10',
        name: 'Cereal',
        expiry: '45 days',
        category: 'Canned/Packed',
        status: 'Neutral',
        dayAdded: '05/05/2025',
        dayExpired: '20/07/2025',
        quantity: 1
    },
    {
        id: 'inv11',
        'name': 'Mayonnaise',
        'expiry': '60 days',
        category: 'Condiments',
        status: 'Neutral',
        dayAdded: '01/05/2025',
        dayExpired: '30/07/2025',
        quantity: 1
    },
    {
        id: 'inv12',
        name: 'Instant Noodles',
        expiry: 'Tomorrow',
        category: 'Canned/Packed',
        status: 'Neutral',
        dayAdded: '21/01/2025',
        dayExpired: '21/12/2025',
        quantity: 5
    },
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
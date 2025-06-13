import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Feather, Ionicons} from '@expo/vector-icons'; // Using Expo for icons

import {ItemCard, TabExpirationOptions} from "@/components/pages/Home/Components.Home";
import ExpirationStatusBar from "@/components/pages/Home/ExpirationStatusBar";
import ExpiringHorizontalList from "@/components/pages/Home/ExpiringHorizontalList";

// --- MOCK DATA ---
// This data simulates what you would fetch from your backend API.


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

const inventoryCategories = ['All', 'Canned/Packed', 'Fruits/Vegetables', 'Condiments'];

// The main Home Screen Component
const HomeScreen = () => {
    const [activeStatusTab, setActiveStatusTab] = useState('Critical');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredInventory = inventoryItems.filter(item =>
        activeCategory === 'All' || item.category === activeCategory
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <Text style={styles.headerDate}>May 20</Text>
                    <TouchableOpacity>
                        <Feather name="search" size={24} color="#333"/>
                    </TouchableOpacity>
                </View>

                {/* --- EXPIRATION STATUS TABS --- */}
                <ExpirationStatusBar activeStatusTab={activeStatusTab} setActiveStatusTab = {setActiveStatusTab}/>

                {/* --- EXPIRING ITEMS HORIZONTAL LIST --- */}
                <ExpiringHorizontalList />

                {/* --- INVENTORY SECTION --- */}
                <View style={styles.inventorySection}>
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
            </ScrollView>

            {/* --- BOTTOM NAVIGATION --- */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="home" size={26} color="#4CAF50"/>
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Feather name="plus" size={32} color="#FFF"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="settings-outline" size={26} color="#8A8A8D"/>
                    <Text style={styles.navText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerDate: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#333',
    },
    horizontalScroll: {
        paddingLeft: 20,
    },
    inventorySection: {
        marginTop: 30,
        paddingBottom: 100, // To avoid being covered by the nav bar
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    categoryScroll: {
        paddingLeft: 20,
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
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingTop: 10,
    },
    navButton: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#8A8A8D',
    },
    navTextActive: {
        fontSize: 12,
        color: '#4CAF50',
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 25,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default HomeScreen;

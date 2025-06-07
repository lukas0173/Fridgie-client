import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons'; // Using Expo for icons

// --- MOCK DATA ---
// This data simulates what you would fetch from your backend API.

const expiringItems = [
    { id: '1', name: 'Sữa Vinamilk', expiry: 'Tomorrow' },
    { id: '2', name: 'Sữa Vinamilk', expiry: 'Tomorrow' },
    { id: '3', name: 'Sữa Vinamilk', expiry: 'Tomorrow' },
    { id: '4', name: 'Sữa Vinamilk', expiry: 'Tomorrow' },
    { id: '5', name: 'Sữa Vinamilk', expiry: '2 days' },
];

const inventoryItems = [
    { id: 'inv1', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed' },
    { id: 'inv2', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed' },
    { id: 'inv3', name: 'Sữa Vinamilk', expiry: '5 days', category: 'Fruits/Vegetables' },
    { id: 'inv4', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed' },
    { id: 'inv5', name: 'Sữa Vinamilk', expiry: '3 days', category: 'Condiments' },
    { id: 'inv6', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed' },
    { id: 'inv7', name: 'Sữa Vinamilk', expiry: '1 day', category: 'Canned/Packed' },
    { id: 'inv8', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Fruits/Vegetables' },
    { id: 'inv9', name: 'Sữa Vinamilk', expiry: '8 days', category: 'Canned/Packed' },
    { id: 'inv10', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed' },
    { id: 'inv11', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Condiments' },
    { id: 'inv12', name: 'Sữa Vinamilk', expiry: 'Tomorrow', category: 'Canned/Packed' },
];

const inventoryCategories = ['All', 'Canned/Packed', 'Fruits/Vegetables', 'Condiments'];

// --- UI COMPONENTS ---

// A reusable component for each item in the lists
const ItemCard = ({ name, expiry }) => (
    <TouchableOpacity style={styles.itemCard}>
        <View style={styles.itemIconBackground}>
            <Ionicons name="pint-outline" size={32} color="#8A8A8D" />
        </View>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemExpiry}>{expiry}</Text>
    </TouchableOpacity>
);

// The main Home Screen Component
const HomeScreen = () => {
    const [activeStatusTab, setActiveStatusTab] = useState('Warning');
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
                        <Feather name="search" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* --- EXPIRATION STATUS TABS --- */}
                <View style={styles.statusTabsContainer}>
                    <TouchableOpacity
                        style={[styles.statusTab, activeStatusTab === 'Critical' && styles.activeStatusTab]}
                        onPress={() => setActiveStatusTab('Critical')}
                    >
                        <Text style={[styles.statusTabText, activeStatusTab === 'Critical' && styles.activeStatusTabText]}>
                            Critical
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.statusTab, activeStatusTab === 'Warning' && styles.activeStatusTab]}
                        onPress={() => setActiveStatusTab('Warning')}
                    >
                        <Text style={[styles.statusTabText, activeStatusTab === 'Warning' && styles.activeStatusTabText]}>
                            Warning
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.statusTab, activeStatusTab === 'Outdated' && styles.activeStatusTab]}
                        onPress={() => setActiveStatusTab('Outdated')}
                    >
                        <Text style={[styles.statusTabText, activeStatusTab === 'Outdated' && styles.activeStatusTabText]}>
                            Outdated
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- EXPIRING ITEMS HORIZONTAL LIST --- */}
                <View style={styles.expiringSection}>
                    <View style={styles.expiringHeader}>
                        <Text style={styles.expiringTitle}>4 Items</Text>
                        <View style={styles.expiringTime}>
                            <Ionicons name="time-outline" size={16} color="#8A8A8D" />
                            <Text style={styles.expiringTimeText}>1 to 3 days</Text>
                        </View>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {expiringItems.map(item => (
                            <ItemCard key={item.id} name={item.name} expiry={item.expiry} />
                        ))}
                    </ScrollView>
                </View>

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
                                <Text style={[styles.categoryChipText, activeCategory === category && styles.activeCategoryChipText]}>
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Inventory Grid */}
                    <View style={styles.inventoryGrid}>
                        {filteredInventory.map(item => (
                            <ItemCard key={item.id} name={item.name} expiry={item.expiry} />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* --- BOTTOM NAVIGATION --- */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="home" size={26} color="#4CAF50" />
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Feather name="plus" size={32} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="settings-outline" size={26} color="#8A8A8D" />
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
    statusTabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        marginHorizontal: 20,
        overflow: 'hidden',
    },
    statusTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeStatusTab: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        margin: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statusTabText: {
        color: '#666',
        fontWeight: '600',
    },
    activeStatusTabText: {
        color: '#333',
    },
    expiringSection: {
        marginTop: 25,
    },
    expiringHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    expiringTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    expiringTime: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expiringTimeText: {
        marginLeft: 5,
        color: '#8A8A8D',
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
    itemCard: {
        alignItems: 'center',
        margin: 8,
        width: 100, // Adjust width as needed for your design
    },
    itemIconBackground: {
        backgroundColor: '#E8E8E8',
        borderRadius: 12,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    itemName: {
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
    },
    itemExpiry: {
        color: '#8A8A8D',
        fontSize: 12,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default HomeScreen;

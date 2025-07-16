import React, {useCallback, useContext, useState} from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons'; // Using Expo for icons

import ExpirationStatusBar from "@/components/pages/home/ExpirationStatusBar";
import ExpiringHorizontalList from "@/components/pages/home/ExpiringHorizontalList";
import InventoryList from "@/components/pages/home/InventoryList";
import {InventoryContext} from "@/context/InventoryContext";

import * as catppuccinColors from '@/constants/colors/catppuccin-palette.json'

// The main (home) Screen Component
const HomeScreen = () => {
    console.log(InventoryContext)
    const context = useContext(InventoryContext);

    // Throw an error if the context is not found
    if (!context) {
        throw new Error('[Inventory] Inventory context not found');
    }
    const { items, isLoading, error, fetchItems } = context;

    const [refreshing, setRefreshing] = useState(false);
    const [activeStatusTab, setActiveStatusTab] = useState('Critical');

    // Handler for pull-to-refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchItems();
        setRefreshing(false);
    }, [fetchItems]);

    // Filter items for the top horizontal list
    const expiringItems = items.filter(item => item.status === activeStatusTab);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <Text style={styles.headerDate}>{new Date().toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric'
                    })}</Text>
                    <TouchableOpacity>
                        <Feather name="search" size={24} color="#333"/>
                    </TouchableOpacity>
                </View>

                {/* --- RENDER LOADING OR ERROR STATE --- */}
                {isLoading ? (
                    <View style={styles.centered}>
                        <ActivityIndicator size="large" color="#4CAF50"/>
                        <Text style={styles.infoText}>Loading Inventory...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centered}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <>
                        {/* --- EXPIRATION STATUS TABS --- */}
                        <ExpirationStatusBar activeStatusTab={activeStatusTab} setActiveStatusTab={setActiveStatusTab}/>

                        {/* --- EXPIRING ITEMS HORIZONTAL LIST --- */}
                        <ExpiringHorizontalList items={expiringItems} activeStatusTab={activeStatusTab}/>

                        {/* --- INVENTORY SECTION --- */}
                        <InventoryList items={items}/>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: catppuccinColors.latte.colors.base.hex,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerDate: {
        fontSize: 34,
        fontWeight: 'bold',
        color: catppuccinColors.latte.colors.text.hex,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    infoText: {
        marginTop: 10,
        color: catppuccinColors.latte.colors.text.hex,
        fontSize: 16,
    },
    errorText: {
        color: catppuccinColors.latte.colors.red.hex,
        fontSize: 16,
        textAlign: 'center',
    }
});

export default HomeScreen;

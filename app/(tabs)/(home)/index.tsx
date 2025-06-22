import React, {useCallback, useState} from 'react';
import {ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Feather} from '@expo/vector-icons'; // Using Expo for icons
import PocketBase, {ListResult, RecordModel} from 'pocketbase';
import {useFocusEffect} from "expo-router";

import ExpirationStatusBar from "@/components/pages/home/ExpirationStatusBar";
import ExpiringHorizontalList from "@/components/pages/home/ExpiringHorizontalList";
import InventoryList from "@/components/pages/home/InventoryList";
import {Item} from "@/components/pages/home/types";


const pb = new PocketBase('http://192.168.110.89:8090');

const getExpiryInfo = (expiryDateString: string): { daysLeft: number, text: string } => {
    const now = new Date();
    const expiryDate = new Date(expiryDateString);

    // Reset time part to compare dates only
    now.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {daysLeft: diffDays, text: 'Expired'};
    }
    if (diffDays === 0) {
        return {daysLeft: 0, text: 'Today'};
    }
    if (diffDays === 1) {
        return {daysLeft: 1, text: 'Tomorrow'};
    }
    return {daysLeft: diffDays, text: `${diffDays} days`};
};

// The main (home) Screen Component
const HomeScreen = () => {
    // State for storing items, loading status, and errors
    const [allItems, setAllItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [activeStatusTab, setActiveStatusTab] = useState('Critical');

    // --- Data Fetching Logic ---
    const fetchItems = async () => {
        try {
            setError(null);
            const records: ListResult<RecordModel> = await pb.collection('items').getList(1, 50, {
                sort: '-created',
                expand: 'image',
            });

            const formattedItems: Item[] = records.items.map((record: any): Item => { // Use 'any' for simplicity with expand
                const { daysLeft, text } = getExpiryInfo(record.expiry);

                let status: Item['status'] = 'Neutral';
                if (daysLeft < 0) status = 'Outdated';
                else if (daysLeft <= 2) status = 'Critical';
                else if (daysLeft <= 7) status = 'Warning';

                // Now, build the image URL from the expanded data
                let imageUrl = null;
                if (record.expand && record.expand.image) {
                    const imageRecord = record.expand.image;
                    // getFileUrl needs the record the file belongs to (imageRecord) and the filename (imageRecord.image)
                    imageUrl = pb.getFileUrl(imageRecord, imageRecord.image);
                }

                return {
                    id: record.id,
                    name: record.name,
                    category: record.category,
                    quantity: record.quantity,
                    status: status,
                    dayAdded: new Date(record.created).toLocaleDateString('en-GB'),
                    dayExpired: new Date(record.expiry).toLocaleDateString('en-GB'),
                    expiry: text,
                    image: imageUrl,
                    used: record.used,
                };
            });

            setAllItems(formattedItems);

        } catch (e: any) {
            console.error(e);
            setError("Failed to fetch items. Please check your connection and pull to refresh.");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    // --- Fetch data when the screen comes into focus ---
    useFocusEffect(
        useCallback(() => {
            setIsLoading(true); // Show loader when screen is focused
            fetchItems();
        }, [])
    );

    // --- Handler for pull-to-refresh ---
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchItems();
    }, []);

    // --- Filter items for the top horizontal list ---
    // Show items that are Critical or a Warning
    const expiringItems = allItems.filter(item => item.status === activeStatusTab);

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
                        <ExpiringHorizontalList items={expiringItems}/>

                        {/* --- INVENTORY SECTION --- */}
                        <InventoryList items={allItems}/>
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
        backgroundColor: '#F0F2F5',
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
        color: '#333',
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    infoText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    errorText: {
        color: '#E53935',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default HomeScreen;

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Item } from './types';

// Helper component for each row in the details list
const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
    <View style={styles.detailRow}>
        <View style={styles.detailRowIcon}>
            {icon}
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const ItemDetailsScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { item: itemString } = params;

    // Ensure itemString is a string before parsing
    const item: Item | null = typeof itemString === 'string' ? JSON.parse(itemString) : null;

    if (!item) {
        // Handle case where item is not found or invalid
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: "Error" }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Item not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Determine the color of the status badge based on the item's status
    const getStatusStyle = (status: Item['status']) => {
        switch (status) {
            case 'Critical':
                return { backgroundColor: '#E53935' }; // Red
            case 'Warning':
                return { backgroundColor: '#FFA726' }; // Orange
            case 'Neutral':
                return { backgroundColor: '#4CAF50' }; // Green
            case 'Outdated':
                return { backgroundColor: '#757575' }; // Grey
            default:
                return { backgroundColor: '#4CAF50' }; // Default to green
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* Set the header title dynamically for this screen */}
            <Stack.Screen options={{ title: "" , headerShadowVisible: false, headerStyle: { backgroundColor: '#F0F2F5' } }} />

            <View style={styles.mainContent}>
                {/* Image Placeholder */}
                <View style={styles.imageContainer}>
                    <Ionicons name="pint-outline" size={128} color="#BDBDBD" />
                </View>

                {/* Item Name and Status */}
                <View style={styles.header}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                {/* Item Details List */}
                <View style={styles.detailsContainer}>
                    <DetailRow
                        icon={<Ionicons name="time-outline" size={24} color="#8A8A8D" />}
                        label="Day added"
                        value={item.dayAdded}
                    />
                    <DetailRow
                        icon={<Ionicons name="time-outline" size={24} color="#8A8A8D" />}
                        label="Day expired"
                        value={item.dayExpired}
                    />
                    <DetailRow
                        icon={<MaterialCommunityIcons name="package-variant-closed" size={24} color="#8A8A8D" />}
                        label="Category"
                        value={item.category}
                    />
                    <DetailRow
                        icon={<MaterialCommunityIcons name="counter" size={24} color="#8A8A8D" />}
                        label="Quantity"
                        value={item.quantity}
                    />
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={[styles.button, styles.editButton]}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={[styles.button, styles.deleteButton]}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5', // Match home screen background
    },
    mainContent: {
        paddingHorizontal: 20,
    },
    imageContainer: {
        height: 250,
        backgroundColor: '#E8E8E8',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    itemName: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12, // Reduced from 20 for a less "pill" shape
    },
    statusText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    detailsContainer: {
        // No background card style, as per original design
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14, // Reduced padding for a more compact look
        // Removed border bottom
    },
    detailRowIcon: {
        width: 40, // To align text vertically
        alignItems: 'center'
    },
    detailLabel: {
        fontSize: 16, // Reduced font size
        color: '#8A8A8D', // Lighter grey for the label as per design
        flex: 1,
    },
    detailValue: {
        fontSize: 16, // Reduced font size
        color: '#333',
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 30, // More padding from bottom
        paddingTop: 10,
        gap: 15,
        backgroundColor: '#F0F2F5', // Match background
    },
    button: {
        // flex: 1, // Removed from here
        paddingVertical: 18,
        borderRadius: 14, // Reduced from 28 for a more rectangular shape
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    editButton: {
        backgroundColor: '#4CAF50',
    },
    deleteButton: {
        backgroundColor: '#c72c41', // Exact red from design
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ItemDetailsScreen;

import React from "react";
import {TouchableOpacity, View, Text, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";

// A reusable component for each item in the lists
export const ItemCard = ({name, expiry}: {name: string, expiry: string}) => (
    <TouchableOpacity style={styles.itemCard}>
        <View style={styles.itemIconBackground}>
            <Ionicons name="pint-outline" size={32} color="#8A8A8D"/>
        </View>
        <Text style={styles.itemName}>{name}</Text>
        <Text style={styles.itemExpiry}>{expiry}</Text>
    </TouchableOpacity>
);

// The Expiration options

const styles = StyleSheet.create({
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

})

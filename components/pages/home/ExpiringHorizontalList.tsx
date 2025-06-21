import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {Item} from "@/components/pages/home/types";
import ItemCard from "@/components/pages/home/ItemCard";

const expiringItems: Item[] = [
    {
        id: 'exp1',
        name: 'Sữa Vinamilk',
        expiry: 'Tomorrow',
        category: 'Canned/Packed',
        status: 'Critical',
        dayAdded: '10/05/2025',
        dayExpired: '21/05/2025',
        quantity: 1
    },
    {
        id: 'exp2',
        name: 'Bread',
        expiry: '2 days',
        category: 'Canned/Packed',
        status: 'Critical',
        dayAdded: '19/05/2025',
        dayExpired: '22/05/2025',
        quantity: 1
    },
    {
        id: 'exp3',
        name: 'Chicken Breast',
        expiry: '2 days',
        category: 'Fruits/Vegetables',
        status: 'Critical',
        dayAdded: '19/05/2025',
        dayExpired: '22/05/2025',
        quantity: 2
    },
    {
        id: 'exp4',
        name: 'Yogurt',
        expiry: '3 days',
        category: 'Canned/Packed',
        status: 'Warning',
        dayAdded: '18/05/2025',
        dayExpired: '23/05/2025',
        quantity: 4
    },
    {
        id: 'exp5',
        name: 'Salad Mix',
        expiry: '3 days',
        category: 'Fruits/Vegetables',
        status: 'Warning',
        dayAdded: '18/05/2025',
        dayExpired: '23/05/2025',
        quantity: 1
    },
];
const ExpiringHorizontalList = () => {
    return <View style={styles.expiringSection}>
        <View style={styles.expiringHeader}>
            <Text style={styles.expiringTitle}>4 Items</Text>
            <View style={styles.expiringTime}>
                <Ionicons name="time-outline" size={16} color="#8A8A8D"/>
                <Text style={styles.expiringTimeText}>1 to 3 days</Text>
            </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {expiringItems.map(item => (
                <ItemCard key={item.id} item={item}/>
            ))}
        </ScrollView>
    </View>
}

export default ExpiringHorizontalList

const styles = StyleSheet.create({
    expiringSection: {
        marginTop: 25,
    },
    expiringHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
})

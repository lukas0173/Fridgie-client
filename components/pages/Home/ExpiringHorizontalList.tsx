import React from "react";
import {Text, View, ScrollView, StyleSheet} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {ItemCard} from "@/components/pages/Home/Components.Home";

const expiringItems = [
    {id: '1', name: 'Sữa Vinamilk', expiry: 'Tomorrow'},
    {id: '2', name: 'Sữa Vinamilk', expiry: 'Tomorrow'},
    {id: '3', name: 'Sữa Vinamilk', expiry: 'Tomorrow'},
    {id: '4', name: 'Sữa Vinamilk', expiry: 'Tomorrow'},
    {id: '5', name: 'Sữa Vinamilk', expiry: '2 days'},
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {expiringItems.map(item => (
                <ItemCard key={item.id} name={item.name} expiry={item.expiry}/>
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
})
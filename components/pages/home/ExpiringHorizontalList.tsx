import React from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

import {Item} from "@/components/pages/home/types";
import ItemCard from "@/components/pages/home/ItemCard";

const ExpiringHorizontalList = ({items, activeStatusTab}: { items: Item[], activeStatusTab: any }) => {
// Don't render anything if there are no items for the selected filter
    if (items.length === 0) {
        return (
            <View style={styles.expiringSection}>
                <Text style={styles.noItemsText}>No items for this status.</Text>
            </View>
        );
    }
    // Create a dynamic title based on the number of items
    const title = `${items.length} ${items.length === 1 ? 'Item' : 'Items'}`;

    return (
        <View style={styles.expiringSection}>
            <View style={styles.expiringHeader}>
                <Text style={styles.expiringTitle}>{title}</Text>
                <View style={styles.expiringTime}>
                    <Ionicons name="time-outline" size={16} color="#8A8A8D"/>
                    <Text
                        style={styles.expiringTimeText}>{activeStatusTab === "Critical" ? "1-3 days" : activeStatusTab === "Warning" ? "3-7 days" : "Expired"}</Text>
                </View>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {items.map(item => (
                    <ItemCard key={item.id} item={item}/>
                ))}
            </ScrollView>
        </View>
    );
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
    noItemsText: {
        color: '#8A8A8D',
        textAlign: 'center',
        marginTop: 20,
    }
})

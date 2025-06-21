import React from "react";
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Item} from "@/components/pages/home/types";

// A reusable component for each item in the lists
const ItemCard = ({item}: { item: Item }) => {

    const router = useRouter();

    const handlePress = () => {
        // Navigate to the details screen, passing the item object as a parameter.
        router.push({
            pathname: "/(tabs)/(home)/ItemDetailsScreen",
            params: {item: JSON.stringify(item)},
        });
    };

    return <TouchableOpacity style={styles.itemCard} onPress={handlePress}>
        <View style={styles.itemIconBackground}>
            <Ionicons name="pint-outline" size={32} color="#8A8A8D"/>
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemExpiry}>{item.expiry}</Text>
    </TouchableOpacity>
}

export default ItemCard


const styles = StyleSheet.create({
    itemCard: {
        alignItems: 'center',
        margin: 8,
        width: 100,
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

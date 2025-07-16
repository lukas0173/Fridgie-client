import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
import {Ionicons} from "@expo/vector-icons";
import {Item} from "@/components/pages/home/types";
import * as colors from "@/constants/colors/catppuccin-palette.json"

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
            {item.image ? (
                <Image source={{uri: item.image}} style={styles.image} resizeMode="cover"/>
            ) : (
                <Ionicons name="pint-outline" size={32} color={colors.latte.colors.subtext0.hex}/>
            )}
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
        backgroundColor: colors.latte.colors.surface0.hex,
        borderRadius: 12,
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        overflow: 'hidden'
    },
    itemName: {
        color: colors.latte.colors.text.hex,
        fontWeight: '500',
        textAlign: 'center',
    },
    itemExpiry: {
        color: colors.latte.colors.subtext1.hex,
        fontSize: 12,
    },
    image: {
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    },
})

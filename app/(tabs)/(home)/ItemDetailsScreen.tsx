import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {router, Stack, useLocalSearchParams} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import {Item} from '@/components/pages/home/types';
import getStatusStyle from "@/components/utils/statusStyle";
import * as colors from "@/constants/colors/catppuccin-palette.json"

// Helper component for each row in the details list
const DetailRow = ({icon, label, value}: { icon: React.ReactNode; label: string; value: string | number }) => (
    <View style={styles.detailRow}>
        <View style={styles.detailRowIcon}>
            {icon}
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const ItemDetailsScreen = () => {
    const params = useLocalSearchParams();
    const {item: itemString} = params;

    // Ensure itemString is a string before parsing
    const item: Item | null = typeof itemString === 'string' ? JSON.parse(itemString) : null;

    const handlePress = () => {
        // Navigate to the details screen, passing the item object as a parameter.
        router.push({
            pathname: "/(tabs)/(home)/ItemDetailsEdit",
            params: params
        });
    };

    if (!item) {
        // Handle case where item is not found or invalid
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{title: "Error"}}/>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Item not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const getUsedStatusStyle = (isUsed: boolean) => {
        return { backgroundColor: isUsed ? colors.latte.colors.green.hex : colors.latte.colors.overlay2.hex };
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                {/* Conditionally render the Image or the placeholder */}
                <View style={styles.imageContainer}>
                    {item.image ? (
                        <Image source={{uri: item.image}} style={styles.image} resizeMode="cover"/>
                    ) : (
                        <Ionicons name="pint-outline" size={128} color={colors.latte.colors.subtext0.hex}/>
                    )}
                </View>
                {/* Item Name and Status */}
                <View style={styles.header}>
                    <Text style={styles.itemName}>{item.name}</Text>

                    {/* Container for the status badges */}
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                        {/* Add the new "Used" status badge */}
                        <View style={[styles.statusBadge, getUsedStatusStyle(item.used)]}>
                            <Text style={styles.statusText}>{item.used ? 'Used' : 'Unused'}</Text>
                        </View>
                    </View>
                </View>

                {/* Item Details List */}
                <View style={styles.detailsContainer}>
                    <DetailRow
                        icon={<Ionicons name="time-outline" size={24} color={colors.latte.colors.subtext0.hex}/>}
                        label="Day added"
                        value={item.dayAdded}
                    />
                    <DetailRow
                        icon={<Ionicons name="time-outline" size={24} color={colors.latte.colors.subtext0.hex}/>}
                        label="Day expired"
                        value={item.dayExpired}
                    />
                    <DetailRow
                        icon={<MaterialCommunityIcons name="package-variant-closed" size={24} color={colors.latte.colors.subtext0.hex}/>}
                        label="Category"
                        value={item.category}
                    />
                    <DetailRow
                        icon={<MaterialCommunityIcons name="counter" size={24} color={colors.latte.colors.subtext0.hex}/>}
                        label="Quantity"
                        value={item.quantity}
                    />
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <View style={{flex: 1}}>
                    <TouchableOpacity style={[styles.button, styles.editButton]} onPress={handlePress}>
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
        backgroundColor: colors.latte.colors.base.hex,
        paddingTop: 50,
    },
    mainContent: {
        marginHorizontal: 20,
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemName: {
        fontSize: 30,
        fontWeight: 'bold',
        color: colors.latte.colors.text.hex,
        flex: 1,
        marginRight: 10,
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    statusBadge: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    statusText: {
        color: colors.latte.colors.base.hex,
        fontWeight: '600',
        fontSize: 14,
    },
    detailsContainer: {},
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    detailRowIcon: {
        width: 40,
        alignItems: 'flex-start'
    },
    detailLabel: {
        fontSize: 16,
        color: colors.latte.colors.subtext0.hex,
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: colors.latte.colors.text.hex,
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 30, // More padding from bottom
        paddingTop: 10,
        gap: 15,
    },
    button: {
        paddingVertical: 10,
        borderRadius: 12,
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
        backgroundColor: colors.latte.colors.green.hex,
    },
    deleteButton: {
        backgroundColor: colors.latte.colors.red.hex,
    },
    buttonText: {
        color: colors.latte.colors.base.hex,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ItemDetailsScreen;

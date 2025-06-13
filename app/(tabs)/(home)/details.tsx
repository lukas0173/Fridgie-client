import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {Item} from '@/app/(tabs)/(home)/types';

// Helper component for detail rows
const DetailRow = ({
                       icon,
                       label,
                       value,
                   }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}) => (
    <View style={styles.detailRow}>
        <Ionicons name={icon} size={24} color="#8A8A8D" style={styles.detailIcon}/>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const ItemDetailScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Safely parse the item from params
    let item: Item | null = null;
    if (params.item && typeof params.item === 'string') {
        try {
            item = JSON.parse(params.item);
        } catch (e) {
            console.error("Failed to parse item JSON:", e);
        }
    }

    // If no item is found, you could show a loading/error state or navigate back
    if (!item) {
        // Optionally navigate back if item is not found
        if (router.canGoBack()) {
            router.back();
        }
        return <View style={styles.container}><Text>Item not found.</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Use Stack.Screen to configure the header dynamically */}
            <Stack.Screen
                options={{
                    title: item.name,
                    headerStyle: {backgroundColor: '#4CAF50'},
                    headerTintColor: '#fff',
                    headerTitleStyle: {fontWeight: 'bold'},
                }}
            />
            <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor}/>

            <View style={styles.content}>
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="pint-outline" size={120} color="#8A8A8D"/>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.detailsContainer}>
                    <DetailRow
                        icon="calendar-outline"
                        label="Day added"
                        value={item.dayAdded}
                    />
                    <DetailRow
                        icon="hourglass-outline"
                        label="Day expired"
                        value={item.dayExpired}
                    />
                    <DetailRow
                        icon="pricetag-outline"
                        label="Category"
                        value={item.category}
                    />
                    <View style={{borderBottomWidth: 0}}>
                        <DetailRow
                            icon="cube-outline"
                            label="Quantity"
                            value={String(item.quantity)}
                        />
                    </View>
                </View>

                <View style={styles.spacer}/>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.editButton]}>
                        <Text style={styles.buttonText}>Edit</Text>
                    </TouchableOpacity>
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
        backgroundColor: '#F0F2F5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    imagePlaceholder: {
        height: 200,
        width: '100%',
        backgroundColor: '#E8E8E8',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    itemName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        backgroundColor: '#4CAF50',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    statusText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    detailsContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        padding: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    detailIcon: {
        marginRight: 15,
    },
    detailLabel: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: '#1c1c1e',
        fontWeight: '600',
    },
    spacer: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    editButton: {
        backgroundColor: '#4CAF50',
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#E53935',
        marginLeft: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ItemDetailScreen;

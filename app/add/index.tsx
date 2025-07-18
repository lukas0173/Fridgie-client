import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import PocketBase from 'pocketbase';

import {Item} from "@/components/pages/home/types";
import * as colors from "@/constants/colors/catppuccin-palette.json"

const pb = new PocketBase(process.env.EXPO_PUBLIC_LOCAL_API_URL);

// Helper component for a simple input row
const InputRow = ({label, value, onChangeText, placeholder, icon, keyboardType = 'default'}: {
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    icon: React.ReactNode,
    keyboardType?: 'default' | 'numeric'
}) => (
    <View style={styles.detailRow}>
        <View style={styles.detailRowIcon}>{icon}</View>
        <Text style={styles.detailLabel}>{label}</Text>
        <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            keyboardType={keyboardType}
        />
    </View>
);

// Define a type for the local state where quantity is a string for easier input handling
type AddItemState = Omit<Item, 'quantity'> & {
    quantity: string;
};


const AddItemScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    // Default state for a new item, now fully matching the Item type
    const getInitialState = (): AddItemState => ({
        id: String(Date.now()),
        name: '',
        status: 'Neutral',
        dayAdded: new Date().toLocaleDateString('en-GB'),
        dayExpired: '', // The main field for expiry date
        expiry: '',
        category: '',
        quantity: '1',
        image: null,
        used: false
    });

    const [item, setItem] = useState<AddItemState>(getInitialState);

    // Listen for data coming back from the scanner
    useEffect(() => {
        if (params.barcodeData) {
            handleInputChange('name', `Scanned Item: ${params.barcodeData}`);
        }
    }, [params.barcodeData]);

    const handleInputChange = (field: keyof typeof item, value: string) => {
        setItem(prev => ({...prev, [field]: value}));
    };

    const handleSaveItem = async () => {
        if (!item.name || !item.dayExpired) {
            Alert.alert('Missing Information', 'Please fill in at least the item name and expiry date.');
            return;
        }

        setIsLoading(true); // Show loading indicator

        // 1. Prepare the data object that matches the PocketBase collection schema.
        const data = {
            name: item.name,
            category: item.category,
            quantity: parseInt(item.quantity, 10) || 1,
            // PocketBase can parse 'YYYY-MM-DD' strings directly into its Date format
            expiry: item.dayExpired,
            status: item.status,
            // We don't need to send an image yet.
        };

        console.log(data)

        try {
            // 2. Send the data to the 'items' collection.
            const record = await pb.collection('items').create(data);
            console.log('Successfully saved new item:', record);
            Alert.alert('Success', 'Item added to your inventory!');
            router.back(); // Go back to the previous screen

        } catch (error: any) {
            // 3. Handle any errors from the server.
            console.error('Failed to save item:', error);
            Alert.alert('Error', `Failed to save item: ${error.message}`);
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{
                headerShown: false
            }}/>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 90}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <TouchableOpacity
                        style={styles.scanButton}
                        onPress={() => router.push('/scan')}
                    >
                        <Ionicons name="barcode-outline" size={24} color={colors.latte.colors.base.hex}/>
                        <Text style={styles.scanButtonText}>Scan Barcode</Text>
                    </TouchableOpacity>

                    <View style={styles.detailsContainer}>
                        <InputRow
                            label="Name"
                            icon={<MaterialCommunityIcons name="pencil-outline" size={24} color={colors.latte.colors.subtext0.hex}/>}
                            value={item.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                            placeholder="e.g., Canned Tuna"
                        />
                        <InputRow
                            label="Category"
                            icon={<MaterialCommunityIcons name="package-variant-closed" size={24} color={colors.latte.colors.subtext0.hex}/>}
                            value={item.category}
                            onChangeText={(text) => handleInputChange('category', text)}
                            placeholder="e.g., Canned Goods"
                        />
                        <InputRow
                            label="Quantity"
                            icon={<MaterialCommunityIcons name="counter" size={24} color={colors.latte.colors.subtext0.hex}/>}
                            value={item.quantity}
                            onChangeText={(text) => handleInputChange('quantity', text)}
                            placeholder="1"
                            keyboardType="numeric"
                        />
                        <InputRow
                            label="Date Added"
                            icon={<Ionicons name="time-outline" size={24} color={colors.latte.colors.subtext0.hex}/>}
                            value={item.dayAdded}
                            onChangeText={(text) => handleInputChange('dayAdded', text)}
                            placeholder="YYYY-MM-DD"
                        />
                        <InputRow
                            label="Expiry Date"
                            icon={<Ionicons name="time-outline" size={24} color={colors.latte.colors.subtext0.hex}/>}
                            value={item.dayExpired}
                            onChangeText={(text) => handleInputChange('dayExpired', text)}
                            placeholder="YYYY-MM-DD"
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleSaveItem} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color={colors.latte.colors.base.hex}/>
                            ) : (
                                <Text style={styles.buttonText}>Add Item</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.latte.colors.base.hex,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollContainer: {
        padding: 20,
    },
    scanButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.latte.colors.text.hex,
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 24,
    },
    scanButtonText: {
        color: colors.latte.colors.base.hex,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    detailsContainer: {
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    detailRowIcon: {
        width: 40,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 16,
        color: colors.latte.colors.subtext0.hex,
        width: 110,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: colors.latte.colors.text.hex,
        textAlign: 'right',
    },
    buttonContainer: {
        marginTop: 'auto',
        paddingTop: 20,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.latte.colors.green.hex,
        elevation: 4,
    },
    buttonText: {
        color: colors.latte.colors.base.hex,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddItemScreen;

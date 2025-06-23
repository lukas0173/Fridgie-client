import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PocketBase from 'pocketbase';

// Initialize PocketBase
const pb = new PocketBase('http://192.168.25.89:8090');

const AddScannedItemScreen = () => {
    const router = useRouter();
    // Get the parameters passed from the notification handler in _layout.tsx
    const { imageRecordId, imageUrl } = useLocalSearchParams<{ imageRecordId: string, imageUrl: string }>();

    // State for the form fields
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('1');
    const [expiry, setExpiry] = useState(''); // Expected format: YYYY-MM-DD
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the submission of the new item to PocketBase.
     */
    const handleAddItem = async () => {
        // Basic validation
        if (!name || !category || !expiry || !imageRecordId) {
            Alert.alert('Missing Information', 'Please fill in all the fields.');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(expiry)) {
            Alert.alert('Invalid Date', 'Please use the YYYY-MM-DD format for the expiry date.');
            return;
        }

        setIsLoading(true);

        try {
            // Data to be saved in the 'items' collection
            const data = {
                "name": name,
                "category": category,
                "quantity": parseInt(quantity, 10) || 1,
                "expiry": new Date(expiry).toISOString(),
                "image": imageRecordId, // This creates the relation to the scanned image
                "used": false,
            };

            await pb.collection('items').create(data);

            Alert.alert('Success!', 'Item added to your inventory.');
            router.back(); // Go back to the home screen

        } catch (error: any) {
            console.error("Error adding item:", error.originalError || error);
            Alert.alert('Error', 'Failed to add the item. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.header}>Complete Your Item</Text>
                <Text style={styles.subHeader}>Fill in the details for the item you just scanned.</Text>

                {/* Display the scanned image */}
                {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Item Name (e.g., 'Tomato Soup')"
                    value={name}
                    onChangeText={setName}
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Category (e.g., 'Canned Goods')"
                    value={category}
                    onChangeText={setCategory}
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Quantity"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Expiry Date (YYYY-MM-DD)"
                    value={expiry}
                    onChangeText={setExpiry}
                    placeholderTextColor="#999"
                />

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleAddItem}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Add to Inventory</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    scrollContainer: {
        padding: 20,
        paddingTop: 0,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subHeader: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    image: {
        width: '100%',
        height: 250,
        borderRadius: 12,
        marginBottom: 24,
        backgroundColor: '#E8E8E8',
    },
    input: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#333'
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#A5D6A7',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddScannedItemScreen;

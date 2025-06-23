import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import PocketBase from 'pocketbase';
import {MaterialCommunityIcons} from "@expo/vector-icons";

// Initialize PocketBase
const pb = new PocketBase('http://192.168.25.89:8090');

// Determines the item status based on the expiry date string (YYYY-MM-DD)
const getItemStatus = (expiryDateString: string): 'Neutral' | 'Critical' | 'Warning' | 'Outdated' => {
    const now = new Date();
    const expiryDate = new Date(expiryDateString);

    // Reset time part for accurate day difference calculation
    now.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return 'Outdated';
    }
    if (diffDays <= 2) {
        return 'Critical';
    }
    if (diffDays <= 7) {
        return 'Warning';
    }
    return 'Neutral';
};


const AddScannedItemScreen = () => {
    const router = useRouter();
    // We only need the imageRecordId. The incoming imageUrl can be unreliable.
    const {imageRecordId} = useLocalSearchParams<{ imageRecordId: string }>();

    // State for the form fields, grouped into an object
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '1',
        expiry: '', // YYYY-MM-DD
    });
    const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    // Fetch image URL when the component mounts using the imageRecordId
    useEffect(() => {
        if (!imageRecordId) {
            Alert.alert("Error", "No image record ID was provided.");
            setIsImageLoading(false);
            return;
        }

        const fetchImageData = async () => {
            setIsImageLoading(true);
            try {
                // Fetch the record from the 'item_images' collection
                const record = await pb.collection('item_images').getOne(imageRecordId);
                // Construct the valid file URL from the fetched record
                const url = pb.getFileUrl(record, record.image);
                setDisplayImageUrl(url);
            } catch (error) {
                console.error("Failed to fetch image data:", error);
                Alert.alert("Error", "Could not load the scanned image. Please try again.");
            } finally {
                setIsImageLoading(false);
            }
        };

        fetchImageData();
    }, [imageRecordId]);

    // Handle updates to form fields
    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    /**
     * Handles the submission of the new item to PocketBase.
     */
    const handleAddItem = async () => {
        // Basic validation
        if (!formData.name || !formData.category || !formData.expiry || !imageRecordId) {
            Alert.alert('Missing Information', 'Please fill in all the fields.');
            return;
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.expiry)) {
            Alert.alert('Invalid Date', 'Please use the YYYY-MM-DD format for the expiry date.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Calculate status based on expiry date
            const status = getItemStatus(formData.expiry);

            // Data to be saved in the 'items' collection
            const data = {
                "name": formData.name,
                "category": formData.category,
                "quantity": parseInt(formData.quantity, 10) || 1,
                "expiry": new Date(formData.expiry).toISOString(),
                "image": imageRecordId, // This creates the relation to the scanned image
                "used": false,
                "status": status, // Add the calculated status
            };

            await pb.collection('items').create(data);

            Alert.alert('Success!', 'Item added to your inventory.');
            router.push('/'); // Navigate to the home screen

        } catch (error: any) {
            console.error("Error adding item:", error.originalError || error);
            Alert.alert('Error', 'Failed to add the item. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{headerShown: false}}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
                keyboardVerticalOffset={Platform.OS === "android" ? 90 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.contentWrapper}>
                        {/* Header Text */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Complete Your Item</Text>
                            <Text style={styles.headerSubtitle}>Fill in the details for the item you just scanned.</Text>
                        </View>

                        {/* Image Container */}
                        <View style={styles.imageContainer}>
                            {isImageLoading ? (
                                <ActivityIndicator size="large" color="#8A8A8D"/>
                            ) : displayImageUrl ? (
                                <Image
                                    source={{uri: displayImageUrl}}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                    onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
                                />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <MaterialCommunityIcons name="image-off" size={60} color="#8A8A8D"/>
                                    <Text style={styles.imagePlaceholderText}>Image not available</Text>
                                </View>
                            )}
                        </View>

                        {/* Form Inputs */}
                        <View style={styles.detailsContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Item Name (e.g., 'Tomato Soup')"
                                value={formData.name}
                                onChangeText={(val) => handleInputChange('name', val)}
                                placeholderTextColor="#999"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Category (e.g., 'Canned Goods')"
                                value={formData.category}
                                onChangeText={(val) => handleInputChange('category', val)}
                                placeholderTextColor="#999"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Quantity"
                                value={formData.quantity}
                                onChangeText={(val) => handleInputChange('quantity', val)}
                                keyboardType="numeric"
                                placeholderTextColor="#999"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Expiry Date (YYYY-MM-DD)"
                                value={formData.expiry}
                                onChangeText={(val) => handleInputChange('expiry', val)}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* Submit Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, isSubmitting && styles.buttonDisabled]}
                            onPress={handleAddItem}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF"/>
                            ) : (
                                <Text style={styles.buttonText}>Add to Inventory</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

// Styles adapted from ItemDetailsEdit.tsx for consistency
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 40 : 20,
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: '#E8E8E8',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        overflow: 'hidden', // Ensures the image respects the border radius
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: '#8A8A8D',
        fontSize: 16,
    },
    detailsContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 12,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        color: '#333'
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40, // Ensures space from the bottom of the screen
        paddingTop: 10,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        elevation: 4, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
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

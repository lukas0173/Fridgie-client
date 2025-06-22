import React, {useEffect, useRef, useState} from 'react';
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
    View
} from 'react-native';
import {Stack, useLocalSearchParams, useRouter} from 'expo-router';
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PocketBase from 'pocketbase';

import {Item} from "@/components/pages/home/types";

const pb = new PocketBase('http://192.168.110.89:8090');

// A component for handling editable fields, designed to be visually clean
const EditableField = ({label, value, icon, onSave, keyboardType = 'default', placeholder}: {
    label: string,
    value: string | number,
    icon: React.ReactNode,
    onSave: (newValue: string | number) => void,
    keyboardType?: 'default' | 'numeric',
    placeholder?: string,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(String(value));
    const textInputRef = useRef<TextInput>(null);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setTimeout(() => textInputRef.current?.focus(), 50);
        } else {
            onSave(currentValue);
        }
    };

    const handleBlur = () => {
        setIsEditing(false);
        onSave(currentValue);
    };

    return (
        <View style={styles.detailRow}>
            <View style={styles.detailRowIcon}>{icon}</View>
            <Text style={styles.detailLabel}>{label}</Text>
            {isEditing ? (
                <TextInput
                    ref={textInputRef}
                    style={styles.textInput}
                    value={currentValue}
                    onChangeText={setCurrentValue}
                    editable={true}
                    keyboardType={keyboardType}
                    onBlur={handleBlur}
                    returnKeyType="done"
                    placeholder={placeholder} // Pass placeholder to TextInput
                />
            ) : (
                <Text style={styles.detailValue}>{currentValue}</Text>
            )}
            <TouchableOpacity onPress={handleEditToggle} style={styles.editIcon}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color="#8A8A8D"/>
            </TouchableOpacity>
        </View>
    );
};

const EditItemScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const {item: itemString} = params;

    const initialItem: Item | null = typeof itemString === 'string' ? JSON.parse(itemString) : null;

    const [originalItem, setOriginalItem] = useState<Item | null>(initialItem);
    const [item, setItem] = useState<Item | null>(initialItem);
    const [newImageUri, setNewImageUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imageRelationId, setImageRelationId] = useState<string | null>(initialItem?.image || null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    // Fetch the raw item record on mount to get the correct relation ID,
    // because the params only contain the full image URL.
    useEffect(() => {
        const fetchItemRecord = async () => {
            if (initialItem?.id) {
                try {
                    const record = await pb.collection('items').getOne(initialItem.id);
                    // Store the actual ID from the 'image' relation field
                    setImageRelationId(record.image || null);
                } catch (e) {
                    console.error("Failed to fetch initial item record:", e);
                }
            }
        };
        fetchItemRecord();
    }, [initialItem?.id]);

    if (!item || !originalItem) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{title: "Error"}}/>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Item not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isModified = JSON.stringify(originalItem) !== JSON.stringify(item) || newImageUri !== null;

    // --- Image Picker Logic ---
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "You need to allow access to your photos to upload an image.");
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!pickerResult.canceled) {
            setNewImageUri(pickerResult.assets[0].uri);
        }
    };

// --- Field Update Logic ---
    const handleFieldSave = (field: keyof Item, value: string | number) => {
        setItem(prevItem => {
            if (!prevItem) return null;
            if (field === 'quantity') {
                const numValue = Number(value);
                return {...prevItem, [field]: isNaN(numValue) ? 0 : numValue};
            }
            // For simplicity, we just update the string.
            // Proper date validation should be more robust.
            return {...prevItem, [field]: value};
        });
    };

    // --- Save to Server Logic ---
    const handleSaveChanges = async () => {
        if (!item) return;
        setIsLoading(true);
        // Use the ID from state, which is the correct raw ID.
        let updatedImageRelationId = imageRelationId;

        try {
            // Step 1: If a new image was picked, upload it to 'item_images' collection.
            if (newImageUri) {
                const formData = new FormData();
                formData.append('image', {
                    uri: newImageUri,
                    name: `upload_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                } as any);
                formData.append('device_id', 'MANUAL-EDIT');

                const createdImageRecord = await pb.collection('item_images').create(formData);
                updatedImageRelationId = createdImageRecord.id;
            }

            // Step 2: Prepare the data to update the main 'items' record.
            const dataToUpdate = {
                "name": item.name,
                "category": item.category,
                "quantity": item.quantity,
                "expiry": item.dayExpired, // Use YYYY-MM-DD format for expiry
                // FIX: Assign the correct ID to the relation field.
                "image": updatedImageRelationId,
            };

            // Step 3: Update the 'items' record using its ID.
            await pb.collection('items').update(item.id, dataToUpdate);

            Alert.alert('Success', 'Item updated successfully!');
            router.back(); // Go back to the previous screen

        } catch (error: any) {
            console.error("Error saving changes:", error.originalError || error);
            Alert.alert('Error', `Failed to save changes: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Determine which image to show: new, existing, or none.
    const imageSource = newImageUri ? {uri: newImageUri} : (item.image ? {uri: item.image} : null);

    const getStatusStyle = (status: Item['status']) => {
        switch (status) {
            case 'Critical':
                return {backgroundColor: '#E53935'};
            case 'Warning':
                return {backgroundColor: '#FFA726'};
            case 'Neutral':
                return {backgroundColor: '#4CAF50'};
            case 'Outdated':
                return {backgroundColor: '#757575'};
            default:
                return {backgroundColor: '#4CAF50'};
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{headerShown: false}}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === "android" ? "height" : "padding"}
                style={styles.keyboardAvoidingContainer}
                keyboardVerticalOffset={Platform.OS === "android" ? 90 : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.contentWrapper}>

                        <View style={styles.imageContainer}>
                            {imageSource && (
                                <Image
                                    source={imageSource}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                    onLoadStart={() => setIsImageLoading(true)} // FIX: Add loading indicator
                                    onLoadEnd={() => setIsImageLoading(false)}
                                    onError={(e) => console.log('Image Load Error:', e.nativeEvent.error)}
                                />)}
                            <TouchableOpacity style={styles.imageOverlay} onPress={handlePickImage}>
                                {imageSource ? (
                                    <View style={[styles.addImageButton, styles.editImageButton]}>
                                        <MaterialCommunityIcons name="pencil" size={32} color="#FFFFFF"/>
                                    </View>
                                ) : (
                                    <View style={styles.addImageButton}>
                                        <Ionicons name="add" size={48} color="#FFFFFF"/>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View> {/* Item Name and Status Header */}
                        <View style={styles.header}>
                            <TextInput
                                style={styles.itemNameInput}
                                value={item.name}
                                onChangeText={(text) => handleFieldSave('name', text)}
                                placeholder="Item Name"
                            />
                            <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </View>

                        {/* Details section */}
                        <View style={styles.detailsContainer}>
                            <EditableField
                                label="Day expired"
                                value={item.dayExpired}
                                icon={<Ionicons name="time-outline" size={24} color="#8A8A8D"/>}
                                onSave={(newValue) => handleFieldSave('dayExpired', String(newValue))}
                                placeholder="YYYY-MM-DD"
                            />
                            <EditableField
                                label="Category"
                                value={item.category}
                                icon={<MaterialCommunityIcons name="package-variant-closed" size={24} color="#8A8A8D"/>}
                                onSave={(newValue) => handleFieldSave('category', String(newValue))}
                            />
                            <EditableField
                                label="Quantity"
                                value={item.quantity}
                                icon={<MaterialCommunityIcons name="counter" size={24} color="#8A8A8D"/>}
                                onSave={(newValue) => handleFieldSave('quantity', newValue)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {isModified && (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={handleSaveChanges} disabled={isLoading}>
                                {isLoading ? (
                                    <ActivityIndicator color="#FFFFFF"/>
                                ) : (
                                    <Text style={styles.buttonText}>Save Changes</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
        paddingTop: Platform.OS === 'android' ? 25 : 50,
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    contentWrapper: {
        paddingHorizontal: 20,
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: '#E8E8E8',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 24,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    addImageButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    itemNameInput: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderRadius: 10,
    },
    statusText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    // This container no longer has a card style
    detailsContainer: {
        marginBottom: 20, // Space between fields and button
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5, // Consistent padding for each row
    },
    detailRowIcon: {
        width: 40,
        alignItems: 'flex-start',
        marginRight: 5,
    },
    detailLabel: {
        fontSize: 16,
        color: '#8A8A8D',
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textAlign: 'right',
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textAlign: 'right',
        paddingVertical: 0, // Remove extra padding for better alignment
    },
    editIcon: {
        padding: 5,
        marginLeft: 10,
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageOverlay: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editImageButton: {
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
});

export default EditItemScreen;

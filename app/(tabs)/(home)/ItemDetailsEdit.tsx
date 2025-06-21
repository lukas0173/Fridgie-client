import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Assuming 'Item' type is defined in a shared types file
export interface Item {
    id: string;
    name: string;
    status: 'Critical' | 'Warning' | 'Neutral' | 'Outdated';
    dayAdded: string;
    dayExpired: string;
    category: string;
    quantity: number;
}

// A component for handling editable fields, designed to be visually clean
const EditableField = ({ label, value, icon, onSave, keyboardType = 'default' }: { label: string, value: string | number, icon: React.ReactNode, onSave: (newValue: string | number) => void, keyboardType?: 'default' | 'numeric' }) => {
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
                />
            ) : (
                <Text style={styles.detailValue}>{currentValue}</Text>
            )}
            <TouchableOpacity onPress={handleEditToggle} style={styles.editIcon}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color="#8A8A8D" />
            </TouchableOpacity>
        </View>
    );
};


const EditItemScreen = () => {
    const params = useLocalSearchParams();
    const { item: itemString } = params;

    const initialItem: Item | null = typeof itemString === 'string' ? JSON.parse(itemString) : null;

    const [originalItem, setOriginalItem] = useState<Item | null>(initialItem);
    const [item, setItem] = useState<Item | null>(initialItem);

    if (!item || !originalItem) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{ title: "Error" }} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Item not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const isModified = JSON.stringify(originalItem) !== JSON.stringify(item);

    const handleFieldSave = (field: keyof Item, value: string | number) => {
        setItem(prevItem => {
            if (!prevItem) return null;
            if (field === 'quantity') {
                const numValue = Number(value);
                return { ...prevItem, [field]: isNaN(numValue) ? 0 : numValue };
            }
            return { ...prevItem, [field]: value };
        });
    };

    const handleSaveChanges = () => {
        console.log('Saving all changes:', item);
        setOriginalItem(item); // Update the original state
    };

    const getStatusStyle = (status: Item['status']) => {
        switch (status) {
            case 'Critical': return { backgroundColor: '#E53935' };
            case 'Warning': return { backgroundColor: '#FFA726' };
            case 'Neutral': return { backgroundColor: '#4CAF50' };
            case 'Outdated': return { backgroundColor: '#757575' };
            default: return { backgroundColor: '#4CAF50' };
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingContainer}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.contentWrapper}>
                        {/* Image Placeholder */}
                        <View style={styles.imageContainer}>
                            <TouchableOpacity style={styles.addImageButton}>
                                <Ionicons name="add" size={48} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Item Name and Status Header */}
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

                        {/* Details section with original flat styling */}
                        <View style={styles.detailsContainer}>
                            <EditableField
                                label="Day added"
                                value={item.dayAdded}
                                icon={<Ionicons name="time-outline" size={24} color="#8A8A8D" />}
                                onSave={(newValue) => handleFieldSave('dayAdded', newValue)}
                            />
                            <EditableField
                                label="Day expired"
                                value={item.dayExpired}
                                icon={<Ionicons name="time-outline" size={24} color="#8A8A8D" />}
                                onSave={(newValue) => handleFieldSave('dayExpired', newValue)}
                            />
                            <EditableField
                                label="Category"
                                value={item.category}
                                icon={<MaterialCommunityIcons name="package-variant-closed" size={24} color="#8A8A8D" />}
                                onSave={(newValue) => handleFieldSave('category', newValue)}
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
                            <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
                                <Text style={styles.buttonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
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
});

export default EditItemScreen;

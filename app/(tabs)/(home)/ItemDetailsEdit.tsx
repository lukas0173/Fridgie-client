import React, {useState} from 'react';
import {
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

export interface Item {
    id: string;
    name: string;
    status: 'Critical' | 'Warning' | 'Neutral' | 'Outdated';
    dayAdded: string;
    dayExpired: string;
    category: string;
    quantity: number;
}

// Helper component for each editable row
const EditableRow = ({icon, label, value, onEditPress, isEditable = true}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    onEditPress?: () => void;
    isEditable?: boolean
}) => (
    <View style={styles.detailRow}>
        <View style={styles.detailRowIcon}>
            {icon}
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
        {isEditable && (
            <TouchableOpacity onPress={onEditPress} style={styles.editIcon}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color="#8A8A8D"/>
            </TouchableOpacity>
        )}
    </View>
);


const ItemDetailsEdit = () => {
    const params = useLocalSearchParams();
    const router = useRouter();
    const {item: itemString} = params;

    // Parse the item from navigation params
    const initialItem: Item | null = typeof itemString === 'string' ? JSON.parse(itemString) : null;

    // State for holding the edited item data
    const [item, setItem] = useState<Item | null>(initialItem);


    if (!item) {
        return (
            <SafeAreaView style={styles.container}>
                <Stack.Screen options={{title: "Error"}}/>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text>Item not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Handlers for updating item state
    const handleValueChange = (field: keyof Item, value: string | number) => {
        setItem(prevItem => {
            if (!prevItem) return null;
            return {...prevItem, [field]: value};
        });
    };

    const handleSave = () => {
        console.log('Saving item:', item);
        // Here you would typically call an API or update your global state
        // After saving, you might want to navigate back
        if (router.canGoBack()) {
            router.back();
        }
    };

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
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{flex: 1}}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* Image Placeholder with an add icon */}
                    <View style={styles.imageContainer}>
                        <TouchableOpacity style={styles.addImageButton}>
                            <Ionicons name="add" size={48} color="#FFFFFF"/>
                        </TouchableOpacity>
                    </View>

                    {/* Item Name and Status */}
                    <View style={styles.header}>
                        <TextInput
                            style={styles.itemNameInput}
                            value={item.name}
                            onChangeText={(text) => handleValueChange('name', text)}
                            placeholder="Item Name"
                        />
                        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                            <Text style={styles.statusText}>{item.status}</Text>
                        </View>
                    </View>

                    {/* Editable Item Details */}
                    <View style={styles.detailsContainer}>
                        <EditableRow
                            icon={<Ionicons name="time-outline" size={24} color="#8A8A8D"/>}
                            label="Day added"
                            value={item.dayAdded}
                            onEditPress={() => console.log("Edit Day Added")} // Placeholder for date picker
                        />
                        <EditableRow
                            icon={<Ionicons name="time-outline" size={24} color="#8A8A8D"/>}
                            label="Day expired"
                            value={item.dayExpired}
                            onEditPress={() => console.log("Edit Day Expired")} // Placeholder for date picker
                        />
                        <EditableRow
                            icon={<MaterialCommunityIcons name="package-variant-closed" size={24} color="#8A8A8D"/>}
                            label="Category"
                            value={item.category}
                            onEditPress={() => console.log("Edit Category")} // Placeholder for category picker
                        />
                        {/* Special row for quantity to allow direct input */}
                        <View style={styles.detailRow}>
                            <View style={styles.detailRowIcon}>
                                <MaterialCommunityIcons name="counter" size={24} color="#8A8A8D"/>
                            </View>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            <TextInput
                                style={styles.quantityInput}
                                value={String(item.quantity)}
                                onChangeText={(text) => handleValueChange('quantity', Number(text))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Save Button */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Styles are adapted from your details.tsx and the provided image
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
        paddingTop: 50,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    imageContainer: {
        width: "100%",
        aspectRatio: 1.5, // Made it a bit wider to match the reference image
        backgroundColor: '#E8E8E8',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    addImageButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#4CAF50', // Green color from your save button
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    itemNameInput: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#BDBDBD',
        paddingBottom: 5,
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
    detailsContainer: {
        paddingBottom: 20, // Add padding to avoid button overlap
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15, // Increased padding for better touch targets
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    detailRowIcon: {
        width: 40,
        alignItems: 'flex-start'
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
        marginRight: 10,
    },
    editIcon: {
        padding: 5,
    },
    quantityInput: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        borderBottomWidth: 1,
        borderBottomColor: '#BDBDBD',
        minWidth: 50,
        textAlign: 'right',
    },
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#F0F2F5', // Match background color
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    button: {
        paddingVertical: 15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ItemDetailsEdit;

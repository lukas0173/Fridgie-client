import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
// This component uses icons from 'react-native-vector-icons'.
// Please make sure you have installed and linked this library in your project.
// You can install it by running:
// npm install react-native-vector-icons
// npx react-native-asset
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// This is a helper component to render each row in the details list.
// It helps keep the main component cleaner and avoids repetitive code.
const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
        <Icon name={icon} size={24} color="#8A8A8D" style={styles.detailIcon} />
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

/**
 * ItemDetailScreen Component
 *
 * This screen displays the detailed information about a single inventory item.
 * It expects to receive an `item` object through navigation params,
 * though it uses mock data for demonstration if no item is passed.
 */
const ItemDetailScreen = ({ route, navigation }) => {
    // Use the item passed through navigation, or fall back to mock data for display purposes.
    // In your app, you would navigate to this screen like this:
    // navigation.navigate('ItemDetail', { item: yourItemObject });
    const mockItem = {
        name: 'Sữa Vinamilk',
        status: 'Neutral',
        dayAdded: '10/05/2025',
        dayExpired: '21/05/2025',
        category: 'Canned food',
        quantity: 1,
        image: null, // You can pass an image URI here
    };

    const item = route?.params?.item || mockItem;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f2f2f7" />
            <View style={styles.content}>
                {/* Image Placeholder Section */}
                <View style={styles.imagePlaceholder}>
                    {/* You can replace this with an <Image> component if an item image URI exists */}
                    <Icon name="bottle-soda-classic-outline" size={120} color="#8A8A8D" />
                </View>

                {/* Item Title and Status Section */}
                <View style={styles.titleContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>

                {/* Item Details Section */}
                <View style={styles.detailsContainer}>
                    <DetailRow
                        icon="calendar-plus"
                        label="Day added"
                        value={item.dayAdded}
                    />
                    <DetailRow
                        icon="calendar-clock"
                        label="Day expired"
                        value={item.dayExpired}
                    />
                    <DetailRow
                        icon="shape-outline"
                        label="Category"
                        value={item.category}
                    />
                    <DetailRow
                        icon="counter"
                        label="Quantity"
                        value={String(item.quantity)}
                    />
                </View>

                {/* Spacer to push buttons to the bottom */}
                <View style={styles.spacer} />

                {/* Action Buttons Section */}
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
        backgroundColor: '#f2f2f7', // A light grey background color similar to the design
    },
    content: {
        flex: 1,
        padding: 20,
    },
    imagePlaceholder: {
        height: 200,
        width: '100%',
        backgroundColor: '#e8e8ed',
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
        color: '#1c1c1e',
        flex: 1, // Allows text to wrap if it's too long
        marginRight: 10,
    },
    statusBadge: {
        backgroundColor: '#4CAF50', // A pleasant green
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 15,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    detailsContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        // Add a border to all but the last item
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8ed',
    },
    // Use pseudo-classes in a more advanced setup or manually remove border on the last child.
    // For simplicity, you can wrap DetailRow and check for the last index to not apply the border.
    detailIcon: {
        marginRight: 15,
    },
    detailLabel: {
        fontSize: 16,
        color: '#3c3c43',
        flex: 1, // Pushes the value to the far right
    },
    detailValue: {
        fontSize: 16,
        color: '#1c1c1e',
        fontWeight: '600',
    },
    spacer: {
        flex: 1, // This will grow to push the buttons to the bottom
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20, // Add some space above the buttons
    },
    button: {
        flex: 1, // Each button takes up half the space
        paddingVertical: 18,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        marginRight: 10, // Space between buttons
    },
    deleteButton: {
        backgroundColor: '#F44336', // A standard red for delete actions
        marginLeft: 10, // Space between buttons
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ItemDetailScreen;

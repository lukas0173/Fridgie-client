import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

// Reusable component for section headers
const SectionHeader = ({ title }: { title: string }) => (
    <Text style={styles.sectionHeaderText}>{title}</Text>
);

// Reusable component for each setting row
const SettingsRow = ({ icon, title, subtitle, onPress }: { icon: React.ReactNode, title: string, subtitle?: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.row} onPress={onPress}>
        <View style={styles.rowIconContainer}>
            {icon}
        </View>
        <View style={styles.rowTextContainer}>
            <Text style={styles.rowTitle}>{title}</Text>
            {subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
        </View>
        <Feather name="chevron-right" size={24} color="#BDBDBD" />
    </TouchableOpacity>
);

const SettingsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: 'https://placehold.co/100x100/E8E8E8/BDBDBD?text=User' }}
                        style={styles.avatar}
                    />
                    <Text style={styles.profileName}>Tuan Kiet</Text>
                    <Text style={styles.profileEmail}>vuwin24680@gmail.com</Text>
                </View>

                {/* Settings List */}
                <View style={styles.settingsListContainer}>
                    {/* Language Setting */}
                    <SettingsRow
                        icon={<Ionicons name="language-outline" size={24} color="#555" />}
                        title="Language"
                        subtitle="English"
                        onPress={() => { /* Handle press */ }}
                    />

                    {/* User Settings */}
                    <SectionHeader title="User" />
                    <SettingsRow
                        icon={<Feather name="edit-2" size={24} color="#555" />}
                        title="Username & Email"
                        subtitle="Tuan Kiet - vuwin24680@gmail.com"
                        onPress={() => { /* Handle press */ }}
                    />
                    <SettingsRow
                        icon={<Ionicons name="person-circle-outline" size={24} color="#555" />}
                        title="Profile Picture"
                        onPress={() => { /* Handle press */ }}
                    />

                    {/* Notification Settings */}
                    <SectionHeader title="Notification" />
                    <SettingsRow
                        icon={<Ionicons name="notifications-outline" size={24} color="#555" />}
                        title="Customization"
                        onPress={() => { /* Handle press */ }}
                    />
                </View>

                {/* Log Out Button */}
                <TouchableOpacity style={styles.logoutButton}>
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    profileSection: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileEmail: {
        fontSize: 16,
        color: '#8A8A8D',
        marginTop: 4,
    },
    settingsListContainer: {
        width: '100%',
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8A8A8D',
        marginTop: 25,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    rowIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    rowTextContainer: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    rowSubtitle: {
        fontSize: 12,
        color: '#8A8A8D',
        marginTop: 2,
    },
    logoutButton: {
        backgroundColor: '#E53935',
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 30,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default SettingsScreen;

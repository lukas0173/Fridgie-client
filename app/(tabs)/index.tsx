import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {Feather, Ionicons} from '@expo/vector-icons'; // Using Expo for icons
import ExpirationStatusBar from "@/components/pages/Home/ExpirationStatusBar";
import ExpiringHorizontalList from "@/components/pages/Home/ExpiringHorizontalList";
import InventoryList from "@/components/pages/Home/InventoryList";

// The main Home Screen Component
const HomeScreen = () => {
    const [activeStatusTab, setActiveStatusTab] = useState('Critical');
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* --- HEADER --- */}
                <View style={styles.header}>
                    <Text style={styles.headerDate}>May 20</Text>
                    <TouchableOpacity>
                        <Feather name="search" size={24} color="#333"/>
                    </TouchableOpacity>
                </View>

                {/* --- EXPIRATION STATUS TABS --- */}
                <ExpirationStatusBar activeStatusTab={activeStatusTab} setActiveStatusTab={setActiveStatusTab}/>

                {/* --- EXPIRING ITEMS HORIZONTAL LIST --- */}
                <ExpiringHorizontalList/>

                {/* --- INVENTORY SECTION --- */}
                <InventoryList/>
            </ScrollView>

            {/* --- BOTTOM NAVIGATION --- */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="home" size={26} color="#4CAF50"/>
                    <Text style={styles.navTextActive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.addButton}>
                    <Feather name="plus" size={32} color="#FFF"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                    <Ionicons name="settings-outline" size={26} color="#8A8A8D"/>
                    <Text style={styles.navText}>Settings</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// --- STYLES ---
const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        backgroundColor: '#F0F2F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerDate: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#333',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingTop: 10,
    },
    navButton: {
        alignItems: 'center',
    },
    navText: {
        fontSize: 12,
        color: '#8A8A8D',
    },
    navTextActive: {
        fontSize: 12,
        color: '#4CAF50',
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 25,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default HomeScreen;

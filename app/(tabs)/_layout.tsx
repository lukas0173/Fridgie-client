import {router, Tabs} from 'expo-router';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Feather, Ionicons} from "@expo/vector-icons";

import {IconSymbol} from '@/components/ui/IconSymbol';

// --- Custom Tab Bar Component ---
const CustomTabBar = ({state, descriptors, navigation}: any) => {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route: any, index: any) => {
                const {options} = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                // This renders the (home) and Settings icons.
                // We'll render the add button separately.
                if (index === 0 || index === 1) {
                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? {selected: true} : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={
                                index === 0 ? {
                                    paddingRight: 20,
                                    ...styles.navButton
                                } : {
                                    paddingLeft: 20,
                                    ...styles.navButton
                                }
                            }
                        >
                            <Ionicons
                                name={label === 'home' ? (isFocused ? 'home' : 'home-outline') : (isFocused ? 'settings' : 'settings-outline')}
                                size={26}
                                color={isFocused ? '#4CAF50' : '#8A8A8D'}
                            />
                            <Text style={{color: isFocused ? '#4CAF50' : '#8A8A8D', fontSize: 12}}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                }

                return null;
            })}
            {/* --- Floating Add Button --- */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    router.push("/scan")
                }}
            >
                <Feather name="plus" size={32} color="#FFF"/>
            </TouchableOpacity>
        </View>
    );
}

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props}/>}
            screenOptions={{
                headerShown: false,
            }}>
            <Tabs.Screen
                name="(home)"
                options={{
                    title: "home",
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="house.fill" color={color}/>,
                }}
            />
            <Tabs.Screen
                name="settings/index"
                options={{
                    title: 'settings',
                    tabBarIcon: ({color}) => <IconSymbol size={28} name="paperplane.fill" color={color}/>,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 75,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingTop: 10,
    },
    navButton: {
        flex: 1,
        alignItems: 'center',
    },
    addButton: {
        position: 'absolute',
        alignSelf: 'center',
        top: -30, // Elevates the button
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

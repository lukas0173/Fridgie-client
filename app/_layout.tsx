import React, {useEffect, useRef} from 'react';
import {Platform, StatusBar as RNStatusBar, StyleSheet, View} from "react-native";
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {useFonts} from 'expo-font';
import {Stack, useRouter} from 'expo-router';
import 'react-native-reanimated';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Determines how the app behaves when a notification is received while it's in the foreground.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false
    }),
});

// --- Helper Function to Register for Push Notifications ---
async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token! Please enable notifications in your device settings.');
            return;
        }
        // --- ACTION REQUIRED ---
        // Get your Expo Project ID from your app.json or app.config.js
        token = (await Notifications.getExpoPushTokenAsync({projectId: '20af2623-14a1-4b24-8299-0ee52e00416d'})).data;
        console.log(token)
        console.log("This get called")
    } else {
        alert('Must use physical device for Push Notifications.');
    }

    return token;
}

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    const router = useRouter();
    const responseListener = useRef<Notifications.Subscription>(null);

    useEffect(() => {
        // This function will run and log your token to the console.
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                // The token will be printed here for you to copy.
                console.log('Your Expo Push Token:', token);
            }
        });

        // 2. This listener is fired whenever a user taps on or interacts with a notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification Tapped. Response:', response);

            // --- FIX: Explicitly type the data payload ---
            // This ensures TypeScript knows that imageRecordId and imageUrl are strings.
            const data = response.notification.request.content.data as { imageRecordId: string, imageUrl: string };

            // Navigate to our new screen with the data from the notification
            if (data.imageRecordId && data.imageUrl) {
                router.push({
                    pathname: "/add/AddScannedItem",
                    params: {imageRecordId: data.imageRecordId, imageUrl: data.imageUrl},
                });
            }
        });
        // Cleanup listeners when the component unmounts
        return () => {
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
        };
    }, []);

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <View style={styles.container}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen
                        name="scan/index"
                        options={{
                            presentation: 'modal',
                            headerShown: false,
                        }}
                    />
                    {/* Add the new screen to the stack navigator */}
                    <Stack.Screen
                        name="add/AddScannedItem"
                        options={{
                            presentation: 'modal',
                            headerTitle: 'Add Scanned Item',
                        }}
                    />
                </Stack>
                <ExpoStatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Add padding top only for Android to push content below the status bar
        marginTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    }
})

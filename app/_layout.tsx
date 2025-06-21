import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Platform, StatusBar as RNStatusBar, StyleSheet, View} from "react-native";
import {StatusBar as ExpoStatusBar} from 'expo-status-bar';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        // Async font loading only occurs in development.
        return null;
    }

    return (
        <View style={styles.container}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                    <Stack.Screen
                        name="scan/index"
                        options={{
                            presentation: 'modal',
                            headerShown: false,
                        }}
                    />
                </Stack>
                <ExpoStatusBar style="auto"/>
            </ThemeProvider>
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

import {Stack} from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="ItemDetailsScreen"
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name="ItemDetailsEdit"
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );
}

import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false // The index screen already has a custom header
                }}
            />
            <Stack.Screen
                name="details"
            />
        </Stack>
    );
}

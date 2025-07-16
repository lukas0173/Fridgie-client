import {Stack} from 'expo-router';
import {InventoryContextProvider} from "@/context/InventoryContext";

export default function HomeLayout() {
    return (
        <InventoryContextProvider>
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
        </InventoryContextProvider>
    );
}

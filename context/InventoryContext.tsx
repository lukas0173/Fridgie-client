import React, {createContext, ReactNode, useCallback, useState, useEffect} from 'react';
import {Item} from '@/components/pages/home/types';
import {fetchInventoryItems} from '@/api/inventory';

// Shape of the context state
interface InventoryContextType {
    items: Item[];
    isLoading: boolean;
    error: string | null;
    fetchItems: () => Promise<void>;
}

export const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Create the Provider component
export const InventoryContextProvider = ({children}: { children: ReactNode }) => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedItems = await fetchInventoryItems();
            setItems(fetchedItems);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const contextValue = {
        items,
        isLoading,
        error,
        fetchItems,
    };

    return (
        <InventoryContext.Provider value={contextValue}>
            {children}
        </InventoryContext.Provider>
    );
};

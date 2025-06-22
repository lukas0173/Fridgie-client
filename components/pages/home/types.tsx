// Define the structure of an inventory item
export type Item = {
    id: string;
    name: string;
    expiry: string; // For now
    status: 'Neutral' | 'Critical' | 'Warning' | 'Outdated';
    dayAdded: string;
    dayExpired: string;
    category: string;
    quantity: number;
    image?: string | null;
    used: boolean;
};

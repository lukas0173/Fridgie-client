import PocketBase, { ListResult, RecordModel } from 'pocketbase';
import { Item } from '@/components/pages/home/types';
import { calculateDaysUntilExpiry } from '@/components/utils/date';

// Initialize PocketBase
const pb = new PocketBase(process.env.EXPO_PUBLIC_LOCAL_API_URL);

// Helper function to determine expiry status and text
const getExpiryInfo = (expiryDateString: string): { daysLeft: number, text: string } => {
    const diffTime = calculateDaysUntilExpiry(expiryDateString);

    if (diffTime < 0) return { daysLeft: diffTime, text: 'Expired' };
    if (diffTime === 0) return { daysLeft: 0, text: 'Today' };
    if (diffTime === 1) return { daysLeft: 1, text: 'Tomorrow' };
    return { daysLeft: diffTime, text: `${diffTime} days` };
};

/**
 * Fetches and formats inventory items from PocketBase.
 * @returns A promise that resolves to an array of formatted items.
 * @throws Will throw an error if the API call fails.
 */
export const fetchInventoryItems = async (): Promise<Item[]> => {
    try {
        const records: ListResult<RecordModel> = await pb.collection('items').getList(1, 50, {
            sort: '-created',
            expand: 'image',
        });

        return records.items.map((record: any): Item => {
            const {daysLeft, text} = getExpiryInfo(record.expiry);

            let status: Item['status'] = 'Neutral';
            if (daysLeft < 0) status = 'Outdated';
            else if (daysLeft <= 2) status = 'Critical';
            else if (daysLeft <= 7) status = 'Warning';

            let imageUrl = null;
            if (record.expand && record.expand.image) {
                const imageRecord = record.expand.image;
                imageUrl = pb.getFileUrl(imageRecord, imageRecord.image);
            }

            return {
                id: record.id,
                name: record.name,
                category: record.category,
                quantity: record.quantity,
                status: status,
                dayAdded: new Date(record.created).toLocaleDateString('en-GB'),
                dayExpired: new Date(record.expiry).toLocaleDateString('en-GB'),
                expiry: text,
                image: imageUrl,
                used: record.used,
            };
        });
    }
    catch (e: any) {
        console.error("[Inventory] API Error in fetchInventoryItems: ", e)
        throw new Error("Failed to fetch items. Please check your connection and try again.");    }
};

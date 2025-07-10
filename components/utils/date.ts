export const calculateDaysUntilExpiry = (expiryDateString: string): number => {
    const now = new Date();
    const expiryDate = new Date(expiryDateString);

    // Reset time part for accurate day difference calculation
    now.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

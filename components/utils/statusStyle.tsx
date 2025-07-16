import {Item} from "@/components/pages/home/types";
import * as colors from "@/constants/colors/catppuccin-palette.json"

const getStatusStyle = (status: Item['status']) => {
    switch (status) {
        case 'Critical':
            return {backgroundColor: colors.latte.colors.red.hex};
        case 'Warning':
            return {backgroundColor: colors.latte.colors.yellow.hex};
        case 'Neutral':
            return {backgroundColor: colors.latte.colors.green.hex};
        case 'Outdated':
            return {backgroundColor: colors.latte.colors.overlay2.hex};
        default:
            return {backgroundColor: colors.latte.colors.green.hex};
    }
};

export default getStatusStyle

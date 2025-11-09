"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
async function getSettings(req, res) {
    const prisma = req.prisma;
    try {
        const restaurant = await prisma.restaurant.findFirst();
        if (restaurant) {
            res.json(restaurant);
        }
        else {
            res.status(404).json({ error: 'Restaurant settings not found' });
        }
    }
    catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
}
async function updateSettings(req, res) {
    const prisma = req.prisma;
    try {
        const firstRestaurant = await prisma.restaurant.findFirst();
        if (!firstRestaurant) {
            return res.status(404).json({ error: 'Restaurant settings not found to update' });
        }
        const updatedSettings = await prisma.restaurant.update({
            where: { id: firstRestaurant.id },
            data: req.body,
        });
        res.json(updatedSettings);
    }
    catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
}
//# sourceMappingURL=settings.js.map
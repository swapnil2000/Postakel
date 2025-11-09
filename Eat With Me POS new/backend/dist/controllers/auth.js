"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function login(req, res) {
    const { email, password } = req.body;
    const prisma = req.prisma;
    const tenant = req.tenant;
    if (!prisma) {
        return res.status(400).json({ message: 'Restaurant ID is missing or invalid. Please provide it in the X-Restaurant-Id header.' });
    }
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    try {
        const staff = await prisma.staff.findUnique({ where: { email } });
        if (staff && (await bcryptjs_1.default.compare(password, staff.password))) {
            const role = await prisma.role.findUnique({ where: { id: staff.roleId } });
            const staffRecord = staff;
            const roleRecord = role;
            const tokenPayload = {
                staffId: staff.id,
                roleId: staff.roleId,
                tenantId: tenant.id,
                restaurantId: tenant.restaurantId,
            };
            const accessToken = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
            const permissions = Array.isArray(staffRecord.permissions) && staffRecord.permissions.length > 0
                ? staffRecord.permissions
                : Array.isArray(roleRecord === null || roleRecord === void 0 ? void 0 : roleRecord.permissions)
                    ? roleRecord.permissions
                    : [];
            const dashboardModules = Array.isArray(staffRecord.dashboardModules) && staffRecord.dashboardModules.length > 0
                ? staffRecord.dashboardModules
                : Array.isArray(roleRecord === null || roleRecord === void 0 ? void 0 : roleRecord.dashboardModules)
                    ? roleRecord.dashboardModules
                    : [];
            res.json({
                accessToken,
                user: {
                    id: staff.id,
                    name: staff.name,
                    email: staff.email,
                    role: (role === null || role === void 0 ? void 0 : role.name) || 'No Role',
                    permissions,
                    dashboardModules,
                },
                restaurant: {
                    id: tenant.restaurantId,
                    useRedis: Boolean(tenant.useRedis),
                },
            });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials.' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login.' });
    }
}
//# sourceMappingURL=auth.js.map
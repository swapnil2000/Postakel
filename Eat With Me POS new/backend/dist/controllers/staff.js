"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStaff = getAllStaff;
exports.getStaffById = getStaffById;
exports.createStaff = createStaff;
exports.updateStaff = updateStaff;
exports.deleteStaff = deleteStaff;
exports.searchStaff = searchStaff;
exports.getStaffRoles = getStaffRoles;
exports.getStaffStats = getStaffStats;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const DEFAULT_PERFORMANCE = {
    ordersHandled: 0,
    avgOrderTime: 0,
    customerRating: 0,
};
const DEFAULT_SALARY_DETAILS = (base = 0) => ({
    baseSalary: base,
    allowances: 0,
    deductions: 0,
    overtime: 0,
    totalSalary: base,
});
const mapSalaryPayment = (payment) => ({
    id: payment.id,
    month: payment.month || '',
    year: payment.year || new Date(payment.paymentDate).getFullYear(),
    amount: payment.amount,
    paymentDate: payment.paymentDate,
    status: payment.status || 'Completed',
    type: payment.paymentType,
    description: payment.description,
    paidBy: payment.paidBy,
});
const mapStaffRecord = (staff) => {
    const role = staff.role || {};
    const staffPermissions = Array.isArray(staff.permissions) ? staff.permissions : [];
    const rolePermissions = Array.isArray(role.permissions) ? role.permissions : [];
    const permissions = staffPermissions.length > 0 ? staffPermissions : rolePermissions;
    const staffModules = Array.isArray(staff.dashboardModules) ? staff.dashboardModules : [];
    const roleModules = Array.isArray(role.dashboardModules) ? role.dashboardModules : [];
    const dashboardModules = staffModules.length > 0 ? staffModules : roleModules;
    const performance = staff.performance || DEFAULT_PERFORMANCE;
    const salaryDetails = staff.salaryDetails || DEFAULT_SALARY_DETAILS(staff.salary || 0);
    return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        pin: staff.pin,
        isActive: staff.isActive,
        role: role.name || 'No Role',
        roleId: staff.roleId,
        permissions,
        dashboardModules,
        salary: staff.salary || 0,
        joinDate: staff.joinDate,
        avatar: staff.avatar,
        currentShift: staff.currentShift || null,
        address: staff.address || null,
        performance,
        salaryDetails,
        paymentHistory: Array.isArray(staff.salaryPayments)
            ? staff.salaryPayments.map(mapSalaryPayment)
            : [],
    };
};
async function getAllStaff(req, res) {
    const prisma = req.prisma;
    try {
        const { role } = req.query;
        const staffRecords = await prisma.staff.findMany({
            where: role && role !== 'all' ? { role: { name: role } } : undefined,
            include: {
                role: true,
                salaryPayments: { orderBy: { paymentDate: 'desc' } },
            },
            orderBy: { name: 'asc' },
        });
        res.json({ staff: staffRecords.map(mapStaffRecord), totalStaff: staffRecords.length });
    }
    catch (err) {
        console.error('Get all staff error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getStaffById(req, res) {
    const prisma = req.prisma;
    try {
        const { id } = req.params;
        const staff = await prisma.staff.findUnique({
            where: { id },
            include: { role: true, salaryPayments: true },
        });
        if (!staff) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.json(mapStaffRecord(staff));
    }
    catch (err) {
        console.error('Get staff by ID error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function createStaff(req, res) {
    const prisma = req.prisma;
    try {
        const _a = req.body, { roleId, password, permissions = [], dashboardModules = [], joinDate, salary } = _a, staffData = __rest(_a, ["roleId", "password", "permissions", "dashboardModules", "joinDate", "salary"]);
        if (!roleId) {
            return res.status(400).json({ message: 'roleId is required.' });
        }
        if (!password) {
            return res.status(400).json({ message: 'Password is required for new staff members.' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newStaff = await prisma.staff.create({
            data: Object.assign(Object.assign({}, staffData), { salary: salary !== null && salary !== void 0 ? salary : 0, password: hashedPassword, permissions,
                dashboardModules, joinDate: joinDate ? new Date(joinDate) : undefined, role: { connect: { id: roleId } } }),
            include: { role: true, salaryPayments: true },
        });
        res.status(201).json(mapStaffRecord(newStaff));
    }
    catch (err) {
        console.error('Create staff error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function updateStaff(req, res) {
    const prisma = req.prisma;
    try {
        const { id } = req.params;
        const _a = req.body, { roleId, roleName, password, permissions, dashboardModules, joinDate, salary } = _a, updatePayload = __rest(_a, ["roleId", "roleName", "password", "permissions", "dashboardModules", "joinDate", "salary"]);
        const data = Object.assign({}, updatePayload);
        if (typeof salary === 'number') {
            data.salary = salary;
        }
        if (joinDate) {
            data.joinDate = new Date(joinDate);
        }
        if (Array.isArray(permissions)) {
            data.permissions = permissions;
        }
        if (Array.isArray(dashboardModules)) {
            data.dashboardModules = dashboardModules;
        }
        if (password) {
            data.password = await bcryptjs_1.default.hash(password, 10);
        }
        if (roleId) {
            data.role = { connect: { id: roleId } };
        }
        else if (roleName) {
            const role = await prisma.role.findUnique({ where: { name: roleName } });
            if (!role) {
                return res.status(400).json({ message: `Role '${roleName}' does not exist.` });
            }
            data.role = { connect: { id: role.id } };
        }
        const staff = await prisma.staff.update({
            where: { id },
            data,
            include: { role: true, salaryPayments: true },
        });
        res.json(mapStaffRecord(staff));
    }
    catch (err) {
        console.error('Update staff error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function deleteStaff(req, res) {
    const prisma = req.prisma;
    try {
        const { id } = req.params;
        await prisma.staff.delete({ where: { id } });
        res.json({ deleted: true });
    }
    catch (err) {
        console.error('Delete staff error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function searchStaff(req, res) {
    const prisma = req.prisma;
    try {
        const { q, role } = req.query;
        const filters = {};
        if (q) {
            filters.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (role && role !== 'all') {
            filters.role = { name: role };
        }
        const result = await prisma.staff.findMany({
            where: filters,
            include: { role: true, salaryPayments: true },
            orderBy: { name: 'asc' },
        });
        res.json(result.map(mapStaffRecord));
    }
    catch (err) {
        console.error('Search staff error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getStaffRoles(req, res) {
    const prisma = req.prisma;
    try {
        const roles = await prisma.role.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(roles.map((role) => ({
            id: role.id,
            name: role.name,
            permissions: role.permissions || [],
            dashboardModules: role.dashboardModules || [],
        })));
    }
    catch (err) {
        console.error('Get staff roles error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function getStaffStats(req, res) {
    const prisma = req.prisma;
    try {
        const [totalStaff, activeStaff, onDuty] = await Promise.all([
            prisma.staff.count(),
            prisma.staff.count({ where: { isActive: true } }),
            prisma.shift.count({ where: { status: 'ACTIVE' } }),
        ]);
        res.json({ totalStaff, activeStaff, onDuty });
    }
    catch (err) {
        console.error('Get staff stats error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
//# sourceMappingURL=staff.js.map
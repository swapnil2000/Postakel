"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllShifts = getAllShifts;
exports.createShift = createShift;
exports.getStaffShifts = getStaffShifts;
exports.updateShift = updateShift;
exports.deleteShift = deleteShift;
// Get all shift logs
async function getAllShifts(req, res) {
    const prisma = req.prisma;
    const shifts = await prisma.shiftLog
        ? await prisma.shiftLog.findMany()
        : [];
    res.json(shifts);
}
// Create shift entry
async function createShift(req, res) {
    const prisma = req.prisma;
    const { staffId, startTime, endTime, type } = req.body;
    if (!prisma.shiftLog)
        return res.status(501).json({ error: "Shifts not enabled in schema." });
    const shift = await prisma.shiftLog.create({
        data: { staffId, startTime, endTime, type }
    });
    res.status(201).json(shift);
}
// By staffId
async function getStaffShifts(req, res) {
    const prisma = req.prisma;
    const { staffId } = req.params;
    if (!prisma.shiftLog)
        return res.status(501).json({ error: "Shifts not enabled in schema." });
    const shifts = await prisma.shiftLog.findMany({ where: { staffId } });
    res.json(shifts);
}
// Update shift entry
async function updateShift(req, res) {
    const prisma = req.prisma;
    const { id } = req.params;
    const { staffId, startTime, endTime, type } = req.body;
    if (!prisma.shiftLog)
        return res.status(501).json({ error: "Shifts not enabled in schema." });
    const shift = await prisma.shiftLog.update({
        where: { id },
        data: { staffId, startTime, endTime, type }
    });
    res.json(shift);
}
// Delete shift entry
async function deleteShift(req, res) {
    const prisma = req.prisma;
    const { id } = req.params;
    if (!prisma.shiftLog)
        return res.status(501).json({ error: "Shifts not enabled in schema." });
    await prisma.shiftLog.delete({ where: { id } });
    res.status(204).send();
}
//# sourceMappingURL=shifts.js.map
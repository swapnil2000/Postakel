"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCustomers = getAllCustomers;
exports.createCustomer = createCustomer;
exports.getCustomerById = getCustomerById;
exports.updateCustomer = updateCustomer;
exports.deleteCustomer = deleteCustomer;
async function getAllCustomers(req, res) {
    const prisma = req.prisma;
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to get customers.' });
    }
}
async function createCustomer(req, res) {
    const prisma = req.prisma;
    try {
        const customer = await prisma.customer.create({ data: req.body });
        res.status(201).json(customer);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create customer.' });
    }
}
async function getCustomerById(req, res) {
    const prisma = req.prisma;
    const { id } = req.params;
    try {
        const customer = await prisma.customer.findUnique({ where: { id } });
        if (customer) {
            res.json(customer);
        }
        else {
            res.status(404).json({ error: 'Customer not found' });
        }
    }
    catch (error) {
        console.error(`Error fetching customer ${id}:`, error);
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
}
async function updateCustomer(req, res) {
    const prisma = req.prisma;
    const { id } = req.params;
    try {
        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: req.body,
        });
        res.json(updatedCustomer);
    }
    catch (error) {
        console.error(`Error updating customer ${id}:`, error);
        res.status(500).json({ error: 'Failed to update customer' });
    }
}
async function deleteCustomer(req, res) {
    const prisma = req.prisma;
    const { id } = req.params;
    try {
        await prisma.customer.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        console.error(`Error deleting customer ${id}:`, error);
        res.status(500).json({ error: 'Failed to delete customer' });
    }
}
//# sourceMappingURL=customer.js.map
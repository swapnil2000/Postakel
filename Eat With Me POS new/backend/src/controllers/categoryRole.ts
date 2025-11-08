// src/controllers/categoryRole.ts

import { Request, Response } from 'express';

// ---- Categories ----

export async function getCategories(req: Request, res: Response) {
  // FIX: Use the tenant-specific prisma client from the request
  const prisma = (req as any).prisma;
  try {
    const { type } = req.query;
    const where = type ? { type: type as string } : {};
    const cats = await prisma.category.findMany({ where, orderBy: { createdAt: 'desc' } });
    console.log(`[Categories] Fetched ${cats.length} categories${type ? ` of type "${type}"` : ''}`);
    res.json(cats);
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

export async function createCategory(req: Request, res: Response) {
  // FIX: Use the tenant-specific prisma client from the request
  const prisma = (req as any).prisma;
  try {
    const { name, description, color, type } = req.body;
    if (!name || !color || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const cat = await prisma.category.create({
      data: { name, description, color, type, isActive: true }
    });
    console.log(`[Categories] Created category "${name}" of type "${type}"`);
    res.status(201).json(cat);
  } catch (error) {
    console.error('Error in createCategory:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
}

export async function updateCategory(req: Request, res: Response) {
  // FIX: Use the tenant-specific prisma client from the request
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    const data = req.body;
    const cat = await prisma.category.update({ where: { id }, data });
    console.log(`[Categories] Updated category "${cat.name}" (ID: ${id})`);
    res.json(cat);
  } catch (error) {
    console.error('Error in updateCategory:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  // FIX: Use the tenant-specific prisma client from the request
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    console.log(`[Categories] Deleted category with ID: ${id}`);
    res.json({ deleted: true });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
}

// ---- Roles ----

export async function getRoles(req: Request, res: Response) {
  // FIX: Use the tenant-specific prisma client from the request
  const prisma = (req as any).prisma;
  try {
    const roles = await prisma.role.findMany({ orderBy: { createdAt: 'desc' } });
    console.log(`[Roles] Fetched ${roles.length} roles`);
    res.json(roles);
  } catch (error) {
    console.error('Error in getRoles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
}

export const createRole = async (req: Request, res: Response) => {
  const prisma = (req as any).prisma;
  const { name, permissions } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Role name is required.' });
  }

  // --- THIS IS THE FIX ---
  // Validate that permissions is an array, defaulting to an empty one if not provided.
  if (permissions && !Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Permissions must be an array of strings.' });
  }
  // --- END OF FIX ---

  try {
    const newRole = await prisma.role.create({
      // Ensure we always save an array
      data: { name, permissions: permissions || [] },
    });
    res.status(201).json(newRole);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'A role with this name already exists.' });
    }
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role.' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
    const prisma = (req as any).prisma;
    const { id } = req.params;
    const { name, permissions } = req.body;

    // --- THIS IS THE FIX ---
    // Validate that permissions is an array if it's being updated.
    if (permissions && !Array.isArray(permissions)) {
      return res.status(400).json({ error: 'Permissions must be an array of strings.' });
    }
    // --- END OF FIX ---

    try {
        const updatedRole = await prisma.role.update({
            where: { id },
            data: { name, permissions },
        });
        res.json(updatedRole);
    } catch (error: any) {
        console.error(`Error updating role ${id}:`, error);
        res.status(500).json({ error: 'Failed to update role.' });
    }
};

export async function deleteRole(req: Request, res: Response) {
  // FIX: Use the tenant-specific prisma client from the request
  const prisma = (req as any).prisma;
  try {
    const { id } = req.params;
    await prisma.role.delete({ where: { id } });
    console.log(`[Roles] Deleted role with ID: ${id}`);
    res.json({ deleted: true });
  } catch (error) {
    console.error('Error in deleteRole:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
}

// src/controllers/categoryRole.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---- Categories ----

export async function getCategories(req: Request, res: Response) {
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
  try {
    const { name, description, color, type } = req.body;
    if (!name || !color || !type) {
      console.warn('Missing required fields in createCategory:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const cat = await prisma.category.create({
      data: {
        name,
        description,
        color,
        type,
        isActive: true,
      }
    });
    console.log(`[Categories] Created category "${name}" of type "${type}"`);
    res.status(201).json(cat);
  } catch (error) {
    console.error('Error in createCategory:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
}

export async function updateCategory(req: Request, res: Response) {
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
  try {
    const roles = await prisma.role.findMany({ orderBy: { createdAt: 'desc' } });
    console.log(`[Roles] Fetched ${roles.length} roles`);
    res.json(roles);
  } catch (error) {
    console.error('Error in getRoles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
}

export async function createRole(req: Request, res: Response) {
  try {
    const { name, description, permissions } = req.body;
    if (!name || !permissions || !Array.isArray(permissions)) {
      console.warn('Missing required fields in createRole:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions,
        isActive: true,
      }
    });
    console.log(`[Roles] Created role "${name}"`);
    res.status(201).json(role);
  } catch (error) {
    console.error('Error in createRole:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
}

export async function updateRole(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;
    const role = await prisma.role.update({ where: { id }, data });
    console.log(`[Roles] Updated role "${role.name}" (ID: ${id})`);
    res.json(role);
  } catch (error) {
    console.error('Error in updateRole:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
}

export async function deleteRole(req: Request, res: Response) {
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

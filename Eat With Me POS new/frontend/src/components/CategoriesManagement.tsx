import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Edit2, Trash2, Search, Grid3X3, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

// --- FIX: Corrected Type Definitions ---
interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
  itemCount?: number;
  createdAt?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  // Permissions should always be an array of strings
  permissions: string[];
  isActive: boolean;
  staffCount?: number;
  createdAt?: string;
}

export function CategoriesManagement() {
  // --- State ---
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [staffRoles, setStaffRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', color: '#3b82f6' });
  // --- FIX: Initialize permissions as an empty array ---
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] as string[] });

  const availablePermissions = [
    { id: 'pos_billing', name: 'POS Billing' },
    { id: 'menu_management', name: 'Menu Management' },
    { id: 'table_management', name: 'Table Management' },
    { id: 'kitchen_display', name: 'Kitchen Display' },
    { id: 'customer_management', name: 'Customer Management' },
    { id: 'inventory_management', name: 'Inventory Management' },
    { id: 'staff_management', name: 'Staff Management' },
    { id: 'reports', name: 'Reports & Analytics' },
    { id: 'settings', name: 'Settings' },
    { id: 'all_access', name: 'Full Access' }
  ];
  const colorOptions = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  // --- FIX: Use apiClient for all data fetching ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesData, rolesData] = await Promise.all([
        apiClient.get('/categories?type=menu'),
        apiClient.get('/roles')
      ]);
      setMenuCategories(Array.isArray(categoriesData) ? categoriesData : []);
      // Ensure permissions are always an array
      const formattedRoles = (Array.isArray(rolesData) ? rolesData : []).map(role => ({
        ...role,
        permissions: Array.isArray(role.permissions) ? role.permissions : []
      }));
      setStaffRoles(formattedRoles);
    } catch (err: any) {
      setError(err.message);
      toast.error(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FIX: Update all CRUD handlers to use apiClient ---
  const handleSaveCategory = async () => {
    setLoading(true);
    try {
      const payload = { ...categoryForm, type: 'menu' };
      let updatedCategory: Category;

      if (editingCategory) {
        updatedCategory = await apiClient.put(`/categories/${editingCategory.id}`, payload);
        toast.success(`Category "${updatedCategory.name}" updated.`);
      } else {
        updatedCategory = await apiClient.post('/categories', payload);
        toast.success(`Category "${updatedCategory.name}" created.`);
      }
      fetchData(); // Re-fetch all data to ensure consistency
      setShowCategoryDialog(false);
    } catch (err: any) {
      toast.error(`Failed to save category: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      await apiClient.delete(`/categories/${id}`);
      toast.success('Category deleted successfully.');
      fetchData(); // Re-fetch
    } catch (err: any) {
      toast.error(`Failed to delete category: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- FIX: Corrected Role CRUD Handlers ---
  const handleSaveRole = async () => {
    setLoading(true);
    try {
      let updatedRole: Role;
      if (editingRole) {
        updatedRole = await apiClient.put(`/roles/${editingRole.id}`, roleForm);
        toast.success(`Role "${updatedRole.name}" updated.`);
      } else {
        updatedRole = await apiClient.post('/roles', roleForm);
        toast.success(`Role "${updatedRole.name}" created.`);
      }
      fetchData(); // Re-fetch
      setShowRoleDialog(false);
    } catch (err: any) {
      toast.error(`Failed to save role: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this role? This cannot be undone.')) return;
    setLoading(true);
    try {
      await apiClient.delete(`/roles/${id}`);
      toast.success('Role deleted successfully.');
      fetchData(); // Re-fetch
    } catch (err: any) {
      toast.error(`Failed to delete role: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description, color: category.color });
    setShowCategoryDialog(true);
  };

  // --- FIX: Correctly set form state for editing a role ---
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    // Ensure permissions are always an array
    setRoleForm({ name: role.name, description: role.description, permissions: Array.isArray(role.permissions) ? role.permissions : [] });
    setShowRoleDialog(true);
  };

  const filteredCategories = menuCategories.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredRoles = staffRoles.filter(role => role.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- UI (No changes needed here, but included for completeness) ---
  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories & Roles Management</h1>
          <p className="text-muted-foreground">Manage menu categories and staff roles</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search categories or roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Grid3X3 size={16} />
            Menu Categories
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <UserCheck size={16} />
            Staff Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Menu Categories</h3>
            <Button onClick={() => {
              setEditingCategory(null);
              setCategoryForm({ name: '', description: '', color: '#3b82f6' });
              setShowCategoryDialog(true);
            }}>
              <Plus size={16} className="mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.length === 0 && !loading ? (
              <div className="col-span-3 text-center text-muted-foreground py-8 text-lg">0</div>
            ) : (
              filteredCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <CardTitle className="text-base">{category.name}</CardTitle>
                      </div>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {category.itemCount} items
                      </span>
                      <span className="text-muted-foreground">
                        Created: {category.createdAt}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="flex-1"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Staff Roles</h3>
            <Button onClick={() => {
              setEditingRole(null);
              // --- FIX: Initialize permissions as an empty array ---
              setRoleForm({ name: '', description: '', permissions: [] });
              setShowRoleDialog(true);
            }}>
              <Plus size={16} className="mr-2" />
              Add Role
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.length === 0 && !loading ? (
              <div className="col-span-3 text-center text-muted-foreground py-8">No roles found.</div>
            ) : (
              filteredRoles.map((role) => (
                <Card key={role.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-base">{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground pt-1">{role.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions && role.permissions.slice(0, 3).map((permissionId) => (
                          <Badge key={permissionId} variant="outline" className="text-xs">
                            {availablePermissions.find(p => p.id === permissionId)?.name || permissionId}
                          </Badge>
                        ))}
                        {role.permissions && role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" onClick={() => handleEditRole(role)} className="flex-1">
                        <Edit2 size={14} className="mr-1" /> Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteRole(role.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the menu category details' : 'Create a new menu category for organizing items'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                placeholder="Enter category name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter category description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setCategoryForm(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      categoryForm.color === color ? 'border-primary' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCategoryDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={editingCategory ? handleSaveCategory : handleSaveCategory}
                disabled={!categoryForm.name.trim()}
                className="flex-1"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- FIX: Corrected Role Dialog --- */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Edit Role' : 'Add New Role'}
            </DialogTitle>
            <DialogDescription>
              {editingRole ? 'Update the staff role and permissions' : 'Create a new staff role with specific permissions'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input
                placeholder="e.g., Manager, Cashier"
                value={roleForm.name}
                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="A short description of the role's responsibilities"
                value={roleForm.description}
                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <Checkbox
                      id={permission.id}
                      // --- FIX: Check against the permissions array ---
                      checked={roleForm.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        const newPermissions = checked
                          ? [...roleForm.permissions, permission.id]
                          : roleForm.permissions.filter(p => p !== permission.id);
                        setRoleForm(prev => ({ ...prev, permissions: newPermissions }));
                      }}
                    />
                    <Label htmlFor={permission.id} className="text-sm font-normal">{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowRoleDialog(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSaveRole} disabled={!roleForm.name.trim() || roleForm.permissions.length === 0} className="flex-1">
                {editingRole ? 'Update Role' : 'Add Role'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
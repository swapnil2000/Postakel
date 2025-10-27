import { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from
 './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Tag, 
  Users, 
  Search,
  Grid3X3,
  UserCheck
} from 'lucide-react';

// Add these above your component
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

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6'
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

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

  const colorOptions = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
  ];

  // --- API base URL from env ---
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // --- Fetch categories and roles ---
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/categories?type=menu`).then(res => res.json()),
      fetch(`${API_BASE_URL}/roles`).then(res => res.json())
    ])
      .then(([categories, roles]) => {
        setMenuCategories(Array.isArray(categories) ? categories : []);
        setStaffRoles(Array.isArray(roles) ? roles : []);
        setLoading(false);
      })
      .catch(err => {
        // Only show error if fetch itself fails (not if data is empty)
        setError('Failed to load data');
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // --- CRUD Handlers ---
  const handleAddCategory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...categoryForm,
          type: 'menu'
        })
      });
      const newCategory = await res.json();
      setMenuCategories(prev => [newCategory, ...prev]);
      setCategoryForm({ name: '', description: '', color: '#3b82f6' });
      setShowCategoryDialog(false);
    } catch {
      setError('Failed to add category');
    }
    setLoading(false);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const updated = await res.json();
      setMenuCategories(prev => prev.map(cat => cat.id === updated.id ? updated : cat));
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', color: '#3b82f6' });
      setShowCategoryDialog(false);
    } catch {
      setError('Failed to update category');
    }
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
      setMenuCategories(prev => prev.filter(cat => cat.id !== id));
    } catch {
      setError('Failed to delete category');
    }
    setLoading(false);
  };

  const handleAddRole = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm)
      });
      const newRole = await res.json();
      setStaffRoles(prev => [newRole, ...prev]);
      setRoleForm({ name: '', description: '', permissions: [] });
      setShowRoleDialog(false);
    } catch {
      setError('Failed to add role');
    }
    setLoading(false);
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm)
      });
      const updated = await res.json();
      setStaffRoles(prev => prev.map(role => role.id === updated.id ? updated : role));
      setEditingRole(null);
      setRoleForm({ name: '', description: '', permissions: [] });
      setShowRoleDialog(false);
    } catch {
      setError('Failed to update role');
    }
    setLoading(false);
  };

  const handleDeleteRole = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/roles/${id}`, { method: 'DELETE' });
      setStaffRoles(prev => prev.filter(role => role.id !== id));
    } catch {
      setError('Failed to delete role');
    }
    setLoading(false);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setShowCategoryDialog(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions
    });
    setShowRoleDialog(true);
  };

  const filteredCategories = menuCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = staffRoles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- UI ---
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
              setRoleForm({ name: '', description: '', permissions: [] });
              setShowRoleDialog(true);
            }}>
              <Plus size={16} className="mr-2" />
              Add Role
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRoles.length === 0 && !loading ? (
              <div className="col-span-3 text-center text-muted-foreground py-8 text-lg">0</div>
            ) : (
              filteredRoles.map((role) => (
                <Card key={role.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <Badge variant={role.isActive ? "default" : "secondary"}>
                        {role.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permissions:</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {availablePermissions.find(p => p.id === permission)?.name || permission}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {role.staffCount} staff members
                      </span>
                      <span className="text-muted-foreground">
                        Created: {role.createdAt}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditRole(role)}
                        className="flex-1"
                      >
                        <Edit2 size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
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
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                disabled={!categoryForm.name.trim()}
                className="flex-1"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
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
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Name</label>
              <Input
                placeholder="Enter role name"
                value={roleForm.name}
                onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter role description"
                value={roleForm.description}
                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Permissions</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={roleForm.permissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setRoleForm(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission.id]
                          }));
                        } else {
                          setRoleForm(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== permission.id)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <label htmlFor={permission.id} className="text-sm">
                      {permission.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowRoleDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={editingRole ? handleUpdateRole : handleAddRole}
                disabled={!roleForm.name.trim() || roleForm.permissions.length === 0}
                className="flex-1"
              >
                {editingRole ? 'Update' : 'Add'} Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
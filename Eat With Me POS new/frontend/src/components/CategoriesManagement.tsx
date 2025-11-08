import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
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

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  itemCount?: number;
  isActive: boolean;
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  staffCount: number;
  isActive: boolean;
  createdAt: string;
}

export function CategoriesManagement() {
  const { 
    categories, 
    updateCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoriesByType
  } = useAppContext();

  // Get categories by type from AppContext
  const menuCategories = getCategoriesByType('menu');
  const expenseCategories = getCategoriesByType('expense');
  const inventoryCategories = getCategoriesByType('inventory');
  const supplierCategories = getCategoriesByType('supplier');

  const [staffRoles, setStaffRoles] = useState<Role[]>([
    { 
      id: '1', 
      name: 'Manager', 
      description: 'Full system access and management',
      permissions: ['all_access', 'reports', 'staff_management', 'settings'],
      staffCount: 2,
      isActive: true,
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      name: 'Cashier', 
      description: 'POS operations and billing',
      permissions: ['pos_billing', 'customer_management'],
      staffCount: 4,
      isActive: true,
      createdAt: '2024-01-15'
    },
    { 
      id: '3', 
      name: 'Kitchen Staff', 
      description: 'Kitchen display and order management',
      permissions: ['kitchen_display', 'inventory_view'],
      staffCount: 6,
      isActive: true,
      createdAt: '2024-01-15'
    },
  ]);

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

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryForm.name,
      description: categoryForm.description,
      color: categoryForm.color,
      itemCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMenuCategories(prev => [...prev, newCategory]);
    setCategoryForm({ name: '', description: '', color: '#3b82f6' });
    setShowCategoryDialog(false);
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

  const handleUpdateCategory = () => {
    if (editingCategory) {
      setMenuCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...categoryForm }
          : cat
      ));
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', color: '#3b82f6' });
      setShowCategoryDialog(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setMenuCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const handleAddRole = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: roleForm.name,
      description: roleForm.description,
      permissions: roleForm.permissions,
      staffCount: 0,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setStaffRoles(prev => [...prev, newRole]);
    setRoleForm({ name: '', description: '', permissions: [] });
    setShowRoleDialog(false);
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

  const handleUpdateRole = () => {
    if (editingRole) {
      setStaffRoles(prev => prev.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...roleForm }
          : role
      ));
      setEditingRole(null);
      setRoleForm({ name: '', description: '', permissions: [] });
      setShowRoleDialog(false);
    }
  };

  const handleDeleteRole = (id: string) => {
    setStaffRoles(prev => prev.filter(role => role.id !== id));
  };

  const filteredCategories = menuCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRoles = staffRoles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredCategories.map((category) => (
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
            ))}
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
            {filteredRoles.map((role) => (
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
            ))}
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
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext }from '../contexts/AppContext';
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
  Search,
  Grid3X3,
  UserCheck
} from 'lucide-react';
import { Skeleton } from './ui/skeleton';

// The Category and Role interfaces should ideally be imported from a shared types file
// For now, we assume they match the structure from the context
interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  itemCount?: number;
  isActive: boolean;
  createdAt?: string;
  type: 'menu' | 'expense' | 'inventory' | 'supplier';
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  staffCount?: number;
  isActive: boolean;
  createdAt?: string;
}

export function CategoriesManagement() {
  const { hasPermission } = useAuth();
  const { 
    categoriesAndRoles,
    addCategory,
    updateCategory,
    deleteCategory,
    // Assuming these will be added to the context
    // addRole, 
    // updateRole, 
    // deleteRole 
  } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [menuCategories, setMenuCategories] = useState<Category[]>([]);
  const [staffRoles, setStaffRoles] = useState<Role[]>([]);

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    type: 'menu' as Category['type']
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  useEffect(() => {
    if (!hasPermission('categories_roles_management')) {
      setError('You do not have permission to manage categories and roles.');
      setLoading(false);
      return;
    }

    if (categoriesAndRoles) {
      setMenuCategories(categoriesAndRoles.categories.filter(c => c.type === 'menu'));
      setStaffRoles(categoriesAndRoles.roles as Role[]);
      setLoading(false);
    }
  }, [hasPermission, categoriesAndRoles]);

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

  const handleSaveCategory = () => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
    } else {
      addCategory({
        id: Date.now().toString(), // Temporary ID, should be handled by backend
        ...categoryForm,
        isActive: true,
      });
    }
    setShowCategoryDialog(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', color: '#3b82f6', type: 'menu' });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3b82f6',
      type: category.type
    });
    setShowCategoryDialog(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategory(id);
    }
  };

  // Role management functions are currently using local state.
  // These should be updated to use context functions once available.
  const handleSaveRole = () => {
    if (editingRole) {
      // updateRole(editingRole.id, roleForm);
      setStaffRoles(prev => prev.map(role => 
        role.id === editingRole.id 
          ? { ...role, ...roleForm }
          : role
      ));
    } else {
      const newRole: Role = {
        id: Date.now().toString(),
        ...roleForm,
        isActive: true,
        staffCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      // addRole(newRole);
      setStaffRoles(prev => [...prev, newRole]);
    }
    setShowRoleDialog(false);
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
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

  const handleDeleteRole = (id: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      // deleteRole(id);
      setStaffRoles(prev => prev.filter(role => role.id !== id));
    }
  };

  const filteredCategories = menuCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredRoles = staffRoles.filter(role => 
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-4 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

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
              setCategoryForm({ name: '', description: '', color: '#3b82f6', type: 'menu' });
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
                  <p className="text-sm text-muted-foreground h-10 overflow-hidden">{category.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {category.itemCount || 0} items
                    </span>
                    <span className="text-muted-foreground">
                      Created: {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
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
                  <p className="text-sm text-muted-foreground h-10 overflow-hidden">{role.description}</p>
                  
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
                      {role.staffCount || 0} staff members
                    </span>
                    <span className="text-muted-foreground">
                      Created: {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
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
                    aria-label={`Set color to ${color}`}
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
                onClick={handleSaveCategory}
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
              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {availablePermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2 p-1 rounded hover:bg-muted/50">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={roleForm.permissions.includes(permission.id)}
                      onChange={(e) => {
                        const { checked } = e.target;
                        setRoleForm(prev => ({
                          ...prev,
                          permissions: checked
                            ? [...prev.permissions, permission.id]
                            : prev.permissions.filter(p => p !== permission.id)
                        }));
                      }}
                      className="rounded h-4 w-4 text-primary focus:ring-primary"
                    />
                    <label htmlFor={permission.id} className="text-sm flex-1 cursor-pointer">
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
                onClick={handleSaveRole}
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
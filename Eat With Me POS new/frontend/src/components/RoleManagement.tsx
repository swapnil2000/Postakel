import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { ArrowLeft, Plus, Edit, Trash2, Shield, Users, Settings as SettingsIcon } from 'lucide-react';
import { toast } from 'sonner';

// interface RoleManagementProps {
//   onNavigate: (screen: string) => void;
// }

// interface Role {
//   id: string;
//   name: string;
//   description: string;
//   permissions: string[];
//   userCount: number;
//   isDefault: boolean;
// }

// interface Permission {
//   id: string;
//   name: string;
//   category: string;
//   description: string;
// }

// export function RoleManagement({ onNavigate }: RoleManagementProps) {
//   const [roles, setRoles] = useState<Role[]>([
//     {
//       id: '1',
//       name: 'Admin',
//       description: 'Full access to all features and settings',
//       permissions: ['billing', 'menu', 'reports', 'settings', 'staff', 'inventory', 'customers'],
//       userCount: 2,
//       isDefault: false
//     },
//     {
//       id: '2',
//       name: 'Manager',
//       description: 'Manage daily operations and staff',
//       permissions: ['billing', 'menu', 'reports', 'staff', 'inventory', 'customers'],
//       userCount: 3,
//       isDefault: false
//     },
//     {
//       id: '3',
//       name: 'Cashier',
//       description: 'Handle orders and billing',
//       permissions: ['billing', 'menu'],
//       userCount: 5,
//       isDefault: true
//     },
//     {
//       id: '4',
//       name: 'Kitchen Staff',
//       description: 'Access kitchen display and menu items',
//       permissions: ['kitchen', 'menu'],
//       userCount: 4,
//       isDefault: false
//     },
//     {
//       id: '5',
//       name: 'Waiter',
//       description: 'Take orders and manage tables',
//       permissions: ['billing', 'menu', 'tables'],
//       userCount: 6,
//       isDefault: false
//     }
//   ]);

//   const permissions: Permission[] = [
//     { id: 'billing', name: 'POS Billing', category: 'Sales', description: 'Access POS billing system' },
//     { id: 'menu', name: 'Menu Management', category: 'Operations', description: 'Manage menu items and categories' },
//     { id: 'tables', name: 'Table Management', category: 'Operations', description: 'Manage table bookings and orders' },
//     { id: 'kitchen', name: 'Kitchen Display', category: 'Operations', description: 'Access kitchen display system' },
//     { id: 'reports', name: 'Reports', category: 'Analytics', description: 'View sales and performance reports' },
//     { id: 'customers', name: 'Customer Management', category: 'CRM', description: 'Manage customer data and marketing' },
//     { id: 'inventory', name: 'Inventory Management', category: 'Operations', description: 'Track and manage inventory' },
//     { id: 'staff', name: 'Staff Management', category: 'HR', description: 'Manage staff and schedules' },
//     { id: 'settings', name: 'System Settings', category: 'Admin', description: 'Configure system settings' }
//   ];

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [editingRole, setEditingRole] = useState<Role | null>(null);
//   const [newRole, setNewRole] = useState({
//     name: '',
//     description: '',
//     permissions: [] as string[]
//   });

//   const handleAddRole = () => {
//     if (newRole.name && newRole.description) {
//       const role: Role = {
//         id: Date.now().toString(),
//         name: newRole.name,
//         description: newRole.description,
//         permissions: newRole.permissions,
//         userCount: 0,
//         isDefault: false
//       };
//       setRoles([...roles, role]);
//       setNewRole({ name: '', description: '', permissions: [] });
//       setIsAddDialogOpen(false);
//     }
//   };

  // const handleEditRole = (role: Role) => {
  //   setEditingRole(role);
  //   setNewRole({
  //     name: role.name,
  //     description: role.description,
  //     permissions: [...role.permissions]
  //   });
  // };

//   const handleUpdateRole = () => {
//     if (editingRole && newRole.name && newRole.description) {
//       setRoles(roles.map(role => 
//         role.id === editingRole.id 
//           ? { ...role, name: newRole.name, description: newRole.description, permissions: newRole.permissions }
//           : role
//       ));
//       setEditingRole(null);
//       setNewRole({ name: '', description: '', permissions: [] });
//     }
//   };

//   const handleDeleteRole = (roleId: string) => {
//     const role = roles.find(r => r.id === roleId);
//     if (role && !role.isDefault) {
//       setRoles(roles.filter(r => r.id !== roleId));
//     }
//   };

//   const togglePermission = (permissionId: string) => {
//     const permissions = newRole.permissions.includes(permissionId)
//       ? newRole.permissions.filter(p => p !== permissionId)
//       : [...newRole.permissions, permissionId];
//     setNewRole({ ...newRole, permissions });
//   };

//   const getPermissionsByCategory = () => {
//     return permissions.reduce((acc, permission) => {
//       if (!acc[permission.category]) {
//         acc[permission.category] = [];
//       }
//       acc[permission.category].push(permission);
//       return acc;
//     }, {} as Record<string, Permission[]>);
//   };

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case 'Sales': return '💰';
//       case 'Operations': return '⚙️';
//       case 'Analytics': return '📊';
//       case 'CRM': return '👥';
//       case 'HR': return '👤';
//       case 'Admin': return '🔐';
//       default: return '📋';
//     }
//   };

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isDefault: boolean;
}

interface Permission {
  id: string;
  name: string;
  category: string;
  description: string;
}

const API_BASE = import.meta.env.VITE_API_URL;

export function RoleManagement({ onNavigate }: { onNavigate: (screen: string) => void }) {
  const token = localStorage.getItem('token') || '';
  const restaurantId = localStorage.getItem('restaurantId') || '';
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  async function fetchRoles() {
    const res = await fetch(`${API_BASE}/roles?restaurantId=${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch roles');
    return res.json();
  }

  async function fetchPermissions() {
    const res = await fetch(`${API_BASE}/permissions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch permissions');
    return res.json();
  }

  async function createRole(roleData: { name: string; description: string; permissionIds: string[] }) {
    const res = await fetch(`${API_BASE}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });
    if (!res.ok) throw new Error('Failed to create role');
    return res.json();
  }

  async function updateRole(roleId: string, roleData: { name: string; description: string; permissionIds: string[] }) {
    const res = await fetch(`${API_BASE}/roles/${roleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(roleData),
    });
    if (!res.ok) throw new Error('Failed to update role');
    return res.json();
  }

  async function deleteRole(roleId: string) {
    const res = await fetch(`${API_BASE}/roles/${roleId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete role');
    return res.json();
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [rolesData, permsData] = await Promise.all([fetchRoles(), fetchPermissions()]);
        setRoles(rolesData);
        setPermissions(permsData);
      } catch (error) {
        toast.error(String(error));
      }
    }
    loadData();
  }, []);

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    });
    setIsAddDialogOpen(true);
  };

  const togglePermission = (permId: string) => {
    const perms = newRole.permissions.includes(permId)
      ? newRole.permissions.filter((p) => p !== permId)
      : [...newRole.permissions, permId];
    setNewRole({ ...newRole, permissions: perms });
  };

  
  
  const handleAddRole = async () => {
    if (!newRole.name.trim() || !newRole.description.trim()) {
      toast.error('Role name and description required');
      return;
    }
    try {
      const created = await createRole({
        name: newRole.name,
        description: newRole.description,
        permissionIds: newRole.permissions,
      });
      setRoles((prev) => [...prev, created]);
      toast.success('Role created successfully');
      setIsAddDialogOpen(false);
      resetForm();
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleUpdateRole = async () => {
    if (!editingRole) return;
    try {
      const updated = await updateRole(editingRole.id, {
        name: newRole.name,
        description: newRole.description,
        permissionIds: newRole.permissions,
      });
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success('Role updated');
      setEditingRole(null);
      resetForm();
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error(String(err));
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;
    try {
      await deleteRole(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      toast.success('Role deleted successfully');
      if (editingRole?.id === roleId) {
        setEditingRole(null);
        resetForm();
      }
    } catch (err) {
      toast.error(String(err));
    }
  };

  const editExistingRole = (role: Role) => {
    setEditingRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setNewRole({ name: '', description: '', permissions: [] });
  };

  const getPermissionsByCategory = (): Record<string, Permission[]> => {
    return permissions.reduce((acc, perm) => {
      if (!acc[perm.category]) acc[perm.category] = [];
      acc[perm.category].push(perm);
      return acc;
    }, {} as Record<string, Permission[]>);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sales':
        return '💰';
      case 'Operations':
        return '⚙️';
      case 'Analytics':
        return '📊';
      case 'CRM':
        return '👥';
      case 'HR':
        return '👤';
      case 'Admin':
        return '🔐';
      default:
        return '📋';
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onNavigate('settings')}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary">Role Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingRole ? 'Edit Role' : 'Create New Role'}
              </DialogTitle>
              <DialogDescription>
                {editingRole ? 'Modify role settings and permissions.' : 'Create a new role with specific permissions and access levels.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role Name</label>
                  <Input
                    placeholder="Enter role name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Enter role description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Permissions</h3>
                {Object.entries(getPermissionsByCategory()).map(([category, perms]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span>{getCategoryIcon(category)}</span>
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {perms.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                          <Switch
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingRole(null);
                    setNewRole({ name: '', description: '', permissions: [] });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingRole ? handleUpdateRole : handleAddRole}>
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="relative">
            {role.isDefault && (
              <Badge className="absolute -top-2 right-4 bg-green-600">Default</Badge>
            )}
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{role.userCount} users</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditRole(role)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  {!role.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRole(role.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{role.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Permissions ({role.permissions.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permissionId) => {
                    const permission = permissions.find(p => p.id === permissionId);
                    return (
                      <Badge key={permissionId} variant="secondary" className="text-xs">
                        {permission?.name}
                      </Badge>
                    );
                  })}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      {editingRole && (
        <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Role: {editingRole.name}</DialogTitle>
              <DialogDescription>
                Update the permissions and settings for this role.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role Name</label>
                  <Input
                    placeholder="Enter role name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    placeholder="Enter role description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Permissions</h3>
                {Object.entries(getPermissionsByCategory()).map(([category, perms]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <span>{getCategoryIcon(category)}</span>
                        {category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {perms.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{permission.name}</p>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                          <Switch
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingRole(null);
                    setNewRole({ name: '', description: '', permissions: [] });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateRole}>
                  Update Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
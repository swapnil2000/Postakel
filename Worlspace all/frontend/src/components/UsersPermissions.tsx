import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { MODULE_DEFINITIONS, DEFAULT_PERMISSIONS, usePermissions } from './PermissionContext';
import {
  Users,
  UserPlus,
  Shield,
  Edit,
  Trash2,
  Crown,
  User,
  Search,
  Plus,
  Save,
  X,
  Check,
  ArrowLeft,
  Building2,
  Timer,
  Calendar,
  ClipboardList,
  Target,
  DollarSign,
  Briefcase,
  MessageSquare,
  BarChart3,
  HardDrive,
  FolderOpen,
  Settings as SettingsIcon
} from 'lucide-react';

// Map module IDs to icons
const MODULE_ICONS: { [key: string]: any } = {
  dashboard: Building2,
  timetracker: Timer,
  leave: Calendar,
  tasks: ClipboardList,
  team: Users,
  performance: Target,
  salary: DollarSign,
  payroll: Briefcase,
  announcements: MessageSquare,
  reports: BarChart3,
  assets: HardDrive,
  documents: FolderOpen,
  settings: SettingsIcon
};

// Category colors
const CATEGORY_COLORS: { [key: string]: string } = {
  core: 'bg-blue-100 text-blue-700',
  hr: 'bg-green-100 text-green-700',
  finance: 'bg-yellow-100 text-yellow-700',
  reporting: 'bg-purple-100 text-purple-700',
  admin: 'bg-red-100 text-red-700'
};

interface UserPermission {
  id: number;
  employeeId: number;
  employeeName: string;
  email: string;
  department: string;
  role: 'admin' | 'employee';
  permissions: {
    [moduleKey: string]: {
      actions: {
        view: boolean;
        create: boolean;
        edit: boolean;
        delete: boolean;
        export: boolean;
        manage: boolean;
      };
      dataScope: 'own' | 'department' | 'all';
      subPermissions: { [key: string]: boolean };
    };
  };
}

interface UsersPermissionsProps {
  userRole: 'admin' | 'employee';
  organizationData: any;
  employees?: any[];
}

export function UsersPermissions({ userRole, organizationData, employees = [] }: UsersPermissionsProps) {
  const { userPermissions: currentUserPermissions, initializePermissions } = usePermissions();
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedPermission, setSelectedPermission] = useState<UserPermission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize user permissions from employees data
  useEffect(() => {
    if (employees && employees.length > 0) {
      const employeePermissions: UserPermission[] = employees
        .filter(emp => emp.permissions && Object.keys(emp.permissions).length > 0)
        .map(emp => ({
          id: emp.id,
          employeeId: emp.id,
          employeeName: emp.name,
          email: emp.email,
          department: emp.department || 'Unassigned',
          role: emp.role || 'employee',
          permissions: emp.permissions || (emp.role === 'admin' ? DEFAULT_PERMISSIONS.admin.modules : DEFAULT_PERMISSIONS.employee.modules)
        }));
      
      setUserPermissions(employeePermissions);
    } else {
      // If no employees provided, set empty array
      setUserPermissions([]);
    }
  }, [employees]);

  // Get available employees that don't have permissions assigned yet
  const getAvailableEmployees = () => {
    if (!employees || employees.length === 0) return [];
    
    const assignedEmployeeIds = userPermissions.map(perm => perm.employeeId);
    return employees
      .filter(emp => !assignedEmployeeIds.includes(emp.id))
      .map(emp => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        department: emp.department || 'Unassigned'
      }));
  };

  // Form state for adding/editing
  const [formData, setFormData] = useState({
    employeeId: '',
    role: 'employee' as 'admin' | 'employee',
    permissions: {} as any
  });

  const initializeFormPermissions = (role: 'admin' | 'employee') => {
    if (role === 'admin') {
      return DEFAULT_PERMISSIONS.admin.modules;
    } else {
      return DEFAULT_PERMISSIONS.employee.modules;
    }
  };

  const handleRoleChange = (role: 'admin' | 'employee') => {
    setFormData({
      ...formData,
      role,
      permissions: initializeFormPermissions(role)
    });
  };

  const handlePermissionChange = (moduleKey: string, permissionType: string, value: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [moduleKey]: {
          ...formData.permissions[moduleKey],
          actions: {
            ...formData.permissions[moduleKey]?.actions,
            [permissionType]: value
          }
        }
      }
    });
  };

  const handleDataScopeChange = (moduleKey: string, scope: 'own' | 'department' | 'all') => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [moduleKey]: {
          ...formData.permissions[moduleKey],
          dataScope: scope
        }
      }
    });
  };

  const handleSubPermissionChange = (moduleKey: string, subPermission: string, value: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [moduleKey]: {
          ...formData.permissions[moduleKey],
          subPermissions: {
            ...formData.permissions[moduleKey]?.subPermissions,
            [subPermission]: value
          }
        }
      }
    });
  };

  const handleAdd = () => {
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }

    const employee = getAvailableEmployees().find(emp => emp.id === parseInt(formData.employeeId));
    if (!employee) {
      toast.error('Employee not found');
      return;
    }

    const newPermission: UserPermission = {
      id: Date.now(),
      employeeId: employee.id,
      employeeName: employee.name,
      email: employee.email,
      department: employee.department,
      role: formData.role,
      permissions: formData.permissions
    };

    setUserPermissions([...userPermissions, newPermission]);
    setCurrentView('list');
    setFormData({ employeeId: '', role: 'employee', permissions: {} });
    toast.success('User permissions added successfully');
  };

  const handleEdit = () => {
    if (!selectedPermission) return;

    const updatedPermissions = userPermissions.map(perm =>
      perm.id === selectedPermission.id
        ? { ...selectedPermission, role: formData.role, permissions: formData.permissions }
        : perm
    );

    setUserPermissions(updatedPermissions);
    setCurrentView('list');
    setSelectedPermission(null);
    setFormData({ employeeId: '', role: 'employee', permissions: {} });
    toast.success('User permissions updated successfully');
  };

  const handleDelete = (id: number) => {
    setUserPermissions(userPermissions.filter(perm => perm.id !== id));
    toast.success('User permissions removed successfully');
  };

  const startEdit = (permission: UserPermission) => {
    setSelectedPermission(permission);
    setFormData({
      employeeId: permission.employeeId.toString(),
      role: permission.role,
      permissions: permission.permissions
    });
    setCurrentView('edit');
  };

  const startAdd = () => {
    setFormData({
      employeeId: '',
      role: 'employee',
      permissions: initializeFormPermissions('employee')
    });
    setCurrentView('add');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedPermission(null);
    setFormData({ employeeId: '', role: 'employee', permissions: {} });
  };

  const filteredPermissions = userPermissions.filter(perm =>
    perm.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    perm.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    perm.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const countPermissions = (permissions: any) => {
    let total = 0;
    let granted = 0;
    
    Object.values(permissions).forEach((modulePerms: any) => {
      if (modulePerms.actions) {
        Object.values(modulePerms.actions).forEach((hasPermission: any) => {
          total++;
          if (hasPermission) granted++;
        });
      }
    });
    
    return { granted, total };
  };

  if (userRole !== 'admin') {
    return (
      <div className="container-mobile py-6 pb-24">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only administrators can manage user permissions.</p>
        </div>
      </div>
    );
  }

  // Render Add User Form
  if (currentView === 'add') {
    return (
      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add User Permissions</h1>
              <p className="text-gray-600">Select an employee and configure their role and module permissions</p>
            </div>
          </div>
        </div>

        {/* Check if there are available employees */}
        {getAvailableEmployees().length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Available Employees</h3>
              <p className="text-gray-600 mb-4">All employees already have permissions assigned.</p>
              <Button variant="outline" onClick={handleBack}>
                Back to List
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Add Form */}
            <div className="space-y-6">
              {/* Employee Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee">Select Employee</Label>
                      <Select value={formData.employeeId} onValueChange={(value) => setFormData({ ...formData, employeeId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an employee..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableEmployees().map((employee) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              <div className="flex items-center gap-2">
                                <span>{employee.name}</span>
                                <span className="text-sm text-gray-500">({employee.department})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={formData.role} onValueChange={handleRoleChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">Employee</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle>Module Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(MODULE_DEFINITIONS).map(([moduleKey, module]) => {
                    const ModuleIcon = MODULE_ICONS[moduleKey] || Shield;
                    return (
                      <Card key={moduleKey} className={`p-4 border-l-4 ${CATEGORY_COLORS[module.category] ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${CATEGORY_COLORS[module.category] || 'bg-gray-100 text-gray-700'}`}>
                              <ModuleIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{module.name}</h4>
                              <p className="text-xs text-gray-600">{module.description}</p>
                              <Badge className={`text-xs mt-1 ${CATEGORY_COLORS[module.category] || 'bg-gray-100 text-gray-700'}`}>
                                {module.category}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* CRUD Permissions */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Basic Permissions</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                              {module.availableActions.map((permission) => (
                                <div key={permission} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${moduleKey}-${permission}`}
                                    checked={formData.permissions[moduleKey]?.actions?.[permission] || false}
                                    onCheckedChange={(checked) => handlePermissionChange(moduleKey, permission, checked as boolean)}
                                  />
                                  <Label htmlFor={`${moduleKey}-${permission}`} className="text-sm capitalize">
                                    {permission}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Data Scope */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Data Access Scope</Label>
                            <Select 
                              value={formData.permissions[moduleKey]?.dataScope || 'own'} 
                              onValueChange={(value) => handleDataScopeChange(moduleKey, value as 'own' | 'department' | 'all')}
                            >
                              <SelectTrigger className="w-48">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {module.availableDataScopes.map((scope) => (
                                  <SelectItem key={scope} value={scope}>
                                    {scope === 'own' && 'Own Data Only'}
                                    {scope === 'department' && 'Department Data'}
                                    {scope === 'all' && 'All Company Data'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Sub-Permissions */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Specific Features</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {Object.entries(module.subPermissions || {}).map(([subPermKey, subPermLabel]) => (
                                <div key={subPermKey} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${moduleKey}-sub-${subPermKey}`}
                                    checked={formData.permissions[moduleKey]?.subPermissions?.[subPermKey] || false}
                                    onCheckedChange={(checked) => handleSubPermissionChange(moduleKey, subPermKey, checked as boolean)}
                                  />
                                  <Label htmlFor={`${moduleKey}-sub-${subPermKey}`} className="text-sm">
                                    {subPermLabel}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleBack}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleAdd}>
                  <Save className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Render Edit User Form
  if (currentView === 'edit') {
    return (
      <div className="container-mobile py-6 pb-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit User Permissions</h1>
              <p className="text-gray-600">Modify the role and module permissions for this user</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        {selectedPermission && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {selectedPermission.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedPermission.employeeName}</h3>
                  <p className="text-sm text-gray-600">{selectedPermission.email} • {selectedPermission.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Form */}
        <div className="space-y-6">
          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Module Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(MODULE_DEFINITIONS).map(([moduleKey, module]) => {
                const ModuleIcon = MODULE_ICONS[moduleKey] || Shield;
                return (
                  <Card key={moduleKey} className={`p-4 border-l-4 ${CATEGORY_COLORS[module.category] ? 'border-l-blue-500' : 'border-l-gray-300'}`}>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${CATEGORY_COLORS[module.category] || 'bg-gray-100 text-gray-700'}`}>
                          <ModuleIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{module.name}</h4>
                          <p className="text-xs text-gray-600">{module.description}</p>
                          <Badge className={`text-xs mt-1 ${CATEGORY_COLORS[module.category] || 'bg-gray-100 text-gray-700'}`}>
                            {module.category}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* CRUD Permissions */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Basic Permissions</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          {module.availableActions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-${moduleKey}-${permission}`}
                                checked={formData.permissions[moduleKey]?.actions?.[permission] || false}
                                onCheckedChange={(checked) => handlePermissionChange(moduleKey, permission, checked as boolean)}
                              />
                              <Label htmlFor={`edit-${moduleKey}-${permission}`} className="text-sm capitalize">
                                {permission}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Data Scope */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Data Access Scope</Label>
                        <Select 
                          value={formData.permissions[moduleKey]?.dataScope || 'own'} 
                          onValueChange={(value) => handleDataScopeChange(moduleKey, value as 'own' | 'department' | 'all')}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {module.availableDataScopes.map((scope) => (
                              <SelectItem key={scope} value={scope}>
                                {scope === 'own' && 'Own Data Only'}
                                {scope === 'department' && 'Department Data'}
                                {scope === 'all' && 'All Company Data'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Sub-Permissions */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Specific Features</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {Object.entries(module.subPermissions || {}).map(([subPermKey, subPermLabel]) => (
                            <div key={subPermKey} className="flex items-center space-x-2">
                              <Checkbox
                                id={`edit-${moduleKey}-sub-${subPermKey}`}
                                checked={formData.permissions[moduleKey]?.subPermissions?.[subPermKey] || false}
                                onCheckedChange={(checked) => handleSubPermissionChange(moduleKey, subPermKey, checked as boolean)}
                              />
                              <Label htmlFor={`edit-${moduleKey}-sub-${subPermKey}`} className="text-sm">
                                {subPermLabel}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleBack}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              <Save className="w-4 h-4 mr-2" />
              Update Permissions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render Users List (default view)
  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Users & Permissions</h1>
          <p className="text-gray-600">Manage user roles and module access permissions</p>
        </div>
        <Button onClick={startAdd} disabled={getAvailableEmployees().length === 0}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {filteredPermissions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {userPermissions.length === 0 ? 'No User Permissions Set' : 'No Results Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {userPermissions.length === 0 
                ? 'Start by adding permissions for your employees.'
                : 'Try adjusting your search criteria.'
              }
            </p>
            {userPermissions.length === 0 && getAvailableEmployees().length > 0 && (
              <Button onClick={startAdd}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add First User
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPermissions.map((permission) => {
            const permissionCount = countPermissions(permission.permissions);
            
            return (
              <Card key={permission.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {permission.employeeName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-900">{permission.employeeName}</h3>
                        <p className="text-sm text-gray-600">{permission.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={permission.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                            {permission.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                            {permission.role}
                          </Badge>
                          <Badge className="bg-gray-100 text-gray-700">
                            {permission.department}
                          </Badge>
                          <Badge className="bg-green-100 text-green-700">
                            {permissionCount.granted}/{permissionCount.total} permissions
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => startEdit(permission)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(permission.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
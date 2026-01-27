import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

import { 
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  UserPlus,
  Eye,
  Building2,
  TrendingUp,
  Target,
  Star
} from 'lucide-react';

interface TeamDirectoryProps {
  userRole: string;
  onNavigate: (screen: string) => void;
  employees: any[];
  onUpdateEmployees: (employees: any[]) => void;
}

export function TeamDirectory({ userRole, onNavigate, employees: initialEmployees, onUpdateEmployees }: TeamDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Helper function to safely get numeric values
  const safeNumber = (value: any, defaultValue: number = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // Use only the employees passed from parent component
  const [employees, setEmployees] = useState(initialEmployees);

  // Update local employees when prop changes
  useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  // Sync employees with parent component
  useEffect(() => {
    onUpdateEmployees(employees);
  }, [employees, onUpdateEmployees]);

  // Get available managers (employees with Manager in their title or department heads)
  const getAvailableManagers = () => {
    return employees.filter(emp => 
      emp.role.includes('Manager') || 
      emp.role.includes('Lead') || 
      emp.role.includes('Director') ||
      emp.role.includes('Head')
    );
  };

  // Removed newEmployee state since we're using page-based add employee form

  // Removed handleAddEmployee since we're using page-based form

  const handleEmployeeSelect = (employeeId: number) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleDeleteSelected = () => {
    setEmployees(prev => prev.filter(emp => !selectedEmployees.includes(emp.id)));
    setSelectedEmployees([]);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = (employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (employee.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = !filterStatus || filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];
  const statuses = [...new Set(employees.map(emp => emp.status).filter(Boolean))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'inactive': return 'status-rejected';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Team Directory
          </h1>
          <p className="text-gray-600">Manage your team members and their information</p>
        </div>
        
        {userRole === 'admin' && (
          <div className="flex gap-2">
            <Button onClick={() => onNavigate('add-employee')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
            
            {/* Debug info - temporary */}
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border">
              <div>User Role: {userRole}</div>
              <div>Can Navigate: {typeof onNavigate === 'function' ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {employees.filter(emp => emp.status === 'active').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-purple-600">
                  {employees.length > 0 ? 
                    Math.round(employees.reduce((acc, emp) => acc + safeNumber(emp.performance, 0), 0) / employees.length) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search employees by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedEmployees.length > 0 && userRole === 'admin' && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  {selectedEmployees.length} employee(s) selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setSelectedEmployees([])}>
                    Clear Selection
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Team Members ({filteredEmployees.length})
            </CardTitle>
            {userRole === 'admin' && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <Label className="text-sm">Select All</Label>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`p-4 border rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    selectedEmployees.includes(employee.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    onNavigate(`employee-${employee.id}`);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {userRole === 'admin' && (
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleEmployeeSelect(employee.id);
                          }}
                          className="rounded border-gray-300"
                        />
                      )}
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {employee.avatar || employee.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <Badge className={getStatusColor(employee.status || 'pending')}>
                      {employee.status || 'pending'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name || 'Unknown Employee'}</h3>
                      <p className="text-sm text-gray-600">{employee.role || 'No role assigned'}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="w-4 h-4" />
                      {employee.department || 'No department'}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      {employee.location || 'No location'}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className={`text-sm font-medium ${getPerformanceColor(safeNumber(employee.performance))}`}>
                        {safeNumber(employee.performance)}% Performance
                      </div>
                      <div className="text-xs text-gray-500">{employee.lastActive || 'Never'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    selectedEmployees.includes(employee.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => {
                    onNavigate(`employee-${employee.id}`);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleEmployeeSelect(employee.id);
                      }}
                      className="rounded border-gray-300"
                    />
                    
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {employee.avatar || employee.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{employee.name || 'Unknown Employee'}</h3>
                          <p className="text-sm text-gray-600">{employee.role || 'No role assigned'}</p>
                        </div>
                        
                        <div className="hidden lg:block">
                          <p className="text-sm text-gray-600">{employee.department || 'No department'}</p>
                          <p className="text-xs text-gray-500">{employee.location || 'No location'}</p>
                        </div>
                        
                        <div className="hidden lg:block">
                          <p className="text-sm text-gray-600">{employee.email || 'No email'}</p>
                          <p className="text-xs text-gray-500">ID: {employee.employeeId || 'No ID'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(employee.status || 'pending')}>
                      {employee.status || 'pending'}
                    </Badge>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getPerformanceColor(safeNumber(employee.performance))}`}>
                        {safeNumber(employee.performance)}% Performance
                      </div>
                      <div className="text-xs text-gray-500">{employee.lastActive || 'Never'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
              {userRole === 'admin' && (
                <Button onClick={() => onNavigate('add-employee')}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First Employee
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>


    </div>
  );
}
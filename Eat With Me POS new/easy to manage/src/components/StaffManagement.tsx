import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Switch } from './ui/switch';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  IndianRupee, 
  Search,
  UserCheck,
  Shield,
  Key,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Staff {
  id: string;
  name: string;
  role: 'Manager' | 'Cashier' | 'Waiter' | 'Chef' | 'Helper';
  phone: string;
  email?: string;
  pin: string;
  isActive: boolean;
  joinDate: string;
  salary: number;
  currentShift?: 'Morning' | 'Evening' | 'Night';
  permissions: string[];
  performance: {
    ordersHandled: number;
    avgOrderTime: number;
    customerRating: number;
  };
}

interface Shift {
  id: string;
  staffId: string;
  startTime: string;
  endTime?: string;
  openingCash: number;
  closingCash?: number;
  totalSales: number;
  tips: number;
  date: string;
}

export function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      role: 'Manager',
      phone: '+91 98765 43210',
      email: 'rajesh@restaurant.com',
      pin: '1234',
      isActive: true,
      joinDate: '2023-01-15',
      salary: 35000,
      currentShift: 'Evening',
      permissions: ['pos', 'reports', 'menu', 'staff', 'settings'],
      performance: {
        ordersHandled: 150,
        avgOrderTime: 12,
        customerRating: 4.8
      }
    },
    {
      id: '2',
      name: 'Priya Singh',
      role: 'Cashier',
      phone: '+91 87654 32109',
      email: 'priya@restaurant.com',
      pin: '5678',
      isActive: true,
      joinDate: '2023-03-10',
      salary: 22000,
      currentShift: 'Morning',
      permissions: ['pos', 'reports'],
      performance: {
        ordersHandled: 200,
        avgOrderTime: 8,
        customerRating: 4.6
      }
    },
    {
      id: '3',
      name: 'Amit Patel',
      role: 'Waiter',
      phone: '+91 76543 21098',
      pin: '9012',
      isActive: true,
      joinDate: '2023-05-20',
      salary: 18000,
      currentShift: 'Evening',
      permissions: ['pos'],
      performance: {
        ordersHandled: 180,
        avgOrderTime: 15,
        customerRating: 4.4
      }
    },
    {
      id: '4',
      name: 'Sunita Sharma',
      role: 'Chef',
      phone: '+91 65432 10987',
      pin: '3456',
      isActive: true,
      joinDate: '2023-02-05',
      salary: 28000,
      currentShift: 'Morning',
      permissions: ['kitchen', 'inventory'],
      performance: {
        ordersHandled: 120,
        avgOrderTime: 18,
        customerRating: 4.9
      }
    }
  ]);

  const [shifts, setShifts] = useState<Shift[]>([
    {
      id: '1',
      staffId: '1',
      startTime: '2:00 PM',
      endTime: '10:00 PM',
      openingCash: 5000,
      closingCash: 8500,
      totalSales: 25000,
      tips: 500,
      date: '2024-01-15'
    },
    {
      id: '2',
      staffId: '2',
      startTime: '9:00 AM',
      endTime: '5:00 PM',
      openingCash: 3000,
      closingCash: 4200,
      totalSales: 18000,
      tips: 300,
      date: '2024-01-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const roles = ['Manager', 'Cashier', 'Waiter', 'Chef', 'Helper'];
  const permissions = [
    { id: 'pos', label: 'POS System' },
    { id: 'reports', label: 'Reports' },
    { id: 'menu', label: 'Menu Management' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'kitchen', label: 'Kitchen Display' },
    { id: 'staff', label: 'Staff Management' },
    { id: 'settings', label: 'Settings' }
  ];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Manager': return 'bg-purple-500';
      case 'Cashier': return 'bg-blue-500';
      case 'Waiter': return 'bg-green-500';
      case 'Chef': return 'bg-orange-500';
      case 'Helper': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'Morning': return 'bg-yellow-100 text-yellow-800';
      case 'Evening': return 'bg-blue-100 text-blue-800';
      case 'Night': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    totalStaff: staff.length,
    activeStaff: staff.filter(s => s.isActive).length,
    onDuty: staff.filter(s => s.currentShift).length,
    avgSalary: Math.round(staff.reduce((sum, s) => sum + s.salary, 0) / staff.length)
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff roles, shifts, and permissions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter staff name" />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="staff@restaurant.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pin">Login PIN</Label>
                  <Input id="pin" type="password" placeholder="4-digit PIN" maxLength={4} />
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input id="salary" type="number" placeholder="Monthly salary" />
                </div>
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {permissions.map(perm => (
                    <div key={perm.id} className="flex items-center space-x-2">
                      <input type="checkbox" id={perm.id} />
                      <Label htmlFor={perm.id} className="text-sm">{perm.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Add Staff</Button>
                <Button variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalStaff}</div>
          <div className="text-sm text-muted-foreground">Total Staff</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activeStaff}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.onDuty}</div>
          <div className="text-sm text-muted-foreground">On Duty</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">₹{stats.avgSalary.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Avg Salary</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search staff by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Staff Management Tabs */}
      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="staff">Staff Members</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff" className="space-y-4">
          <div className="space-y-4">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`${getRoleColor(member.role)} text-white`}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge className={`${getRoleColor(member.role)} text-white`}>
                          {member.role}
                        </Badge>
                        {member.currentShift && (
                          <Badge className={getShiftColor(member.currentShift)}>
                            {member.currentShift}
                          </Badge>
                        )}
                        {!member.isActive && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{member.phone}</span>
                        <span>Joined: {member.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">₹{member.salary.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Monthly</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{member.performance.customerRating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit {member.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="editName">Name</Label>
                                <Input id="editName" defaultValue={member.name} />
                              </div>
                              <div>
                                <Label htmlFor="editRole">Role</Label>
                                <Select defaultValue={member.role}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.map(role => (
                                      <SelectItem key={role} value={role}>{role}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="editPin">Login PIN</Label>
                                <Input id="editPin" type="password" defaultValue={member.pin} />
                              </div>
                              <div>
                                <Label htmlFor="editSalary">Salary</Label>
                                <Input id="editSalary" type="number" defaultValue={member.salary} />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="active" defaultChecked={member.isActive} />
                              <Label htmlFor="active">Active Status</Label>
                            </div>
                            <div>
                              <Label>Permissions</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {permissions.map(perm => (
                                  <div key={perm.id} className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox" 
                                      id={`edit-${perm.id}`}
                                      defaultChecked={member.permissions.includes(perm.id)}
                                    />
                                    <Label htmlFor={`edit-${perm.id}`} className="text-sm">{perm.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button className="flex-1">Update</Button>
                              <Button variant="outline" className="flex-1">Cancel</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="shifts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Today's Shifts</h3>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
          </div>
          
          <div className="space-y-4">
            {shifts.map((shift) => {
              const staffMember = staff.find(s => s.id === shift.staffId);
              return (
                <Card key={shift.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className={`${getRoleColor(staffMember?.role || 'Helper')} text-white`}>
                          {staffMember?.name.split(' ').map(n => n[0]).join('') || 'NA'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">{staffMember?.name}</h4>
                        <div className="text-sm text-muted-foreground">
                          {shift.startTime} - {shift.endTime || 'Ongoing'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">Opening</div>
                        <div className="text-sm text-muted-foreground">₹{shift.openingCash}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Sales</div>
                        <div className="text-sm text-primary font-bold">₹{shift.totalSales.toLocaleString()}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">Tips</div>
                        <div className="text-sm text-green-600">₹{shift.tips}</div>
                      </div>
                      {shift.endTime ? (
                        <Badge variant="outline" className="text-green-600">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="space-y-4">
            {staff.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className={`${getRoleColor(member.role)} text-white`}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{member.performance.ordersHandled}</div>
                      <div className="text-xs text-muted-foreground">Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{member.performance.avgOrderTime}m</div>
                      <div className="text-xs text-muted-foreground">Avg Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{member.performance.customerRating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                      <div className="text-xs text-muted-foreground">Trend</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
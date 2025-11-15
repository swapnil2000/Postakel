import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Users,
  Plus,
  Edit,
  Clock,
  IndianRupee,
  Star,
  Calendar,
  TrendingUp,
  Award,
  Target,
  CheckCircle,
  XCircle,
  Coffee,
  Timer,
  DollarSign,
  BarChart3,
  Gift,
  Settings
} from 'lucide-react';

export function SalonStaffManagement() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const staff = [
    {
      id: 1,
      name: 'Maya Patel',
      role: 'Senior Hair Specialist',
      email: 'maya.patel@salon.com',
      phone: '+91 98765 43210',
      joinDate: '2023-01-15',
      employeeId: 'EMP001',
      status: 'active',
      avatar: 'MP',
      specialties: ['Hair Cutting', 'Hair Coloring', 'Hair Treatment'],
      rating: 4.9,
      totalServices: 245,
      monthlyTarget: 50,
      monthlyAchieved: 42,
      salary: {
        type: 'hybrid',
        fixedAmount: 25000,
        commissionRate: 8,
        totalEarnings: 38400
      },
      attendance: {
        present: 22,
        absent: 2,
        late: 1,
        totalWorkingDays: 25
      },
      performance: {
        customerRating: 4.9,
        repeatCustomers: 85,
        revenue: 156000,
        tips: 8500
      }
    },
    {
      id: 2,
      name: 'Riya Singh',
      role: 'Skin Care Specialist',
      email: 'riya.singh@salon.com',
      phone: '+91 98765 43211',
      joinDate: '2023-03-20',
      employeeId: 'EMP002',
      status: 'active',
      avatar: 'RS',
      specialties: ['Facial Treatments', 'Skin Analysis', 'Anti-Aging'],
      rating: 4.8,
      totalServices: 189,
      monthlyTarget: 40,
      monthlyAchieved: 38,
      salary: {
        type: 'commission',
        fixedAmount: 0,
        commissionRate: 12,
        totalEarnings: 28800
      },
      attendance: {
        present: 24,
        absent: 1,
        late: 0,
        totalWorkingDays: 25
      },
      performance: {
        customerRating: 4.8,
        repeatCustomers: 78,
        revenue: 120000,
        tips: 6200
      }
    },
    {
      id: 3,
      name: 'Deepa Kumar',
      role: 'Massage Therapist',
      email: 'deepa.kumar@salon.com',
      phone: '+91 98765 43212',
      joinDate: '2023-06-10',
      employeeId: 'EMP003',
      status: 'active',
      avatar: 'DK',
      specialties: ['Body Massage', 'Aromatherapy', 'Reflexology'],
      rating: 4.9,
      totalServices: 156,
      monthlyTarget: 35,
      monthlyAchieved: 35,
      salary: {
        type: 'fixed',
        fixedAmount: 22000,
        commissionRate: 0,
        totalEarnings: 22000
      },
      attendance: {
        present: 25,
        absent: 0,
        late: 0,
        totalWorkingDays: 25
      },
      performance: {
        customerRating: 4.9,
        repeatCustomers: 92,
        revenue: 98000,
        tips: 7800
      }
    },
    {
      id: 4,
      name: 'Sunita Rao',
      role: 'Nail Technician',
      email: 'sunita.rao@salon.com',
      phone: '+91 98765 43213',
      joinDate: '2023-08-15',
      employeeId: 'EMP004',
      status: 'active',
      avatar: 'SR',
      specialties: ['Manicure', 'Pedicure', 'Nail Art'],
      rating: 4.7,
      totalServices: 198,
      monthlyTarget: 45,
      monthlyAchieved: 44,
      salary: {
        type: 'hybrid',
        fixedAmount: 18000,
        commissionRate: 10,
        totalEarnings: 25600
      },
      attendance: {
        present: 23,
        absent: 2,
        late: 2,
        totalWorkingDays: 25
      },
      performance: {
        customerRating: 4.7,
        repeatCustomers: 72,
        revenue: 76000,
        tips: 4200
      }
    }
  ];

  const attendanceLog = [
    { date: '2024-01-15', staff: 'Maya Patel', punchIn: '09:00', punchOut: '18:30', totalHours: 9.5, status: 'present' },
    { date: '2024-01-15', staff: 'Riya Singh', punchIn: '09:15', punchOut: '18:45', totalHours: 9.5, status: 'late' },
    { date: '2024-01-15', staff: 'Deepa Kumar', punchIn: '08:55', punchOut: '18:25', totalHours: 9.5, status: 'present' },
    { date: '2024-01-15', staff: 'Sunita Rao', punchIn: null, punchOut: null, totalHours: 0, status: 'absent' }
  ];

  const shifts = [
    { id: 1, name: 'Morning Shift', startTime: '09:00', endTime: '14:00', staff: ['Maya Patel', 'Riya Singh'] },
    { id: 2, name: 'Afternoon Shift', startTime: '14:00', endTime: '19:00', staff: ['Deepa Kumar', 'Sunita Rao'] },
    { id: 3, name: 'Full Day', startTime: '09:00', endTime: '18:00', staff: ['Maya Patel', 'Deepa Kumar'] }
  ];

  const totalStaff = staff.length;
  const presentToday = staff.filter(s => s.attendance.present >= 20).length;
  const totalRevenue = staff.reduce((sum, s) => sum + s.performance.revenue, 0);
  const totalSalary = staff.reduce((sum, s) => sum + s.salary.totalEarnings, 0);

  const getAttendancePercentage = (member: any) => {
    return (member.attendance.present / member.attendance.totalWorkingDays) * 100;
  };

  const getTargetPercentage = (member: any) => {
    return (member.monthlyAchieved / member.monthlyTarget) * 100;
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Staff Management
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold text-blue-600">{totalStaff}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold text-green-600">{presentToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">₹{(totalRevenue / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Salaries</p>
                <p className="text-2xl font-bold text-orange-600">₹{(totalSalary / 1000).toFixed(0)}k</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-white">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{member.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                      {member.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Target</span>
                      <span className="text-sm font-medium">
                        {member.monthlyAchieved}/{member.monthlyTarget}
                      </span>
                    </div>
                    <Progress value={getTargetPercentage(member)} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Attendance</span>
                      <span className="text-sm font-medium">
                        {getAttendancePercentage(member).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={getAttendancePercentage(member)} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Services</p>
                      <p className="font-medium">{member.totalServices}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium">₹{(member.performance.revenue / 1000).toFixed(0)}k</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.slice(0, 2).map((specialty) => (
                        <Badge key={specialty} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {member.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedStaff(member)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceLog.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-white">
                          {log.staff.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{log.staff}</p>
                        <p className="text-sm text-muted-foreground">{log.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Punch In</p>
                        <p className="font-medium">{log.punchIn || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Punch Out</p>
                        <p className="font-medium">{log.punchOut || 'N/A'}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Hours</p>
                        <p className="font-medium">{log.totalHours}h</p>
                      </div>
                      <Badge
                        variant={log.status === 'present' ? 'default' : log.status === 'late' ? 'secondary' : 'destructive'}
                      >
                        {log.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staff.map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-secondary-foreground text-white">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            <span>{member.attendance.present}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-red-600">
                            <XCircle className="w-4 h-4" />
                            <span>{member.attendance.absent}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-orange-600">
                            <Clock className="w-4 h-4" />
                            <span>{member.attendance.late}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Leave Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Riya Singh</span>
                      <Badge variant="secondary">Sick Leave</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Jan 18-19, 2024</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Maya Patel</span>
                      <Badge variant="outline">Personal Leave</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Jan 22, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {staff.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-white">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Star className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                      <p className="font-bold text-blue-600">{member.performance.customerRating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-1" />
                      <p className="font-bold text-green-600">{member.performance.repeatCustomers}%</p>
                      <p className="text-xs text-muted-foreground">Repeat Rate</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-bold text-primary">₹{(member.performance.revenue / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tips</p>
                      <p className="font-bold text-secondary-foreground">₹{member.performance.tips.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Target Achievement</span>
                      <span className="text-sm font-medium">
                        {getTargetPercentage(member).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={getTargetPercentage(member)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="salary" className="space-y-6">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-white">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {member.salary.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {member.salary.fixedAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Fixed Salary</span>
                        <span className="font-medium">₹{member.salary.fixedAmount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {member.salary.commissionRate > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Commission ({member.salary.commissionRate}%)</span>
                        <span className="font-medium">
                          ₹{((member.performance.revenue * member.salary.commissionRate) / 100).toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Tips</span>
                      <span className="font-medium">₹{member.performance.tips.toLocaleString()}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-border/50">
                      <div className="flex justify-between font-bold">
                        <span>Total Earnings</span>
                        <span className="text-primary">₹{member.salary.totalEarnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Payslip
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shifts.map((shift) => (
              <Card key={shift.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    {shift.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {shift.startTime} - {shift.endTime}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Assigned Staff</p>
                    {shift.staff.map((staffName) => (
                      <div key={staffName} className="flex items-center gap-3 p-2 bg-accent/30 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-secondary-foreground text-white text-sm">
                            {staffName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{staffName}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
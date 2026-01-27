import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart3,
  Download,
  Filter,
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  FileText,
  Eye,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface ReportsProps {
  userRole: string;
  currentUser?: any;
  employees?: any[];
  appData?: any;
  companySettings?: any;
}

export function Reports({ 
  userRole,
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  appData = {},
  companySettings = {}
}: ReportsProps) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Generate reports from real data
  const getAttendanceData = () => {
    const totalEmployees = employees.length;
    const timeSessions = appData.timeTracking?.sessions || [];
    const today = new Date().toISOString().split('T')[0];
    
    const todaySessions = timeSessions.filter((session: any) => session.date === today);
    const presentToday = todaySessions.filter((session: any) => session.status === 'active' || session.status === 'completed').length;
    const lateArrivals = todaySessions.filter((session: any) => session.isLate).length;
    
    // Calculate average attendance from all sessions
    const uniqueDates = [...new Set(timeSessions.map((session: any) => session.date))];
    const averageAttendance = uniqueDates.length > 0 
      ? (timeSessions.filter((session: any) => session.status !== 'absent').length / (uniqueDates.length * totalEmployees)) * 100
      : 0;
      
    // Calculate average hours per day
    const completedSessions = timeSessions.filter((session: any) => session.status === 'completed');
    const averageHoursPerDay = completedSessions.length > 0 
      ? completedSessions.reduce((sum: number, session: any) => sum + (session.totalWorked / 60), 0) / completedSessions.length
      : 0;

    return {
      summary: {
        totalEmployees,
        presentToday,
        averageAttendance: Math.round(averageAttendance * 10) / 10,
        lateArrivals,
        earlyDepartures: 0, // Not tracked yet
        averageHoursPerDay: Math.round(averageHoursPerDay * 10) / 10
      },
      trends: uniqueDates.slice(-5).map(date => {
        const dateSessions = timeSessions.filter((session: any) => session.date === date);
        return {
          date,
          present: dateSessions.filter((session: any) => session.status !== 'absent').length,
          absent: dateSessions.filter((session: any) => session.status === 'absent').length,
          late: dateSessions.filter((session: any) => session.isLate).length
        };
      }),
      byDepartment: [...new Set(employees.map(emp => emp.department))].map(dept => {
        const deptEmployees = employees.filter(emp => emp.department === dept);
        const deptSessions = timeSessions.filter((session: any) => 
          deptEmployees.some(emp => emp.id.toString() === session.employeeId)
        );
        const attendance = deptSessions.length > 0 
          ? (deptSessions.filter((session: any) => session.status !== 'absent').length / deptSessions.length) * 100
          : 0;
        
        return {
          department: dept || 'General',
          attendance: Math.round(attendance),
          employees: deptEmployees.length
        };
      })
    };
  };

  const attendanceData = getAttendanceData();

  const getLeaveData = () => {
    const leaveRequests = appData.leave?.requests || [];
    const totalRequests = leaveRequests.length;
    const approved = leaveRequests.filter((req: any) => req.status === 'approved').length;
    const pending = leaveRequests.filter((req: any) => req.status === 'pending').length;
    const rejected = leaveRequests.filter((req: any) => req.status === 'rejected').length;
    const approvalRate = totalRequests > 0 ? (approved / totalRequests) * 100 : 0;
    
    // Group by leave type
    const leaveTypes = appData.leave?.leaveTypes || [];
    const byType = leaveTypes.map((type: any) => {
      const typeRequests = leaveRequests.filter((req: any) => req.leaveType === type.id);
      const used = typeRequests.reduce((sum: number, req: any) => sum + (req.days || 0), 0);
      const total = employees.length * (type.allowancePerYear || 0);
      const percentage = total > 0 ? (used / total) * 100 : 0;
      
      return {
        type: type.name,
        used,
        total,
        percentage: Math.round(percentage * 10) / 10
      };
    });

    return {
      summary: {
        totalRequests,
        approved,
        pending,
        rejected,
        approvalRate: Math.round(approvalRate * 10) / 10,
        averageProcessingTime: 2.0 // Default value
      },
      byType,
      trends: [] // Would need historical data
    };
  };

  const leaveData = getLeaveData();

  const getTaskData = () => {
    const tasks = appData.tasks?.tasks || [];
    const totalTasks = tasks.length;
    const completed = tasks.filter((task: any) => task.status === 'done').length;
    const inProgress = tasks.filter((task: any) => task.status === 'inprogress').length;
    
    // Calculate overdue tasks
    const today = new Date();
    const overdue = tasks.filter((task: any) => {
      if (task.status === 'done') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).length;
    
    const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;
    
    // Group by priority
    const priorities = ['high', 'medium', 'low'];
    const byPriority = priorities.map(priority => {
      const priorityTasks = tasks.filter((task: any) => task.priority === priority);
      const priorityCompleted = priorityTasks.filter((task: any) => task.status === 'done').length;
      const percentage = priorityTasks.length > 0 ? (priorityCompleted / priorityTasks.length) * 100 : 0;
      
      return {
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        total: priorityTasks.length,
        completed: priorityCompleted,
        percentage: Math.round(percentage * 10) / 10
      };
    });

    return {
      summary: {
        totalTasks,
        completed,
        inProgress,
        overdue,
        completionRate: Math.round(completionRate * 10) / 10,
        averageCompletionTime: 4.0 // Default value
      },
      byPriority,
      byDepartment: [...new Set(employees.map(emp => emp.department))].map(dept => {
        const deptEmployees = employees.filter(emp => emp.department === dept);
        const deptTasks = tasks.filter((task: any) => 
          deptEmployees.some(emp => emp.name === task.assignee || emp.name === task.employeeName)
        );
        const deptCompleted = deptTasks.filter((task: any) => task.status === 'done').length;
        const rate = deptTasks.length > 0 ? (deptCompleted / deptTasks.length) * 100 : 0;
        
        return {
          department: dept || 'General',
          completed: deptCompleted,
          total: deptTasks.length,
          rate: Math.round(rate * 10) / 10
        };
      })
    };
  };

  const taskData = getTaskData();

  const getPayrollData = () => {
    const salaryData = appData.salary || {};
    const employeeSalaries = salaryData.employeeSalaries || employees.map(emp => ({ totalSalary: emp.salary || 0 }));
    const totalPayroll = employeeSalaries.reduce((sum: number, emp: any) => sum + (emp.totalSalary || 0), 0);
    const averageSalary = employeeSalaries.length > 0 ? totalPayroll / employeeSalaries.length : 0;
    
    const byDepartment = [...new Set(employees.map(emp => emp.department))].map(dept => {
      const deptEmployees = employees.filter(emp => emp.department === dept);
      const deptSalaries = deptEmployees.map(emp => emp.salary || 0);
      const totalPay = deptSalaries.reduce((sum, salary) => sum + salary, 0);
      const avgPay = deptEmployees.length > 0 ? totalPay / deptEmployees.length : 0;
      
      return {
        department: dept || 'General',
        employees: deptEmployees.length,
        totalPay,
        avgPay: Math.round(avgPay)
      };
    });

    return {
      summary: {
        totalPayroll,
        averageSalary: Math.round(averageSalary),
        totalDeductions: Math.round(totalPayroll * 0.15), // Estimated 15%
        netPayroll: Math.round(totalPayroll * 0.85),
        overtimeHours: 0, // Would need time tracking data
        overtimePay: 0
      },
      byDepartment,
      trends: [] // Would need historical payroll data
    };
  };

  const payrollData = getPayrollData();

  const departments = ['all', 'Engineering', 'Design', 'Marketing', 'Sales', 'HR'];
  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const exportReport = (type: string) => {
    console.log(`Exporting ${type} report`);
    // Handle report export logic
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <Card className="stats-card">
      <div className="flex items-center justify-between">
        <div>
          <div className="stats-value">{value}</div>
          <div className="stats-label">{title}</div>
          {change && (
            <div className={`flex items-center gap-1 text-sm mt-1 ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
               trend === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
              <span>{change}</span>
            </div>
          )}
        </div>
        <Icon className={`w-6 h-6 ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 'text-blue-600'
        }`} />
      </div>
    </Card>
  );

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive business insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="hr-card">
        <CardContent className="p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="form-label">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="form-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="form-label">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="form-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <div>
                <Label className="form-label">Custom Date</Label>
                <Input type="date" className="form-input" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        {/* Attendance Reports */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Attendance Analytics</h2>
            <Button 
              onClick={() => exportReport('attendance')}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Average Attendance"
              value={`${attendanceData.summary.averageAttendance}%`}
              change="+2.3%"
              trend="up"
              icon={Users}
            />
            <StatCard
              title="Present Today"
              value={`${attendanceData.summary.presentToday}/${attendanceData.summary.totalEmployees}`}
              change="87.5%"
              icon={CheckCircle}
            />
            <StatCard
              title="Late Arrivals"
              value={attendanceData.summary.lateArrivals}
              change="-15%"
              trend="down"
              icon={Clock}
            />
            <StatCard
              title="Avg Hours/Day"
              value={`${attendanceData.summary.averageHoursPerDay}h`}
              change="+0.2h"
              trend="up"
              icon={Activity}
            />
            <StatCard
              title="Early Departures"
              value={attendanceData.summary.earlyDepartures}
              change="6.25%"
              icon={AlertCircle}
            />
            <StatCard
              title="Attendance Rate"
              value="89.5%"
              change="+1.2%"
              trend="up"
              icon={Target}
            />
          </div>

          {/* Department Breakdown */}
          <Card className="hr-card">
            <CardHeader>
              <CardTitle>Attendance by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceData.byDepartment.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                      <p className="text-sm text-gray-600">{dept.employees} employees</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{dept.attendance}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${dept.attendance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Trends */}
          <Card className="hr-card">
            <CardHeader>
              <CardTitle>Weekly Attendance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {attendanceData.trends.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-green-600 font-bold">{day.present}</div>
                        <div className="text-gray-500">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-red-600 font-bold">{day.absent}</div>
                        <div className="text-gray-500">Absent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-600 font-bold">{day.late}</div>
                        <div className="text-gray-500">Late</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Reports */}
        <TabsContent value="leave" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Leave Analytics</h2>
            <Button 
              onClick={() => exportReport('leave')}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Leave Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Requests"
              value={leaveData.summary.totalRequests}
              change="+12%"
              trend="up"
              icon={FileText}
            />
            <StatCard
              title="Approval Rate"
              value={`${leaveData.summary.approvalRate}%`}
              change="+3.2%"
              trend="up"
              icon={CheckCircle}
            />
            <StatCard
              title="Pending Requests"
              value={leaveData.summary.pending}
              change="-5"
              trend="down"
              icon={Clock}
            />
            <StatCard
              title="Avg Processing"
              value={`${leaveData.summary.averageProcessingTime} days`}
              change="-0.5 days"
              trend="down"
              icon={Activity}
            />
            <StatCard
              title="Rejected"
              value={leaveData.summary.rejected}
              change="3.8%"
              icon={AlertCircle}
            />
            <StatCard
              title="Approved"
              value={leaveData.summary.approved}
              change="+8%"
              trend="up"
              icon={Target}
            />
          </div>

          {/* Leave by Type */}
          <Card className="hr-card">
            <CardHeader>
              <CardTitle>Leave Utilization by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveData.byType.map((type, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900">{type.type}</h4>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {type.percentage}% used
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Used: {type.used} days</span>
                      <span>Total: {type.total} days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Task Reports */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Task Analytics</h2>
            <Button 
              onClick={() => exportReport('tasks')}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Completion Rate"
              value={`${taskData.summary.completionRate}%`}
              change="+5.2%"
              trend="up"
              icon={Target}
            />
            <StatCard
              title="Total Tasks"
              value={taskData.summary.totalTasks}
              change="+18"
              trend="up"
              icon={FileText}
            />
            <StatCard
              title="Completed"
              value={taskData.summary.completed}
              change="+15"
              trend="up"
              icon={CheckCircle}
            />
            <StatCard
              title="In Progress"
              value={taskData.summary.inProgress}
              change="+3"
              trend="up"
              icon={Activity}
            />
            <StatCard
              title="Overdue"
              value={taskData.summary.overdue}
              change="-8"
              trend="down"
              icon={AlertCircle}
            />
            <StatCard
              title="Avg Completion"
              value={`${taskData.summary.averageCompletionTime} days`}
              change="-0.8 days"
              trend="down"
              icon={Clock}
            />
          </div>

          {/* Task Completion by Department */}
          <Card className="hr-card">
            <CardHeader>
              <CardTitle>Task Completion by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taskData.byDepartment.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                      <p className="text-sm text-gray-600">{dept.completed}/{dept.total} tasks completed</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{dept.rate}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${dept.rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payroll Reports */}
        <TabsContent value="payroll" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Payroll Analytics</h2>
            <Button 
              onClick={() => exportReport('payroll')}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Payroll Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Payroll"
              value={`$${(payrollData.summary.totalPayroll / 1000).toFixed(0)}K`}
              change="+3.2%"
              trend="up"
              icon={DollarSign}
            />
            <StatCard
              title="Average Salary"
              value={`$${(payrollData.summary.averageSalary / 1000).toFixed(1)}K`}
              change="+2.1%"
              trend="up"
              icon={Users}
            />
            <StatCard
              title="Net Payroll"
              value={`$${(payrollData.summary.netPayroll / 1000).toFixed(0)}K`}
              change="+2.8%"
              trend="up"
              icon={CheckCircle}
            />
            <StatCard
              title="Total Deductions"
              value={`$${(payrollData.summary.totalDeductions / 1000).toFixed(0)}K`}
              change="+5.2%"
              trend="up"
              icon={AlertCircle}
            />
            <StatCard
              title="Overtime Hours"
              value={payrollData.summary.overtimeHours}
              change="+12 hrs"
              trend="up"
              icon={Clock}
            />
            <StatCard
              title="Overtime Pay"
              value={`$${(payrollData.summary.overtimePay / 1000).toFixed(1)}K`}
              change="+15.2%"
              trend="up"
              icon={Activity}
            />
          </div>

          {/* Payroll by Department */}
          <Card className="hr-card">
            <CardHeader>
              <CardTitle>Payroll by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollData.byDepartment.map((dept, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{dept.department}</h4>
                      <p className="text-sm text-gray-600">{dept.employees} employees</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">${(dept.totalPay / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-gray-600">Avg: ${(dept.avgPay / 1000).toFixed(1)}K</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
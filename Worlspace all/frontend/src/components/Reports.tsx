import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
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
import { parseToDate, formatYMD, formatLocale, normalizeToYMD } from '../utils/date';
import {
  endOfDay,
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  subMonths
} from 'date-fns';

interface ReportsProps {
  userRole: string;
  currentUser?: any;
  employees?: any[];
  appData?: any;
  companySettings?: any;
  onRefresh?: () => Promise<{ employees?: any[]; appData?: any } | void>;
}

export function Reports({ 
  userRole,
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  appData = {},
  companySettings = {},
  onRefresh
}: ReportsProps) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const [localEmployees, setLocalEmployees] = useState(employees);
  const [localAppData, setLocalAppData] = useState(appData);
  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  useEffect(() => {
    setLocalEmployees(employees);
    setLocalAppData(appData);
  }, [employees, appData]);

  useEffect(() => {
    if (dateRange !== 'custom') {
      setCustomDateRange({ start: '', end: '' });
    }
  }, [dateRange]);

  const filteredEmployees = useMemo(() => {
    if (selectedDepartment === 'all') return localEmployees;
    return localEmployees.filter(emp => emp.department === selectedDepartment);
  }, [localEmployees, selectedDepartment]);

  const dateBounds = useMemo(() => {
    const now = new Date();
    const bounds: { start: Date | null; end: Date | null } = { start: null, end: null };
    switch (dateRange) {
      case 'today':
        bounds.start = startOfDay(now);
        bounds.end = endOfDay(now);
        break;
      case 'this_week':
        bounds.start = startOfWeek(now, { weekStartsOn: 1 });
        bounds.end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'this_month':
        bounds.start = startOfMonth(now);
        bounds.end = endOfMonth(now);
        break;
      case 'last_month': {
        const lastMonth = subMonths(now, 1);
        bounds.start = startOfMonth(lastMonth);
        bounds.end = endOfMonth(lastMonth);
        break;
      }
      case 'this_quarter':
        bounds.start = startOfQuarter(now);
        bounds.end = endOfQuarter(now);
        break;
      case 'custom': {
        const startInput = customDateRange.start ? parseToDate(customDateRange.start) : null;
        const endInput = customDateRange.end ? parseToDate(customDateRange.end) : null;
        if (startInput) bounds.start = startOfDay(startInput);
        if (endInput) bounds.end = endOfDay(endInput);
        break;
      }
      default:
        break;
    }
    return bounds;
  }, [dateRange, customDateRange]);

  const { start: rangeStart, end: rangeEnd } = dateBounds;

  const normalizeId = (value: any) => (value != null ? value.toString() : null);

  const matchesDepartmentFilter = useCallback(
    (employeeId?: string | number, employeeName?: string) => {
      if (selectedDepartment === 'all') return true;
      return filteredEmployees.some(emp => {
        const empId = normalizeId(emp.id);
        const targetId = normalizeId(employeeId);
        const idMatches = empId && targetId && empId === targetId;
        const nameMatches = employeeName ? emp.name === employeeName : false;
        return idMatches || nameMatches;
      });
    },
    [filteredEmployees, selectedDepartment]
  );

  const isWithinDateRange = useCallback(
    (value: any) => {
      if (!rangeStart && !rangeEnd) return true;
      const dateValue = parseToDate(value);
      if (!dateValue) return false;
      if (rangeStart && dateValue < rangeStart) return false;
      if (rangeEnd && dateValue > rangeEnd) return false;
      return true;
    },
    [rangeStart, rangeEnd]
  );

  const handleRefresh = useCallback(async () => {
    if (onRefresh) {
      try {
        const res = await onRefresh();
        if (res) {
          if (res.employees) setLocalEmployees(res.employees);
          if (res.appData) setLocalAppData(res.appData);
          console.log('Reports: data refreshed', {
            employees: Array.isArray(res.employees) ? res.employees.length : !!res.employees,
            appDataKeys: res.appData ? Object.keys(res.appData) : null,
            at: new Date().toISOString()
          });
          return;
        }
      } catch (e) {
        console.error('onRefresh failed', e);
      }
    }
    setRefreshKey(k => k + 1);
    console.log('Reports: fallback refresh triggered (refreshKey incremented) at', new Date().toISOString());
  }, [onRefresh]);

  // Generate reports from real data
  const getAttendanceData = () => {
    const totalEmployees = filteredEmployees.length;
    const timeSessions = localAppData.timeTracking?.sessions || [];
    const filteredSessions = timeSessions.filter((session: any) => {
      const matchesDepartment = matchesDepartmentFilter(session.employeeId, session.employeeName);
      return matchesDepartment && isWithinDateRange(session.date);
    });
    const today = formatYMD(new Date());

    const todaySessions = filteredSessions.filter((session: any) => normalizeToYMD(session.date) === today);
    const presentToday = todaySessions.filter((session: any) => session.status === 'active' || session.status === 'completed').length;
    const lateArrivals = todaySessions.filter((session: any) => session.isLate).length;
    
    const uniqueDates = [...new Set(filteredSessions.map((session: any) => normalizeToYMD(session.date)).filter(Boolean))];
    const averageAttendance = uniqueDates.length > 0 && totalEmployees > 0
      ? (filteredSessions.filter((session: any) => session.status !== 'absent').length / (uniqueDates.length * totalEmployees)) * 100
      : 0;
      
    const completedSessions = filteredSessions.filter((session: any) => session.status === 'completed');
    const averageHoursPerDay = completedSessions.length > 0 
      ? completedSessions.reduce((sum: number, session: any) => sum + (session.totalWorked / 60), 0) / completedSessions.length
      : 0;

    const departmentList = [...new Set(filteredEmployees.map(emp => emp.department))];

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
        const dateSessions = filteredSessions.filter((session: any) => normalizeToYMD(session.date) === date);
        return {
          date,
          present: dateSessions.filter((session: any) => session.status !== 'absent').length,
          absent: dateSessions.filter((session: any) => session.status === 'absent').length,
          late: dateSessions.filter((session: any) => session.isLate).length
        };
      }),
      byDepartment: departmentList.map(dept => {
        const deptEmployees = filteredEmployees.filter(emp => emp.department === dept);
        const deptSessions = filteredSessions.filter((session: any) => {
          const targetId = normalizeId(session.employeeId);
          return deptEmployees.some(emp => normalizeId(emp.id) === targetId);
        });
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
    const leaveRequests = localAppData.leave?.requests || [];
    const filteredRequests = leaveRequests.filter((req: any) => {
      const matchesDepartment = matchesDepartmentFilter(req.employeeId ?? req.employee?.id, req.employeeName ?? req.employee?.name);
      if (!matchesDepartment) return false;
      const requestDate = req.startDate ?? req.requestedAt ?? req.createdAt ?? req.date ?? req.from;
      return isWithinDateRange(requestDate);
    });
    const totalRequests = filteredRequests.length;
    const approved = filteredRequests.filter((req: any) => req.status === 'approved').length;
    const pending = filteredRequests.filter((req: any) => req.status === 'pending').length;
    const rejected = filteredRequests.filter((req: any) => req.status === 'rejected').length;
    const approvalRate = totalRequests > 0 ? (approved / totalRequests) * 100 : 0;
    
    // Group by leave type
    const leaveTypes = localAppData.leave?.leaveTypes || [];
    const byType = leaveTypes.map((type: any) => {
      const typeRequests = filteredRequests.filter((req: any) => req.leaveType === type.id);
      const used = typeRequests.reduce((sum: number, req: any) => sum + (req.days || 0), 0);
      const total = filteredEmployees.length * (type.allowancePerYear || 0);
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
    const tasks = localAppData.tasks?.tasks || [];
    const filteredTasks = tasks.filter((task: any) => {
      const matchesDepartment = matchesDepartmentFilter(
        task.employeeId ?? task.assigneeId ?? task.employee?.id,
        task.assignee ?? task.employeeName ?? task.employee?.name
      );
      if (!matchesDepartment) return false;
      const taskDate = task.dueDate ?? task.startDate ?? task.createdAt ?? task.date;
      return isWithinDateRange(taskDate);
    });
    const totalTasks = filteredTasks.length;
    const completed = filteredTasks.filter((task: any) => task.status === 'done').length;
    const inProgress = filteredTasks.filter((task: any) => task.status === 'inprogress').length;
    
    // Calculate overdue tasks
    const today = new Date();
    const overdue = filteredTasks.filter((task: any) => {
      if (task.status === 'done') return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).length;
    
    const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;
    
    // Group by priority
    const priorities = ['high', 'medium', 'low'];
    const byPriority = priorities.map(priority => {
      const priorityTasks = filteredTasks.filter((task: any) => task.priority === priority);
      const priorityCompleted = priorityTasks.filter((task: any) => task.status === 'done').length;
      const percentage = priorityTasks.length > 0 ? (priorityCompleted / priorityTasks.length) * 100 : 0;
      
      return {
        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
        total: priorityTasks.length,
        completed: priorityCompleted,
        percentage: Math.round(percentage * 10) / 10
      };
    });

    const departmentList = [...new Set(filteredEmployees.map(emp => emp.department))];

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
      byDepartment: departmentList.map(dept => {
        const deptEmployees = filteredEmployees.filter(emp => emp.department === dept);
        const deptTasks = filteredTasks.filter((task: any) =>
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
    const salaryData = localAppData.salary || {};
    const salaryEntries = (salaryData.employeeSalaries || []).filter((entry: any) =>
      matchesDepartmentFilter(entry.employeeId ?? entry.id, entry.employeeName ?? entry.name)
    );
    const employeeSalaries = salaryEntries.length > 0
      ? salaryEntries
      : filteredEmployees.map(emp => ({ totalSalary: emp.salary || 0 }));
    const totalPayroll = employeeSalaries.reduce((sum: number, emp: any) => sum + (emp.totalSalary || 0), 0);
    const averageSalary = employeeSalaries.length > 0 ? totalPayroll / employeeSalaries.length : 0;
    
    const departmentList = [...new Set(filteredEmployees.map(emp => emp.department))];
    const byDepartment = departmentList.map(dept => {
      const deptEmployees = filteredEmployees.filter(emp => emp.department === dept);
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

  const departments = useMemo(() => {
    const deptSet = new Set((localEmployees || []).map((e: any) => e.department).filter(Boolean));
    return ['all', ...Array.from(deptSet)];
  }, [localEmployees]);
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

  const exportHeaders = [
    'Category',
    'Employee',
    'Date',
    'Title/Type',
    'Status',
    'Hours',
    'Days',
    'Priority',
    'Month',
    'Year',
    'Gross',
    'Net',
  ];

  const formatDateRangeLabel = useCallback(() => {
    if (rangeStart && rangeEnd) return `${formatYMD(rangeStart)}_to_${formatYMD(rangeEnd)}`;
    if (rangeStart) return `${formatYMD(rangeStart)}_onwards`;
    if (rangeEnd) return `up_to_${formatYMD(rangeEnd)}`;
    return 'all_dates';
  }, [rangeStart, rangeEnd]);

  const buildAggregatedExportData = useCallback(() => {
    const leaveTypes = localAppData.leave?.leaveTypes || [];
    const leaveTypeName = (id: any) => {
      const found = leaveTypes.find((lt: any) => lt.id === id);
      return found?.name || id || 'General';
    };

    const timeSessions = localAppData.timeTracking?.sessions || [];
    const attendance = timeSessions
      .filter((session: any) => {
        const matchesDepartment = matchesDepartmentFilter(session.employeeId, session.employeeName);
        return matchesDepartment && isWithinDateRange(session.date);
      })
      .map((session: any) => ({
        Category: 'Attendance',
        Employee: session.employeeName || session.employeeId || 'Unknown',
        Date: normalizeToYMD(session.date) || '',
        'Title/Type': 'Attendance',
        Status: session.status || 'recorded',
        Hours: session.totalWorked ? (session.totalWorked / 60).toFixed(2) : '',
        Days: '',
        Priority: '',
        Month: '',
        Year: '',
        Gross: '',
        Net: '',
      }));

    const leaveRequests = localAppData.leave?.requests || [];
    const leave = leaveRequests
      .filter((req: any) => {
        const matchesDepartment = matchesDepartmentFilter(req.employeeId ?? req.employee?.id, req.employeeName ?? req.employee?.name);
        if (!matchesDepartment) return false;
        const requestDate = req.startDate ?? req.requestedAt ?? req.createdAt ?? req.date ?? req.from;
        return isWithinDateRange(requestDate);
      })
      .map((req: any) => ({
        Category: 'Leave',
        Employee: req.employeeName || req.employee?.name || req.employeeId || 'Unknown',
        Date: normalizeToYMD(req.startDate ?? req.requestedAt ?? req.createdAt ?? req.date ?? req.from) || '',
        'Title/Type': leaveTypeName(req.leaveType),
        Status: req.status || 'pending',
        Hours: '',
        Days: req.days ?? '',
        Priority: '',
        Month: '',
        Year: '',
        Gross: '',
        Net: '',
      }));

    const tasks = (localAppData.tasks?.tasks || [])
      .filter((task: any) => {
        const matchesDepartment = matchesDepartmentFilter(
          task.employeeId ?? task.assigneeId ?? task.employee?.id,
          task.assignee ?? task.employeeName ?? task.employee?.name
        );
        if (!matchesDepartment) return false;
        const taskDate = task.dueDate ?? task.startDate ?? task.createdAt ?? task.date;
        return isWithinDateRange(taskDate);
      })
      .map((task: any) => ({
        Category: 'Task',
        Employee: task.assignee ?? task.employeeName ?? task.employee?.name ?? task.employeeId ?? 'Unknown',
        Date: normalizeToYMD(task.dueDate ?? task.startDate ?? task.createdAt ?? task.date) || '',
        'Title/Type': task.title || task.name || 'Task',
        Status: task.status || 'pending',
        Hours: '',
        Days: '',
        Priority: task.priority ? task.priority.toString() : '',
        Month: '',
        Year: '',
        Gross: '',
        Net: '',
      }));

    const salaryEntries = (localAppData.salary?.employeeSalaries || []).filter((entry: any) =>
      matchesDepartmentFilter(entry.employeeId ?? entry.id, entry.employeeName ?? entry.name)
    );
    const payrollSource = salaryEntries.length > 0
      ? salaryEntries
      : filteredEmployees.map(emp => ({
          employeeName: emp.name,
          employeeId: emp.id,
          totalSalary: emp.salary || 0,
        }));

    const payroll = payrollSource.map((entry: any) => ({
      Category: 'Payroll',
      Employee: entry.employeeName || entry.name || entry.employeeId || entry.id || 'Unknown',
      Date: '',
      'Title/Type': 'Payroll',
      Status: entry.paymentStatus || entry.status || 'calculated',
      Hours: '',
      Days: '',
      Priority: '',
      Month: entry.month || entry.period || '',
      Year: entry.year || '',
      Gross: entry.totalSalary ?? entry.salary ?? '',
      Net: entry.netSalary ?? (entry.totalSalary ? Math.round(entry.totalSalary * 0.85) : ''),
    }));

    const summary = [
      {
        Category: 'Attendance',
        Employee: '',
        Date: '',
        'Title/Type': 'Attendance Summary',
        Status: `avg ${attendanceData.summary.averageAttendance}%`,
        Hours: attendanceData.summary.averageHoursPerDay,
        Days: '',
        Priority: '',
        Month: '',
        Year: '',
        Gross: '',
        Net: '',
      },
      {
        Category: 'Leave',
        Employee: '',
        Date: '',
        'Title/Type': 'Leave Summary',
        Status: `approved ${leaveData.summary.approved}/pending ${leaveData.summary.pending}/rejected ${leaveData.summary.rejected}`,
        Hours: '',
        Days: leaveData.summary.totalRequests,
        Priority: '',
        Month: '',
        Year: '',
        Gross: '',
        Net: '',
      },
      {
        Category: 'Task',
        Employee: '',
        Date: '',
        'Title/Type': 'Task Summary',
        Status: `completion ${taskData.summary.completionRate}%`,
        Hours: '',
        Days: taskData.summary.totalTasks,
        Priority: '',
        Month: '',
        Year: '',
        Gross: '',
        Net: '',
      },
      {
        Category: 'Payroll',
        Employee: '',
        Date: '',
        'Title/Type': 'Payroll Summary',
        Status: '',
        Hours: '',
        Days: '',
        Priority: '',
        Month: '',
        Year: '',
        Gross: payrollData.summary.totalPayroll,
        Net: payrollData.summary.netPayroll,
      },
    ];

    const makePlaceholder = (category: string) => ({
      Category: category,
      Employee: '',
      Date: '',
      'Title/Type': '',
      Status: '',
      Hours: 0,
      Days: 0,
      Priority: '',
      Month: '',
      Year: '',
      Gross: 0,
      Net: 0,
    });

    const attendanceRows = attendance.length ? attendance : [makePlaceholder('Attendance')];
    const leaveRows = leave.length ? leave : [makePlaceholder('Leave')];
    const taskRows = tasks.length ? tasks : [makePlaceholder('Task')];
    const payrollRows = payroll.length ? payroll : [makePlaceholder('Payroll')];

    return { attendance: attendanceRows, leave: leaveRows, tasks: taskRows, payroll: payrollRows, summary };
  }, [
    attendanceData.summary.averageAttendance,
    attendanceData.summary.averageHoursPerDay,
    filteredEmployees,
    isWithinDateRange,
    leaveData.summary.approved,
    leaveData.summary.pending,
    leaveData.summary.rejected,
    leaveData.summary.totalRequests,
    localAppData,
    matchesDepartmentFilter,
    payrollData.summary.netPayroll,
    payrollData.summary.totalPayroll,
    taskData.summary.completionRate,
    taskData.summary.totalTasks,
  ]);

  const toCSV = (rows: Record<string, any>[]) => {
    if (!rows.length) return '';
    const headers = exportHeaders;
    const escapeValue = (value: any) => {
      if (value === null || value === undefined) return '';
      const asString = String(value).replace(/"/g, '""');
      if (asString.includes(',') || asString.includes('\n')) return `"${asString}"`;
      return asString;
    };
    const lines = [headers.join(',')];
    rows.forEach(row => {
      lines.push(headers.map(header => escapeValue(row[header])).join(','));
    });
    return lines.join('\n');
  };

  const triggerDownload = (content: string, mime: string, filename: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buildPrintableHtml = (rows: Record<string, any>[]) => {
    if (!rows.length) return '<p>No data to export.</p>';
    const headers = exportHeaders;
    const escapeHtml = (value: any) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const tableRows = rows
      .map(row => `<tr>${headers.map(header => `<td style="padding:8px;border:1px solid #ccc;">${escapeHtml(row[header])}</td>`).join('')}</tr>`)
      .join('');
    return `<!doctype html><html><head><title>Reports Export</title><style>body{font-family:Arial, sans-serif;padding:16px;}table{border-collapse:collapse;width:100%;}th{background:#f4f4f5;padding:8px;border:1px solid #ccc;text-align:left;}</style></head><body><h2>Reports Export</h2><table><thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  };

  const exportAll = useCallback(
    (format: 'csv' | 'excel' | 'pdf') => {
      const aggregated = buildAggregatedExportData();
      const rows = [
        ...aggregated.summary,
        ...aggregated.attendance,
        ...aggregated.leave,
        ...aggregated.tasks,
        ...aggregated.payroll,
      ];

      if (!rows.length) {
        console.warn('Reports: no data available to export');
        return;
      }

      const rangeLabel = formatDateRangeLabel();
      const baseFilename = `reports_${rangeLabel}`;

      if (format === 'pdf') {
        const html = buildPrintableHtml(rows);
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          console.warn('Reports: unable to open print window for PDF export');
          return;
        }
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        return;
      }

      const csvContent = toCSV(rows);
      const mime = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv';
      const extension = format === 'excel' ? 'xls' : 'csv';
      triggerDownload(csvContent, mime, `${baseFilename}.${extension}`);
    },
    [buildAggregatedExportData, formatDateRangeLabel]
  );

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
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={(event: Event) => { event.preventDefault(); exportAll('excel'); }}>
                Excel (.xls)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event: Event) => { event.preventDefault(); exportAll('pdf'); }}>
                PDF (print)
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(event: Event) => { event.preventDefault(); exportAll('csv'); }}>
                CSV (.csv)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <Card className="hr-card">
        <CardContent className="p-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="form-label">Date Range</Label>
              <div className="flex items-center gap-2">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className={dateRange === 'custom' ? 'form-input w-40 min-w-0' : 'form-input'}>
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
              <div className="space-y-2">
                <Label className="form-label">Custom Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    className="form-input"
                    value={customDateRange.start}
                    onChange={(event) => setCustomDateRange(range => ({ ...range, start: event.target.value }))}
                    placeholder="Start"
                  />
                  <Input
                    type="date"
                    className="form-input"
                    value={customDateRange.end}
                    onChange={(event) => setCustomDateRange(range => ({ ...range, end: event.target.value }))}
                    placeholder="End"
                  />
                </div>
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
                      <span className="font-medium">{formatLocale(day.date)}</span>
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
                {(leaveData.byType || []).map((type, index) => (
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
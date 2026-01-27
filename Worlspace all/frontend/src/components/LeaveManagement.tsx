import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Calendar } from './ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Separator } from './ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { toast } from 'sonner';
import { 
  Calendar as CalendarIcon,
  Settings,
  Plus,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Eye,
  Save,
  Trash2,
  Filter,
  Search,
  Download,
  FileText,
  MapPin,
  UserCheck,
  Star,
  Building,
  Globe,
  Heart,
  DollarSign,
  Ban,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

interface HolidayType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: any;
  isPredefined: boolean;
  isEnabled: boolean;
  requiresDateSelection: boolean;
  allowancePerYear?: number;
  carryForward?: boolean;
  applicableToAll?: boolean;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'public' | 'company';
  description?: string;
  createdAt: string;
}

interface LeaveBalance {
  employeeId: number;
  employeeName: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
  leaveTypes: {
    [key: string]: {
      allocated: number;
      used: number;
      remaining: number;
      carryForward: number;
    };
  };
}

interface LeaveApplication {
  id: string;
  employeeId: number;
  employeeName: string;
  email: string;
  department: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewComments?: string;
  emergencyContact?: string;
  handoverNotes?: string;
}

interface ApprovalHierarchy {
  employeeId: number;
  employeeName: string;
  approverId: number;
  approverName: string;
  department: string;
  level: number;
}

interface LeaveManagementProps {
  userRole: string;
  currentUser?: any;
  employees?: any[];
  appData?: any;
  onUpdateAppData?: (module: string, data: any) => void;
}

export function LeaveManagement({ 
  userRole, 
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  appData = {},
  onUpdateAppData = () => {}
}: LeaveManagementProps) {
  const [activeTab, setActiveTab] = useState('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLeaveType, setFilterLeaveType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Initialize leave types from appData or defaults
  const getInitialLeaveTypes = (): HolidayType[] => {
    if (appData.leave?.leaveTypes && appData.leave.leaveTypes.length > 0) {
      return appData.leave.leaveTypes;
    }
    
    return [
      {
        id: 'sick',
        name: 'Sick Leave',
        description: 'Medical leave for illness or health issues',
        color: 'bg-orange-100 text-orange-700',
        icon: Heart,
        isPredefined: true,
        isEnabled: true,
        requiresDateSelection: false,
        allowancePerYear: 10,
        carryForward: false,
        applicableToAll: true
      },
      {
        id: 'paid',
        name: 'Paid Leave',
        description: 'Annual paid vacation days',
        color: 'bg-green-100 text-green-700',
        icon: Star,
        isPredefined: true,
        isEnabled: true,
        requiresDateSelection: false,
        allowancePerYear: 20,
        carryForward: true,
        applicableToAll: true
      },
      {
        id: 'personal',
        name: 'Personal Leave',
        description: 'Personal time off for personal matters',
        color: 'bg-blue-100 text-blue-700',
        icon: User,
        isPredefined: true,
        isEnabled: true,
        requiresDateSelection: false,
        allowancePerYear: 5,
        carryForward: false,
        applicableToAll: true
      },
      {
        id: 'maternity',
        name: 'Maternity Leave',
        description: 'Leave for new mothers',
        color: 'bg-pink-100 text-pink-700',
        icon: Heart,
        isPredefined: true,
        isEnabled: true,
        requiresDateSelection: false,
        allowancePerYear: 90,
        carryForward: false,
        applicableToAll: false
      }
    ];
  };

  const [holidayTypes, setHolidayTypes] = useState<HolidayType[]>(getInitialLeaveTypes());

  // Initialize holidays from appData or defaults
  const getInitialHolidays = (): Holiday[] => {
    if (appData.leave?.holidays && appData.leave.holidays.length > 0) {
      return appData.leave.holidays;
    }
    
    const currentYear = new Date().getFullYear();
    return [
      {
        id: '1',
        name: 'New Year\'s Day',
        date: `${currentYear}-01-01`,
        type: 'public',
        description: 'New Year celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Memorial Day',
        date: `${currentYear}-05-27`,
        type: 'public',
        description: 'Memorial Day holiday',
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Independence Day',
        date: `${currentYear}-07-04`,
        type: 'public',
        description: 'Independence Day celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Labor Day',
        date: `${currentYear}-09-02`,
        type: 'public',
        description: 'Labor Day holiday',
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        name: 'Thanksgiving',
        date: `${currentYear}-11-28`,
        type: 'public',
        description: 'Thanksgiving holiday',
        createdAt: new Date().toISOString()
      },
      {
        id: '6',
        name: 'Christmas Day',
        date: `${currentYear}-12-25`,
        type: 'public',
        description: 'Christmas celebration',
        createdAt: new Date().toISOString()
      }
    ];
  };

  const [holidays, setHolidays] = useState<Holiday[]>(getInitialHolidays());

  // Use real employees data
  const availableEmployees = employees.map(emp => ({
    id: emp.id,
    name: emp.name,
    email: emp.email || `${emp.name.toLowerCase().replace(' ', '.')}@company.com`,
    department: emp.department || 'General',
    position: emp.title || emp.role || 'Employee',
    avatar: emp.avatar || emp.name.split(' ').map((n: string) => n[0]).join('')
  }));

  // Initialize leave balances from appData or calculate from employees
  const initializeLeaveBalances = (): LeaveBalance[] => {
    if (appData.leave?.balances && appData.leave.balances.length > 0) {
      return appData.leave.balances;
    }
    
    return availableEmployees.map(emp => ({
      employeeId: emp.id,
      employeeName: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      avatar: emp.avatar,
      leaveTypes: {
        sick: { allocated: 10, used: 0, remaining: 10, carryForward: 0 },
        paid: { allocated: 20, used: 0, remaining: 20, carryForward: 0 },
        personal: { allocated: 5, used: 0, remaining: 5, carryForward: 0 },
        maternity: { allocated: 90, used: 0, remaining: 90, carryForward: 0 }
      }
    }));
  };

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(initializeLeaveBalances());

  // Generate approval hierarchy from real employee data
  const getApprovalHierarchy = (): ApprovalHierarchy[] => {
    // Find admin user
    const adminUser = availableEmployees.find(emp => emp.id === currentUser.id && userRole === 'admin') || 
                     availableEmployees.find(emp => 
                       employees.find(e => e.id === emp.id)?.role === 'admin'
                     );
    
    const approverId = adminUser?.id || currentUser.id;
    const approverName = adminUser?.name || currentUser.name;

    return availableEmployees
      .filter(emp => emp.id !== approverId) // Exclude approver
      .map(emp => ({
        employeeId: emp.id,
        employeeName: emp.name,
        approverId,
        approverName,
        department: emp.department,
        level: 1
      }));
  };

  const [approvalHierarchy, setApprovalHierarchy] = useState<ApprovalHierarchy[]>(getApprovalHierarchy());

  // Initialize leave applications from appData
  const initializeLeaveApplications = (): LeaveApplication[] => {
    if (appData.leave?.requests && appData.leave.requests.length > 0) {
      return appData.leave.requests;
    }
    
    // Add sample applications if none exist and we have employees
    if (availableEmployees.length > 1) {
      const sampleEmployee = availableEmployees.find(emp => emp.id !== currentUser.id);
      if (sampleEmployee) {
        const today = new Date();
        const startDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
        const endDate = new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000); // 3 days later
        
        return [{
          id: 'sample-1',
          employeeId: sampleEmployee.id,
          employeeName: sampleEmployee.name,
          email: sampleEmployee.email,
          department: sampleEmployee.department,
          leaveType: 'paid',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          days: 3,
          reason: 'Family vacation - sample leave request for testing approval functionality',
          status: 'pending',
          appliedDate: today.toISOString().split('T')[0],
          emergencyContact: '+1-555-0123',
          handoverNotes: 'Tasks will be handled by team members during absence'
        }];
      }
    }
    
    return [];
  };

  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>(initializeLeaveApplications());

  // Sync with appData
  useEffect(() => {
    onUpdateAppData('leave', {
      requests: leaveApplications,
      balances: leaveBalances,
      holidays,
      leaveTypes: holidayTypes
    });
  }, [leaveApplications, leaveBalances, holidays, holidayTypes]);

  // Form states
  const [newHoliday, setNewHoliday] = useState({
    name: '',
    date: '',
    type: 'company' as 'public' | 'company',
    description: ''
  });

  const [newApplication, setNewApplication] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    handoverNotes: ''
  });

  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [editingBalance, setEditingBalance] = useState<{ employeeId: number; leaveType: string } | null>(null);
  const [balanceEdit, setBalanceEdit] = useState({ allocated: 0, used: 0 });

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [calendarType, setCalendarType] = useState<'public' | 'company'>('public');

  // Toggle holiday type enable/disable
  const toggleHolidayType = (typeId: string) => {
    setHolidayTypes(prev => prev.map(type => 
      type.id === typeId ? { ...type, isEnabled: !type.isEnabled } : type
    ));
    toast.success('Holiday type updated');
  };

  // Add holiday date
  const handleAddHoliday = () => {
    if (!newHoliday.name || !newHoliday.date) {
      toast.error('Please enter holiday name and date');
      return;
    }

    const holiday: Holiday = {
      id: Date.now().toString(),
      name: newHoliday.name,
      date: newHoliday.date,
      type: newHoliday.type,
      description: newHoliday.description,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setHolidays(prev => [...prev, holiday]);
    setNewHoliday({ name: '', date: '', type: 'company', description: '' });
    toast.success('Holiday added successfully');
  };

  // Delete holiday
  const deleteHoliday = (holidayId: string) => {
    setHolidays(prev => prev.filter(h => h.id !== holidayId));
    toast.success('Holiday deleted');
  };

  // Update leave balance
  const updateLeaveBalance = (employeeId: number, leaveType: string, allocated: number, used: number) => {
    setLeaveBalances(prev => prev.map(balance => {
      if (balance.employeeId === employeeId) {
        return {
          ...balance,
          leaveTypes: {
            ...balance.leaveTypes,
            [leaveType]: {
              ...balance.leaveTypes[leaveType],
              allocated,
              used,
              remaining: allocated - used
            }
          }
        };
      }
      return balance;
    }));
    setEditingBalance(null);
    toast.success('Leave balance updated');
  };

  // Update approval hierarchy
  const updateApprovalHierarchy = (employeeId: number, approverId: number) => {
    const approver = availableEmployees.find(emp => emp.id === approverId);
    if (!approver) return;

    setApprovalHierarchy(prev => {
      const existing = prev.find(h => h.employeeId === employeeId);
      if (existing) {
        return prev.map(h => 
          h.employeeId === employeeId 
            ? { ...h, approverId, approverName: approver.name }
            : h
        );
      } else {
        const employee = availableEmployees.find(emp => emp.id === employeeId);
        if (!employee) return prev;
        
        return [...prev, {
          employeeId,
          employeeName: employee.name,
          approverId,
          approverName: approver.name,
          department: employee.department,
          level: 1
        }];
      }
    });
    toast.success('Approval hierarchy updated');
  };

  // Apply for leave
  const applyForLeave = () => {
    if (!newApplication.leaveType || !newApplication.startDate || !newApplication.endDate || !newApplication.reason) {
      toast.error('Please fill all required fields');
      return;
    }

    const startDate = new Date(newApplication.startDate);
    const endDate = new Date(newApplication.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Check if employee has sufficient leave balance
    const employee = availableEmployees.find(emp => emp.id === currentUser.id);
    const balance = leaveBalances.find(b => b.employeeId === currentUser.id);
    
    if (balance && balance.leaveTypes[newApplication.leaveType]) {
      const remaining = balance.leaveTypes[newApplication.leaveType].remaining;
      if (remaining < days && newApplication.leaveType !== 'unpaid') {
        toast.error(`Insufficient leave balance. You have ${remaining} days remaining.`);
        return;
      }
    }

    const application: LeaveApplication = {
      id: Date.now().toString(),
      employeeId: currentUser.id,
      employeeName: employee?.name || 'Current User',
      email: employee?.email || '',
      department: employee?.department || '',
      leaveType: newApplication.leaveType,
      startDate: newApplication.startDate,
      endDate: newApplication.endDate,
      days,
      reason: newApplication.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      emergencyContact: newApplication.emergencyContact,
      handoverNotes: newApplication.handoverNotes
    };

    setLeaveApplications(prev => [...prev, application]);
    setNewApplication({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
      emergencyContact: '',
      handoverNotes: ''
    });
    toast.success('Leave application submitted successfully');
  };

  // Approve/Reject leave
  const updateLeaveStatus = (applicationId: string, status: 'approved' | 'rejected', comments?: string) => {
    const currentUserData = availableEmployees.find(emp => emp.id === currentUser.id);
    
    setLeaveApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const updatedApp = {
          ...app,
          status,
          reviewedBy: currentUser?.name || 'Admin',
          reviewedDate: new Date().toISOString().split('T')[0],
          reviewComments: comments || ''
        };

        // If approved, deduct from leave balance
        if (status === 'approved' && app.leaveType !== 'unpaid') {
          setLeaveBalances(prevBalances => prevBalances.map(balance => {
            if (balance.employeeId === app.employeeId) {
              const currentUsed = balance.leaveTypes[app.leaveType]?.used || 0;
              return {
                ...balance,
                leaveTypes: {
                  ...balance.leaveTypes,
                  [app.leaveType]: {
                    ...balance.leaveTypes[app.leaveType],
                    used: currentUsed + app.days,
                    remaining: balance.leaveTypes[app.leaveType].allocated - (currentUsed + app.days)
                  }
                }
              };
            }
            return balance;
          }));
        }

        return updatedApp;
      }
      return app;
    }));

    toast.success(`Leave application ${status}`);
  };

  // Get applications that current user can view/manage
  const getAccessibleApplications = () => {
    if (userRole === 'admin') {
      return leaveApplications;
    }

    // Get applications that current user can approve
    const canApprove = approvalHierarchy
      .filter(h => h.approverId === currentUser.id)
      .map(h => h.employeeId);

    // Include current user's own applications
    return leaveApplications.filter(app => 
      app.employeeId === currentUser.id || canApprove.includes(app.employeeId)
    );
  };

  // Filter applications
  const getFilteredApplications = () => {
    let filtered = getAccessibleApplications();

    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    if (filterLeaveType !== 'all') {
      filtered = filtered.filter(app => app.leaveType === filterLeaveType);
    }

    if (searchQuery) {
      filtered = filtered.filter(app => 
        app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredApplications = getFilteredApplications();
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const exportHeaders = [
    'Employee',
    'Email',
    'Department',
    'Leave Type',
    'Start Date',
    'End Date',
    'Days',
    'Status',
    'Reason'
  ];

  const formatApplicationsForExport = () => {
    return filteredApplications.map((app) => ({
      Employee: app.employeeName,
      Email: app.email,
      Department: app.department,
      'Leave Type': holidayTypes.find(t => t.id === app.leaveType)?.name || app.leaveType,
      'Start Date': app.startDate,
      'End Date': app.endDate,
      Days: app.days,
      Status: app.status,
      Reason: app.reason
    }));
  };

  const toCSV = (rows: Record<string, any>[]) => {
    if (!rows.length) return '';
    const escapeValue = (value: any) => {
      if (value === null || value === undefined) return '';
      const asString = String(value).replace(/"/g, '""');
      if (asString.includes(',') || asString.includes('\n')) return `"${asString}"`;
      return asString;
    };
    const lines = [exportHeaders.join(',')];
    rows.forEach(row => {
      lines.push(exportHeaders.map(header => escapeValue(row[header])).join(','));
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
    if (!rows.length) return '<p>No applications to export.</p>';
    const escapeHtml = (value: any) => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const tableRows = rows
      .map(row => `<tr>${exportHeaders.map(header => `<td style="padding:8px;border:1px solid #ccc;">${escapeHtml(row[header])}</td>`).join('')}</tr>`)
      .join('');
    return `<!doctype html><html><head><title>Leave Applications Export</title><style>body{font-family:Arial, sans-serif;padding:16px;}table{border-collapse:collapse;width:100%;}th{background:#f4f4f5;padding:8px;border:1px solid #ccc;text-align:left;}</style></head><body><h2>Leave Applications Export</h2><table><thead><tr>${exportHeaders.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  };

  const exportApplications = (format: 'csv' | 'excel' | 'pdf') => {
    const rows = formatApplicationsForExport();

    if (!rows.length) {
      toast.error('No applications to export');
      return;
    }

    const baseFilename = `leave_applications_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'pdf') {
      const html = buildPrintableHtml(rows);
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Unable to open print window');
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
  };

  // Get enabled leave types for applications
  const getEnabledLeaveTypes = () => {
    return holidayTypes.filter(type => type.isEnabled && !type.requiresDateSelection);
  };

  const getHolidayTypeColor = (type: string) => {
    const holidayType = holidayTypes.find(ht => ht.id === type);
    return holidayType?.color || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const canApproveLeave = (employeeId: number) => {
    // Admin can approve any leave
    if (userRole === 'admin') return true;
    
    // User cannot approve their own leave
    if (employeeId === currentUser.id) return false;
    
    // Check if current user is designated as approver for this employee
    return approvalHierarchy.some(h => h.employeeId === employeeId && h.approverId === currentUser.id);
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8" />
            Leave Management
          </h1>
          <p className="text-gray-600">Manage holidays, leave applications, and employee balances</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getAccessibleApplications().length}</p>
                <p className="text-sm text-gray-600">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getAccessibleApplications().filter(a => a.status === 'pending').length}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getAccessibleApplications().filter(a => a.status === 'approved').length}</p>
                <p className="text-sm text-gray-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{holidays.length}</p>
                <p className="text-sm text-gray-600">Company Holidays</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="apply">Apply Leave</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
        </TabsList>

        {/* Leave Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Leave Type</Label>
                  <Select value={filterLeaveType} onValueChange={setFilterLeaveType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {getEnabledLeaveTypes().map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onSelect={(event: Event) => { event.preventDefault(); exportApplications('pdf'); }}>
                        PDF (print)
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(event: Event) => { event.preventDefault(); exportApplications('csv'); }}>
                        CSV (.csv)
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={(event: Event) => { event.preventDefault(); exportApplications('excel'); }}>
                        Excel (.xls)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <Card>
            <CardHeader>
              <CardTitle>Leave Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedApplications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {application.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{application.employeeName}</h3>
                            <Badge className={getHolidayTypeColor(application.leaveType)}>
                              {holidayTypes.find(t => t.id === application.leaveType)?.name || application.leaveType}
                            </Badge>
                            <Badge className={getStatusColor(application.status)}>
                              {application.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{application.department} • {application.email}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            <CalendarIcon className="w-4 h-4 inline mr-1" />
                            {new Date(application.startDate).toLocaleDateString()} - {new Date(application.endDate).toLocaleDateString()} ({application.days} days)
                          </p>
                          <p className="text-sm text-gray-700 mb-2">{application.reason}</p>
                          {application.handoverNotes && (
                            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                              <strong>Handover:</strong> {application.handoverNotes}
                            </p>
                          )}
                          {application.emergencyContact && (
                            <p className="text-xs text-gray-500 mt-1">
                              <strong>Emergency Contact:</strong> {application.emergencyContact}
                            </p>
                          )}
                          {application.reviewComments && (
                            <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                              <strong>Review Comments:</strong> {application.reviewComments}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                            {application.reviewedBy && application.reviewedDate && (
                              <> • Reviewed by {application.reviewedBy} on {new Date(application.reviewedDate).toLocaleDateString()}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {application.status === 'pending' && canApproveLeave(application.employeeId) && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => updateLeaveStatus(application.id, 'approved', 'Leave approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateLeaveStatus(application.id, 'rejected', 'Leave rejected')}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {/* Debug info - to help identify approval issues */}
                        {application.status === 'pending' && userRole === 'admin' && (
                          <div className="text-xs text-gray-400 mt-2 p-2 bg-blue-50 rounded border">
                            <div>🔍 Debug Info:</div>
                            <div>Status: {application.status}</div>
                            <div>Can Approve: {canApproveLeave(application.employeeId) ? 'Yes' : 'No'}</div>
                            <div>Current User ID: {currentUser.id} (Role: {userRole})</div>
                            <div>Applicant ID: {application.employeeId}</div>
                            <div>Approval Hierarchy: {approvalHierarchy.length} entries</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {paginatedApplications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No leave applications found
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredApplications.length)} of {filteredApplications.length} applications
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Apply Leave Tab */}
        <TabsContent value="apply" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leave-type">Leave Type *</Label>
                  <Select value={newApplication.leaveType} onValueChange={(value) => setNewApplication(prev => ({ ...prev, leaveType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getEnabledLeaveTypes().map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <type.icon className="w-4 h-4" />
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  {/* Show remaining balance */}
                  {newApplication.leaveType && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">Available Balance</p>
                      <p className="text-lg font-bold text-blue-700">
                        {leaveBalances.find(b => b.employeeId === currentUser.id)?.leaveTypes[newApplication.leaveType]?.remaining || 0} days
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date *</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newApplication.startDate}
                    onChange={(e) => setNewApplication(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newApplication.endDate}
                    onChange={(e) => setNewApplication(prev => ({ ...prev, endDate: e.target.value }))}
                    min={newApplication.startDate}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={newApplication.reason}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Please provide reason for your leave request..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="emergency-contact">Emergency Contact</Label>
                <Input
                  id="emergency-contact"
                  type="tel"
                  value={newApplication.emergencyContact}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Emergency contact number during leave"
                />
              </div>

              <div>
                <Label htmlFor="handover-notes">Work Handover Notes</Label>
                <Textarea
                  id="handover-notes"
                  value={newApplication.handoverNotes}
                  onChange={(e) => setNewApplication(prev => ({ ...prev, handoverNotes: e.target.value }))}
                  placeholder="Details about work handover, pending tasks, etc."
                  rows={3}
                />
              </div>

              {/* Preview */}
              {newApplication.startDate && newApplication.endDate && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Application Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">Duration:</span>
                        <span className="ml-2 font-medium">
                          {Math.ceil((new Date(newApplication.endDate).getTime() - new Date(newApplication.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700">Type:</span>
                        <span className="ml-2 font-medium">
                          {holidayTypes.find(t => t.id === newApplication.leaveType)?.name || 'Not selected'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button onClick={applyForLeave} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Submit Leave Application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {userRole !== 'admin' ? (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600">Only administrators can access leave settings.</p>
            </div>
          ) : (
            <>
              {/* Holiday Types */}
              <Card>
                <CardHeader>
                  <CardTitle>Holiday Types Configuration</CardTitle>
                  <p className="text-sm text-gray-600">
                    Manage available leave types and their settings. Predefined types cannot be deleted but can be enabled/disabled.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {holidayTypes.map((type) => (
                      <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <type.icon className="w-8 h-8 text-gray-600" />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{type.name}</h3>
                              {type.isPredefined && (
                                <Badge variant="secondary" className="text-xs">
                                  System Defined
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{type.description}</p>
                            {type.allowancePerYear !== undefined && (
                              <p className="text-xs text-gray-500 mt-1">
                                Annual Allowance: {type.allowancePerYear} days
                                {type.carryForward && ' • Carry Forward Enabled'}
                              </p>
                            )}
                          </div>
                        </div>
                        <Switch
                          checked={type.isEnabled}
                          onCheckedChange={() => toggleHolidayType(type.id)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Holiday Dates Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Holiday Dates</CardTitle>
                  <p className="text-sm text-gray-600">
                    Manage specific dates for public and company holidays.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add New Holiday */}
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Holiday</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="holiday-name">Holiday Name *</Label>
                        <Input
                          id="holiday-name"
                          value={newHoliday.name}
                          onChange={(e) => setNewHoliday(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Independence Day"
                        />
                      </div>
                      <div>
                        <Label htmlFor="holiday-type">Type *</Label>
                        <Select value={newHoliday.type} onValueChange={(value: 'public' | 'company') => setNewHoliday(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public Holiday</SelectItem>
                            <SelectItem value="company">Company Holiday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="holiday-date">Date *</Label>
                        <Input
                          id="holiday-date"
                          type="date"
                          value={newHoliday.date}
                          onChange={(e) => setNewHoliday(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="holiday-description">Description</Label>
                        <Input
                          id="holiday-description"
                          value={newHoliday.description}
                          onChange={(e) => setNewHoliday(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Optional description"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAddHoliday} className="mt-4">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Holiday
                    </Button>
                  </div>

                  {/* Existing Holidays */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Existing Holidays</h3>
                    <div className="space-y-3">
                      {holidays
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((holiday) => (
                          <div key={holiday.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{holiday.name}</h4>
                                <Badge className={holiday.type === 'public' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                                  {holiday.type === 'public' ? 'Public' : 'Company'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {new Date(holiday.date).toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                              {holiday.description && (
                                <p className="text-sm text-gray-500">{holiday.description}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteHoliday(holiday.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      {holidays.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No holidays configured yet
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Balance Tab */}
        <TabsContent value="balance" className="space-y-6">
          {userRole !== 'admin' ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600">Only administrators can manage employee leave balances.</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Employee Leave Balances</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage leave allocations and balances for all employees
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {leaveBalances.map((balance) => (
                    <Card key={balance.employeeId} className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {balance.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{balance.employeeName}</h3>
                          <p className="text-sm text-gray-600">{balance.position} • {balance.department}</p>
                          <p className="text-xs text-gray-500">{balance.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {getEnabledLeaveTypes().map((leaveType) => (
                          <div key={leaveType.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{leaveType.name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingBalance({ employeeId: balance.employeeId, leaveType: leaveType.id });
                                  setBalanceEdit({
                                    allocated: balance.leaveTypes[leaveType.id]?.allocated || 0,
                                    used: balance.leaveTypes[leaveType.id]?.used || 0
                                  });
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            {editingBalance?.employeeId === balance.employeeId && editingBalance?.leaveType === leaveType.id ? (
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-xs">Allocated</Label>
                                  <Input
                                    type="number"
                                    value={balanceEdit.allocated}
                                    onChange={(e) => setBalanceEdit(prev => ({ ...prev, allocated: parseInt(e.target.value) || 0 }))}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Used</Label>
                                  <Input
                                    type="number"
                                    value={balanceEdit.used}
                                    onChange={(e) => setBalanceEdit(prev => ({ ...prev, used: parseInt(e.target.value) || 0 }))}
                                    className="h-8"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateLeaveBalance(balance.employeeId, leaveType.id, balanceEdit.allocated, balanceEdit.used)}
                                    className="flex-1"
                                  >
                                    <Save className="w-3 h-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingBalance(null)}
                                    className="flex-1"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Allocated:</span>
                                  <span className="font-medium">{balance.leaveTypes[leaveType.id]?.allocated || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Used:</span>
                                  <span className="font-medium text-red-600">{balance.leaveTypes[leaveType.id]?.used || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium">
                                  <span>Remaining:</span>
                                  <span className="text-green-600">{balance.leaveTypes[leaveType.id]?.remaining || 0}</span>
                                </div>
                                {balance.leaveTypes[leaveType.id]?.carryForward > 0 && (
                                  <div className="flex justify-between text-xs text-blue-600">
                                    <span>Carry Forward:</span>
                                    <span>{balance.leaveTypes[leaveType.id].carryForward}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Approval Hierarchy Tab */}
        <TabsContent value="approval" className="space-y-6">
          {userRole !== 'admin' ? (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600">Only administrators can manage approval hierarchy.</p>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Leave Approval Hierarchy</CardTitle>
                <p className="text-sm text-gray-600">
                  Configure who can approve leave applications for each employee
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableEmployees
                    .filter(emp => emp.id !== 1) // Exclude admin from being managed
                    .map((employee) => {
                      const hierarchy = approvalHierarchy.find(h => h.employeeId === employee.id);
                      return (
                        <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-blue-100 text-blue-700">
                                {employee.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                              <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                              <span>Approved by:</span>
                            </div>
                            <Select
                              value={hierarchy?.approverId.toString() || ''}
                              onValueChange={(value) => updateApprovalHierarchy(employee.id, parseInt(value))}
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select approver..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableEmployees
                                  .filter(emp => emp.id !== employee.id) // Can't approve own leave
                                  .map((approver) => (
                                    <SelectItem key={approver.id} value={approver.id.toString()}>
                                      {approver.name} ({approver.position})
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
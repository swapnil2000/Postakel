import { useEffect, useMemo, useState } from 'react';
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
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Save,
  Trash2,
  Download,
  FileText,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface HolidayType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: any;
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

interface LeaveBalanceEntry {
  allocated: number;
  used: number;
  remaining: number;
  carryForward: number;
}

interface LeaveBalance {
  employeeId: number;
  employeeName: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
  leaveTypes: Record<string, LeaveBalanceEntry>;
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

interface LeaveManagementBackendProps {
  apiBaseUrl: string;
  authToken?: string;
  userRole: string;
  currentUser?: { id: number; name: string; role?: string };
}

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ExportFormat = 'csv' | 'excel' | 'pdf';

async function fetchJson<T>(url: string, method: FetchMethod = 'GET', body?: any, token?: string): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text || 'Request failed'}`);
  }

  return res.json() as Promise<T>;
}

export function LeaveManagementBackend({
  apiBaseUrl,
  authToken,
  userRole,
  currentUser = { id: 1, name: 'User', role: 'employee' }
}: LeaveManagementBackendProps) {
  const [activeTab, setActiveTab] = useState('applications');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLeaveType, setFilterLeaveType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [holidayTypes, setHolidayTypes] = useState<HolidayType[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [approvalHierarchy, setApprovalHierarchy] = useState<ApprovalHierarchy[]>([]);
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base = (path: string) => `${apiBaseUrl.replace(/\/$/, '')}${path}`;

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [types, hols, balances, approvals, requests] = await Promise.all([
        fetchJson<HolidayType[]>(base('/leave/types'), 'GET', undefined, authToken),
        fetchJson<Holiday[]>(base('/leave/holidays'), 'GET', undefined, authToken),
        fetchJson<LeaveBalance[]>(base('/leave/balances'), 'GET', undefined, authToken),
        fetchJson<ApprovalHierarchy[]>(base('/leave/approvals'), 'GET', undefined, authToken),
        fetchJson<LeaveApplication[]>(base('/leave/requests'), 'GET', undefined, authToken)
      ]);

      setHolidayTypes(types || []);
      setHolidays(hols || []);
      setLeaveBalances(balances || []);
      setApprovalHierarchy(approvals || []);
      setLeaveApplications(requests || []);
    } catch (e: any) {
      console.error('Failed to load leave data', e);
      setError(e.message || 'Failed to load leave data');
      toast.error('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl, authToken]);

  const getAccessibleApplications = useMemo(() => {
    if (userRole === 'admin') return leaveApplications;
    const canApprove = approvalHierarchy.filter(h => h.approverId === currentUser.id).map(h => h.employeeId);
    return leaveApplications.filter(app => app.employeeId === currentUser.id || canApprove.includes(app.employeeId));
  }, [approvalHierarchy, currentUser.id, leaveApplications, userRole]);

  const getFilteredApplications = useMemo(() => {
    let filtered = getAccessibleApplications;

    if (filterStatus !== 'all') filtered = filtered.filter(app => app.status === filterStatus);
    if (filterLeaveType !== 'all') filtered = filtered.filter(app => app.leaveType === filterLeaveType);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(app => app.employeeName.toLowerCase().includes(q) || app.reason.toLowerCase().includes(q));
    }

    return filtered;
  }, [filterLeaveType, filterStatus, getAccessibleApplications, searchQuery]);

  const totalPages = Math.ceil(getFilteredApplications.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = getFilteredApplications.slice(startIndex, startIndex + itemsPerPage);

  const getEnabledLeaveTypes = () => holidayTypes.filter(type => type.isEnabled && !type.requiresDateSelection);

  const getHolidayTypeColor = (type: string) => {
    const holidayType = holidayTypes.find(ht => ht.id === type);
    return holidayType?.color || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const canApproveLeave = (employeeId: number) => {
    if (userRole === 'admin') return true;
    if (employeeId === currentUser.id) return false;
    return approvalHierarchy.some(h => h.employeeId === employeeId && h.approverId === currentUser.id);
  };

  const addHoliday = async (payload: { name: string; date: string; type: 'public' | 'company'; description?: string }) => {
    try {
      const created = await fetchJson<Holiday>(base('/leave/holidays'), 'POST', payload, authToken);
      setHolidays(prev => [...prev, created]);
      toast.success('Holiday added');
    } catch (e: any) {
      toast.error(e.message || 'Failed to add holiday');
    }
  };

  const deleteHoliday = async (holidayId: string) => {
    try {
      await fetchJson<void>(base(`/leave/holidays/${holidayId}`), 'DELETE', undefined, authToken);
      setHolidays(prev => prev.filter(h => h.id !== holidayId));
      toast.success('Holiday deleted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to delete holiday');
    }
  };

  const updateLeaveBalance = async (employeeId: number, leaveType: string, allocated: number, used: number) => {
    try {
      const updated = await fetchJson<LeaveBalance>(
        base(`/leave/balances/${employeeId}/${leaveType}`),
        'PUT',
        { allocated, used },
        authToken
      );
      setLeaveBalances(prev => prev.map(b => (b.employeeId === employeeId ? updated : b)));
      toast.success('Leave balance updated');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update balance');
    }
  };

  const updateApprovalHierarchy = async (employeeId: number, approverId: number) => {
    try {
      const updated = await fetchJson<ApprovalHierarchy>(
        base(`/leave/approvals/${employeeId}`),
        'PUT',
        { approverId },
        authToken
      );
      setApprovalHierarchy(prev => {
        const exists = prev.find(h => h.employeeId === employeeId);
        if (exists) return prev.map(h => (h.employeeId === employeeId ? updated : h));
        return [...prev, updated];
      });
      toast.success('Approval mapping saved');
    } catch (e: any) {
      toast.error(e.message || 'Failed to update approval mapping');
    }
  };

  const applyForLeave = async (payload: Omit<LeaveApplication, 'id' | 'status' | 'appliedDate'>) => {
    try {
      const created = await fetchJson<LeaveApplication>(base('/leave/requests'), 'POST', payload, authToken);
      setLeaveApplications(prev => [...prev, created]);
      toast.success('Leave application submitted');
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit leave');
    }
  };

  const updateLeaveStatus = async (applicationId: string, status: 'approved' | 'rejected', comments?: string) => {
    try {
      const updated = await fetchJson<LeaveApplication>(
        base(`/leave/requests/${applicationId}/status`),
        'PATCH',
        { status, comments },
        authToken
      );
      setLeaveApplications(prev => prev.map(app => (app.id === applicationId ? updated : app)));
      toast.success(`Leave ${status}`);
    } catch (e: any) {
      toast.error(e.message || 'Failed to update status');
    }
  };

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

  const formatApplicationsForExport = () =>
    getFilteredApplications.map(app => ({
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

  const toCSV = (rows: Record<string, any>[]) => {
    if (!rows.length) return '';
    const escapeValue = (value: any) => {
      if (value === null || value === undefined) return '';
      const asString = String(value).replace(/"/g, '""');
      if (asString.includes(',') || asString.includes('\n')) return `"${asString}"`;
      return asString;
    };
    const lines = [exportHeaders.join(',')];
    rows.forEach(row => lines.push(exportHeaders.map(h => escapeValue(row[h])).join(',')));
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
    return `<!doctype html><html><head><title>Leave Applications Export</title><style>body{font-family:Arial, sans-serif;padding:16px;}table{border-collapse:collapse;width:100%;}th{background:#f4f4f5;padding:8px;border:1px solid #ccc;text-align:left;}</style></head><body><h2>Leave Applications Export</h2><table><thead><tr>${exportHeaders
      .map(header => `<th>${escapeHtml(header)}</th>`)
      .join('')}</tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  };

  const exportApplications = (format: ExportFormat) => {
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

  // UI states for forms
  const [newHoliday, setNewHoliday] = useState({ name: '', date: '', type: 'company' as 'public' | 'company', description: '' });
  const [newApplication, setNewApplication] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
    emergencyContact: '',
    handoverNotes: ''
  });
  const [editingBalance, setEditingBalance] = useState<{ employeeId: number; leaveType: string } | null>(null);
  const [balanceEdit, setBalanceEdit] = useState({ allocated: 0, used: 0 });

  if (loading) {
    return (
      <div className="container-mobile py-6">
        <p className="text-gray-600">Loading leave data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-mobile py-6 space-y-4">
        <p className="text-red-600">{error}</p>
        <Button onClick={loadAll}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8" />
            Leave Management (Backend)
          </h1>
          <p className="text-gray-600">Powered by API: {apiBaseUrl}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{getAccessibleApplications.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getAccessibleApplications.filter(a => a.status === 'pending').length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getAccessibleApplications.filter(a => a.status === 'approved').length}</p>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="apply">Apply Leave</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="balance">Balance</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search</Label>
                  <Input placeholder="Search applications..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
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

          <Card>
            <CardHeader>
              <CardTitle>Leave Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedApplications.map(application => (
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
                            <Badge className={getStatusColor(application.status)}>{application.status}</Badge>
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
                            <Button size="sm" onClick={() => updateLeaveStatus(application.id, 'approved', 'Leave approved')} className="bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateLeaveStatus(application.id, 'rejected', 'Leave rejected')} className="border-red-200 text-red-600 hover:bg-red-50">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {paginatedApplications.length === 0 && (
                  <div className="text-center py-8 text-gray-500">No leave applications found</div>
                )}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, getFilteredApplications.length)} of {getFilteredApplications.length} applications
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)} className="w-8 h-8 p-0">
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="leave-type">Leave Type *</Label>
                  <Select value={newApplication.leaveType} onValueChange={value => setNewApplication(prev => ({ ...prev, leaveType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getEnabledLeaveTypes().map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4" />
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
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
                  <Input id="start-date" type="date" value={newApplication.startDate} onChange={e => setNewApplication(prev => ({ ...prev, startDate: e.target.value }))} />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date *</Label>
                  <Input id="end-date" type="date" value={newApplication.endDate} onChange={e => setNewApplication(prev => ({ ...prev, endDate: e.target.value }))} min={newApplication.startDate} />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Textarea id="reason" value={newApplication.reason} onChange={e => setNewApplication(prev => ({ ...prev, reason: e.target.value }))} placeholder="Please provide reason for your leave request..." rows={3} />
              </div>

              <div>
                <Label htmlFor="emergency-contact">Emergency Contact</Label>
                <Input id="emergency-contact" type="tel" value={newApplication.emergencyContact} onChange={e => setNewApplication(prev => ({ ...prev, emergencyContact: e.target.value }))} placeholder="Emergency contact number during leave" />
              </div>

              <div>
                <Label htmlFor="handover-notes">Work Handover Notes</Label>
                <Textarea id="handover-notes" value={newApplication.handoverNotes} onChange={e => setNewApplication(prev => ({ ...prev, handoverNotes: e.target.value }))} placeholder="Details about work handover, pending tasks, etc." rows={3} />
              </div>

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
                        <span className="ml-2 font-medium">{holidayTypes.find(t => t.id === newApplication.leaveType)?.name || 'Not selected'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={() => {
                  if (!newApplication.leaveType || !newApplication.startDate || !newApplication.endDate || !newApplication.reason) {
                    toast.error('Please fill all required fields');
                    return;
                  }
                  const days = Math.ceil((new Date(newApplication.endDate).getTime() - new Date(newApplication.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
                  applyForLeave({
                    employeeId: currentUser.id,
                    employeeName: currentUser.name,
                    email: '',
                    department: '',
                    leaveType: newApplication.leaveType,
                    startDate: newApplication.startDate,
                    endDate: newApplication.endDate,
                    days,
                    reason: newApplication.reason,
                    emergencyContact: newApplication.emergencyContact,
                    handoverNotes: newApplication.handoverNotes
                  });
                  setNewApplication({ leaveType: '', startDate: '', endDate: '', reason: '', emergencyContact: '', handoverNotes: '' });
                }}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Leave Application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {userRole !== 'admin' ? (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600">Only administrators can access leave settings.</p>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Holiday Types Configuration</CardTitle>
                  <p className="text-sm text-gray-600">Manage available leave types from backend.</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {holidayTypes.map(type => (
                      <div key={type.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                              Annual Allowance: {type.allowancePerYear} days {type.carryForward && '• Carry Forward Enabled'}
                            </p>
                          )}
                        </div>
                        <Switch
                          checked={type.isEnabled}
                          onCheckedChange={async () => {
                            try {
                              const updated = await fetchJson<HolidayType>(
                                base(`/leave/types/${type.id}`),
                                'PATCH',
                                { isEnabled: !type.isEnabled },
                                authToken
                              );
                              setHolidayTypes(prev => prev.map(t => (t.id === type.id ? updated : t)));
                              toast.success('Holiday type updated');
                            } catch (e: any) {
                              toast.error(e.message || 'Failed to update type');
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Holiday Dates</CardTitle>
                  <p className="text-sm text-gray-600">Managed via backend</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Holiday</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="holiday-name">Holiday Name *</Label>
                        <Input id="holiday-name" value={newHoliday.name} onChange={e => setNewHoliday(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Independence Day" />
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
                        <Input id="holiday-date" type="date" value={newHoliday.date} onChange={e => setNewHoliday(prev => ({ ...prev, date: e.target.value }))} />
                      </div>
                      <div>
                        <Label htmlFor="holiday-description">Description</Label>
                        <Input id="holiday-description" value={newHoliday.description} onChange={e => setNewHoliday(prev => ({ ...prev, description: e.target.value }))} placeholder="Optional description" />
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        if (!newHoliday.name || !newHoliday.date) {
                          toast.error('Please enter holiday name and date');
                          return;
                        }
                        addHoliday({ name: newHoliday.name, date: newHoliday.date, type: newHoliday.type, description: newHoliday.description });
                        setNewHoliday({ name: '', date: '', type: 'company', description: '' });
                      }}
                      className="mt-4"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Holiday
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Existing Holidays</h3>
                    <div className="space-y-3">
                      {holidays
                        .slice()
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(holiday => (
                          <div key={holiday.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{holiday.name}</h4>
                                <Badge className={holiday.type === 'public' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}>
                                  {holiday.type === 'public' ? 'Public' : 'Company'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              {holiday.description && <p className="text-sm text-gray-500">{holiday.description}</p>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => deleteHoliday(holiday.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      {holidays.length === 0 && <div className="text-center py-8 text-gray-500">No holidays configured yet</div>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

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
                <p className="text-sm text-gray-600">Managed via backend</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {leaveBalances.map(balance => (
                    <Card key={balance.employeeId} className="p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">{balance.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{balance.employeeName}</h3>
                          <p className="text-sm text-gray-600">{balance.position} • {balance.department}</p>
                          <p className="text-xs text-gray-500">{balance.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {getEnabledLeaveTypes().map(leaveType => (
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
                                    onChange={e => setBalanceEdit(prev => ({ ...prev, allocated: parseInt(e.target.value) || 0 }))}
                                    className="h-8"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Used</Label>
                                  <Input
                                    type="number"
                                    value={balanceEdit.used}
                                    onChange={e => setBalanceEdit(prev => ({ ...prev, used: parseInt(e.target.value) || 0 }))}
                                    className="h-8"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => updateLeaveBalance(balance.employeeId, leaveType.id, balanceEdit.allocated, balanceEdit.used)} className="flex-1">
                                    <Save className="w-3 h-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingBalance(null)} className="flex-1">
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
                <p className="text-sm text-gray-600">Backed by API</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveBalances.map(employeeBalance => {
                    const hierarchy = approvalHierarchy.find(h => h.employeeId === employeeBalance.employeeId);
                    return (
                      <div key={employeeBalance.employeeId} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700">{employeeBalance.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{employeeBalance.employeeName}</h3>
                            <p className="text-sm text-gray-600">{employeeBalance.position} • {employeeBalance.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-600">
                            <span>Approved by:</span>
                          </div>
                          <Select
                            value={hierarchy?.approverId?.toString() || ''}
                            onValueChange={value => updateApprovalHierarchy(employeeBalance.employeeId, parseInt(value))}
                          >
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Select approver..." />
                            </SelectTrigger>
                            <SelectContent>
                              {leaveBalances
                                .map(lb => ({ id: lb.employeeId, name: lb.employeeName, position: lb.position }))
                                .filter(emp => emp.id !== employeeBalance.employeeId)
                                .map(approver => (
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

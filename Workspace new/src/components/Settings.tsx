import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import { DataSyncValidator } from './DataSyncValidator';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Calendar,
  DollarSign,
  Bell,
  Shield,
  Clock,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Globe,
  Lock,
  UserPlus,
  UserCheck,
  AlertCircle,
  Check,
  X,
  Upload,
  Download,
  Key,
  Crown,
  FileText,
  Timer,
  BarChart3,
  ClipboardList,
  MessageSquare,
  Briefcase,
  HardDrive,
  FolderOpen,
  Target,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Database,
  Settings2
} from 'lucide-react';

interface SettingsProps {
  userRole: 'admin' | 'employee';
  organizationData: {
    departments: Array<{ id: number; name: string; description: string; head: string; active: boolean }>;
    locations: Array<{ id: number; name: string; address: string; timezone: string; active: boolean }>;
    jobTitles: Array<{ id: number; title: string; department: string; level: string; active: boolean }>;
    managers: Array<{ id: number; name: string; title: string; department: string }>;
  };
  onUpdateOrganizationData: (type: 'departments' | 'locations' | 'jobTitles', data: any[]) => void;
  companySettings?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    timezone: string;
    currency: string;
    currencySymbol: string;
    dateFormat: string;
    timeFormat: string;
    weekStartsOn: string;
    fiscalYearStart: string;
    taxId: string;
    industry: string;
    companySize: string;
    language: string;
    country: string;
    logo: string | null;
    theme: string;
  };
  onUpdateCompanySettings?: (settings: any) => void;
  tenant?: any;
  employees?: any[];
  appData?: any;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  isEmployee: boolean;
  department?: string;
  jobTitle?: string;
  location?: string;
  reportingManager?: string;
  joinDate: string;
  lastActive: string;
  permissions: string[];
  avatar?: string;
}

interface ModulePermission {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'hr' | 'finance' | 'reporting' | 'admin';
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    manage: boolean;
  };
}

export function Settings({ 
  userRole, 
  organizationData, 
  onUpdateOrganizationData,
  companySettings,
  onUpdateCompanySettings,
  tenant,
  employees = [],
  appData = {}
}: SettingsProps) {
  const [activeTab, setActiveTab] = useState('company');
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingCompanyField, setEditingCompanyField] = useState<string | null>(null);
  const [tempCompanyInfo, setTempCompanyInfo] = useState<typeof companyInfo | null>(null);

  // Dynamic company settings using tenant data
  const [companyInfo, setCompanyInfo] = useState(companySettings || {
    name: tenant?.name || 'My Company',
    email: tenant?.settings?.email || 'admin@company.com',
    phone: tenant?.settings?.phone || '',
    address: tenant?.settings?.address || '',
    website: tenant?.settings?.website || '',
    timezone: tenant?.settings?.timezone || 'America/New_York',
    currency: tenant?.settings?.currency || 'USD',
    currencySymbol: tenant?.settings?.currencySymbol || '$',
    dateFormat: tenant?.settings?.dateFormat || 'MM/DD/YYYY',
    timeFormat: tenant?.settings?.timeFormat || '12',
    weekStartsOn: tenant?.settings?.weekStartsOn || 'Monday',
    fiscalYearStart: tenant?.settings?.fiscalYearStart || 'January',
    taxId: tenant?.settings?.taxId || '',
    industry: tenant?.settings?.industry || 'Technology',
    companySize: tenant?.settings?.companySize || '11-50',
    language: tenant?.settings?.language || 'English',
    country: tenant?.settings?.country || 'United States',
    logo: tenant?.logo || null,
    theme: tenant?.theme || 'light'
  });

  // Dynamic user management using actual employees data
  const [users, setUsers] = useState<User[]>(() => {
    if (employees && employees.length > 0) {
      return employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role as 'admin' | 'employee' | 'user',
        status: emp.status || 'active',
        isEmployee: true,
        department: emp.department,
        jobTitle: emp.jobTitle,
        location: emp.location,
        reportingManager: emp.reportingManager,
        joinDate: emp.joinDate,
        lastActive: emp.lastActive || new Date().toISOString(),
        permissions: emp.permissions || ['dashboard'],
        avatar: emp.avatar || null
      }));
    }
    return [];
  });

  // Update users when employees prop changes
  useEffect(() => {
    if (employees && employees.length > 0) {
      const updatedUsers = employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        role: emp.role as 'admin' | 'employee' | 'user',
        status: emp.status || 'active',
        isEmployee: true,
        department: emp.department,
        jobTitle: emp.jobTitle,
        location: emp.location,
        reportingManager: emp.reportingManager,
        joinDate: emp.joinDate,
        lastActive: emp.lastActive || new Date().toISOString(),
        permissions: emp.permissions || ['dashboard'],
        avatar: emp.avatar || null
      }));
      setUsers(updatedUsers);
    }
  }, [employees]);

  // Module permissions definition
  const [modulePermissions] = useState<ModulePermission[]>([
    {
      id: 'dashboard',
      name: 'Dashboard',
      description: 'Access to main dashboard and overview',
      category: 'core',
      permissions: { view: true, create: false, edit: false, delete: false, export: false, manage: false }
    },
    {
      id: 'timetracker',
      name: 'Time Tracker',
      description: 'Clock in/out and time tracking',
      category: 'core',
      permissions: { view: true, create: true, edit: true, delete: false, export: false, manage: false }
    },
    {
      id: 'leave',
      name: 'Leave Management',
      description: 'Manage leave requests and approvals',
      category: 'hr',
      permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: true }
    },
    {
      id: 'tasks',
      name: 'Task Management',
      description: 'Create and manage tasks',
      category: 'core',
      permissions: { view: true, create: true, edit: true, delete: true, export: true, manage: false }
    },
    {
      id: 'team',
      name: 'Employee Management',
      description: 'Manage team members and employee data',
      category: 'hr',
      permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: true }
    },
    {
      id: 'performance',
      name: 'Performance Management',
      description: 'Performance reviews and goal tracking',
      category: 'hr',
      permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: true }
    },
    {
      id: 'salary',
      name: 'Salary Management',
      description: 'Manage employee salaries and compensation',
      category: 'finance',
      permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: true }
    },
    {
      id: 'payroll',
      name: 'Payroll Management',
      description: 'Process payroll and manage payments',
      category: 'finance',
      permissions: { view: true, create: true, edit: true, delete: false, export: true, manage: true }
    },
    {
      id: 'reports',
      name: 'Reports & Analytics',
      description: 'Generate and view system reports',
      category: 'reporting',
      permissions: { view: true, create: true, edit: false, delete: false, export: true, manage: false }
    },
    {
      id: 'documents',
      name: 'Document Center',
      description: 'Access company documents and files',
      category: 'core',
      permissions: { view: true, create: true, edit: true, delete: true, export: true, manage: false }
    },
    {
      id: 'assets',
      name: 'Asset Management',
      description: 'Track and manage company assets',
      category: 'admin',
      permissions: { view: true, create: true, edit: true, delete: true, export: true, manage: true }
    },
    {
      id: 'announcements',
      name: 'Announcements',
      description: 'Create and manage company announcements',
      category: 'admin',
      permissions: { view: true, create: true, edit: true, delete: true, export: false, manage: true }
    },
    {
      id: 'settings',
      name: 'System Settings',
      description: 'Configure system-wide settings',
      category: 'admin',
      permissions: { view: true, create: false, edit: true, delete: false, export: false, manage: true }
    }
  ]);

  // Dynamic settings using tenant/app data
  const [leaveSettings, setLeaveSettings] = useState({
    annualLeave: appData?.leaveSettings?.annualLeave || 20,
    sickLeave: appData?.leaveSettings?.sickLeave || 10,
    personalLeave: appData?.leaveSettings?.personalLeave || 5,
    maternityLeave: appData?.leaveSettings?.maternityLeave || 90,
    paternityLeave: appData?.leaveSettings?.paternityLeave || 15,
    carryForwardLimit: appData?.leaveSettings?.carryForwardLimit || 5,
    approvalRequired: appData?.leaveSettings?.approvalRequired ?? true,
    allowNegativeBalance: appData?.leaveSettings?.allowNegativeBalance ?? false,
    autoApproveLimit: appData?.leaveSettings?.autoApproveLimit || 2,
    blackoutDates: appData?.leaveSettings?.blackoutDates || [],
    minimumNotice: appData?.leaveSettings?.minimumNotice || 1
  });

  const [attendanceSettings, setAttendanceSettings] = useState({
    workingHoursStart: appData?.attendanceSettings?.workingHoursStart || '09:00',
    workingHoursEnd: appData?.attendanceSettings?.workingHoursEnd || '17:00',
    lunchBreakStart: appData?.attendanceSettings?.lunchBreakStart || '12:00',
    lunchBreakEnd: appData?.attendanceSettings?.lunchBreakEnd || '13:00',
    breakDuration: appData?.attendanceSettings?.breakDuration || 60,
    enableGeofencing: appData?.attendanceSettings?.enableGeofencing ?? false,
    autoClockOut: appData?.attendanceSettings?.autoClockOut ?? false,
    overtimeRate: appData?.attendanceSettings?.overtimeRate || 1.5,
    flexibleHours: appData?.attendanceSettings?.flexibleHours ?? true,
    coreHoursStart: appData?.attendanceSettings?.coreHoursStart || '10:00',
    coreHoursEnd: appData?.attendanceSettings?.coreHoursEnd || '15:00',
    weeklyHours: appData?.attendanceSettings?.weeklyHours || 40,
    trackLocation: appData?.attendanceSettings?.trackLocation ?? false
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: appData?.notificationSettings?.emailNotifications ?? true,
    pushNotifications: appData?.notificationSettings?.pushNotifications ?? true,
    smsNotifications: appData?.notificationSettings?.smsNotifications ?? false,
    leaveRequests: appData?.notificationSettings?.leaveRequests ?? true,
    attendanceAlerts: appData?.notificationSettings?.attendanceAlerts ?? true,
    taskDeadlines: appData?.notificationSettings?.taskDeadlines ?? true,
    systemUpdates: appData?.notificationSettings?.systemUpdates ?? false,
    payrollReminders: appData?.notificationSettings?.payrollReminders ?? true,
    performanceReviews: appData?.notificationSettings?.performanceReviews ?? true,
    documentSharing: appData?.notificationSettings?.documentSharing ?? true,
    announcementAlerts: appData?.notificationSettings?.announcementAlerts ?? true
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordPolicy: {
      minLength: appData?.securitySettings?.passwordPolicy?.minLength || 8,
      requireUppercase: appData?.securitySettings?.passwordPolicy?.requireUppercase ?? true,
      requireLowercase: appData?.securitySettings?.passwordPolicy?.requireLowercase ?? true,
      requireNumbers: appData?.securitySettings?.passwordPolicy?.requireNumbers ?? true,
      requireSpecialChars: appData?.securitySettings?.passwordPolicy?.requireSpecialChars ?? false,
      passwordExpiry: appData?.securitySettings?.passwordPolicy?.passwordExpiry || 90
    },
    twoFactorAuth: appData?.securitySettings?.twoFactorAuth ?? false,
    sessionTimeout: appData?.securitySettings?.sessionTimeout || 480,
    loginAttempts: appData?.securitySettings?.loginAttempts || 5,
    ipWhitelist: appData?.securitySettings?.ipWhitelist || [],
    auditLogging: appData?.securitySettings?.auditLogging ?? true,
    dataRetention: appData?.securitySettings?.dataRetention || 2555
  });

  // Use centralized organizational data from props
  const { departments, locations, jobTitles } = organizationData;

  // Edit states
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [editingJobTitle, setEditingJobTitle] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newDepartment, setNewDepartment] = useState({ name: '', description: '', head: '' });
  const [newLocation, setNewLocation] = useState({ name: '', address: '', timezone: 'America/New_York' });
  const [newJobTitle, setNewJobTitle] = useState({ title: '', department: '', level: 'Junior' });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'employee' | 'user',
    isEmployee: false,
    department: '',
    jobTitle: '',
    location: '',
    reportingManager: ''
  });

  // Constants - Comprehensive lists
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound Sterling' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
    { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
    { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
    { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
    { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
    { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
    { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
    { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
    { code: 'COP', symbol: '$', name: 'Colombian Peso' },
    { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'QAR', symbol: '﷼', name: 'Qatari Riyal' },
    { code: 'KWD', symbol: 'د.ك', name: 'Kuwaiti Dinar' },
    { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar' },
    { code: 'OMR', symbol: '﷼', name: 'Omani Rial' },
    { code: 'JOD', symbol: 'د.ا', name: 'Jordanian Dinar' },
    { code: 'LBP', symbol: '£', name: 'Lebanese Pound' },
    { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
    { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'LKR', symbol: '₨', name: 'Sri Lankan Rupee' },
    { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee' },
    { code: 'BTN', symbol: 'Nu.', name: 'Bhutanese Ngultrum' },
    { code: 'MVR', symbol: '.ރ', name: 'Maldivian Rufiyaa' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'TWD', symbol: 'NT$', name: 'New Taiwan Dollar' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' }
  ];

  const timezones = [
    'Pacific/Honolulu', 'America/Anchorage', 'America/Los_Angeles', 'America/Denver',
    'America/Chicago', 'America/New_York', 'America/Caracas', 'America/Santiago',
    'America/Sao_Paulo', 'America/Argentina/Buenos_Aires', 'Atlantic/Cape_Verde',
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Athens',
    'Europe/Helsinki', 'Europe/Moscow', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Kolkata',
    'Asia/Dhaka', 'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Shanghai', 'Asia/Tokyo',
    'Asia/Seoul', 'Australia/Sydney', 'Australia/Melbourne', 'Pacific/Auckland',
    'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi'
  ];

  const jobLevels = ['Intern', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Senior Manager', 'Director', 'Senior Director', 'VP', 'Senior VP', 'C-Level'];
  
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Banking', 'Insurance', 'Education', 
    'Manufacturing', 'Retail', 'E-commerce', 'Consulting', 'Real Estate', 
    'Media & Entertainment', 'Telecommunications', 'Automotive', 'Aerospace', 
    'Energy', 'Utilities', 'Construction', 'Agriculture', 'Food & Beverage',
    'Hospitality', 'Transportation', 'Logistics', 'Pharmaceuticals', 'Biotechnology',
    'Non-profit', 'Government', 'Legal Services', 'Marketing & Advertising', 'Other'
  ];

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'];
  
  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch',
    'Russian', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Japanese', 'Korean',
    'Arabic', 'Hindi', 'Bengali', 'Urdu', 'Thai', 'Vietnamese', 'Indonesian',
    'Malay', 'Filipino', 'Turkish', 'Hebrew', 'Persian', 'Swahili', 'Other'
  ];

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina',
    'Brazil', 'Bulgaria', 'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica',
    'Croatia', 'Czech Republic', 'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt',
    'El Salvador', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany',
    'Ghana', 'Greece', 'Guatemala', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland',
    'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
    'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania',
    'Luxembourg', 'Malaysia', 'Mexico', 'Morocco', 'Nepal', 'Netherlands', 'New Zealand',
    'Nicaragua', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Paraguay',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia',
    'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
    'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand',
    'Tunisia', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
    'Uruguay', 'Venezuela', 'Vietnam', 'Other'
  ];

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Inline editing functions
  const startEditingField = (field: string) => {
    setEditingCompanyField(field);
    setTempCompanyInfo({ ...companyInfo });
  };

  const cancelEditingField = () => {
    setEditingCompanyField(null);
    setTempCompanyInfo(null);
  };

  const saveCompanyField = (field: string) => {
    if (tempCompanyInfo) {
      setCompanyInfo(tempCompanyInfo);
      // Sync with parent component and global state
      if (onUpdateCompanySettings) {
        onUpdateCompanySettings(tempCompanyInfo);
      }
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    }
    setEditingCompanyField(null);
    setTempCompanyInfo(null);
  };

  const updateTempField = (field: string, value: string) => {
    if (tempCompanyInfo) {
      setTempCompanyInfo(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  // Render inline editable field
  const renderEditableField = (field: string, label: string, value: string, type: 'input' | 'select' | 'textarea' = 'input', options?: any[]) => {
    const isEditing = editingCompanyField === field;
    const displayValue = isEditing ? (tempCompanyInfo?.[field as keyof typeof tempCompanyInfo] || '') : value;

    return (
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
        {isEditing ? (
          <div className="space-y-2">
            {type === 'input' && (
              <Input
                value={displayValue as string}
                onChange={(e) => updateTempField(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            )}
            {type === 'textarea' && (
              <Textarea
                value={displayValue as string}
                onChange={(e) => updateTempField(field, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}`}
                rows={2}
              />
            )}
            {type === 'select' && options && (
              <Select value={displayValue as string} onValueChange={(value) => updateTempField(field, value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.code || option} value={option.code || option}>
                      {option.name ? `${option.symbol || ''} ${option.code} - ${option.name}` : option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-2">
              <Button size="sm" onClick={() => saveCompanyField(field)}>
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={cancelEditingField}>
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <p className="text-gray-900">{value}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startEditingField(field)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // CRUD Functions for organizational data
  const addDepartment = (department: any) => {
    const newDept = {
      id: Math.max(...departments.map(d => d.id), 0) + 1,
      ...department,
      active: true
    };
    onUpdateOrganizationData('departments', [...departments, newDept]);
    setNewDepartment({ name: '', description: '', head: '' });
    toast.success('Department added successfully');
  };

  const updateDepartment = (id: number, updatedDepartment: any) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === id ? { ...dept, ...updatedDepartment } : dept
    );
    onUpdateOrganizationData('departments', updatedDepartments);
    setEditingDepartment(null);
    toast.success('Department updated successfully');
  };

  const deleteDepartment = (id: number) => {
    const updatedDepartments = departments.map(dept => 
      dept.id === id ? { ...dept, active: false } : dept
    );
    onUpdateOrganizationData('departments', updatedDepartments);
    toast.success('Department deactivated successfully');
  };

  const addLocation = (location: any) => {
    const newLoc = {
      id: Math.max(...locations.map(l => l.id), 0) + 1,
      ...location,
      active: true
    };
    onUpdateOrganizationData('locations', [...locations, newLoc]);
    setNewLocation({ name: '', address: '', timezone: 'America/New_York' });
    toast.success('Location added successfully');
  };

  const updateLocation = (id: number, updatedLocation: any) => {
    const updatedLocations = locations.map(loc => 
      loc.id === id ? { ...loc, ...updatedLocation } : loc
    );
    onUpdateOrganizationData('locations', updatedLocations);
    setEditingLocation(null);
    toast.success('Location updated successfully');
  };

  const deleteLocation = (id: number) => {
    const updatedLocations = locations.map(loc => 
      loc.id === id ? { ...loc, active: false } : loc
    );
    onUpdateOrganizationData('locations', updatedLocations);
    toast.success('Location deactivated successfully');
  };

  const addJobTitle = (jobTitle: any) => {
    const newJob = {
      id: Math.max(...jobTitles.map(j => j.id), 0) + 1,
      ...jobTitle,
      active: true
    };
    onUpdateOrganizationData('jobTitles', [...jobTitles, newJob]);
    setNewJobTitle({ title: '', department: '', level: 'Junior' });
    toast.success('Job title added successfully');
  };

  const updateJobTitle = (id: number, updatedJobTitle: any) => {
    const updatedJobTitles = jobTitles.map(job => 
      job.id === id ? { ...job, ...updatedJobTitle } : job
    );
    onUpdateOrganizationData('jobTitles', updatedJobTitles);
    setEditingJobTitle(null);
    toast.success('Job title updated successfully');
  };

  const deleteJobTitle = (id: number) => {
    const updatedJobTitles = jobTitles.map(job => 
      job.id === id ? { ...job, active: false } : job
    );
    onUpdateOrganizationData('jobTitles', updatedJobTitles);
    toast.success('Job title deactivated successfully');
  };

  // User management functions
  const addUser = () => {
    const newUserData: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      ...newUser,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: new Date().toISOString(),
      permissions: ['dashboard'],
      avatar: null
    };
    setUsers([...users, newUserData]);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      isEmployee: false,
      department: '',
      jobTitle: '',
      location: '',
      reportingManager: ''
    });
    setShowCreateUserDialog(false);
    toast.success('User created successfully');
  };

  const updateUser = (id: number, updatedUser: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
    setEditingUser(null);
    toast.success('User updated successfully');
  };

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } : user
    ));
    toast.success('User status updated successfully');
  };

  const updateUserPermissions = (userId: number, permissions: string[]) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, permissions } : user
    ));
    toast.success('User permissions updated successfully');
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure and manage your workspace settings</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <Crown className="w-4 h-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-8">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">Company</span>
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Organization</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Policies</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="data-sync" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span className="hidden sm:inline">Data Sync</span>
          </TabsTrigger>
        </TabsList>

        {/* Company Settings Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderEditableField('name', 'Company Name', companyInfo.name)}
                {renderEditableField('email', 'Company Email', companyInfo.email)}
                {renderEditableField('phone', 'Phone Number', companyInfo.phone)}
                {renderEditableField('website', 'Website', companyInfo.website)}
                {renderEditableField('address', 'Address', companyInfo.address, 'textarea')}
                {renderEditableField('industry', 'Industry', companyInfo.industry, 'select', industries)}
                {renderEditableField('companySize', 'Company Size', companyInfo.companySize, 'select', companySizes)}
                {renderEditableField('country', 'Country', companyInfo.country, 'select', countries)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                Localization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderEditableField('timezone', 'Timezone', companyInfo.timezone, 'select', timezones)}
                {renderEditableField('currency', 'Currency', companyInfo.currency, 'select', currencies)}
                {renderEditableField('language', 'Language', companyInfo.language, 'select', languages)}
                {renderEditableField('dateFormat', 'Date Format', companyInfo.dateFormat, 'select', ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'])}
                {renderEditableField('timeFormat', 'Time Format', companyInfo.timeFormat, 'select', ['12', '24'])}
                {renderEditableField('weekStartsOn', 'Week Starts On', companyInfo.weekStartsOn, 'select', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Settings Tab */}
        <TabsContent value="organization" className="space-y-6">
          {/* Departments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Departments
                </div>
                <Button onClick={() => setNewDepartment({ name: '', description: '', head: '' })}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Department
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Department Form */}
                {(newDepartment.name || newDepartment.description || newDepartment.head) && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">Add New Department</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Department Name"
                        value={newDepartment.name}
                        onChange={(e) => setNewDepartment(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Description"
                        value={newDepartment.description}
                        onChange={(e) => setNewDepartment(prev => ({ ...prev, description: e.target.value }))}
                      />
                      <Select value={newDepartment.head} onValueChange={(value) => setNewDepartment(prev => ({ ...prev, head: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Department Head" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.filter(u => u.isEmployee && u.status === 'active').map(user => (
                            <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button onClick={() => addDepartment(newDepartment)} disabled={!newDepartment.name}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Department
                      </Button>
                      <Button variant="outline" onClick={() => setNewDepartment({ name: '', description: '', head: '' })}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Departments List */}
                <div className="space-y-2">
                  {departments.filter(dept => dept.active).map(dept => (
                    <div key={dept.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      {editingDepartment?.id === dept.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            value={editingDepartment.name}
                            onChange={(e) => setEditingDepartment(prev => ({ ...prev, name: e.target.value }))}
                            className="flex-1"
                          />
                          <Input
                            value={editingDepartment.description}
                            onChange={(e) => setEditingDepartment(prev => ({ ...prev, description: e.target.value }))}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => updateDepartment(dept.id, editingDepartment)}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingDepartment(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-900">{dept.name}</h4>
                            <p className="text-sm text-gray-600">{dept.description}</p>
                            {dept.head && <p className="text-xs text-blue-600">Head: {dept.head}</p>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingDepartment(dept)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteDepartment(dept.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Locations
                </div>
                <Button onClick={() => setNewLocation({ name: '', address: '', timezone: 'America/New_York' })}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Location
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Location Form */}
                {(newLocation.name || newLocation.address) && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">Add New Location</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Location Name"
                        value={newLocation.name}
                        onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                      />
                      <Input
                        placeholder="Address"
                        value={newLocation.address}
                        onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                      />
                      <Select value={newLocation.timezone} onValueChange={(value) => setNewLocation(prev => ({ ...prev, timezone: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map(tz => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button onClick={() => addLocation(newLocation)} disabled={!newLocation.name}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Location
                      </Button>
                      <Button variant="outline" onClick={() => setNewLocation({ name: '', address: '', timezone: 'America/New_York' })}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Locations List */}
                <div className="space-y-2">
                  {locations.filter(loc => loc.active).map(loc => (
                    <div key={loc.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      {editingLocation?.id === loc.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            value={editingLocation.name}
                            onChange={(e) => setEditingLocation(prev => ({ ...prev, name: e.target.value }))}
                            className="flex-1"
                          />
                          <Input
                            value={editingLocation.address}
                            onChange={(e) => setEditingLocation(prev => ({ ...prev, address: e.target.value }))}
                            className="flex-1"
                          />
                          <Button size="sm" onClick={() => updateLocation(loc.id, editingLocation)}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingLocation(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-900">{loc.name}</h4>
                            <p className="text-sm text-gray-600">{loc.address}</p>
                            <p className="text-xs text-blue-600">{loc.timezone}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingLocation(loc)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteLocation(loc.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Titles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Titles
                </div>
                <Button onClick={() => setNewJobTitle({ title: '', department: '', level: 'Junior' })}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Job Title
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Job Title Form */}
                {(newJobTitle.title || newJobTitle.department) && (
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-3">Add New Job Title</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        placeholder="Job Title"
                        value={newJobTitle.title}
                        onChange={(e) => setNewJobTitle(prev => ({ ...prev, title: e.target.value }))}
                      />
                      <Select value={newJobTitle.department} onValueChange={(value) => setNewJobTitle(prev => ({ ...prev, department: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.filter(d => d.active).map(dept => (
                            <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={newJobTitle.level} onValueChange={(value) => setNewJobTitle(prev => ({ ...prev, level: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobLevels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button onClick={() => addJobTitle(newJobTitle)} disabled={!newJobTitle.title}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Job Title
                      </Button>
                      <Button variant="outline" onClick={() => setNewJobTitle({ title: '', department: '', level: 'Junior' })}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Job Titles List */}
                <div className="space-y-2">
                  {jobTitles.filter(job => job.active).map(job => (
                    <div key={job.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      {editingJobTitle?.id === job.id ? (
                        <div className="flex gap-2 flex-1">
                          <Input
                            value={editingJobTitle.title}
                            onChange={(e) => setEditingJobTitle(prev => ({ ...prev, title: e.target.value }))}
                            className="flex-1"
                          />
                          <Select value={editingJobTitle.department} onValueChange={(value) => setEditingJobTitle(prev => ({ ...prev, department: value }))}>
                            <SelectTrigger className="flex-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.filter(d => d.active).map(dept => (
                                <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button size="sm" onClick={() => updateJobTitle(job.id, editingJobTitle)}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingJobTitle(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.department}</p>
                            <p className="text-xs text-blue-600">{job.level}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingJobTitle(job)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteJobTitle(job.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  User Management
                </div>
                <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                      <DialogDescription>
                        Add a new user to the system with appropriate permissions.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Full Name"
                          value={newUser.name}
                          onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                        />
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={newUser.email}
                          onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={newUser.role} onValueChange={(value: any) => setNewUser(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="User Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="isEmployee"
                            checked={newUser.isEmployee}
                            onCheckedChange={(checked) => setNewUser(prev => ({ ...prev, isEmployee: !!checked }))}
                          />
                          <label htmlFor="isEmployee" className="text-sm text-gray-700">Is Employee</label>
                        </div>
                      </div>
                      {newUser.isEmployee && (
                        <div className="grid grid-cols-2 gap-4">
                          <Select value={newUser.department} onValueChange={(value) => setNewUser(prev => ({ ...prev, department: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.filter(d => d.active).map(dept => (
                                <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={newUser.jobTitle} onValueChange={(value) => setNewUser(prev => ({ ...prev, jobTitle: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Job Title" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTitles.filter(j => j.active).map(job => (
                                <SelectItem key={job.id} value={job.title}>{job.title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addUser} disabled={!newUser.name || !newUser.email}>
                          Create User
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* User Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users List */}
              <div className="space-y-3">
                {filteredUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.isEmployee && (
                          <p className="text-xs text-blue-600">{user.jobTitle} • {user.department}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={
                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                        user.role === 'employee' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }>
                        {user.role}
                      </Badge>
                      <Badge className={
                        user.status === 'active' ? 'bg-green-100 text-green-700' :
                        user.status === 'inactive' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }>
                        {user.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                              <Key className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Manage Permissions - {user.name}</DialogTitle>
                              <DialogDescription>
                                Configure module access and permissions for this user.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {modulePermissions.map(module => (
                                <div key={module.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{module.name}</h4>
                                    <p className="text-sm text-gray-600">{module.description}</p>
                                    <Badge className="mt-1 bg-gray-100 text-gray-700 text-xs">
                                      {module.category}
                                    </Badge>
                                  </div>
                                  <Switch
                                    checked={user.permissions.includes(module.id)}
                                    onCheckedChange={(checked) => {
                                      const newPermissions = checked
                                        ? [...user.permissions, module.id]
                                        : user.permissions.filter(p => p !== module.id);
                                      updateUserPermissions(user.id, newPermissions);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                          className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
                        >
                          {user.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          {/* Leave Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Leave Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Annual Leave (days)</label>
                  <Input
                    type="number"
                    value={leaveSettings.annualLeave}
                    onChange={(e) => setLeaveSettings(prev => ({ ...prev, annualLeave: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sick Leave (days)</label>
                  <Input
                    type="number"
                    value={leaveSettings.sickLeave}
                    onChange={(e) => setLeaveSettings(prev => ({ ...prev, sickLeave: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Personal Leave (days)</label>
                  <Input
                    type="number"
                    value={leaveSettings.personalLeave}
                    onChange={(e) => setLeaveSettings(prev => ({ ...prev, personalLeave: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Maternity Leave (days)</label>
                  <Input
                    type="number"
                    value={leaveSettings.maternityLeave}
                    onChange={(e) => setLeaveSettings(prev => ({ ...prev, maternityLeave: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Paternity Leave (days)</label>
                  <Input
                    type="number"
                    value={leaveSettings.paternityLeave}
                    onChange={(e) => setLeaveSettings(prev => ({ ...prev, paternityLeave: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Carry Forward Limit (days)</label>
                  <Input
                    type="number"
                    value={leaveSettings.carryForwardLimit}
                    onChange={(e) => setLeaveSettings(prev => ({ ...prev, carryForwardLimit: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Approval Required</label>
                    <p className="text-xs text-gray-600">Require manager approval for leave requests</p>
                  </div>
                  <Switch
                    checked={leaveSettings.approvalRequired}
                    onCheckedChange={(checked) => setLeaveSettings(prev => ({ ...prev, approvalRequired: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow Negative Balance</label>
                    <p className="text-xs text-gray-600">Allow employees to take leave with negative balance</p>
                  </div>
                  <Switch
                    checked={leaveSettings.allowNegativeBalance}
                    onCheckedChange={(checked) => setLeaveSettings(prev => ({ ...prev, allowNegativeBalance: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Policies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Attendance Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Working Hours Start</label>
                  <Input
                    type="time"
                    value={attendanceSettings.workingHoursStart}
                    onChange={(e) => setAttendanceSettings(prev => ({ ...prev, workingHoursStart: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Working Hours End</label>
                  <Input
                    type="time"
                    value={attendanceSettings.workingHoursEnd}
                    onChange={(e) => setAttendanceSettings(prev => ({ ...prev, workingHoursEnd: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Core Hours Start</label>
                  <Input
                    type="time"
                    value={attendanceSettings.coreHoursStart}
                    onChange={(e) => setAttendanceSettings(prev => ({ ...prev, coreHoursStart: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Core Hours End</label>
                  <Input
                    type="time"
                    value={attendanceSettings.coreHoursEnd}
                    onChange={(e) => setAttendanceSettings(prev => ({ ...prev, coreHoursEnd: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Flexible Hours</label>
                    <p className="text-xs text-gray-600">Allow flexible working hours</p>
                  </div>
                  <Switch
                    checked={attendanceSettings.flexibleHours}
                    onCheckedChange={(checked) => setAttendanceSettings(prev => ({ ...prev, flexibleHours: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Auto Clock Out</label>
                    <p className="text-xs text-gray-600">Automatically clock out at end of day</p>
                  </div>
                  <Switch
                    checked={attendanceSettings.autoClockOut}
                    onCheckedChange={(checked) => setAttendanceSettings(prev => ({ ...prev, autoClockOut: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location Tracking</label>
                    <p className="text-xs text-gray-600">Track employee location during clock in/out</p>
                  </div>
                  <Switch
                    checked={attendanceSettings.trackLocation}
                    onCheckedChange={(checked) => setAttendanceSettings(prev => ({ ...prev, trackLocation: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Geofencing</label>
                    <p className="text-xs text-gray-600">Restrict clock in/out to specific locations</p>
                  </div>
                  <Switch
                    checked={attendanceSettings.enableGeofencing}
                    onCheckedChange={(checked) => setAttendanceSettings(prev => ({ ...prev, enableGeofencing: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Max Login Attempts</label>
                  <Input
                    type="number"
                    value={securitySettings.loginAttempts}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                    <p className="text-xs text-gray-600">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Audit Logging</label>
                    <p className="text-xs text-gray-600">Log all user activities</p>
                  </div>
                  <Switch
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, auditLogging: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-xs text-gray-600">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                    <p className="text-xs text-gray-600">Send browser push notifications</p>
                  </div>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Leave Request Alerts</label>
                    <p className="text-xs text-gray-600">Notify about leave requests</p>
                  </div>
                  <Switch
                    checked={notificationSettings.leaveRequests}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, leaveRequests: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Task Deadline Alerts</label>
                    <p className="text-xs text-gray-600">Notify about upcoming deadlines</p>
                  </div>
                  <Switch
                    checked={notificationSettings.taskDeadlines}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, taskDeadlines: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Attendance Alerts</label>
                    <p className="text-xs text-gray-600">Notify about attendance issues</p>
                  </div>
                  <Switch
                    checked={notificationSettings.attendanceAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, attendanceAlerts: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Announcement Alerts</label>
                    <p className="text-xs text-gray-600">Notify about new announcements</p>
                  </div>
                  <Switch
                    checked={notificationSettings.announcementAlerts}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, announcementAlerts: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Sync Tab */}
        <TabsContent value="data-sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Synchronization & Validation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataSyncValidator 
                tenant={tenant}
                employees={employees || []}
                appData={appData || {}}
                organizationData={organizationData}
                companySettings={companySettings}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
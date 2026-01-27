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
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { 
  DollarSign,
  Search,
  TrendingUp,
  Users,
  Calendar,
  Edit,
  Plus,
  Download,
  Eye,
  Award,
  Calculator,
  CreditCard,
  Check,
  Settings,
  Trash2,
  Save,
  Percent,
  Copy,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SalaryComponent {
  id: string;
  name: string;
  type: 'fixed' | 'percentage';
  operation: 'add' | 'subtract';
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface EmployeeSalaryComponent {
  componentId: string;
  componentName: string;
  type: 'fixed' | 'percentage';
  value: number;
  amount: number;
  operation: 'add' | 'subtract';
}

interface EmployeeSalary {
  id: string;
  employeeId: number;
  employeeName: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
  basicSalary: number;
  components: EmployeeSalaryComponent[];
  totalSalary: number;
  effectiveDate: string;
  isActive: boolean;
}

interface SalaryPayment {
  id: string;
  employeeId: number;
  employeeName: string;
  month: number;
  year: number;
  basicSalary: number;
  components: EmployeeSalaryComponent[];
  totalComponents: number;
  totalDeductions: number;
  bonus: number;
  deduction: number;
  totalSalary: number;
  paidDate: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'failed';
  notes?: string;
}

interface SalaryManagementProps {
  userRole: string;
  employees?: any[];
  companySettings?: any;
  appData?: any;
  onUpdateAppData?: (module: string, data: any) => void;
}

export function SalaryManagement({ 
  userRole, 
  employees = [], 
  companySettings,
  appData = {},
  onUpdateAppData = () => {}
}: SalaryManagementProps) {
  const [activeTab, setActiveTab] = useState('settings');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Payment History filters
  const [paymentFilters, setPaymentFilters] = useState({
    employee: 'all',
    month: 'all',
    year: new Date().getFullYear().toString(),
    search: ''
  });

  // Initialize salary components from appData
  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>(() => {
    if (appData.salary?.components && appData.salary.components.length > 0) {
      return appData.salary.components;
    }
    
    return [
      {
        id: '1',
        name: 'House Rent Allowance (HRA)',
        type: 'percentage',
        operation: 'add',
        description: 'Housing allowance based on basic salary',
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Professional Development',
        type: 'fixed',
        operation: 'add',
        description: 'Annual learning and development allowance',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
  });



  // Initialize employee salaries from real employee data
  const [employeeSalaries, setEmployeeSalaries] = useState<any[]>(() => {
    if (appData.salary?.employeeSalaries && appData.salary.employeeSalaries.length > 0) {
      return appData.salary.employeeSalaries;
    }
    
    // Initialize from employees data
    return employees.map(emp => ({
      id: emp.id.toString(),
      employeeId: emp.id,
      employeeName: emp.name,
      email: emp.email || `${emp.name.toLowerCase().replace(' ', '.')}@company.com`,
      department: emp.department || 'General',
      position: emp.title || emp.role || 'Employee',
      avatar: emp.avatar || emp.name.split(' ').map((n: string) => n[0]).join(''),
      basicSalary: emp.salary || 50000,
      components: [],
      totalSalary: emp.salary || 50000,
      effectiveDate: emp.startDate || new Date().toISOString().split('T')[0],
      isActive: emp.status === 'active'
    }));
  });

  // Initialize salary payments from appData
  const [salaryPayments, setSalaryPayments] = useState<SalaryPayment[]>(() => {
    return appData.salary?.payments || [];
  });

  // Sync salary data with appData
  useEffect(() => {
    const totalPayroll = employeeSalaries.reduce((sum, emp) => sum + emp.totalSalary, 0);
    
    onUpdateAppData('salary', {
      components: salaryComponents,
      employeeSalaries,
      payments: salaryPayments,
      totalPayroll,
      activeEmployees: employeeSalaries.filter(emp => emp.isActive).length
    });
  }, [salaryComponents, employeeSalaries, salaryPayments]);

  const [/*oldSalaryPayments*/, /*setOldSalaryPayments*/] = useState<SalaryPayment[]>([
    {
      id: '1',
      employeeId: 1,
      employeeName: 'Employee Name',
      month: 10,
      year: 2024,
      basicSalary: 50000,
      components: [],
      totalComponents: 0,
      totalDeductions: 0,
      bonus: 0,
      deduction: 0,
      totalSalary: 50000,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      status: 'paid'
    }
  ]);

  // Form states
  const [newComponent, setNewComponent] = useState({
    name: '',
    type: 'percentage' as 'fixed' | 'percentage',
    operation: 'add' as 'add' | 'subtract',
    description: ''
  });

  const [addSalaryForm, setAddSalaryForm] = useState({
    employeeId: '',
    basicSalary: '',
    selectedComponents: [] as string[],
    componentValues: {} as Record<string, number>
  });

  const [paySalaryForm, setPaySalaryForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    bonus: 0,
    deduction: 0,
    notes: ''
  });

  // Currency formatting based on company settings
  const formatCurrency = (amount: number) => {
    const currency = companySettings?.currency || 'USD';
    const locale = companySettings?.country === 'United States' ? 'en-US' : 
                   companySettings?.country === 'United Kingdom' ? 'en-GB' :
                   companySettings?.country === 'Canada' ? 'en-CA' :
                   companySettings?.country === 'Australia' ? 'en-AU' :
                   companySettings?.country === 'India' ? 'en-IN' :
                   companySettings?.country === 'Germany' ? 'de-DE' :
                   companySettings?.country === 'France' ? 'fr-FR' :
                   companySettings?.country === 'Japan' ? 'ja-JP' :
                   'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Get current currency symbol
  const getCurrencySymbol = () => {
    return companySettings?.currencySymbol || '$';
  };

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  // Get employees from props or use demo data
  const getAvailableEmployees = () => {
    if (employees && employees.length > 0) {
      return employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        department: emp.department,
        position: emp.role || emp.position,
        avatar: emp.avatar || emp.name.split(' ').map(n => n[0]).join('')
      }));
    }
    
    // Demo employees
    return [
      { id: 1, name: 'Sarah Chen', email: 'sarah.chen@company.com', department: 'Design', position: 'Senior UI/UX Designer', avatar: 'SC' },
      { id: 2, name: 'Marcus Rodriguez', email: 'marcus.rodriguez@company.com', department: 'Engineering', position: 'Senior Full Stack Developer', avatar: 'MR' },
      { id: 3, name: 'Jennifer Kim', email: 'jennifer.kim@company.com', department: 'Product', position: 'Product Manager', avatar: 'JK' },
      { id: 4, name: 'Alex Thompson', email: 'alex.thompson@company.com', department: 'Marketing', position: 'Marketing Specialist', avatar: 'AT' }
    ];
  };

  const availableEmployees = getAvailableEmployees();

  // Get unassigned employees (those without salary structure)
  const getUnassignedEmployees = () => {
    const assignedEmployeeIds = employeeSalaries.map(emp => emp.employeeId);
    return availableEmployees.filter(emp => !assignedEmployeeIds.includes(emp.id));
  };

  // Calculate total salary based on basic salary and component values
  const calculateTotalSalary = (basicSalary: number, componentValues: Record<string, number>) => {
    let total = basicSalary;
    let totalAdditions = 0;
    let totalDeductions = 0;

    Object.entries(componentValues).forEach(([componentId, value]) => {
      const component = salaryComponents.find(comp => comp.id === componentId);
      if (component && component.isActive) {
        let amount = 0;
        if (component.type === 'percentage') {
          amount = (basicSalary * value) / 100;
        } else {
          amount = value;
        }

        if (component.operation === 'add') {
          total += amount;
          totalAdditions += amount;
        } else {
          total -= amount;
          totalDeductions += amount;
        }
      }
    });

    return { total, totalAdditions, totalDeductions };
  };

  // Add new salary component (without value)
  const handleAddComponent = () => {
    if (!newComponent.name) {
      toast.error('Please enter component name');
      return;
    }

    const component: SalaryComponent = {
      id: Date.now().toString(),
      name: newComponent.name,
      type: newComponent.type,
      operation: newComponent.operation,
      description: newComponent.description,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setSalaryComponents(prev => [...prev, component]);
    setNewComponent({ name: '', type: 'percentage', operation: 'add', description: '' });
    toast.success('Salary component added successfully');
  };

  // Handle component selection in Add Salary form
  const handleComponentToggle = (componentId: string, checked: boolean) => {
    if (checked) {
      setAddSalaryForm(prev => ({
        ...prev,
        selectedComponents: [...prev.selectedComponents, componentId]
      }));
    } else {
      setAddSalaryForm(prev => ({
        ...prev,
        selectedComponents: prev.selectedComponents.filter(id => id !== componentId),
        componentValues: Object.fromEntries(
          Object.entries(prev.componentValues).filter(([id]) => id !== componentId)
        )
      }));
    }
  };

  // Handle component value change
  const handleComponentValueChange = (componentId: string, value: number) => {
    setAddSalaryForm(prev => ({
      ...prev,
      componentValues: {
        ...prev.componentValues,
        [componentId]: value
      }
    }));
  };

  // Toggle component active status
  const toggleComponent = (componentId: string) => {
    setSalaryComponents(prev => prev.map(comp => 
      comp.id === componentId ? { ...comp, isActive: !comp.isActive } : comp
    ));
  };

  // Delete component
  const deleteComponent = (componentId: string) => {
    setSalaryComponents(prev => prev.filter(comp => comp.id !== componentId));
    toast.success('Component deleted successfully');
  };

  // Add employee salary structure
  const handleAddSalary = () => {
    if (!addSalaryForm.employeeId || !addSalaryForm.basicSalary) {
      toast.error('Please select employee and enter basic salary');
      return;
    }

    const missingValues = addSalaryForm.selectedComponents.filter(
      componentId => !addSalaryForm.componentValues[componentId] || addSalaryForm.componentValues[componentId] <= 0
    );

    if (missingValues.length > 0) {
      toast.error('Please enter values for all selected components');
      return;
    }

    const employee = availableEmployees.find(emp => emp.id.toString() === addSalaryForm.employeeId);
    if (!employee) return;

    const basicSalary = parseFloat(addSalaryForm.basicSalary);
    const components: EmployeeSalaryComponent[] = addSalaryForm.selectedComponents.map(componentId => {
      const component = salaryComponents.find(comp => comp.id === componentId);
      const value = addSalaryForm.componentValues[componentId];
      
      if (!component) return null;

      let amount = 0;
      if (component.type === 'percentage') {
        amount = (basicSalary * value) / 100;
      } else {
        amount = value;
      }

      return {
        componentId: component.id,
        componentName: component.name,
        type: component.type,
        value: value,
        amount: amount,
        operation: component.operation
      };
    }).filter(Boolean) as EmployeeSalaryComponent[];

    const { total } = calculateTotalSalary(basicSalary, addSalaryForm.componentValues);

    const employeeSalary: EmployeeSalary = {
      id: Date.now().toString(),
      employeeId: employee.id,
      employeeName: employee.name,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      avatar: employee.avatar,
      basicSalary: basicSalary,
      components: components,
      totalSalary: total,
      effectiveDate: new Date().toISOString().split('T')[0],
      isActive: true
    };

    setEmployeeSalaries(prev => [...prev, employeeSalary]);
    setAddSalaryForm({ employeeId: '', basicSalary: '', selectedComponents: [], componentValues: {} });
    toast.success('Employee salary structure added successfully');
  };

  // Pay salary to employee
  const handlePaySalary = () => {
    if (!paySalaryForm.employeeId) {
      toast.error('Please select an employee');
      return;
    }

    const employeeSalary = employeeSalaries.find(emp => emp.employeeId.toString() === paySalaryForm.employeeId);
    if (!employeeSalary) return;

    // Check if salary for this month/year already exists
    const existingPayment = salaryPayments.find(payment => 
      payment.employeeId === employeeSalary.employeeId &&
      payment.month === paySalaryForm.month &&
      payment.year === paySalaryForm.year
    );

    if (existingPayment) {
      toast.error('Salary for this month has already been paid');
      return;
    }

    const totalComponents = employeeSalary.components
      .filter(comp => comp.operation === 'add')
      .reduce((sum, comp) => sum + comp.amount, 0);

    const totalDeductions = employeeSalary.components
      .filter(comp => comp.operation === 'subtract')
      .reduce((sum, comp) => sum + comp.amount, 0);

    const finalSalary = employeeSalary.basicSalary + totalComponents - totalDeductions + paySalaryForm.bonus - paySalaryForm.deduction;

    const payment: SalaryPayment = {
      id: Date.now().toString(),
      employeeId: employeeSalary.employeeId,
      employeeName: employeeSalary.employeeName,
      month: paySalaryForm.month,
      year: paySalaryForm.year,
      basicSalary: employeeSalary.basicSalary,
      components: employeeSalary.components,
      totalComponents: totalComponents,
      totalDeductions: totalDeductions + paySalaryForm.deduction,
      bonus: paySalaryForm.bonus,
      deduction: paySalaryForm.deduction,
      totalSalary: finalSalary,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      status: 'paid',
      notes: paySalaryForm.notes
    };

    setSalaryPayments(prev => [...prev, payment]);
    setPaySalaryForm({
      employeeId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      bonus: 0,
      deduction: 0,
      notes: ''
    });
    toast.success('Salary paid successfully');
  };

  // Filter and paginate salary payments
  const getFilteredPayments = () => {
    let filtered = salaryPayments;

    // Filter by employee
    if (paymentFilters.employee !== 'all') {
      filtered = filtered.filter(payment => payment.employeeId.toString() === paymentFilters.employee);
    }

    // Filter by month
    if (paymentFilters.month !== 'all') {
      filtered = filtered.filter(payment => payment.month.toString() === paymentFilters.month);
    }

    // Filter by year
    if (paymentFilters.year !== 'all') {
      filtered = filtered.filter(payment => payment.year.toString() === paymentFilters.year);
    }

    // Filter by search
    if (paymentFilters.search) {
      filtered = filtered.filter(payment => 
        payment.employeeName.toLowerCase().includes(paymentFilters.search.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredPayments = getFilteredPayments();
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  // Download salary slip
  const downloadSalarySlip = (payment: SalaryPayment) => {
    // Create a simple text-based salary slip
    const slipContent = `
SALARY SLIP - ${getMonthName(payment.month)} ${payment.year}
===============================================

Employee: ${payment.employeeName}
Payment Date: ${new Date(payment.paidDate).toLocaleDateString()}
Currency: ${companySettings?.currency || 'USD'}

EARNINGS:
---------
Basic Salary: ${formatCurrency(payment.basicSalary)}
${payment.components
  .filter(comp => comp.operation === 'add')
  .map(comp => `${comp.componentName}: ${formatCurrency(comp.amount)}`)
  .join('\n')}
${payment.bonus > 0 ? `Bonus: ${formatCurrency(payment.bonus)}` : ''}

DEDUCTIONS:
-----------
${payment.components
  .filter(comp => comp.operation === 'subtract')
  .map(comp => `${comp.componentName}: ${formatCurrency(comp.amount)}`)
  .join('\n')}
${payment.deduction > 0 ? `Additional Deduction: ${formatCurrency(payment.deduction)}` : ''}

SUMMARY:
--------
Gross Salary: ${formatCurrency(payment.basicSalary + payment.totalComponents + payment.bonus)}
Total Deductions: ${formatCurrency(payment.totalDeductions)}
Net Pay: ${formatCurrency(payment.totalSalary)}

${payment.notes ? `Notes: ${payment.notes}` : ''}

===============================================
Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    // Create and download the file
    const blob = new Blob([slipContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `salary-slip-${payment.employeeName.replace(/\s+/g, '-')}-${getMonthName(payment.month)}-${payment.year}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Salary slip downloaded successfully');
  };

  if (userRole !== 'admin') {
    return (
      <div className="container-mobile py-6 pb-24">
        <div className="text-center py-12">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600">Only administrators can access salary management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="w-8 h-8" />
            Salary Management
          </h1>
          <p className="text-gray-600">Manage salary components, employee compensation, and payroll processing</p>
          <p className="text-sm text-gray-500 mt-1">Currency: {companySettings?.currency || 'USD'} ({getCurrencySymbol()})</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{employeeSalaries.length}</p>
                <p className="text-sm text-gray-600">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{salaryComponents.filter(c => c.isActive).length}</p>
                <p className="text-sm text-gray-600">Active Components</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{salaryPayments.filter(p => p.status === 'paid').length}</p>
                <p className="text-sm text-gray-600">Payments Made</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(employeeSalaries.reduce((sum, emp) => sum + emp.totalSalary, 0))}
                </p>
                <p className="text-sm text-gray-600">Total Payroll</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 w-full">
          <TabsTrigger value="settings">Salary Settings</TabsTrigger>
          <TabsTrigger value="add-salary">Add Salary</TabsTrigger>
          <TabsTrigger value="overview">Salary Overview</TabsTrigger>
          <TabsTrigger value="pay-salary">Pay Salary</TabsTrigger>
          <TabsTrigger value="payments">Payment History</TabsTrigger>
        </TabsList>

        {/* Salary Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Add New Component */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Add Salary Component
              </CardTitle>
              <p className="text-sm text-gray-600">
                Create reusable salary components. Values will be set individually for each employee.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="component-name">Component Name *</Label>
                  <Input
                    id="component-name"
                    value={newComponent.name}
                    onChange={(e) => setNewComponent(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., HRA, Transport Allowance"
                  />
                </div>
                <div>
                  <Label htmlFor="component-type">Type *</Label>
                  <Select value={newComponent.type} onValueChange={(value: 'fixed' | 'percentage') => setNewComponent(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ({getCurrencySymbol()})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="component-operation">Operation *</Label>
                <Select value={newComponent.operation} onValueChange={(value: 'add' | 'subtract') => setNewComponent(prev => ({ ...prev, operation: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add to Basic Salary (Allowance)</SelectItem>
                    <SelectItem value="subtract">Subtract from Basic Salary (Deduction)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="component-description">Description</Label>
                <Textarea
                  id="component-description"
                  value={newComponent.description}
                  onChange={(e) => setNewComponent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description for this component"
                  rows={2}
                />
              </div>

              <Button onClick={handleAddComponent} disabled={!newComponent.name}>
                <Plus className="w-4 h-4 mr-2" />
                Add Component
              </Button>
            </CardContent>
          </Card>

          {/* Existing Components */}
          <Card>
            <CardHeader>
              <CardTitle>Salary Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salaryComponents.map((component) => (
                  <div key={component.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{component.name}</h3>
                        <Badge className={component.operation === 'add' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                          {component.operation === 'add' ? 'Allowance' : 'Deduction'} 
                          ({component.type === 'percentage' ? 'Percentage' : 'Fixed Amount'})
                        </Badge>
                        <Badge variant={component.isActive ? 'default' : 'secondary'}>
                          {component.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {component.description && (
                        <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Created: {component.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={component.isActive}
                        onCheckedChange={() => toggleComponent(component.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteComponent(component.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {salaryComponents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No salary components configured yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Salary Tab */}
        <TabsContent value="add-salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Employee Salary Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="select-employee">Select Employee *</Label>
                  <Select value={addSalaryForm.employeeId} onValueChange={(value) => setAddSalaryForm(prev => ({ ...prev, employeeId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {getUnassignedEmployees().map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{employee.name}</span>
                            <span className="text-sm text-gray-500">({employee.department})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {getUnassignedEmployees().length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">All employees have salary structures assigned</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="basic-salary">Basic Salary ({getCurrencySymbol()}) *</Label>
                  <div className="relative">
                    <Input
                      id="basic-salary"
                      type="number"
                      value={addSalaryForm.basicSalary}
                      onChange={(e) => setAddSalaryForm(prev => ({ ...prev, basicSalary: e.target.value }))}
                      placeholder="e.g., 50000"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      {getCurrencySymbol()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Select Salary Components & Set Values</Label>
                <p className="text-sm text-gray-600 mb-3">Choose components and set their values for this employee</p>
                <div className="space-y-3">
                  {salaryComponents.filter(comp => comp.isActive).map((component) => (
                    <div key={component.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={`component-${component.id}`}
                          checked={addSalaryForm.selectedComponents.includes(component.id)}
                          onChange={(e) => handleComponentToggle(component.id, e.target.checked)}
                          className="rounded mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor={`component-${component.id}`} className="cursor-pointer">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{component.name}</span>
                              <Badge className={component.operation === 'add' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                {component.operation === 'add' ? 'Allowance' : 'Deduction'}
                              </Badge>
                            </div>
                            {component.description && (
                              <p className="text-xs text-gray-500 mb-2">{component.description}</p>
                            )}
                          </label>
                          
                          {addSalaryForm.selectedComponents.includes(component.id) && (
                            <div className="mt-2">
                              <Label className="text-xs">
                                {component.type === 'percentage' ? 'Percentage (%)' : `Amount (${getCurrencySymbol()})`}
                              </Label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  value={addSalaryForm.componentValues[component.id] || ''}
                                  onChange={(e) => handleComponentValueChange(component.id, parseFloat(e.target.value) || 0)}
                                  placeholder={component.type === 'percentage' ? 'e.g., 40' : 'e.g., 2000'}
                                  className="pr-8"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                                  {component.type === 'percentage' ? '%' : getCurrencySymbol()}
                                </span>
                              </div>
                              {addSalaryForm.basicSalary && addSalaryForm.componentValues[component.id] && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Amount: {formatCurrency(
                                    component.type === 'percentage' 
                                      ? (parseFloat(addSalaryForm.basicSalary) * addSalaryForm.componentValues[component.id]) / 100
                                      : addSalaryForm.componentValues[component.id]
                                  )}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Salary Preview */}
              {addSalaryForm.basicSalary && addSalaryForm.selectedComponents.length > 0 && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-blue-900 mb-3">Salary Breakdown Preview</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Basic Salary:</span>
                        <span className="font-medium">{formatCurrency(parseFloat(addSalaryForm.basicSalary))}</span>
                      </div>
                      {addSalaryForm.selectedComponents.map(componentId => {
                        const component = salaryComponents.find(c => c.id === componentId);
                        const value = addSalaryForm.componentValues[componentId];
                        if (!component || !value) return null;
                        
                        const basicSalary = parseFloat(addSalaryForm.basicSalary);
                        const amount = component.type === 'percentage' 
                          ? (basicSalary * value) / 100 
                          : value;
                        
                        return (
                          <div key={componentId} className="flex justify-between text-sm">
                            <span className={component.operation === 'add' ? 'text-green-700' : 'text-red-700'}>
                              {component.operation === 'add' ? '+' : '-'} {component.name}:
                            </span>
                            <span className={component.operation === 'add' ? 'text-green-700' : 'text-red-700'}>
                              {formatCurrency(amount)}
                            </span>
                          </div>
                        );
                      })}
                      <Separator />
                      <div className="flex justify-between font-bold text-blue-900">
                        <span>Total Salary:</span>
                        <span>
                          {formatCurrency(calculateTotalSalary(parseFloat(addSalaryForm.basicSalary), addSalaryForm.componentValues).total)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button 
                onClick={handleAddSalary} 
                disabled={!addSalaryForm.employeeId || !addSalaryForm.basicSalary}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Salary Structure
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Salary Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employeeSalaries.map((employee) => (
                  <Card key={employee.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {employee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900">{employee.employeeName}</h3>
                          <p className="text-sm text-gray-600">{employee.position} • {employee.department}</p>
                          <p className="text-xs text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(employee.totalSalary)}
                        </div>
                        <p className="text-sm text-gray-500">Monthly</p>
                      </div>
                    </div>
                    
                    {/* Salary Breakdown */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Salary Breakdown</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Basic Salary:</span>
                            <span className="font-medium">{formatCurrency(employee.basicSalary)}</span>
                          </div>
                          {employee.components
                            .filter(comp => comp.operation === 'add')
                            .map((component, index) => (
                              <div key={index} className="flex justify-between text-sm text-green-700 mb-1">
                                <span>+ {component.componentName}:</span>
                                <span>{formatCurrency(component.amount)}</span>
                              </div>
                            ))
                          }
                        </div>
                        <div>
                          {employee.components
                            .filter(comp => comp.operation === 'subtract')
                            .map((component, index) => (
                              <div key={index} className="flex justify-between text-sm text-red-700 mb-1">
                                <span>- {component.componentName}:</span>
                                <span>{formatCurrency(component.amount)}</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
                {employeeSalaries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No employee salary structures configured yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pay Salary Tab */}
        <TabsContent value="pay-salary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Process Salary Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pay-employee">Select Employee *</Label>
                  <Select value={paySalaryForm.employeeId} onValueChange={(value) => setPaySalaryForm(prev => ({ ...prev, employeeId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employeeSalaries.map((employee) => (
                        <SelectItem key={employee.id} value={employee.employeeId.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{employee.employeeName}</span>
                            <span className="text-sm text-gray-500">{formatCurrency(employee.totalSalary)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pay-month">Month *</Label>
                  <Select value={paySalaryForm.month.toString()} onValueChange={(value) => setPaySalaryForm(prev => ({ ...prev, month: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {getMonthName(i + 1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pay-year">Year *</Label>
                  <Select value={paySalaryForm.year.toString()} onValueChange={(value) => setPaySalaryForm(prev => ({ ...prev, year: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2025, 2026].map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bonus-amount">Bonus Amount ({getCurrencySymbol()})</Label>
                  <div className="relative">
                    <Input
                      id="bonus-amount"
                      type="number"
                      value={paySalaryForm.bonus || ''}
                      onChange={(e) => setPaySalaryForm(prev => ({ ...prev, bonus: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      {getCurrencySymbol()}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="deduction-amount">Additional Deduction ({getCurrencySymbol()})</Label>
                  <div className="relative">
                    <Input
                      id="deduction-amount"
                      type="number"
                      value={paySalaryForm.deduction || ''}
                      onChange={(e) => setPaySalaryForm(prev => ({ ...prev, deduction: parseFloat(e.target.value) || 0 }))}
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
                      {getCurrencySymbol()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="payment-notes">Notes (Optional)</Label>
                <Textarea
                  id="payment-notes"
                  value={paySalaryForm.notes}
                  onChange={(e) => setPaySalaryForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes for this payment"
                  rows={2}
                />
              </div>

              {/* Payment Preview */}
              {paySalaryForm.employeeId && (
                (() => {
                  const selectedEmployee = employeeSalaries.find(emp => emp.employeeId.toString() === paySalaryForm.employeeId);
                  if (!selectedEmployee) return null;

                  const totalAdditions = selectedEmployee.components
                    .filter(comp => comp.operation === 'add')
                    .reduce((sum, comp) => sum + comp.amount, 0);

                  const totalDeductions = selectedEmployee.components
                    .filter(comp => comp.operation === 'subtract')
                    .reduce((sum, comp) => sum + comp.amount, 0);

                  const finalAmount = selectedEmployee.basicSalary + totalAdditions - totalDeductions + paySalaryForm.bonus - paySalaryForm.deduction;

                  return (
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-green-900 mb-3">Payment Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Employee:</span>
                            <span className="font-medium">{selectedEmployee.employeeName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Period:</span>
                            <span className="font-medium">{getMonthName(paySalaryForm.month)} {paySalaryForm.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Basic Salary:</span>
                            <span>{formatCurrency(selectedEmployee.basicSalary)}</span>
                          </div>
                          <div className="flex justify-between text-green-700">
                            <span>Total Allowances:</span>
                            <span>+{formatCurrency(totalAdditions)}</span>
                          </div>
                          <div className="flex justify-between text-red-700">
                            <span>Total Deductions:</span>
                            <span>-{formatCurrency(totalDeductions)}</span>
                          </div>
                          {paySalaryForm.bonus > 0 && (
                            <div className="flex justify-between text-green-700">
                              <span>Bonus:</span>
                              <span>+{formatCurrency(paySalaryForm.bonus)}</span>
                            </div>
                          )}
                          {paySalaryForm.deduction > 0 && (
                            <div className="flex justify-between text-red-700">
                              <span>Additional Deduction:</span>
                              <span>-{formatCurrency(paySalaryForm.deduction)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-bold text-green-900 text-lg">
                            <span>Net Pay:</span>
                            <span>{formatCurrency(finalAmount)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()
              )}

              <Button 
                onClick={handlePaySalary} 
                disabled={!paySalaryForm.employeeId}
                className="w-full"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Process Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="payments" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Payment History Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Employee</Label>
                  <Select value={paymentFilters.employee} onValueChange={(value) => setPaymentFilters(prev => ({ ...prev, employee: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {employeeSalaries.map((employee) => (
                        <SelectItem key={employee.employeeId} value={employee.employeeId.toString()}>
                          {employee.employeeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Month</Label>
                  <Select value={paymentFilters.month} onValueChange={(value) => setPaymentFilters(prev => ({ ...prev, month: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {getMonthName(i + 1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Year</Label>
                  <Select value={paymentFilters.year} onValueChange={(value) => setPaymentFilters(prev => ({ ...prev, year: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Years</SelectItem>
                      {[2024, 2025, 2026].map(year => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Search</Label>
                  <Input
                    placeholder="Search by employee name..."
                    value={paymentFilters.search}
                    onChange={(e) => setPaymentFilters(prev => ({ ...prev, search: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment History</CardTitle>
                <div className="text-sm text-gray-600">
                  {filteredPayments.length} total payments
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paginatedPayments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Check className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.employeeName}</h3>
                        <p className="text-sm text-gray-600">
                          {getMonthName(payment.month)} {payment.year} • Paid on {new Date(payment.paidDate).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>Basic: {formatCurrency(payment.basicSalary)}</span>
                          <span className="text-green-600">+{formatCurrency(payment.totalComponents)}</span>
                          <span className="text-red-600">-{formatCurrency(payment.totalDeductions)}</span>
                          {payment.bonus > 0 && <span className="text-green-600">Bonus: +{formatCurrency(payment.bonus)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(payment.totalSalary)}
                        </div>
                        <Badge className={payment.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                          {payment.status}
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSalarySlip(payment)}
                        className="ml-2"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Download Slip
                      </Button>
                    </div>
                  </div>
                ))}
                {paginatedPayments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No payment history matches your filters
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredPayments.length)} of {filteredPayments.length} payments
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
      </Tabs>
    </div>
  );
}
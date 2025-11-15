import { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  LogOut,
  Users,
  DollarSign, 
  TrendingUp,
  MapPin,
  Calendar,
  Settings,
  ShoppingCart,
  Palette,
  Building2,
  Edit,
  Plus,
  Eye,
  Trash2,
  BarChart3,
  Globe,
  CreditCard,
  UserCheck,
  Filter,
  Download,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import {
  fetchServicePlans,
  createServicePlan,
  updateServicePlan,
  type ServicePlanDto,
  type CreateServicePlanPayload,
  type UpdateServicePlanPayload,
} from '../lib/adminApi';

type PlanEditorResult = {
  name: string;
  code: string;
  posType: ServicePlanDto['posType'];
  description?: string;
  featureHighlights: string[];
  allowedModules: string[];
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  defaultBillingCycle: 'MONTHLY' | 'ANNUAL';
  trialPeriodDays: number;
  isFeatured: boolean;
  isActive: boolean;
};

const PLAN_SECTIONS: Array<{ key: ServicePlanDto['posType']; label: string }> = [
  { key: 'RESTAURANT', label: 'Restaurant POS' },
  { key: 'ARTIST', label: 'Artist/Freelancer POS' },
  { key: 'BUSINESS', label: 'Small Business POS' },
];

type PlanFormFields = {
  name: string;
  code: string;
  posType: ServicePlanDto['posType'];
  description: string;
  featureHighlights: string;
  allowedModules: string;
  monthlyPrice: string;
  annualPrice: string;
  currency: string;
  defaultBillingCycle: 'MONTHLY' | 'ANNUAL';
  trialPeriodDays: string;
  isFeatured: boolean;
  isActive: boolean;
};

function stringifyList(values: string[] | undefined): string {
  if (!values || values.length === 0) {
    return '';
  }
  return values.join('\n');
}

function parseListInput(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildInitialPlanForm(
  mode: 'create' | 'edit',
  defaultPosType: ServicePlanDto['posType'],
  initialPlan: ServicePlanDto | null
): PlanFormFields {
  const plan = initialPlan ?? null;

  return {
    name: plan?.name ?? '',
    code: plan?.code ?? '',
    posType: plan?.posType ?? defaultPosType,
    description: plan?.description ?? '',
    featureHighlights: stringifyList(plan?.featureHighlights),
    allowedModules: stringifyList(plan?.allowedModules),
    monthlyPrice: plan ? String(plan.monthlyPrice) : '',
    annualPrice: plan ? String(plan.annualPrice) : '',
    currency: plan?.currency ?? 'INR',
    defaultBillingCycle: plan?.defaultBillingCycle ?? 'MONTHLY',
    trialPeriodDays: plan ? String(plan.trialPeriodDays) : '14',
    isFeatured: plan?.isFeatured ?? false,
    isActive: plan ? true : true,
  };
}

interface AdminDashboardProps {
  admin: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
    lastLoginAt?: string;
  };
  onLogout: () => void;
}

export function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDateRange, setSelectedDateRange] = useState('30d');
  const [selectedPOS, setSelectedPOS] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [plans, setPlans] = useState<ServicePlanDto[]>([]);
  const [planLoading, setPlanLoading] = useState(true);
  const [planError, setPlanError] = useState<string | null>(null);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [planDialogMode, setPlanDialogMode] = useState<'create' | 'edit'>('create');
  const [planEditorDefaultPosType, setPlanEditorDefaultPosType] = useState<ServicePlanDto['posType']>('RESTAURANT');
  const [planBeingEdited, setPlanBeingEdited] = useState<ServicePlanDto | null>(null);
  const [planDialogError, setPlanDialogError] = useState<string | null>(null);
  const [planDialogSubmitting, setPlanDialogSubmitting] = useState(false);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setPlanLoading(true);
        const data = await fetchServicePlans();
        setPlans(data);
        setPlanError(null);
      } catch (error) {
        setPlanError(error instanceof Error ? error.message : 'Failed to load service plans.');
      } finally {
        setPlanLoading(false);
      }
    };

    loadPlans();
  }, []);

  const groupedPlans = useMemo(() => {
    const groups: Record<ServicePlanDto['posType'], ServicePlanDto[]> = {
      RESTAURANT: [],
      ARTIST: [],
      BUSINESS: [],
    };

    plans.forEach((plan) => {
      groups[plan.posType].push(plan);
    });

    (Object.keys(groups) as Array<ServicePlanDto['posType']>).forEach((key) => {
      groups[key] = groups[key]
        .slice()
        .sort((a, b) => a.monthlyPrice - b.monthlyPrice);
    });

    return groups;
  }, [plans]);

  const handleAddPlan = (posType: ServicePlanDto['posType']) => {
    setPlanDialogMode('create');
    setPlanEditorDefaultPosType(posType);
    setPlanBeingEdited(null);
    setPlanDialogError(null);
    setIsPlanDialogOpen(true);
  };

  const handleEditPlan = (plan: ServicePlanDto) => {
    setPlanDialogMode('edit');
    setPlanEditorDefaultPosType(plan.posType);
    setPlanBeingEdited(plan);
    setPlanDialogError(null);
    setIsPlanDialogOpen(true);
  };

  const handlePlanDialogSubmit = async (values: PlanEditorResult) => {
    try {
      setPlanDialogSubmitting(true);
      setPlanDialogError(null);

      if (planDialogMode === 'create') {
        const payload: CreateServicePlanPayload = {
          name: values.name,
          code: values.code,
          posType: values.posType,
          description: values.description,
          featureHighlights: values.featureHighlights,
          allowedModules: values.allowedModules,
          monthlyPrice: values.monthlyPrice,
          annualPrice: values.annualPrice,
          currency: values.currency,
          defaultBillingCycle: values.defaultBillingCycle,
          trialPeriodDays: values.trialPeriodDays,
          isFeatured: values.isFeatured,
          isActive: values.isActive,
        };
        await createServicePlan(payload);
      } else if (planBeingEdited) {
        const { code: _code, ...rest } = values;
        const payload: UpdateServicePlanPayload = {
          ...rest,
        };
        await updateServicePlan(planBeingEdited.id, payload);
      }

      const refreshedPlans = await fetchServicePlans();
      setPlans(refreshedPlans);
      setIsPlanDialogOpen(false);
      setPlanBeingEdited(null);
    } catch (error) {
      setPlanDialogError(error instanceof Error ? error.message : 'Failed to save service plan.');
    } finally {
      setPlanDialogSubmitting(false);
    }
  };

  const formatPrice = (value: number, currency: string) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (error) {
      return `${currency} ${value.toFixed(0)}`;
    }
  };

  // Mock data for the three POS systems
  const mockUsers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@kumarrestaurant.com',
      posType: 'restaurant',
      plan: 'Pro',
      country: 'India',
      city: 'Mumbai',
      joinDate: '2024-01-15',
      subscriptionStatus: 'Active',
      expiryDate: '2024-12-15',
      monthlyRevenue: 999,
      totalRevenue: 11988,
      transactionsCount: 8500,
      lastActive: '2024-08-20'
    },
    {
      id: 2,
      name: 'Sarah Creative',
      email: 'sarah@creativestudio.com',
      posType: 'artist',
      plan: 'Basic',
      country: 'USA',
      city: 'New York',
      joinDate: '2024-02-20',
      subscriptionStatus: 'Active',
      expiryDate: '2024-11-20',
      monthlyRevenue: 499,
      totalRevenue: 3493,
      transactionsCount: 2800,
      lastActive: '2024-08-21'
    },
    {
      id: 3,
      name: 'Mike Business',
      email: 'mike@smallbiz.com',
      posType: 'business',
      plan: 'Enterprise',
      country: 'Canada',
      city: 'Toronto',
      joinDate: '2024-01-05',
      subscriptionStatus: 'Active',
      expiryDate: '2025-01-05',
      monthlyRevenue: 1999,
      totalRevenue: 15992,
      transactionsCount: 12000,
      lastActive: '2024-08-22'
    },
    {
      id: 4,
      name: 'Priya Mehta',
      email: 'priya@creativeworks.in',
      posType: 'artist',
      plan: 'Pro',
      country: 'India',
      city: 'Bangalore',
      joinDate: '2024-03-10',
      subscriptionStatus: 'Expired',
      expiryDate: '2024-08-10',
      monthlyRevenue: 0,
      totalRevenue: 4995,
      transactionsCount: 3500,
      lastActive: '2024-08-10'
    },
    {
      id: 5,
      name: 'Restaurant Chain Ltd',
      email: 'admin@chainrestaurant.com',
      posType: 'restaurant',
      plan: 'Enterprise',
      country: 'UK',
      city: 'London',
      joinDate: '2024-01-01',
      subscriptionStatus: 'Active',
      expiryDate: '2025-01-01',
      monthlyRevenue: 1999,
      totalRevenue: 15992,
      transactionsCount: 15000,
      lastActive: '2024-08-22'
    }
  ];

  // Analytics data
  const revenueData = [
    { month: 'Jan', restaurant: 45000, artist: 15000, business: 25000 },
    { month: 'Feb', restaurant: 52000, artist: 18000, business: 28000 },
    { month: 'Mar', restaurant: 48000, artist: 22000, business: 32000 },
    { month: 'Apr', restaurant: 61000, artist: 25000, business: 35000 },
    { month: 'May', restaurant: 55000, artist: 28000, business: 38000 },
    { month: 'Jun', restaurant: 67000, artist: 32000, business: 42000 },
    { month: 'Jul', restaurant: 71000, artist: 35000, business: 45000 },
    { month: 'Aug', restaurant: 69000, artist: 38000, business: 48000 }
  ];

  const userDistribution = [
    { name: 'Restaurant POS', value: 45, color: '#f59e0b' },
    { name: 'Artist/Freelancer POS', value: 30, color: '#8b5cf6' },
    { name: 'Small Business POS', value: 25, color: '#6b7280' }
  ];

  const locationData = [
    { country: 'India', users: 125, revenue: 75000 },
    { country: 'USA', users: 89, revenue: 95000 },
    { country: 'UK', users: 67, revenue: 68000 },
    { country: 'Canada', users: 45, revenue: 52000 },
    { country: 'Australia', users: 34, revenue: 41000 }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPOS = selectedPOS === 'all' || user.posType === selectedPOS;
    return matchesSearch && matchesPOS;
  });

  const getTotalStats = () => {
    const totalUsers = mockUsers.length;
    const activeUsers = mockUsers.filter(u => u.subscriptionStatus === 'Active').length;
    const totalRevenue = mockUsers.reduce((sum, user) => sum + user.totalRevenue, 0);
    const monthlyRevenue = mockUsers.reduce((sum, user) => sum + user.monthlyRevenue, 0);
    
    return { totalUsers, activeUsers, totalRevenue, monthlyRevenue };
  };

  const stats = getTotalStats();

  const getPOSIcon = (posType: string) => {
    switch (posType) {
      case 'restaurant': return ShoppingCart;
      case 'artist': return Palette;
      case 'business': return Building2;
      default: return Building2;
    }
  };

  const getPOSColor = (posType: string) => {
    switch (posType) {
      case 'restaurant': return 'bg-orange-500';
      case 'artist': return 'bg-purple-500';
      case 'business': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Easy to Manage Master Admin</h1>
              <p className="text-sm text-gray-600">Manage all POS systems and users</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-32">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +12% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +8% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      +15% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      All-time high
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by POS Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="restaurant" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="artist" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="business" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent User Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUsers.slice(0, 5).map((user) => {
                    const Icon = getPOSIcon(user.posType);
                    return (
                      <div key={user.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 ${getPOSColor(user.posType)} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{user.monthlyRevenue}/month</p>
                          <Badge variant={user.subscriptionStatus === 'Active' ? 'default' : 'secondary'}>
                            {user.subscriptionStatus}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={selectedPOS} onValueChange={setSelectedPOS}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by POS type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All POS Types</SelectItem>
                  <SelectItem value="restaurant">Restaurant POS</SelectItem>
                  <SelectItem value="artist">Artist/Freelancer POS</SelectItem>
                  <SelectItem value="business">Small Business POS</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>User Management ({filteredUsers.length} users)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">POS Type</th>
                        <th className="text-left p-4">Plan</th>
                        <th className="text-left p-4">Location</th>
                        <th className="text-left p-4">Revenue</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => {
                        const Icon = getPOSIcon(user.posType);
                        return (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 ${getPOSColor(user.posType)} rounded-lg flex items-center justify-center`}>
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline">
                                {user.posType === 'restaurant' ? 'Restaurant' : 
                                 user.posType === 'artist' ? 'Artist/Freelancer' : 'Small Business'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge>{user.plan}</Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="text-sm">{user.city}, {user.country}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <p className="font-medium">₹{user.monthlyRevenue}/mo</p>
                                <p className="text-sm text-muted-foreground">₹{user.totalRevenue} total</p>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={user.subscriptionStatus === 'Active' ? 'default' : 'secondary'}>
                                {user.subscriptionStatus}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="restaurant" fill="#f59e0b" />
                      <Bar dataKey="artist" fill="#8b5cf6" />
                      <Bar dataKey="business" fill="#6b7280" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-green-700">Conversion Rate</p>
                      <p className="text-2xl font-bold text-green-900">24.5%</p>
                    </div>
                    <ArrowUpRight className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-blue-700">Customer Retention</p>
                      <p className="text-2xl font-bold text-blue-900">89.2%</p>
                    </div>
                    <ArrowUpRight className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                    <div>
                      <p className="text-sm text-purple-700">Avg. Revenue per User</p>
                      <p className="text-2xl font-bold text-purple-900">₹{Math.round(stats.totalRevenue / stats.totalUsers)}</p>
                    </div>
                    <ArrowUpRight className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Locations Tab */}
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {locationData.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{location.country}</p>
                          <p className="text-sm text-muted-foreground">{location.users} users</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{location.revenue.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Plans Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <div className="space-y-4">
              {planError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {planError}
                </div>
              )}

              {PLAN_SECTIONS.map((section) => {
                const sectionPlans = groupedPlans[section.key] ?? [];

                return (
                  <Card key={section.key}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {section.key === 'RESTAURANT' && <ShoppingCart className="w-5 h-5" />}
                        {section.key === 'ARTIST' && <Palette className="w-5 h-5" />}
                        {section.key === 'BUSINESS' && <Building2 className="w-5 h-5" />}
                        {section.label} Plans
                      </CardTitle>
                      <Button onClick={() => handleAddPlan(section.key)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Plan
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {planLoading ? (
                        <div className="text-sm text-muted-foreground">Loading plans…</div>
                      ) : sectionPlans.length === 0 ? (
                        <div className="text-sm text-muted-foreground">
                          No plans configured yet for this POS. Add a plan to get started.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {sectionPlans.map((plan) => {
                            const highlights = plan.featureHighlights?.length ? plan.featureHighlights : plan.allowedModules;
                            return (
                              <div key={plan.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-semibold">{plan.name}</h4>
                                      {plan.isFeatured && <Badge variant="secondary">Featured</Badge>}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {plan.description || 'No description provided yet.'}
                                    </p>
                                    <div className="text-blue-600 font-semibold">
                                      {formatPrice(plan.monthlyPrice, plan.currency)}
                                      <span className="ml-1 text-xs text-muted-foreground">/ month</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {formatPrice(plan.annualPrice, plan.currency)} annually • {plan.defaultBillingCycle === 'ANNUAL' ? 'Annual billing' : 'Monthly billing'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Trial: {plan.trialPeriodDays} days
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase">Highlights</p>
                                  <ul className="mt-1 space-y-1 text-sm">
                                    {highlights.map((feature, index) => (
                                      <li key={`${plan.id}-feature-${index}`} className="flex items-center gap-2">
                                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Allowed Modules</p>
                                  <div className="flex flex-wrap gap-2">
                                    {plan.allowedModules.length === 0 && (
                                      <span className="text-xs text-muted-foreground">No modules assigned.</span>
                                    )}
                                    {plan.allowedModules.map((module) => (
                                      <Badge key={`${plan.id}-${module}`} variant="outline">
                                        {module}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Send system notifications</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Backup Settings</p>
                      <p className="text-sm text-muted-foreground">Automated daily backups</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Security Settings</p>
                      <p className="text-sm text-muted-foreground">Two-factor authentication</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Payment Gateway</p>
                      <p className="text-sm text-muted-foreground">Razorpay integration</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">WhatsApp API</p>
                      <p className="text-sm text-muted-foreground">Message notifications</p>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Analytics</p>
                      <p className="text-sm text-muted-foreground">Google Analytics</p>
                    </div>
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        <PlanEditorDialog
          open={isPlanDialogOpen}
          onOpenChange={(open) => {
            setIsPlanDialogOpen(open);
            if (!open) {
              setPlanDialogError(null);
              setPlanBeingEdited(null);
            }
          }}
          mode={planDialogMode}
          defaultPosType={planEditorDefaultPosType}
          initialPlan={planBeingEdited}
          submitting={planDialogSubmitting}
          error={planDialogError}
          onSubmit={handlePlanDialogSubmit}
        />
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { 
  HardDrive,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  User,
  Building2,
  Upload,
  X,
  Save,
  Package,
  Laptop,
  Monitor,
  Smartphone,
  Printer,
  Router,
  Camera,
  Headphones,
  Keyboard,
  Mouse,
  Speaker,
  Tablet,
  Watch,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  FileImage,
  MoreVertical
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  details: string;
  images: string[];
  location: {
    type: 'employee' | 'company';
    employeeId?: number;
    employeeName?: string;
    companyLocation?: string;
  };
  additionalNotes?: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  createdAt: string;
  updatedAt?: string;
  createdBy: {
    id: number;
    name: string;
  };
  category: string;
  serialNumber?: string;
  purchaseDate?: string;
  value?: number;
}

interface AssetTrackerProps {
  userRole: string;
  currentUser?: any;
  employees?: any[];
  appData?: any;
  onUpdateAppData?: (module: string, data: any) => void;
}

export function AssetTracker({ 
  userRole,
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  appData = {},
  onUpdateAppData = () => {}
}: AssetTrackerProps) {
  // Initialize assets from appData
  const [assets, setAssets] = useState<Asset[]>(() => {
    return appData.assets?.assets || [];
  });

  // Sync assets with appData
  useEffect(() => {
    const totalValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0);
    const assignedAssets = assets.filter(asset => asset.status === 'assigned').length;
    
    onUpdateAppData('assets', {
      assets,
      assignments: assets.filter(asset => asset.status === 'assigned'),
      totalValue,
      assignedAssets
    });
  }, [assets]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    images: [] as string[],
    locationType: 'company' as 'employee' | 'company',
    employeeId: '',
    companyLocation: '',
    additionalNotes: '',
    category: '',
    serialNumber: '',
    purchaseDate: '',
    value: ''
  });
  // Per-field validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Categories for assets
  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'laptop', name: 'Laptops', icon: Laptop },
    { id: 'monitor', name: 'Monitors', icon: Monitor },
    { id: 'smartphone', name: 'Smartphones', icon: Smartphone },
    { id: 'tablet', name: 'Tablets', icon: Tablet },
    { id: 'printer', name: 'Printers', icon: Printer },
    { id: 'headphones', name: 'Headphones', icon: Headphones },
    { id: 'keyboard', name: 'Keyboards', icon: Keyboard },
    { id: 'mouse', name: 'Mice', icon: Mouse },
    { id: 'camera', name: 'Cameras', icon: Camera },
    { id: 'speaker', name: 'Speakers', icon: Speaker },
    { id: 'router', name: 'Network Equipment', icon: Router },
    { id: 'watch', name: 'Smart Watches', icon: Watch },
    { id: 'other', name: 'Other', icon: Package }
  ];

  // Company locations
  const companyLocations = [
    'New York Office - Main Floor',
    'New York Office - Design Department',
    'New York Office - Engineering',
    'San Francisco Office - Equipment Storage',
    'San Francisco Office - Conference Room',
    'Austin Office - Main Floor',
    'Austin Office - Break Room',
    'Seattle Office - Equipment Storage',
    'Miami Office - Main Floor',
    'Storage Room - Building A',
    'Data Center - Server Room'
  ];

  // Get available employees
  const getAvailableEmployees = () => {
    if (employees && employees.length > 0) {
      return employees.map(emp => ({
        id: emp.id,
        name: emp.name,
        department: emp.department,
        position: emp.role || emp.position
      }));
    }
    
    // Demo employees
    return [
      { id: 1, name: 'John Admin', department: 'HR', position: 'HR Manager' },
      { id: 2, name: 'Sarah Johnson', department: 'HR', position: 'HR Specialist' },
      { id: 3, name: 'Mike Wilson', department: 'Engineering', position: 'Developer' },
      { id: 4, name: 'Emily Davis', department: 'Design', position: 'UI/UX Designer' },
      { id: 5, name: 'David Brown', department: 'Engineering', position: 'Senior Developer' },
      { id: 6, name: 'Lisa Chen', department: 'Marketing', position: 'Marketing Manager' },
      { id: 7, name: 'Robert Taylor', department: 'Sales', position: 'Sales Manager' },
      { id: 8, name: 'Jennifer Kim', department: 'Product', position: 'Product Manager' }
    ];
  };

  const availableEmployees = getAvailableEmployees();





  // Filter assets based on user role and permissions
  const getVisibleAssets = () => {
    if (userRole === 'admin') {
      return assets;
    }
    
    // Employees can see:
    // 1. Assets assigned to them
    // 2. Company assets (not assigned to specific employees)
    return assets.filter(asset => 
      asset.location.type === 'company' || 
      asset.location.employeeId === currentUser.id
    );
  };

  // Apply filters and search
  const getFilteredAssets = () => {
    let filtered = getVisibleAssets();

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(asset => asset.category === filterCategory);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(asset => asset.status === filterStatus);
    }

    // Location filter
    if (filterLocation !== 'all') {
      if (filterLocation === 'employee') {
        filtered = filtered.filter(asset => asset.location.type === 'employee');
      } else if (filterLocation === 'company') {
        filtered = filtered.filter(asset => asset.location.type === 'company');
      }
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const filteredAssets = getFilteredAssets();
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      details: '',
      images: [],
      locationType: 'company',
      employeeId: '',
      companyLocation: '',
      additionalNotes: '',
      category: '',
      serialNumber: '',
      purchaseDate: '',
      value: ''
    });
    setFormErrors({});
    setEditingAsset(null);
    setShowAddAsset(false);
  };

  // Handle image upload (mock implementation)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you would upload to a server and get URLs back
      // For demo purposes, we'll use placeholder URLs
      const newImages = Array.from(files).map((file, index) => 
        `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&random=${Date.now()}-${index}`
      );
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
      toast.success(`${files.length} image(s) uploaded successfully`);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Populate form for editing
  const handleEdit = (asset: Asset) => {
    setFormData({
      name: asset.name,
      details: asset.details,
      images: asset.images,
      locationType: asset.location.type,
      employeeId: asset.location.employeeId?.toString() || '',
      companyLocation: asset.location.companyLocation || '',
      additionalNotes: asset.additionalNotes || '',
      category: asset.category,
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate || '',
      value: asset.value?.toString() || ''
    });
    // Clear previous validation errors when opening edit
    setFormErrors({});
    setEditingAsset(asset);
    setShowAddAsset(true);
  };

  // Create or update asset
  const handleSubmit = () => {
    // Aggregate validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Asset name is required';
    if (!formData.details.trim()) errors.details = 'Asset details are required';
    if (!formData.category) errors.category = 'Please select a category';
    if (!formData.serialNumber || !formData.serialNumber.trim()) errors.serialNumber = 'Serial number is required';
    if (!formData.purchaseDate) errors.purchaseDate = 'Purchase date is required';
    if (!formData.value || Number(formData.value) <= 0) errors.value = 'Asset value is required';
    if (formData.locationType === 'employee' && !formData.employeeId) errors.employeeId = 'Please select an employee';
    if (formData.locationType === 'company' && !formData.companyLocation) errors.companyLocation = 'Please select a company location';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Show first error as toast for quick feedback
      toast.error(Object.values(errors)[0]);
      return;
    }

    const now = new Date().toISOString();
    const employeeData = formData.locationType === 'employee'
      ? availableEmployees.find(emp => emp.id.toString() === formData.employeeId)
      : null;

    if (editingAsset) {
      // Update existing asset
      setAssets(prev => prev.map(asset =>
        asset.id === editingAsset.id
          ? {
              ...asset,
              name: formData.name,
              details: formData.details,
              images: formData.images,
              location: {
                type: formData.locationType,
                employeeId: employeeData?.id,
                employeeName: employeeData?.name,
                companyLocation: formData.locationType === 'company' ? formData.companyLocation : undefined
              },
              additionalNotes: formData.additionalNotes,
              category: formData.category,
              serialNumber: formData.serialNumber,
              purchaseDate: formData.purchaseDate,
              value: formData.value ? parseFloat(formData.value) : undefined,
              updatedAt: now
            }
          : asset
      ));
      toast.success('Asset updated successfully');
    } else {
      // Create new asset
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: formData.name,
        details: formData.details,
        images: formData.images,
        location: {
          type: formData.locationType,
          employeeId: employeeData?.id,
          employeeName: employeeData?.name,
          companyLocation: formData.locationType === 'company' ? formData.companyLocation : undefined
        },
        additionalNotes: formData.additionalNotes,
        status: formData.locationType === 'employee' ? 'assigned' : 'available',
        createdAt: now,
        createdBy: {
          id: currentUser.id,
          name: currentUser.name
        },
        category: formData.category,
        serialNumber: formData.serialNumber,
        purchaseDate: formData.purchaseDate,
        value: formData.value ? parseFloat(formData.value) : undefined
      };

      setAssets(prev => [newAsset, ...prev]);
      toast.success('Asset added successfully');
    }

    resetForm();
  };

  // Delete asset
  const handleDelete = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
    toast.success('Asset deleted successfully');
  };

  // Check if user can modify asset
  const canModifyAsset = (asset: Asset) => {
    return userRole === 'admin' || asset.createdBy.id === currentUser.id;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'assigned': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'retired': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(c => c.id === category);
    return categoryObj ? categoryObj.icon : Package;
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  // Calculate statistics
  const getStats = () => {
    const visibleAssets = getVisibleAssets();
    return {
      total: visibleAssets.length,
      available: visibleAssets.filter(a => a.status === 'available').length,
      assigned: visibleAssets.filter(a => a.status === 'assigned').length,
      maintenance: visibleAssets.filter(a => a.status === 'maintenance').length,
      totalValue: visibleAssets.reduce((sum, asset) => sum + (asset.value || 0), 0)
    };
  };

  const stats = getStats();

  const hasValidationErrors = Object.keys(formErrors).length > 0;

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <HardDrive className="w-8 h-8" />
            Asset Management
          </h1>
          <p className="text-gray-600">Track and manage company assets and equipment</p>
        </div>
        
        {(userRole === 'admin' || userRole === 'manager') && (
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => { setFormErrors({}); setShowAddAsset(true); }} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Asset
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Assets</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
                <p className="text-sm text-gray-600">Assigned</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.maintenance}</p>
                <p className="text-sm text-gray-600">Maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalValue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-600">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="employee">With Employee</SelectItem>
                <SelectItem value="company">Company Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Asset Dialog */}
      <Dialog open={showAddAsset} onOpenChange={(open: boolean) => { if (!open) resetForm(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAsset ? 'Edit Asset' : 'Add New Asset'}
            </DialogTitle>
            <DialogDescription>
              {editingAsset 
                ? 'Update asset information and location details.'
                : 'Add a new asset to your inventory with complete details and location.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <Label htmlFor="asset-name">Asset Name *</Label>
                <Input
                  id="asset-name"
                  value={formData.name}
                  onChange={(e) => { setFormData(prev => ({ ...prev, name: e.target.value })); setFormErrors(prev => { const c = { ...prev }; delete c.name; return c; }); }}
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? 'error-name' : undefined}
                  placeholder="e.g., MacBook Pro 16-inch"
                  className="w-full h-10"
                />
                {formErrors.name && (
                  <p id="error-name" className="text-sm text-red-600 mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="asset-details">Asset Details *</Label>
                <Textarea
                  id="asset-details"
                  value={formData.details}
                  onChange={(e) => { setFormData(prev => ({ ...prev, details: e.target.value })); setFormErrors(prev => { const c = { ...prev }; delete c.details; return c; }); }}
                  aria-invalid={!!formErrors.details}
                  aria-describedby={formErrors.details ? 'error-details' : undefined}
                  placeholder="Detailed description of the asset including specifications, model, features, etc."
                  rows={4}
                />
                {formErrors.details && (
                  <p id="error-details" className="text-sm text-red-600 mt-1">{formErrors.details}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value: any) => { setFormData(prev => ({ ...prev, category: value })); setFormErrors(prev => { const c = { ...prev }; delete c.category; return c; }); }}>
                    <SelectTrigger aria-invalid={!!formErrors.category} aria-describedby={formErrors.category ? 'error-category' : undefined}>
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <category.icon className="w-4 h-4" />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.category && (
                    <p id="error-category" className="text-sm text-red-600 mt-1">{formErrors.category}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="serial-number">Serial Number *</Label>
                  <Input
                    id="serial-number"
                    value={formData.serialNumber}
                    onChange={(e) => { setFormData(prev => ({ ...prev, serialNumber: e.target.value })); setFormErrors(prev => { const c = { ...prev }; delete c.serialNumber; return c; }); }}
                    placeholder="Device serial number"
                    aria-invalid={!!formErrors.serialNumber}
                    aria-describedby={formErrors.serialNumber ? 'error-serialNumber' : undefined}
                    className="w-full h-10"
                  />
                  {formErrors.serialNumber && (
                    <p id="error-serialNumber" className="text-sm text-red-600 mt-1">{formErrors.serialNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchase-date">Purchase Date *</Label>
                  <Input
                    id="purchase-date"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => { setFormData(prev => ({ ...prev, purchaseDate: e.target.value })); setFormErrors(prev => { const c = { ...prev }; delete c.purchaseDate; return c; }); }}
                    aria-invalid={!!formErrors.purchaseDate}
                    aria-describedby={formErrors.purchaseDate ? 'error-purchaseDate' : undefined}
                  />
                  {formErrors.purchaseDate && (
                    <p id="error-purchaseDate" className="text-sm text-red-600 mt-1">{formErrors.purchaseDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="asset-value">Asset Value ($) *</Label>
                  <div className="w-80 max-w-full">
                    <Input
                      id="asset-value"
                      type="number"
                      value={formData.value}
                      onChange={(e) => { setFormData(prev => ({ ...prev, value: e.target.value })); setFormErrors(prev => { const c = { ...prev }; delete c.value; return c; }); }}
                      placeholder="0.00"
                      aria-invalid={!!formErrors.value}
                      aria-describedby={formErrors.value ? 'error-value' : undefined}
                      className="w-full h-10"
                    />
                  </div>
                  {formErrors.value && (
                    <p id="error-value" className="text-sm text-red-600 mt-1">{formErrors.value}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Asset Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Asset Images</h3>
              
              <div>
                <Label htmlFor="asset-images">Upload Images</Label>
                <div className="mt-2">
                  <input
                    id="asset-images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    title="Upload asset images"
                    aria-label="Upload asset images"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('asset-images')?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Images
                  </Button>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Asset ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
              
              <div>
                <Label>Asset Location *</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="employee-location"
                      checked={formData.locationType === 'employee'}
                      onChange={() => setFormData(prev => ({ ...prev, locationType: 'employee', companyLocation: '' }))}
                      className="rounded"
                    />
                    <Label htmlFor="employee-location" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      With Employee
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="company-location"
                      checked={formData.locationType === 'company'}
                      onChange={() => setFormData(prev => ({ ...prev, locationType: 'company', employeeId: '' }))}
                      className="rounded"
                    />
                    <Label htmlFor="company-location" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Location
                    </Label>
                  </div>
                </div>
              </div>

              {formData.locationType === 'employee' && (
                <div>
                  <Label>Select Employee *</Label>
                  <Select value={formData.employeeId} onValueChange={(value) => { setFormData(prev => ({ ...prev, employeeId: value })); setFormErrors(prev => { const c = { ...prev }; delete c.employeeId; return c; }); }}>
                        <SelectTrigger aria-invalid={!!formErrors.employeeId} aria-describedby={formErrors.employeeId ? 'error-employeeId' : undefined}>
                          <SelectValue placeholder="Choose an employee..." />
                        </SelectTrigger>
                    <SelectContent>
                      {availableEmployees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{employee.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({employee.department})</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.employeeId && (
                    <p id="error-employeeId" className="text-sm text-red-600 mt-1">{formErrors.employeeId}</p>
                  )}
                </div>
              )}

              {formData.locationType === 'company' && (
                <div>
                  <Label>Company Location *</Label>
                  <Select value={formData.companyLocation} onValueChange={(value) => { setFormData(prev => ({ ...prev, companyLocation: value })); setFormErrors(prev => { const c = { ...prev }; delete c.companyLocation; return c; }); }}>
                      <SelectTrigger aria-invalid={!!formErrors.companyLocation} aria-describedby={formErrors.companyLocation ? 'error-companyLocation' : undefined}>
                        <SelectValue placeholder="Choose a location..." />
                      </SelectTrigger>
                    <SelectContent>
                      {companyLocations.map((location) => (
                        <SelectItem key={location} value={location}>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {location}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                    {formErrors.companyLocation && (
                      <p id="error-companyLocation" className="text-sm text-red-600 mt-1">{formErrors.companyLocation}</p>
                    )}
                </div>
              )}
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="additional-notes">Additional Notes</Label>
              <Textarea
                id="additional-notes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Any additional information about this asset..."
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={hasValidationErrors} className="flex-1 bg-blue-600 hover:bg-blue-700" aria-disabled={hasValidationErrors}>
                <Save className="w-4 h-4 mr-2" />
                {editingAsset ? 'Update Asset' : 'Add Asset'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Asset Details Dialog */}
      <Dialog open={showAssetDetails} onOpenChange={setShowAssetDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {(() => {
                    const IconComponent = getCategoryIcon(selectedAsset.category);
                    return <IconComponent className="w-5 h-5" />;
                  })()}
                  {selectedAsset.name}
                </DialogTitle>
                <DialogDescription>
                  Asset details and current location information
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Images */}
                {selectedAsset.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Images</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedAsset.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedAsset.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Details */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedAsset.details}</p>
                </div>

                {/* Location */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Current Location</h3>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    {selectedAsset.location.type === 'employee' ? (
                      <>
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Assigned to <strong>{selectedAsset.location.employeeName}</strong></span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 text-green-600" />
                        <span>Company Location: <strong>{selectedAsset.location.companyLocation}</strong></span>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Asset Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(selectedAsset.status)}>
                          {selectedAsset.status}
                        </Badge>
                      </div>
                      {selectedAsset.serialNumber && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Serial Number:</span>
                          <span className="font-mono">{selectedAsset.serialNumber}</span>
                        </div>
                      )}
                      {selectedAsset.value && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Value:</span>
                          <span>${selectedAsset.value.toLocaleString()}</span>
                        </div>
                      )}
                      {selectedAsset.purchaseDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Purchase Date:</span>
                          <span>{new Date(selectedAsset.purchaseDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tracking Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span>{formatTimeAgo(selectedAsset.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created By:</span>
                        <span>{selectedAsset.createdBy.name}</span>
                      </div>
                      {selectedAsset.updatedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span>{formatTimeAgo(selectedAsset.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                {selectedAsset.additionalNotes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                    <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">{selectedAsset.additionalNotes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {canModifyAsset(selectedAsset) && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAssetDetails(false);
                        handleEdit(selectedAsset);
                      }}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Asset
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(selectedAsset.id);
                        setShowAssetDetails(false);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Asset
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Assets Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Assets ({filteredAssets.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAssets.map((asset) => {
              const IconComponent = getCategoryIcon(asset.category);
              return (
                <div
                  key={asset.id}
                  className="p-6 border rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer border-gray-200 hover:border-blue-300"
                  onClick={() => {
                    setSelectedAsset(asset);
                    setShowAssetDetails(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                        <p className="text-sm text-gray-600">{asset.category}</p>
                      </div>
                    </div>
                    
                    {canModifyAsset(asset) && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(asset);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Asset Images */}
                  {asset.images.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={asset.images[0]}
                        alt={asset.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {asset.images.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">+{asset.images.length - 1} more image(s)</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-700 line-clamp-2">{asset.details}</p>
                    
                    <div className="flex items-center gap-2 text-sm">
                      {asset.location.type === 'employee' ? (
                        <>
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-blue-600">{asset.location.employeeName}</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-4 h-4 text-green-600" />
                          <span className="text-green-600">{asset.location.companyLocation}</span>
                        </>
                      )}
                    </div>

                    {asset.value && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-medium">${asset.value.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{formatTimeAgo(asset.createdAt)}</div>
                      <div className="text-xs text-gray-400">by {asset.createdBy.name}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {paginatedAssets.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterCategory !== 'all' || filterStatus !== 'all' || filterLocation !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No assets have been added yet'
                }
              </p>
              {(userRole === 'admin' || userRole === 'manager') && (
                <Button onClick={() => { setFormErrors({}); setShowAddAsset(true); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Asset
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAssets.length)} of {filteredAssets.length} assets
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
    </div>
  );
}
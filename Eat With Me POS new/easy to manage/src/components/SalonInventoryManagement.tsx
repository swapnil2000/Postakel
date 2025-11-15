import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Archive,
  RefreshCw,
  Truck,
  ClipboardList,
  Zap
} from 'lucide-react';

export function SalonInventoryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('inventory');

  const categories = [
    { id: 'all', name: 'All Items', count: 45 },
    { id: 'hair-care', name: 'Hair Care', count: 12 },
    { id: 'skin-care', name: 'Skin Care', count: 8 },
    { id: 'body-care', name: 'Body Care', count: 6 },
    { id: 'tools', name: 'Tools & Equipment', count: 10 },
    { id: 'consumables', name: 'Consumables', count: 9 }
  ];

  const inventoryItems = [
    {
      id: 1,
      name: 'Organic Shampoo 500ml',
      category: 'hair-care',
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unit: 'bottles',
      costPrice: 320,
      sellingPrice: 850,
      supplier: 'Beauty Supply Co.',
      expiryDate: '2025-06-15',
      batchNumber: 'BSC2024001',
      lastUpdated: '2024-01-15',
      usagePerService: 0.1,
      servicesLinked: ['Hair Wash', 'Hair Treatment'],
      status: 'in-stock'
    },
    {
      id: 2,
      name: 'Face Cream Premium',
      category: 'skin-care',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: 'tubes',
      costPrice: 480,
      sellingPrice: 1200,
      supplier: 'Glow Cosmetics',
      expiryDate: '2024-12-30',
      batchNumber: 'GC2024005',
      lastUpdated: '2024-01-10',
      usagePerService: 0.05,
      servicesLinked: ['Facial Premium', 'Anti-Aging Treatment'],
      status: 'low-stock'
    },
    {
      id: 3,
      name: 'Massage Oil Lavender',
      category: 'body-care',
      currentStock: 35,
      minStock: 20,
      maxStock: 80,
      unit: 'bottles',
      costPrice: 280,
      sellingPrice: 650,
      supplier: 'Aromatherapy Essentials',
      expiryDate: '2025-03-20',
      batchNumber: 'AE2024012',
      lastUpdated: '2024-01-12',
      usagePerService: 0.2,
      servicesLinked: ['Body Massage', 'Aromatherapy'],
      status: 'in-stock'
    },
    {
      id: 4,
      name: 'Hair Dryer Professional',
      category: 'tools',
      currentStock: 5,
      minStock: 3,
      maxStock: 10,
      unit: 'pieces',
      costPrice: 2800,
      sellingPrice: 0,
      supplier: 'Salon Equipment Ltd.',
      expiryDate: null,
      batchNumber: 'SEL2024003',
      lastUpdated: '2024-01-08',
      usagePerService: null,
      servicesLinked: ['Hair Cut', 'Hair Style'],
      status: 'in-stock'
    },
    {
      id: 5,
      name: 'Disposable Towels',
      category: 'consumables',
      currentStock: 2,
      minStock: 50,
      maxStock: 500,
      unit: 'packs',
      costPrice: 45,
      sellingPrice: 0,
      supplier: 'Hygiene Solutions',
      expiryDate: null,
      batchNumber: 'HS2024008',
      lastUpdated: '2024-01-14',
      usagePerService: 2,
      servicesLinked: ['All Services'],
      status: 'critical'
    }
  ];

  const suppliers = [
    {
      id: 1,
      name: 'Beauty Supply Co.',
      contact: '+91 98765 43210',
      email: 'orders@beautysupply.com',
      address: 'Mumbai, Maharashtra',
      rating: 4.8,
      itemsSupplied: 12,
      lastOrderDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Glow Cosmetics',
      contact: '+91 98765 43211',
      email: 'sales@glowcosmetics.com',
      address: 'Delhi, NCR',
      rating: 4.6,
      itemsSupplied: 8,
      lastOrderDate: '2024-01-05'
    },
    {
      id: 3,
      name: 'Salon Equipment Ltd.',
      contact: '+91 98765 43212',
      email: 'support@salonequip.com',
      address: 'Bangalore, Karnataka',
      rating: 4.9,
      itemsSupplied: 15,
      lastOrderDate: '2023-12-28'
    }
  ];

  const usageLogs = [
    {
      id: 1,
      itemName: 'Organic Shampoo 500ml',
      service: 'Hair Wash & Cut',
      customer: 'Priya Sharma',
      quantityUsed: 0.1,
      unit: 'bottles',
      date: '2024-01-15',
      staff: 'Maya Patel',
      cost: 32
    },
    {
      id: 2,
      itemName: 'Face Cream Premium',
      service: 'Facial Premium',
      customer: 'Ananya Gupta',
      quantityUsed: 0.05,
      unit: 'tubes',
      date: '2024-01-15',
      staff: 'Riya Singh',
      cost: 24
    },
    {
      id: 3,
      itemName: 'Massage Oil Lavender',
      service: 'Body Massage',
      customer: 'Kavya Reddy',
      quantityUsed: 0.2,
      unit: 'bottles',
      date: '2024-01-14',
      staff: 'Deepa Kumar',
      cost: 56
    }
  ];

  const getStockStatus = (item: any) => {
    if (item.currentStock <= 0) return { status: 'out-of-stock', color: 'bg-red-500', textColor: 'text-red-700' };
    if (item.currentStock <= item.minStock * 0.5) return { status: 'critical', color: 'bg-red-400', textColor: 'text-red-700' };
    if (item.currentStock <= item.minStock) return { status: 'low-stock', color: 'bg-yellow-400', textColor: 'text-yellow-700' };
    return { status: 'in-stock', color: 'bg-green-400', textColor: 'text-green-700' };
  };

  const getStockPercentage = (item: any) => {
    return (item.currentStock / item.maxStock) * 100;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
  const expiringItems = inventoryItems.filter(item => {
    if (!item.expiryDate) return false;
    const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
    return daysUntilExpiry !== null && daysUntilExpiry <= 30;
  });

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Inventory Management
        </h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Truck className="w-4 h-4 mr-2" />
            Purchase Order
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600">Low Stock Alert</p>
                <p className="text-2xl font-bold text-red-700">{lowStockItems.length}</p>
                <p className="text-xs text-red-600">Items need reordering</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-700">{expiringItems.length}</p>
                <p className="text-xs text-orange-600">Items expire in 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total Value</p>
                <p className="text-2xl font-bold text-blue-700">
                  ₹{inventoryItems.reduce((total, item) => total + (item.currentStock * item.costPrice), 0).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600">Current inventory value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="usage">Usage Logs</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inventory items..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Items */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const stockInfo = getStockStatus(item);
              const stockPercentage = getStockPercentage(item);
              const daysUntilExpiry = item.expiryDate ? getDaysUntilExpiry(item.expiryDate) : null;
              
              return (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {categories.find(c => c.id === item.category)?.name}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stock Level</span>
                        <Badge className={stockInfo.textColor} variant="secondary">
                          {stockInfo.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <Progress value={stockPercentage} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{item.currentStock} {item.unit}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cost Price</p>
                        <p className="font-medium">₹{item.costPrice}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Selling Price</p>
                        <p className="font-medium">
                          {item.sellingPrice > 0 ? `₹${item.sellingPrice}` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Supplier</p>
                      <p className="text-sm text-muted-foreground">{item.supplier}</p>
                    </div>

                    {item.expiryDate && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Expiry</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                          {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
                            <Badge variant="destructive" className="text-xs">
                              {daysUntilExpiry}d left
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {item.servicesLinked && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Used In</p>
                        <div className="flex flex-wrap gap-1">
                          {item.servicesLinked.slice(0, 2).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {item.servicesLinked.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.servicesLinked.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Usage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Usage Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usageLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-accent/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{log.itemName}</p>
                        <p className="text-sm text-muted-foreground">
                          {log.service} - {log.customer}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{log.staff}</Badge>
                          <span className="text-xs text-muted-foreground">{log.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{log.quantityUsed} {log.unit}</p>
                      <p className="text-sm text-muted-foreground">₹{log.cost}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map((supplier) => (
              <Card key={supplier.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map((star) => (
                          <div
                            key={star}
                            className={`w-3 h-3 ${
                              star <= supplier.rating 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          >
                            ⭐
                          </div>
                        ))}
                        <span className="text-sm text-muted-foreground ml-1">
                          {supplier.rating}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="text-sm">{supplier.contact}</p>
                    <p className="text-sm">{supplier.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="text-sm">{supplier.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Items Supplied</p>
                      <p className="font-medium">{supplier.itemsSupplied}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Order</p>
                      <p className="font-medium">{supplier.lastOrderDate}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Items Added</span>
                    <span className="font-medium text-green-600">+45 this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Items Consumed</span>
                    <span className="font-medium text-red-600">-38 this month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wastage/Expired</span>
                    <span className="font-medium text-orange-600">-3 this month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Inventory Value</span>
                    <span className="font-medium">₹85,420</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monthly Consumption</span>
                    <span className="font-medium">₹12,380</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Avg. Cost per Service</span>
                    <span className="font-medium">₹95</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
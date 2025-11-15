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
  Scan,
  Tag,
  Archive,
  Clock,
  IndianRupee
} from 'lucide-react';

export function RetailInventoryManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('products');

  const categories = [
    { id: 'all', name: 'All Items', count: 156 },
    { id: 'grocery', name: 'Grocery', count: 45 },
    { id: 'dairy', name: 'Dairy', count: 12 },
    { id: 'bakery', name: 'Bakery', count: 18 },
    { id: 'snacks', name: 'Snacks', count: 25 },
    { id: 'beverages', name: 'Beverages', count: 32 },
    { id: 'personal-care', name: 'Personal Care', count: 24 }
  ];

  const products = [
    {
      id: 1,
      name: 'Basmati Rice 1kg',
      category: 'grocery',
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      unit: 'kg',
      costPrice: 90,
      sellingPrice: 125,
      gst: 5,
      barcode: '8901030801234',
      supplier: 'Grain Wholesalers',
      expiryDate: '2025-06-15',
      batchNumber: 'GW2024001',
      lastUpdated: '2024-01-15',
      status: 'in-stock',
      image: '🍚'
    },
    {
      id: 2,
      name: 'Milk Full Cream 1L',
      category: 'dairy',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      unit: 'litre',
      costPrice: 55,
      sellingPrice: 65,
      gst: 0,
      barcode: '8901030812345',
      supplier: 'Dairy Fresh',
      expiryDate: '2024-01-20',
      batchNumber: 'DF2024005',
      lastUpdated: '2024-01-10',
      status: 'low-stock',
      image: '🥛'
    },
    {
      id: 3,
      name: 'Bread White',
      category: 'bakery',
      currentStock: 3,
      minStock: 15,
      maxStock: 30,
      unit: 'piece',
      costPrice: 18,
      sellingPrice: 25,
      gst: 5,
      barcode: '8901030823456',
      supplier: 'City Bakery',
      expiryDate: '2024-01-17',
      batchNumber: 'CB2024012',
      lastUpdated: '2024-01-15',
      status: 'critical',
      image: '🍞'
    },
    {
      id: 4,
      name: 'Tea Powder 250g',
      category: 'beverages',
      currentStock: 35,
      minStock: 20,
      maxStock: 80,
      unit: 'packet',
      costPrice: 95,
      sellingPrice: 125,
      gst: 5,
      barcode: '8901030845678',
      supplier: 'Tea Gardens Ltd',
      expiryDate: '2025-03-20',
      batchNumber: 'TG2024008',
      lastUpdated: '2024-01-12',
      status: 'in-stock',
      image: '🍵'
    },
    {
      id: 5,
      name: 'Biscuits Pack',
      category: 'snacks',
      currentStock: 15,
      minStock: 25,
      maxStock: 60,
      unit: 'packet',
      costPrice: 65,
      sellingPrice: 80,
      gst: 12,
      barcode: '8901030856789',
      supplier: 'Snack Foods Inc',
      expiryDate: '2024-08-15',
      batchNumber: 'SF2024003',
      lastUpdated: '2024-01-14',
      status: 'low-stock',
      image: '🍪'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'sale',
      product: 'Basmati Rice 1kg',
      quantity: 2,
      amount: 250,
      time: '10 min ago',
      customer: 'Rajesh Kumar'
    },
    {
      id: 2,
      type: 'restock',
      product: 'Milk Full Cream 1L',
      quantity: 20,
      amount: 1100,
      time: '2 hours ago',
      supplier: 'Dairy Fresh'
    },
    {
      id: 3,
      type: 'sale',
      product: 'Tea Powder 250g',
      quantity: 1,
      amount: 125,
      time: '45 min ago',
      customer: 'Priya Sharma'
    }
  ];

  const getStockStatus = (item: any) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (item.currentStock <= 0) return { status: 'out-of-stock', color: 'bg-red-500', textColor: 'text-red-700', percentage: 0 };
    if (item.currentStock <= item.minStock * 0.5) return { status: 'critical', color: 'bg-red-400', textColor: 'text-red-700', percentage };
    if (item.currentStock <= item.minStock) return { status: 'low-stock', color: 'bg-yellow-400', textColor: 'text-yellow-700', percentage };
    return { status: 'in-stock', color: 'bg-green-400', textColor: 'text-green-700', percentage };
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = products.filter(item => item.currentStock <= item.minStock);
  const criticalItems = products.filter(item => item.currentStock <= item.minStock * 0.5);
  const totalValue = products.reduce((sum, item) => sum + (item.currentStock * item.costPrice), 0);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="w-6 h-6 text-primary" />
          Stock Management
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="tap-zone">
            <Scan className="w-4 h-4 mr-2" />
            Scan Product
          </Button>
          <Button className="bg-primary hover:bg-primary/90 tap-zone">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-error-gradient card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center tap-zone">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-red-600">Critical Stock</p>
                <p className="text-2xl font-bold text-red-700">{criticalItems.length}</p>
                <p className="text-xs text-red-600">Immediate action needed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-warning-gradient card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center tap-zone">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-yellow-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-700">{lowStockItems.length}</p>
                <p className="text-xs text-yellow-600">Need reordering</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center tap-zone">
                <IndianRupee className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Stock Value</p>
                <p className="text-2xl font-bold text-blue-700">₹{(totalValue / 1000).toFixed(0)}k</p>
                <p className="text-xs text-blue-600">Total inventory</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-success-gradient card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center tap-zone">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Total Items</p>
                <p className="text-2xl font-bold text-green-700">{products.length}</p>
                <p className="text-xs text-green-600">In catalog</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="products" className="tap-zone">Products</TabsTrigger>
          <TabsTrigger value="alerts" className="tap-zone">Alerts</TabsTrigger>
          <TabsTrigger value="activity" className="tap-zone">Activity</TabsTrigger>
          <TabsTrigger value="reports" className="tap-zone">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search products or scan barcode..."
                    className="pl-12 h-14 tap-zone text-lg"
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
                      className="tap-zone"
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="tap-zone">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Product Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const stockInfo = getStockStatus(product);
              const daysUntilExpiry = product.expiryDate ? getDaysUntilExpiry(product.expiryDate) : null;
              
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow card-hover">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{product.image}</div>
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {categories.find(c => c.id === product.category)?.name}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="tap-zone">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive tap-zone">
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
                      <Progress value={stockInfo.percentage} className="h-2 progress-bar" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{product.currentStock} {product.unit}</span>
                        <span>Min: {product.minStock}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cost Price</p>
                        <p className="font-medium">₹{product.costPrice}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Selling Price</p>
                        <p className="font-medium">₹{product.sellingPrice}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Barcode</p>
                      <p className="text-sm text-muted-foreground font-mono">{product.barcode}</p>
                    </div>

                    {product.expiryDate && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Expiry</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">
                            {new Date(product.expiryDate).toLocaleDateString()}
                          </p>
                          {daysUntilExpiry !== null && daysUntilExpiry <= 30 && (
                            <Badge variant="destructive" className="text-xs">
                              {daysUntilExpiry}d left
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1 tap-zone">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Stock
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 tap-zone">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Critical Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {criticalItems.map((item) => (
                    <div key={item.id} className="p-4 bg-error-gradient rounded-xl border border-red-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.image}</div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-red-600">Only {item.currentStock} {item.unit} left</p>
                          </div>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 tap-zone">
                          Reorder Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-yellow-600">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.filter(item => !criticalItems.includes(item)).map((item) => (
                    <div key={item.id} className="p-4 bg-warning-gradient rounded-xl border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{item.image}</div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-yellow-600">{item.currentStock} {item.unit} remaining</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-700 tap-zone">
                          Add Stock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        activity.type === 'sale' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {activity.type === 'sale' ? (
                          <TrendingDown className="w-6 h-6 text-red-600" />
                        ) : (
                          <TrendingUp className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.product}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.type === 'sale' ? 'Sold to' : 'Restocked from'} {
                            activity.type === 'sale' ? activity.customer : activity.supplier
                          }
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {activity.type === 'sale' ? 'Sale' : 'Restock'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{activity.quantity} units</p>
                      <p className={`text-sm ${
                        activity.type === 'sale' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {activity.type === 'sale' ? '-' : '+'}₹{activity.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Products</span>
                    <span className="font-medium">{products.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>In Stock</span>
                    <span className="font-medium text-green-600">
                      {products.filter(p => p.currentStock > p.minStock).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Low Stock</span>
                    <span className="font-medium text-yellow-600">{lowStockItems.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Out of Stock</span>
                    <span className="font-medium text-red-600">
                      {products.filter(p => p.currentStock === 0).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Value Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Stock Value</span>
                    <span className="font-medium">₹{totalValue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Item Value</span>
                    <span className="font-medium">₹{Math.round(totalValue / products.length)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Highest Value Item</span>
                    <span className="font-medium">
                      ₹{Math.max(...products.map(p => p.currentStock * p.costPrice))}
                    </span>
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
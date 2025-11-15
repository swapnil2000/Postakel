import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  TrendingDown,
  Calendar,
  Scale,
  Receipt,
  ChefHat
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  costPerUnit: number;
  supplier: string;
  expiryDate?: string;
  lastPurchase: string;
  usedThisMonth: number;
}

interface Recipe {
  id: string;
  menuItem: string;
  ingredients: {
    itemId: string;
    quantity: number;
    unit: string;
  }[];
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Basmati Rice',
      category: 'Grains',
      unit: 'kg',
      currentStock: 25,
      minStock: 10,
      maxStock: 100,
      costPerUnit: 120,
      supplier: 'Grain Suppliers Co.',
      expiryDate: '2024-06-15',
      lastPurchase: '2024-01-10',
      usedThisMonth: 45
    },
    {
      id: '2',
      name: 'Chicken',
      category: 'Meat',
      unit: 'kg',
      currentStock: 8,
      minStock: 15,
      maxStock: 50,
      costPerUnit: 280,
      supplier: 'Fresh Meat Market',
      expiryDate: '2024-01-20',
      lastPurchase: '2024-01-15',
      usedThisMonth: 32
    },
    {
      id: '3',
      name: 'Onions',
      category: 'Vegetables',
      unit: 'kg',
      currentStock: 12,
      minStock: 5,
      maxStock: 30,
      costPerUnit: 40,
      supplier: 'Vegetable Vendor',
      expiryDate: '2024-01-25',
      lastPurchase: '2024-01-12',
      usedThisMonth: 18
    },
    {
      id: '4',
      name: 'Tomatoes',
      category: 'Vegetables',
      unit: 'kg',
      currentStock: 3,
      minStock: 8,
      maxStock: 25,
      costPerUnit: 60,
      supplier: 'Vegetable Vendor',
      expiryDate: '2024-01-22',
      lastPurchase: '2024-01-14',
      usedThisMonth: 22
    },
    {
      id: '5',
      name: 'Ghee',
      category: 'Dairy',
      unit: 'liter',
      currentStock: 5,
      minStock: 2,
      maxStock: 20,
      costPerUnit: 450,
      supplier: 'Dairy Products Ltd.',
      expiryDate: '2024-03-10',
      lastPurchase: '2024-01-08',
      usedThisMonth: 8
    }
  ]);

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      menuItem: 'Chicken Biryani',
      ingredients: [
        { itemId: '1', quantity: 0.3, unit: 'kg' },
        { itemId: '2', quantity: 0.25, unit: 'kg' },
        { itemId: '3', quantity: 0.1, unit: 'kg' },
        { itemId: '5', quantity: 0.05, unit: 'liter' }
      ]
    },
    {
      id: '2',
      menuItem: 'Butter Chicken',
      ingredients: [
        { itemId: '2', quantity: 0.2, unit: 'kg' },
        { itemId: '4', quantity: 0.15, unit: 'kg' },
        { itemId: '3', quantity: 0.08, unit: 'kg' }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (item.currentStock <= item.minStock) return { status: 'critical', color: 'bg-red-500', text: 'Critical' };
    if (percentage < 30) return { status: 'low', color: 'bg-yellow-500', text: 'Low' };
    if (percentage < 70) return { status: 'medium', color: 'bg-blue-500', text: 'Medium' };
    return { status: 'good', color: 'bg-green-500', text: 'Good' };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7;
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(inventory.map(item => item.category))];

  const stats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.currentStock <= item.minStock).length,
    expiringSoon: inventory.filter(item => item.expiryDate && isExpiringSoon(item.expiryDate)).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Inventory Management</h1>
          <p className="text-muted-foreground">Track raw materials and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Receipt className="w-4 h-4 mr-2" />
                Purchase Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Purchase Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Enter supplier name" />
                </div>
                <div>
                  <Label htmlFor="invoice">Invoice Number</Label>
                  <Input id="invoice" placeholder="Enter invoice number" />
                </div>
                <div>
                  <Label htmlFor="date">Purchase Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Items</Label>
                  <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                    <div>Item</div>
                    <div>Quantity</div>
                    <div>Unit Price</div>
                    <div>Total</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Qty" />
                    <Input placeholder="Price" />
                    <Input placeholder="Total" readOnly />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Save Purchase</Button>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" placeholder="Enter item name" />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="spices">Spices</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input id="unit" placeholder="kg, liter, etc." />
                  </div>
                  <div>
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input id="minStock" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="maxStock">Max Stock</Label>
                    <Input id="maxStock" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cost">Cost per Unit</Label>
                    <Input id="cost" type="number" placeholder="₹0" />
                  </div>
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input id="supplier" placeholder="Supplier name" />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">Add Item</Button>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalItems}</div>
          <div className="text-sm text-muted-foreground">Total Items</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
          <div className="text-sm text-muted-foreground">Low Stock</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.expiringSoon}</div>
          <div className="text-sm text-muted-foreground">Expiring Soon</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">₹{stats.totalValue.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search inventory items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
          <TabsTrigger value="wastage">Wastage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="space-y-4">
            {filteredInventory.map((item) => {
              const stockStatus = getStockStatus(item);
              const stockPercentage = (item.currentStock / item.maxStock) * 100;
              
              return (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{item.category}</span>
                          <span>{item.supplier}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-lg font-bold">{item.currentStock}</div>
                        <div className="text-xs text-muted-foreground">{item.unit}</div>
                      </div>
                      
                      <div className="w-24">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${stockStatus.color} text-white`}>
                            {stockStatus.text}
                          </Badge>
                          {item.expiryDate && isExpiringSoon(item.expiryDate) && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <Progress value={stockPercentage} className="h-2" />
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">₹{item.costPerUnit}</div>
                        <div className="text-sm text-muted-foreground">per {item.unit}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit {item.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="currentStock">Current Stock</Label>
                                  <Input id="currentStock" type="number" defaultValue={item.currentStock} />
                                </div>
                                <div>
                                  <Label htmlFor="minStock">Min Stock</Label>
                                  <Input id="minStock" type="number" defaultValue={item.minStock} />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="costPerUnit">Cost per Unit</Label>
                                  <Input id="costPerUnit" type="number" defaultValue={item.costPerUnit} />
                                </div>
                                <div>
                                  <Label htmlFor="expiryDate">Expiry Date</Label>
                                  <Input id="expiryDate" type="date" defaultValue={item.expiryDate} />
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4">
                                <Button className="flex-1">Update</Button>
                                <Button variant="outline" className="flex-1">Cancel</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="recipes" className="space-y-4">
          <div className="space-y-4">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{recipe.menuItem}</h3>
                      <div className="text-sm text-muted-foreground">
                        {recipe.ingredients.length} ingredients
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">Cost per serving</div>
                      <div className="text-sm text-muted-foreground">₹{
                        recipe.ingredients.reduce((cost, ing) => {
                          const item = inventory.find(i => i.id === ing.itemId);
                          return cost + (item ? item.costPerUnit * ing.quantity : 0);
                        }, 0).toFixed(2)
                      }</div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Recipe
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Ingredients:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recipe.ingredients.map((ingredient, index) => {
                      const item = inventory.find(i => i.id === ingredient.itemId);
                      return (
                        <div key={index} className="flex justify-between items-center bg-accent/50 p-2 rounded">
                          <span className="text-sm">{item?.name || 'Unknown'}</span>
                          <span className="text-sm font-medium">{ingredient.quantity} {ingredient.unit}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="wastage" className="space-y-4">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Wastage Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="wasteItem">Item</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map(item => (
                          <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="wasteQuantity">Quantity</Label>
                    <Input id="wasteQuantity" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="wasteReason">Reason</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                        <SelectItem value="overcooked">Overcooked</SelectItem>
                        <SelectItem value="customer-return">Customer Return</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full sm:w-auto">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Record Wastage
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
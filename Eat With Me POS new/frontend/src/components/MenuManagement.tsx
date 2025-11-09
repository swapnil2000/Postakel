import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  IndianRupee,
  Save,
  Bot,
  Star,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Textarea } from './ui/textarea';
import { MenuAI } from './MenuAI';
import { MenuItem } from '../contexts/AppContext';

export function MenuManagement() {
  const { hasPermission } = useAuth();
  const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem, categoriesAndRoles } = useAppContext();
  const [activeTab, setActiveTab] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItemForm, setNewItemForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    isVeg: false,
    spiceLevel: 'mild' as 'mild' | 'medium' | 'hot',
    available: true,
    cookingTime: '',
    imageUrl: '',
    tags: '',
    allergens: '',
    taxCategory: 'food',
  });
  const [editItemForm, setEditItemForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    isVeg: false,
    spiceLevel: 'mild' as 'mild' | 'medium' | 'hot',
    available: true,
    cookingTime: '',
    imageUrl: '',
    tags: '',
    allergens: '',
    taxCategory: 'food',
  });

  const categories = categoriesAndRoles?.categories || [];

  const filteredMenuItems = menuItems
    .filter(item => activeTab === 'all' || item.category === categories.find(c => c.id === activeTab)?.name)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddItem = () => {
    if (!newItemForm.name || !newItemForm.price || !newItemForm.category) {
      alert('Please fill in all required fields.');
      return;
    }
    const newMenuItem: MenuItem = {
      id: `menu_${Date.now()}`,
      name: newItemForm.name,
      price: parseFloat(newItemForm.price),
      category: newItemForm.category,
      available: newItemForm.available,
      description: newItemForm.description,
      isVeg: newItemForm.isVeg,
      spiceLevel: newItemForm.spiceLevel,
      cookingTime: parseInt(newItemForm.cookingTime, 10) || 0,
      isPopular: false,
      allergens: newItemForm.allergens.split(',').map(tag => tag.trim()),
      taxCategory: newItemForm.taxCategory,
    };
    addMenuItem(newMenuItem);
    setShowAddDialog(false);
    setNewItemForm({
        name: '',
        price: '',
        description: '',
        category: '',
        isVeg: false,
        spiceLevel: 'mild',
        available: true,
        cookingTime: '',
        imageUrl: '',
        tags: '',
        allergens: '',
        taxCategory: 'food',
    });
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setEditItemForm({
      name: item.name,
      price: item.price.toString(),
      description: item.description || '',
      category: item.category,
      isVeg: item.isVeg,
      spiceLevel: item.spiceLevel,
      available: item.available,
      cookingTime: item.cookingTime.toString(),
      imageUrl: '', // This field is not on MenuItem, so reset
      tags: '', // This field is not on MenuItem, so reset
      allergens: (item.allergens || []).join(', '),
      taxCategory: item.taxCategory,
    });
    setShowEditDialog(true);
  };

  const handleUpdateItem = () => {
    if (!selectedItem || !editItemForm.name || !editItemForm.price || !editItemForm.category) {
      alert('Please fill in all required fields.');
      return;
    }
    const updatedItem: Partial<MenuItem> = {
      name: editItemForm.name,
      price: parseFloat(editItemForm.price),
      category: editItemForm.category,
      available: editItemForm.available,
      description: editItemForm.description,
      isVeg: editItemForm.isVeg,
      spiceLevel: editItemForm.spiceLevel,
      cookingTime: parseInt(editItemForm.cookingTime, 10) || 0,
      allergens: editItemForm.allergens.split(',').map(tag => tag.trim()),
      taxCategory: editItemForm.taxCategory,
    };
    updateMenuItem(selectedItem.id, updatedItem);
    setShowEditDialog(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      deleteMenuItem(itemId);
      setShowEditDialog(false);
      setSelectedItem(null);
    }
  };

  const toggleAvailability = (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
      updateMenuItem(itemId, { ...item, available: !item.available });
    }
  };

  if (!hasPermission('menu_management')) {
    return <div className="p-4">You do not have permission to manage the menu.</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2" size={18} />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Input placeholder="Name" value={newItemForm.name} onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })} />
              <Input placeholder="Price" type="number" value={newItemForm.price} onChange={(e) => setNewItemForm({ ...newItemForm, price: e.target.value })} />
              <Textarea placeholder="Description" value={newItemForm.description} onChange={(e) => setNewItemForm({ ...newItemForm, description: e.target.value })} className="col-span-2" />
              <Select onValueChange={(value: string) => setNewItemForm({ ...newItemForm, category: value })} value={newItemForm.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Cooking Time (mins)" type="number" value={newItemForm.cookingTime} onChange={(e) => setNewItemForm({ ...newItemForm, cookingTime: e.target.value })} />
              <Input placeholder="Allergens (comma-separated)" value={newItemForm.allergens} onChange={(e) => setNewItemForm({ ...newItemForm, allergens: e.target.value })} className="col-span-2" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90">
                <Save className="mr-2" size={16} />
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs and Search */}
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((cat: any) => (
              <TabsTrigger key={cat.id} value={cat.id}>{cat.name}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search menu items..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Menu Items List */}
      <div className="grid gap-4">
        {filteredMenuItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-primary">{item.name}</h4>
                      <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                        {item.available ? 'Available' : 'Out of Stock'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      {item.isPopular && (
                        <Badge className="text-xs bg-yellow-100 text-yellow-800">
                          <Star size={10} className="mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2 text-sm">
                      <div className="flex items-center gap-1">
                        <IndianRupee size={14} />
                        <span className="font-semibold text-primary">₹{item.price}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {item.isVeg ? (
                          <div className="w-4 h-4 border-2 border-green-600 flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-4 h-4 border-2 border-red-600 flex items-center justify-center">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {item.isVeg ? 'Veg' : 'Non-veg'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <span className="text-xs">
                          {item.spiceLevel === 'mild' && '🌶️'}
                          {item.spiceLevel === 'medium' && '🌶️🌶️'}
                          {item.spiceLevel === 'hot' && '🌶️🌶️🌶️'}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {item.spiceLevel}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {item.cookingTime} min
                        </span>
                      </div>
                      
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {item.rating}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={12} className="text-orange-500" />
                        <div className="flex gap-1">
                          {item.allergens.map((allergen: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={item.available}
                      onCheckedChange={() => toggleAvailability(item.id)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-8 h-8 p-0"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-8 h-8 p-0"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMenuItems.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p>No menu items found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Menu Insights Section */}
      <div className="mt-8">
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="management">Menu Management</TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="management" className="mt-6">
            <div className="text-center text-muted-foreground py-8">
              <p>Menu management tools are above. Switch to AI Insights for smart recommendations.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-insights" className="mt-6">
            <MenuAI />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <Input placeholder="Name" value={editItemForm.name} onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })} />
              <Input placeholder="Price" type="number" value={editItemForm.price} onChange={(e) => setEditItemForm({ ...editItemForm, price: e.target.value })} />
              <Textarea placeholder="Description" value={editItemForm.description} onChange={(e) => setEditItemForm({ ...editItemForm, description: e.target.value })} className="col-span-2" />
              <Select onValueChange={(value: string) => setEditItemForm({ ...editItemForm, category: value })} value={editItemForm.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Cooking Time (mins)" type="number" value={editItemForm.cookingTime} onChange={(e) => setEditItemForm({ ...editItemForm, cookingTime: e.target.value })} />
              <Input placeholder="Allergens (comma-separated)" value={editItemForm.allergens} onChange={(e) => setEditItemForm({ ...editItemForm, allergens: e.target.value })} className="col-span-2" />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button onClick={handleUpdateItem} className="bg-primary hover:bg-primary/90">
                <Save className="mr-2" size={16} />
                Update Item
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
      </Dialog>
    </div>
  );
}
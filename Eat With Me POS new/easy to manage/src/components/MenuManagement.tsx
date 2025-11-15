import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  IndianRupee,
  Save,
  X
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  available: boolean;
  description?: string;
}

export function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: 'Paneer Tikka', price: 180, category: 'Starters', available: true, description: 'Grilled cottage cheese with spices' },
    { id: '2', name: 'Chicken Tikka', price: 220, category: 'Starters', available: true, description: 'Tender chicken marinated in yogurt and spices' },
    { id: '3', name: 'Veg Spring Roll', price: 120, category: 'Starters', available: false, description: 'Crispy rolls with fresh vegetables' },
    { id: '4', name: 'Dal Makhani', price: 160, category: 'Main Course', available: true, description: 'Rich and creamy black lentils' },
    { id: '5', name: 'Butter Chicken', price: 280, category: 'Main Course', available: true, description: 'Chicken in tomato-based curry' },
    { id: '6', name: 'Biryani', price: 250, category: 'Main Course', available: true, description: 'Aromatic basmati rice with spices' },
    { id: '7', name: 'Gulab Jamun', price: 80, category: 'Desserts', available: true, description: 'Sweet milk balls in sugar syrup' },
    { id: '8', name: 'Masala Chai', price: 30, category: 'Beverages', available: true, description: 'Traditional Indian spiced tea' }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    available: true
  });

  const categories = ['all', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Chinese'];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id: string) => {
    setMenuItems(items => 
      items.map(item => 
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setMenuItems(items => items.filter(item => item.id !== id));
  };

  const addNewItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      const item: MenuItem = {
        id: Date.now().toString(),
        name: newItem.name,
        price: parseFloat(newItem.price),
        category: newItem.category,
        description: newItem.description,
        available: newItem.available
      };
      setMenuItems([...menuItems, item]);
      setNewItem({ name: '', price: '', category: '', description: '', available: true });
      setIsAddDialogOpen(false);
    }
  };

  const saveEditedItem = () => {
    if (editingItem) {
      setMenuItems(items => 
        items.map(item => item.id === editingItem.id ? editingItem : item)
      );
      setEditingItem(null);
    }
  };

  return (
    <div className="flex-1 bg-background p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-primary">Menu Management</h1>
          <p className="text-muted-foreground">Manage your restaurant menu items</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2" size={18} />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription>
                Fill in the details for the new menu item
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="Enter item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Input
                  placeholder="Enter item description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newItem.available}
                  onCheckedChange={(checked) => setNewItem({...newItem, available: checked})}
                />
                <Label>Available</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={addNewItem} className="flex-1 bg-primary hover:bg-primary/90">
                  <Save className="mr-2" size={16} />
                  Add Item
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search menu items..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items List */}
      <div className="grid gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-4">
              {editingItem?.id === item.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                          type="number"
                          className="pl-10"
                          value={editingItem.price}
                          onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={saveEditedItem} className="bg-primary hover:bg-primary/90">
                      <Save className="mr-2" size={16} />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingItem(null)}>
                      <X className="mr-2" size={16} />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-primary">{item.name}</h4>
                      <Badge variant={item.available ? "default" : "secondary"} className="text-xs">
                        {item.available ? 'Available' : 'Out of Stock'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <IndianRupee size={14} />
                        <span className="font-semibold text-primary">{item.price}</span>
                      </div>
                      {item.description && (
                        <span className="line-clamp-1">{item.description}</span>
                      )}
                    </div>
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
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-8 h-8 p-0"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
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
    </div>
  );
}
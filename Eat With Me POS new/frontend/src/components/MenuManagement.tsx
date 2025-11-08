import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api';
import { useAppContext } from '../contexts/AppContext'; // 1. Import hook
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

// --- Type Definitions ---
// Assuming Category type from your backend
interface Category {
  id: string;
  name: string;
}

// Assuming MenuItem type from your backend
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string; // This will now be the category NAME, as per your backend model
  categoryId?: string; // We can use this if the backend sends it
  description?: string;
  available: boolean;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot' | 'none';
  cookingTime: number;
  isPopular: boolean;
  allergens: string[];
  rating?: number;
  taxCategory?: string;
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
}

export function MenuManagement() {
  const { hasPermission } = useAppContext(); // 2. Use hook
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');

  // --- Data Fetching from Backend ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([apiClient.get('/menu'), apiClient.get('/categories?type=menu')]);
      setMenuItems(Array.isArray(menuRes) ? menuRes : []);
      setCategories(Array.isArray(catRes) ? catRes : []);
    } catch (err) {
      toast.error('Failed to load menu data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setLoading(true);
    const payload = { ...formData, price: parseFloat(formData.price) || 0 };
    try {
      if (editingItem) {
        await apiClient.put(`/menu/${editingItem.id}`, payload);
        toast.success('Item updated successfully.');
      } else {
        await apiClient.post('/menu', payload);
        toast.success('Item created successfully.');
      }
      setShowDialog(false);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to save item.', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await apiClient.delete(`/menu/${id}`);
      toast.success('Item deleted.');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete item.', { description: err.message });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ ...item, category: item.category?.name || '' });
    setShowDialog(true);
  };

  const filteredItems = menuItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Menu Management</h1>
        {hasPermission('menu_management') && (
          <Button onClick={() => { setEditingItem(null); setFormData({}); setShowDialog(true); }}>
            <Plus size={16} className="mr-2" /> Add Item
          </Button>
        )}
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input placeholder="Search menu items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Available</TableHead>
            {hasPermission('menu_management') && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category?.name || 'N/A'}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.available ? 'Yes' : 'No'}</TableCell>
              {hasPermission('menu_management') && (
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}><Edit2 size={14} /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}><Trash2 size={14} /></Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* ... Your form fields ... */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
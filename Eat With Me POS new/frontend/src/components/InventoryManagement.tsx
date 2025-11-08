import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import { AIService } from "../utils/aiService";
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
  ChefHat,
  Bot,
  Clock,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";

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

// Recipe interface is now imported from AppContext

export function InventoryManagement() {
  const {
     suppliers, 
     inventoryItems, 
     addInventoryItem, 
     updateInventoryItem, 
     deleteInventoryItem, 
     getCategoriesByType,
     recipes,
     addRecipe,
     updateRecipe,
     deleteRecipe,
     calculateRecipeCost,
     createPurchaseEntry
   } = useAppContext();
  // Using inventory items from context instead of local state
  // local state (no name collision with `inventory` below)
  const [localInventory, setLocalInventory] = useState<InventoryItem[]>([]);
  // whether we've fetched from backend at least once
  const [fetched, setFetched] = useState(false);
  // single source used by UI: prefer localInventory (if set), otherwise context inventoryItems
  const inventory = fetched ? localInventory : (inventoryItems || []);

  // --- CRUD moved to this frontend component (calls backend routes) ---
  const API_URL = import.meta.env.VITE_API_URL;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const safeNumber = (v: any) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // normalize DB item -> UI model
  const normalize = (it: any): InventoryItem => ({
    id: String(it.id),
    name: it.name || "",
    category: it.category || "",
    unit: it.unit || "",
    currentStock: safeNumber(it.currentStock),
    minStock: safeNumber(it.minStock),
    // keep other fields if needed in rest of file
  });

  async function fetchInventory() {
    try {
      const res = await fetch(`${API_URL}/inventory`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setLocalInventory(Array.isArray(data) ? data.map(normalize) : []);
    } catch (err) {
      console.error("fetchInventory error", err);
      setLocalInventory([]);
    }
  }

  // rename backend helper to avoid duplicate identifier
  async function addNewInventoryItemBackend(payload: Partial<InventoryItem>) {
    try {
      const body = {
        ...payload,
        currentStock: Number(payload.currentStock ?? 0),
        minStock: Number(payload.minStock ?? 0),
      };
      const res = await fetch(`${API_URL}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Create failed");
      const created = await res.json();
      setLocalInventory((prev) => [...prev, normalize(created)]);
      return created;
    } catch (err) {
      console.error("create inventory error", err);
      throw err;
    }
  }

  async function updateInventoryItemBackend(id: string, changes: Partial<InventoryItem>) {
    try {
      const res = await fetch(`${API_URL}/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(changes),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setLocalInventory((prev) => prev.map((i) => (i.id === id ? normalize(updated) : i)));
      return updated;
    } catch (err) {
      console.error("update inventory error", err);
      throw err;
    }
  }

  async function deleteInventoryItemBackend(id: string) {
    try {
      const res = await fetch(`${API_URL}/inventory/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      if (!res.ok) throw new Error("Delete failed");
      setLocalInventory((prev) => prev.filter((i) => i.id !== id));
      return true;
    } catch (err) {
      console.error("delete inventory error", err);
      throw err;
    }
  }

  async function submitPurchaseBackend(payload: {
    supplierId?: string | null;
    invoiceNumber?: string | null;
    date?: string;
    items: { inventoryItemId: string; quantity: number; unitPrice: number }[];
    notes?: string | null;
  }) {
    try {
      const res = await fetch(`${API_URL}/inventory/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "error");
        throw new Error(t);
      }
      const created = await res.json();
      // refresh inventory & stats after purchase
      await fetchInventory();
      return created;
    } catch (err) {
      console.error("create purchase error", err);
      throw err;
    }
  }
  // --- end CRUD in frontend ---

  // fetch once on mount
  useEffect(() => {
    // run once on mount
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const res = await fetch(`${API_URL}/inventory`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;

        const normalized = (Array.isArray(data) ? data : []).map((it: any) => ({
          id: String(it.id),
          name: it.name || '',
          category: it.category || '',
          unit: it.unit || '',
          currentStock: safeNumber(it.currentStock),
          minStock: safeNumber(it.minStock),
          maxStock: safeNumber(it.maxStock),
          costPerUnit: safeNumber(it.costPerUnit),
          supplier: it.supplier?.name || it.supplier || '',
          supplierId: it.supplierId || it.supplier?.id || null,
          expiryDate: it.expiryDate ? (new Date(it.expiryDate)).toISOString().split('T')[0] : undefined,
          lastPurchase: it.lastPurchase ? (new Date(it.lastPurchase)).toISOString().split('T')[0] : undefined,
          usedThisMonth: safeNumber(it.usedThisMonth)
        }));

        // set local copy and mark fetched so UI uses it even if empty
        setLocalInventory(normalized);
        setFetched(true);
        // if (typeof (updateInventoryItems as any) === 'function') updateInventoryItems(normalized);
      } catch (err) {
        console.warn('Failed to fetch inventory from backend', err);
      }
    })();

    return () => { mounted = false; };
  }, []); // <- empty deps: run only once on mount

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<InventoryItem> | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    unit: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    costPerUnit: "",
    supplierId: "",
    expiryDate: "",
  });
  // loading state used by network helpers (submitWastageBackend etc.)
  const [loading, setLoading] = useState<boolean>(false);
  // Purchase dialog state + handler
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [purchaseSupplier, setPurchaseSupplier] = useState<string | null>(null);
  const [purchaseInvoice, setPurchaseInvoice] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [purchaseItem, setPurchaseItem] = useState<{ inventoryItemId?: string; quantity?: string; unitPrice?: string }>( {
    inventoryItemId: undefined,
    quantity: "1",
    unitPrice: "0",
  });

  const handleSavePurchase = async () => {
    if (!purchaseItem.inventoryItemId) {
      toast.error("Select an item for purchase");
      return;
    }
    const items = [
      {
        inventoryItemId: purchaseItem.inventoryItemId!,
        quantity: Number(purchaseItem.quantity || 0),
        unitPrice: Number(purchaseItem.unitPrice || 0),
      },
    ];
    try {
      await submitPurchaseBackend({
        supplierId: purchaseSupplier || null,
        invoiceNumber: purchaseInvoice || null,
        date: purchaseDate || new Date().toISOString(),
        items,
        notes: null,
      });
      toast.success("Purchase saved");
      setIsPurchaseDialogOpen(false);
      setPurchaseSupplier(null);
      setPurchaseInvoice("");
      setPurchaseDate("");
      setPurchaseItem({ inventoryItemId: undefined, quantity: "1", unitPrice: "0" });
    } catch (err) {
      console.error("Save purchase error:", err);
      toast.error("Failed to save purchase");
    }
  };

  // Wastage form state (single-item form used in Wastage tab)
  const [wastageItem, setWastageItem] = useState<{ inventoryItemId?: string; quantity?: string; reason?: string }>( {
    inventoryItemId: undefined,
    quantity: "1",
    reason: "",
  });

  // wastage records fetched from backend
  const [wastageRecords, setWastageRecords] = useState<any[]>([]);

  // fetch wastage history from backend
  async function fetchWastage() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/inventory/wastage`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      });
      if (!res.ok) {
        // if endpoint returns single record, handle gracefully
        const txt = await res.text().catch(() => "");
        console.warn("fetchWastage failed:", res.status, txt);
        setWastageRecords([]);
        return;
      }
      const data = await res.json();
      // expect an array; if single object, wrap it
      setWastageRecords(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("fetchWastage error", err);
      setWastageRecords([]);
    } finally {
      setLoading(false);
    }
  }

  // fetch wastage on mount
  useEffect(() => {
    fetchWastage();
  }, []);

   // Submit wastage to backend and refresh inventory
   async function submitWastageBackend(payload: {
     items: { inventoryItemId: string; quantity: number; reason?: string | null }[];
     notes?: string | null;
   }) {
     setLoading(true);
     try {
       const res = await fetch(`${API_URL}/inventory/wastage`, {
         method: "POST",
         headers: { "Content-Type": "application/json", ...getAuthHeaders() },
         body: JSON.stringify(payload),
       });
       const text = await res.text();
       let body: any;
       try { body = JSON.parse(text); } catch { body = text; }
       console.log("POST /inventory/wastage - status:", res.status, body);
       if (!res.ok) throw new Error(body?.error || body || `Status ${res.status}`);
       // refresh list & stats after successful wastage
       if (typeof fetchInventory === "function") await fetchInventory();
       // refresh wastage history as well
       await fetchWastage();
       return body;
     } catch (err) {
       console.error("submitWastageBackend error:", err);
       throw err;
     } finally {
       setLoading(false);
     }
   }

  // Handler used by the Wastage tab Save button
  async function handleSaveWastage(
    items: { inventoryItemId: string; quantity: number; reason?: string }[],
    notes?: string | null
  ) {
    if (!items || items.length === 0) {
      toast.error("No wastage items provided");
      return;
    }
    try {
      await submitWastageBackend({ items, notes: notes || null });
      toast.success("Wastage recorded");
    } catch (err: any) {
      console.error("handleSaveWastage error:", err);
      toast.error(err?.message || "Failed to record wastage");
      throw err;
    }
  }

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100;
    if (item.currentStock <= item.minStock)
      return { status: "critical", color: "bg-red-500", text: "Critical" };
    if (percentage < 30)
      return { status: "low", color: "bg-yellow-500", text: "Low" };
    if (percentage < 70)
      return { status: "medium", color: "bg-blue-500", text: "Medium" };
    return { status: "good", color: "bg-green-500", text: "Good" };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry <= 7;
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(inventory.map((item) => item.category))];

  const validateInventoryItem = (item: any): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};

    if (!item.name.trim()) {
      errors.name = "Item name is required";
    }

    if (!item.category.trim()) {
      errors.category = "Category is required";
    }

    if (!item.unit.trim()) {
      errors.unit = "Unit is required";
    }

    if (!item.currentStock) {
      errors.currentStock = "Current stock is required";
    } else if (parseFloat(item.currentStock) < 0) {
      errors.currentStock = "Current stock cannot be negative";
    }

    if (!item.minStock) {
      errors.minStock = "Minimum stock is required";
    } else if (parseFloat(item.minStock) < 0) {
      errors.minStock = "Minimum stock cannot be negative";
    }

    if (!item.maxStock) {
      errors.maxStock = "Maximum stock is required";
    } else if (parseFloat(item.maxStock) <= parseFloat(item.minStock)) {
      errors.maxStock = "Maximum stock must be greater than minimum stock";
    }

    if (!item.costPerUnit) {
      errors.costPerUnit = "Cost per unit is required";
    } else if (parseFloat(item.costPerUnit) <= 0) {
      errors.costPerUnit = "Cost per unit must be greater than 0";
    }

    return errors;
  };

  const addNewInventoryItem = async () => {
    const validationErrors = validateInventoryItem(newItem);
 
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors before saving");
      return;
    }
 
    try {
      const payload: Partial<InventoryItem> = {
        name: newItem.name.trim(),
        category: newItem.category.trim(),
        unit: newItem.unit.trim(),
        currentStock: parseFloat(newItem.currentStock) || 0,
        minStock: parseFloat(newItem.minStock) || 0,
        maxStock: parseFloat(newItem.maxStock) || 0,
        costPerUnit: parseFloat(newItem.costPerUnit) || 0,
        supplier: newItem.supplierId,
        expiryDate: newItem.expiryDate || undefined,
        // do not send id/lastPurchase/usedThisMonth — backend sets those
      };
 
      await addNewInventoryItemBackend(payload);
 
       toast.success("Inventory item added successfully");
 
       setNewItem({
         name: "",
         category: "",
         unit: "",
         currentStock: "",
         minStock: "",
         maxStock: "",
         costPerUnit: "",
         supplierId: "",
         expiryDate: "",
       });
       setErrors({});
       setIsAddDialogOpen(false);
     } catch (error) {
       toast.error("Failed to add inventory item");
       console.error("Add inventory item error:", error);
     }
   };

  // open edit dialog and populate form
  const openEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setEditForm({
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier,
      expiryDate: item.expiryDate,
    });
    setIsEditDialogOpen(true);
  };

  // update handler that calls backend and updates local state via helper
  const handleUpdateInventoryItem = async () => {
    if (!editForm || !editForm.id) return;
    try {
      const payload: Partial<InventoryItem> = {
        name: (editForm.name || "").toString(),
        category: (editForm.category || "").toString(),
        unit: (editForm.unit || "").toString(),
        currentStock: Number(editForm.currentStock ?? 0),
        minStock: Number(editForm.minStock ?? 0),
        maxStock: Number(editForm.maxStock ?? 0),
        costPerUnit: Number(editForm.costPerUnit ?? 0),
        supplier: (editForm.supplier as any) || "",
        expiryDate: editForm.expiryDate || undefined,
      };
      await updateInventoryItemBackend(editForm.id, payload);
      toast.success("Inventory item updated");
      setIsEditDialogOpen(false);
      setEditingItem(null);
      setEditForm(null);
    } catch (err) {
      console.error("Update inventory item error:", err);
      toast.error("Failed to update item");
    }
  };

  // change delete to call backend helper
  const handleDeleteInventoryItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      await deleteInventoryItemBackend(id);
      toast.success("Inventory item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete inventory item");
      console.error("Delete inventory item error:", error);
    }
  };

  const stats = {
    totalItems: inventory.length,
    lowStock: inventory.filter(
      (item) => safeNumber(item.currentStock) <= safeNumber(item.minStock)
    ).length,
    expiringSoon: inventory.filter(
      (item) => item.expiryDate && isExpiringSoon(item.expiryDate)
    ).length,
    totalValue: inventory.reduce(
      (sum, item) => sum + safeNumber(item.currentStock) * safeNumber(item.costPerUnit),
      0
    ),
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
          <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsPurchaseDialogOpen(true)}>
                <Receipt className="w-4 h-4 mr-2" />
                Purchase Entry
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Purchase Entry</DialogTitle>
                <DialogDescription>
                  Record a new purchase or stock delivery from your suppliers.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Enter supplier name" value={purchaseSupplier ?? ""} onChange={(e) => setPurchaseSupplier(e.target.value || null)} />
                </div>
                <div>
                  <Label htmlFor="invoice">Invoice Number</Label>
                  <Input id="invoice" placeholder="Enter invoice number" value={purchaseInvoice} onChange={(e) => setPurchaseInvoice(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="date">Purchase Date</Label>
                  <Input id="date" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
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
                    <Select value={purchaseItem.inventoryItemId} onValueChange={(v) => setPurchaseItem({ ...purchaseItem, inventoryItemId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Qty" value={purchaseItem.quantity} onChange={(e) => setPurchaseItem({ ...purchaseItem, quantity: e.target.value })} />
                    <Input placeholder="Price" value={purchaseItem.unitPrice} onChange={(e) => setPurchaseItem({ ...purchaseItem, unitPrice: e.target.value })} />
                    <Input placeholder="Total" readOnly value={(() => {
                      const q = Number(purchaseItem.quantity || 0);
                      const p = Number(purchaseItem.unitPrice || 0);
                      return (q * p).toString();
                    })()} />
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" onClick={handleSavePurchase}>Save Purchase</Button>
                  <Button variant="outline" className="flex-1" onClick={() => setIsPurchaseDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
                <DialogDescription>
                  Add a new item to your inventory with stock levels and supplier information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Item Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter item name"
                      value={newItem.name}
                      onChange={(e) => {
                        setNewItem({ ...newItem, name: e.target.value });
                        if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                      }}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) => {
                        setNewItem({ ...newItem, category: value });
                        if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
                      }}
                    >
                      <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grains">Grains</SelectItem>
                        <SelectItem value="meat">Meat</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="spices">Spices</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="oil">Oil & Fats</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Input
                      id="unit"
                      placeholder="kg, liter, pieces"
                      value={newItem.unit}
                      onChange={(e) => {
                        setNewItem({ ...newItem, unit: e.target.value });
                        if (errors.unit) setErrors((prev) => ({ ...prev, unit: "" }));
                      }}
                      className={errors.unit ? "border-destructive" : ""}
                    />
                    {errors.unit && <p className="text-sm text-destructive">{errors.unit}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentStock">Current Stock *</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      placeholder="0"
                      value={newItem.currentStock}
                      onChange={(e) => {
                        setNewItem({ ...newItem, currentStock: e.target.value });
                        if (errors.currentStock) setErrors((prev) => ({ ...prev, currentStock: "" }));
                      }}
                      className={errors.currentStock ? "border-destructive" : ""}
                    />
                    {errors.currentStock && <p className="text-sm text-destructive">{errors.currentStock}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock *</Label>
                    <Input
                      id="minStock"
                      type="number"
                      placeholder="0"
                      value={newItem.minStock}
                      onChange={(e) => {
                        setNewItem({ ...newItem, minStock: e.target.value });
                        if (errors.minStock) setErrors((prev) => ({ ...prev, minStock: "" }));
                      }}
                      className={errors.minStock ? "border-destructive" : ""}
                    />
                    {errors.minStock && <p className="text-sm text-destructive">{errors.minStock}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxStock">Max Stock *</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      placeholder="0"
                      value={newItem.maxStock}
                      onChange={(e) => {
                        setNewItem({ ...newItem, maxStock: e.target.value });
                        if (errors.maxStock) setErrors((prev) => ({ ...prev, maxStock: "" }));
                      }}
                      className={errors.maxStock ? "border-destructive" : ""}
                    />
                    {errors.maxStock && <p className="text-sm text-destructive">{errors.maxStock}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost per Unit *</Label>
                    <Input
                      id="cost"
                      type="number"
                      placeholder="₹0"
                      value={newItem.costPerUnit}
                      onChange={(e) => {
                        setNewItem({ ...newItem, costPerUnit: e.target.value });
                        if (errors.costPerUnit) setErrors((prev) => ({ ...prev, costPerUnit: "" }));
                      }}
                      className={errors.costPerUnit ? "border-destructive" : ""}
                    />
                    {errors.costPerUnit && <p className="text-sm text-destructive">{errors.costPerUnit}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={newItem.expiryDate}
                      onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    onClick={addNewInventoryItem}
                    disabled={Object.keys(errors).length > 0}
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsAddDialogOpen(false);
                      setErrors({});
                      setNewItem({
                        name: "",
                        category: "",
                        unit: "",
                        currentStock: "",
                        minStock: "",
                        maxStock: "",
                        costPerUnit: "",
                        supplierId: "",
                        expiryDate: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
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
          <div className="text-2xl font-bold text-green-600">
            ₹{stats.totalValue.toLocaleString()}
          </div>
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
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
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
                        <div className="font-medium">₹{safeNumber(item.costPerUnit)}</div>
                        <div className="text-sm text-muted-foreground">per {item.unit}</div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
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
                      <h3 className="font-semibold">{recipe.menuItemName}</h3>
                      <div className="text-sm text-muted-foreground">
                        {recipe.ingredients.length} ingredients • {recipe.preparationTime} min
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">Cost per serving</div>
                      <div className="text-sm text-muted-foreground">₹{recipe.cost.toFixed(2)}</div>
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
                      const item = inventory.find((i) => i.id === ingredient.inventoryItemId);
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-accent/50 p-2 rounded"
                        >
                          <span className="text-sm">{ingredient.inventoryItemName}</span>
                          <span className="text-sm font-medium">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
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
                    <Select
                      value={wastageItem.inventoryItemId}
                      onValueChange={(v) => setWastageItem({ ...wastageItem, inventoryItemId: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventory.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="wasteQuantity">Quantity</Label>
                    <Input
                      id="wasteQuantity"
                      type="number"
                      placeholder="0"
                      value={wastageItem.quantity}
                      onChange={(e) => setWastageItem({ ...wastageItem, quantity: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="wasteReason">Reason</Label>
                    <Select
                      value={wastageItem.reason}
                      onValueChange={(v) => setWastageItem({ ...wastageItem, reason: v })}
                    >
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

                <div className="flex items-center gap-2">
                  <Button
                    className="w-full sm:w-auto"
                    onClick={async () => {
                      // basic validation
                      if (!wastageItem.inventoryItemId) {
                        toast.error("Please select an item");
                        return;
                      }
                      const qty = Number(wastageItem.quantity || 0);
                      if (!Number.isFinite(qty) || qty <= 0) {
                        toast.error("Enter a quantity greater than 0");
                        return;
                      }

                      try {
                        await handleSaveWastage(
                          [
                            {
                              inventoryItemId: wastageItem.inventoryItemId!,
                              quantity: qty,
                              reason: wastageItem.reason || undefined,
                            },
                          ],
                          null
                        );
                        // reset form
                        setWastageItem({ inventoryItemId: undefined, quantity: "1", reason: "" });
                      } catch (err) {
                        console.error("Record wastage failed:", err);
                      }
                    }}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Record Wastage
                  </Button>
                </div>

                {/* Wastage history */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">Wastage History</h4>
                  {wastageRecords.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No wastage records</div>
                  ) : (
                    <div className="space-y-2">
                      {wastageRecords.map((rec) => (
                        <Card key={rec.id || JSON.stringify(rec)} className="p-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm font-medium">{new Date(rec.date || rec.createdAt || Date.now()).toLocaleString()}</div>
                              <div className="text-xs text-muted-foreground">Notes: {rec.notes ?? "-"}</div>
                            </div>
                            <div className="text-right text-xs text-muted-foreground">
                              {rec.updates ? `${rec.updates.length} item(s)` : (rec.items ? `${rec.items.length} item(s)` : "")}
                            </div>
                          </div>
                          <div className="mt-2 grid gap-1 text-sm">
                            {(rec.items || rec.updates || []).map((it: any, idx: number) => (
                              <div key={idx} className="flex justify-between">
                                <div>{(inventory.find(i => i.id === it.inventoryItemId)?.name) || it.inventoryItemId}</div>
                                <div className="text-muted-foreground">{it.quantity} — {it.reason ?? ""}</div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Global Edit Dialog (single instance) */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update item details and stock levels.</DialogDescription>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_name">Item Name</Label>
                  <Input id="edit_name" value={String(editForm.name || "")} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="edit_category">Category</Label>
                  <Input id="edit_category" value={String(editForm.category || "")} onChange={(e) => setEditForm({...editForm, category: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit_currentStock">Current Stock</Label>
                  <Input id="edit_currentStock" type="number" value={String(editForm.currentStock ?? "")} onChange={(e) => setEditForm({...editForm, currentStock: Number(e.target.value)})} />
                </div>
                <div>
                  <Label htmlFor="edit_minStock">Min Stock</Label>
                  <Input id="edit_minStock" type="number" value={String(editForm.minStock ?? "")} onChange={(e) => setEditForm({...editForm, minStock: Number(e.target.value)})} />
                </div>
                <div>
                  <Label htmlFor="edit_maxStock">Max Stock</Label>
                  <Input id="edit_maxStock" type="number" value={String(editForm.maxStock ?? "")} onChange={(e) => setEditForm({...editForm, maxStock: Number(e.target.value)})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit_costPerUnit">Cost per Unit</Label>
                  <Input id="edit_costPerUnit" type="number" value={String(editForm.costPerUnit ?? "")} onChange={(e) => setEditForm({...editForm, costPerUnit: Number(e.target.value)})} />
                </div>
                <div>
                  <Label htmlFor="edit_expiryDate">Expiry Date</Label>
                  <Input id="edit_expiryDate" type="date" value={String(editForm.expiryDate ?? "")} onChange={(e) => setEditForm({...editForm, expiryDate: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={handleUpdateInventoryItem}>Update</Button>
                <Button variant="outline" className="flex-1" onClick={() => { setIsEditDialogOpen(false); setEditForm(null); setEditingItem(null); }}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
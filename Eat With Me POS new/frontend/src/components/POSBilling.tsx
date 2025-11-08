import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../lib/api'; // --- FIX: Use the centralized API client
import { useAppContext } from '../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Plus, Minus, ShoppingCart, CreditCard, Banknote, Smartphone, Printer, FileText, Trash2, Users, ShoppingBag, Table as TableIcon, Download, FileSpreadsheet, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

// --- FIX: Updated Type Definitions ---
interface Category { id: string; name: string; }
interface MenuItem { id: string; name: string; price: number; available: boolean; categoryId: string; }
interface Table { id: string; name: string; status: string; }
interface Order { id: string; }
interface Customer { id: string; name: string; phone: string; }
interface CartItem extends MenuItem { quantity: number; }

export function POSBilling() {
  const { settings } = useAppContext();

  // State for entities
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  
  // UI state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderDetails, setOrderDetails] = useState({
    type: '' as 'dine-in' | 'takeaway' | '',
    tableId: '',
    tableName: '',
    customerName: '',
    customerPhone: '',
    paymentMethod: '',
  });

  // Dialog states
  const [showOrderTypeDialog, setShowOrderTypeDialog] = useState(false);
  const [showCustomerDetailsDialog, setShowCustomerDetailsDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- FIX: Modernized Data Fetching ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesRes, menuRes, tablesRes] = await Promise.all([
        apiClient.get('/categories?type=menu'),
        apiClient.get('/menu'),
        apiClient.get('/tables'),
      ]);
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
      setMenuItems(Array.isArray(menuRes) ? menuRes : []);
      setTables(Array.isArray(tablesRes) ? tablesRes : []);

      // Auto-select first category
      if (categoriesRes.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(categoriesRes[0].id);
      }
    } catch (error: any) {
      toast.error('Failed to load data', { description: error.message });
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    fetchData();
  }, []); // Fetch only on initial component mount

  // Derived data
  const filteredItems = menuItems.filter(item => item.categoryId === selectedCategoryId && item.available);

  // Table logic
  const availableTables = tables.map(table => ({
    id: table.id,
    name: `Table ${table.number}`,
    number: table.number,
    isOccupied: table.status !== 'AVAILABLE',
    status: table.status,
    capacity: table.capacity,
    customer: table.customer,
    waiter: table.waiter,
    statusDisplay: table.status === 'occupied' ? 'Occupied' : table.status === 'reserved' ? 'Reserved' : 'Available',
  }));

  // Cart and totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = settings?.taxRate || 0.05; // Example: 5% tax from settings
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  // Cart actions
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, increment: boolean) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (id: string) => setCart(cart.filter(item => item.id !== id));

  // --- FIX: Modernized API Actions ---
  const handleCompleteOrder = async () => {
    if (cart.length === 0) {
      toast.error("Cannot complete an empty order.");
      return;
    }
    if (!orderDetails.paymentMethod) {
      toast.error("Please select a payment method.");
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        orderSource: orderDetails.type,
        status: 'Completed',
        totalAmount: total,
        paymentMethod: orderDetails.paymentMethod,
        tableId: orderDetails.type === 'dine-in' ? orderDetails.tableId : null,
        // customerId can be added here if you have customer selection logic
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await apiClient.post('/orders', orderPayload);

      // If it was a dine-in order, update the table status back to available
      if (orderDetails.type === 'dine-in' && orderDetails.tableId) {
        await apiClient.put(`/tables/${orderDetails.tableId}`, { status: 'Available' });
        fetchData(); // Re-fetch tables to show updated status
      }

      toast.success('Order completed successfully!');
      setShowInvoiceDialog(true); // Show invoice options after success

    } catch (error: any) {
      toast.error('Failed to complete order', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // UI Handlers
  const handleOrderTypeSelect = (type: 'dine-in' | 'takeaway') => {
    setOrderDetails(prev => ({ ...prev, type }));
    setShowOrderTypeDialog(false);
    setShowCustomerDetailsDialog(true);
  };

  const handleTableSelect = (table: Table) => {
    setOrderDetails(prev => ({ ...prev, tableId: table.id, tableName: table.name }));
  };

  const handleCustomerDetailsContinue = () => {
    if (orderDetails.type === 'dine-in' && !orderDetails.tableId) {
      toast.warning('Please select a table for the dine-in order.');
      return;
    }
    setShowCustomerDetailsDialog(false);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setOrderDetails(prev => ({ ...prev, paymentMethod: method }));
    handleCompleteOrder(); // Directly attempt to complete the order
  };
  
  const resetOrder = () => {
    setCart([]);
    setOrderDetails({
      type: '', tableId: '', tableName: '', customerName: '', customerPhone: '', paymentMethod: ''
    });
    setShowInvoiceDialog(false);
  };

  // Invoice/Export functions (no changes needed, but included for completeness)
  const downloadPDF = () => { /* ... your existing PDF logic ... */ };
  const downloadExcel = () => { /* ... your existing Excel logic ... */ };
  const sendWhatsAppInvoice = () => { /* ... your existing WhatsApp logic ... */ };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background">
      {/* Menu Section */}
      <div className="flex-1 p-4 space-y-4">
        {/* Header with order status */}
        {orderDetails.type && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {orderDetails.type === 'dine-in' ? (
                  <TableIcon className="w-5 h-5 text-primary" />
                ) : (
                  <ShoppingBag className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="font-medium">
                    {orderDetails.type === 'dine-in' ? 'Dine-In Order' : 'Takeaway Order'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.tableName && `Table: ${orderDetails.tableName}`}
                    {orderDetails.customerName && ` • Customer: ${orderDetails.customerName}`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setOrderDetails({ type: '', tableId: '', tableName: '', customerName: '', customerPhone: '', paymentMethod: '' });
                  setCart([]);
                }}
              >
                New Order
              </Button>
            </div>
          </Card>
        )}

        {/* Categories */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  selectedCategoryId === category.id
                    ? 'bg-primary text-primary-foreground'
                    : 'border-primary text-primary hover:bg-primary/10'
                }`}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`border-0 shadow-md hover:shadow-lg transition-all duration-200 ${
                !item.available ? 'opacity-50' : 'cursor-pointer hover:scale-105'
              }`}
              onClick={() => {
                if (item.available) {
                  if (!orderDetails.type) setShowOrderTypeDialog(true);
                  else addToCart(item);
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-primary line-clamp-2">{item.name}</h4>
                  {!item.available && (
                    <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-primary">₹</span>
                    <span className="text-lg font-semibold text-primary">{item.price}</span>
                  </div>
                  <Button
                    size="sm"
                    className="w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90"
                    disabled={!item.available}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!orderDetails.type) setShowOrderTypeDialog(true);
                      else addToCart(item);
                    }}
                  ><Plus size={16} /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 bg-card border-l border-border p-4">
        <Card className="h-full border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ShoppingCart size={20} />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            {/* Cart Items */}
            <ScrollArea className="flex-1 mb-4">
              {cart.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No items in cart</p>
                  <Button className="mt-4" onClick={() => setShowOrderTypeDialog(true)}>Start New Order</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium truncate">{item.name}</h5>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span className="text-primary">₹</span>
                          <span>{item.price} × {item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0" onClick={() => updateQuantity(item.id, false)}><Minus size={12} /></Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button size="sm" variant="outline" className="w-8 h-8 p-0" onClick={() => updateQuantity(item.id, true)}><Plus size={12} /></Button>
                        <Button size="sm" variant="destructive" className="w-8 h-8 p-0 ml-1" onClick={() => removeFromCart(item.id)}><Trash2 size={12} /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Order Total */}
            {cart.length > 0 && (
              <div className="space-y-4 border-t border-border pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {settings?.taxes?.map((tax, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                      <span>{tax.name} ({tax.rate}%)</span>
                      <span>₹{(tax.amount * subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg text-primary">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Customer Info */}
                {orderDetails.customerName && (
                  <div className="bg-muted/50 p-2 rounded text-sm">
                    <p className="font-medium">{orderDetails.customerName}</p>
                    <p className="text-muted-foreground">{orderDetails.customerPhone}</p>
                  </div>
                )}

                {/* Payment Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-12 flex-col gap-1 border-green-200 text-green-700 hover:bg-green-50" onClick={() => handlePaymentMethodSelect('cash')}>
                    <Banknote size={18} /><span className="text-xs">Cash</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex-col gap-1 border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => handlePaymentMethodSelect('card')}>
                    <CreditCard size={18} /><span className="text-xs">Card</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex-col gap-1 border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => handlePaymentMethodSelect('upi')}>
                    <Smartphone size={18} /><span className="text-xs">UPI</span>
                  </Button>
                  <Button variant="outline" className="h-12 flex-col gap-1 border-orange-200 text-orange-700 hover:bg-orange-50" onClick={() => handlePaymentMethodSelect('split')}>
                    <FileText size={18} /><span className="text-xs">Split</span>
                  </Button>
                </div>

                {/* Checkout Button */}
                <Button className="w-full h-12 bg-primary hover:bg-primary/90" onClick={() => {
                  if (!orderDetails.customerName) setShowCustomerDetailsDialog(true);
                  else setShowInvoiceDialog(true);
                }}>
                  <Users className="mr-2" size={18} />Proceed to Checkout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Type Selection Dialog */}
      <Dialog open={showOrderTypeDialog} onOpenChange={setShowOrderTypeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Order Type</DialogTitle>
            <DialogDescription>
              Choose whether this is a dine-in or takeaway order
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Button
              className="h-20 flex-col gap-2 text-left"
              variant="outline"
              onClick={() => handleOrderTypeSelect('dine-in')}
            >
              <TableIcon size={24} />
              <div>
                <p className="font-medium">Dine-In</p>
                <p className="text-sm text-muted-foreground">Customer will eat at the restaurant</p>
              </div>
            </Button>
            
            <Button
              className="h-20 flex-col gap-2 text-left"
              variant="outline"
              onClick={() => handleOrderTypeSelect('takeaway')}
            >
              <ShoppingBag size={24} />
              <div>
                <p className="font-medium">Takeaway</p>
                <p className="text-sm text-muted-foreground">Customer will take the order to go</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDetailsDialog} onOpenChange={setShowCustomerDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              Enter customer information and table assignment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {orderDetails.type === 'dine-in' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Table</label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {availableTables.map((table) => {
                    console.log(table); // Add this line
                    return (
                      <Button
                        key={table.id}
                        variant={orderDetails.tableId === table.id ? "default" : "outline"}
                        disabled={table.isOccupied}
                        onClick={() => handleTableSelect(table)}
                        className={`h-12 text-xs ${
                          table.status === 'occupied' ? 'border-red-300 text-red-700' :
                          table.status === 'reserved' ? 'border-yellow-300 text-yellow-700' :
                          'border-green-300 text-green-700'
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span>Table {table.number}</span>
                          <span className="text-[10px] opacity-75">
                            {table.status === 'free' ? 'Available' : table.status}
                          </span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Name (Optional)</label>
              <Input
                placeholder="Enter customer name"
                value={orderDetails.customerName}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number (Optional)</label>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={orderDetails.customerPhone}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, customerPhone: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCustomerDetailsDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCustomerDetailsContinue}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Options Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order Complete - {settings?.currencySymbol}{total.toFixed(2)}</DialogTitle>
            <DialogDescription>
              Choose how to handle the invoice for this completed order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">Payment Successful!</p>
              <p className="text-sm text-green-600">
                Paid via {orderDetails.paymentMethod?.toUpperCase()}
              </p>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full h-12 gap-2"
                onClick={() => {
                  alert('Printing invoice...');
                  handleCompleteOrder();
                }}
              >
                <Printer size={18} />
                Print Invoice
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-12 gap-2 border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => {
                    downloadExcel();
                    handleCompleteOrder();
                  }}
                >
                  <FileSpreadsheet size={18} />
                  Download Excel
                </Button>

                <Button
                  variant="outline"
                  className="h-12 gap-2 border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => {
                    downloadPDF();
                    handleCompleteOrder();
                  }}
                >
                  <Download size={18} />
                  Download PDF
                </Button>
              </div>

              {orderDetails.customerPhone && (
                <Button
                  variant="outline"
                  className="w-full h-12 gap-2"
                  onClick={sendWhatsAppInvoice}
                >
                  <MessageCircle size={18} />
                  Send Invoice via WhatsApp
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full h-12 gap-2"
                onClick={handleCompleteOrder}
              >
                <FileText size={18} />
                Save & Continue
              </Button>
            </div>

            {/* Add a final button to start a new order */}
            <Button variant="default" className="w-full h-12" onClick={resetOrder}>
              Start New Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
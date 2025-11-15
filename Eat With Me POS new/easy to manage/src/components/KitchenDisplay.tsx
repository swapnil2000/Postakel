import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  MessageSquare,
  Timer,
  Bell
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  category: string;
}

interface KitchenOrder {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'new' | 'preparing' | 'ready' | 'served';
  orderTime: string;
  estimatedTime: number;
  priority: 'normal' | 'high' | 'urgent';
  waiter: string;
  specialInstructions?: string;
}

export function KitchenDisplay() {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: 'ORD001',
      tableNumber: 5,
      items: [
        { id: '1', name: 'Butter Chicken', quantity: 2, category: 'Main Course' },
        { id: '2', name: 'Garlic Naan', quantity: 3, category: 'Breads' },
        { id: '3', name: 'Dal Makhani', quantity: 1, category: 'Main Course' }
      ],
      status: 'new',
      orderTime: '2:30 PM',
      estimatedTime: 25,
      priority: 'normal',
      waiter: 'Raj',
      specialInstructions: 'Less spicy for kids'
    },
    {
      id: 'ORD002',
      tableNumber: 3,
      items: [
        { id: '4', name: 'Chicken Biryani', quantity: 1, category: 'Main Course' },
        { id: '5', name: 'Raita', quantity: 1, category: 'Sides' },
        { id: '6', name: 'Gulab Jamun', quantity: 2, category: 'Desserts' }
      ],
      status: 'preparing',
      orderTime: '2:15 PM',
      estimatedTime: 35,
      priority: 'high',
      waiter: 'Priya'
    },
    {
      id: 'ORD003',
      tableNumber: 1,
      items: [
        { id: '7', name: 'Masala Dosa', quantity: 2, category: 'South Indian' },
        { id: '8', name: 'Filter Coffee', quantity: 2, category: 'Beverages' }
      ],
      status: 'ready',
      orderTime: '2:00 PM',
      estimatedTime: 20,
      priority: 'urgent',
      waiter: 'Amit'
    }
  ]);

  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'served': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTimeColor = (orderTime: string, estimatedTime: number) => {
    // This would calculate actual time difference in a real app
    return 'text-orange-600'; // Placeholder
  };

  const filterOrdersByStatus = (status: string) => {
    return orders.filter(order => order.status === status);
  };

  const OrderCard = ({ order }: { order: KitchenOrder }) => (
    <Card className={`border-l-4 ${getPriorityColor(order.priority)} border-l-solid`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
              {order.tableNumber}
            </div>
            <div>
              <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">{order.waiter}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <div className="text-sm text-muted-foreground mt-1">
              {order.orderTime}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center bg-accent/50 p-3 rounded-lg">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">{item.category}</div>
                {item.notes && (
                  <div className="text-xs text-orange-600 mt-1">
                    <MessageSquare className="w-3 h-3 inline mr-1" />
                    {item.notes}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {item.quantity}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        {order.specialInstructions && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800">Special Instructions</div>
                <div className="text-sm text-yellow-700">{order.specialInstructions}</div>
              </div>
            </div>
          </div>
        )}

        {/* Timer */}
        <div className="flex items-center justify-between bg-accent/30 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Estimated: {order.estimatedTime} min</span>
          </div>
          <div className="text-sm font-medium text-orange-600">
            Running: 15 min
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {order.status === 'new' && (
            <Button 
              className="flex-1"
              onClick={() => updateOrderStatus(order.id, 'preparing')}
            >
              <Clock className="w-4 h-4 mr-2" />
              Start Cooking
            </Button>
          )}
          
          {order.status === 'preparing' && (
            <Button 
              className="flex-1"
              onClick={() => updateOrderStatus(order.id, 'ready')}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Ready
            </Button>
          )}
          
          {order.status === 'ready' && (
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => updateOrderStatus(order.id, 'served')}
            >
              <Users className="w-4 h-4 mr-2" />
              Served
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Kitchen Display</h1>
          <p className="text-muted-foreground">Live orders for kitchen staff</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live
          </Badge>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{filterOrdersByStatus('new').length}</div>
          <div className="text-sm text-muted-foreground">New Orders</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{filterOrdersByStatus('preparing').length}</div>
          <div className="text-sm text-muted-foreground">Preparing</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{filterOrdersByStatus('ready').length}</div>
          <div className="text-sm text-muted-foreground">Ready</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">18</div>
          <div className="text-sm text-muted-foreground">Avg Time</div>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="new">New ({filterOrdersByStatus('new').length})</TabsTrigger>
          <TabsTrigger value="preparing">Preparing ({filterOrdersByStatus('preparing').length})</TabsTrigger>
          <TabsTrigger value="ready">Ready ({filterOrdersByStatus('ready').length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterOrdersByStatus('new').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="preparing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterOrdersByStatus('preparing').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="ready" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterOrdersByStatus('ready').map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Plus,
  UserCheck,
  Coffee,
  Settings,
  Search
} from 'lucide-react';

interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'free' | 'occupied' | 'reserved' | 'cleaning';
  waiter?: string;
  customer?: string;
  orderAmount?: number;
  timeOccupied?: string;
  guests?: number;
}

interface TableManagementProps {
  onNavigate: (screen: string) => void;
}

export function TableManagement({ onNavigate }: TableManagementProps) {
  const [tables, setTables] = useState<Table[]>([
    { id: '1', number: 1, capacity: 4, status: 'occupied', waiter: 'Raj', customer: 'Sharma Family', orderAmount: 850, timeOccupied: '45 min', guests: 4 },
    { id: '2', number: 2, capacity: 2, status: 'free', waiter: 'Priya', customer: '', orderAmount: 0, timeOccupied: '', guests: 0 },
    { id: '3', number: 3, capacity: 6, status: 'reserved', waiter: 'Amit', customer: 'Kumar Party', orderAmount: 0, timeOccupied: '15 min', guests: 6 },
    { id: '4', number: 4, capacity: 4, status: 'occupied', waiter: 'Raj', customer: 'Gupta Family', orderAmount: 650, timeOccupied: '25 min', guests: 3 },
    { id: '5', number: 5, capacity: 2, status: 'free', waiter: 'Priya', customer: '', orderAmount: 0, timeOccupied: '', guests: 0 },
    { id: '6', number: 6, capacity: 8, status: 'cleaning', waiter: '', customer: '', orderAmount: 0, timeOccupied: '', guests: 0 },
    { id: '7', number: 7, capacity: 4, status: 'free', waiter: 'Amit', customer: '', orderAmount: 0, timeOccupied: '', guests: 0 },
    { id: '8', number: 8, capacity: 2, status: 'occupied', waiter: 'Priya', customer: 'Singh Sir', orderAmount: 320, timeOccupied: '10 min', guests: 1 },
  ]);

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-red-100 border-red-200 text-red-800';
      case 'free': return 'bg-green-100 border-green-200 text-green-800';
      case 'reserved': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'cleaning': return 'bg-gray-100 border-gray-200 text-gray-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied': return '🔴';
      case 'free': return '🟢';
      case 'reserved': return '🟡';
      case 'cleaning': return '🧹';
      default: return '⚪';
    }
  };

  const handleTableAction = (table: Table, action: string) => {
    if (action === 'start-order' || action === 'resume-order') {
      onNavigate('pos');
    }
  };

  const filteredTables = tables.filter(table => 
    table.number.toString().includes(searchTerm) || 
    table.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.waiter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: tables.length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    free: tables.filter(t => t.status === 'free').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    revenue: tables.reduce((sum, t) => sum + (t.orderAmount || 0), 0)
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Table Management</h1>
          <p className="text-muted-foreground">Manage table status and customer flow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Layout
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Table
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search tables, customers, or waiters..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Tables</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.occupied}</div>
            <div className="text-sm text-muted-foreground">Occupied</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.free}</div>
            <div className="text-sm text-muted-foreground">Free</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.reserved}</div>
            <div className="text-sm text-muted-foreground">Reserved</div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">₹{stats.revenue}</div>
            <div className="text-sm text-muted-foreground">Revenue</div>
          </div>
        </Card>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredTables.map((table) => (
          <Dialog key={table.id}>
            <DialogTrigger asChild>
              <Card className={`cursor-pointer transition-all hover:shadow-md ${getStatusColor(table.status)} border-2`}>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{getStatusIcon(table.status)}</div>
                    <div className="font-bold text-lg">Table {table.number}</div>
                    <div className="text-sm opacity-75">{table.capacity} seats</div>
                    
                    {table.status === 'occupied' && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{table.customer}</div>
                        <div className="text-xs opacity-75">{table.timeOccupied}</div>
                        <div className="text-sm font-bold">₹{table.orderAmount}</div>
                      </div>
                    )}
                    
                    {table.status === 'reserved' && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{table.customer}</div>
                        <div className="text-xs opacity-75">{table.guests} guests</div>
                      </div>
                    )}
                    
                    {table.status === 'free' && (
                      <Badge variant="outline" className="text-xs">
                        Available
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Table {table.number} - {table.status.charAt(0).toUpperCase() + table.status.slice(1)}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" value={table.capacity} readOnly />
                  </div>
                  <div>
                    <Label htmlFor="waiter">Assigned Waiter</Label>
                    <Select defaultValue={table.waiter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select waiter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Raj">Raj</SelectItem>
                        <SelectItem value="Priya">Priya</SelectItem>
                        <SelectItem value="Amit">Amit</SelectItem>
                        <SelectItem value="Sunita">Sunita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customer">Customer Name</Label>
                  <Input id="customer" defaultValue={table.customer} placeholder="Enter customer name" />
                </div>
                
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input id="guests" type="number" defaultValue={table.guests} placeholder="Enter number of guests" />
                </div>
                
                {table.status === 'occupied' && (
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Order Details</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Duration: {table.timeOccupied}</div>
                      <div>Amount: ₹{table.orderAmount}</div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  {table.status === 'free' && (
                    <Button 
                      className="flex-1"
                      onClick={() => handleTableAction(table, 'start-order')}
                    >
                      <Coffee className="w-4 h-4 mr-2" />
                      Start Order
                    </Button>
                  )}
                  
                  {table.status === 'occupied' && (
                    <>
                      <Button 
                        className="flex-1"
                        onClick={() => handleTableAction(table, 'resume-order')}
                      >
                        <Coffee className="w-4 h-4 mr-2" />
                        Resume Order
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Checkout
                      </Button>
                    </>
                  )}
                  
                  {table.status === 'reserved' && (
                    <Button 
                      className="flex-1"
                      onClick={() => handleTableAction(table, 'start-order')}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Seat Guests
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  Wallet,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Download,
  Send,
  CreditCard,
  Banknote,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  BarChart3,
  Crown,
  Sparkles
} from 'lucide-react';

export function WalletPayments() {
  const [activeTab, setActiveTab] = useState('overview');

  const walletData = {
    balance: 125000,
    pendingPayments: 35000,
    thisMonthEarnings: 95000,
    lastMonthEarnings: 78000,
    totalEarnings: 580000,
    completedBookings: 24
  };

  const transactions = [
    {
      id: 'TXN001',
      type: 'credit',
      title: 'Wedding Reception Payment',
      client: 'Priya & Rohit Sharma',
      amount: 30000,
      status: 'completed',
      date: '2024-02-26',
      method: 'UPI',
      bookingId: 'BK001'
    },
    {
      id: 'TXN002',
      type: 'credit',
      title: 'Corporate Event Advance',
      client: 'TechCorp Solutions',
      amount: 10000,
      status: 'completed',
      date: '2024-02-25',
      method: 'Bank Transfer',
      bookingId: 'BK002'
    },
    {
      id: 'TXN003',
      type: 'debit',
      title: 'Platform Commission',
      client: 'ArtistHub',
      amount: 1500,
      status: 'completed',
      date: '2024-02-24',
      method: 'Auto Debit',
      bookingId: null
    },
    {
      id: 'TXN004',
      type: 'credit',
      title: 'Birthday Party Final Payment',
      client: 'Anil Kumar',
      amount: 12500,
      status: 'pending',
      date: '2024-02-20',
      method: 'UPI',
      bookingId: 'BK003'
    },
    {
      id: 'TXN005',
      type: 'credit',
      title: 'Sangeet Ceremony Payment',
      client: 'Meera & Family',
      amount: 15000,
      status: 'completed',
      date: '2024-02-15',
      method: 'Cash',
      bookingId: 'BK004'
    }
  ];

  const pendingPayments = [
    {
      id: 'PP001',
      client: 'TechCorp Solutions',
      eventTitle: 'Corporate Annual Party',
      amount: 25000,
      dueDate: '2024-03-06',
      status: 'overdue',
      lastReminder: '2024-02-28'
    },
    {
      id: 'PP002',
      client: 'Anil Kumar',
      eventTitle: 'Birthday Celebration',
      amount: 12500,
      dueDate: '2024-02-21',
      status: 'due',
      lastReminder: null
    }
  ];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: '📱', account: 'arjun@paytm', status: 'active' },
    { id: 'bank', name: 'Bank Account', icon: '🏦', account: '****1234', status: 'active' },
    { id: 'paypal', name: 'PayPal', icon: '💳', account: 'dj.arjun@email.com', status: 'inactive' }
  ];

  const getTransactionIcon = (type: string, method: string) => {
    if (type === 'credit') {
      return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
    } else {
      return <ArrowUpRight className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'overdue': return 'bg-red-500 text-white';
      case 'due': return 'status-pending';
      default: return 'badge-artist';
    }
  };

  const monthlyEarningsChange = ((walletData.thisMonthEarnings - walletData.lastMonthEarnings) / walletData.lastMonthEarnings) * 100;

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Wallet className="w-8 h-8 text-artist-neon-purple" />
          Wallet & Payments
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" className="border-secondary text-white hover:bg-secondary/30">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="btn-gold">
            <Send className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center animate-neon-glow">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold text-artist-gold">₹{(walletData.balance / 1000).toFixed(0)}k</p>
                <p className="text-xs text-green-400">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-artist-neon-purple">₹{(walletData.thisMonthEarnings / 1000).toFixed(0)}k</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <p className="text-xs text-green-400">+{monthlyEarningsChange.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-stage-gradient rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-400">₹{(walletData.pendingPayments / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">2 clients</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-gradient rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold text-white">₹{(walletData.totalEarnings / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">{walletData.completedBookings} gigs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-secondary rounded-2xl">
          <TabsTrigger value="overview" className="text-white">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="text-white">Transactions</TabsTrigger>
          <TabsTrigger value="pending" className="text-white">Pending</TabsTrigger>
          <TabsTrigger value="methods" className="text-white">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card className="card-artist">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-artist-gold" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-artist-neon-purple/20 rounded-xl flex items-center justify-center">
                          {getTransactionIcon(transaction.type, transaction.method)}
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{transaction.title}</p>
                          <p className="text-xs text-muted-foreground">{transaction.client}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-artist">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-artist-gold" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full btn-artist justify-start h-14">
                  <Send className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p>Withdraw Money</p>
                    <p className="text-xs opacity-80">Transfer to bank account</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-14 border-secondary text-white hover:bg-secondary/30">
                  <Download className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p>Download Statement</p>
                    <p className="text-xs opacity-80">Get PDF report</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-14 border-secondary text-white hover:bg-secondary/30">
                  <CreditCard className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p>Payment Reminder</p>
                    <p className="text-xs opacity-80">Send to clients</p>
                  </div>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-14 border-secondary text-white hover:bg-secondary/30">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p>Earning Analytics</p>
                    <p className="text-xs opacity-80">View detailed reports</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card className="card-artist">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Transaction History</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-secondary text-white hover:bg-secondary/30">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-secondary text-white hover:bg-secondary/30">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10 bg-secondary border-secondary text-white"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-artist-neon-purple/20 rounded-xl flex items-center justify-center">
                        {getTransactionIcon(transaction.type, transaction.method)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{transaction.title}</p>
                        <p className="text-sm text-muted-foreground">{transaction.client}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{transaction.method}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      {transaction.bookingId && (
                        <p className="text-xs text-muted-foreground mt-1">{transaction.bookingId}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-artist-gold" />
                Pending Payments ({pendingPayments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div key={payment.id} className="p-6 bg-secondary/20 rounded-xl border border-orange-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-white text-lg">{payment.eventTitle}</h4>
                        <p className="text-artist-gold font-medium">{payment.client}</p>
                      </div>
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount Due</p>
                        <p className="text-2xl font-bold text-artist-gold">₹{payment.amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Due Date</p>
                        <p className="text-lg font-medium text-white">
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="btn-artist flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Send Reminder
                      </Button>
                      <Button variant="outline" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                        <Eye className="w-4 h-4 mr-2" />
                        View Invoice
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <Card className="card-artist">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Payment Methods</CardTitle>
                <Button className="btn-artist">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="p-6 bg-secondary/20 rounded-xl border border-secondary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{method.icon}</div>
                        <div>
                          <h4 className="font-bold text-white text-lg">{method.name}</h4>
                          <p className="text-muted-foreground">{method.account}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={method.status === 'active' ? 'status-confirmed' : 'badge-artist'}>
                          {method.status}
                        </Badge>
                        <Button variant="outline" size="sm" className="border-secondary text-white hover:bg-secondary/30">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
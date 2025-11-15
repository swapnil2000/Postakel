import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Building, 
  Receipt, 
  Users, 
  Printer, 
  Save, 
  Check,
  Settings as SettingsIcon,
  IndianRupee,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Link,
  Zap,
  Smartphone,
  CreditCard
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('business');
  const [saved, setSaved] = useState(false);

  const [businessInfo, setBusinessInfo] = useState({
    name: 'Spice Garden Restaurant',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    phone: '+91 80 2345 6789',
    email: 'info@spicegarden.com',
    gstNumber: '29ABCDE1234F1Z5',
    fssaiNumber: '12345678901234'
  });

  const [taxSettings, setTaxSettings] = useState({
    gstRate: '18',
    serviceCharge: '10',
    enableServiceCharge: true,
    enableGST: true
  });

  const [printerSettings, setPrinterSettings] = useState({
    kotPrinter: 'Kitchen Printer 1',
    billPrinter: 'Receipt Printer 1',
    enableAutoPrint: true,
    paperSize: 'A4'
  });

  const [userRoles] = useState([
    { id: '1', name: 'Admin', email: 'admin@spicegarden.com', role: 'Administrator' },
    { id: '2', name: 'Manager', email: 'manager@spicegarden.com', role: 'Manager' },
    { id: '3', name: 'Cashier', email: 'cashier@spicegarden.com', role: 'Cashier' },
    { id: '4', name: 'Waiter', email: 'waiter@spicegarden.com', role: 'Staff' }
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 bg-background p-4 space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">Settings</h1>
          <p className="text-muted-foreground">Manage your restaurant configuration</p>
        </div>
        <Button 
          onClick={handleSave} 
          className={`bg-primary hover:bg-primary/90 transition-all duration-200 ${saved ? 'bg-green-600' : ''}`}
        >
          {saved ? <Check className="mr-2" size={18} /> : <Save className="mr-2" size={18} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building size={16} />
            Business
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Receipt size={16} />
            Tax & GST
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="printer" className="flex items-center gap-2">
            <Printer size={16} />
            Printer Setup
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link size={16} />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Building size={20} />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Restaurant Name</Label>
                  <Input
                    value={businessInfo.name}
                    onChange={(e) => setBusinessInfo({...businessInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      className="pl-10"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground" size={16} />
                  <Textarea
                    className="pl-10 min-h-20"
                    value={businessInfo.address}
                    onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      type="email"
                      className="pl-10"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({...businessInfo, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GST Number</Label>
                  <Input
                    value={businessInfo.gstNumber}
                    onChange={(e) => setBusinessInfo({...businessInfo, gstNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>FSSAI License Number</Label>
                <Input
                  value={businessInfo.fssaiNumber}
                  onChange={(e) => setBusinessInfo({...businessInfo, fssaiNumber: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Receipt size={20} />
                Tax Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">Enable GST</h4>
                      <p className="text-sm text-muted-foreground">Apply GST to all orders</p>
                    </div>
                    <Switch
                      checked={taxSettings.enableGST}
                      onCheckedChange={(checked) => setTaxSettings({...taxSettings, enableGST: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>GST Rate (%)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={taxSettings.gstRate}
                        onChange={(e) => setTaxSettings({...taxSettings, gstRate: e.target.value})}
                        disabled={!taxSettings.enableGST}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">Service Charge</h4>
                      <p className="text-sm text-muted-foreground">Add service charge to orders</p>
                    </div>
                    <Switch
                      checked={taxSettings.enableServiceCharge}
                      onCheckedChange={(checked) => setTaxSettings({...taxSettings, enableServiceCharge: checked})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Service Charge (%)</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={taxSettings.serviceCharge}
                        onChange={(e) => setTaxSettings({...taxSettings, serviceCharge: e.target.value})}
                        disabled={!taxSettings.enableServiceCharge}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Tax Calculation Preview</h5>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Item Total:</span>
                      <span>₹1,000.00</span>
                    </div>
                    {taxSettings.enableServiceCharge && (
                      <div className="flex justify-between">
                        <span>Service Charge ({taxSettings.serviceCharge}%):</span>
                        <span>₹{(1000 * parseFloat(taxSettings.serviceCharge) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {taxSettings.enableGST && (
                      <div className="flex justify-between">
                        <span>GST ({taxSettings.gstRate}%):</span>
                        <span>₹{(1000 * parseFloat(taxSettings.gstRate) / 100).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold border-t border-blue-300 pt-1">
                      <span>Total:</span>
                      <span>₹{(1000 + 
                        (taxSettings.enableServiceCharge ? 1000 * parseFloat(taxSettings.serviceCharge) / 100 : 0) +
                        (taxSettings.enableGST ? 1000 * parseFloat(taxSettings.gstRate) / 100 : 0)
                      ).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-primary">
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  User Management
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Add User
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRoles.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select defaultValue={user.role.toLowerCase()}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administrator">Administrator</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="cashier">Cashier</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Card className="mt-6 bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <h5 className="font-medium text-yellow-900 mb-2">Role Permissions</h5>
                  <div className="text-sm text-yellow-800 space-y-1">
                    <div><strong>Administrator:</strong> Full access to all features</div>
                    <div><strong>Manager:</strong> Access to reports, menu management, and settings</div>
                    <div><strong>Cashier:</strong> Access to POS billing and basic reports</div>
                    <div><strong>Staff:</strong> Access to POS billing only</div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="printer" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Printer size={20} />
                Printer Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>KOT Printer</Label>
                    <Select value={printerSettings.kotPrinter} onValueChange={(value) => setPrinterSettings({...printerSettings, kotPrinter: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kitchen Printer 1">Kitchen Printer 1</SelectItem>
                        <SelectItem value="Kitchen Printer 2">Kitchen Printer 2</SelectItem>
                        <SelectItem value="Disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Bill Printer</Label>
                    <Select value={printerSettings.billPrinter} onValueChange={(value) => setPrinterSettings({...printerSettings, billPrinter: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Receipt Printer 1">Receipt Printer 1</SelectItem>
                        <SelectItem value="Receipt Printer 2">Receipt Printer 2</SelectItem>
                        <SelectItem value="Disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Paper Size</Label>
                    <Select value={printerSettings.paperSize} onValueChange={(value) => setPrinterSettings({...printerSettings, paperSize: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A4">A4</SelectItem>
                        <SelectItem value="Thermal 80mm">Thermal 80mm</SelectItem>
                        <SelectItem value="Thermal 58mm">Thermal 58mm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto Print</h4>
                      <p className="text-sm text-muted-foreground">Automatically print orders</p>
                    </div>
                    <Switch
                      checked={printerSettings.enableAutoPrint}
                      onCheckedChange={(checked) => setPrinterSettings({...printerSettings, enableAutoPrint: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1">
                  <Printer className="mr-2" size={16} />
                  Test KOT Print
                </Button>
                <Button variant="outline" className="flex-1">
                  <Printer className="mr-2" size={16} />
                  Test Bill Print
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Link size={20} />
                Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* WhatsApp Integration */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <MessageCircle size={20} />
                    WhatsApp Business API
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input placeholder="Enter WhatsApp API key" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input placeholder="+91 XXXXX XXXXX" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <h4 className="font-medium">Enable WhatsApp Marketing</h4>
                      <p className="text-sm text-muted-foreground">Send order confirmations and promotions</p>
                    </div>
                    <Switch />
                  </div>
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="mr-2" size={16} />
                    Test WhatsApp Connection
                  </Button>
                </CardContent>
              </Card>

              {/* Zomato Integration */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Zap size={20} />
                    Zomato Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Restaurant ID</Label>
                      <Input placeholder="Enter Zomato restaurant ID" />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input placeholder="Enter Zomato API key" type="password" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto-accept Orders</h4>
                      <p className="text-sm text-muted-foreground">Automatically accept Zomato orders</p>
                    </div>
                    <Switch />
                  </div>
                  <Button className="w-full" variant="outline">
                    <Zap className="mr-2" size={16} />
                    Test Zomato Connection
                  </Button>
                </CardContent>
              </Card>

              {/* Swiggy Integration */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <Smartphone size={20} />
                    Swiggy Integration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Partner Code</Label>
                      <Input placeholder="Enter Swiggy partner code" />
                    </div>
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input placeholder="Enter Swiggy API key" type="password" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto-accept Orders</h4>
                      <p className="text-sm text-muted-foreground">Automatically accept Swiggy orders</p>
                    </div>
                    <Switch />
                  </div>
                  <Button className="w-full" variant="outline">
                    <Smartphone className="mr-2" size={16} />
                    Test Swiggy Connection
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Gateway */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <CreditCard size={20} />
                    Payment Gateway
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gateway Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="razorpay">Razorpay</SelectItem>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="stripe">Stripe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Merchant ID</Label>
                      <Input placeholder="Enter merchant ID" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <Input placeholder="Enter API key" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Secret Key</Label>
                      <Input placeholder="Enter secret key" type="password" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <h4 className="font-medium">Enable Online Payments</h4>
                      <p className="text-sm text-muted-foreground">Accept online payments for QR orders</p>
                    </div>
                    <Switch />
                  </div>
                  <Button className="w-full" variant="outline">
                    <CreditCard className="mr-2" size={16} />
                    Test Payment Gateway
                  </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
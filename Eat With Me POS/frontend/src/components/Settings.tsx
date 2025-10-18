import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useAppContext, countryCurrencyMap, TaxRule } from '../contexts/AppContext';
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
  CreditCard,
  Globe,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Percent,
  AlertTriangle
} from 'lucide-react';

export function Settings() {
  const { settings, updateSettings, addTaxRule, updateTaxRule, deleteTaxRule, calculateTaxes } = useAppContext();
  const [activeTab, setActiveTab] = useState('business');
  const [saved, setSaved] = useState(false);
  const [whatsappSettings, setWhatsappSettings] = useState({
    apiKey: settings.whatsappApiKey,
    phoneNumber: settings.whatsappPhoneNumber,
    enableMarketing: false
  });

  const countries = Object.keys(countryCurrencyMap);

  const [businessInfo, setBusinessInfo] = useState({
    name: settings.restaurantName,
    address: settings.businessAddress,
    phone: settings.businessPhone,
    email: settings.businessEmail,
    taxNumber: settings.taxNumber,
    fssaiNumber: settings.fssaiNumber
  });

  const [newTaxRule, setNewTaxRule] = useState<Partial<TaxRule>>({
    name: '',
    rate: 0,
    applicableCategories: [],
    description: '',
    isActive: true
  });

  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [editingTaxId, setEditingTaxId] = useState<string | null>(null);

  const taxCategories = [
    { value: 'food', label: 'Food Items' },
    { value: 'beverage', label: 'Non-Alcoholic Beverages' },
    { value: 'bar', label: 'Alcoholic Beverages' },
    { value: 'all', label: 'All Categories' }
  ];

  const handleAddTaxRule = () => {
    if (!newTaxRule.name || !newTaxRule.rate || !newTaxRule.applicableCategories?.length) {
      return;
    }

    const taxRule: TaxRule = {
      id: editingTaxId || `tax_${Date.now()}`,
      name: newTaxRule.name,
      rate: newTaxRule.rate,
      applicableCategories: newTaxRule.applicableCategories,
      description: newTaxRule.description || '',
      isActive: newTaxRule.isActive ?? true
    };

    if (editingTaxId) {
      updateTaxRule(editingTaxId, taxRule);
    } else {
      addTaxRule(taxRule);
    }

    setNewTaxRule({
      name: '',
      rate: 0,
      applicableCategories: [],
      description: '',
      isActive: true
    });
    setShowTaxDialog(false);
    setEditingTaxId(null);
  };

  const handleEditTaxRule = (tax: TaxRule) => {
    setNewTaxRule(tax);
    setEditingTaxId(tax.id);
    setShowTaxDialog(true);
  };

  const handleDeleteTaxRule = (id: string) => {
    deleteTaxRule(id);
  };

  const toggleTaxCategory = (category: string) => {
    const currentCategories = newTaxRule.applicableCategories || [];
    const updated = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    setNewTaxRule(prev => ({ ...prev, applicableCategories: updated }));
  };

  const [printerSettings, setPrinterSettings] = useState({
    kotPrinter: 'Kitchen Printer 1',
    billPrinter: 'Receipt Printer 1',
    enableAutoPrint: true,
    paperSize: 'A4'
  });

  const [userRoles] = useState([
    { id: '1', name: 'Admin', email: `admin@${settings.restaurantName.toLowerCase().replace(/\s+/g, '')}.com`, role: 'Administrator' },
    { id: '2', name: 'Manager', email: `manager@${settings.restaurantName.toLowerCase().replace(/\s+/g, '')}.com`, role: 'Manager' },
    { id: '3', name: 'Cashier', email: `cashier@${settings.restaurantName.toLowerCase().replace(/\s+/g, '')}.com`, role: 'Cashier' },
    { id: '4', name: 'Waiter', email: `waiter@${settings.restaurantName.toLowerCase().replace(/\s+/g, '')}.com`, role: 'Staff' }
  ]);

  const handleSave = () => {
    // Update app settings with all business information
    updateSettings({
      restaurantName: businessInfo.name,
      businessAddress: businessInfo.address,
      businessPhone: businessInfo.phone,
      businessEmail: businessInfo.email,
      taxNumber: businessInfo.taxNumber,
      fssaiNumber: businessInfo.fssaiNumber,
      whatsappApiKey: whatsappSettings.apiKey,
      whatsappPhoneNumber: whatsappSettings.phoneNumber
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCountryChange = (country: string) => {
    const countryData = countryCurrencyMap[country];
    updateSettings({
      country,
      currency: countryData.currency,
      currencySymbol: countryData.symbol
    });
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
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building size={16} />
            Business
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-2">
            <Receipt size={16} />
            Tax Management
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Select value={settings.country} onValueChange={handleCountryChange}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            <div className="flex items-center gap-2">
                              {country}
                              <span className="text-muted-foreground text-sm">
                                ({countryCurrencyMap[country].currency})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      className="pl-10"
                      value={`${settings.currency} (${settings.currencySymbol})`}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Currency is automatically set based on selected country</p>
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
                  <Label>
                    {settings.country === 'India' ? 'GST Number' : 
                     ['United Kingdom', 'Germany', 'France'].includes(settings.country) ? 'VAT Number' :
                     'Tax Number'}
                  </Label>
                  <Input
                    value={businessInfo.taxNumber}
                    onChange={(e) => setBusinessInfo({...businessInfo, taxNumber: e.target.value})}
                    placeholder={
                      settings.country === 'India' ? 'e.g., 29ABCDE1234F1Z5' :
                      ['United Kingdom', 'Germany', 'France'].includes(settings.country) ? 'e.g., GB123456789' :
                      'Enter your tax identification number'
                    }
                  />
                </div>
              </div>

              {settings.country === 'India' && (
                <div className="space-y-2">
                  <Label>FSSAI License Number</Label>
                  <Input
                    value={businessInfo.fssaiNumber}
                    onChange={(e) => setBusinessInfo({...businessInfo, fssaiNumber: e.target.value})}
                    placeholder="e.g., 12345678901234"
                  />
                </div>
              )}
              
              {settings.country !== 'India' && (
                <div className="space-y-2">
                  <Label>Business License Number</Label>
                  <Input
                    value={businessInfo.fssaiNumber}
                    onChange={(e) => setBusinessInfo({...businessInfo, fssaiNumber: e.target.value})}
                    placeholder="Enter your business license number"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-primary">
                <div className="flex items-center gap-2">
                  <Percent size={20} />
                  Tax Management
                </div>
                <Dialog open={showTaxDialog} onOpenChange={setShowTaxDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => {
                        setNewTaxRule({
                          name: '',
                          rate: 0,
                          applicableCategories: [],
                          description: '',
                          isActive: true
                        });
                        setEditingTaxId(null);
                      }}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Tax Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTaxId ? 'Edit Tax Rule' : 'Add New Tax Rule'}
                      </DialogTitle>
                      <DialogDescription>
                        Create custom tax rules for different categories of items
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tax Name</Label>
                        <Input
                          placeholder="e.g., GST, VAT, CGST, SGST, Cess"
                          value={newTaxRule.name || ''}
                          onChange={(e) => setNewTaxRule(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax Rate (%)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newTaxRule.rate || ''}
                          onChange={(e) => setNewTaxRule(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description (Optional)</Label>
                        <Input
                          placeholder="Brief description of this tax"
                          value={newTaxRule.description || ''}
                          onChange={(e) => setNewTaxRule(prev => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Applicable Categories</Label>
                        <div className="flex flex-wrap gap-2">
                          {taxCategories.map(category => (
                            <button
                              key={category.value}
                              type="button"
                              onClick={() => toggleTaxCategory(category.value)}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                                newTaxRule.applicableCategories?.includes(category.value)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {category.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newTaxRule.isActive ?? true}
                          onCheckedChange={(checked) => setNewTaxRule(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label>Active</Label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowTaxDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleAddTaxRule}>
                          {editingTaxId ? 'Update' : 'Add'} Tax Rule
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {settings.taxRules.map(tax => (
                  <div key={tax.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{tax.name}</h4>
                        <Badge variant={tax.isActive ? "default" : "secondary"}>
                          {tax.rate}%
                        </Badge>
                        <div className="flex gap-1">
                          {tax.applicableCategories.map(cat => (
                            <Badge key={cat} variant="outline" className="text-xs">
                              {taxCategories.find(c => c.value === cat)?.label || cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {tax.description && (
                        <p className="text-sm text-muted-foreground mt-1">{tax.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={tax.isActive}
                        onCheckedChange={(checked) => updateTaxRule(tax.id, { isActive: checked })}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditTaxRule(tax)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTaxRule(tax.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {settings.taxRules.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No tax rules configured</p>
                    <p className="text-sm">Add your first tax rule to get started</p>
                  </div>
                )}
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h5 className="font-medium text-blue-900 mb-3">Tax Calculation Preview</h5>
                  <div className="text-sm text-blue-800 space-y-2">
                    <div className="flex justify-between">
                      <span>Item Total:</span>
                      <span>{settings.currencySymbol}1,000.00</span>
                    </div>
                    
                    {(() => {
                      const { taxes, totalTax } = calculateTaxes(1000, 'food');
                      return (
                        <>
                          {taxes.map(tax => (
                            <div key={tax.name} className="flex justify-between">
                              <span>{tax.name} ({tax.rate}%):</span>
                              <span>{settings.currencySymbol}{tax.amount.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-semibold border-t border-blue-300 pt-2">
                            <span>Total:</span>
                            <span>{settings.currencySymbol}{(1000 + totalTax).toFixed(2)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">* Preview shows taxes for food items</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff-redirect" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="w-16 h-16 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Staff & User Management</h3>
              <p className="text-muted-foreground mb-4">
                All staff management, roles, and permissions have been moved to the dedicated Staff Management module.
              </p>
              <Button 
                onClick={() => window.location.href = '#staff'} 
                className="bg-primary hover:bg-primary/90"
              >
                Go to Staff Management
              </Button>
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
                      <Input 
                        placeholder="Enter WhatsApp API key" 
                        type="password"
                        value={whatsappSettings.apiKey}
                        onChange={(e) => setWhatsappSettings({...whatsappSettings, apiKey: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input 
                        placeholder="+91 XXXXX XXXXX"
                        value={whatsappSettings.phoneNumber}
                        onChange={(e) => setWhatsappSettings({...whatsappSettings, phoneNumber: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <h4 className="font-medium">Enable WhatsApp Marketing</h4>
                      <p className="text-sm text-muted-foreground">Send order confirmations and promotions</p>
                    </div>
                    <Switch 
                      checked={whatsappSettings.enableMarketing}
                      onCheckedChange={(checked) => setWhatsappSettings({...whatsappSettings, enableMarketing: checked})}
                    />
                  </div>
                  <Button className="w-full" variant="outline">
                    <MessageCircle className="mr-2" size={16} />
                    Test WhatsApp Connection
                  </Button>
                  {whatsappSettings.apiKey && whatsappSettings.phoneNumber && (
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✅ WhatsApp API is configured and ready for marketing campaigns
                      </p>
                    </div>
                  )}
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
                    Payment Gateway Settings
                  </CardTitle>
                  <p className="text-sm text-blue-700 mt-1">
                    Configure payment processing for QR orders, online orders, and third-party deliveries
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Primary Gateway */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-blue-800">Primary Payment Gateway</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Gateway Provider</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="razorpay">Razorpay (India)</SelectItem>
                            <SelectItem value="payu">PayU (India)</SelectItem>
                            <SelectItem value="phonepe">PhonePe (India)</SelectItem>
                            <SelectItem value="stripe">Stripe (Global)</SelectItem>
                            <SelectItem value="paypal">PayPal (Global)</SelectItem>
                            <SelectItem value="square">Square (US/UK)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Environment</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                            <SelectItem value="production">Production (Live)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Merchant ID / Account ID</Label>
                        <Input placeholder="Enter merchant/account ID" />
                      </div>
                      <div className="space-y-2">
                        <Label>API Key / Public Key</Label>
                        <Input placeholder="Enter API/public key" type="password" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Secret Key / Private Key</Label>
                        <Input placeholder="Enter secret/private key" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label>Webhook Secret</Label>
                        <Input placeholder="Enter webhook secret" type="password" />
                      </div>
                    </div>
                  </div>

                  {/* UPI & Local Payment Methods */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-blue-800">UPI & Local Payment Methods</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h5 className="font-medium">UPI Payments</h5>
                          <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h5 className="font-medium">QR Code Payments</h5>
                          <p className="text-xs text-muted-foreground">Static & Dynamic QR</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h5 className="font-medium">Card Payments</h5>
                          <p className="text-xs text-muted-foreground">Credit/Debit Cards</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Third-party Settlement */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-blue-800">Third-party App Settlements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h5 className="font-medium">Zomato Settlements</h5>
                          <p className="text-xs text-muted-foreground">Auto-reconcile payments</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <h5 className="font-medium">Swiggy Settlements</h5>
                          <p className="text-xs text-muted-foreground">Auto-reconcile payments</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  {/* Payment Fees & Charges */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-blue-800">Fee Configuration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Gateway Fee (%)</Label>
                        <Input placeholder="2.5" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fixed Fee Amount</Label>
                        <Input placeholder="2.00" type="number" step="0.1" />
                      </div>
                      <div className="space-y-2">
                        <Label>Pass Fee to Customer</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No, Restaurant Bears</SelectItem>
                            <SelectItem value="yes">Yes, Customer Pays</SelectItem>
                            <SelectItem value="split">Split 50-50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button className="flex-1" variant="outline">
                      <CreditCard className="mr-2" size={16} />
                      Test Connection
                    </Button>
                    <Button className="flex-1">
                      <Check className="mr-2" size={16} />
                      Save Configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
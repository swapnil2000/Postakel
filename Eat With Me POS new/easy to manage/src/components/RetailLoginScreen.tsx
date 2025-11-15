import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Store, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ShoppingCart,
  Package,
  Users,
  CheckCircle
} from 'lucide-react';

interface RetailLoginScreenProps {
  onLogin: (role: string) => void;
}

export function RetailLoginScreen({ onLogin }: RetailLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('owner');
  const [loginData, setLoginData] = useState({
    mobile: '',
    email: '',
    password: '',
    name: '',
    shopName: '',
    otp: ''
  });
  const [loginMethod, setLoginMethod] = useState('password');

  const handleLogin = () => {
    onLogin(selectedRole);
  };

  const roles = [
    {
      id: 'owner',
      label: 'Shop Owner',
      description: 'Full access to all features',
      icon: Store,
      color: 'bg-primary text-white'
    },
    {
      id: 'staff',
      label: 'Staff Member',
      description: 'Limited access for daily operations',
      icon: Users,
      color: 'bg-secondary text-secondary-foreground'
    }
  ];

  return (
    <div className="min-h-screen bg-retail-gradient flex items-center justify-center p-4">
      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce-gentle">
          <ShoppingCart className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute top-32 right-16 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <Package className="w-6 h-6 text-white/15" />
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <Store className="w-10 h-10 text-white/25" />
        </div>
        <div className="absolute bottom-24 right-12 animate-bounce-gentle" style={{ animationDelay: '1.5s' }}>
          <ShoppingCart className="w-12 h-12 text-white/20" />
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary">RetailPOS</h1>
          <p className="text-muted-foreground">Smart POS & Inventory Management</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <CheckCircle className="w-3 h-3 mr-1" />
              Trusted by 50,000+ shops
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-center">Select Your Role</h3>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all tap-zone ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="text-center space-y-2">
                    <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center mx-auto`}>
                      <role.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Tabs value={loginMethod} onValueChange={setLoginMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP Login</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    className="pl-12 h-14 bg-input-background tap-zone text-lg"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({...loginData, mobile: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 bg-input-background tap-zone text-lg"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-10 w-10 p-0 tap-zone"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg tap-zone-large text-lg font-medium"
                >
                  <Store className="w-5 h-5 mr-2" />
                  Login to Shop
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full text-primary hover:bg-primary/10 tap-zone"
                >
                  Forgot Password?
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="otp" className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    className="pl-12 h-14 bg-input-background tap-zone text-lg"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({...loginData, mobile: e.target.value})}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-14 border-primary text-primary hover:bg-primary hover:text-white tap-zone-large text-lg"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Send OTP
                </Button>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="h-14 bg-input-background tap-zone text-lg text-center tracking-widest"
                    maxLength={6}
                    value={loginData.otp}
                    onChange={(e) => setLoginData({...loginData, otp: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-14 bg-primary hover:bg-primary/90 shadow-lg tap-zone-large text-lg font-medium"
                  disabled={loginData.otp.length !== 6}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verify & Login
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New to RetailPOS?</span>
              </div>
            </div>

            <Button 
              variant="outline"
              className="w-full h-14 border-2 border-primary text-primary hover:bg-primary hover:text-white tap-zone-large text-lg font-medium"
            >
              <Store className="w-5 h-5 mr-2" />
              Create Account
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              Perfect for Kirana Shops • Medical Stores • Vegetable Markets
            </p>
            <div className="flex items-center justify-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <div key={star} className="w-4 h-4 text-yellow-400">⭐</div>
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.8/5 Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
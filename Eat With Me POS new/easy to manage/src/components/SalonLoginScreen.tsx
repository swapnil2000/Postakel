import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Sparkles, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Heart,
  Star
} from 'lucide-react';

interface SalonLoginScreenProps {
  onLogin: () => void;
}

export function SalonLoginScreen({ onLogin }: SalonLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    businessName: ''
  });

  const handleLogin = () => {
    onLogin();
  };

  return (
    <div className="min-h-screen bg-salon-gradient flex items-center justify-center p-4">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-bounce-gentle">
          <Sparkles className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-40 right-16 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <Heart className="w-6 h-6 text-white/20" />
        </div>
        <div className="absolute bottom-32 left-20 animate-bounce-gentle" style={{ animationDelay: '1s' }}>
          <Star className="w-10 h-10 text-white/25" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce-gentle" style={{ animationDelay: '1.5s' }}>
          <Sparkles className="w-12 h-12 text-white/20" />
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
            SalonPOS Pro
          </h1>
          <p className="text-muted-foreground">Premium Beauty & Wellness Management</p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email or Phone"
                    className="pl-10 h-12 bg-input-background"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-10 pr-10 h-12 bg-input-background"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Login to Salon
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={handleLogin}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Login via OTP
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full text-primary hover:bg-primary/10"
                >
                  Forgot Password?
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Your Name"
                    className="h-12 bg-input-background"
                    value={loginData.name}
                    onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Business Name"
                    className="h-12 bg-input-background"
                    value={loginData.businessName}
                    onChange={(e) => setLoginData({...loginData, businessName: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    className="pl-10 h-12 bg-input-background"
                    value={loginData.phone}
                    onChange={(e) => setLoginData({...loginData, phone: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="pl-10 h-12 bg-input-background"
                    value={loginData.email}
                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create Password"
                    className="pl-10 pr-10 h-12 bg-input-background"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-12 bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Start Your Salon Journey
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-center text-xs text-muted-foreground">
              Trusted by 10,000+ Beauty Professionals worldwide
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-1">4.9/5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
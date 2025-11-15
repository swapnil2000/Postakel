import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Palette,
  Music,
  Users,
  UserCheck,
  CheckCircle,
  Star,
  Heart,
  Sparkles
} from 'lucide-react';

interface ClassManagementLoginProps {
  onLogin: (role: string) => void;
}

export function ClassManagementLogin({ onLogin }: ClassManagementLoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('owner');
  const [loginData, setLoginData] = useState({
    mobile: '',
    email: '',
    password: '',
    name: '',
    otp: ''
  });
  const [loginMethod, setLoginMethod] = useState('password');

  const handleLogin = () => {
    onLogin(selectedRole);
  };

  const roles = [
    {
      id: 'owner',
      label: 'Class Owner',
      description: 'Manage everything',
      icon: GraduationCap,
      color: 'bg-primary text-white',
      emoji: '🎨'
    },
    {
      id: 'instructor',
      label: 'Instructor',
      description: 'Teach & track progress',
      icon: UserCheck,
      color: 'bg-creative-mint text-gray-800',
      emoji: '🎵'
    },
    {
      id: 'student',
      label: 'Student',
      description: 'Learn & practice',
      icon: Users,
      color: 'bg-yellow-400 text-gray-800',
      emoji: '🎭'
    },
    {
      id: 'parent',
      label: 'Parent',
      description: 'Monitor child progress',
      icon: Heart,
      color: 'bg-pink-400 text-white',
      emoji: '👨‍👩‍👧‍👦'
    }
  ];

  return (
    <div className="min-h-screen bg-creative-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Creative Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float">
          <Palette className="w-12 h-12 text-white/20" />
        </div>
        <div className="absolute top-32 right-16 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
          <Music className="w-8 h-8 text-white/15" />
        </div>
        <div className="absolute bottom-32 left-20 animate-wiggle" style={{ animationDelay: '1s' }}>
          <GraduationCap className="w-14 h-14 text-white/25" />
        </div>
        <div className="absolute bottom-24 right-12 animate-float" style={{ animationDelay: '1.5s' }}>
          <Star className="w-10 h-10 text-white/20" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-spin-slow">
          <Sparkles className="w-6 h-6 text-white/10" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce-gentle" style={{ animationDelay: '2s' }}>
          <Heart className="w-8 h-8 text-white/15" />
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-sm card-creative">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-rainbow-gradient rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl animate-pulse-scale">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-creative-mint bg-clip-text text-transparent">
            ClassCraft
          </h1>
          <p className="text-muted-foreground">Creative Learning Management</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="badge-creative">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 10,000+ classes
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <h3 className="font-medium text-center">Who are you?</h3>
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all tap-zone card-hover ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5 scale-105'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl mb-2">{role.emoji}</div>
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
            <TabsList className="grid w-full grid-cols-2 rounded-2xl">
              <TabsTrigger value="password" className="rounded-xl">Password</TabsTrigger>
              <TabsTrigger value="otp" className="rounded-xl">OTP Login</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    className="pl-12 h-14 bg-input-background tap-zone text-lg rounded-2xl border-2"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({...loginData, mobile: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 bg-input-background tap-zone text-lg rounded-2xl border-2"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-10 w-10 p-0 tap-zone rounded-xl"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-14 btn-creative tap-zone-large text-lg font-medium shadow-lg"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Enter ClassCraft
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full text-primary hover:bg-primary/10 tap-zone rounded-xl"
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
                    className="pl-12 h-14 bg-input-background tap-zone text-lg rounded-2xl border-2"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({...loginData, mobile: e.target.value})}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-14 border-primary text-primary hover:bg-primary hover:text-white tap-zone-large text-lg rounded-2xl border-2"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Send Magic Code ✨
                </Button>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit magic code"
                    className="h-14 bg-input-background tap-zone text-lg text-center tracking-widest rounded-2xl border-2"
                    maxLength={6}
                    value={loginData.otp}
                    onChange={(e) => setLoginData({...loginData, otp: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-14 btn-creative tap-zone-large text-lg font-medium shadow-lg"
                  disabled={loginData.otp.length !== 6}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verify & Enter
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
                <span className="bg-card px-2 text-muted-foreground">New to ClassCraft?</span>
              </div>
            </div>

            <Button 
              variant="outline"
              className="w-full h-14 border-2 border-primary text-primary hover:bg-primary hover:text-white tap-zone-large text-lg font-medium rounded-2xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Join the Creative Journey
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">
              Perfect for Art Schools • Music Classes • Dance Studios • Tuition Centers
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">4.9/5 Rating</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
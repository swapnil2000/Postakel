import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Mic2, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Music,
  Users,
  UserCheck,
  CheckCircle,
  Star,
  Crown,
  Sparkles,
  Instagram,
  Chrome
} from 'lucide-react';

interface ArtistLoginScreenProps {
  onLogin: (role: string) => void;
}

export function ArtistLoginScreen({ onLogin }: ArtistLoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('artist');
  const [loginData, setLoginData] = useState({
    mobile: '',
    email: '',
    password: '',
    otp: ''
  });
  const [loginMethod, setLoginMethod] = useState('password');

  const handleLogin = () => {
    onLogin(selectedRole);
  };

  const roles = [
    {
      id: 'artist',
      label: 'Artist',
      description: 'Performers & Creators',
      icon: Mic2,
      color: 'bg-purple-gradient text-white',
      emoji: '🎤'
    },
    {
      id: 'agency',
      label: 'Agency',
      description: 'Talent Management',
      icon: Users,
      color: 'bg-gold-gradient text-black',
      emoji: '🎭'
    },
    {
      id: 'client',
      label: 'Client',
      description: 'Book Artists',
      icon: UserCheck,
      color: 'bg-stage-gradient text-white',
      emoji: '🎉'
    }
  ];

  return (
    <div className="min-h-screen bg-artist-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Stage Lighting Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stage-light absolute top-20 left-10 animate-stage-lights"></div>
        <div className="stage-light absolute top-32 right-16 animate-stage-lights" style={{ animationDelay: '1s' }}></div>
        <div className="stage-light absolute bottom-32 left-20 animate-stage-lights" style={{ animationDelay: '2s' }}></div>
        <div className="stage-light absolute bottom-24 right-12 animate-stage-lights" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating Stage Elements */}
        <div className="absolute top-40 left-1/4 animate-float opacity-20">
          <Music className="w-16 h-16 text-artist-gold" />
        </div>
        <div className="absolute bottom-40 right-1/4 animate-bounce-gentle opacity-20" style={{ animationDelay: '1s' }}>
          <Star className="w-12 h-12 text-artist-neon-purple" />
        </div>
        <div className="absolute top-1/2 right-20 animate-spin-slow opacity-15">
          <Crown className="w-20 h-20 text-artist-gold" />
        </div>
      </div>

      <Card className="w-full max-w-md mx-auto shadow-2xl border-0 card-artist backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-24 h-24 bg-neon-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-neon-glow">
            <Mic2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-artist-neon-purple to-artist-gold bg-clip-text text-transparent">
            ArtistHub
          </h1>
          <p className="text-muted-foreground">Where Talent Meets Opportunity</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className="badge-artist">
              <Star className="w-3 h-3 mr-1" />
              Trusted by 50k+ artists
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="font-bold text-center text-neon">Choose Your Role</h3>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all tap-zone card-hover ${
                    selectedRole === role.id
                      ? 'border-artist-neon-purple bg-artist-neon-purple/10 scale-105 animate-neon-glow'
                      : 'border-border hover:border-artist-neon-purple/50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl mb-2">{role.emoji}</div>
                    <div>
                      <p className="font-bold text-sm text-white">{role.label}</p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Tabs value={loginMethod} onValueChange={setLoginMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-secondary rounded-2xl">
              <TabsTrigger value="password" className="rounded-xl text-white">Password</TabsTrigger>
              <TabsTrigger value="otp" className="rounded-xl text-white">OTP Login</TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    className="pl-12 h-14 bg-input-background tap-zone text-lg rounded-2xl border-2 border-secondary text-white"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({...loginData, mobile: e.target.value})}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="pl-12 pr-12 h-14 bg-input-background tap-zone text-lg rounded-2xl border-2 border-secondary text-white"
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
                  className="w-full h-14 btn-artist tap-zone-large text-lg font-bold shadow-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Enter the Stage
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full text-artist-neon-purple hover:bg-artist-neon-purple/10 tap-zone rounded-xl"
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
                    className="pl-12 h-14 bg-input-background tap-zone text-lg rounded-2xl border-2 border-secondary text-white"
                    value={loginData.mobile}
                    onChange={(e) => setLoginData({...loginData, mobile: e.target.value})}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-14 btn-outline-artist tap-zone-large text-lg border-2"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Send Magic Code ✨
                </Button>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit magic code"
                    className="h-14 bg-input-background tap-zone text-lg text-center tracking-widest rounded-2xl border-2 border-secondary text-white"
                    maxLength={6}
                    value={loginData.otp}
                    onChange={(e) => setLoginData({...loginData, otp: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full h-14 btn-artist tap-zone-large text-lg font-bold shadow-lg"
                  disabled={loginData.otp.length !== 6}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Verify & Enter
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Social Login */}
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Quick Sign In</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                className="h-12 btn-outline-artist border-2"
              >
                <Chrome className="w-5 h-5 mr-2" />
                Google
              </Button>
              <Button 
                variant="outline"
                className="h-12 btn-outline-artist border-2"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">New to ArtistHub?</span>
              </div>
            </div>

            <Button 
              variant="outline"
              className="w-full h-14 btn-gold tap-zone-large text-lg font-bold rounded-2xl"
            >
              <Crown className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-secondary">
            <p className="text-xs text-muted-foreground mb-2">
              Perfect for Artists • Agencies • Event Organizers • Influencers
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 star-filled" />
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
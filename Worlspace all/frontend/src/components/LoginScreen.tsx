import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Building2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  Check,
  Star,
  Crown,
  Zap,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Infinity,
  Lock,
  User,
  Sparkles,
  Shield,
  Brain,
  TrendingUp,
  Clock,
  MessageSquare,
  Database,
  Settings,
  Rocket,
  Target,
  Globe,
  Briefcase,
  ChevronRight,
  Mail,
  Building,
  Bot,
  Layers,
  Lightbulb,
  Gauge,
  Award,
  Laptop,
  Smartphone,
  Headphones,
  CheckCircle2
} from 'lucide-react';

import { useTenant } from './TenantContext';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const { initializeTenant, createTenant, isLoading, error } = useTenant();
  const [activeTab, setActiveTab] = useState('login');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'starter' | 'professional' | 'enterprise'>('starter');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    companySize: '',
    industry: '',
    subdomain: ''
  });
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);

  // Enhanced plans with INR pricing and relevant modules
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₹0',
      period: '/month',
      icon: Users,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgGradient: 'from-green-50 to-emerald-50',
      description: 'Perfect for startups and small teams',
      employees: 'Up to 5 employees',
      features: [
        'Basic attendance tracking',
        'Leave management',
        'Team directory',
        'Basic dashboard',
        'Mobile app access',
        'Community support'
      ],
      recommended: false,
      savings: null
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '₹99',
      period: '/month',
      icon: Zap,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgGradient: 'from-blue-50 to-indigo-50',
      description: 'Most popular for growing businesses',
      employees: 'Up to 10 employees',
      features: [
        'Advanced attendance tracking',
        'Leave management with approvals',
        'Task management & planning',
        'Basic salary management',
        'Announcements',
        'Email support'
      ],
      recommended: true,
      savings: 'Most Popular'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '₹249',
      period: '/month',
      icon: Brain,
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-violet-50',
      description: 'Advanced features for established teams',
      employees: 'Up to 25 employees',
      features: [
        'All Starter features',
        'Performance management',
        'Asset tracking',
        'Advanced reports & analytics',
        'Role-based permissions',
        'Priority support'
      ],
      recommended: false,
      savings: null
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹499',
      period: '/month',
      icon: Crown,
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      bgGradient: 'from-orange-50 to-amber-50',
      description: 'Complete solution for large organizations',
      employees: 'Up to 50 employees',
      features: [
        'All Professional features',
        'AI insights & recommendations',
        'Custom integrations',
        'Advanced security controls',
        'Dedicated account manager',
        '24/7 phone support'
      ],
      recommended: false,
      savings: 'Best Value'
    }
  ];

  const companySizes = [
    '1-10 employees',
    '11-25 employees',
    '26-50 employees',
    '51-100 employees',
    '101-250 employees',
    '250+ employees'
  ];

  const industries = [
    'Technology & Software',
    'Healthcare & Medical',
    'Financial Services',
    'Education & Training',
    'Retail & E-commerce',
    'Manufacturing',
    'Professional Services',
    'Real Estate',
    'Non-profit',
    'Government',
    'Construction',
    'Hospitality',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Check subdomain availability in real-time
    if (field === 'subdomain') {
      if (value.length >= 3) {
        // Simulate API call to check subdomain availability
        setTimeout(() => {
          const unavailable = ['admin', 'api', 'www', 'mail', 'ftp', 'demo', 'test'];
          setSubdomainAvailable(!unavailable.includes(value.toLowerCase()));
        }, 500);
      } else {
        setSubdomainAvailable(null);
      }
    }
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setLoginError('Please enter email and password');
      return;
    }

    setLoginError(null);
    
    // Extract tenant ID from email domain or use demo tenants
    let tenantId = 'demo-company';
    if (formData.email.includes('@techstartup.ai')) {
      tenantId = 'tech-startup';
    } else if (formData.email.includes('@democompany.com')) {
      tenantId = 'demo-company';
    }

    const success = await initializeTenant(tenantId, formData.email, formData.password);
    
    if (success) {
      onLogin();
    } else {
      setLoginError('Invalid credentials or tenant not found');
    }
  };

  const handleCompanyDetails = () => {
    if (!formData.companyName || !formData.email || !formData.password || !formData.subdomain) {
      setLoginError('Please fill in all required fields');
      return;
    }

    if (subdomainAvailable === false) {
      setLoginError('Subdomain is not available');
      return;
    }
    
    setLoginError(null);
    setCompanyData(formData);
    setShowPlanSelection(true);
  };

  const handleCompanySignup = async () => {
    if (!companyData || !selectedPlan) {
      setLoginError('Please complete all signup steps');
      return;
    }
    
    setLoginError(null);

    try {
      await createTenant(
        {
          name: companyData.companyName,
          subdomain: companyData.subdomain,
          plan: selectedPlan,
          settings: {
            industry: companyData.industry,
            companySize: companyData.companySize,
            email: companyData.email
          }
        },
        {
          name: companyData.companyName.split(' ')[0] + ' Admin',
          email: companyData.email,
          password: companyData.password,
          role: 'admin'
        }
      );
      
      onLogin();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Failed to create company');
    }
  };

  const handleBackToCompanyDetails = () => {
    setShowPlanSelection(false);
    setCompanyData(null);
  };

  const aiFeatures = [
    {
      icon: Bot,
      title: 'AI-Powered Automation',
      description: 'Intelligent task automation and workflow optimization',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Analytics',
      description: 'Forecast trends, employee needs, and business insights',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Lightbulb,
      title: 'Smart Recommendations',
      description: 'AI-driven suggestions for better business decisions',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Gauge,
      title: 'Real-time Insights',
      description: 'Live performance metrics and actionable intelligence',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: 'Enterprise-Grade Security',
      description: 'Bank-level encryption and security protocols'
    },
    {
      icon: Laptop,
      title: 'Cross-Platform Access',
      description: 'Web, mobile, and desktop applications'
    },
    {
      icon: Headphones,
      title: '24/7 Expert Support',
      description: 'Dedicated support team for all plans'
    }
  ];

  // If showing plan selection, render the plan selection screen
  if (showPlanSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
        </div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
          {/* Plan Selection Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Crown className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Choose Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Plan</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Select the perfect AI solution for <strong>{companyData?.companyName}</strong>
            </p>
          </div>

          {/* Enhanced Plan Selection */}
          <div className="relative max-w-7xl mx-auto mb-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur opacity-25"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="px-8 pb-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id as any)}
                      className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 group ${
                        selectedPlan === plan.id
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl transform scale-105'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'
                      }`}
                    >
                      {/* Properly spaced badges - no overlap */}
                      {plan.recommended && plan.savings && (
                        <>
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg">
                              <Star className="w-3 h-3 mr-1" />
                              Most Popular
                            </Badge>
                          </div>
                          <div className="absolute top-8 right-2">
                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-2 py-1 text-xs font-bold shadow-lg">
                              Best Value
                            </Badge>
                          </div>
                        </>
                      )}
                      
                      {plan.recommended && !plan.savings && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      {plan.savings && !plan.recommended && (
                        <div className="absolute -top-3 right-2">
                          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-3 py-1 text-xs font-bold shadow-lg">
                            Best Value
                          </Badge>
                        </div>
                      )}
                      
                      <div className="text-center mb-6 mt-4">
                        <div className={`inline-flex p-3 rounded-2xl mb-4 bg-gradient-to-r ${plan.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <plan.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-2xl text-gray-900 mb-3">{plan.name}</h3>
                        <p className="text-gray-600 mb-4 text-base leading-relaxed min-h-[3rem]">{plan.description}</p>
                        <div className="mb-4">
                          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600 ml-2 text-lg">{plan.period}</span>
                        </div>
                        <p className="text-blue-600 font-bold text-base bg-blue-50 px-4 py-2 rounded-xl">{plan.employees}</p>
                      </div>
                      
                      <ul className="space-y-3 mb-6 min-h-[8rem]">
                        {plan.features.slice(0, 5).map((feature, index) => (
                          <li key={index} className="flex items-start gap-3 text-gray-700 text-base">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{feature}</span>
                          </li>
                        ))}
                        {plan.features.length > 5 && (
                          <li className="text-blue-600 font-medium text-base">
                            +{plan.features.length - 5} more features
                          </li>
                        )}
                      </ul>
                      
                      {selectedPlan === plan.id && (
                        <div className="absolute top-4 right-4">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="max-w-2xl mx-auto flex gap-4">
            <Button
              onClick={handleBackToCompanyDetails}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-2 border-gray-300 hover:border-gray-400 font-medium"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              Back to Company Details
            </Button>
            
            <Button
              onClick={handleCompanySignup}
              disabled={isLoading || !selectedPlan}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Your Workspace...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Launch My AI Workspace
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>

          {(loginError || error) && (
            <div className="max-w-2xl mx-auto mt-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 text-center">{loginError || error}</p>
              </div>
            </div>
          )}
          
          <p className="text-gray-500 mt-8 text-center max-w-2xl mx-auto leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy. 
            Start with a 14-day free trial, no credit card required.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-blue-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header with AI Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <div className="relative w-24 h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Building2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Work<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Space</span>
            <span className="relative inline-block">
              <span className="text-2xl align-top text-blue-500 ml-2">AI</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </span>
          </h1>
          
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 font-light">
            The Ultimate AI-Powered Business Management Platform
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 px-6 py-3 text-sm font-semibold shadow-lg">
              <Brain className="w-4 h-4 mr-2" />
              AI-First Design
            </Badge>
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-6 py-3 text-sm font-semibold shadow-lg">
              <Rocket className="w-4 h-4 mr-2" />
              Enterprise Ready
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-6 py-3 text-sm font-semibold shadow-lg">
              <Globe className="w-4 h-4 mr-2" />
              Multi-Tenant
            </Badge>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-6 py-3 text-sm font-semibold shadow-lg">
              <Shield className="w-4 h-4 mr-2" />
              Secure & Compliant
            </Badge>
          </div>
        </div>

        {/* Main Authentication Section - Compact but Modern */}
        <div className="max-w-md mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25"></div>
                <TabsList className="relative bg-white/90 backdrop-blur-sm border border-gray-200 p-2 rounded-3xl shadow-xl">
                  <TabsTrigger 
                    value="login" 
                    className="px-6 py-3 text-gray-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-2xl font-semibold transition-all duration-300 data-[state=active]:shadow-lg"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Company Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="px-6 py-3 text-gray-600 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-2xl font-semibold transition-all duration-300 data-[state=active]:shadow-lg"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Setup Company
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25"></div>
                <Card className="relative bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-1">Welcome Back!</CardTitle>
                    <p className="text-gray-600 text-sm">Access your intelligent workspace</p>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-4">
                  <div className="space-y-4">
                    {(loginError || error) && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 text-sm">{loginError || error}</p>
                      </div>
                    )}
                    
                    {/* Enhanced Demo Credentials */}
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-blue-800 font-medium text-sm">Try Demo Accounts</p>
                      </div>
                      <div className="space-y-2 text-xs text-blue-700">
                        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                          <span className="font-medium">Admin Access:</span>
                          <code className="text-blue-600 text-xs">john.admin@democompany.com</code>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
                          <span className="font-medium">Tech Startup:</span>
                          <code className="text-blue-600 text-xs">alex@techstartup.ai</code>
                        </div>
                        <div className="text-center mt-2 text-blue-600 font-medium text-xs">Password: password</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-700 font-medium mb-2 block text-sm">Company Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="admin@yourcompany.com"
                            className="pl-10 h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-700 font-medium mb-2 block text-sm">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <Button
                        onClick={handleLogin}
                        disabled={isLoading || !formData.email || !formData.password}
                        className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Signing in...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Access Your Workspace
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </Button>

                      <div className="text-center">
                        <button className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200 text-sm">
                          Forgot Password?
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Enhanced Company Signup Tab */}
            <TabsContent value="signup" className="space-y-8">
              {/* Company Information */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur opacity-25"></div>
                <Card className="relative bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg">
                      <Rocket className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-1">Launch Your AI Workspace</CardTitle>
                    <p className="text-gray-600 text-sm">Create your intelligent business command center</p>
                  </CardHeader>
                  <CardContent className="px-6 pb-6 pt-4 space-y-4">
                  {(loginError || error) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-700 text-sm">{loginError || error}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">Company Name *</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          placeholder="Enter your company name"
                          className="pl-10 h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">Workspace URL *</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          value={formData.subdomain}
                          onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          placeholder="yourcompany"
                          className="pl-10 pr-24 h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm text-sm"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                          .workspace.ai
                        </div>
                        {subdomainAvailable !== null && formData.subdomain && (
                          <div className="absolute -bottom-6 left-0 flex items-center gap-1">
                            {subdomainAvailable ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                <span className="text-green-600 text-xs">Available!</span>
                              </>
                            ) : (
                              <>
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-red-600 text-xs">Not available</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">Admin Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="admin@yourcompany.com"
                          className="pl-10 h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">Admin Password *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10 h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">Company Size</Label>
                      <Select value={formData.companySize} onValueChange={(value) => handleInputChange('companySize', value)}>
                        <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl">
                          {companySizes.map(size => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block text-sm">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="h-10 bg-white border-gray-300 text-gray-900 rounded-xl focus:border-blue-500 focus:ring-blue-500 shadow-sm">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 rounded-xl">
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                </Card>
              </div>

              {/* Setup Button - Proceed to Plan Selection */}
              <div className="text-center">
                <Button
                  onClick={handleCompanyDetails}
                  disabled={isLoading || !formData.companyName || !formData.email || !formData.password || !formData.subdomain || subdomainAvailable === false}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Continue to Plan Selection
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Button>
                
                <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                  Complete your company details, then choose the perfect plan for your business.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Features Showcase - Moved after authentication for better UX */}
        <div className="max-w-6xl mx-auto mb-16 mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by Advanced AI</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of business management with our intelligent automation</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-75 rounded-2xl blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Benefits Section */}
        <div className="max-w-6xl mx-auto mt-20 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose WorkSpace AI?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join thousands of companies already transforming their operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
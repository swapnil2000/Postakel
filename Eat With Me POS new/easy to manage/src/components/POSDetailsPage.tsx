import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Star,
  ShoppingCart,
  Scissors,
  Store,
  GraduationCap,
  Glasses,
  Building2,
  Receipt,
  Users,
  MessageSquare,
  BarChart3,
  UserCheck,
  Clock,
  Shield,
  Smartphone,
  Globe,
  Stethoscope,
  ChefHat,
  Briefcase,
  Soup
} from 'lucide-react';

interface POSDetailsPageProps {
  industry: string;
  onBack: () => void;
}

export function POSDetailsPage({ industry, onBack }: POSDetailsPageProps) {
  const industryConfig = {
    restaurant: {
      title: 'Eat With Me',
      icon: Soup,
      color: 'industry-restaurant',
      summary: 'AI-Powered Restaurant Management. Transform Your Restaurant with AI Intelligence for better efficiency and profits.',
      description: 'Join thousands of restaurants using AI to boost efficiency, increase profits, and create amazing dining experiences. Complete restaurant management with predictive analytics, smart table management, and seamless operations.',
      demoLink: 'https://cloud-cloudy-10682108.figma.site',
      features: [
        'Complete Order Management & POS Billing',
        'Smart Table Management & Reservations', 
        'Kitchen Display System & Order Tracking',
        'Staff Management & Role-Based Access',
        'Advanced Reports & Sales Analytics',
        'Online Orders & Digital Menu Integration',
        'Cash & Digital Payment Processing',
        'Real-time Order Status Tracking',
        'Multi-table Management System',
        'Inventory Management & Stock Alerts',
        'Customer Management & Order History',
        'Mobile-Responsive Dashboard Access'
      ],
      useCases: [
        'Fine Dining Restaurants',
        'Quick Service Restaurants', 
        'Cafes & Coffee Shops',
        'Food Courts',
        'Bars & Pubs',
        'Restaurant Chains'
      ]
    },
    salon: {
      title: 'Salon Pos',
      icon: Scissors,
      color: 'industry-salon',
      summary: 'Intelligent salon management with AI-driven appointment scheduling, personalized client recommendations, and smart staff optimization.',
      description: 'Next-generation AI-powered salon management that understands client preferences and predicts optimal appointment timing. Features intelligent staff allocation, personalized service recommendations, and automated client engagement.',
      demoLink: 'https://rhythm-neat-90897359.figma.site',
      features: [
        'AI-Powered Appointment Optimization',
        'Smart Staff Allocation & Commission Tracking',
        'Dynamic Service Pricing with AI Insights',
        'Personalized Client Recommendations',
        'Predictive Inventory Management',
        'Intelligent SMS & WhatsApp Automation',
        'AI-Enhanced Online Booking Portal',
        'Smart Loyalty Programs & Predictive Rewards',
        'Automated Review Generation & Analysis',
        'AI-Optimized Package & Membership Plans',
        'Advanced Financial Forecasting',
        'Multi-location AI Analytics'
      ],
      useCases: [
        'Hair Salons',
        'Beauty Salons',
        'Spa Centers',
        'Nail Salons',
        'Barbershops',
        'Wellness Centers'
      ]
    },
    bakery: {
      title: 'Bake With Me',
      icon: ChefHat,
      color: 'industry-bakery',
      summary: 'Smart bakery operations with AI-powered inventory forecasting, predictive demand planning, and intelligent recipe optimization.',
      description: 'AI-driven bakery management that predicts customer demand, optimizes production schedules, and minimizes waste. Features intelligent recipe costing, automated inventory management, and smart production planning.',
      demoLink: 'https://nit-pascal-39087728.figma.site',
      features: [
        'AI Recipe Optimization & Smart Costing',
        'Predictive Custom Order Processing',
        'Intelligent Ingredient Forecasting',
        'AI-Powered Daily Production Planning',
        'Smart Expiry Date Management & Alerts',
        'Dynamic Seasonal Menu Optimization',
        'Predictive Batch Production Tracking',
        'AI-Enhanced Custom Design Orders',
        'Smart Supplier Relationship Management',
        'Automated Inventory Control & Predictions',
        'Intelligent Payment Processing',
        'AI-Optimized Online Ordering Portal'
      ],
      useCases: [
        'Bakeries',
        'Pastry Shops',
        'Cake Shops',
        'Donut Shops',
        'Bread Manufacturers',
        'Catering Services'
      ]
    },
    healthcare: {
      title: 'Hello Doctor',
      icon: Stethoscope,
      color: 'industry-healthcare',
      summary: 'Complete Clinic Management Made Simple. Streamline your clinic operations with our all-in-one digital solution.',
      description: 'Revolutionary healthcare management system designed specifically for modern clinics. From patient records to billing, prescriptions to inventory - manage everything efficiently with our comprehensive digital platform.',
      demoLink: 'https://snuff-figma-69488919.figma.site',
      features: [
        'Unlimited Patients & Records Management',
        'Digital Prescriptions & E-Prescribing',
        'Smart Appointment Management & Scheduling',
        'Automated Billing & Payment Processing',
        'Medical Inventory Management & Tracking',
        'Advanced Analytics & Reports Dashboard',
        'Mobile Responsive Design & App Access',
        '24/7 Customer Support & Training',
        'HIPAA Compliant Data Security'
      ],
      useCases: [
        'General Practice Clinics',
        'Dental Practices',
        'Specialty Medical Centers',
        'Veterinary Clinics',
        'Physiotherapy Centers',
        'Diagnostic Centers'
      ]
    },
    education: {
      title: 'Class Craft',
      icon: GraduationCap,
      color: 'industry-education',
      summary: 'Intelligent education management with AI-powered student performance analytics, personalized learning insights, and smart attendance tracking.',
      description: 'Next-generation AI-driven education management that analyzes student performance patterns, predicts learning outcomes, and personalizes educational experiences. Features intelligent attendance tracking and automated academic insights.',
      demoLink: 'https://mauve-bee-06939098.figma.site',
      features: [
        'AI-Enhanced Student Enrollment & Registration',
        'Smart Attendance Analytics & Predictions',
        'Intelligent Fee Management & Collection',
        'AI-Powered Academic Progress Monitoring',
        'Predictive Class Scheduling & Timetables',
        'Smart Teacher & Staff Optimization',
        'AI-Enhanced Parent Communication Portal',
        'Automated Certificate & Report Generation',
        'Intelligent Online Course Management',
        'AI-Powered Exam & Assessment Tools',
        'Smart Library Management',
        'AI-Optimized Day-to-day Operations'
      ],
      useCases: [
        'Coaching Classes',
        'Training Institutes',
        'Tuition Centers',
        'Language Schools',
        'Skill Development Centers',
        'Online Academies'
      ]
    },
    artist: {
      title: 'Artist Hub',
      icon: Glasses,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      summary: 'Your Stage Awaits. The ultimate platform for independent artists to manage bookings, showcase portfolios, and grow your fanbase.',
      description: 'Transform your artistic career with ArtistHub - the comprehensive platform designed specifically for performers and creatives. Manage your gigs, connect with fans, showcase your portfolio, and grow your business all in one beautiful, intuitive interface. Track your earnings, manage inquiries, and never miss an opportunity.',
      demoLink: 'https://raid-drag-42198536.figma.site',
      features: [
        'Comprehensive Dashboard with Real-time Stats',
        'Portfolio Management & Showcase',
        'Public Portfolio for Client Discovery',
        'Booking Management & Scheduling',
        'Interactive Calendar for Gigs',
        'Inquiry & Lead Management',
        'Fan & Follower Engagement',
        'Revenue Tracking & Analytics',
        'Monthly Goal Progress Monitoring',
        'Performance Metrics & Conversion Rate',
        'Quick Actions for Productivity',
        'System Settings & Customization'
      ],
      useCases: [
        'Singers & Vocalists',
        'Dancers & Choreographers',
        'Actors & Performers',
        'Comedians & Stand-up Artists',
        'Musicians & Instrumentalists',
        'DJs & Music Producers'
      ]
    },
    business: {
      title: 'WorkSpace',
      icon: Building2,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      summary: 'The Ultimate AI-Powered Business Management Platform. Transform your business operations with intelligent automation.',
      description: 'Experience the future of business management with our intelligent automation platform. WorkSpace combines AI-powered insights, predictive analytics, and smart recommendations to streamline every aspect of your business operations. From employee management to performance tracking, everything is optimized for maximum efficiency.',
      demoLink: 'https://cream-rapid-35137310.figma.site',
      features: [
        'Comprehensive Dashboard with Real-time Metrics',
        'Time Tracker & Attendance Management',
        'Smart Leave Management System',
        'Task Management & Assignment',
        'Employee Management & Records',
        'Performance Management & Reviews',
        'Automated Salary Management',
        'Company Announcements & Communication',
        'Advanced Reports & Analytics',
        'Asset Management & Tracking',
        'AI Insights & Recommendations',
        'Users & Permissions Control',
        'System Settings & Customization'
      ],
      useCases: [
        'Technology & Software Companies',
        'Startups & Growing Businesses',
        'Service Organizations',
        'Consulting Firms',
        'Remote Teams',
        'Multi-department Enterprises'
      ]
    }
  };

  const config = industryConfig[industry as keyof typeof industryConfig];

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Industry Not Found</h2>
          <Button onClick={onBack} className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Industry-specific pricing plans
  const getPricingPlans = () => {
    if (industry === 'healthcare') {
      // Hello Doctor only has ONE plan as shown in Figma
      return [
        {
          name: 'Pro',
          price: 499,
          period: 'month',
          description: 'Ideal for growing businesses with advanced needs',
          features: [
            'Unlimited Patients & Records Management',
            'Digital Prescriptions & E-Prescribing', 
            'Smart Appointment Management & Scheduling',
            'Automated Billing & Payment Processing',
            'Medical Inventory Management & Tracking',
            'Advanced Analytics & Reports Dashboard',
            'Mobile Responsive Design & App Access',
            'HIPAA Compliant Data Security'
          ],
          buttonText: 'Get Started',
          popular: true
        }
      ];
    }
    
    // Default pricing for other industries
    return [
      {
        name: 'Basic',
        price: 499,
        period: 'month',
        description: 'Perfect for small businesses getting started',
        features: [
          'Up to 1,000 transactions/month',
          'Basic reporting & analytics',
          'Email support',
          'Single location',
          'Mobile app access',
          'Customer management',
          'Basic inventory (if applicable)'
        ],
        buttonText: 'Start Free Trial',
        popular: false
      },
      {
        name: 'Pro',
        price: 999,
        period: 'month',
        description: 'Ideal for growing businesses with advanced needs',
        features: [
          'Up to 10,000 transactions/month',
          'Advanced analytics & reporting',
          'Priority support',
          'Multiple locations',
          'WhatsApp integration',
          'Staff management',
          'Advanced inventory control',
          'Loyalty programs',
          'Custom branding'
        ],
        buttonText: 'Get Started',
        popular: true
      },
      {
        name: 'Enterprise',
        price: 1999,
        period: 'month',
        description: 'Complete solution for large organizations',
        features: [
          'Unlimited transactions',
          'Custom reporting & dashboards',
          '24/7 phone support',
          'Unlimited locations',
          'API access & integrations',
          'Dedicated account manager',
          'Custom features',
          'Advanced security',
          'Priority feature requests',
          'Training & onboarding'
        ],
        buttonText: 'Contact Sales',
        popular: false
      }
    ];
  };

  const pricingPlans = getPricingPlans();

  const handleExploreDemo = () => {
    window.open(config.demoLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={onBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="hidden sm:flex items-center">
                <span className="text-xl font-bold text-gradient">Easy to Manage</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-padding bg-gradient-hero hero-pattern">
        <div className="container-responsive">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in-up">
              <div className={`w-20 h-20 ${config.color} rounded-3xl flex items-center justify-center mx-auto mb-6`}>
                <config.icon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-hero text-gradient mb-6">
                {config.title}
              </h1>
              <p className="text-subhero text-muted-foreground mb-8 max-w-3xl mx-auto">
                {config.summary}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="btn-primary px-8 py-4 text-lg"
                  onClick={handleExploreDemo}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Go to Pos
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding">
        <div className="container-responsive">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose {config.title}?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {config.description}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {config.useCases.map((useCase, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{useCase}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="btn-primary px-8 py-4"
                onClick={handleExploreDemo}
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Go to Pos
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {config.features.slice(0, 4).map((feature, index) => (
                <Card key={index} className="card-feature text-center p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    {index === 0 && <Receipt className="w-6 h-6 text-white" />}
                    {index === 1 && <Users className="w-6 h-6 text-white" />}
                    {index === 2 && <BarChart3 className="w-6 h-6 text-white" />}
                    {index === 3 && <MessageSquare className="w-6 h-6 text-white" />}
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {feature}
                  </h4>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-secondary">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Feature Set
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run your {industry} business efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Hidden for WorkSpace */}
      {industry !== 'business' && (
        <>
          <section className="section-padding">
            <div className="container-responsive">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {industry === 'healthcare' ? 'Our Pricing' : 'Choose Your Plan'}
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {industry === 'healthcare' ? 'Simple, transparent pricing for healthcare professionals' : `Flexible pricing options designed for ${industry.replace('-', ' ')} businesses of all sizes`}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <div key={index} className={`card-pricing ${plan.popular ? 'featured' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-primary text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground mb-4">{plan.description}</p>
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                        <span className="text-muted-foreground ml-2">/{plan.period}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                      size="lg"
                      onClick={handleExploreDemo}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Comparison Table */}
          <section className="section-padding bg-secondary">
            <div className="container-responsive">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Compare Features
                </h2>
                <p className="text-lg text-muted-foreground">
                  See what's included in each plan
                </p>
              </div>

              <Card className="card-modern overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-semibold text-gray-900">Features</th>
                        <th className="text-center p-4 font-semibold text-gray-900">Basic</th>
                        <th className="text-center p-4 font-semibold text-gray-900">Pro</th>
                        <th className="text-center p-4 font-semibold text-gray-900">Enterprise</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { feature: 'Monthly Transactions', basic: '1,000', pro: '10,000', enterprise: 'Unlimited' },
                        { feature: 'Support Level', basic: 'Email', pro: 'Priority', enterprise: '24/7 Phone' },
                        { feature: 'Locations', basic: '1', pro: 'Multiple', enterprise: 'Unlimited' },
                        { feature: 'WhatsApp Integration', basic: '✗', pro: '✓', enterprise: '✓' },
                        { feature: 'Advanced Analytics', basic: '✗', pro: '✓', enterprise: '✓' },
                        { feature: 'API Access', basic: '✗', pro: '✗', enterprise: '✓' },
                        { feature: 'Custom Features', basic: '✗', pro: '✗', enterprise: '✓' }
                      ].map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{row.feature}</td>
                          <td className="p-4 text-center text-gray-700">{row.basic}</td>
                          <td className="p-4 text-center text-gray-700">{row.pro}</td>
                          <td className="p-4 text-center text-gray-700">{row.enterprise}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </section>
        </>
      )}

      {/* CTA Section */}
      <section className="mx-4 lg:mx-8">
        <div className="cta-section">
          <div className="container-responsive">
            <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <config.icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your {config.title.replace(' POS', '')} Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              See {config.title} in action with our interactive demo. 
              Experience the features that will revolutionize your business operations.
            </p>

          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg md:hidden z-50">
        <Button 
          className="w-full btn-primary py-4 text-lg font-semibold"
          onClick={handleExploreDemo}
        >
          <ExternalLink className="w-5 h-5 mr-2" />
          Go to Pos
        </Button>
      </div>

      {/* Footer */}
      <footer className="footer-section">
        <div className="container-responsive">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-2xl font-bold text-white">Easy to Manage</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                {config.title} - The complete solution for your {industry.replace('-', ' ')} business.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <a href="#" className="footer-link block">Features</a>
                <a href="#" className="footer-link block">Pricing</a>
                <a href="#" className="footer-link block">Demo</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="footer-link block">Help Center</a>
                <a href="#" className="footer-link block">Contact Us</a>
                <a href="#" className="footer-link block">Training</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Easy to Manage {config.title}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
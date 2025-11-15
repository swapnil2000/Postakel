import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Menu,
  X,
  ShoppingCart,
  Scissors,
  Store,
  GraduationCap,
  Glasses,
  Building2,
  Receipt,
  Users,
  MessageSquare,
  Star,
  BarChart3,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Play,
  Shield,
  Stethoscope,
  ChefHat,
  Briefcase,
  Coffee,
  Soup,
  Moon
} from 'lucide-react';

interface EasyToManageWebsiteProps {
  onNavigateToIndustry: (industry: string) => void;
  onNavigateToAdmin?: () => void;
}

export function EasyToManageWebsite({ onNavigateToIndustry, onNavigateToAdmin }: EasyToManageWebsiteProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // All available industries - currently showing only restaurant and artist
  const allIndustries = [
    {
      id: 'restaurant',
      name: 'Eat With Me',
      icon: Soup,
      color: 'industry-restaurant',
      description: 'AI-powered restaurant management with smart table optimization, predictive kitchen workflows, and intelligent order insights.',
      features: ['AI Table Optimization', 'Smart Kitchen Display', 'Predictive Menu Analytics', 'AI Order Insights']
    },
    {
      id: 'salon',
      name: 'Salon Pos',
      icon: Scissors,
      color: 'industry-salon',
      description: 'Intelligent salon management with AI-driven appointment scheduling, personalized client recommendations, and smart staff optimization.',
      features: ['AI Appointment Scheduling', 'Smart Staff Optimization', 'Personalized Client Insights', 'Predictive Service Analytics']
    },
    {
      id: 'bakery',
      name: 'Bake With Me',
      icon: ChefHat,
      color: 'industry-bakery',
      description: 'Smart bakery operations with AI-powered inventory forecasting, predictive demand planning, and intelligent recipe optimization.',
      features: ['AI Demand Forecasting', 'Smart Inventory Management', 'Predictive Recipe Analytics', 'Intelligent Production Planning']
    },
    {
      id: 'healthcare',
      name: 'Hello Doctor',
      icon: Stethoscope,
      color: 'industry-healthcare',
      description: 'Complete Clinic Management Made Simple. Streamline your clinic operations with comprehensive digital solutions.',
      features: ['Patient Records Management', 'Digital Prescriptions', 'Appointment Scheduling', 'Billing & Analytics']
    },
    {
      id: 'education',
      name: 'Class Craft',
      icon: GraduationCap,
      color: 'industry-education',
      description: 'Intelligent education management with AI-powered student performance analytics, personalized learning insights, and smart attendance tracking.',
      features: ['AI Performance Analytics', 'Smart Attendance Insights', 'Personalized Learning Paths', 'Predictive Student Success']
    },
    {
      id: 'artist',
      name: 'Artist Hub',
      icon: Glasses,
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      description: 'Your Stage Awaits. Complete artist management platform for performers to manage bookings, showcase portfolios, and grow your fanbase.',
      features: ['Portfolio Management & Showcase', 'Booking & Gig Scheduling', 'Fan Engagement & Analytics', 'Revenue & Goal Tracking']
    },
    {
      id: 'business',
      name: 'WorkSpace',
      icon: Building2,
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      description: 'The Ultimate AI-Powered Business Management Platform. Streamline operations with intelligent automation and real-time insights.',
      features: ['AI-Powered Automation', 'Predictive Analytics', 'Smart Recommendations', 'Real-time Insights']
    }
  ];

  // Currently showing restaurant, artist, workspace, and healthcare - others temporarily hidden
  const visibleIndustryIds = ['restaurant', 'artist', 'business', 'healthcare'];
  const industries = allIndustries.filter(industry => visibleIndustryIds.includes(industry.id));

  const features = [
    {
      icon: Receipt,
      title: 'AI-Powered Billing',
      description: 'Smart invoicing with AI-driven payment predictions, automated billing cycles, and intelligent fraud detection.'
    },
    {
      icon: Users,
      title: 'Intelligent CRM',
      description: 'AI-enhanced customer profiles with predictive behavior analysis, personalized recommendations, and smart segmentation.'
    },
    {
      icon: MessageSquare,
      title: 'Smart WhatsApp AI',
      description: 'AI-powered automated messaging, intelligent customer responses, and predictive communication timing.'
    },
    {
      icon: Star,
      title: 'AI Loyalty Engine',
      description: 'Machine learning-driven loyalty programs with personalized rewards and predictive customer retention strategies.'
    },
    {
      icon: UserCheck,
      title: 'Smart Workforce Analytics',
      description: 'AI-powered staff performance insights, predictive scheduling optimization, and intelligent attendance patterns.'
    },
    {
      icon: BarChart3,
      title: 'AI Business Intelligence',
      description: 'Advanced AI analytics with predictive forecasting, automated insights generation, and real-time business intelligence.'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      business: 'Kumar Restaurant Chain',
      industry: 'Restaurant',
      rating: 5,
      comment: 'The AI-powered demand forecasting has reduced our food waste by 40%. The smart table optimization automatically assigns customers to boost our efficiency!',
      avatar: '👨‍🍳'
    },
    {
      name: 'Priya Salon',
      business: 'Glamour Beauty Salon',
      industry: 'Salon',
      rating: 5,
      comment: 'AI appointment scheduling predicts the perfect slots for each client. The intelligent customer insights help us offer personalized services that wow our clients!',
      avatar: '💇‍♀️'
    },
    {
      name: 'Amit Retail',
      business: 'Fashion Hub',
      industry: 'Retail',
      rating: 5,
      comment: 'The AI inventory predictions are incredibly accurate! We never run out of popular items, and the smart analytics predict trends before they happen.',
      avatar: '🛍️'
    }
  ];

  const faqs = [
    {
      question: 'How does Easy to Manage actually help my business?',
      answer: 'Easy to Manage learns from your business patterns to provide automated insights and optimize operations effortlessly. It handles routine tasks, monitors key metrics, and keeps everything running smoothly 24/7—all automatically.'
    },
    {
      question: 'Do I need technical skills to use the AI features?',
      answer: 'Not at all! Our AI works completely in the background. The insights appear as easy-to-understand recommendations and automated actions. You get the benefits of advanced AI without any complexity.'
    },
    {
      question: 'How accurate are the AI predictions and insights?',
      answer: 'Our AI accuracy improves over time as it learns your business patterns. Most clients see 85-95% accuracy in demand forecasting and customer behavior predictions within the first 3 months of use.'
    },
    {
      question: 'Is my business data used to train AI for other companies?',
      answer: 'Absolutely not! Your data remains completely private and secure. Our AI models are trained on anonymized, aggregated patterns only, and your specific business data never leaves your secure environment.'
    },
    {
      question: 'Can I customize what AI insights I receive?',
      answer: 'Yes! You can configure which AI insights and automated actions are most relevant to your business. Our smart dashboard learns your preferences and prioritizes the insights that matter most to you.'
    },
    {
      question: 'How quickly will I see results from the AI features?',
      answer: 'Most businesses see immediate benefits from automated tasks and basic insights. Predictive analytics and advanced AI recommendations become more accurate and valuable within 2-4 weeks as the system learns your patterns.'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-950/95 via-purple-950/95 to-violet-950/95 backdrop-blur-lg border-b border-indigo-800/50 shadow-lg">
        <div className="container-responsive">
          <div className="flex items-center justify-between py-5">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Moon className="w-8 h-8 text-indigo-600" />
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                Easy to Manage
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <button 
                onClick={() => scrollToSection('home')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'home' 
                    ? 'bg-indigo-500/30 text-white shadow-sm' 
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-500/20'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('solutions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'solutions' 
                    ? 'bg-indigo-500/30 text-white shadow-sm' 
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-500/20'
                }`}
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'contact' 
                    ? 'bg-indigo-500/30 text-white shadow-sm' 
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-500/20'
                }`}
              >
                Contact
              </button>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-3">
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-indigo-500/30"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-indigo-800/50">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-indigo-200 hover:text-white transition-colors text-left px-4 py-2 rounded-lg hover:bg-indigo-500/20"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')}
                  className="text-indigo-200 hover:text-white transition-colors text-left px-4 py-2 rounded-lg hover:bg-indigo-500/20"
                >
                  Solutions
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-indigo-200 hover:text-white transition-colors text-left px-4 py-2 rounded-lg hover:bg-indigo-500/20"
                >
                  Contact
                </button>
                <div className="flex flex-col space-y-2 pt-3 border-t border-indigo-800/50">
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-24 lg:py-32 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative container-responsive">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up space-y-8">
              <div className="flex justify-center mb-6">
                <Moon className="w-20 h-20 text-indigo-300 animate-float-gentle" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">
                  Rest Easy.
                </span>
                <br />
                <span className="text-white">
                  Manage Effortlessly.
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-indigo-200 max-w-3xl mx-auto leading-relaxed">
                Transform your business operations with intelligent automation. Easy to Manage takes care of operations 24/7 
                with powerful tools and seamless integration.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <span className="px-4 py-2 bg-indigo-500/30 text-indigo-100 rounded-full text-sm font-medium backdrop-blur-sm">🌙 Always On Guard</span>
                <span className="px-4 py-2 bg-purple-500/30 text-purple-100 rounded-full text-sm font-medium backdrop-blur-sm">😴 Stress-Free Operations</span>
                <span className="px-4 py-2 bg-violet-500/30 text-violet-100 rounded-full text-sm font-medium backdrop-blur-sm">✨ Peaceful Automation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section id="solutions" className="py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container-responsive">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-6">
              Peaceful Solutions for Every Industry
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Close your eyes and relax. Our specialized systems work around the clock, 
              adapting to your industry's unique rhythm while you focus on what matters.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => (
              <Card key={industry.id} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer bg-white rounded-2xl">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className={`w-20 h-20 ${industry.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <industry.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {industry.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-8 pb-8">
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {industry.description}
                  </p>
                  <div className="space-y-3 mb-8">
                    {industry.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full btn-primary"
                    onClick={() => onNavigateToIndustry(industry.id)}
                  >
                    Go to Pos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Restful Features That Never Sleep
            </h2>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              While you rest, these powerful features work tirelessly to keep your business running smoothly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-indigo-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4">
              Success Stories with Easy to Manage
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of businesses sleeping soundly, knowing their operations are in good hands
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {testimonial.industry}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Questions? We're Always Awake
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Easy to Manage
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question w-full"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="faq-answer animate-fade-in-up">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-4 lg:mx-8 my-16">
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="container-responsive py-20 text-center relative">
            <div className="absolute inset-0 opacity-20">
              <Moon className="w-64 h-64 absolute top-10 right-10 text-white animate-float-gentle" />
              <Moon className="w-32 h-32 absolute bottom-10 left-10 text-white animate-float-gentle" />
            </div>
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4 text-white">
                Ready to Sleep Soundly?
              </h2>
              <p className="text-xl mb-8 text-indigo-100 max-w-2xl mx-auto">
                Join thousands of businesses managing effortlessly with Easy to Manage. 
                Experience the power of intelligent automation today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 text-white py-16">
        <div className="container-responsive">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="mb-6 flex items-center gap-2">
                <Moon className="w-8 h-8 text-indigo-400" />
                <span className="text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent tracking-tight">
                  Easy to Manage
                </span>
              </div>
              <p className="text-indigo-200 mb-8 max-w-md text-lg leading-relaxed">
                Rest easy with automated management solutions. While you sleep, 
                we keep your business running smoothly with peaceful automation.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-200">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-400" />
                  <span className="text-indigo-200">hello@easytomanage.xyz</span>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Industry Solutions</h4>
              <div className="space-y-3">
                <a href="#" className="text-indigo-300 hover:text-indigo-200 transition-colors block">Restaurant & Food</a>
                <a href="#" className="text-indigo-300 hover:text-indigo-200 transition-colors block">Healthcare & Clinic</a>
                <a href="#" className="text-indigo-300 hover:text-indigo-200 transition-colors block">Salon & Beauty</a>
                <a href="#" className="text-indigo-300 hover:text-indigo-200 transition-colors block">Retail & Business</a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Company</h4>
              <div className="space-y-3">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left"
                >
                  Solutions
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left"
                >
                  Contact
                </button>
                {onNavigateToAdmin && (
                  <button 
                    onClick={onNavigateToAdmin}
                    className="text-indigo-300 hover:text-indigo-200 transition-colors flex items-center gap-2 text-left"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Portal
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-indigo-800/50 pt-8 text-center">
            <p className="text-indigo-300 text-lg">
              © 2024 Easy to Manage. All rights reserved. Making business management simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
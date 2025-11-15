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
  Sparkles,
  Zap,
  Target
} from 'lucide-react';

interface EasyToManageWebsiteProps {
  onNavigateToIndustry: (industry: string) => void;
  onNavigateToAdmin?: () => void;
  onNavigateToContact?: () => void;
}

export function EasyToManageWebsite({ onNavigateToIndustry, onNavigateToAdmin, onNavigateToContact }: EasyToManageWebsiteProps) {
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
      comment: 'The table management and kitchen display system has streamlined our operations perfectly. Orders flow seamlessly from table to kitchen, reducing wait times by 35%!',
      avatar: '👨‍🍳'
    },
    {
      name: 'Dr. Sarah Mitchell',
      business: 'City Health Clinic',
      industry: 'Healthcare',
      rating: 5,
      comment: 'Hello Doctor has transformed our patient management. The appointment system, digital records, and billing integration make our clinic run smoothly and professionally.',
      avatar: '👩‍⚕️'
    },
    {
      name: 'James Anderson',
      business: 'TechFlow Solutions',
      industry: 'Business',
      rating: 5,
      comment: 'WorkSpace helps us manage projects, track time, and handle invoicing all in one place. It has improved our team productivity and client communication significantly.',
      avatar: '💼'
    }
  ];

  const faqs = [
    {
      question: 'What types of businesses can use Easy to Manage?',
      answer: 'Easy to Manage offers specialized POS systems for restaurants, salons, bakeries, healthcare clinics, educational institutions, artists, and general businesses. Each system is tailored to meet the unique needs of its industry.'
    },
    {
      question: 'How do I get started with a POS system?',
      answer: 'Simply explore our available POS systems on the website, click on "Try Demo" for the system that fits your business, and experience how it works. You can start using the full system right away with no complicated setup.'
    },
    {
      question: 'Can I switch between different POS systems?',
      answer: 'Each POS system is designed specifically for its industry. However, if your business needs change, you can easily access different systems through your Easy to Manage account.'
    },
    {
      question: 'Is my business data secure?',
      answer: 'Absolutely! Your data is encrypted and stored securely. We follow industry-standard security practices to ensure your business information, customer data, and transactions remain private and protected.'
    },
    {
      question: 'Do I need technical skills to use these POS systems?',
      answer: 'Not at all! Our POS systems are designed to be intuitive and easy to use. Whether you\'re managing a restaurant, salon, or clinic, the interface is straightforward with clear navigation and helpful features.'
    },
    {
      question: 'What kind of support is available?',
      answer: 'We provide comprehensive support through our admin dashboard. You can contact us at hello@easytomanage.xyz for assistance, and our team is dedicated to helping you get the most out of your POS system.'
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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-indigo-100 shadow-sm">
        <div className="container-responsive">
          <div className="flex items-center py-5">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                Easy to Manage
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-auto">
              <button 
                onClick={() => scrollToSection('home')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'home' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('solutions')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === 'solutions' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                Solutions
              </button>
              <button 
                onClick={() => onNavigateToContact?.()}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50"
              >
                Contact
              </button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-indigo-600 hover:bg-indigo-50 ml-auto"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-indigo-100">
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-gray-600 hover:text-indigo-600 transition-colors text-left px-4 py-2 rounded-lg hover:bg-indigo-50/50"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')}
                  className="text-gray-600 hover:text-indigo-600 transition-colors text-left px-4 py-2 rounded-lg hover:bg-indigo-50/50"
                >
                  Solutions
                </button>
                <button 
                  onClick={() => onNavigateToContact?.()}
                  className="text-gray-600 hover:text-indigo-600 transition-colors text-left px-4 py-2 rounded-lg hover:bg-indigo-50/50"
                >
                  Contact
                </button>
                <div className="flex flex-col space-y-2 pt-3 border-t border-indigo-100">
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 lg:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-300 rounded-full blur-3xl animate-float-gentle"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-float-gentle" style={{animationDelay: '2s'}}></div>
        </div>
        <div className="relative container-responsive px-4 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in-up space-y-6 lg:space-y-8">
              <div className="flex justify-center mb-4 lg:mb-6">
                <div className="relative">
                  <Sparkles className="w-20 h-20 lg:w-24 lg:h-24 text-indigo-500 animate-float-gentle drop-shadow-lg" />
                  <div className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 bg-indigo-400 rounded-full blur-xl opacity-30"></div>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight px-4">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                  Business Management
                </span>
                <br />
                <span className="text-gray-800">
                  Made Simple
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 lg:px-8">
                Streamline your operations with intelligent POS solutions designed for every industry. 
                Easy to Manage brings powerful features and intuitive design together.
              </p>
              <div className="flex flex-wrap justify-center gap-3 lg:gap-4 pt-6 px-4">
                <span className="px-5 py-2.5 lg:px-6 lg:py-3 bg-indigo-100 text-indigo-700 text-sm lg:text-base rounded-full font-medium hover:bg-indigo-200 transition-colors cursor-pointer">⚡ Smart Automation</span>
                <span className="px-5 py-2.5 lg:px-6 lg:py-3 bg-purple-100 text-purple-700 text-sm lg:text-base rounded-full font-medium hover:bg-purple-200 transition-colors cursor-pointer">📊 Real-time Insights</span>
                <span className="px-5 py-2.5 lg:px-6 lg:py-3 bg-violet-100 text-violet-700 text-sm lg:text-base rounded-full font-medium hover:bg-violet-200 transition-colors cursor-pointer">🎯 Industry-Specific</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section id="solutions" className="py-16 lg:py-24 bg-white">
        <div className="container-responsive px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4 lg:mb-6 px-4">
              Industry-Specific POS Solutions
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Tailored management systems designed for your industry. Each solution comes with specialized 
              features that match your unique business needs perfectly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry) => (
              <Card key={industry.id} className="relative overflow-hidden border border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer bg-white rounded-2xl hover:scale-105">
                <CardHeader className="text-center pb-6 pt-8">
                  <div className={`w-24 h-24 ${industry.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-md`}>
                    <industry.icon className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {industry.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 lg:px-8 pb-8">
                  <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed">
                    {industry.description}
                  </p>
                  <div className="space-y-2.5 lg:space-y-3 mb-6 lg:mb-8">
                    {industry.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-left">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full btn-primary py-6"
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-violet-50/50">
        <div className="container-responsive px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4 lg:mb-6 px-4">
              Comprehensive Features Built-In
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to run your business efficiently, all in one integrated platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-indigo-100 rounded-2xl p-8 text-center hover:shadow-lg hover:border-indigo-200 transition-all duration-300 group">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-responsive px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4 lg:mb-6 px-4">
              Trusted by Growing Businesses
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              See how businesses across industries are achieving more with Easy to Manage
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
      <section className="py-16 lg:py-24 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-violet-50/50">
        <div className="container-responsive px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4 lg:mb-6 px-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4">
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
      <section className="px-4 lg:px-8 py-16 lg:py-24">
        <div className="container-responsive">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 rounded-3xl shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-300 rounded-full blur-3xl animate-float-gentle"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-float-gentle" style={{animationDelay: '2s'}}></div>
            </div>
            <div className="relative py-16 lg:py-24 px-6 lg:px-12 text-center">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Sparkles className="w-48 h-48 lg:w-64 lg:h-64 absolute top-10 right-10 text-white animate-float-gentle" />
                <Target className="w-32 h-32 lg:w-40 lg:h-40 absolute bottom-10 left-10 text-white animate-float-gentle" style={{animationDelay: '3s'}} />
                <Zap className="w-24 h-24 lg:w-32 lg:h-32 absolute top-1/2 left-1/4 text-white animate-float-gentle" style={{animationDelay: '1.5s'}} />
              </div>
              <div className="relative max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-5xl font-bold mb-6 lg:mb-8 text-white">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-lg lg:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed px-4">
                  Join thousands of businesses streamlining operations with Easy to Manage. 
                  Experience the power of industry-specific POS solutions today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-indigo-950 via-purple-950 to-violet-950 text-white py-12 lg:py-16">
        <div className="container-responsive px-4 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-8 lg:mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="mb-4 lg:mb-6 flex items-center gap-2">
                <span className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent tracking-tight">
                  Easy to Manage
                </span>
              </div>
              <p className="text-indigo-200 mb-6 lg:mb-8 max-w-md text-base lg:text-lg leading-relaxed">
                Powerful POS solutions tailored for your industry. 
                Streamline operations and grow your business with intelligent tools.
              </p>
              <div className="space-y-2.5 lg:space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400 flex-shrink-0" />
                  <span className="text-indigo-200 text-sm lg:text-base">hello@easytomanage.xyz</span>
                </div>
              </div>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="font-semibold text-white mb-4 lg:mb-6 text-base lg:text-lg">Industry Solutions</h4>
              <div className="space-y-2 lg:space-y-3">
                <button 
                  onClick={() => onNavigateToIndustry('restaurant')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Restaurant & Food
                </button>
                <button 
                  onClick={() => onNavigateToIndustry('salon')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Salon & Beauty
                </button>
                <button 
                  onClick={() => onNavigateToIndustry('bakery')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Bakery & Pastry
                </button>
                <button 
                  onClick={() => onNavigateToIndustry('healthcare')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Healthcare & Clinic
                </button>
                <button 
                  onClick={() => onNavigateToIndustry('education')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Education & Training
                </button>
                <button 
                  onClick={() => onNavigateToIndustry('artist')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Artist & Performer
                </button>
                <button 
                  onClick={() => onNavigateToIndustry('business')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Business & Workspace
                </button>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4 lg:mb-6 text-base lg:text-lg">Company</h4>
              <div className="space-y-2 lg:space-y-3">
                <button 
                  onClick={() => scrollToSection('home')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection('solutions')}
                  className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                >
                  Solutions
                </button>
                {onNavigateToContact && (
                  <button 
                    onClick={onNavigateToContact}
                    className="text-indigo-300 hover:text-indigo-200 transition-colors block text-left text-sm lg:text-base"
                  >
                    Contact
                  </button>
                )}
                {onNavigateToAdmin && (
                  <button 
                    onClick={onNavigateToAdmin}
                    className="text-indigo-300 hover:text-indigo-200 transition-colors flex items-center gap-2 text-left text-sm lg:text-base"
                  >
                    <Shield className="w-4 h-4 flex-shrink-0" />
                    Admin Portal
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-indigo-800/50 pt-6 lg:pt-8 text-center">
            <p className="text-indigo-300 text-sm lg:text-lg px-4">
              © 2025 Easy to Manage. All rights reserved. Making business management simple.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

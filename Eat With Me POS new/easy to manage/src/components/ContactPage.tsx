import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Mail, ArrowLeft, Send, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface ContactPageProps {
  onBack: () => void;
}

export function ContactPage({ onBack }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.country || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Submit form (in a real app, this would send to a backend)
    console.log('Form submitted:', formData);
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    
    // Reset form
    setFormData({ name: '', email: '', country: '', message: '' });
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'India',
    'Germany', 'France', 'Spain', 'Italy', 'Netherlands',
    'Singapore', 'Japan', 'China', 'South Korea', 'Brazil',
    'Mexico', 'Argentina', 'South Africa', 'United Arab Emirates', 'Saudi Arabia',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-indigo-100 shadow-sm sticky top-0 z-50">
        <div className="container-responsive px-4 py-5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-indigo-600 hover:bg-indigo-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              Easy to Manage
            </span>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container-responsive px-4 py-12 lg:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help you get the most out of Easy to Manage.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-indigo-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Mail className="w-6 h-6 text-indigo-600" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>
                    Reach out to us and we'll respond as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg">
                    <Mail className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Email Address</p>
                      <a 
                        href="mailto:hello@easytomanage.xyz" 
                        className="text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        hello@easytomanage.xyz
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Global Support</p>
                      <p className="text-gray-600 text-sm">
                        Available worldwide for all our POS solutions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-white">Why Contact Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-indigo-100">Get help with POS system setup and configuration</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-indigo-100">Learn about features and capabilities</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-indigo-100">Request technical support and assistance</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white mt-2 flex-shrink-0"></div>
                    <p className="text-indigo-100">Discuss custom solutions for your business</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="border-indigo-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you shortly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-indigo-200 focus:border-indigo-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-indigo-200 focus:border-indigo-400"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => setFormData({ ...formData, country: value })}
                      required
                    >
                      <SelectTrigger id="country" className="border-indigo-200 focus:border-indigo-400">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="border-indigo-200 focus:border-indigo-400 min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-700 hover:via-purple-700 hover:to-violet-700 text-white py-6"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

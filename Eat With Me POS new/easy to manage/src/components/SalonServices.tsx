import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Scissors,
  Plus,
  Edit,
  Trash2,
  Clock,
  IndianRupee,
  Star,
  Search,
  Filter,
  Eye,
  Heart,
  Sparkles,
  Users
} from 'lucide-react';

export function SalonServices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Services', count: 25, color: 'bg-gray-100 text-gray-800' },
    { id: 'hair', name: 'Hair', count: 8, color: 'bg-purple-100 text-purple-800', icon: '💇‍♀️' },
    { id: 'skin', name: 'Skin Care', count: 6, color: 'bg-pink-100 text-pink-800', icon: '✨' },
    { id: 'body', name: 'Body Treatment', count: 5, color: 'bg-green-100 text-green-800', icon: '💆‍♀️' },
    { id: 'nails', name: 'Nail Care', count: 4, color: 'bg-blue-100 text-blue-800', icon: '💅' },
    { id: 'packages', name: 'Packages', count: 2, color: 'bg-orange-100 text-orange-800', icon: '🎁' }
  ];

  const services = [
    {
      id: 1,
      name: 'Premium Hair Cut & Style',
      category: 'hair',
      duration: '45 min',
      price: 1200,
      description: 'Professional haircut with styling and blow-dry',
      popularity: 95,
      bookingsThisMonth: 45,
      staffRequired: ['Hair Specialist'],
      modifiers: ['Hair Wash (+₹200)', 'Hair Spa (+₹800)', 'Hair Serum (+₹300)'],
      rating: 4.9,
      image: '💇‍♀️'
    },
    {
      id: 2,
      name: 'Hair Color & Highlights',
      category: 'hair',
      duration: '2.5 hours',
      price: 3500,
      description: 'Professional hair coloring with premium products',
      popularity: 88,
      bookingsThisMonth: 32,
      staffRequired: ['Hair Color Specialist'],
      modifiers: ['Root Touch Up (+₹800)', 'Conditioning (+₹500)', 'Style & Blow Dry (+₹600)'],
      rating: 4.8,
      image: '🎨'
    },
    {
      id: 3,
      name: 'Luxury Facial Treatment',
      category: 'skin',
      duration: '75 min',
      price: 2200,
      description: 'Deep cleansing facial with premium products and masks',
      popularity: 92,
      bookingsThisMonth: 38,
      staffRequired: ['Skin Specialist'],
      modifiers: ['Anti-Aging Serum (+₹800)', 'Eye Treatment (+₹600)', 'Neck & Shoulder (+₹400)'],
      rating: 4.9,
      image: '✨'
    },
    {
      id: 4,
      name: 'Signature Body Massage',
      category: 'body',
      duration: '60 min',
      price: 2000,
      description: 'Full body relaxing massage with aromatherapy oils',
      popularity: 85,
      bookingsThisMonth: 28,
      staffRequired: ['Massage Therapist'],
      modifiers: ['Hot Stone (+₹800)', 'Aromatherapy (+₹500)', 'Deep Tissue (+₹600)'],
      rating: 4.7,
      image: '💆‍♀️'
    },
    {
      id: 5,
      name: 'Gel Manicure & Art',
      category: 'nails',
      duration: '45 min',
      price: 1000,
      description: 'Long-lasting gel manicure with nail art options',
      popularity: 78,
      bookingsThisMonth: 35,
      staffRequired: ['Nail Technician'],
      modifiers: ['Nail Art (+₹400)', 'French Tips (+₹200)', 'Nail Extensions (+₹800)'],
      rating: 4.6,
      image: '💅'
    },
    {
      id: 6,
      name: 'Bridal Package Premium',
      category: 'packages',
      duration: '4 hours',
      price: 8500,
      description: 'Complete bridal makeover package with hair, makeup, and styling',
      popularity: 98,
      bookingsThisMonth: 12,
      staffRequired: ['Hair Specialist', 'Makeup Artist', 'Beautician'],
      modifiers: ['Trial Session (+₹2000)', 'Additional Touch-up (+₹1500)', 'Mehendi (+₹1000)'],
      rating: 5.0,
      image: '👰‍♀️'
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600 bg-green-100';
    if (popularity >= 80) return 'text-blue-600 bg-blue-100';
    if (popularity >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Scissors className="w-6 h-6 text-primary" />
          Service Management
        </h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Category Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.icon && <span>{category.icon}</span>}
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1 h-5">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services by name or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                    {service.image}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <Badge className={categories.find(c => c.id === service.category)?.color} variant="secondary">
                      {categories.find(c => c.id === service.category)?.name}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{service.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{service.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-primary">₹{service.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                </div>
                <Badge className={getPopularityColor(service.popularity)} variant="secondary">
                  {service.popularity}% popular
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Staff Required</h4>
                <div className="flex flex-wrap gap-1">
                  {service.staffRequired.map((staff) => (
                    <Badge key={staff} variant="outline" className="text-xs">
                      {staff}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Add-on Services</h4>
                <div className="space-y-1">
                  {service.modifiers.slice(0, 2).map((modifier) => (
                    <div key={modifier} className="text-xs text-muted-foreground">
                      • {modifier}
                    </div>
                  ))}
                  {service.modifiers.length > 2 && (
                    <div className="text-xs text-primary cursor-pointer">
                      + {service.modifiers.length - 2} more options
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">This month:</span>
                  </div>
                  <span className="font-medium text-secondary-foreground">
                    {service.bookingsThisMonth} bookings
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Analytics */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services
                .sort((a, b) => b.bookingsThisMonth - a.bookingsThisMonth)
                .slice(0, 3)
                .map((service, index) => (
                <div key={service.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-lg">
                    {service.image}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.bookingsThisMonth} bookings
                    </p>
                  </div>
                  <Badge variant={index === 0 ? 'default' : 'secondary'} className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Most Loved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 3)
                .map((service) => (
                <div key={service.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-lg">
                    {service.image}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">{service.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Revenue Leaders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services
                .sort((a, b) => (b.price * b.bookingsThisMonth) - (a.price * a.bookingsThisMonth))
                .slice(0, 3)
                .map((service) => (
                <div key={service.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-lg">
                    {service.image}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ₹{((service.price * service.bookingsThisMonth) / 1000).toFixed(1)}k revenue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
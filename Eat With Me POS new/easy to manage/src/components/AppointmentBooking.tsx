import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { 
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  Plus,
  Search,
  Check,
  IndianRupee,
  CreditCard,
  Smartphone,
  Banknote,
  Star,
  MapPin
} from 'lucide-react';

export function AppointmentBooking() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [notes, setNotes] = useState('');
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    gender: ''
  });

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM'
  ];

  const customers = [
    { id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', visits: 12, lastVisit: '2 days ago' },
    { id: 2, name: 'Ananya Gupta', phone: '+91 98765 43211', visits: 8, lastVisit: '1 week ago' },
    { id: 3, name: 'Kavya Reddy', phone: '+91 98765 43212', visits: 15, lastVisit: '3 days ago' }
  ];

  const services = [
    { id: 1, name: 'Hair Cut & Style', duration: '45 min', price: 800, category: 'Hair' },
    { id: 2, name: 'Hair Color', duration: '2 hours', price: 2500, category: 'Hair' },
    { id: 3, name: 'Facial Classic', duration: '1 hour', price: 1200, category: 'Skin' },
    { id: 4, name: 'Facial Premium', duration: '1.5 hours', price: 2000, category: 'Skin' },
    { id: 5, name: 'Full Body Massage', duration: '1 hour', price: 1800, category: 'Body' },
    { id: 6, name: 'Manicure', duration: '30 min', price: 600, category: 'Nails' },
    { id: 7, name: 'Pedicure', duration: '45 min', price: 800, category: 'Nails' }
  ];

  const staff = [
    { id: 1, name: 'Maya Patel', speciality: 'Hair Specialist', rating: 4.9, available: true },
    { id: 2, name: 'Riya Singh', speciality: 'Skin Expert', rating: 4.8, available: true },
    { id: 3, name: 'Deepa Kumar', speciality: 'Massage Therapist', rating: 4.9, available: false },
    { id: 4, name: 'Sunita Rao', speciality: 'Nail Artist', rating: 4.7, available: true }
  ];

  const getTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    const totalMinutes = selectedServices.reduce((total, service) => {
      const duration = service.duration;
      if (duration.includes('hour')) {
        const hours = parseFloat(duration);
        return total + (hours * 60);
      } else {
        return total + parseInt(duration);
      }
    }, 0);
    
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
    return `${totalMinutes}m`;
  };

  const toggleService = (service: any) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          Book Appointment
        </h1>
        <Badge variant="outline" className="text-primary border-primary">
          Step by Step Booking
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Date & Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Select Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block mb-2">Date</label>
                <Input 
                  type="date" 
                  className="h-12"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block mb-2">Available Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="h-10"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Customer Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search customer by name or phone"
                    className="pl-10 h-12"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewCustomer(!showNewCustomer)}
                  className="h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>

              {showNewCustomer ? (
                <div className="space-y-3 p-4 border border-primary/20 rounded-lg bg-primary/5">
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Full Name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                    />
                  </div>
                  <Input
                    placeholder="Email (Optional)"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-primary">Save Customer</Button>
                    <Button size="sm" variant="outline" onClick={() => setShowNewCustomer(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <div
                      key={customer.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCustomer?.id === customer.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-accent'
                      }`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary text-white">
                            {customer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">{customer.phone}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs">
                            {customer.visits} visits
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {customer.lastVisit}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-primary" />
                Select Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedServices.find(s => s.id === service.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => toggleService(service)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{service.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Duration: {service.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-primary">₹{service.price}</p>
                        {selectedServices.find(s => s.id === service.id) && (
                          <Check className="w-5 h-5 text-primary mt-1 ml-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Staff Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Assign Staff
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      !member.available 
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : selectedStaff === member.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-accent'
                    }`}
                    onClick={() => member.available && setSelectedStaff(member.name)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-secondary-foreground text-white">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.speciality}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{member.rating}</span>
                        </div>
                      </div>
                      {!member.available && (
                        <Badge variant="destructive" className="text-xs">Busy</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Special Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special requests or notes for the appointment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedDate.toDateString()}</span>
                </div>
              )}
              
              {selectedTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedTime}</span>
                </div>
              )}

              {selectedCustomer && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedCustomer.name}</span>
                </div>
              )}

              {selectedStaff && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedStaff}</span>
                </div>
              )}

              {selectedServices.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Selected Services</h4>
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span>{service.name}</span>
                      <span className="font-medium">₹{service.price}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Total Duration</span>
                      <span>{getTotalDuration()}</span>
                    </div>
                    <div className="flex justify-between font-medium text-primary">
                      <span>Total Amount</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-medium">Payment Method</h4>
                <div className="grid gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Banknote className="w-4 h-4 mr-2" />
                    Cash
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Card
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Smartphone className="w-4 h-4 mr-2" />
                    UPI
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-primary hover:bg-primary/90"
                disabled={!selectedDate || !selectedTime || !selectedCustomer || selectedServices.length === 0 || !selectedStaff}
              >
                Confirm Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
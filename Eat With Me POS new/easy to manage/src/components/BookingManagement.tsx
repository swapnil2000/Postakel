import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Download,
  Share2,
  Star,
  Users,
  Music,
  Crown,
  Sparkles,
  Filter,
  Search,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';

export function BookingManagement() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const bookings = {
    pending: [
      {
        id: 'BK001',
        eventTitle: 'Wedding Reception',
        clientName: 'Priya & Rohit Sharma',
        clientAvatar: '👰',
        eventType: 'Wedding',
        date: '2024-02-25',
        time: '7:00 PM - 11:00 PM',
        venue: 'Grand Ballroom, Hotel Taj',
        location: 'Mumbai, Maharashtra',
        amount: 45000,
        advance: 15000,
        guests: 300,
        requirements: 'Bollywood hits, some classic songs for elderly guests',
        clientContact: '+91 98765 43210',
        clientEmail: 'priya.rohit@email.com',
        inquiryDate: '2024-02-10',
        status: 'pending'
      },
      {
        id: 'BK002',
        eventTitle: 'Corporate Annual Party',
        clientName: 'TechCorp Solutions',
        clientAvatar: '🏢',
        eventType: 'Corporate',
        date: '2024-03-05',
        time: '6:00 PM - 10:00 PM',
        venue: 'Conference Hall A',
        location: 'Bangalore, Karnataka',
        amount: 35000,
        advance: 10000,
        guests: 150,
        requirements: 'Mixed music - international and Bollywood, family-friendly',
        clientContact: '+91 98765 43211',
        clientEmail: 'events@techcorp.com',
        inquiryDate: '2024-02-12',
        status: 'pending'
      }
    ],
    confirmed: [
      {
        id: 'BK003',
        eventTitle: 'Birthday Celebration',
        clientName: 'Anil Kumar',
        clientAvatar: '🎂',
        eventType: 'Private Party',
        date: '2024-02-20',
        time: '8:00 PM - 12:00 AM',
        venue: 'Home',
        location: 'Delhi, NCR',
        amount: 25000,
        advance: 12500,
        guests: 50,
        requirements: 'Mix of old and new Bollywood songs',
        clientContact: '+91 98765 43212',
        clientEmail: 'anil.kumar@email.com',
        inquiryDate: '2024-02-05',
        status: 'confirmed',
        advancePaid: true
      }
    ],
    completed: [
      {
        id: 'BK004',
        eventTitle: 'Sangeet Ceremony',
        clientName: 'Meera & Family',
        clientAvatar: '💃',
        eventType: 'Wedding',
        date: '2024-02-15',
        time: '7:00 PM - 10:00 PM',
        venue: 'Banquet Hall',
        location: 'Pune, Maharashtra',
        amount: 30000,
        advance: 15000,
        guests: 80,
        requirements: 'Traditional and Bollywood dance numbers',
        clientContact: '+91 98765 43213',
        clientEmail: 'meera.family@email.com',
        inquiryDate: '2024-01-25',
        status: 'completed',
        rating: 5,
        review: 'Absolutely amazing performance! Made our sangeet unforgettable.'
      }
    ]
  };

  const handleAcceptBooking = (booking: any) => {
    console.log('Accept booking:', booking.id);
  };

  const handleRejectBooking = (booking: any) => {
    console.log('Reject booking:', booking.id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      default: return 'badge-artist';
    }
  };

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="card-artist card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-artist-gold/50">
              <AvatarFallback className="bg-artist-neon-purple text-white text-2xl">
                {booking.clientAvatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white text-lg">{booking.eventTitle}</CardTitle>
              <p className="text-artist-gold font-medium">{booking.clientName}</p>
              <Badge className={`mt-1 ${getStatusColor(booking.status)}`}>
                {booking.status.toUpperCase()}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-secondary/30">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{new Date(booking.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{booking.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{booking.guests} guests</span>
          </div>
        </div>

        <div className="p-3 bg-secondary/30 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Venue</p>
          <p className="text-white font-medium">{booking.venue}</p>
        </div>

        <div className="p-3 bg-secondary/30 rounded-xl">
          <p className="text-xs text-muted-foreground mb-1">Special Requirements</p>
          <p className="text-white text-sm">{booking.requirements}</p>
        </div>

        <div className="flex items-center justify-between p-3 bg-artist-gold/10 rounded-xl">
          <div>
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="text-artist-gold font-bold text-lg">₹{booking.amount.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Advance</p>
            <p className="text-white font-medium">₹{booking.advance.toLocaleString()}</p>
          </div>
        </div>

        {booking.rating && (
          <div className="p-3 bg-artist-neon-purple/10 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= booking.rating ? 'star-filled' : 'star-empty'}`} />
                ))}
              </div>
              <span className="text-artist-gold font-medium">{booking.rating}/5</span>
            </div>
            <p className="text-white text-sm italic">"{booking.review}"</p>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t border-secondary">
          {booking.status === 'pending' && (
            <>
              <Button 
                className="flex-1 btn-artist"
                onClick={() => handleAcceptBooking(booking)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-red-500 text-red-400 hover:bg-red-500/10"
                onClick={() => handleRejectBooking(booking)}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Decline
              </Button>
            </>
          )}

          {booking.status === 'confirmed' && (
            <>
              <Button variant="outline" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                <FileText className="w-4 h-4 mr-2" />
                Invoice
              </Button>
              <Button variant="outline" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat
              </Button>
            </>
          )}

          {booking.status === 'completed' && (
            <>
              <Button variant="outline" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                <Eye className="w-4 h-4 mr-2" />
                Details
              </Button>
              <Button variant="outline" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </Button>
            </>
          )}

          <Button variant="outline" size="sm" className="border-secondary text-white hover:bg-secondary/30">
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-8 h-8 text-artist-neon-purple" />
          Booking Management
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" className="border-secondary text-white hover:bg-secondary/30">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="border-secondary text-white hover:bg-secondary/30">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-artist">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-gradient rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-artist-gold">{bookings.pending.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold text-artist-neon-purple">{bookings.confirmed.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">This Month Revenue</p>
              <p className="text-2xl font-bold text-artist-gold">₹1.25L</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-artist-gold">4.9</p>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-3 h-3 star-filled" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="card-artist">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search bookings by event, client name, or location..."
              className="pl-12 h-12 bg-secondary border-secondary text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-secondary rounded-2xl">
          <TabsTrigger value="pending" className="text-white">
            Pending ({bookings.pending.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="text-white">
            Confirmed ({bookings.confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-white">
            Completed ({bookings.completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {bookings.pending.map(renderBookingCard)}
          </div>
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {bookings.confirmed.map(renderBookingCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-6">
            {bookings.completed.map(renderBookingCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
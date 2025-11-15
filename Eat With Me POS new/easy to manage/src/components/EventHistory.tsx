import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  Trophy,
  Star,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Camera,
  Heart,
  Share2,
  Download,
  Eye,
  Search,
  Filter,
  Music,
  Crown,
  Sparkles,
  Play,
  Upload,
  Edit
} from 'lucide-react';

export function EventHistory() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const events = [
    {
      id: 'EVT001',
      title: 'Wedding Reception - Priya & Rohit',
      client: 'Sharma Family',
      clientAvatar: '👰',
      date: '2024-02-25',
      venue: 'Grand Ballroom, Hotel Taj',
      location: 'Mumbai, Maharashtra',
      type: 'wedding',
      amount: 45000,
      duration: '4 hours',
      guests: 300,
      rating: 5,
      review: 'Absolutely phenomenal! Arjun kept the energy high throughout the entire reception. Every song was perfect for the moment. Highly recommended!',
      photos: ['📸', '🎉', '💃', '🕺', '🎵'],
      isHighlight: true,
      specialNotes: 'Mixed Bollywood and Punjabi hits, special request for elderly-friendly classics',
      testimonial: 'Best DJ we could have asked for our special day!'
    },
    {
      id: 'EVT002',
      title: 'Sangeet Ceremony - Meera & Family',
      client: 'Gupta Family',
      clientAvatar: '💃',
      date: '2024-02-15',
      venue: 'Banquet Hall',
      location: 'Pune, Maharashtra',
      type: 'wedding',
      amount: 30000,
      duration: '3 hours',
      guests: 80,
      rating: 5,
      review: 'Amazing performance! Made our sangeet unforgettable with perfect dance numbers.',
      photos: ['📷', '🎭', '💃', '🎶'],
      isHighlight: false,
      specialNotes: 'Traditional and Bollywood dance numbers, coordinated with choreographer',
      testimonial: 'Every song was a hit!'
    },
    {
      id: 'EVT003',
      title: 'Corporate Annual Party - TechCorp',
      client: 'TechCorp Solutions',
      clientAvatar: '🏢',
      date: '2024-02-10',
      venue: 'Conference Hall A',
      location: 'Bangalore, Karnataka',
      type: 'corporate',
      amount: 35000,
      duration: '4 hours',
      guests: 150,
      rating: 4,
      review: 'Professional and engaging. Great mix of music that appealed to all age groups.',
      photos: ['🎊', '🕺', '🎵'],
      isHighlight: true,
      specialNotes: 'Family-friendly mix, international and Bollywood',
      testimonial: 'Made our corporate event fun and memorable!'
    },
    {
      id: 'EVT004',
      title: 'Birthday Celebration - Anil Kumar',
      client: 'Kumar Family',
      clientAvatar: '🎂',
      date: '2024-01-28',
      venue: 'Home Party',
      location: 'Delhi, NCR',
      type: 'private',
      amount: 25000,
      duration: '4 hours',
      guests: 50,
      rating: 4,
      review: 'Great energy and music selection. Everyone was dancing all night!',
      photos: ['🎈', '🎭', '🎉'],
      isHighlight: false,
      specialNotes: 'Mix of old and new Bollywood, retro hits',
      testimonial: 'Perfect soundtrack for a perfect night!'
    },
    {
      id: 'EVT005',
      title: 'New Year Party - Club Infinity',
      client: 'Club Infinity',
      clientAvatar: '🍸',
      date: '2023-12-31',
      venue: 'Club Infinity',
      location: 'Mumbai, Maharashtra',
      type: 'club',
      amount: 50000,
      duration: '6 hours',
      guests: 500,
      rating: 5,
      review: 'Incredible energy! The crowd was pumped all night. Perfect NYE celebration!',
      photos: ['🎆', '🕺', '💃', '🎵', '🎊'],
      isHighlight: true,
      specialNotes: 'High-energy EDM, commercial house, countdown special',
      testimonial: 'Best New Year party ever!'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'wedding': return 'skill-singer';
      case 'corporate': return 'skill-anchor';
      case 'private': return 'skill-performer';
      case 'club': return 'skill-dj';
      default: return 'badge-artist';
    }
  };

  const filteredEvents = events.filter(event => {
    if (activeTab === 'all') return true;
    if (activeTab === 'highlights') return event.isHighlight;
    return event.type === activeTab;
  });

  const totalEvents = events.length;
  const highlightEvents = events.filter(e => e.isHighlight).length;
  const avgRating = events.reduce((sum, e) => sum + e.rating, 0) / events.length;
  const totalRevenue = events.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Trophy className="w-8 h-8 text-artist-neon-purple" />
          Event History
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" className="border-secondary text-white hover:bg-secondary/30">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="border-secondary text-white hover:bg-secondary/30">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neon-gradient rounded-full flex items-center justify-center animate-neon-glow">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold text-artist-neon-purple">{totalEvents}</p>
                <p className="text-xs text-green-400">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold-gradient rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highlight Events</p>
                <p className="text-3xl font-bold text-artist-gold">{highlightEvents}</p>
                <p className="text-xs text-muted-foreground">Portfolio gems</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-stage-gradient rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-artist-gold">{avgRating.toFixed(1)}</p>
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 star-filled" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-gradient rounded-full flex items-center justify-center">
                <IndianRupee className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₹{(totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Lifetime</p>
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
              placeholder="Search events by client, venue, or type..."
              className="pl-12 h-12 bg-secondary border-secondary text-white"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 bg-secondary rounded-2xl">
          <TabsTrigger value="all" className="text-white">All ({totalEvents})</TabsTrigger>
          <TabsTrigger value="highlights" className="text-white">Highlights ({highlightEvents})</TabsTrigger>
          <TabsTrigger value="wedding" className="text-white">Wedding</TabsTrigger>
          <TabsTrigger value="corporate" className="text-white">Corporate</TabsTrigger>
          <TabsTrigger value="private" className="text-white">Private</TabsTrigger>
          <TabsTrigger value="club" className="text-white">Club</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="card-artist card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border-2 border-artist-gold/50">
                        <AvatarFallback className="bg-artist-neon-purple text-white text-xl">
                          {event.clientAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-lg leading-tight">{event.title}</h3>
                        <p className="text-artist-gold font-medium">{event.client}</p>
                      </div>
                    </div>
                    {event.isHighlight && (
                      <Badge className="badge-gold">
                        <Crown className="w-3 h-3 mr-1" />
                        Highlight
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-artist-gold" />
                      <span className="text-artist-gold font-medium">₹{event.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Venue</p>
                    <p className="text-white font-medium text-sm">{event.venue}</p>
                  </div>

                  {/* Event Photos */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Event Photos</p>
                    <div className="flex gap-2">
                      {event.photos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center text-lg hover:bg-secondary/70 cursor-pointer transition-colors">
                          {photo}
                        </div>
                      ))}
                      {event.photos.length > 4 && (
                        <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground hover:bg-secondary/70 cursor-pointer transition-colors">
                          +{event.photos.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating & Review */}
                  <div className="p-3 bg-artist-neon-purple/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= event.rating ? 'star-filled' : 'star-empty'}`} />
                        ))}
                      </div>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-white text-sm italic leading-relaxed">"{event.review}"</p>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-secondary">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-secondary text-white hover:bg-secondary/30"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Eye className="w-3 h-3 mr-2" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm" className="border-secondary text-white hover:bg-secondary/30">
                      <Share2 className="w-3 h-3 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="border-secondary text-white hover:bg-secondary/30">
                      {event.isHighlight ? <Heart className="w-3 h-3 text-red-500" /> : <Heart className="w-3 h-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <Card className="card-artist max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16 border-2 border-artist-gold">
                    <AvatarFallback className="bg-artist-neon-purple text-white text-2xl">
                      {selectedEvent.clientAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
                    <p className="text-artist-gold text-lg">{selectedEvent.client}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedEvent(null)}
                  className="text-white hover:bg-secondary/30"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-white font-medium">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Venue</p>
                    <p className="text-white font-medium">{selectedEvent.venue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-white font-medium">{selectedEvent.location}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="text-white font-medium">{selectedEvent.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="text-white font-medium">{selectedEvent.guests}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-artist-gold font-bold text-xl">₹{selectedEvent.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">Special Notes</p>
                <p className="text-white">{selectedEvent.specialNotes}</p>
              </div>

              {/* Rating & Testimonial */}
              <div className="p-4 bg-artist-neon-purple/10 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className={`w-5 h-5 ${star <= selectedEvent.rating ? 'star-filled' : 'star-empty'}`} />
                    ))}
                  </div>
                  <span className="text-artist-gold font-bold">{selectedEvent.rating}/5</span>
                </div>
                <p className="text-white italic mb-3">"{selectedEvent.review}"</p>
                <div className="p-3 bg-artist-gold/10 rounded-lg border-l-4 border-artist-gold">
                  <p className="text-artist-gold font-medium">"{selectedEvent.testimonial}"</p>
                </div>
              </div>

              {/* Event Photos Grid */}
              <div>
                <p className="text-white font-medium mb-3">Event Gallery</p>
                <div className="grid grid-cols-4 gap-3">
                  {selectedEvent.photos.map((photo: string, index: number) => (
                    <div key={index} className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center text-2xl hover:bg-secondary/50 cursor-pointer transition-colors">
                      {photo}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-secondary">
                <Button className="flex-1 btn-artist">
                  <Upload className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
                <Button variant="outline" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
                <Button variant="outline" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
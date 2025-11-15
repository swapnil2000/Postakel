import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Calendar,
  IndianRupee,
  Mail,
  TrendingUp,
  Clock,
  Users,
  Star,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Camera,
  Play,
  Eye,
  Heart,
  Share2,
  Mic2,
  Music,
  Crown,
  Sparkles,
  DollarSign,
  BookOpen,
  Trophy,
  Zap
} from 'lucide-react';

interface ArtistDashboardProps {
  userRole: string;
  onNavigate: (screen: string) => void;
}

export function ArtistDashboard({ userRole, onNavigate }: ArtistDashboardProps) {
  // Sample data for different roles
  const artistData = {
    upcomingBookings: 8,
    inquiries: 12,
    walletBalance: 85600,
    thisMonthEarnings: 156000,
    completedGigs: 24,
    rating: 4.9,
    profileViews: 1250
  };

  const clientData = {
    myBookings: 5,
    savedArtists: 18,
    totalSpent: 45000,
    upcomingEvents: 3
  };

  const agencyData = {
    totalArtists: 35,
    activeBookings: 42,
    monthlyRevenue: 485000,
    commission: 72750
  };

  const quickActions = {
    artist: [
      { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'bg-purple-gradient', description: 'View schedule' },
      { id: 'bookings', label: 'Bookings', icon: CheckCircle, color: 'bg-gold-gradient', description: 'Manage gigs' },
      { id: 'wallet', label: 'Wallet', icon: DollarSign, color: 'bg-stage-gradient', description: 'Earnings' },
      { id: 'profile', label: 'Portfolio', icon: Star, color: 'bg-neon-gradient', description: 'Edit profile' }
    ],
    client: [
      { id: 'browse', label: 'Browse Artists', icon: Users, color: 'bg-purple-gradient', description: 'Find talent' },
      { id: 'bookings', label: 'My Bookings', icon: Calendar, color: 'bg-gold-gradient', description: 'View events' },
      { id: 'favorites', label: 'Saved Artists', icon: Heart, color: 'bg-stage-gradient', description: 'Favorites' },
      { id: 'messages', label: 'Messages', icon: MessageCircle, color: 'bg-neon-gradient', description: 'Chat' }
    ],
    agency: [
      { id: 'artists', label: 'Artists', icon: Users, color: 'bg-purple-gradient', description: 'Manage talent' },
      { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'bg-gold-gradient', description: 'All bookings' },
      { id: 'analytics', label: 'Analytics', icon: TrendingUp, color: 'bg-stage-gradient', description: 'Performance' },
      { id: 'commission', label: 'Commission', icon: DollarSign, color: 'bg-neon-gradient', description: 'Earnings' }
    ]
  };

  const recentActivity = {
    artist: [
      { type: 'booking', title: 'New Wedding Inquiry', client: 'Priya & Rohit', amount: 25000, time: '2 hours ago', status: 'pending' },
      { type: 'payment', title: 'Payment Received', client: 'Corporate Event', amount: 35000, time: '1 day ago', status: 'completed' },
      { type: 'review', title: 'New 5★ Review', client: 'Birthday Party', rating: 5, time: '2 days ago', status: 'review' },
      { type: 'inquiry', title: 'Concert Inquiry', client: 'Music Festival', amount: 85000, time: '3 days ago', status: 'pending' }
    ],
    client: [
      { type: 'booking', title: 'Anniversary Party', artist: 'DJ Arjun', status: 'confirmed', time: '1 day ago' },
      { type: 'inquiry', title: 'Corporate Event', artist: 'Singer Priya', status: 'pending', time: '2 days ago' },
      { type: 'payment', title: 'Payment Made', artist: 'Band Fusion', amount: 15000, time: '3 days ago' }
    ],
    agency: [
      { type: 'booking', title: 'Wedding Season Spike', bookings: 15, revenue: 125000, time: '1 day ago' },
      { type: 'artist', title: 'New Artist Onboarded', artist: 'Vocalist Maya', specialty: 'Classical', time: '2 days ago' },
      { type: 'payment', title: 'Commission Earned', amount: 18500, time: '3 days ago' }
    ]
  };

  const upcomingGigs = [
    { id: 1, title: 'Wedding Reception', client: 'Sharma Family', date: 'Feb 20', time: '7:00 PM', venue: 'Hotel Grand', amount: 35000, type: 'wedding' },
    { id: 2, title: 'Corporate Party', client: 'Tech Solutions Ltd', date: 'Feb 22', time: '6:30 PM', venue: 'Conference Hall', amount: 25000, type: 'corporate' },
    { id: 3, title: 'Birthday Celebration', client: 'Rajesh Kumar', date: 'Feb 25', time: '8:00 PM', venue: 'Home', amount: 15000, type: 'private' }
  ];

  const renderArtistDashboard = () => (
    <>
      {/* Artist Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-gradient rounded-full flex items-center justify-center tap-zone">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Gigs</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-artist-neon-purple">{artistData.upcomingBookings}</p>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center tap-zone">
                <Mail className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Inquiries</p>
                <p className="text-2xl font-bold text-artist-gold">{artistData.inquiries}</p>
                <p className="text-xs text-muted-foreground">Pending response</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-stage-gradient rounded-full flex items-center justify-center tap-zone">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet Balance</p>
                <p className="text-2xl font-bold text-white">₹{(artistData.walletBalance / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Available now</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center tap-zone animate-neon-glow">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-artist-gold">{artistData.rating}</p>
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-3 h-3 star-filled" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{artistData.completedGigs} reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderClientDashboard = () => (
    <>
      {/* Client Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-gradient rounded-full flex items-center justify-center tap-zone">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Bookings</p>
                <p className="text-2xl font-bold text-artist-neon-purple">{clientData.myBookings}</p>
                <p className="text-xs text-muted-foreground">Active events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center tap-zone">
                <Heart className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saved Artists</p>
                <p className="text-2xl font-bold text-artist-gold">{clientData.savedArtists}</p>
                <p className="text-xs text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-stage-gradient rounded-full flex items-center justify-center tap-zone">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-white">₹{(clientData.totalSpent / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">All bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center tap-zone">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold text-artist-neon-purple">{clientData.upcomingEvents}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderAgencyDashboard = () => (
    <>
      {/* Agency Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-gradient rounded-full flex items-center justify-center tap-zone">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Artists</p>
                <p className="text-2xl font-bold text-artist-neon-purple">{agencyData.totalArtists}</p>
                <p className="text-xs text-muted-foreground">Active talent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center tap-zone">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Bookings</p>
                <p className="text-2xl font-bold text-artist-gold">{agencyData.activeBookings}</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-stage-gradient rounded-full flex items-center justify-center tap-zone">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-white">₹{(agencyData.monthlyRevenue / 100000).toFixed(1)}L</p>
                <p className="text-xs text-muted-foreground">Total bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-neon-gradient rounded-full flex items-center justify-center tap-zone">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="text-2xl font-bold text-artist-gold">₹{(agencyData.commission / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">15% average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleEmoji = () => {
    switch (userRole) {
      case 'artist': return '🎤';
      case 'agency': return '🎭';
      case 'client': return '🎉';
      default: return '🎤';
    }
  };

  const getRoleName = () => {
    switch (userRole) {
      case 'artist': return 'Artist';
      case 'agency': return 'Agency';
      case 'client': return 'Client';
      default: return 'User';
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="profile-header rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <div className="text-4xl animate-bounce-gentle">{getRoleEmoji()}</div>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <Avatar className="w-16 h-16 border-4 border-artist-gold shadow-xl">
            <AvatarFallback className="bg-artist-neon-purple text-white text-xl">
              {getRoleEmoji()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-white">{getGreeting()}!</h1>
            <p className="text-white/90">Ready to create some magic?</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="badge-artist">
                <Crown className="w-3 h-3 mr-1" />
                {getRoleName()}
              </Badge>
              <Badge className="badge-gold">
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Stats */}
      {userRole === 'artist' && renderArtistDashboard()}
      {userRole === 'client' && renderClientDashboard()}
      {userRole === 'agency' && renderAgencyDashboard()}

      {/* Quick Actions */}
      <Card className="card-artist">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5 text-artist-gold" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions[userRole as keyof typeof quickActions]?.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-24 flex flex-col items-center gap-3 hover:shadow-lg transition-all border-2 border-secondary hover:border-artist-neon-purple tap-zone-large card-hover rounded-2xl bg-transparent text-white"
                onClick={() => onNavigate(action.id)}
              >
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="font-bold">{action.label}</span>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity & Upcoming Gigs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="card-artist">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="w-5 h-5 text-artist-neon-purple" />
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm" className="border-secondary text-white hover:bg-artist-neon-purple/10">
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity[userRole as keyof typeof recentActivity]?.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl hover:bg-secondary/50 transition-colors card-hover"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-artist-neon-purple/20 rounded-2xl flex items-center justify-center">
                      {activity.type === 'booking' && <Calendar className="w-5 h-5 text-artist-neon-purple" />}
                      {activity.type === 'payment' && <IndianRupee className="w-5 h-5 text-artist-gold" />}
                      {activity.type === 'review' && <Star className="w-5 h-5 text-artist-gold" />}
                      {activity.type === 'inquiry' && <Mail className="w-5 h-5 text-blue-400" />}
                      {activity.type === 'artist' && <Users className="w-5 h-5 text-green-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">
                        {'title' in activity && activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {'time' in activity && activity.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {'amount' in activity && (
                      <p className="font-bold text-artist-gold">₹{activity.amount?.toLocaleString()}</p>
                    )}
                    {'status' in activity && (
                      <Badge 
                        className={
                          activity.status === 'confirmed' ? 'status-confirmed' :
                          activity.status === 'pending' ? 'status-pending' :
                          activity.status === 'completed' ? 'status-completed' :
                          'badge-artist'
                        }
                      >
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Gigs (for artists) or other relevant content */}
        {userRole === 'artist' ? (
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-artist-gold" />
                Upcoming Gigs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingGigs.map((gig) => (
                  <div key={gig.id} className="p-4 bg-secondary/30 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white">{gig.title}</h4>
                      <Badge className={
                        gig.type === 'wedding' ? 'skill-singer' :
                        gig.type === 'corporate' ? 'skill-anchor' :
                        'skill-performer'
                      }>
                        {gig.type}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-muted-foreground">Client: {gig.client}</p>
                      <p className="text-artist-gold font-bold">₹{gig.amount.toLocaleString()}</p>
                      <p className="text-muted-foreground">{gig.date} • {gig.time}</p>
                      <p className="text-muted-foreground">{gig.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <BookOpen className="w-5 h-5 text-artist-gold" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                  <span className="text-white">Profile Views</span>
                  <span className="font-bold text-artist-neon-purple">1,250</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                  <span className="text-white">Messages</span>
                  <span className="font-bold text-artist-gold">24</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                  <span className="text-white">Conversion Rate</span>
                  <span className="font-bold text-green-400">68%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
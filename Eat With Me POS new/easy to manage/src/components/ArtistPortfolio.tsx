import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Star,
  Edit,
  Camera,
  Play,
  Share2,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Music,
  Mic2,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Phone,
  Mail,
  Crown,
  Sparkles,
  Eye,
  ThumbsUp,
  Award,
  Zap
} from 'lucide-react';

export function ArtistPortfolio() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');

  const artistData = {
    id: 1,
    stageName: 'DJ Arjun',
    realName: 'Arjun Kapoor',
    bio: 'Professional DJ & Music Producer with 8+ years of experience. Specializing in Bollywood, EDM, and Punjabi beats. Making every event unforgettable with the perfect soundtrack.',
    profileImage: '🎧',
    coverImage: '🎵',
    location: 'Mumbai, Maharashtra',
    rating: 4.9,
    reviewCount: 156,
    completedGigs: 280,
    yearsExperience: 8,
    startingPrice: 15000,
    skills: [
      { name: 'DJ', level: 'Expert', color: 'skill-dj' },
      { name: 'Music Producer', level: 'Advanced', color: 'skill-performer' },
      { name: 'MC/Anchor', level: 'Intermediate', color: 'skill-anchor' }
    ],
    specialties: ['Bollywood', 'EDM', 'Punjabi', 'Commercial', 'House Music'],
    socialLinks: {
      instagram: '@dj_arjun_official',
      youtube: 'DJ Arjun Music',
      facebook: 'DJ Arjun Official',
      twitter: '@djarjun'
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'booking@djarjun.com'
    },
    availability: 'Available for bookings',
    isVerified: true
  };

  const portfolioItems = [
    { id: 1, type: 'image', url: '📸', title: 'Wedding Reception - Grand Ballroom', likes: 245, views: 1250 },
    { id: 2, type: 'video', url: '🎬', title: 'Corporate Event Highlights', likes: 189, views: 890 },
    { id: 3, type: 'audio', url: '🎵', title: 'Latest Mix - Bollywood Nights', likes: 312, views: 2100 },
    { id: 4, type: 'image', url: '📷', title: 'Concert Performance - Music Festival', likes: 567, views: 3200 },
    { id: 5, type: 'video', url: '🎥', title: 'Behind the Scenes - Studio Session', likes: 198, views: 1100 },
    { id: 6, type: 'image', url: '🖼️', title: 'Birthday Party Setup', likes: 134, views: 780 }
  ];

  const reviews = [
    {
      id: 1,
      clientName: 'Priya & Rohit',
      eventType: 'Wedding',
      rating: 5,
      comment: 'Absolutely phenomenal! Arjun kept the energy high throughout the entire reception. Every song was perfect for the moment. Highly recommended!',
      date: '2 weeks ago',
      avatar: '👰',
      photos: ['📸', '🎉', '💃']
    },
    {
      id: 2,
      clientName: 'TechCorp Solutions',
      eventType: 'Corporate Event',
      rating: 5,
      comment: 'Professional, punctual, and incredibly talented. Made our annual party memorable. The music selection was spot-on!',
      date: '1 month ago',
      avatar: '🏢',
      photos: ['🎊', '🕺']
    },
    {
      id: 3,
      clientName: 'Anika Sharma',
      eventType: 'Birthday Party',
      rating: 4,
      comment: 'Great DJ with amazing energy. The crowd was dancing all night! Would definitely book again.',
      date: '2 months ago',
      avatar: '🎂',
      photos: ['🎈', '🎭']
    }
  ];

  const pastClients = [
    { name: 'Taj Hotels', logo: '🏨', category: 'Hospitality', events: 15 },
    { name: 'Mumbai Music Festival', logo: '🎪', category: 'Music Festival', events: 3 },
    { name: 'Reliance Industries', logo: '🏭', category: 'Corporate', events: 8 },
    { name: 'Wedding Bells Planners', logo: '💒', category: 'Wedding Planning', events: 45 },
    { name: 'Club Infinity', logo: '🍸', category: 'Nightclub', events: 22 },
    { name: 'IIT Mumbai', logo: '🎓', category: 'Educational', events: 12 }
  ];

  const achievements = [
    { title: 'Best DJ 2023', organization: 'Mumbai Entertainment Awards', icon: '🏆' },
    { title: 'Top Performer', organization: 'Wedding Industry Awards', icon: '🥇' },
    { title: 'Verified Artist', organization: 'ArtistHub Platform', icon: '✅' }
  ];

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="profile-header rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 flex gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              className="btn-gold"
              onClick={() => setIsEditing(false)}
            >
              Save Changes
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-artist-gold shadow-xl">
              <AvatarFallback className="bg-artist-neon-purple text-white text-6xl">
                {artistData.profileImage}
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button 
                size="sm" 
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 btn-artist"
              >
                <Camera className="w-4 h-4" />
              </Button>
            )}
            {artistData.isVerified && (
              <div className="absolute -bottom-2 -right-2">
                <Badge className="badge-gold">
                  <Crown className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            )}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input 
                  defaultValue={artistData.stageName}
                  className="text-3xl font-bold bg-transparent border-white/20 text-white"
                />
                <Input 
                  defaultValue={artistData.realName}
                  className="text-lg bg-transparent border-white/20 text-white/80"
                />
                <Textarea 
                  defaultValue={artistData.bio}
                  className="bg-transparent border-white/20 text-white/90"
                  rows={3}
                />
              </div>
            ) : (
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {artistData.stageName}
                </h1>
                <p className="text-xl text-white/80 mb-4">{artistData.realName}</p>
                <p className="text-white/90 mb-6 max-w-2xl leading-relaxed">
                  {artistData.bio}
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="badge-artist">
                <MapPin className="w-3 h-3 mr-1" />
                {artistData.location}
              </Badge>
              <Badge className="badge-gold">
                <Star className="w-3 h-3 mr-1" />
                {artistData.rating} ({artistData.reviewCount} reviews)
              </Badge>
              <Badge className="status-confirmed">
                <Trophy className="w-3 h-3 mr-1" />
                {artistData.completedGigs} gigs completed
              </Badge>
              <Badge className="badge-neon">
                <Award className="w-3 h-3 mr-1" />
                {artistData.yearsExperience} years experience
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {artistData.skills.map((skill, index) => (
                <Badge key={index} className={skill.color}>
                  {skill.name} - {skill.level}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button className="btn-artist h-12 px-8">
                <Calendar className="w-5 h-5 mr-2" />
                Book Now - ₹{artistData.startingPrice.toLocaleString()}+
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <MessageCircle className="w-5 h-5 mr-2" />
                Message
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-secondary rounded-2xl">
          <TabsTrigger value="portfolio" className="text-white">Portfolio</TabsTrigger>
          <TabsTrigger value="reviews" className="text-white">Reviews</TabsTrigger>
          <TabsTrigger value="clients" className="text-white">Clients</TabsTrigger>
          <TabsTrigger value="achievements" className="text-white">Awards</TabsTrigger>
          <TabsTrigger value="contact" className="text-white">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          {/* Showreel Section */}
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Play className="w-5 h-5 text-artist-gold" />
                Featured Showreel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-2xl overflow-hidden bg-secondary/30 aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl mb-4">🎬</div>
                </div>
                <Button 
                  className="absolute inset-0 w-full h-full bg-black/50 hover:bg-black/40 transition-colors"
                  variant="ghost"
                >
                  <div className="w-20 h-20 bg-artist-gold rounded-full flex items-center justify-center animate-pulse-scale">
                    <Play className="w-8 h-8 text-black ml-1" />
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Gallery */}
          <Card className="card-artist">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Camera className="w-5 h-5 text-artist-neon-purple" />
                  Portfolio Gallery
                </CardTitle>
                {isEditing && (
                  <Button className="btn-artist" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Media
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="portfolio-image group cursor-pointer">
                    <div className="aspect-square bg-secondary/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                      <div className="text-6xl">{item.url}</div>
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center space-y-2">
                          {item.type === 'video' && (
                            <Play className="w-8 h-8 text-white mx-auto" />
                          )}
                          {item.type === 'audio' && (
                            <Music className="w-8 h-8 text-white mx-auto" />
                          )}
                          <div className="flex items-center gap-4 text-white text-sm">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {item.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {item.likes}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-white text-sm mt-2 font-medium">{item.title}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5 text-artist-gold" />
                Specialties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {artistData.specialties.map((specialty, index) => (
                  <Badge key={index} className="skill-dj text-lg px-4 py-2">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-artist-gold" />
                Client Reviews ({reviews.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 bg-secondary/30 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-artist-neon-purple text-white text-2xl">
                          {review.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-white">{review.clientName}</h4>
                          <Badge className="skill-performer">{review.eventType}</Badge>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 mb-3">
                          {[1,2,3,4,5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.rating ? 'star-filled' : 'star-empty'}`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-white/90 mb-4">{review.comment}</p>
                        
                        {review.photos && review.photos.length > 0 && (
                          <div className="flex gap-2">
                            {review.photos.map((photo, index) => (
                              <div key={index} className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center text-lg">
                                {photo}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="w-5 h-5 text-artist-neon-purple" />
                Past Clients & Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pastClients.map((client, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-artist-gold/20 rounded-xl flex items-center justify-center text-2xl">
                      {client.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{client.name}</h4>
                      <p className="text-xs text-muted-foreground">{client.category}</p>
                      <p className="text-xs text-artist-gold">{client.events} events</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-artist-gold" />
                Awards & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="p-6 bg-secondary/30 rounded-2xl flex items-center gap-4">
                    <div className="w-16 h-16 bg-artist-gold/20 rounded-full flex items-center justify-center text-3xl">
                      {achievement.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">{achievement.title}</h4>
                      <p className="text-artist-gold">{achievement.organization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-artist">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageCircle className="w-5 h-5 text-artist-neon-purple" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-artist-gold" />
                  <span className="text-white">{artistData.contact.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-artist-gold" />
                  <span className="text-white">{artistData.contact.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-artist-gold" />
                  <span className="text-white">{artistData.location}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="card-artist">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="w-5 h-5 text-artist-gold" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-pink-400" />
                  <span className="text-white">{artistData.socialLinks.instagram}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Youtube className="w-5 h-5 text-red-400" />
                  <span className="text-white">{artistData.socialLinks.youtube}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Facebook className="w-5 h-5 text-blue-400" />
                  <span className="text-white">{artistData.socialLinks.facebook}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-sky-400" />
                  <span className="text-white">{artistData.socialLinks.twitter}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
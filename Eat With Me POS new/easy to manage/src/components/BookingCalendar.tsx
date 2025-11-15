import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  IndianRupee,
  Users,
  X,
  Edit,
  Trash2,
  Music,
  Crown,
  Sparkles
} from 'lucide-react';

export function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Wedding Reception',
      client: 'Priya & Rohit',
      date: new Date(2024, 1, 25), // Feb 25, 2024
      startTime: '19:00',
      endTime: '23:00',
      venue: 'Grand Ballroom',
      amount: 45000,
      status: 'confirmed',
      type: 'wedding'
    },
    {
      id: 2,
      title: 'Corporate Party',
      client: 'TechCorp',
      date: new Date(2024, 2, 5), // Mar 5, 2024
      startTime: '18:00',
      endTime: '22:00',
      venue: 'Conference Hall',
      amount: 35000,
      status: 'confirmed',
      type: 'corporate'
    },
    {
      id: 3,
      title: 'Birthday Celebration',
      client: 'Anil Kumar',
      date: new Date(2024, 1, 20), // Feb 20, 2024
      startTime: '20:00',
      endTime: '00:00',
      venue: 'Home',
      amount: 25000,
      status: 'pending',
      type: 'private'
    }
  ];

  const unavailableDates = [
    new Date(2024, 1, 28), // Feb 28, 2024
    new Date(2024, 2, 15), // Mar 15, 2024
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isUnavailable = (date: Date) => {
    return unavailableDates.some(unavailableDate =>
      unavailableDate.toDateString() === date.toDateString()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'wedding': return 'bg-pink-500';
      case 'corporate': return 'bg-blue-500';
      case 'private': return 'bg-green-500';
      default: return 'bg-artist-neon-purple';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'pending': return 'status-pending';
      default: return 'badge-artist';
    }
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-8 h-8 text-artist-neon-purple" />
          Booking Calendar
        </h1>
        <div className="flex gap-3">
          <Button variant="outline" className="border-secondary text-white hover:bg-secondary/30">
            <Edit className="w-4 h-4 mr-2" />
            Availability
          </Button>
          <Button className="btn-artist">
            <Plus className="w-4 h-4 mr-2" />
            Block Date
          </Button>
        </div>
      </div>

      {/* Calendar Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-artist">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-gradient rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold text-artist-neon-purple">8</p>
                <p className="text-xs text-muted-foreground">Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gold-gradient rounded-full flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold text-artist-gold">₹2.5L</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Available Days</p>
              <p className="text-2xl font-bold text-white">22</p>
              <p className="text-xs text-muted-foreground">Out of 28</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-artist">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Next Event</p>
              <p className="text-lg font-bold text-artist-gold">Feb 20</p>
              <p className="text-xs text-muted-foreground">Birthday Party</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="card-artist">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-xl">{monthYear}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="text-white hover:bg-secondary/30"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="text-white hover:bg-secondary/30"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-24"></div>;
                  }

                  const dayEvents = getEventsForDate(day);
                  const isUnavailableDay = isUnavailable(day);
                  const isTodayDate = isToday(day);

                  return (
                    <div
                      key={day.getDate()}
                      className={`h-24 p-1 border rounded-lg cursor-pointer transition-all hover:border-artist-neon-purple/50 ${
                        isTodayDate ? 'border-artist-gold bg-artist-gold/10' :
                        isUnavailableDay ? 'border-red-500/50 bg-red-500/10' :
                        'border-secondary bg-secondary/20'
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isTodayDate ? 'text-artist-gold' :
                        isUnavailableDay ? 'text-red-400' :
                        'text-white'
                      }`}>
                        {day.getDate()}
                      </div>
                      
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                          <div
                            key={event.id}
                            className={`text-xs px-1 py-0.5 rounded text-white truncate ${getEventTypeColor(event.type)}`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>

                      {isUnavailableDay && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 rounded-lg">
                          <X className="w-4 h-4 text-red-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Wedding</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Corporate</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-sm text-muted-foreground">Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500/50 rounded"></div>
                  <span className="text-sm text-muted-foreground">Unavailable</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-6">
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-artist-gold" />
                {selectedDate ? 
                  selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 
                  'Select a Date'
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="p-4 bg-secondary/30 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-white">{event.title}</h4>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{event.client}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-artist-gold" />
                            <span className="text-artist-gold font-medium">₹{event.amount.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2 border-t border-secondary">
                          <Button variant="outline" size="sm" className="flex-1 border-secondary text-white hover:bg-secondary/30">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No events on this date</p>
                      <Button className="mt-3 btn-artist" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Event
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Click on a date to view events</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-artist">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-artist-gold" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full btn-artist justify-start">
                <Plus className="w-4 h-4 mr-3" />
                Block Unavailable Date
              </Button>
              <Button variant="outline" className="w-full justify-start border-secondary text-white hover:bg-secondary/30">
                <Calendar className="w-4 h-4 mr-3" />
                Set Regular Availability
              </Button>
              <Button variant="outline" className="w-full justify-start border-secondary text-white hover:bg-secondary/30">
                <Music className="w-4 h-4 mr-3" />
                Add Personal Event
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInMinutes, addMinutes, isWithinInterval, parseISO, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Clock, 
  Play,
  Pause,
  Square,
  Coffee,
  Utensils,
  Calendar as CalendarIcon,
  Users,
  Edit,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Clock3,
  MapPin,
  User,
  Eye,
  Timer,
  BarChart3,
  TrendingUp,
  Activity,
  Moon,
  Sun,
  Zap,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  CheckSquare,
  LogIn,
  LogOut,
  HardDrive
} from 'lucide-react';

interface TimeTrackerProps {
  userRole: 'admin' | 'employee';
  currentUser?: any;
  employees?: any[];
  appData?: any;
  onUpdateAppData?: (module: string, data: any) => void;
}

interface TimeSession {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  breaks: BreakSession[];
  totalWorked: number; // minutes
  totalBreakTime: number; // minutes
  status: 'active' | 'completed' | 'paused' | 'absent';
  notes: string;
  location: string;
  project?: string;
  tasks: string[];
  overtime: number; // minutes
  isLate: boolean;
  expectedHours: number; // minutes (480 = 8 hours)
}

interface BreakSession {
  id: string;
  type: 'coffee' | 'lunch' | 'personal' | 'meeting';
  startTime: string;
  endTime: string | null;
  duration: number; // minutes
  notes: string;
}

interface Employee {
  id: string;
  name: string;
  avatar: string;
  department: string;
  workSchedule: {
    startTime: string;
    endTime: string;
    workingDays: string[];
  };
  isActive: boolean;
  currentSession?: TimeSession;
}

export function TimeTracker({ 
  userRole, 
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  appData = {},
  onUpdateAppData = () => {}
}: TimeTrackerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [currentBreak, setCurrentBreak] = useState<BreakSession | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<{from: Date | undefined, to: Date | undefined}>({from: undefined, to: undefined});
  const [filterEmployee, setFilterEmployee] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBreakDialog, setShowBreakDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  // Convert employees to TimeTracker format with default work schedules
  const timeTrackerEmployees: Employee[] = employees.map(emp => ({
    id: emp.id.toString(),
    name: emp.name,
    avatar: emp.avatar || emp.name.split(' ').map((n: string) => n[0]).join(''),
    department: emp.department || 'General',
    workSchedule: {
      startTime: '09:00',
      endTime: '17:00',
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    isActive: emp.status === 'active'
  }));

  // Get time sessions from appData or initialize empty
  const [timeSessions, setTimeSessions] = useState<TimeSession[]>(() => {
    if (appData.timeTracking?.sessions) {
      return appData.timeTracking.sessions;
    }
    return [];
  });

  const [newBreak, setNewBreak] = useState({
    type: 'coffee' as BreakSession['type'],
    notes: ''
  });

  // Calculate current session and checked-in status
  const currentSession = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return timeSessions.find(session => 
      session.employeeId === currentUser.id.toString() && 
      session.date === today
    ) || null;
  }, [timeSessions, currentUser]);

  const isCheckedIn = useMemo(() => {
    return currentSession ? currentSession.status === 'active' : false;
  }, [currentSession]);

  // Get today's total hours for current user
  const getTodayHours = useMemo(() => {
    if (!currentSession) return 0;
    
    if (currentSession.status === 'active' && currentSession.clockIn) {
      const worked = differenceInMinutes(new Date(), new Date(`${currentSession.date}T${currentSession.clockIn}`));
      return Math.max(0, (worked - currentSession.totalBreakTime) / 60);
    }
    
    return currentSession.totalWorked / 60;
  }, [currentSession]);

  // Get week's total hours for current user
  const getWeekHours = useMemo(() => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    
    return timeSessions
      .filter(session => 
        session.employeeId === currentUser.id.toString() &&
        isWithinInterval(new Date(session.date), { start: weekStart, end: weekEnd })
      )
      .reduce((total, session) => total + (session.totalWorked / 60), 0);
  }, [timeSessions, currentUser]);

  // Get month's total hours for current user
  const getMonthHours = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    
    return timeSessions
      .filter(session => 
        session.employeeId === currentUser.id.toString() &&
        isWithinInterval(new Date(session.date), { start: monthStart, end: monthEnd })
      )
      .reduce((total, session) => total + (session.totalWorked / 60), 0);
  }, [timeSessions, currentUser]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync timeSessions with appData
  useEffect(() => {
    onUpdateAppData('timeTracking', {
      sessions: timeSessions,
      currentSession: currentSession,
      totalHoursToday: getTodayHours,
      totalHoursWeek: getWeekHours,
      totalHoursMonth: getMonthHours,
      isCheckedIn: isCheckedIn
    });
  }, [timeSessions, currentSession, isCheckedIn]);

  // Clock in function
  const handleClockIn = (location: string = 'Office', project: string = '') => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const timeString = format(now, 'HH:mm:ss');
    
    const existingSession = timeSessions.find(s => 
      s.employeeId === currentUser.id.toString() && s.date === today
    );

    if (existingSession) {
      // Update existing session
      const updatedSessions = timeSessions.map(session => 
        session.id === existingSession.id 
          ? { ...session, clockIn: timeString, status: 'active' as const, location, project }
          : session
      );
      setTimeSessions(updatedSessions);
    } else {
      // Create new session
      const newSession: TimeSession = {
        id: `session-${today}-${currentUser.id}`,
        employeeId: currentUser.id.toString(),
        employeeName: currentUser.name,
        date: today,
        clockIn: timeString,
        clockOut: null,
        breaks: [],
        totalWorked: 0,
        totalBreakTime: 0,
        status: 'active',
        notes: '',
        location,
        project,
        tasks: [],
        overtime: 0,
        isLate: now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 15),
        expectedHours: 480 // 8 hours
      };
      
      setTimeSessions(prev => [...prev, newSession]);
    }
    
    setActiveTimer(currentUser.id.toString());
  };

  // Clock out function
  const handleClockOut = () => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const timeString = format(now, 'HH:mm:ss');
    
    const updatedSessions = timeSessions.map(session => {
      if (session.employeeId === currentUser.id.toString() && session.date === today && session.status === 'active') {
        const totalWorked = session.clockIn 
          ? differenceInMinutes(now, new Date(`${session.date}T${session.clockIn}`)) - session.totalBreakTime
          : 0;
        
        return {
          ...session,
          clockOut: timeString,
          status: 'completed' as const,
          totalWorked: Math.max(0, totalWorked),
          overtime: Math.max(0, totalWorked - session.expectedHours)
        };
      }
      return session;
    });
    
    setTimeSessions(updatedSessions);
    setActiveTimer(null);
  };

  // Start break function
  const handleStartBreak = (type: BreakSession['type'] = 'coffee', notes: string = '') => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const timeString = format(now, 'HH:mm:ss');
    
    const breakSession: BreakSession = {
      id: `break-${today}-${currentUser.id}-${Date.now()}`,
      type,
      startTime: timeString,
      endTime: null,
      duration: 0,
      notes
    };
    
    const updatedSessions = timeSessions.map(session => {
      if (session.employeeId === currentUser.id.toString() && session.date === today) {
        return {
          ...session,
          breaks: [...session.breaks, breakSession],
          status: 'paused' as const
        };
      }
      return session;
    });
    
    setTimeSessions(updatedSessions);
    setCurrentBreak(breakSession);
    setShowBreakDialog(false);
  };

  // End break function
  const handleEndBreak = () => {
    if (!currentBreak) return;
    
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const timeString = format(now, 'HH:mm:ss');
    
    const duration = differenceInMinutes(now, new Date(`${today}T${currentBreak.startTime}`));
    
    const updatedSessions = timeSessions.map(session => {
      if (session.employeeId === currentUser.id.toString() && session.date === today) {
        const updatedBreaks = session.breaks.map(br => 
          br.id === currentBreak.id 
            ? { ...br, endTime: timeString, duration }
            : br
        );
        
        const totalBreakTime = updatedBreaks.reduce((total, br) => total + br.duration, 0);
        
        return {
          ...session,
          breaks: updatedBreaks,
          totalBreakTime,
          status: 'active' as const
        };
      }
      return session;
    });
    
    setTimeSessions(updatedSessions);
    setCurrentBreak(null);
  };

  // Filter sessions based on current filters
  const getFilteredSessions = () => {
    let filtered = timeSessions;
    
    // Employee filter
    if (filterEmployee !== 'all') {
      filtered = filtered.filter(session => session.employeeId === filterEmployee);
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(session => session.status === filterStatus);
    }
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(session => 
        session.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.project?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.notes.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Date filter
    if (activeTab === 'today') {
      const today = format(new Date(), 'yyyy-MM-dd');
      filtered = filtered.filter(session => session.date === today);
    } else if (activeTab === 'week') {
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      filtered = filtered.filter(session => 
        isWithinInterval(new Date(session.date), { start: weekStart, end: weekEnd })
      );
    } else if (activeTab === 'month') {
      const monthStart = startOfMonth(new Date());
      const monthEnd = endOfMonth(new Date());
      filtered = filtered.filter(session => 
        isWithinInterval(new Date(session.date), { start: monthStart, end: monthEnd })
      );
    } else if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(session => session.date === dateStr);
    } else if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(session => 
        isWithinInterval(new Date(session.date), { start: dateRange.from!, end: dateRange.to! })
      );
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredSessions = getFilteredSessions();

  // Get session status badge
  const getStatusBadge = (status: TimeSession['status']) => {
    const statusConfig = {
      active: { label: 'Active', className: 'status-active', icon: Play },
      completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle },
      paused: { label: 'On Break', className: 'status-pending', icon: Pause },
      absent: { label: 'Absent', className: 'status-rejected', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  // Format time duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Calculate productivity score
  const getProductivityScore = (session: TimeSession) => {
    if (session.expectedHours === 0) return 0;
    return Math.min(100, Math.round((session.totalWorked / session.expectedHours) * 100));
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Timer className="w-5 h-5 text-white" />
            </div>
            Time Tracker
          </h1>
          <p className="text-gray-600">
            Track work hours and manage attendance
          </p>
        </div>
        
        {userRole === 'admin' && (
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </div>
        )}
      </div>

      {/* Clock In/Out Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="mb-4">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {format(currentTime, 'HH:mm:ss')}
                </div>
                <div className="text-lg text-gray-600">
                  {format(currentTime, 'EEEE, MMMM do, yyyy')}
                </div>
              </div>
              
              {currentSession && (
                <div className="mb-6 p-4 bg-white rounded-lg">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {getTodayHours.toFixed(1)}h
                      </div>
                      <div className="text-sm text-gray-600">Today</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {getWeekHours.toFixed(1)}h
                      </div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {currentSession.breaks.length}
                      </div>
                      <div className="text-sm text-gray-600">Breaks</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {getProductivityScore(currentSession)}%
                      </div>
                      <div className="text-sm text-gray-600">Productivity</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                {!isCheckedIn ? (
                  <Button 
                    size="lg" 
                    className="clock-button"
                    onClick={() => handleClockIn()}
                  >
                    <LogIn className="w-6 h-6 mr-2" />
                    Clock In
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      className="clock-button clocked-in"
                      onClick={handleClockOut}
                    >
                      <LogOut className="w-6 h-6 mr-2" />
                      Clock Out
                    </Button>
                    
                    <div className="flex gap-2">
                      {!currentBreak ? (
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowBreakDialog(true)}
                        >
                          <Coffee className="w-4 h-4 mr-2" />
                          Start Break
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={handleEndBreak}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          End Break
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              {currentSession && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  {getStatusBadge(currentSession.status)}
                  {currentSession.location && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {currentSession.location}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sessions, projects, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {userRole === 'admin' && (
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="All Employees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {timeTrackerEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">On Break</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Time Period Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <TimeSessionsList sessions={filteredSessions} />
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <TimeSessionsList sessions={filteredSessions} />
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <TimeSessionsList sessions={filteredSessions} />
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover open={showDateRangePicker} onOpenChange={setShowDateRangePicker}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dateRange.from && dateRange.to ? 
                    `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}` :
                    'Select Range'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => setDateRange(range || {from: undefined, to: undefined})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <TimeSessionsList sessions={filteredSessions} />
        </TabsContent>
      </Tabs>

      {/* Break Dialog */}
      <Dialog open={showBreakDialog} onOpenChange={setShowBreakDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Break</DialogTitle>
            <DialogDescription>
              Select the type of break you're taking
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Break Type</Label>
              <Select value={newBreak.type} onValueChange={(value) => setNewBreak(prev => ({...prev, type: value as BreakSession['type']}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coffee">Coffee Break</SelectItem>
                  <SelectItem value="lunch">Lunch Break</SelectItem>
                  <SelectItem value="personal">Personal Break</SelectItem>
                  <SelectItem value="meeting">Meeting Break</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                placeholder="Add any notes about your break..."
                value={newBreak.notes}
                onChange={(e) => setNewBreak(prev => ({...prev, notes: e.target.value}))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowBreakDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handleStartBreak(newBreak.type, newBreak.notes)}
              >
                Start Break
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Time Sessions List Component
function TimeSessionsList({ sessions }: { sessions: TimeSession[] }) {
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return format(new Date(`2000-01-01T${timeString}`), 'HH:mm');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusBadge = (status: TimeSession['status']) => {
    const statusConfig = {
      active: { label: 'Active', className: 'status-active', icon: Play },
      completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle },
      paused: { label: 'On Break', className: 'status-pending', icon: Pause },
      absent: { label: 'Absent', className: 'status-rejected', icon: XCircle }
    };
    
    const config = statusConfig[status];
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.className} flex items-center gap-1`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Time Sessions Found</h3>
          <p className="text-gray-600">No time tracking data found for the selected criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="hr-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="avatar-medium bg-blue-100 text-blue-700">
                  <AvatarFallback>
                    {session.employeeName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{session.employeeName}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.date), 'EEEE, MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(session.status)}
                {session.isLate && (
                  <Badge className="status-rejected">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Late
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {formatTime(session.clockIn)}
                </div>
                <div className="text-xs text-gray-600">Clock In</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {formatTime(session.clockOut)}
                </div>
                <div className="text-xs text-gray-600">Clock Out</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {formatDuration(session.totalWorked)}
                </div>
                <div className="text-xs text-gray-600">Total Worked</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {session.breaks.length}
                </div>
                <div className="text-xs text-gray-600">Breaks</div>
              </div>
            </div>
            
            {session.breaks.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Breaks</h4>
                <div className="space-y-2">
                  {session.breaks.map((breakSession) => (
                    <div key={breakSession.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium capitalize">{breakSession.type}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatTime(breakSession.startTime)} - {formatTime(breakSession.endTime)} 
                        ({formatDuration(breakSession.duration)})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {session.location && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {session.location}
                  </div>
                )}
                {session.project && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <HardDrive className="w-4 h-4" />
                    {session.project}
                  </div>
                )}
              </div>
              
              {session.overtime > 0 && (
                <Badge className="status-pending">
                  <Clock className="w-3 h-3 mr-1" />
                  +{formatDuration(session.overtime)} OT
                </Badge>
              )}
            </div>
            
            {session.notes && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">{session.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
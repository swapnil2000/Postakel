import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users,
  Calendar,
  IndianRupee,
  TrendingUp,
  Clock,
  BookOpen,
  Bell,
  Award,
  Music,
  Palette,
  Heart,
  Star,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Camera,
  Play,
  Target,
  Gift,
  Sparkles
} from 'lucide-react';

interface ClassManagementDashboardProps {
  userRole: string;
  onNavigate: (screen: string) => void;
}

export function ClassManagementDashboard({ userRole, onNavigate }: ClassManagementDashboardProps) {
  // Sample data for different roles
  const ownerData = {
    totalStudents: 156,
    todaysClasses: 8,
    feesCollected: 45600,
    thisMonth: 285000,
    pendingFees: 12,
    activeInstructors: 6
  };

  const instructorData = {
    todayClasses: 4,
    totalStudents: 32,
    completedClasses: 3,
    nextClass: 'Advanced Guitar - 4:00 PM',
    attendanceRate: 92
  };

  const studentData = {
    todayClass: 'Watercolor Painting - 3:00 PM',
    completedAssignments: 8,
    pendingAssignments: 2,
    totalProgress: 75,
    certificates: 3,
    nextAssignment: 'Practice scales - Due tomorrow'
  };

  const parentData = {
    childName: 'Aarav Sharma',
    todayClass: 'Classical Dance - 5:00 PM',
    thisWeekAttendance: '4/4',
    nextFeesDue: '15 Feb',
    recentProgress: 'Excellent improvement in Bharatanatyam basics'
  };

  const quickActions = {
    owner: [
      { id: 'enrollment', label: 'Add Student', icon: Users, color: 'bg-primary', description: 'Enroll new student' },
      { id: 'schedule', label: 'Classes', icon: Calendar, color: 'bg-creative-mint', description: 'Manage schedule' },
      { id: 'attendance', label: 'Attendance', icon: CheckCircle, color: 'bg-blue-500', description: 'Mark attendance' },
      { id: 'fees', label: 'Fees', icon: IndianRupee, color: 'bg-yellow-500', description: 'Collect payments' }
    ],
    instructor: [
      { id: 'attendance', label: 'Attendance', icon: CheckCircle, color: 'bg-primary', description: 'Mark today' },
      { id: 'homework', label: 'Homework', icon: BookOpen, color: 'bg-creative-mint', description: 'Assign tasks' },
      { id: 'progress', label: 'Progress', icon: Target, color: 'bg-blue-500', description: 'Track students' },
      { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'bg-yellow-500', description: 'View classes' }
    ],
    student: [
      { id: 'homework', label: 'Homework', icon: BookOpen, color: 'bg-primary', description: 'View assignments' },
      { id: 'progress', label: 'Progress', icon: Award, color: 'bg-creative-mint', description: 'My achievements' },
      { id: 'gallery', label: 'Gallery', icon: Camera, color: 'bg-blue-500', description: 'Class photos' },
      { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'bg-yellow-500', description: 'My classes' }
    ],
    parent: [
      { id: 'progress', label: 'Progress', icon: Target, color: 'bg-primary', description: 'Child progress' },
      { id: 'attendance', label: 'Attendance', icon: CheckCircle, color: 'bg-creative-mint', description: 'Track presence' },
      { id: 'fees', label: 'Fees', icon: IndianRupee, color: 'bg-blue-500', description: 'Pay dues' },
      { id: 'notices', label: 'Notices', icon: Bell, color: 'bg-yellow-500', description: 'School updates' }
    ]
  };

  const recentActivity = {
    owner: [
      { type: 'enrollment', student: 'Priya Patel', subject: 'Bharatanatyam', time: '2 hours ago' },
      { type: 'payment', student: 'Arjun Kumar', amount: 2500, time: '4 hours ago' },
      { type: 'class', subject: 'Guitar Basics', instructor: 'Rahul Sir', time: '6 hours ago' }
    ],
    instructor: [
      { type: 'attendance', class: 'Advanced Piano', present: 8, total: 10, time: '1 hour ago' },
      { type: 'homework', subject: 'Practice Beethoven Sonata', students: 12, time: '3 hours ago' },
      { type: 'progress', student: 'Meera Shah', achievement: 'Completed Grade 2', time: '1 day ago' }
    ],
    student: [
      { type: 'class', subject: 'Oil Painting', status: 'completed', time: '2 hours ago' },
      { type: 'homework', task: 'Color theory practice', status: 'submitted', time: '1 day ago' },
      { type: 'achievement', title: 'Perfect Attendance', points: 50, time: '2 days ago' }
    ],
    parent: [
      { type: 'attendance', status: 'present', subject: 'Violin Practice', time: '3 hours ago' },
      { type: 'homework', subject: 'Scale practice', status: 'completed', time: '1 day ago' },
      { type: 'progress', note: 'Excellent improvement in rhythm', time: '2 days ago' }
    ]
  };

  const upcomingEvents = [
    { title: 'Annual Art Exhibition', date: 'Feb 20', type: 'event', color: 'bg-purple-100 text-purple-700' },
    { title: 'Dance Performance', date: 'Feb 25', type: 'performance', color: 'bg-pink-100 text-pink-700' },
    { title: 'Music Recital', date: 'Mar 5', type: 'recital', color: 'bg-blue-100 text-blue-700' }
  ];

  const renderOwnerDashboard = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-gradient border-purple-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-3xl flex items-center justify-center tap-zone">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-primary">{ownerData.totalStudents}</p>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">+12 this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-gradient border-green-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-creative-mint rounded-3xl flex items-center justify-center tap-zone text-gray-800">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Classes</p>
                <p className="text-2xl font-bold text-green-600">{ownerData.todaysClasses}</p>
                <p className="text-xs text-muted-foreground">6 instructors active</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sky-gradient border-blue-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-3xl flex items-center justify-center tap-zone">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fees Collected</p>
                <p className="text-2xl font-bold text-blue-600">₹{(ownerData.feesCollected / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-peach-gradient border-orange-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-3xl flex items-center justify-center tap-zone">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Fees</p>
                <p className="text-2xl font-bold text-orange-600">{ownerData.pendingFees}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderInstructorDashboard = () => (
    <>
      {/* Instructor Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-gradient border-purple-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-3xl flex items-center justify-center tap-zone">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Classes</p>
                <p className="text-2xl font-bold text-primary">{instructorData.todayClasses}</p>
                <p className="text-xs text-muted-foreground">{instructorData.completedClasses} completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-gradient border-green-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-creative-mint rounded-3xl flex items-center justify-center tap-zone text-gray-800">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Students</p>
                <p className="text-2xl font-bold text-green-600">{instructorData.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Across all batches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sky-gradient border-blue-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-3xl flex items-center justify-center tap-zone">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{instructorData.attendanceRate}%</p>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-peach-gradient border-orange-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-3xl flex items-center justify-center tap-zone">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Class</p>
                <p className="text-sm font-bold text-orange-600">Advanced Guitar</p>
                <p className="text-xs text-muted-foreground">4:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderStudentDashboard = () => (
    <>
      {/* Student Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-gradient border-purple-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-3xl flex items-center justify-center tap-zone">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Class</p>
                <p className="text-sm font-bold text-primary">Painting</p>
                <p className="text-xs text-muted-foreground">3:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-gradient border-green-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-creative-mint rounded-3xl flex items-center justify-center tap-zone text-gray-800">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Assignments</p>
                <p className="text-2xl font-bold text-green-600">{studentData.completedAssignments}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sky-gradient border-blue-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-3xl flex items-center justify-center tap-zone">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-blue-600">{studentData.totalProgress}%</p>
                <p className="text-xs text-muted-foreground">Overall</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-peach-gradient border-orange-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-3xl flex items-center justify-center tap-zone">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold text-orange-600">{studentData.certificates}</p>
                <p className="text-xs text-muted-foreground">Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );

  const renderParentDashboard = () => (
    <>
      {/* Parent Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-gradient border-purple-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-3xl flex items-center justify-center tap-zone">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Child</p>
                <p className="text-lg font-bold text-primary">{parentData.childName}</p>
                <p className="text-xs text-muted-foreground">Classical Dance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-gradient border-green-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-creative-mint rounded-3xl flex items-center justify-center tap-zone text-gray-800">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold text-green-600">{parentData.thisWeekAttendance}</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sky-gradient border-blue-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-3xl flex items-center justify-center tap-zone">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Fees</p>
                <p className="text-xl font-bold text-blue-600">{parentData.nextFeesDue}</p>
                <p className="text-xs text-muted-foreground">Due date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-peach-gradient border-orange-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-3xl flex items-center justify-center tap-zone">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-lg font-bold text-orange-600">Excellent</p>
                <p className="text-xs text-muted-foreground">This month</p>
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
      case 'owner': return '🎨';
      case 'instructor': return '🎵';
      case 'student': return '🎭';
      case 'parent': return '👨‍👩‍👧‍👦';
      default: return '🎨';
    }
  };

  const getRoleName = () => {
    switch (userRole) {
      case 'owner': return 'Class Owner';
      case 'instructor': return 'Instructor';
      case 'student': return 'Student';
      case 'parent': return 'Parent';
      default: return 'User';
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="bg-rainbow-gradient rounded-3xl p-6 relative overflow-hidden card-hover text-white">
        <div className="absolute top-4 right-4">
          <div className="text-4xl animate-bounce-gentle">{getRoleEmoji()}</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
            <AvatarFallback className="bg-white text-primary text-xl">
              {getRoleEmoji()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{getGreeting()}!</h1>
            <p className="text-white/90">Welcome back to your creative space</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Sparkles className="w-3 h-3 mr-1" />
                {getRoleName()}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Stats */}
      {userRole === 'owner' && renderOwnerDashboard()}
      {userRole === 'instructor' && renderInstructorDashboard()}
      {userRole === 'student' && renderStudentDashboard()}
      {userRole === 'parent' && renderParentDashboard()}

      {/* Quick Actions */}
      <Card className="card-creative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions[userRole as keyof typeof quickActions]?.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-24 flex flex-col items-center gap-3 hover:shadow-lg transition-all border-2 hover:border-primary/50 tap-zone-large card-hover rounded-2xl"
                onClick={() => onNavigate(action.id)}
              >
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <span className="font-medium">{action.label}</span>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Upcoming Events */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="card-creative">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
              <Button variant="outline" size="sm" className="rounded-xl tap-zone">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity[userRole as keyof typeof recentActivity]?.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-accent/30 rounded-2xl hover:bg-accent/50 transition-colors card-hover"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                      {activity.type === 'enrollment' && <Users className="w-5 h-5 text-primary" />}
                      {activity.type === 'payment' && <IndianRupee className="w-5 h-5 text-green-600" />}
                      {activity.type === 'class' && <Calendar className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'attendance' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {activity.type === 'homework' && <BookOpen className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'progress' && <Target className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'achievement' && <Award className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {'student' in activity && activity.student}
                        {'class' in activity && activity.class}
                        {'subject' in activity && activity.subject}
                        {'task' in activity && activity.task}
                        {'title' in activity && activity.title}
                        {'status' in activity && activity.status}
                        {'note' in activity && activity.note}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {'time' in activity && activity.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {'amount' in activity && (
                      <p className="font-bold text-green-600">₹{activity.amount}</p>
                    )}
                    {'present' in activity && (
                      <p className="font-medium">{activity.present}/{activity.total}</p>
                    )}
                    {'points' in activity && (
                      <Badge className="badge-creative">+{activity.points}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="card-creative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 bg-accent/30 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <Badge variant="outline" className={event.color}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{event.date}</p>
                      <Button size="sm" variant="outline" className="mt-2 rounded-xl tap-zone">
                        Details
                      </Button>
                    </div>
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
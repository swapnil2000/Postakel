import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { 
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Camera,
  Star,
  Clock,
  Music,
  Palette,
  Heart,
  BookOpen,
  Award,
  Target,
  UserPlus,
  Sparkles
} from 'lucide-react';

export function StudentEnrollment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [activeTab, setActiveTab] = useState('students');
  const [showAddStudent, setShowAddStudent] = useState(false);

  const batches = [
    { id: 'all', name: 'All Students', count: 156, color: 'bg-gray-100' },
    { id: 'morning-dance', name: 'Morning Dance', count: 24, color: 'bg-pink-100', subject: 'Classical Dance', time: '9:00 AM' },
    { id: 'evening-art', name: 'Evening Art', count: 18, color: 'bg-purple-100', subject: 'Painting', time: '5:00 PM' },
    { id: 'guitar-basic', name: 'Guitar Basics', count: 15, color: 'bg-yellow-100', subject: 'Guitar', time: '4:00 PM' },
    { id: 'piano-advanced', name: 'Piano Advanced', count: 12, color: 'bg-blue-100', subject: 'Piano', time: '6:00 PM' },
    { id: 'math-tuition', name: 'Math Tuition', count: 32, color: 'bg-green-100', subject: 'Mathematics', time: '3:00 PM' },
    { id: 'violin-intermediate', name: 'Violin Intermediate', count: 9, color: 'bg-orange-100', subject: 'Violin', time: '2:00 PM' }
  ];

  const students = [
    {
      id: 1,
      name: 'Aarav Sharma',
      age: 8,
      phone: '+91 98765 43210',
      email: 'aarav.parent@email.com',
      address: 'Green Park, Delhi',
      batch: 'morning-dance',
      subject: 'Classical Dance',
      joinDate: '2024-01-15',
      parentName: 'Rajesh Sharma',
      parentPhone: '+91 98765 43210',
      photo: '👦',
      progress: 85,
      attendance: 92,
      fees: { paid: true, amount: 2500, dueDate: '2024-02-15' }
    },
    {
      id: 2,
      name: 'Priya Patel',
      age: 12,
      phone: '+91 98765 43211',
      email: 'priya.parent@email.com',
      address: 'Bandra, Mumbai',
      batch: 'evening-art',
      subject: 'Painting',
      joinDate: '2024-01-10',
      parentName: 'Meera Patel',
      parentPhone: '+91 98765 43211',
      photo: '👧',
      progress: 78,
      attendance: 88,
      fees: { paid: false, amount: 3000, dueDate: '2024-02-10' }
    },
    {
      id: 3,
      name: 'Arjun Kumar',
      age: 15,
      phone: '+91 98765 43212',
      email: 'arjun.parent@email.com',
      address: 'Whitefield, Bangalore',
      batch: 'guitar-basic',
      subject: 'Guitar',
      joinDate: '2024-01-20',
      parentName: 'Sunita Kumar',
      parentPhone: '+91 98765 43212',
      photo: '👨',
      progress: 92,
      attendance: 95,
      fees: { paid: true, amount: 2000, dueDate: '2024-02-20' }
    },
    {
      id: 4,
      name: 'Ananya Gupta',
      age: 10,
      phone: '+91 98765 43213',
      email: 'ananya.parent@email.com',
      address: 'Koramangala, Bangalore',
      batch: 'piano-advanced',
      subject: 'Piano',
      joinDate: '2024-01-05',
      parentName: 'Amit Gupta',
      parentPhone: '+91 98765 43213',
      photo: '👧',
      progress: 88,
      attendance: 90,
      fees: { paid: true, amount: 3500, dueDate: '2024-02-05' }
    },
    {
      id: 5,
      name: 'Kavi Reddy',
      age: 14,
      phone: '+91 98765 43214',
      email: 'kavi.parent@email.com',
      address: 'Jubilee Hills, Hyderabad',
      batch: 'math-tuition',
      subject: 'Mathematics',
      joinDate: '2024-01-12',
      parentName: 'Lakshmi Reddy',
      parentPhone: '+91 98765 43214',
      photo: '👧',
      progress: 75,
      attendance: 85,
      fees: { paid: false, amount: 1500, dueDate: '2024-02-12' }
    },
    {
      id: 6,
      name: 'Rohan Singh',
      age: 11,
      phone: '+91 98765 43215',
      email: 'rohan.parent@email.com',
      address: 'Vasant Kunj, Delhi',
      batch: 'violin-intermediate',
      subject: 'Violin',
      joinDate: '2024-01-18',
      parentName: 'Preet Singh',
      parentPhone: '+91 98765 43215',
      photo: '👦',
      progress: 82,
      attendance: 87,
      fees: { paid: true, amount: 2800, dueDate: '2024-02-18' }
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
    return matchesSearch && matchesBatch;
  });

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'classical dance':
      case 'dance':
        return <Heart className="w-5 h-5" />;
      case 'painting':
      case 'art':
        return <Palette className="w-5 h-5" />;
      case 'guitar':
      case 'piano':
      case 'violin':
      case 'music':
        return <Music className="w-5 h-5" />;
      case 'mathematics':
      case 'math':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'classical dance':
      case 'dance':
        return 'subject-dance';
      case 'painting':
      case 'art':
        return 'subject-art';
      case 'guitar':
      case 'piano':
      case 'violin':
      case 'music':
        return 'subject-music';
      case 'mathematics':
      case 'math':
        return 'subject-academic';
      default:
        return 'subject-sports';
    }
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.attendance > 80).length;
  const pendingFees = students.filter(s => !s.fees.paid).length;

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          Student Management
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" className="tap-zone rounded-2xl">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button 
            className="btn-creative tap-zone rounded-2xl"
            onClick={() => setShowAddStudent(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-gradient border-purple-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-3xl flex items-center justify-center tap-zone">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-primary">{totalStudents}</p>
                <p className="text-xs text-muted-foreground">Across all batches</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-mint-gradient border-green-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-creative-mint rounded-3xl flex items-center justify-center tap-zone text-gray-800">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold text-green-600">{activeStudents}</p>
                <p className="text-xs text-muted-foreground">&gt;80% attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sky-gradient border-blue-200 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-3xl flex items-center justify-center tap-zone">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold text-blue-600">{batches.length - 1}</p>
                <p className="text-xs text-muted-foreground">Active classes</p>
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
                <p className="text-sm text-muted-foreground">Pending Fees</p>
                <p className="text-2xl font-bold text-orange-600">{pendingFees}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 rounded-2xl">
          <TabsTrigger value="students" className="rounded-xl tap-zone">Students</TabsTrigger>
          <TabsTrigger value="batches" className="rounded-xl tap-zone">Batches</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl tap-zone">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Search and Filters */}
          <Card className="card-creative">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="relative flex-1 min-w-64">
                  <Search className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search students, subjects, or parents..."
                    className="pl-12 h-14 tap-zone text-lg rounded-2xl border-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {batches.map((batch) => (
                    <Button
                      key={batch.id}
                      variant={selectedBatch === batch.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedBatch(batch.id)}
                      className="tap-zone rounded-2xl"
                    >
                      {batch.name} ({batch.count})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="card-creative card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-16 h-16 border-4 border-primary/20">
                        <AvatarFallback className="bg-primary/10 text-3xl">
                          {student.photo}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{student.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Age: {student.age}</p>
                        <Badge className={`mt-1 text-xs ${getSubjectColor(student.subject)}`}>
                          {getSubjectIcon(student.subject)}
                          <span className="ml-1">{student.subject}</span>
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="tap-zone rounded-xl">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive tap-zone rounded-xl">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{student.parentPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{student.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Parent: {student.parentName}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-bold text-primary">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 progress-rainbow">
                      <div 
                        className="h-2 rounded-full progress-bar transition-all duration-300"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-accent/30 rounded-xl">
                      <p className="font-medium text-green-600">{student.attendance}%</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                    <div className="text-center p-2 bg-accent/30 rounded-xl">
                      <div className={`inline-flex items-center gap-1 ${student.fees.paid ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="font-medium">₹{student.fees.amount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.fees.paid ? 'Paid' : 'Due'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1 tap-zone rounded-xl">
                      <Award className="w-4 h-4 mr-2" />
                      Progress
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 tap-zone rounded-xl">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.filter(batch => batch.id !== 'all').map((batch) => (
              <Card key={batch.id} className="card-creative card-hover">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{batch.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{batch.subject}</p>
                    </div>
                    <Badge className={getSubjectColor(batch.subject || '')}>
                      {batch.count} students
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{batch.time}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capacity</span>
                      <span>{batch.count}/25</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${(batch.count / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 tap-zone rounded-xl">
                      <Users className="w-4 h-4 mr-2" />
                      View Students
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 tap-zone rounded-xl">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="card-creative">
              <CardHeader>
                <CardTitle>Enrollment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>This Month</span>
                    <span className="font-medium text-green-600">+12 students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Month</span>
                    <span className="font-medium">+8 students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Growth Rate</span>
                    <span className="font-medium text-primary">+15.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-creative">
              <CardHeader>
                <CardTitle>Subject Popularity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span>Mathematics</span>
                    </div>
                    <span className="font-medium">32 students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-pink-600" />
                      <span>Dance</span>
                    </div>
                    <span className="font-medium">24 students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-600" />
                      <span>Art</span>
                    </div>
                    <span className="font-medium">18 students</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-yellow-600" />
                      <span>Music</span>
                    </div>
                    <span className="font-medium">36 students</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
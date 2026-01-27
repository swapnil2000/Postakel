import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { 
  Target, 
  TrendingUp, 
  Star, 
  Calendar, 
  FileText, 
  Users, 
  Award, 
  BarChart3, 
  Plus, 
  Edit2, 
  Eye, 
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Download,
  Search,
  ChevronRight,
  Activity
} from 'lucide-react';

interface Employee {
  id: string | number;
  name: string;
  role?: string;
  position?: string;
  department?: string;
}

interface Goal {
  id: string | number;
  title: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low' | string;
  dueDate?: string;
  category?: string;
  status?: string;
  progress?: number;
  avatar?: string;
  employee?: string;
  department?: string;
}

interface Review {
  id: string | number;
  employeeId?: string | number | null;
  employee: string;
  reviewerId?: string | number | null;
  reviewer: string;
  reviewCycleId?: string | number | null;
  reviewCycle: string;
  dueDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | string;
  goals: Goal[];
  avatar?: string;
  overallRating?: number;
  position?: string;
  department?: string;
  notes?: string;
}

interface ReviewCycle {
  id: string | number;
  name: string;
  period?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  participants?: number;
  completed?: number;
}

interface Rating {
  employeeId?: string | number | undefined;
  score: number;
  period?: string;
}

interface PerformanceData {
  reviews?: Review[];
  goals?: Goal[];
  reviewCycles?: ReviewCycle[];
  ratings?: Rating[];
}

interface PerformanceManagementProps {
  userRole: 'admin' | 'employee';
  currentUser?: Employee;
  employees?: Employee[];
  appData?: { performance?: PerformanceData } | Record<string, any>;
  onUpdateAppData?: (module: string, data: PerformanceData | Review | Goal | any) => void;
}

export function PerformanceManagement({ 
  userRole,
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  appData = {},
  onUpdateAppData = () => {}
}: PerformanceManagementProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedReviewCycle, setSelectedReviewCycle] = useState('current');
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  // Controlled state for Create Goal dialog
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState('');
  const [newGoalDue, setNewGoalDue] = useState('');
  const [newGoalAssignee, setNewGoalAssignee] = useState('');
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Initialize reviews from appData
  const [reviews, setReviews] = useState<Review[]>(() => {
    return (appData.performance?.reviews as Review[]) || [];
  });

  // Initialize goals from appData
  const [goals, setGoals] = useState<Goal[]>(() => {
    return (appData.performance?.goals as Goal[]) || [];
  });

  // Initialize review cycles from appData
  const [reviewCycles, setReviewCycles] = useState<ReviewCycle[]>(() => {
    if (appData.performance?.reviewCycles && appData.performance.reviewCycles.length > 0) {
      return appData.performance.reviewCycles as ReviewCycle[];
    }
    
    // Default review cycle
    const currentYear = new Date().getFullYear();
    return [
      {
        id: 1,
        name: `Q1 ${currentYear} Performance Review`,
        period: `Q1 ${currentYear}`,
        startDate: `${currentYear}-01-01`,
        endDate: `${currentYear}-03-31`,
        status: 'active',
        participants: employees.length,
        completed: 0
      }
    ];
  });

  // Sync performance data with appData
  // Sync local state from backend-driven `appData.performance`
  useEffect(() => {
    const perf = (appData && (appData as any).performance) || {};
    setReviews((perf.reviews as Review[]) || []);
    setGoals((perf.goals as Goal[]) || []);
    if (perf.reviewCycles && perf.reviewCycles.length > 0) {
      setReviewCycles(perf.reviewCycles as ReviewCycle[]);
    }
  }, [appData.performance]);

  // Controlled state for Create Review dialog
  const [newReviewEmployee, setNewReviewEmployee] = useState('');
  const [newReviewCycleSelect, setNewReviewCycleSelect] = useState('');
  const [newReviewReviewer, setNewReviewReviewer] = useState('');
  const [newReviewDue, setNewReviewDue] = useState('');
  const [newReviewNotes, setNewReviewNotes] = useState('');

  // Review cycle dialogs & state (backend-driven)
  const [showCreateCycle, setShowCreateCycle] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');
  const [newCycleStart, setNewCycleStart] = useState('');
  const [newCycleEnd, setNewCycleEnd] = useState('');
  const [newCycleParticipants, setNewCycleParticipants] = useState('');

  const [selectedCycle, setSelectedCycle] = useState<ReviewCycle | null>(null);
  const [showViewCycle, setShowViewCycle] = useState(false);
  const [showManageCycle, setShowManageCycle] = useState(false);

  const [manageCycleName, setManageCycleName] = useState('');
  const [manageCycleStart, setManageCycleStart] = useState('');
  const [manageCycleEnd, setManageCycleEnd] = useState('');
  const [manageCycleParticipants, setManageCycleParticipants] = useState('');
  const [manageCycleStatus, setManageCycleStatus] = useState('');

  const handleCreateCycle = () => {
    if (!newCycleName || !newCycleStart || !newCycleEnd) return;
    const newCycle: ReviewCycle = {
      id: Date.now(),
      name: newCycleName,
      startDate: newCycleStart,
      endDate: newCycleEnd,
      status: 'active',
      participants: Number(newCycleParticipants) || employees.length,
      completed: 0
    };

    onUpdateAppData('performance:createCycle', newCycle);

    setNewCycleName('');
    setNewCycleStart('');
    setNewCycleEnd('');
    setNewCycleParticipants('');
    setShowCreateCycle(false);
  };

  const openViewCycle = (cycle: ReviewCycle) => {
    setSelectedCycle(cycle);
    setShowViewCycle(true);
  };

  const openManageCycle = (cycle: ReviewCycle) => {
    setSelectedCycle(cycle);
    setManageCycleName(cycle.name || '');
    setManageCycleStart(cycle.startDate || '');
    setManageCycleEnd(cycle.endDate || '');
    setManageCycleParticipants(String(cycle.participants ?? ''));
    setManageCycleStatus(cycle.status || '');
    setShowManageCycle(true);
  };

  const handleSaveCycleUpdate = () => {
    if (!selectedCycle) return;
    const updatedCycle: ReviewCycle = {
      ...selectedCycle,
      name: manageCycleName,
      startDate: manageCycleStart,
      endDate: manageCycleEnd,
      participants: Number(manageCycleParticipants) || selectedCycle.participants,
      status: manageCycleStatus || selectedCycle.status
    };
    onUpdateAppData('performance:updateCycle', updatedCycle);
    setSelectedCycle(null);
    setShowManageCycle(false);
  };

  const handleStartReview = () => {
    // Basic validation
    if (!newReviewEmployee || !newReviewCycleSelect || !newReviewReviewer || !newReviewDue) {
      // In a full implementation you'd show UI errors; keep simple here
      return;
    }

    const employeeObj = employees.find((e: any) => String(e.id) === String(newReviewEmployee));
    const reviewerObj = employees.find((e: any) => String(e.id) === String(newReviewReviewer));
    const cycleObj = reviewCycles.find((c: any) => String(c.id) === String(newReviewCycleSelect));

    const employeeName = employeeObj?.name || '';
    const reviewerName = reviewerObj?.name || '';
    const cycleName = cycleObj?.name || '';
    const avatarSource = employeeName || reviewerName || 'PR';
    const avatar = avatarSource
      .split(' ')
      .map(s => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newReview = {
      id: Date.now(),
      employeeId: employeeObj?.id,
      employee: employeeName,
      reviewerId: reviewerObj?.id,
      reviewer: reviewerName,
      reviewCycleId: cycleObj?.id,
      reviewCycle: cycleName,
      dueDate: newReviewDue,
      status: 'pending',
      goals: [],
      avatar,
      overallRating: undefined,
      position: employeeObj?.position || employeeObj?.role || '',
      department: employeeObj?.department || '',
      notes: newReviewNotes
    } as any;

    // Tell backend (or parent) to create the review — do not mutate local reviews directly
    onUpdateAppData('performance:createReview', newReview);

    // Clear form and close dialog
    setNewReviewEmployee('');
    setNewReviewCycleSelect('');
    setNewReviewReviewer('');
    setNewReviewDue('');
    setNewReviewNotes('');
    setShowCreateReview(false);
  };

  const handleCreateGoal = () => {
    if (!newGoalTitle || !newGoalAssignee) {
      return;
    }

    const employeeObj = employees.find((e: any) => String(e.id) === String(newGoalAssignee));
    const assigneeName = employeeObj?.name || '';
    const avatarSource = assigneeName || newGoalTitle || 'G';
    const avatar = avatarSource
      .split(' ')
      .map((s) => s[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newGoal = {
      id: Date.now(),
      title: newGoalTitle,
      description: newGoalDescription,
      priority: newGoalPriority || 'medium',
      dueDate: newGoalDue,
      category: newGoalCategory,
      status: 'pending',
      progress: 0,
      avatar,
      employee: assigneeName,
      department: employeeObj?.department || ''
    } as any;

    console.log('Create Goal -> notifying parent:', newGoal);
    onUpdateAppData('performance:createGoal', newGoal);

    // Clear form and close
    setNewGoalTitle('');
    setNewGoalCategory('');
    setNewGoalDescription('');
    setNewGoalPriority('');
    setNewGoalDue('');
    setNewGoalAssignee('');
    setShowCreateGoal(false);
  };

  const getStatusColor = (status?: string) => {
    const s = status || 'unknown';
    switch (s) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    const p = priority || 'unknown';
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hr-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.2</p>
                <div className="flex items-center mt-1">
                  {renderStars(4)}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hr-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goals Completed</p>
                <p className="text-2xl font-bold text-gray-900">8/12</p>
                <p className="text-sm text-green-600">67% completion</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hr-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviews Completed</p>
                <p className="text-2xl font-bold text-gray-900">{userRole === 'admin' ? '8/15' : '1/1'}</p>
                <p className="text-sm text-blue-600">{userRole === 'admin' ? '53%' : '100%'} done</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hr-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Feedback Score</p>
                <p className="text-2xl font-bold text-gray-900">4.5</p>
                <p className="text-sm text-green-600">+0.3 from last quarter</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Review Cycle */}
      <Card className="hr-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Current Review Cycle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Q4 2024 Performance Review</h3>
                <p className="text-sm text-gray-600">January 1 - February 28, 2024</p>
              </div>
              <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{userRole === 'admin' ? '15' : '1'}</p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{userRole === 'admin' ? '8' : '1'}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{userRole === 'admin' ? '7' : '0'}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
            {userRole === 'admin' && (
              <Progress value={53} className="w-full" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="hr-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Recent Performance Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Goal "React Native Certification" completed</p>
                <p className="text-xs text-gray-600">Mike Johnson • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Performance review submitted</p>
                <p className="text-xs text-gray-600">Sarah Wilson • 1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New goal assigned: "Q1 Marketing Campaign"</p>
                <p className="text-xs text-gray-600">Lisa Chen • 3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ReviewsTab = () => (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          {userRole === 'admin' && (
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        {userRole === 'admin' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setShowCreateReview(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Review
            </Button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="grid gap-4">
        {reviews.map((review) => (
          <Card key={review.id} className="hr-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="avatar-medium bg-blue-100 text-blue-700">
                    <AvatarFallback>{review.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{review.employee}</h3>
                    <p className="text-sm text-gray-600">{review.position} • {review.department}</p>
                    <p className="text-xs text-gray-500">Reviewer: {review.reviewer}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(review.status)}>
                  {review.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Review Cycle</p>
                  <p className="text-sm font-medium text-gray-900">{review.reviewCycle}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="text-sm font-medium text-gray-900">{review.dueDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Overall Rating</p>
                  <div className="flex items-center gap-1">
                    {review.overallRating ? (
                      <>
                        <span className="text-sm font-medium text-gray-900">{review.overallRating}</span>
                        <div className="flex">{renderStars(Math.round(review.overallRating))}</div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Not rated</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Goals</p>
                  <p className="text-sm font-medium text-gray-900">{review.goals.length} goals</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                {(userRole === 'admin' || review.status !== 'completed') && (
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const GoalsTab = () => (
    <div className="space-y-6">
      {/* Goals Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Performance Goals</h2>
          <p className="text-sm text-gray-600">Track and manage individual and team objectives</p>
        </div>
        <Button onClick={() => setShowCreateGoal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id} className="hr-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    <Badge className={getPriorityColor(goal.priority)}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Due: {goal.dueDate ?? '—'}</span>
                    <span>Category: {goal.category ? goal.category.replace('_', ' ') : '—'}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status ? goal.status.replace('_', ' ') : '—'}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Avatar className="avatar-small bg-blue-100 text-blue-700">
                  <AvatarFallback>{goal.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">{goal.employee}</p>
                  <p className="text-xs text-gray-500">{goal.department}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">{goal.progress ?? 0}%</span>
                </div>
                <Progress value={goal.progress ?? 0} className="w-full" />
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Update Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const CyclesTab = () => (
    <div className="space-y-6">
      {/* Cycles Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review Cycles</h2>
          <p className="text-sm text-gray-600">Manage performance review periods and schedules</p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setShowCreateCycle(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Cycle
          </Button>
        )}
      </div>

      {/* Cycles List */}
      <div className="grid gap-4">
        {reviewCycles.map((cycle) => (
          <Card key={cycle.id} className="hr-card">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{cycle.name}</h3>
                  <p className="text-sm text-gray-600">{cycle.startDate} - {cycle.endDate}</p>
                </div>
                <Badge className={cycle.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                  {cycle.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-gray-900">{cycle.participants ?? 0}</p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{cycle.completed ?? 0}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">
                    {Math.round(((cycle.completed ?? 0) / (cycle.participants ?? 1)) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Progress</p>
                </div>
              </div>

              <Progress value={((cycle.completed ?? 0) / (cycle.participants ?? 1)) * 100} className="mb-4" />

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openViewCycle(cycle)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {userRole === 'admin' && cycle.status === 'active' && (
                  <Button variant="outline" size="sm" onClick={() => openManageCycle(cycle)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600">
            {userRole === 'admin' 
              ? 'Monitor and evaluate team performance across the organization' 
              : 'Track your goals, reviews, and performance metrics'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          {userRole === 'admin' && <TabsTrigger value="cycles">Cycles</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsTab />
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <GoalsTab />
        </TabsContent>

        {userRole === 'admin' && (
          <TabsContent value="cycles" className="mt-6">
            <CyclesTab />
          </TabsContent>
        )}
      </Tabs>

      {/* Create Cycle Dialog */}
      <Dialog open={showCreateCycle} onOpenChange={setShowCreateCycle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Review Cycle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cycle-name">Cycle Name</Label>
                <Input id="cycle-name" placeholder="e.g., Q2 2025 Review" value={newCycleName} onChange={(e) => setNewCycleName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="cycle-start">Start Date</Label>
                <Input id="cycle-start" type="date" value={newCycleStart} onChange={(e) => setNewCycleStart(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cycle-end">End Date</Label>
                <Input id="cycle-end" type="date" value={newCycleEnd} onChange={(e) => setNewCycleEnd(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="cycle-participants">Participants</Label>
                <Input id="cycle-participants" type="number" value={newCycleParticipants} onChange={(e) => setNewCycleParticipants(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateCycle(false)}>Cancel</Button>
              <Button onClick={handleCreateCycle} disabled={!newCycleName || !newCycleStart || !newCycleEnd}>Create Cycle</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Cycle Dialog */}
      <Dialog open={showViewCycle} onOpenChange={setShowViewCycle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Cycle Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCycle ? (
              <div>
                <div className="mb-2"><strong>Name:</strong> {selectedCycle.name}</div>
                <div className="mb-2"><strong>Period:</strong> {selectedCycle.startDate} - {selectedCycle.endDate}</div>
                <div className="mb-2"><strong>Participants:</strong> {selectedCycle.participants ?? 0}</div>
                <div className="mb-2"><strong>Status:</strong> {selectedCycle.status}</div>
              </div>
            ) : (
              <div>No cycle selected</div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setShowViewCycle(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manage Cycle Dialog */}
      <Dialog open={showManageCycle} onOpenChange={setShowManageCycle}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Review Cycle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manage-cycle-name">Cycle Name</Label>
                <Input id="manage-cycle-name" value={manageCycleName} onChange={(e) => setManageCycleName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="manage-cycle-status">Status</Label>
                <Select value={manageCycleStatus} onValueChange={setManageCycleStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manage-cycle-start">Start Date</Label>
                <Input id="manage-cycle-start" type="date" value={manageCycleStart} onChange={(e) => setManageCycleStart(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="manage-cycle-end">End Date</Label>
                <Input id="manage-cycle-end" type="date" value={manageCycleEnd} onChange={(e) => setManageCycleEnd(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="manage-cycle-participants">Participants</Label>
              <Input id="manage-cycle-participants" type="number" value={manageCycleParticipants} onChange={(e) => setManageCycleParticipants(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowManageCycle(false)}>Cancel</Button>
              <Button onClick={handleSaveCycleUpdate}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Goal Dialog */}
      <Dialog open={showCreateGoal} onOpenChange={setShowCreateGoal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input id="goal-title" placeholder="Enter goal title" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="goal-category">Category</Label>
                <Select value={newGoalCategory} onValueChange={setNewGoalCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skill_development">Skill Development</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="goal-description">Description</Label>
              <Textarea id="goal-description" placeholder="Describe the goal in detail" rows={3} value={newGoalDescription} onChange={(e) => setNewGoalDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="goal-priority">Priority</Label>
                <Select value={newGoalPriority} onValueChange={setNewGoalPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goal-due">Due Date</Label>
                <Input id="goal-due" type="date" value={newGoalDue} onChange={(e) => setNewGoalDue(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="goal-assignee">Assignee</Label>
                <Select value={newGoalAssignee} onValueChange={setNewGoalAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateGoal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGoal} disabled={!newGoalTitle || !newGoalAssignee}>
                Create Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Review Dialog */}
      <Dialog open={showCreateReview} onOpenChange={setShowCreateReview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start New Performance Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="review-employee">Employee</Label>
                <Select value={newReviewEmployee} onValueChange={setNewReviewEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="review-cycle">Review Cycle</Label>
                <Select value={newReviewCycleSelect} onValueChange={setNewReviewCycleSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewCycles.map((cycle) => (
                      <SelectItem key={cycle.id} value={String(cycle.id)}>
                        {cycle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="review-reviewer">Reviewer</Label>
                <Select value={newReviewReviewer} onValueChange={setNewReviewReviewer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="review-due">Due Date</Label>
                <Input id="review-due" type="date" value={newReviewDue} onChange={(e) => setNewReviewDue(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="review-notes">Initial Notes (Optional)</Label>
              <Textarea id="review-notes" placeholder="Add any initial notes or instructions" rows={3} value={newReviewNotes} onChange={(e) => setNewReviewNotes(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateReview(false)}>
                Cancel
              </Button>
              <Button onClick={handleStartReview} disabled={!newReviewEmployee || !newReviewCycleSelect || !newReviewReviewer || !newReviewDue}>
                Start Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
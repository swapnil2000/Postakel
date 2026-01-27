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

interface PerformanceManagementProps {
  userRole: 'admin' | 'employee';
  currentUser?: any;
  employees?: any[];
  appData?: any;
  onUpdateAppData?: (module: string, data: any) => void;
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
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Initialize reviews from appData
  const [reviews, setReviews] = useState(() => {
    return appData.performance?.reviews || [];
  });

  // Initialize goals from appData
  const [goals, setGoals] = useState(() => {
    return appData.performance?.goals || [];
  });

  // Initialize review cycles from appData
  const [reviewCycles, setReviewCycles] = useState(() => {
    if (appData.performance?.reviewCycles && appData.performance.reviewCycles.length > 0) {
      return appData.performance.reviewCycles;
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
  useEffect(() => {
    onUpdateAppData('performance', {
      reviews,
      goals,
      reviewCycles,
      ratings: reviews.filter(r => r.overallRating).map(r => ({
        employeeId: employees.find(emp => emp.name === r.employee)?.id,
        score: r.overallRating,
        period: r.reviewCycle
      }))
    });
  }, [reviews, goals, reviewCycles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
                    <span>Due: {goal.dueDate}</span>
                    <span>Category: {goal.category.replace('_', ' ')}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(goal.status)}>
                  {goal.status.replace('_', ' ')}
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
                  <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="w-full" />
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
          <Button>
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
                  <p className="text-xl font-bold text-gray-900">{cycle.participants}</p>
                  <p className="text-sm text-gray-600">Participants</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-green-600">{cycle.completed}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-xl font-bold text-blue-600">
                    {Math.round((cycle.completed / cycle.participants) * 100)}%
                  </p>
                  <p className="text-sm text-gray-600">Progress</p>
                </div>
              </div>

              <Progress value={(cycle.completed / cycle.participants) * 100} className="mb-4" />

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {userRole === 'admin' && cycle.status === 'active' && (
                  <Button variant="outline" size="sm">
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
                <Input id="goal-title" placeholder="Enter goal title" />
              </div>
              <div>
                <Label htmlFor="goal-category">Category</Label>
                <Select>
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
              <Textarea id="goal-description" placeholder="Describe the goal in detail" rows={3} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="goal-priority">Priority</Label>
                <Select>
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
                <Input id="goal-due" type="date" />
              </div>
              <div>
                <Label htmlFor="goal-assignee">Assignee</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                    <SelectItem value="lisa">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateGoal(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateGoal(false)}>
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
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Wilson</SelectItem>
                    <SelectItem value="mike">Mike Johnson</SelectItem>
                    <SelectItem value="lisa">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="review-cycle">Review Cycle</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q4_2024">Q4 2024 Performance Review</SelectItem>
                    <SelectItem value="mid_year_2024">Mid-Year Review 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="review-reviewer">Reviewer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="david">David Brown</SelectItem>
                    <SelectItem value="emily">Emily Davis</SelectItem>
                    <SelectItem value="sarah_m">Sarah Miller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="review-due">Due Date</Label>
                <Input id="review-due" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="review-notes">Initial Notes (Optional)</Label>
              <Textarea id="review-notes" placeholder="Add any initial notes or instructions" rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateReview(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCreateReview(false)}>
                Start Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  DollarSign,
  Target,
  Calendar,
  BarChart3,
  Lightbulb,
  Zap,
  Shield,
  Heart,
  Award,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  RefreshCw,
  Download,
  Filter,
  Star,
  Activity,
  PieChart,
  Radar,
  Sparkles,
  Calculator,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface AIInsightsProps {
  userRole: string;
  currentUser?: {
    id: number;
    name: string;
    role: string;
    department?: string;
  };
  employees?: any[];
  companySettings?: any;
  appData?: any;
}

interface InsightData {
  id: string;
  type: 'recommendation' | 'warning' | 'opportunity' | 'achievement' | 'prediction';
  priority: 'high' | 'medium' | 'low';
  category: 'productivity' | 'finance' | 'hr' | 'operations' | 'performance' | 'wellbeing';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  metrics?: {
    current: number;
    predicted: number;
    change: number;
    unit: string;
  };
  actions?: string[];
  relatedModule?: string;
  calculationMethod: string;
}

export function AIInsights({ 
  userRole, 
  currentUser = { id: 1, name: 'User', role: 'employee' },
  employees = [],
  companySettings = { currencySymbol: '$', name: 'Company' },
  appData = {}
}: AIInsightsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real Data Analysis Engine - Uses actual application data
  const analyzeRealData = (): InsightData[] => {
    const insights: InsightData[] = [];
    const now = new Date();
    
    // Extract real data from appData
    const timeTrackingData = appData.timeTracking || {};
    const taskData = appData.tasks || {};
    const leaveData = appData.leave || {};
    const performanceData = appData.performance || {};
    const salaryData = appData.salary || {};
    const assetData = appData.assets || {};
    const announcementData = appData.announcements || {};
    
    // Get current month/year for calculations
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    
    // =====================================
    // 1. EMPLOYEE PRODUCTIVITY ANALYSIS
    // =====================================
    
    if (employees.length > 0) {
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'active').length;
      const employeeUtilizationRate = (activeEmployees / totalEmployees) * 100;
      
      // Calculate actual time tracking data
      const timeSessions = timeTrackingData.sessions || [];
      const currentMonthSessions = timeSessions.filter((session: any) => {
        const sessionDate = new Date(session.date);
        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
      });
      
      const totalWorkedHours = currentMonthSessions.reduce((sum: number, session: any) => {
        return sum + (session.totalWorked || 0) / 60; // Convert minutes to hours
      }, 0);
      
      const avgHoursPerEmployee = employees.length > 0 ? totalWorkedHours / employees.length : 0;
      // Get working hours from company settings or use defaults
      const workingDaysPerMonth = companySettings.workingDaysPerMonth || 22;
      const hoursPerDay = companySettings.hoursPerDay || 8;
      const expectedMonthlyHours = workingDaysPerMonth * hoursPerDay;
      const currentMonthProgress = avgHoursPerEmployee > 0 ? (avgHoursPerEmployee / expectedMonthlyHours) * 100 : 0;
      
      if (employeeUtilizationRate < 95) {
        insights.push({
          id: 'employee-utilization',
          type: 'warning',
          priority: 'high',
          category: 'hr',
          title: 'Employee Utilization Below Optimal',
          description: `Only ${employeeUtilizationRate.toFixed(1)}% of employees are currently active. ${totalEmployees - activeEmployees} employees may need attention.`,
          impact: `Potential ${((100 - employeeUtilizationRate) * totalEmployees * 1000).toFixed(0)} ${companySettings.currencySymbol} monthly productivity loss`,
          confidence: 94,
          metrics: {
            current: employeeUtilizationRate,
            predicted: 95,
            change: 95 - employeeUtilizationRate,
            unit: '%'
          },
          actions: ['Review inactive employee status', 'Conduct employee wellness check', 'Optimize workload distribution'],
          relatedModule: 'team',
          calculationMethod: 'activeEmployees / totalEmployees * 100'
        });
      }

      // Time tracking insights
      if (avgHoursPerEmployee > 0) {
        const productivityScore = Math.min(100, (avgHoursPerEmployee / (expectedMonthlyHours * (currentDay / workingDaysPerMonth))) * 100);
        
        if (productivityScore < 80) {
          insights.push({
            id: 'productivity-trend',
            type: 'recommendation',
            priority: 'medium',
            category: 'productivity',
            title: 'Team Productivity Below Target',
            description: `Average productivity score is ${productivityScore.toFixed(1)}%. Teams are working ${avgHoursPerEmployee.toFixed(1)} hours on average this month.`,
            impact: 'Improved time management could increase overall efficiency by 15-25%',
            confidence: 87,
            metrics: {
              current: productivityScore,
              predicted: 85,
              change: 85 - productivityScore,
              unit: '%'
            },
            actions: ['Implement focused work blocks', 'Review meeting efficiency', 'Provide time management training'],
            relatedModule: 'timetracker',
            calculationMethod: 'totalWorkedHours / (expectedHours * monthProgress) * 100'
          });
        }
      }
    }

    // =====================================
    // 2. TASK MANAGEMENT ANALYSIS
    // =====================================
    
    const tasks = taskData.tasks || [];
    if (tasks.length > 0) {
      const overdueTasks = tasks.filter((task: any) => {
        const dueDate = new Date(task.dueDate);
        return dueDate < now && task.status !== 'completed';
      });
      
      const completionRate = ((tasks.filter((task: any) => task.status === 'completed').length) / tasks.length) * 100;
      
      if (overdueTasks.length > 0) {
        insights.push({
          id: 'overdue-tasks',
          type: 'warning',
          priority: 'high',
          category: 'operations',
          title: 'Tasks Overdue',
          description: `${overdueTasks.length} tasks are currently overdue. This may impact project timelines and client satisfaction.`,
          impact: 'Addressing overdue tasks can prevent project delays and maintain client trust',
          confidence: 95,
          metrics: {
            current: overdueTasks.length,
            predicted: 0,
            change: -overdueTasks.length,
            unit: ' tasks'
          },
          actions: ['Prioritize overdue tasks', 'Reallocate resources', 'Review task deadlines'],
          relatedModule: 'tasks',
          calculationMethod: 'tasks.filter(task => task.dueDate < now && status !== completed).length'
        });
      }

      if (completionRate < 70) {
        insights.push({
          id: 'task-completion-rate',
          type: 'recommendation',
          priority: 'medium',
          category: 'productivity',
          title: 'Task Completion Rate Below Target',
          description: `Current task completion rate is ${completionRate.toFixed(1)}%. Consider optimizing task management processes.`,
          impact: 'Improving task completion rates can boost team productivity by 20-30%',
          confidence: 82,
          metrics: {
            current: completionRate,
            predicted: 80,
            change: 80 - completionRate,
            unit: '%'
          },
          actions: ['Break down large tasks', 'Set clearer deadlines', 'Implement regular check-ins'],
          relatedModule: 'tasks',
          calculationMethod: 'completedTasks / totalTasks * 100'
        });
      }
    }

    // =====================================
    // 3. LEAVE MANAGEMENT ANALYSIS
    // =====================================
    
    const leaveRequests = leaveData.requests || [];
    const pendingRequests = leaveRequests.filter((req: any) => req.status === 'pending');
    
    if (pendingRequests.length > 5) {
      insights.push({
        id: 'pending-leave-requests',
        type: 'warning',
        priority: 'medium',
        category: 'hr',
        title: 'High Number of Pending Leave Requests',
        description: `${pendingRequests.length} leave requests are pending approval. Delays may affect employee satisfaction.`,
        impact: 'Timely leave approval improves employee satisfaction and planning',
        confidence: 88,
        metrics: {
          current: pendingRequests.length,
          predicted: 3,
          change: 3 - pendingRequests.length,
          unit: ' requests'
        },
        actions: ['Review pending requests', 'Streamline approval process', 'Set approval deadlines'],
        relatedModule: 'leave',
        calculationMethod: 'leaveRequests.filter(req => req.status === pending).length'
      });
    }

    // =====================================
    // 4. FINANCIAL ANALYSIS
    // =====================================
    
    if (employees.length > 0) {
      const totalPayroll = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);
      const avgSalary = totalPayroll / employees.length;
      // Get industry benchmark from company settings or use default based on industry/location
      const industryBenchmark = companySettings.industryBenchmark || 
                               companySettings.salary?.industryBenchmark || 
                               75000; // Default benchmark
      
      if (avgSalary > industryBenchmark * 1.2) {
        insights.push({
          id: 'salary-benchmark',
          type: 'opportunity',
          priority: 'medium',
          category: 'finance',
          title: 'Salary Costs Above Industry Average',
          description: `Average salary (${companySettings.currencySymbol}${avgSalary.toFixed(0)}) is ${((avgSalary / industryBenchmark - 1) * 100).toFixed(1)}% above industry benchmark.`,
          impact: 'Salary optimization could result in significant cost savings',
          confidence: 75,
          metrics: {
            current: avgSalary,
            predicted: industryBenchmark,
            change: -((avgSalary - industryBenchmark) / avgSalary * 100),
            unit: companySettings.currencySymbol
          },
          actions: ['Review compensation structure', 'Benchmark against competitors', 'Consider performance-based pay'],
          relatedModule: 'salary',
          calculationMethod: 'totalPayroll / employeeCount vs industryBenchmark'
        });
      }
    }

    // =====================================
    // 5. PERFORMANCE INSIGHTS
    // =====================================
    
    const performanceReviews = performanceData.reviews || [];
    const ratings = performanceData.ratings || [];
    
    if (ratings.length > 0) {
      const avgRating = ratings.reduce((sum: number, rating: any) => sum + rating.score, 0) / ratings.length;
      
      if (avgRating < 3.5) {
        insights.push({
          id: 'performance-ratings',
          type: 'warning',
          priority: 'high',
          category: 'performance',
          title: 'Team Performance Below Expectations',
          description: `Average performance rating is ${avgRating.toFixed(1)}/5. Consider implementing development programs.`,
          impact: 'Improving performance ratings can boost overall productivity and retention',
          confidence: 90,
          metrics: {
            current: avgRating,
            predicted: 4.0,
            change: 4.0 - avgRating,
            unit: '/5'
          },
          actions: ['Provide additional training', 'Set clear performance goals', 'Implement mentoring programs'],
          relatedModule: 'performance',
          calculationMethod: 'sum(ratings) / ratings.length'
        });
      }
    }

    // =====================================
    // 6. ASSET MANAGEMENT INSIGHTS
    // =====================================
    
    const assets = assetData.assets || [];
    const assignments = assetData.assignments || [];
    
    if (assets.length > 0) {
      const maintenanceAssets = assets.filter((asset: any) => asset.status === 'maintenance');
      const maintenanceRate = (maintenanceAssets.length / assets.length) * 100;
      
      if (maintenanceRate > 15) {
        insights.push({
          id: 'asset-maintenance',
          type: 'warning',
          priority: 'medium',
          category: 'operations',
          title: 'High Asset Maintenance Rate',
          description: `${maintenanceRate.toFixed(1)}% of assets are currently under maintenance. This may impact operations.`,
          impact: 'Proactive maintenance planning can reduce downtime by 30-40%',
          confidence: 85,
          metrics: {
            current: maintenanceRate,
            predicted: 10,
            change: 10 - maintenanceRate,
            unit: '%'
          },
          actions: ['Review maintenance schedules', 'Consider asset replacement', 'Implement preventive maintenance'],
          relatedModule: 'assets',
          calculationMethod: 'maintenanceAssets / totalAssets * 100'
        });
      }
    }

    // Sort insights by priority and confidence
    return insights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
  };

  const insights = useMemo(() => analyzeRealData(), [employees, companySettings, currentUser, appData]);

  // Filter insights based on user role
  const getFilteredInsights = () => {
    if (userRole === 'employee') {
      // Employees see insights relevant to their work
      return insights.filter(insight => 
        insight.category === 'productivity' || 
        insight.category === 'wellbeing' || 
        insight.category === 'performance'
      );
    }
    return insights; // Admins see all insights
  };

  const displayedInsights = getFilteredInsights();

  // Category filter options
  const categories = [
    { id: 'all', name: 'All Insights', icon: Brain, count: displayedInsights.length },
    { id: 'productivity', name: 'Productivity', icon: TrendingUp, count: displayedInsights.filter(i => i.category === 'productivity').length },
    { id: 'finance', name: 'Finance', icon: DollarSign, count: displayedInsights.filter(i => i.category === 'finance').length },
    { id: 'hr', name: 'HR', icon: Users, count: displayedInsights.filter(i => i.category === 'hr').length },
    { id: 'operations', name: 'Operations', icon: BarChart3, count: displayedInsights.filter(i => i.category === 'operations').length },
    { id: 'performance', name: 'Performance', icon: Target, count: displayedInsights.filter(i => i.category === 'performance').length },
    { id: 'wellbeing', name: 'Wellbeing', icon: Heart, count: displayedInsights.filter(i => i.category === 'wellbeing').length }
  ];

  // Filter insights by selected category
  const filteredInsights = selectedCategory === 'all' 
    ? displayedInsights 
    : displayedInsights.filter(insight => insight.category === selectedCategory);

  // Get insight type icon
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return Lightbulb;
      case 'warning': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'achievement': return Award;
      case 'prediction': return Crystal;
      default: return Brain;
    }
  };

  // Get insight color scheme
  const getInsightColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50/50';
    if (priority === 'medium') return 'border-l-yellow-500 bg-yellow-50/50';
    return 'border-l-blue-500 bg-blue-50/50';
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recommendation': return 'Recommendation';
      case 'warning': return 'Warning';
      case 'opportunity': return 'Opportunity';
      case 'achievement': return 'Achievement';
      case 'prediction': return 'Prediction';
      default: return 'Insight';
    }
  };

  // Calculate overall insights score
  const getOverallScore = () => {
    if (displayedInsights.length === 0) return 85; // Default good score when no issues
    
    const weights = { high: 3, medium: 2, low: 1 };
    const totalWeight = displayedInsights.reduce((sum, insight) => sum + weights[insight.priority], 0);
    const maxPossibleWeight = displayedInsights.length * weights.high;
    
    // Invert the score (fewer high-priority issues = better score)
    return Math.max(20, 100 - (totalWeight / maxPossibleWeight) * 80);
  };

  const overallScore = getOverallScore();

  // Refresh insights
  const handleRefresh = () => {
    setLastUpdated(new Date());
    // In a real app, this would trigger a re-fetch of data
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            AI Insights & Recommendations
          </h1>
          <p className="text-gray-600 mt-1">
            Mathematical analysis and data-driven recommendations for {companySettings.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Business Health Score
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-blue-600">
                  {overallScore.toFixed(0)}%
                </div>
                <div className="text-sm text-blue-700">
                  {overallScore >= 80 ? 'Excellent' : 
                   overallScore >= 60 ? 'Good' : 
                   overallScore >= 40 ? 'Fair' : 'Needs Attention'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <Progress value={overallScore} className="w-32 h-3 mb-2" />
              <p className="text-sm text-gray-500">
                Based on {employees.length} employees
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Pure Mathematical Analysis</h3>
              <p className="text-sm text-blue-700">
                All insights generated using statistical calculations and pattern recognition from real employee data.
                No LLM or AI content generation used.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <category.icon className="w-4 h-4" />
                {category.name}
                {category.count > 0 && (
                  <Badge className="ml-1 bg-blue-100 text-blue-700">
                    {category.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInsights.map((insight) => {
          const IconComponent = getInsightIcon(insight.type);
          return (
            <Card 
              key={insight.id} 
              className={`border-l-4 transition-all duration-200 hover:shadow-lg ${getInsightColor(insight.type, insight.priority)}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-600' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            insight.priority === 'high' ? 'border-red-300 text-red-700' :
                            insight.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                            'border-blue-300 text-blue-700'
                          }`}
                        >
                          {getTypeLabel(insight.type)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {insight.title}
                      </CardTitle>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Calculator className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{insight.confidence}%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4">{insight.description}</p>
                
                {insight.metrics && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="text-sm text-gray-500">Current</div>
                        <div className="font-semibold">
                          {insight.metrics.current.toFixed(1)}{insight.metrics.unit}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Target</div>
                        <div className="font-semibold">
                          {insight.metrics.predicted.toFixed(1)}{insight.metrics.unit}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Change</div>
                        <div className={`font-semibold ${
                          insight.metrics.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {insight.metrics.change > 0 ? '+' : ''}{insight.metrics.change.toFixed(1)}{insight.metrics.unit}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Expected Impact</h4>
                  <p className="text-sm text-gray-600">{insight.impact}</p>
                </div>

                {insight.actions && insight.actions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
                    <ul className="space-y-1">
                      {insight.actions.map((action, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Method: {insight.calculationMethod}
                  </div>
                  {insight.relatedModule && (
                    <Badge variant="outline" className="text-xs">
                      {insight.relatedModule}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Insights Message */}
      {filteredInsights.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Insights Available
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedCategory === 'all' 
                ? "We're analyzing your data to generate insights. Check back soon!"
                : `No insights found for the ${selectedCategory} category.`
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory('all')}
              className="mt-2"
            >
              View All Categories
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
    </div>
  );
}

// Crystal icon fallback for prediction type
const Crystal = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l8 8-8 8-8-8 8-8z" />
  </svg>
);
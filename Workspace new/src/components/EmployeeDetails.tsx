import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Award,
  Clock,
  FileText,
  User,
  Star,
  TrendingUp,
  Shield,
  Heart,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface EmployeeDetailsProps {
  employee: any;
  userRole: string;
  onBack: () => void;
  onEdit?: (employee: any) => void;
  onDelete?: (employeeId: number) => void;
}

export function EmployeeDetails({ employee, userRole, onBack, onEdit, onDelete }: EmployeeDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Helper function to safely calculate months worked
  const calculateMonthsWorked = (joinDate: string | undefined) => {
    if (!joinDate) return 0;
    const join = new Date(joinDate);
    if (isNaN(join.getTime())) return 0;
    const months = Math.floor((new Date().getTime() - join.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return isNaN(months) ? 0 : Math.max(0, months);
  };

  // Helper function to safely get numeric values
  const safeNumber = (value: any, defaultValue: number = 0) => {
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  if (!employee) {
    return (
      <div className="container-mobile py-6 pb-24">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Employee Not Found</h2>
          <p className="text-gray-600 mb-6">The requested employee could not be found.</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'inactive': return 'status-rejected';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceIcon = (performance: number) => {
    if (performance >= 90) return CheckCircle;
    if (performance >= 75) return AlertCircle;
    return XCircle;
  };

  const PerformanceIcon = getPerformanceIcon(employee.performance);

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Team
        </Button>
        
        {userRole === 'admin' && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit?.(employee)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Employee
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete?.(employee.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Employee Header Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
                  {employee.avatar || employee.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{employee.name || 'Unknown Employee'}</h1>
                <p className="text-lg text-gray-600 mb-2">{employee.role || 'No role assigned'}</p>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(employee.status || 'pending')}>
                    {employee.status || 'pending'}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    {employee.department || 'No department'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:ml-auto">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getPerformanceColor(safeNumber(employee.performance))}`}>
                  {safeNumber(employee.performance)}%
                </div>
                <div className="text-xs text-gray-600">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{safeNumber(employee.leaveBalance)}</div>
                <div className="text-xs text-gray-600">Leave Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {calculateMonthsWorked(employee.joinDate)}
                </div>
                <div className="text-xs text-gray-600">Months</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="px-6 pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-medium">{employee.email || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Phone</div>
                        <div className="font-medium">{employee.phone || 'Not provided'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Location</div>
                        <div className="font-medium">{employee.location || 'Not provided'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      Work Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Manager</span>
                      <span className="font-medium">{employee.manager || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Join Date</span>
                      <span className="font-medium">
                        {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : 'Not specified'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Employee ID</span>
                      <span className="font-medium">{employee.employeeId || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Last Active</span>
                      <span className="font-medium">{employee.lastActive || 'Never'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Birth Date</span>
                      <span className="font-medium">
                        {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString() : 'Not provided'}
                      </span>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-gray-600 mb-1">Address</div>
                      <div className="font-medium">
                        {employee.address || 'Not provided'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Name</span>
                      <span className="font-medium">
                        {employee.emergencyContact?.name || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Relationship</span>
                      <span className="font-medium">
                        {employee.emergencyContact?.relationship || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-medium">
                        {employee.emergencyContact?.phone || 'Not provided'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills & Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills && employee.skills.length > 0 ? (
                      employee.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No skills listed</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${getPerformanceColor(safeNumber(employee.performance))}`}>
                              {safeNumber(employee.performance)}%
                            </div>
                            <div className="text-sm text-gray-600">Overall</div>
                          </div>
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <PerformanceIcon className={`w-8 h-8 ${getPerformanceColor(safeNumber(employee.performance))}`} />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Metrics</h3>
                    <p className="text-gray-600 mb-6">Detailed performance analytics and reviews will be displayed here.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">--</div>
                        <div className="text-sm text-gray-600">Goal Completion</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">--</div>
                        <div className="text-sm text-gray-600">Team Rating</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">--</div>
                        <div className="text-sm text-gray-600">Projects</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Attendance History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Attendance Records</h3>
                    <p className="text-gray-600 mb-6">Attendance history and patterns will be shown here.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">--</div>
                        <div className="text-sm text-gray-600">Attendance Rate</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">--</div>
                        <div className="text-sm text-gray-600">Avg Daily Hours</div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">--</div>
                        <div className="text-sm text-gray-600">Late Days</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">--</div>
                        <div className="text-sm text-gray-600">Absent Days</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Employee Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Management</h3>
                    <p className="text-gray-600 mb-6">Employee documents and files will be managed here.</p>
                    
                    {userRole === 'admin' && (
                      <Button variant="outline" className="mt-4">
                        <FileText className="w-4 h-4 mr-2" />
                        Upload Document
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
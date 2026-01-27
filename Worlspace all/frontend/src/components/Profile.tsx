import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User,
  Edit,
  Upload,
  Download,
  Calendar,
  Clock,
  FileText,
  Phone,
  Mail,
  MapPin,
  Shield,
  Camera,
  Save,
  Eye,
  Users,
  Target,
  Award,
  BookOpen
} from 'lucide-react';

interface ProfileProps {
  userRole: string;
}

export function Profile({ userRole }: ProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);

  // Sample employee data
  const employeeData = {
    id: 'EMP006',
    name: 'Mike Employee',
    email: 'mike.employee@company.com',
    phone: '+1 (555) 678-9012',
    role: 'Software Developer',
    department: 'Engineering',
    joinDate: '2023-06-01',
    location: 'Austin, TX',
    manager: 'Emily Davis',
    avatar: null,
    bio: 'Passionate software developer with 5+ years of experience in full-stack development. Love working with React, Node.js, and building user-friendly applications.',
    skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS'],
    emergencyContact: {
      name: 'Jane Employee',
      relationship: 'Spouse',
      phone: '+1 (555) 678-9013'
    }
  };

  const [formData, setFormData] = useState(employeeData);

  const leaveBalance = {
    annual: { used: 8, total: 20 },
    sick: { used: 2, total: 10 },
    personal: { used: 1, total: 5 }
  };

  const recentDocuments = [
    { name: 'Employment Contract.pdf', date: '2023-06-01', type: 'Contract' },
    { name: 'Performance Review 2023.pdf', date: '2023-12-15', type: 'Review' },
    { name: 'Salary Certificate.pdf', date: '2024-01-10', type: 'Certificate' }
  ];

  const timeOffHistory = [
    { type: 'Annual Leave', dates: 'Dec 20-25, 2023', status: 'Approved', days: 4 },
    { type: 'Sick Leave', dates: 'Nov 15, 2023', status: 'Approved', days: 1 },
    { type: 'Personal Leave', dates: 'Oct 10, 2023', status: 'Approved', days: 1 }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to API
    console.log('Saving profile data:', formData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(employeeData);
  };

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <User className="w-8 h-8" />
            My Profile
          </h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{formData.name}</h2>
                <Badge className="bg-blue-100 text-blue-700">{formData.id}</Badge>
              </div>
              <p className="text-lg text-gray-700 mb-1">{formData.role}</p>
              <p className="text-gray-600">{formData.department} • Joined {new Date(formData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>

            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto"
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Leave
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.name}</p>
                    )}
                  </div>
                  <div>
                    <Label>Employee ID</Label>
                    <p className="mt-1 text-gray-600">{formData.id}</p>
                  </div>
                </div>
                
                <div>
                  <Label>Email Address</Label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {formData.email}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label>Phone Number</Label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {formData.phone}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label>Location</Label>
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {formData.location}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label>Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-gray-700">{formData.bio}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Work Information */}
            <Card>
              <CardHeader>
                <CardTitle>Work Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Job Title</Label>
                  <p className="mt-1 text-gray-900">{formData.role}</p>
                </div>
                
                <div>
                  <Label>Department</Label>
                  <p className="mt-1 text-gray-900">{formData.department}</p>
                </div>
                
                <div>
                  <Label>Reporting Manager</Label>
                  <p className="mt-1 text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {formData.manager}
                  </p>
                </div>
                
                <div>
                  <Label>Join Date</Label>
                  <p className="mt-1 text-gray-900">
                    {new Date(formData.joinDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div>
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    {isEditing ? (
                      <Input
                        value={formData.emergencyContact.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          emergencyContact: {...prev.emergencyContact, name: e.target.value}
                        }))}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.emergencyContact.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Relationship</Label>
                    {isEditing ? (
                      <Input
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          emergencyContact: {...prev.emergencyContact, relationship: e.target.value}
                        }))}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.emergencyContact.relationship}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={formData.emergencyContact.phone}
                        onChange={(e) => setFormData(prev => ({
                          ...prev, 
                          emergencyContact: {...prev.emergencyContact, phone: e.target.value}
                        }))}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{formData.emergencyContact.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Leave Balance Tab */}
        <TabsContent value="leave" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Leave Balance */}
            <Card>
              <CardHeader>
                <CardTitle>Leave Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(leaveBalance).map(([type, balance]) => (
                  <div key={type} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium capitalize text-gray-900">{type} Leave</h4>
                      <span className="text-sm text-gray-600">
                        {balance.used}/{balance.total} days
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          type === 'annual' ? 'bg-blue-500' : 
                          type === 'sick' ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(balance.used / balance.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {balance.total - balance.used} days remaining
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Leave History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Leave History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeOffHistory.map((leave, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{leave.type}</h4>
                        <p className="text-sm text-gray-600">{leave.dates}</p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-700 mb-1">
                          {leave.status}
                        </Badge>
                        <p className="text-sm text-gray-600">{leave.days} day{leave.days > 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My Documents</CardTitle>
              <Button onClick={() => setShowDocumentUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.name}</h4>
                        <p className="text-sm text-gray-600">{doc.type} • {doc.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Data</h3>
                <p className="text-gray-600 mb-6">Your performance metrics and review history will appear here.</p>
                <p className="text-sm text-gray-500">Performance reviews are typically conducted quarterly and annually.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
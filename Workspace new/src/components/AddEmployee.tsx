import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  Users,
  AlertCircle,
  Check,
  Save,
  UserPlus,
  Star,
  Shield,
  Home,
  FileUser
} from 'lucide-react';

interface AddEmployeeProps {
  onBack: () => void;
  onSave: (employee: any) => void;
  organizationData: {
    departments: Array<{ id: number; name: string; description: string; head: string; active: boolean }>;
    locations: Array<{ id: number; name: string; address: string; timezone: string; active: boolean }>;
    jobTitles: Array<{ id: number; title: string; department: string; level: string; active: boolean }>;
    managers: Array<{ id: number; name: string; title: string; department: string }>;
  };
}

export function AddEmployee({ onBack, onSave, organizationData }: AddEmployeeProps) {
  // Debug log to check if component is rendering
  console.log('AddEmployee component loaded with data:', { 
    hasOrganizationData: !!organizationData,
    departments: organizationData?.departments?.length || 0,
    locations: organizationData?.locations?.length || 0,
    jobTitles: organizationData?.jobTitles?.length || 0
  });

  // Early return if no data provided
  if (!organizationData) {
    console.log('No organizationData provided, using fallback data');
  }
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
    // Employment Information
    employeeId: '',
    department: '',
    jobTitle: '',
    location: '',
    manager: '',
    startDate: '',
    employmentType: 'full-time',
    workSchedule: 'standard',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    
    // Skills and Additional Info
    skills: '',
    education: '',
    certifications: '',
    previousExperience: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Organizational data is now passed as props from App.tsx
  // Fallback data if organizationData is not provided or empty
  const fallbackOrganizationData = {
    departments: organizationData?.departments?.length ? organizationData.departments : [
      { id: 1, name: 'Engineering', description: 'Software development and technology', head: 'Engineering Manager', active: true },
      { id: 2, name: 'Design', description: 'User experience and interface design', head: 'Design Lead', active: true },
      { id: 3, name: 'Product', description: 'Product management and strategy', head: 'Product Manager', active: true },
      { id: 4, name: 'Marketing', description: 'Marketing and customer acquisition', head: 'Marketing Manager', active: true },
      { id: 5, name: 'Sales', description: 'Sales and business development', head: 'Sales Manager', active: true },
      { id: 6, name: 'HR', description: 'Human resources and people operations', head: 'HR Manager', active: true }
    ],
    locations: organizationData?.locations?.length ? organizationData.locations : [
      { id: 1, name: 'New York, NY', address: '123 Business Ave, New York, NY 10001', timezone: 'America/New_York', active: true },
      { id: 2, name: 'San Francisco, CA', address: '456 Tech St, San Francisco, CA 94105', timezone: 'America/Los_Angeles', active: true },
      { id: 3, name: 'Remote', address: 'Work from anywhere', timezone: 'America/New_York', active: true }
    ],
    jobTitles: organizationData?.jobTitles?.length ? organizationData.jobTitles : [
      { id: 1, title: 'Software Engineer', department: 'Engineering', level: 'Mid', active: true },
      { id: 2, title: 'Senior Software Engineer', department: 'Engineering', level: 'Senior', active: true },
      { id: 3, title: 'UI/UX Designer', department: 'Design', level: 'Mid', active: true },
      { id: 4, title: 'Product Manager', department: 'Product', level: 'Senior', active: true },
      { id: 5, title: 'Marketing Specialist', department: 'Marketing', level: 'Mid', active: true },
      { id: 6, title: 'HR Specialist', department: 'HR', level: 'Mid', active: true }
    ],
    managers: organizationData?.managers?.length ? organizationData.managers : [
      { id: 1, name: 'Engineering Manager', title: 'Engineering Manager', department: 'Engineering' },
      { id: 2, name: 'Design Lead', title: 'Design Lead', department: 'Design' },
      { id: 3, name: 'Product Manager', title: 'Product Manager', department: 'Product' },
      { id: 4, name: 'Marketing Manager', title: 'Marketing Manager', department: 'Marketing' },
      { id: 5, name: 'HR Manager', title: 'HR Manager', department: 'HR' }
    ]
  };

  // Use fallback data if needed
  const orgData = fallbackOrganizationData;

  const employmentTypes = [
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'intern', label: 'Intern' },
    { value: 'temporary', label: 'Temporary' }
  ];

  const workSchedules = [
    { value: 'standard', label: 'Standard (9 AM - 5 PM)' },
    { value: 'flexible', label: 'Flexible Hours' },
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'shift', label: 'Shift Work' }
  ];

  const relationships = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'child', label: 'Child' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'friend', label: 'Friend' },
    { value: 'relative', label: 'Relative' },
    { value: 'other', label: 'Other' }
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;

      case 2: // Employment Information
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        break;

      case 3: // Emergency Contact
        if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
        if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';
        if (!formData.emergencyContactRelationship) newErrors.emergencyContactRelationship = 'Relationship is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    if (validateStep(currentStep)) {
      // Generate employee ID
      const employeeId = `EMP${String(Math.floor(Math.random() * 9000) + 1000)}`;
      
      const employee = {
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        avatar: `${formData.firstName[0]}${formData.lastName[0]}`,
        email: formData.email,
        phone: formData.phone,
        role: formData.jobTitle,
        department: formData.department,
        status: 'active',
        joinDate: formData.startDate,
        location: formData.location,
        manager: formData.manager,
        employeeId,
        lastActive: 'Just now',
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        performance: 85,
        leaveBalance: 20,
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phone: formData.emergencyContactPhone,
          email: formData.emergencyContactEmail
        },
        address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        birthDate: formData.birthDate,
        employmentType: formData.employmentType,
        workSchedule: formData.workSchedule
      };

      onSave(employee);
    }
  };

  const getAvailableJobTitles = () => {
    if (!formData.department) return [];
    return orgData.jobTitles.filter(job => 
      job.active && job.department === formData.department
    );
  };

  const getAvailableManagers = () => {
    if (!formData.department) return orgData.managers;
    return orgData.managers.filter(manager => 
      manager.department === formData.department || manager.department === 'HR'
    );
  };

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Employment Details', icon: Briefcase },
    { number: 3, title: 'Emergency Contact', icon: Shield },
    { number: 4, title: 'Additional Information', icon: FileUser }
  ];

  return (
    <div className="container-mobile py-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <UserPlus className="w-8 h-8" />
            Add New Employee
          </h1>
          <p className="text-gray-600">Create a comprehensive employee profile</p>
        </div>
        
        {/* Debug Panel - Temporary */}
        <div className="hidden lg:block text-xs bg-green-50 p-3 rounded border border-green-200">
          <div className="font-semibold text-green-800 mb-1">✅ Form Ready</div>
          <div className="text-green-700">Step: {currentStep}/4</div>
          <div className="text-green-700">Departments: {orgData.departments.length}</div>
          <div className="text-green-700">Locations: {orgData.locations.length}</div>
          <div className="text-green-700">Job Titles: {orgData.jobTitles.length}</div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center gap-3 ${index < steps.length - 1 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <div className={`font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>
                      Step {step.number}
                    </div>
                    <div className={`text-sm ${currentStep >= step.number ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`hidden lg:block w-full h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {(() => {
              const IconComponent = steps[currentStep - 1].icon;
              return <IconComponent className="w-5 h-5" />;
            })()}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="employee@company.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateFormData('birthDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="NY"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Employment Information */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => {
                      updateFormData('department', value);
                      // Clear job title when department changes
                      updateFormData('jobTitle', '');
                    }}
                  >
                    <SelectTrigger className={errors.department ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgData.departments.filter(dept => dept.active).map(dept => (
                        <SelectItem key={dept.id} value={dept.name}>
                          <div className="flex flex-col">
                            <span>{dept.name}</span>
                            <span className="text-xs text-gray-500">{dept.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.department}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Select 
                    value={formData.jobTitle} 
                    onValueChange={(value) => updateFormData('jobTitle', value)}
                    disabled={!formData.department}
                  >
                    <SelectTrigger className={errors.jobTitle ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select job title" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableJobTitles().map(job => (
                        <SelectItem key={job.id} value={job.title}>
                          <div className="flex items-center gap-2">
                            <span>{job.title}</span>
                            <Badge variant="secondary" className="text-xs">{job.level}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jobTitle && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.jobTitle}
                    </p>
                  )}
                  {!formData.department && (
                    <p className="text-gray-500 text-sm mt-1">Select a department first</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Work Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                    <SelectTrigger className={errors.location ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select work location" />
                    </SelectTrigger>
                    <SelectContent>
                      {orgData.locations.filter(loc => loc.active).map(location => (
                        <SelectItem key={location.id} value={location.name}>
                          <div className="flex flex-col">
                            <span>{location.name}</span>
                            <span className="text-xs text-gray-500">{location.address}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="manager">Reporting Manager</Label>
                  <Select value={formData.manager} onValueChange={(value) => updateFormData('manager', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reporting manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableManagers().map(manager => (
                        <SelectItem key={manager.id} value={manager.name}>
                          <div className="flex flex-col">
                            <span>{manager.name}</span>
                            <span className="text-xs text-gray-500">{manager.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select value={formData.employmentType} onValueChange={(value) => updateFormData('employmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="workSchedule">Work Schedule</Label>
                  <Select value={formData.workSchedule} onValueChange={(value) => updateFormData('workSchedule', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {workSchedules.map(schedule => (
                        <SelectItem key={schedule.value} value={schedule.value}>
                          {schedule.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                    placeholder="Contact person name"
                    className={errors.emergencyContactName ? 'border-red-500' : ''}
                  />
                  {errors.emergencyContactName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContactName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactRelationship">Relationship *</Label>
                  <Select 
                    value={formData.emergencyContactRelationship} 
                    onValueChange={(value) => updateFormData('emergencyContactRelationship', value)}
                  >
                    <SelectTrigger className={errors.emergencyContactRelationship ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map(rel => (
                        <SelectItem key={rel.value} value={rel.value}>
                          {rel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.emergencyContactRelationship && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContactRelationship}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => updateFormData('emergencyContactPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={errors.emergencyContactPhone ? 'border-red-500' : ''}
                  />
                  {errors.emergencyContactPhone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.emergencyContactPhone}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="emergencyContactEmail">Emergency Contact Email</Label>
                  <Input
                    id="emergencyContactEmail"
                    type="email"
                    value={formData.emergencyContactEmail}
                    onChange={(e) => updateFormData('emergencyContactEmail', e.target.value)}
                    placeholder="emergency@contact.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <Label htmlFor="skills">Skills & Competencies</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => updateFormData('skills', e.target.value)}
                    placeholder="Enter skills separated by commas (e.g., React, TypeScript, Node.js)"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate multiple skills with commas</p>
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    value={formData.education}
                    onChange={(e) => updateFormData('education', e.target.value)}
                    placeholder="Educational background and qualifications"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => updateFormData('certifications', e.target.value)}
                    placeholder="Professional certifications and licenses"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="previousExperience">Previous Experience</Label>
                  <Textarea
                    id="previousExperience"
                    value={formData.previousExperience}
                    onChange={(e) => updateFormData('previousExperience', e.target.value)}
                    placeholder="Brief overview of relevant work experience"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateFormData('notes', e.target.value)}
                    placeholder="Any additional information or special considerations"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex items-center gap-2"
              >
                Cancel
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                  Create Employee
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}